'use strict';

const { ok, badRequest, serverError } = require('../utils/respond');
const { getOrCreateReferralCode, applyReferralCode, getReferralSummary } =
  require('../services/referralService');

// GET /api/my/referrals
async function getReferrals(req, res) {
  const hostUserId = req.user.id;
  try {
    const [referralCode, summaryData] = await Promise.all([
      getOrCreateReferralCode(hostUserId),
      getReferralSummary(hostUserId),
    ]);
    return ok(res, { referralCode, ...summaryData });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/referrals/apply
async function applyReferral(req, res) {
  const hostUserId = req.user.id;
  const { referralCode } = req.body;

  if (!referralCode || typeof referralCode !== 'string' || !referralCode.trim()) {
    return badRequest(res, 'referralCode is required');
  }

  try {
    const result = await applyReferralCode(hostUserId, referralCode.trim().toUpperCase());
    return ok(res, result, 201);
  } catch (err) {
    const status = err.status || 500;
    if (status === 400 || status === 404 || status === 409) {
      return res.status(status).json({ ok: false, error: err.message });
    }
    return serverError(res, err);
  }
}

module.exports = { getReferrals, applyReferral };
