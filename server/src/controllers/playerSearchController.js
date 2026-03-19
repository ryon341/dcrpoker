'use strict';

const pool = require('../config/db');
const { ok, badRequest, serverError } = require('../utils/respond');

// GET /api/player-search?q=...
async function searchPlayers(req, res) {
  const { q } = req.query;
  const selfId = req.user.id;

  if (!q || q.trim().length < 2) {
    return ok(res, { players: [] });
  }

  const term = `%${q.trim()}%`;

  try {
    const [rows] = await pool.execute(
      `SELECT id, display_name, username, phone, email
       FROM users
       WHERE (
         display_name LIKE ? OR
         username     LIKE ? OR
         phone        LIKE ? OR
         email        LIKE ?
       )
       AND id != ?
       ORDER BY display_name
       LIMIT 20`,
      [term, term, term, term, selfId]
    );

    return ok(res, { players: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { searchPlayers };
