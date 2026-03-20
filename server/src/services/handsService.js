'use strict';

const pool = require('../config/db');

// ─── Create ───────────────────────────────────────────────────────────────────

async function createHand(userId, {
  game_type,
  stakes,
  table_format,
  position,
  hero_hand,
  stack_depth_bb,
  preflop_action,
  postflop_action,
  result_amount,
  result_type,
  tags,
  notes,
  review_status,
}) {
  const [result] = await pool.query(
    `INSERT INTO hand_history
       (user_id, game_type, stakes, table_format, position, hero_hand,
        stack_depth_bb, preflop_action, postflop_action,
        result_amount, result_type, tags, notes, review_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      game_type,
      stakes || null,
      table_format || null,
      position,
      hero_hand,
      stack_depth_bb != null ? stack_depth_bb : null,
      preflop_action || null,
      postflop_action || null,
      result_amount != null ? result_amount : null,
      result_type || null,
      tags ? JSON.stringify(tags) : null,
      notes || null,
      review_status || 'none',
    ],
  );
  return getHandById(userId, result.insertId);
}

// ─── List ─────────────────────────────────────────────────────────────────────

async function listHands(userId, { game_type, stakes, tag, review_status, limit = 50, offset = 0 } = {}) {
  const params = [userId];
  let where = 'WHERE user_id = ?';

  if (game_type)     { where += ' AND game_type = ?';      params.push(game_type); }
  if (stakes)        { where += ' AND stakes = ?';         params.push(stakes); }
  if (review_status) { where += ' AND review_status = ?';  params.push(review_status); }

  // Tag filter: JSON_CONTAINS works with MariaDB 10.2+
  if (tag) {
    where += ` AND JSON_CONTAINS(tags, ?)`;
    params.push(JSON.stringify(tag));
  }

  const safeLimit  = Math.min(parseInt(limit, 10)  || 50, 200);
  const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

  const [rows] = await pool.query(
    `SELECT * FROM hand_history ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, safeLimit, safeOffset],
  );
  return rows.map(parseHand);
}

// ─── Get one ──────────────────────────────────────────────────────────────────

async function getHandById(userId, id) {
  const [rows] = await pool.query(
    `SELECT * FROM hand_history WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  return rows[0] ? parseHand(rows[0]) : null;
}

// ─── Update ───────────────────────────────────────────────────────────────────

async function updateHand(userId, id, fields) {
  const allowed = [
    'game_type', 'stakes', 'table_format', 'position', 'hero_hand',
    'stack_depth_bb', 'preflop_action', 'postflop_action',
    'result_amount', 'result_type', 'tags', 'notes', 'review_status',
  ];

  const updates = [];
  const params  = [];

  for (const key of allowed) {
    if (key in fields) {
      updates.push(`${key} = ?`);
      params.push(key === 'tags' ? JSON.stringify(fields[key]) : fields[key]);
    }
  }

  if (updates.length === 0) return getHandById(userId, id);

  params.push(id, userId);
  await pool.query(
    `UPDATE hand_history SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    params,
  );
  return getHandById(userId, id);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

async function deleteHand(userId, id) {
  const [result] = await pool.query(
    `DELETE FROM hand_history WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  return result.affectedRows > 0;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseHand(row) {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags ?? []),
  };
}

module.exports = { createHand, listHands, getHandById, updateHand, deleteHand };
