'use strict';

const { ok, badRequest, serverError } = require('../utils/respond');
const { getHostPlan, getSmsUsageThisMonth } = require('../services/billingService');
const { createSubscription, cancelSubscription } = require('../services/paypalService');
const { getHostCreditBalanceCents } = require('../services/creditsService');
const { upsertMonthlyOverageLedger } = require('../services/overageService');

const PLAN_IDS = {
  level2: () => process.env.PAYPAL_PLAN_LEVEL2_ID,
  level3: () => process.env.PAYPAL_PLAN_LEVEL3_ID,
};

// GET /api/my/billing
async function getBillingStatus(req, res) {
  const hostUserId = req.user.id;

  try {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    const [plan, overage, creditBalance] = await Promise.all([
      getHostPlan(hostUserId),
      upsertMonthlyOverageLedger(hostUserId, year, month).catch(() => null),
      getHostCreditBalanceCents(hostUserId),
    ]);
    const usage = await getSmsUsageThisMonth(hostUserId, plan.smsMonthlyLimit);

    return ok(res, {
      planLevel:          plan.planLevel,
      subscriptionStatus: plan.subscriptionStatus,
      smsUsage:           usage.sent,
      smsLimit:           plan.smsMonthlyLimit,
      smsOverage:         usage.overage,
      // overage / credit accounting
      overageMessages:      overage ? overage.overageMessages      : 0,
      overageAmountCents:   overage ? overage.overageAmountCents   : 0,
      creditBalanceCents:   creditBalance,
      creditsAppliedCents:  overage ? overage.creditsAppliedCents  : 0,
      netAmountCents:       overage ? overage.netAmountCents        : 0,
      features: {
        canSendSms:      plan.canSendSms,
        canReceiveSms:   plan.canReceiveSms,
        canUseSeatTools: plan.canUseSeatTools,
        batchLimit:      plan.batchLimit,
      },
      subscription: plan.subscriptionRow ? {
        providerSubscriptionId: plan.subscriptionRow.provider_subscription_id,
        providerPlanId:         plan.subscriptionRow.provider_plan_id,
        startedAt:              plan.subscriptionRow.started_at,
        renewsAt:               plan.subscriptionRow.renews_at,
        cancelledAt:            plan.subscriptionRow.cancelled_at,
      } : null,
    });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/billing/subscribe
async function createSubscriptionCheckout(req, res) {
  const hostUserId = req.user.id;
  const { planLevel } = req.body;

  if (!['level2', 'level3'].includes(planLevel)) {
    return badRequest(res, 'planLevel must be level2 or level3');
  }

  const planId = PLAN_IDS[planLevel]();
  if (!planId) {
    return badRequest(res, `PayPal plan ID not configured for ${planLevel}. Set PAYPAL_PLAN_LEVEL2_ID or PAYPAL_PLAN_LEVEL3_ID in .env`);
  }

  const webBaseUrl = process.env.WEB_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:8081';
  const returnUrl  = `${webBaseUrl}/(protected)/account/billing?paypal=success&plan=${planLevel}`;
  const cancelUrl  = `${webBaseUrl}/(protected)/account/billing?paypal=cancelled`;

  try {
    const result = await createSubscription(planId, returnUrl, cancelUrl, { hostUserId });

    return ok(res, {
      planLevel,
      subscriptionId: result.subscriptionId,
      approvalUrl:    result.approvalUrl,
    });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/billing/cancel
async function cancelCurrentSubscription(req, res) {
  const hostUserId = req.user.id;

  try {
    const plan = await getHostPlan(hostUserId);

    if (!plan.subscriptionRow || !plan.subscriptionRow.provider_subscription_id) {
      return badRequest(res, 'No active subscription found');
    }

    const subId = plan.subscriptionRow.provider_subscription_id;

    await cancelSubscription(subId, 'Host requested cancellation');

    // Mark locally as cancelled
    const pool = require('../config/db');
    await pool.execute(
      `UPDATE host_subscriptions SET status = 'cancelled', cancelled_at = NOW()
       WHERE provider_subscription_id = ?`,
      [subId]
    );
    await pool.execute('UPDATE users SET plan_level = 1 WHERE id = ?', [hostUserId]);

    return ok(res, { cancelled: true, subscriptionId: subId });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/billing/overage
async function getOverage(req, res) {
  const hostUserId = req.user.id;
  try {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;
    const ledger = await upsertMonthlyOverageLedger(hostUserId, year, month);
    return ok(res, ledger);
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { getBillingStatus, createSubscriptionCheckout, cancelCurrentSubscription, getOverage };
