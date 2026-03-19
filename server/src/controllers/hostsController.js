const pool = require('../config/db');
const { ok, badRequest, serverError } = require('../utils/respond');

// GET /api/hosts/:hostUserId/players
const getHostPlayers = async (req, res) => {
  const hostUserId = parseInt(req.params.hostUserId, 10);
  if (!hostUserId) return badRequest(res, 'Invalid hostUserId');

  try {
    const [rows] = await pool.query(
      `SELECT
        hp.id,
        hp.player_user_id,
        u.display_name AS player_display_name,
        u.username     AS player_username,
        hp.status,
        hp.added_at,
        hp.removed_at,
        hp.notes
       FROM host_players hp
       JOIN users u ON u.id = hp.player_user_id
       WHERE hp.host_user_id = ?
       ORDER BY hp.added_at`,
      [hostUserId]
    );
    ok(res, rows);
  } catch (err) {
    serverError(res, err);
  }
};

module.exports = { getHostPlayers };
