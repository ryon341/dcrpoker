const pool    = require('../config/db');
const { ok, badRequest, serverError } = require('../utils/respond');

// ─── Main Progress ────────────────────────────────────────────────────────────

// GET /api/poker/progress
const getProgress = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      'SELECT progress, updated_at FROM poker_progress WHERE user_id = ?',
      [userId],
    );
    if (!rows.length) return ok(res, { progress: null });
    const row = rows[0];
    ok(res, { progress: { ...row.progress, _serverUpdatedAt: row.updated_at } });
  } catch (err) {
    serverError(res, err);
  }
};

// POST /api/poker/progress  { progress: PokerChallengeProgress }
const saveProgress = async (req, res) => {
  const userId = req.user.id;
  const { progress } = req.body;

  if (!progress || typeof progress !== 'object') {
    return badRequest(res, 'progress is required');
  }

  try {
    // Latest updatedAt wins: if DB has a newer record, return it instead
    const [rows] = await pool.query(
      'SELECT updated_at FROM poker_progress WHERE user_id = ?',
      [userId],
    );
    if (rows.length) {
      const dbTs       = new Date(rows[0].updated_at).getTime();
      const incomingTs = new Date(progress.updatedAt || 0).getTime();
      if (dbTs > incomingTs) {
        // DB is newer — return current DB value so client can reconcile
        const [fresh] = await pool.query(
          'SELECT progress FROM poker_progress WHERE user_id = ?',
          [userId],
        );
        return ok(res, { saved: false, reason: 'stale', progress: fresh[0].progress });
      }
    }

    await pool.query(
      `INSERT INTO poker_progress (user_id, progress)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE progress = VALUES(progress)`,
      [userId, JSON.stringify(progress)],
    );
    ok(res, { saved: true });
  } catch (err) {
    serverError(res, err);
  }
};

// ─── Daily Progress ───────────────────────────────────────────────────────────

// GET /api/poker/daily?dailyId=YYYY-MM-DD
const getDailyProgress = async (req, res) => {
  const userId  = req.user.id;
  const dailyId = req.query.dailyId;
  if (!dailyId || !/^\d{4}-\d{2}-\d{2}$/.test(dailyId)) {
    return badRequest(res, 'dailyId query param required (YYYY-MM-DD)');
  }
  try {
    const [rows] = await pool.query(
      'SELECT progress FROM poker_daily_progress WHERE user_id = ? AND daily_id = ?',
      [userId, dailyId],
    );
    ok(res, { progress: rows.length ? rows[0].progress : null });
  } catch (err) {
    serverError(res, err);
  }
};

// POST /api/poker/daily  { dailyId, progress: DailyChallengeProgress }
const saveDailyProgress = async (req, res) => {
  const userId  = req.user.id;
  const { dailyId, progress } = req.body;

  if (!dailyId || !/^\d{4}-\d{2}-\d{2}$/.test(dailyId)) {
    return badRequest(res, 'dailyId is required (YYYY-MM-DD)');
  }
  if (!progress || typeof progress !== 'object') {
    return badRequest(res, 'progress is required');
  }

  try {
    await pool.query(
      `INSERT INTO poker_daily_progress (user_id, daily_id, progress)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE progress = VALUES(progress)`,
      [userId, dailyId, JSON.stringify(progress)],
    );
    ok(res, { saved: true });
  } catch (err) {
    serverError(res, err);
  }
};

module.exports = { getProgress, saveProgress, getDailyProgress, saveDailyProgress };
