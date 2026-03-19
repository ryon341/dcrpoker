'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// GET /api/my/notifications
async function listNotifications(req, res) {
  const userId = req.user.id;
  try {
    const [rows] = await pool.execute(
      `SELECT id, type, title, body, related_entity_type, related_entity_id, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId]
    );
    const unreadCount = rows.filter(r => !r.is_read).length;
    return ok(res, { notifications: rows, unreadCount });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/notifications/:id/read
async function markRead(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (result.affectedRows === 0) return notFound(res, 'Notification not found');
    return ok(res, { id: Number(id), is_read: true });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/notifications/read-all
async function markAllRead(req, res) {
  const userId = req.user.id;
  try {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return ok(res, { marked: true });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { listNotifications, markRead, markAllRead };
