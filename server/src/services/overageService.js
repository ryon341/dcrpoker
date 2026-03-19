'use strict';

const pool = require('../config/db');
const { getHostPlan, getSmsUsageThisMonth } = require('./billingService');
const { getHostCreditBalanceCents } = require('./creditsService');

const OVERAGE_RATE_CENTS = 2; // $0.02 per message = 2 cents

/**
 * Calculate overage for a host for a given year/month.
 * Does NOT write to the database.
 */
async function calculateMonthlyOverage(hostUserId, year, month) {
  const plan = await getHostPlan(hostUserId);
  const includedMessages = plan.smsMonthlyLimit || 0;

  // Get actual SMS usage for the specific month
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
  // Last day = first day of NEXT month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;
  const lastDay   = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01 00:00:00`;

  const [usageRows] = await pool.execute(
    `SELECT COUNT(*) AS sent
       FROM sms_usage
      WHERE host_user_id = ? AND sent_at >= ? AND sent_at < ?`,
    [hostUserId, firstDay, lastDay]
  );
  const messagesSent = Number(usageRows[0].sent);

  const overageMessages     = Math.max(messagesSent - includedMessages, 0);
  const overageAmountCents  = overageMessages * OVERAGE_RATE_CENTS;
  const creditBalanceCents  = await getHostCreditBalanceCents(hostUserId);
  const creditsAppliedCents = Math.min(creditBalanceCents, overageAmountCents);
  const netAmountCents      = Math.max(overageAmountCents - creditsAppliedCents, 0);

  return {
    includedMessages,
    messagesSent,
    overageMessages,
    overageAmountCents,
    creditBalanceCents,
    creditsAppliedCents,
    netAmountCents,
  };
}

/**
 * Calculate and upsert the monthly overage ledger row.
 * Returns the full ledger entry including the db status.
 */
async function upsertMonthlyOverageLedger(hostUserId, year, month) {
  const calc = await calculateMonthlyOverage(hostUserId, year, month);

  await pool.execute(
    `INSERT INTO host_overage_ledger
       (host_user_id, year, month,
        included_messages, messages_sent,
        overage_messages, overage_amount_cents,
        credits_applied_cents, net_amount_cents,
        status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
     ON DUPLICATE KEY UPDATE
       included_messages     = VALUES(included_messages),
       messages_sent         = VALUES(messages_sent),
       overage_messages      = VALUES(overage_messages),
       overage_amount_cents  = VALUES(overage_amount_cents),
       credits_applied_cents = VALUES(credits_applied_cents),
       net_amount_cents      = VALUES(net_amount_cents),
       -- only update status if still 'open' — don't overwrite reviewed/closed/waived
       status = IF(status = 'open', 'open', status),
       updated_at = NOW()`,
    [
      hostUserId, year, month,
      calc.includedMessages, calc.messagesSent,
      calc.overageMessages, calc.overageAmountCents,
      calc.creditsAppliedCents, calc.netAmountCents,
    ]
  );

  // Fetch the persisted row to get the status (may not be 'open' if reviewed)
  const [rows] = await pool.execute(
    `SELECT status FROM host_overage_ledger
      WHERE host_user_id = ? AND year = ? AND month = ?`,
    [hostUserId, year, month]
  );

  return {
    year,
    month,
    ...calc,
    status: (rows[0] && rows[0].status) || 'open',
  };
}

module.exports = { calculateMonthlyOverage, upsertMonthlyOverageLedger, OVERAGE_RATE_CENTS };
