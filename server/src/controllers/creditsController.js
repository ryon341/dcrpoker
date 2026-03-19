'use strict';

const { ok, badRequest, serverError } = require('../utils/respond');
const { getHostCreditBalanceCents, getHostCreditTransactions, addCreditTransaction } =
  require('../services/creditsService');

// GET /api/my/credits
async function getCredits(req, res) {
  const hostUserId = req.user.id;
  try {
    const [balanceCents, transactions] = await Promise.all([
      getHostCreditBalanceCents(hostUserId),
      getHostCreditTransactions(hostUserId, 50),
    ]);
    return ok(res, { balanceCents, transactions });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/credits/test-grant
// NOTE: Dev/test-only endpoint. Remove or gate behind admin role before production.
async function testGrantCredit(req, res) {
  const hostUserId   = req.user.id;
  const { amount_cents, description } = req.body;

  if (!amount_cents || typeof amount_cents !== 'number' || amount_cents <= 0) {
    return badRequest(res, 'amount_cents must be a positive integer');
  }

  try {
    const txId = await addCreditTransaction({
      hostUserId,
      type:        'manual_credit',
      amountCents: Math.round(amount_cents),
      description: description || 'Test credit grant',
    });
    const newBalance = await getHostCreditBalanceCents(hostUserId);
    return ok(res, { transactionId: txId, newBalanceCents: newBalance });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { getCredits, testGrantCredit };
