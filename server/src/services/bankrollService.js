'use strict';

const pool = require('../config/db');

// ─── Sessions ─────────────────────────────────────────────────────────────────

async function createSession(userId, {
  played_at,
  game_type = 'cash',
  stakes_label,
  location_name,
  buy_in_amount_cents,
  cash_out_amount_cents,
  hours_played_decimal,
  notes,
}) {
  const profit_loss_cents = cash_out_amount_cents - buy_in_amount_cents;
  const [result] = await pool.query(
    `INSERT INTO poker_sessions
       (user_id, played_at, game_type, stakes_label, location_name,
        buy_in_amount_cents, cash_out_amount_cents, profit_loss_cents,
        hours_played_decimal, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId, played_at, game_type, stakes_label || null, location_name || null,
      buy_in_amount_cents, cash_out_amount_cents, profit_loss_cents,
      hours_played_decimal, notes || null,
    ],
  );
  return getSessionById(userId, result.insertId);
}

async function listSessions(userId, { game_type, from, to } = {}) {
  const params = [userId];
  let where = 'WHERE user_id = ?';

  if (game_type) {
    where += ' AND game_type = ?';
    params.push(game_type);
  }
  if (from) {
    where += ' AND played_at >= ?';
    params.push(from);
  }
  if (to) {
    where += ' AND played_at <= ?';
    params.push(to);
  }

  const [rows] = await pool.query(
    `SELECT id, played_at, game_type, stakes_label, location_name,
            buy_in_amount_cents, cash_out_amount_cents, profit_loss_cents,
            hours_played_decimal, notes, created_at, updated_at
     FROM poker_sessions
     ${where}
     ORDER BY played_at DESC`,
    params,
  );
  return rows;
}

async function getSessionById(userId, sessionId) {
  const [rows] = await pool.query(
    `SELECT id, played_at, game_type, stakes_label, location_name,
            buy_in_amount_cents, cash_out_amount_cents, profit_loss_cents,
            hours_played_decimal, notes, created_at, updated_at
     FROM poker_sessions
     WHERE id = ? AND user_id = ?`,
    [sessionId, userId],
  );
  return rows[0] || null;
}

async function updateSession(userId, sessionId, fields) {
  const session = await getSessionById(userId, sessionId);
  if (!session) return null;

  const {
    played_at         = session.played_at,
    game_type         = session.game_type,
    stakes_label      = session.stakes_label,
    location_name     = session.location_name,
    buy_in_amount_cents  = session.buy_in_amount_cents,
    cash_out_amount_cents = session.cash_out_amount_cents,
    hours_played_decimal = session.hours_played_decimal,
    notes             = session.notes,
  } = fields;

  const profit_loss_cents = cash_out_amount_cents - buy_in_amount_cents;

  await pool.query(
    `UPDATE poker_sessions
     SET played_at = ?, game_type = ?, stakes_label = ?, location_name = ?,
         buy_in_amount_cents = ?, cash_out_amount_cents = ?, profit_loss_cents = ?,
         hours_played_decimal = ?, notes = ?
     WHERE id = ? AND user_id = ?`,
    [
      played_at, game_type, stakes_label || null, location_name || null,
      buy_in_amount_cents, cash_out_amount_cents, profit_loss_cents,
      hours_played_decimal, notes || null,
      sessionId, userId,
    ],
  );
  return getSessionById(userId, sessionId);
}

// ─── Adjustments ──────────────────────────────────────────────────────────────

async function createAdjustment(userId, { amount_cents, adjustment_type = 'manual', description }) {
  const [result] = await pool.query(
    `INSERT INTO bankroll_adjustments (user_id, amount_cents, adjustment_type, description)
     VALUES (?, ?, ?, ?)`,
    [userId, amount_cents, adjustment_type, description || null],
  );
  const [rows] = await pool.query(
    'SELECT * FROM bankroll_adjustments WHERE id = ?',
    [result.insertId],
  );
  return rows[0];
}

async function listAdjustments(userId) {
  const [rows] = await pool.query(
    `SELECT id, amount_cents, adjustment_type, description, created_at
     FROM bankroll_adjustments
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
}

// ─── Delete Session ───────────────────────────────────────────────────────────

async function deleteSession(userId, sessionId) {
  const session = await getSessionById(userId, sessionId);
  if (!session) return false;
  await pool.query('DELETE FROM poker_sessions WHERE id = ? AND user_id = ?', [sessionId, userId]);
  return true;
}

// ─── Summary (with optional filters) ─────────────────────────────────────────

async function getBankrollSummary(userId, { from, to, game_type } = {}) {
  const params = [userId];
  let where = 'WHERE user_id = ?';
  if (game_type) { where += ' AND game_type = ?';  params.push(game_type); }
  if (from)      { where += ' AND played_at >= ?'; params.push(from); }
  if (to)        { where += ' AND played_at <= ?'; params.push(to); }

  const [[sessionAgg]] = await pool.query(
    `SELECT
       COUNT(*)                                        AS session_count,
       COALESCE(SUM(profit_loss_cents), 0)             AS total_profit_loss_cents,
       COALESCE(SUM(hours_played_decimal), 0.00)       AS total_hours_played_decimal,
       COALESCE(MAX(profit_loss_cents), 0)             AS biggest_win_cents,
       COALESCE(MIN(profit_loss_cents), 0)             AS biggest_loss_cents
     FROM poker_sessions
     ${where}`,
    params,
  );

  // Current bankroll is always global (all sessions + all adjustments)
  const [[adjAgg]] = await pool.query(
    `SELECT COALESCE(SUM(amount_cents), 0) AS total_adjustments_cents
     FROM bankroll_adjustments
     WHERE user_id = ?`,
    [userId],
  );
  const [[allSessionsAgg]] = await pool.query(
    `SELECT COALESCE(SUM(profit_loss_cents), 0) AS total_all_profit_cents
     FROM poker_sessions WHERE user_id = ?`,
    [userId],
  );

  const sessionCount          = Number(sessionAgg.session_count);
  const totalProfitLossCents  = Number(sessionAgg.total_profit_loss_cents);
  const totalHours            = Number(sessionAgg.total_hours_played_decimal);
  const biggestWinCents       = Number(sessionAgg.biggest_win_cents);
  const biggestLossCents      = Number(sessionAgg.biggest_loss_cents);
  const totalAdjustmentsCents = Number(adjAgg.total_adjustments_cents);
  const allSessionsProfit     = Number(allSessionsAgg.total_all_profit_cents);

  const avgProfitPerSession = sessionCount > 0
    ? Math.round(totalProfitLossCents / sessionCount) : 0;
  const avgProfitPerHour = totalHours > 0
    ? Math.round(totalProfitLossCents / totalHours) : 0;
  const currentBankrollCents = allSessionsProfit + totalAdjustmentsCents;

  return {
    filters:                          { from: from || null, to: to || null, game_type: game_type || null },
    session_count:                    sessionCount,
    total_profit_loss_cents:          totalProfitLossCents,
    total_hours_played_decimal:       totalHours,
    average_profit_per_session_cents: avgProfitPerSession,
    average_profit_per_hour_cents:    avgProfitPerHour,
    current_bankroll_cents:           currentBankrollCents,
    biggest_win_cents:                biggestWinCents,
    biggest_loss_cents:               biggestLossCents,
  };
}

// ─── Trend data ───────────────────────────────────────────────────────────────

async function getTrendData(userId, { from, to, game_type } = {}) {
  const params = [userId];
  let where = 'WHERE user_id = ?';
  if (game_type) { where += ' AND game_type = ?';  params.push(game_type); }
  if (from)      { where += ' AND played_at >= ?'; params.push(from); }
  if (to)        { where += ' AND played_at <= ?'; params.push(to); }

  const [rows] = await pool.query(
    `SELECT id, played_at, profit_loss_cents, hours_played_decimal
     FROM poker_sessions
     ${where}
     ORDER BY played_at ASC`,
    params,
  );

  let cumulative = 0;
  const points = rows.map(r => {
    cumulative += Number(r.profit_loss_cents);
    return {
      session_id:              r.id,
      played_at:               r.played_at,
      profit_loss_cents:       Number(r.profit_loss_cents),
      hours_played_decimal:    Number(r.hours_played_decimal),
      cumulative_profit_cents: cumulative,
    };
  });

  // Recent window summaries (always global, not filtered)
  const now = new Date();
  const d7  = new Date(now); d7.setDate(d7.getDate() - 7);
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
  const fmt = d => d.toISOString().slice(0, 19).replace('T', ' ');

  const [[r7]] = await pool.query(
    `SELECT COALESCE(SUM(profit_loss_cents),0) AS profit_cents,
            COALESCE(SUM(hours_played_decimal),0) AS hours
     FROM poker_sessions WHERE user_id = ? AND played_at >= ?`,
    [userId, fmt(d7)],
  );
  const [[r30]] = await pool.query(
    `SELECT COALESCE(SUM(profit_loss_cents),0) AS profit_cents,
            COALESCE(SUM(hours_played_decimal),0) AS hours
     FROM poker_sessions WHERE user_id = ? AND played_at >= ?`,
    [userId, fmt(d30)],
  );

  return {
    points,
    recent: {
      last7DaysProfitCents:  Number(r7.profit_cents),
      last30DaysProfitCents: Number(r30.profit_cents),
      last7DaysHours:        Number(r7.hours),
      last30DaysHours:       Number(r30.hours),
    },
  };
}

module.exports = {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  createAdjustment,
  listAdjustments,
  getBankrollSummary,
  getTrendData,
};
