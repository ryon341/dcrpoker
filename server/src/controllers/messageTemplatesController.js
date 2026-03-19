'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

const VALID_CHANNELS = ['sms', 'email'];

// GET /api/my/message-templates
async function listTemplates(req, res) {
  const hostUserId = req.user.id;
  const { channel, is_active } = req.query;

  let sql = 'SELECT * FROM message_templates WHERE host_user_id = ?';
  const params = [hostUserId];

  if (channel) {
    sql += ' AND channel = ?';
    params.push(channel);
  }
  if (is_active !== undefined) {
    sql += ' AND is_active = ?';
    params.push(is_active === '1' || is_active === 'true' ? 1 : 0);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { templates: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/message-templates/:id
async function getTemplate(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM message_templates WHERE id = ? AND host_user_id = ?',
      [id, hostUserId]
    );
    if (!rows.length) return notFound(res, 'Template not found');
    return ok(res, { template: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/message-templates
async function createTemplate(req, res) {
  const hostUserId = req.user.id;
  const { name, channel = 'sms', subject, body } = req.body;

  if (!name || !name.trim()) return badRequest(res, 'name is required');
  if (!body || !body.trim()) return badRequest(res, 'body is required');
  if (!VALID_CHANNELS.includes(channel)) {
    return badRequest(res, `channel must be one of: ${VALID_CHANNELS.join(', ')}`);
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO message_templates (host_user_id, name, channel, subject, body)
       VALUES (?, ?, ?, ?, ?)`,
      [hostUserId, name.trim(), channel, subject || null, body.trim()]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM message_templates WHERE id = ?',
      [result.insertId]
    );
    return ok(res, { template: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/message-templates/:id
async function updateTemplate(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { name, channel, subject, body, is_active } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM message_templates WHERE id = ? AND host_user_id = ?',
      [id, hostUserId]
    );
    if (!rows.length) return notFound(res, 'Template not found');

    if (channel && !VALID_CHANNELS.includes(channel)) {
      return badRequest(res, `channel must be one of: ${VALID_CHANNELS.join(', ')}`);
    }

    const current = rows[0];
    const updates = {
      name:      name      !== undefined ? name.trim()    : current.name,
      channel:   channel   !== undefined ? channel        : current.channel,
      subject:   subject   !== undefined ? subject || null : current.subject,
      body:      body      !== undefined ? body.trim()    : current.body,
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
    };

    await pool.execute(
      `UPDATE message_templates SET name=?, channel=?, subject=?, body=?, is_active=?
       WHERE id = ? AND host_user_id = ?`,
      [updates.name, updates.channel, updates.subject, updates.body, updates.is_active, id, hostUserId]
    );

    const [updated] = await pool.execute(
      'SELECT * FROM message_templates WHERE id = ?',
      [id]
    );
    return ok(res, { template: updated[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { listTemplates, getTemplate, createTemplate, updateTemplate };
