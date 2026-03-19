'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const pool = require('../config/db');
const { ok, serverError } = require('../utils/respond');

const router = Router();

// GET /api/my/roster — authenticated host's own active players with phone
router.get('/', authMiddleware, async (req, res) => {
  const hostUserId = req.user.id;
  try {
    const [rows] = await pool.execute(
      `SELECT
         hp.id,
         hp.host_user_id,
         hp.player_user_id,
         u.display_name AS player_display_name,
         u.username     AS player_username,
         u.phone        AS player_phone,
         u.email        AS player_email,
         hp.status
       FROM host_players hp
       JOIN users u ON u.id = hp.player_user_id
       WHERE hp.host_user_id = ? AND hp.status = 'active'
       ORDER BY u.display_name`,
      [hostUserId]
    );
    return ok(res, { players: rows });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
