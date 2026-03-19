'use strict';

/**
 * paypalService.js
 *
 * Minimal PayPal REST API integration (no SDK dependency).
 * Supports both sandbox and live environments via PAYPAL_ENV env var.
 *
 * Credentials must be set in .env:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_ENV         (sandbox | live)
 *   PAYPAL_WEBHOOK_ID
 */

const BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

let _accessToken   = null;
let _tokenExpires  = 0; // epoch ms

/**
 * Obtain (or reuse cached) OAuth2 client-credentials token.
 */
async function getAccessToken() {
  if (_accessToken && Date.now() < _tokenExpires - 30_000) return _accessToken;

  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)');
  }

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res   = await fetch(`${BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal token fetch failed: ${res.status} ${err}`);
  }

  const data       = await res.json();
  _accessToken     = data.access_token;
  _tokenExpires    = Date.now() + (data.expires_in || 3600) * 1000;
  return _accessToken;
}

/**
 * Create a PayPal subscription for the given plan ID.
 *
 * @param {string} planId          - PAYPAL_PLAN_LEVEL2_ID or PAYPAL_PLAN_LEVEL3_ID
 * @param {string} returnUrl       - where PayPal redirects after approval
 * @param {string} cancelUrl       - where PayPal redirects on cancel
 * @param {object} customData      - optional custom_id metadata (e.g. { hostUserId })
 * @returns {{ subscriptionId: string, approvalUrl: string }}
 */
async function createSubscription(planId, returnUrl, cancelUrl, customData = {}) {
  const token = await getAccessToken();

  const body = {
    plan_id:   planId,
    custom_id: JSON.stringify(customData),
    application_context: {
      brand_name:          'DCR Poker',
      locale:              'en-US',
      shipping_preference: 'NO_SHIPPING',
      user_action:         'SUBSCRIBE_NOW',
      payment_method: {
        payer_selected:   'PAYPAL',
        payee_preferred:  'IMMEDIATE_PAYMENT_REQUIRED',
      },
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  const res = await fetch(`${BASE}/v1/billing/subscriptions`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
      'Prefer':       'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal createSubscription failed: ${res.status} ${err}`);
  }

  const data       = await res.json();
  const approvalUrl = (data.links || []).find(l => l.rel === 'approve')?.href;

  return {
    subscriptionId: data.id,
    approvalUrl:    approvalUrl || null,
    status:         data.status,
    raw:            data,
  };
}

/**
 * Fetch details of an existing subscription.
 *
 * @param {string} subscriptionId
 */
async function getSubscription(subscriptionId) {
  const token = await getAccessToken();

  const res = await fetch(`${BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal getSubscription failed: ${res.status} ${err}`);
  }

  return res.json();
}

/**
 * Cancel a subscription immediately.
 *
 * @param {string} subscriptionId
 * @param {string} reason
 */
async function cancelSubscription(subscriptionId, reason = 'User requested cancellation') {
  const token = await getAccessToken();

  const res = await fetch(`${BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  // PayPal returns 204 No Content on success
  if (res.status !== 204 && !res.ok) {
    const err = await res.text();
    throw new Error(`PayPal cancelSubscription failed: ${res.status} ${err}`);
  }

  return true;
}

/**
 * Extract the host user ID stored in custom_id during subscription creation.
 * Returns null if not parseable.
 *
 * @param {object} subscriptionData - raw PayPal subscription object
 */
function extractHostUserId(subscriptionData) {
  try {
    const raw = subscriptionData.custom_id || subscriptionData.subscriber?.custom_id;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.hostUserId || null;
  } catch {
    return null;
  }
}

/**
 * Map a PayPal plan ID from the subscription to our plan_level string.
 *
 * @param {string} planId
 * @returns {'level1'|'level2'|'level3'}
 */
function planIdToPlanLevel(planId) {
  if (planId === process.env.PAYPAL_PLAN_LEVEL2_ID) return 'level2';
  if (planId === process.env.PAYPAL_PLAN_LEVEL3_ID) return 'level3';
  return 'level1';
}

module.exports = {
  getAccessToken,
  createSubscription,
  getSubscription,
  cancelSubscription,
  extractHostUserId,
  planIdToPlanLevel,
};
