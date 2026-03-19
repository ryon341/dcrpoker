'use strict';

const pool = require('../config/db');

const LEVEL_2_LIMIT = 500;

/**
 * Increment the host's monthly SMS usage by `messageCount` and return usage info.
 * Usage is always incremented (overage allowed but flagged).
 *
 * @param {number} hostUserId
 * @param {number} messageCount - number of messages being sent this request
 * @returns {{ allowed: boolean, currentUsage: number, limit: number, overage: boolean }}
 */
async function checkAndIncrementUsage(hostUserId, messageCount) {
  const now = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;

  // Upsert: create row if not exists, otherwise increment
  await pool.execute(
    `INSERT INTO sms_usage (host_user_id, year, month, messages_sent)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE messages_sent = messages_sent + VALUES(messages_sent)`,
    [hostUserId, year, month, messageCount]
  );

  const [rows] = await pool.execute(
    'SELECT messages_sent FROM sms_usage WHERE host_user_id = ? AND year = ? AND month = ?',
    [hostUserId, year, month]
  );

  const currentUsage = rows[0] ? rows[0].messages_sent : messageCount;
  const overage = currentUsage > LEVEL_2_LIMIT;

  return {
    allowed: true, // always allow, overage only flagged
    currentUsage,
    limit: LEVEL_2_LIMIT,
    overage,
  };
}

/**
 * Express middleware — checks plan_level and current usage before allowing send.
 * Enforces: only Level 2+ hosts may use this route.
 * Does NOT block on overage (per spec: allow + flag).
 */
async function usageLimitMiddleware(req, res, next) {
  const hostUserId = req.user.id;

  try {
    const [rows] = await pool.execute(
      'SELECT plan_level FROM users WHERE id = ?',
      [hostUserId]
    );

    if (!rows.length || rows[0].plan_level < 2) {
      return res.status(403).json({
        ok: false,
        error: 'Level 2 subscription required to send SMS via DCR Poker.',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Usage check failed.' });
  }
}

module.exports = { usageLimitMiddleware, checkAndIncrementUsage };
