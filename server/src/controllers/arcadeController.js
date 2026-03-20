const pool = require('../config/db');
const { ok, badRequest, serverError } = require('../utils/respond');

const VALID_GAME_IDS = new Set(['outs', 'nuts', 'chip_stack', 'memory', 'solitaire', 'blackjack', 'reaction']);

// GET /api/arcade/stats
const getStats = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      'SELECT game_id, high_score, best_streak, total_plays, last_score, last_played_at FROM arcade_stats WHERE user_id = ?',
      [userId]
    );
    ok(res, rows);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /api/arcade/stats/:gameId
const getGameStats = async (req, res) => {
  const userId = req.user.id;
  const { gameId } = req.params;
  if (!VALID_GAME_IDS.has(gameId)) return badRequest(res, 'Unknown game');
  try {
    const [rows] = await pool.query(
      'SELECT game_id, high_score, best_streak, total_plays, last_score, last_played_at FROM arcade_stats WHERE user_id = ? AND game_id = ?',
      [userId, gameId]
    );
    ok(res, rows[0] || null);
  } catch (err) {
    serverError(res, err);
  }
};

// POST /api/arcade/submit  { gameId, score, streak }
const submitResult = async (req, res) => {
  const userId = req.user.id;
  const { gameId, score, streak } = req.body;

  if (!gameId || !VALID_GAME_IDS.has(gameId)) return badRequest(res, 'Invalid gameId');
  if (typeof score !== 'number' || typeof streak !== 'number') return badRequest(res, 'score and streak must be numbers');
  if (score < 0 || streak < 0) return badRequest(res, 'score and streak must be non-negative');

  try {
    await pool.query(
      `INSERT INTO arcade_stats (user_id, game_id, high_score, best_streak, total_plays, last_score, last_played_at)
       VALUES (?, ?, ?, ?, 1, ?, NOW())
       ON DUPLICATE KEY UPDATE
         high_score     = IF(? > high_score, ?, high_score),
         best_streak    = IF(? > best_streak, ?, best_streak),
         total_plays    = total_plays + 1,
         last_score     = ?,
         last_played_at = NOW()`,
      [userId, gameId, score, streak, score,
       score, score,
       streak, streak,
       score]
    );
    ok(res, { saved: true });
  } catch (err) {
    serverError(res, err);
  }
};

module.exports = { getStats, getGameStats, submitResult };
