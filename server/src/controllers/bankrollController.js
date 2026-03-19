'use strict';

const { ok, badRequest, notFound, serverError } = require('../utils/respond');
const {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  createAdjustment,
  listAdjustments,
  getBankrollSummary,
  getTrendData,
} = require('../services/bankrollService');

// ─── Sessions ─────────────────────────────────────────────────────────────────

// POST /api/my/bankroll/sessions
async function postSession(req, res) {
  const userId = req.user.id;
  const {
    played_at,
    game_type,
    stakes_label,
    location_name,
    buy_in_amount_cents,
    cash_out_amount_cents,
    hours_played_decimal,
    notes,
  } = req.body;

  if (!played_at)                      return badRequest(res, 'played_at is required');
  if (buy_in_amount_cents  == null)    return badRequest(res, 'buy_in_amount_cents is required');
  if (cash_out_amount_cents == null)   return badRequest(res, 'cash_out_amount_cents is required');
  if (hours_played_decimal == null)    return badRequest(res, 'hours_played_decimal is required');

  if (typeof buy_in_amount_cents !== 'number')   return badRequest(res, 'buy_in_amount_cents must be a number');
  if (typeof cash_out_amount_cents !== 'number') return badRequest(res, 'cash_out_amount_cents must be a number');
  if (typeof hours_played_decimal !== 'number')  return badRequest(res, 'hours_played_decimal must be a number');

  try {
    const session = await createSession(userId, {
      played_at,
      game_type,
      stakes_label,
      location_name,
      buy_in_amount_cents:   Math.round(buy_in_amount_cents),
      cash_out_amount_cents: Math.round(cash_out_amount_cents),
      hours_played_decimal,
      notes,
    });
    return ok(res, session, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/bankroll/sessions
async function getSessions(req, res) {
  const userId = req.user.id;
  const { game_type, from, to } = req.query;
  try {
    const sessions = await listSessions(userId, { game_type, from, to });
    return ok(res, sessions);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/bankroll/sessions/:id
async function getSession(req, res) {
  const userId    = req.user.id;
  const sessionId = Number(req.params.id);
  try {
    const session = await getSessionById(userId, sessionId);
    if (!session) return notFound(res, 'Session not found');
    return ok(res, session);
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/bankroll/sessions/:id
async function patchSession(req, res) {
  const userId    = req.user.id;
  const sessionId = Number(req.params.id);
  try {
    const updated = await updateSession(userId, sessionId, req.body);
    if (!updated) return notFound(res, 'Session not found');
    return ok(res, updated);
  } catch (err) {
    return serverError(res, err);
  }
}

// DELETE /api/my/bankroll/sessions/:id
async function destroySession(req, res) {
  const userId    = req.user.id;
  const sessionId = Number(req.params.id);
  try {
    const deleted = await deleteSession(userId, sessionId);
    if (!deleted) return notFound(res, 'Session not found');
    return ok(res, { deleted: true });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── Adjustments ──────────────────────────────────────────────────────────────

// POST /api/my/bankroll/adjustments
async function postAdjustment(req, res) {
  const userId = req.user.id;
  const { amount_cents, adjustment_type, description } = req.body;

  if (amount_cents == null)                return badRequest(res, 'amount_cents is required');
  if (typeof amount_cents !== 'number')    return badRequest(res, 'amount_cents must be a number');

  try {
    const adjustment = await createAdjustment(userId, {
      amount_cents: Math.round(amount_cents),
      adjustment_type,
      description,
    });
    return ok(res, adjustment, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/bankroll/adjustments
async function getAdjustments(req, res) {
  const userId = req.user.id;
  try {
    const adjustments = await listAdjustments(userId);
    return ok(res, adjustments);
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

// GET /api/my/bankroll/summary
async function getSummary(req, res) {
  const userId = req.user.id;
  const { from, to, game_type } = req.query;
  try {
    const summary = await getBankrollSummary(userId, { from, to, game_type });
    return ok(res, summary);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/bankroll/trends
async function getTrends(req, res) {
  const userId = req.user.id;
  const { from, to, game_type } = req.query;
  try {
    const trends = await getTrendData(userId, { from, to, game_type });
    return ok(res, trends);
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = {
  postSession,
  getSessions,
  getSession,
  patchSession,
  destroySession,
  postAdjustment,
  getAdjustments,
  getSummary,
  getTrends,
};
