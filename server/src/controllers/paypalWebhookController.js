'use strict';

const pool = require('../config/db');
const { upsertSubscription, findHostBySubscriptionId } = require('../services/billingService');
const { extractHostUserId, planIdToPlanLevel } = require('../services/paypalService');

// Log every inbound event to billing_events for audit trail
async function logEvent(hostUserId, eventType, providerEventId, payload, processedStatus, errorMessage) {
  try {
    await pool.execute(
      `INSERT INTO billing_events
         (host_user_id, provider, event_type, provider_event_id, payload_json, processed_status, error_message)
       VALUES (?, 'paypal', ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         processed_status = VALUES(processed_status),
         error_message    = VALUES(error_message)`,
      [
        hostUserId   || null,
        eventType    || 'UNKNOWN',
        providerEventId || null,
        JSON.stringify(payload),
        processedStatus,
        errorMessage || null,
      ]
    );
  } catch (logErr) {
    // Never let logging failure break the webhook
    console.error('[paypalWebhook] Failed to log billing event:', logErr.message);
  }
}

// POST /api/paypal/webhook  — PUBLIC, no JWT
async function handlePaypalWebhook(req, res) {
  // Always return 200 to PayPal immediately, process async
  res.status(200).json({ ok: true });

  const payload    = req.body;
  const eventType  = payload && payload.event_type;
  const eventId    = payload && payload.id;
  const resource   = payload && payload.resource;

  if (!eventType || !resource) {
    console.warn('[paypalWebhook] Received malformed webhook, missing event_type or resource');
    return;
  }

  let hostUserId = null;

  try {
    // Try to resolve host from custom_id first
    const customId = resource.custom_id || (resource.subscriber && resource.subscriber.custom_id);
    if (customId) {
      hostUserId = extractHostUserId({ custom_id: customId });
    }

    // Fall back to subscription ID lookup
    if (!hostUserId) {
      const subId = resource.id || resource.billing_agreement_id;
      if (subId) {
        const row = await findHostBySubscriptionId(subId);
        if (row) hostUserId = row.host_user_id;
      }
    }

    const planId    = resource.plan_id;
    const planLevel = planId ? planIdToPlanLevel(planId) : null;
    const subId     = resource.id;
    const nextBilling = resource.billing_info && resource.billing_info.next_billing_time
      ? new Date(resource.billing_info.next_billing_time)
      : null;

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.APPROVED':
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        if (hostUserId && subId && planLevel) {
          await upsertSubscription({
            hostUserId,
            provider:               'paypal',
            providerSubscriptionId: subId,
            providerPlanId:         planId,
            planLevel,
            status:                 'active',
            renewsAt:               nextBilling,
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.UPDATED': {
        if (hostUserId && subId) {
          await upsertSubscription({
            hostUserId,
            provider:               'paypal',
            providerSubscriptionId: subId,
            providerPlanId:         planId,
            planLevel:              planLevel || 'level2',
            status:                 'active',
            renewsAt:               nextBilling,
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        if (hostUserId && subId) {
          await upsertSubscription({
            hostUserId,
            provider:               'paypal',
            providerSubscriptionId: subId,
            providerPlanId:         planId,
            planLevel:              planLevel || 'level2',
            status:                 'cancelled',
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        if (hostUserId && subId) {
          await upsertSubscription({
            hostUserId,
            provider:               'paypal',
            providerSubscriptionId: subId,
            providerPlanId:         planId,
            planLevel:              planLevel || 'level2',
            status:                 'suspended',
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        if (hostUserId && subId) {
          await upsertSubscription({
            hostUserId,
            provider:               'paypal',
            providerSubscriptionId: subId,
            providerPlanId:         planId,
            planLevel:              planLevel || 'level2',
            status:                 'expired',
          });
        }
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        // Renewal payment — confirm subscription is still active
        const billingAgreementId = resource.billing_agreement_id;
        if (hostUserId && billingAgreementId) {
          const row = await findHostBySubscriptionId(billingAgreementId);
          if (row && row.status !== 'active') {
            await upsertSubscription({
              hostUserId,
              provider:               'paypal',
              providerSubscriptionId: billingAgreementId,
              providerPlanId:         row.provider_plan_id,
              planLevel:              planIdToPlanLevel(row.provider_plan_id) || 'level2',
              status:                 'active',
            });
          }
        }
        break;
      }

      default:
        console.log(`[paypalWebhook] Unhandled event type: ${eventType}`);
    }

    await logEvent(hostUserId, eventType, eventId, payload, 'ok', null);
  } catch (err) {
    console.error('[paypalWebhook] Error processing event:', err.message);
    await logEvent(hostUserId, eventType, eventId, payload, 'error', err.message);
  }
}

module.exports = { handlePaypalWebhook };
