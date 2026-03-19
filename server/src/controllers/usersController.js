const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// GET /api/users[?role=player|host|admin]
const listUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let sql = `
      SELECT
        u.id,
        u.display_name,
        u.username,
        u.phone,
        u.email,
        u.is_active,
        u.created_at,
        GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r       ON r.id = ur.role_id
    `;
    const params = [];

    if (role) {
      sql += `
      WHERE u.id IN (
        SELECT ur2.user_id FROM user_roles ur2
        JOIN roles r2 ON r2.id = ur2.role_id
        WHERE r2.name = ?
      )`;
      params.push(role);
    }

    sql += ' GROUP BY u.id ORDER BY u.id';

    const [rows] = await pool.query(sql, params);
    const data = rows.map((r) => ({ ...r, roles: r.roles ? r.roles.split(',') : [] }));
    ok(res, data);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /api/users/:id
const getUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return badRequest(res, 'Invalid id');

  try {
    const [rows] = await pool.query(
      `SELECT
        u.id, u.display_name, u.username, u.phone, u.email,
        u.is_active, u.created_at,
        GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') AS roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r       ON r.id = ur.role_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [id]
    );
    if (!rows.length) return notFound(res, 'User not found');
    const user = { ...rows[0], roles: rows[0].roles ? rows[0].roles.split(',') : [] };
    ok(res, user);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /api/users/:userId/invites
const getUserInvites = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) return badRequest(res, 'Invalid userId');

  try {
    const [rows] = await pool.query(
      `SELECT
        gi.id            AS invite_id,
        g.id             AS game_id,
        g.title          AS game_title,
        u.display_name   AS host_display_name,
        gi.status,
        gi.invited_at,
        gi.responded_at,
        g.starts_at
       FROM game_invites gi
       JOIN games g ON g.id = gi.game_id
       JOIN users u ON u.id = gi.host_user_id
       WHERE gi.player_user_id = ?
       ORDER BY g.starts_at`,
      [userId]
    );
    ok(res, rows);
  } catch (err) {
    serverError(res, err);
  }
};

module.exports = { listUsers, getUser, getUserInvites };
