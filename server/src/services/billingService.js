'use strict';

const pool = require('../config/db');

/**
 * billingService.js
 *
 * Resolves a host's effective billing plan and feature set.
 * Uses host_subscriptions as the canonical source; falls back to users.plan_level.
 */

const PLAN_DEFAULTS = {
  level1: {
    planLevel:       'level1',
    smsMonthlyLimit: 0,
    canSendSms:      false,
    canReceiveSms:   false,
    canUseSeatTools: false,
    batchLimit:      10,
  },
  level2: {
    planLevel:       'level2',
    smsMonthlyLimit: 500,
    canSendSms:      true,
    canReceiveSms:   false,
    canUseSeatTools: false,
    batchLimit:      null,
  },
  level3: {
    planLevel:       'level3',
    smsMonthlyLimit: 1000,
    canSendSms:      true,
    canReceiveSms:   true,
    canUseSeatTools: true,
    batchLimit:      null,
  },
};

/**
 * Get the current month's SMS usage for a host.
 *
 * @param {number} hostUserId
 * @returns {{ sent: number, limit: number, overage: number }}
 */
async function getSmsUsageThisMonth(hostUserId, limit) {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;

  const [rows] = await pool.execute(
    'SELECT messages_sent FROM sms_usage WHERE host_user_id = ? AND year = ? AND month = ?',
    [hostUserId, year, month]
  );

  const sent    = rows[0] ? rows[0].messages_sent : 0;
  const overage = limit > 0 ? Math.max(0, sent - limit) : 0;

  return { sent, limit, overage };
}

/**
 * Resolve the effective plan for a host.
 * Checks host_subscriptions first (active row), then falls back to users.plan_level.
 *
 * @param {number} hostUserId
 * @returns {{ planLevel, status, subscriptions row or null, ...feature flags }}
 */
async function getHostPlan(hostUserId) {
  // 1. Look for an active/pending subscription row
  const [subRows] = await pool.execute(
    `SELECT * FROM host_subscriptions
     WHERE host_user_id = ? AND status IN ('active','pending')
     ORDER BY id DESC LIMIT 1`,
    [hostUserId]
  );

  let planLevel        = 'level1';
  let subscriptionRow  = null;
  let subscriptionStatus = 'none';

  if (subRows.length) {
    subscriptionRow    = subRows[0];
    planLevel          = subscriptionRow.plan_level || 'level1';
    subscriptionStatus = subscriptionRow.status;
  } else {
    // Fall back to users.plan_level for backward compatibility
    const [userRows] = await pool.execute(
      'SELECT plan_level FROM users WHERE id = ?',
      [hostUserId]
    );
    if (userRows.length && userRows[0].plan_level) {
      planLevel = `level${userRows[0].plan_level}`; // users stores 1/2/3
    }
  }

  const features = PLAN_DEFAULTS[planLevel] || PLAN_DEFAULTS.level1;

  return {
    ...features,
    subscriptionStatus,
    subscriptionRow,
  };
}

/**
 * Find a host user ID from a PayPal subscription ID (lookup via host_subscriptions).
 *
 * @param {string} providerSubscriptionId
 * @returns {number|null}
 */
async function findHostBySubscriptionId(providerSubscriptionId) {
  const [rows] = await pool.execute(
    'SELECT host_user_id FROM host_subscriptions WHERE provider_subscription_id = ? LIMIT 1',
    [providerSubscriptionId]
  );
  return rows[0] ? rows[0].host_user_id : null;
}

/**
 * Upsert the active subscription row for a host.
 * Deactivates any previous active row and inserts/updates the new state.
 *
 * @param {object} opts
 * @param {number} opts.hostUserId
 * @param {string} opts.providerSubscriptionId
 * @param {string} opts.providerPlanId
 * @param {string} opts.planLevel
 * @param {string} opts.status
 * @param {Date|null} opts.startedAt
 * @param {Date|null} opts.renewsAt
 * @param {Date|null} opts.cancelledAt
 */
async function upsertSubscription({
  hostUserId,
  providerSubscriptionId,
  providerPlanId,
  planLevel,
  status,
  startedAt     = null,
  renewsAt      = null,
  cancelledAt   = null,
}) {
  // Check if a row already exists for this provider subscription ID
  const [existing] = await pool.execute(
    'SELECT id FROM host_subscriptions WHERE provider_subscription_id = ? LIMIT 1',
    [providerSubscriptionId]
  );

  if (existing.length) {
    await pool.execute(
      `UPDATE host_subscriptions
       SET plan_level = ?, status = ?, provider_plan_id = ?,
           started_at = COALESCE(?, started_at),
           renews_at  = ?,
           cancelled_at = ?
       WHERE provider_subscription_id = ?`,
      [planLevel, status, providerPlanId, startedAt, renewsAt, cancelledAt, providerSubscriptionId]
    );
  } else {
    // Deactivate old active rows
    await pool.execute(
      `UPDATE host_subscriptions SET status = 'cancelled'
       WHERE host_user_id = ? AND status IN ('active','pending')`,
      [hostUserId]
    );

    await pool.execute(
      `INSERT INTO host_subscriptions
         (host_user_id, provider, provider_subscription_id, provider_plan_id,
          plan_level, status, started_at, renews_at, cancelled_at)
       VALUES (?, 'paypal', ?, ?, ?, ?, ?, ?, ?)`,
      [hostUserId, providerSubscriptionId, providerPlanId, planLevel, status,
       startedAt, renewsAt, cancelledAt]
    );
  }

  // Keep users.plan_level in sync for backward-compat with existing middleware
  if (['active', 'pending'].includes(status)) {
    const numericLevel = planLevel === 'level3' ? 3 : planLevel === 'level2' ? 2 : 1;
    await pool.execute(
      'UPDATE users SET plan_level = ? WHERE id = ?',
      [numericLevel, hostUserId]
    );
  } else if (['cancelled', 'expired', 'suspended'].includes(status)) {
    await pool.execute('UPDATE users SET plan_level = 1 WHERE id = ?', [hostUserId]);
  }
}

module.exports = {
  getHostPlan,
  getSmsUsageThisMonth,
  findHostBySubscriptionId,
  upsertSubscription,
  PLAN_DEFAULTS,
};
