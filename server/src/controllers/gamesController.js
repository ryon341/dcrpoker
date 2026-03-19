const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// GET /api/games[?host_user_id=&status=&visibility=]
const listGames = async (req, res) => {
  try {
    const { host_user_id, status, visibility } = req.query;
    const conditions = [];
    const params = [];

    if (host_user_id) { conditions.push('g.host_user_id = ?'); params.push(parseInt(host_user_id, 10)); }
    if (status)       { conditions.push('g.status = ?');       params.push(status); }
    if (visibility)   { conditions.push('g.visibility = ?');   params.push(visibility); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await pool.query(
      `SELECT
        g.id, g.title, g.host_user_id,
        u.display_name AS host_display_name,
        g.status, g.visibility, g.game_type, g.stakes_label,
        g.starts_at, g.created_at
       FROM games g
       JOIN users u ON u.id = g.host_user_id
       ${where}
       ORDER BY g.starts_at`,
      params
    );
    ok(res, rows);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /api/games/:id
const getGame = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return badRequest(res, 'Invalid id');

  try {
    const [rows] = await pool.query(
      `SELECT
        g.*,
        u.display_name AS host_display_name,
        u.username     AS host_username
       FROM games g
       JOIN users u ON u.id = g.host_user_id
       WHERE g.id = ?`,
      [id]
    );
    if (!rows.length) return notFound(res, 'Game not found');
    ok(res, rows[0]);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /api/games/:gameId/invites
const getGameInvites = async (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);
  if (!gameId) return badRequest(res, 'Invalid gameId');

  try {
    const [rows] = await pool.query(
      `SELECT
        gi.id            AS invite_id,
        gi.player_user_id,
        u.display_name   AS player_display_name,
        u.username       AS player_username,
        gi.status,
        gi.invited_at,
        gi.responded_at
       FROM game_invites gi
       JOIN users u ON u.id = gi.player_user_id
       WHERE gi.game_id = ?
       ORDER BY gi.invited_at`,
      [gameId]
    );
    ok(res, rows);
  } catch (err) {
    serverError(res, err);
  }
};

module.exports = { listGames, getGame, getGameInvites };
