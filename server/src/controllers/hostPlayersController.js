'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// POST /api/my/players
async function addPlayer(req, res) {
  const hostUserId = req.user.id;
  const { player_user_id, notes } = req.body;

  if (!player_user_id) {
    return badRequest(res, 'player_user_id is required');
  }

  if (Number(player_user_id) === hostUserId) {
    return badRequest(res, 'You cannot add yourself to your own player list');
  }

  try {
    // Verify target user exists
    const [users] = await pool.execute(
      'SELECT id, display_name, username, phone, email FROM users WHERE id = ?',
      [player_user_id]
    );
    if (!users.length) {
      return notFound(res, 'Player not found');
    }

    // Check for duplicate
    const [existing] = await pool.execute(
      'SELECT id FROM host_players WHERE host_user_id = ? AND player_user_id = ?',
      [hostUserId, player_user_id]
    );
    if (existing.length) {
      return res.status(409).json({ ok: false, error: 'Player is already on your list' });
    }

    const [result] = await pool.execute(
      `INSERT INTO host_players (host_user_id, player_user_id, status, notes)
       VALUES (?, ?, 'active', ?)`,
      [hostUserId, player_user_id, notes || null]
    );

    const [rows] = await pool.execute(
      `SELECT hp.id, hp.host_user_id, hp.player_user_id, hp.status, hp.notes,
              u.display_name, u.username, u.phone, u.email
       FROM host_players hp
       JOIN users u ON u.id = hp.player_user_id
       WHERE hp.id = ?`,
      [result.insertId]
    );

    return ok(res, { host_player_created: true, host_player: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/players
async function listMyPlayers(req, res) {
  const hostUserId = req.user.id;
  const { status } = req.query;

  let sql = `
    SELECT hp.id, hp.host_user_id, hp.player_user_id, hp.status, hp.notes,
           u.display_name, u.username, u.phone, u.email
    FROM host_players hp
    JOIN users u ON u.id = hp.player_user_id
    WHERE hp.host_user_id = ?`;
  const params = [hostUserId];

  if (status) {
    sql += ' AND hp.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY u.display_name';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { players: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { addPlayer, listMyPlayers };
