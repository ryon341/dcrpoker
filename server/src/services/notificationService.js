'use strict';

const pool = require('../config/db');

/**
 * Create a notification for a user.
 */
async function createNotification(userId, { type, title, body, relatedEntityType = null, relatedEntityId = null }) {
  await pool.execute(
    `INSERT INTO notifications (user_id, type, title, body, related_entity_type, related_entity_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, type, title, body, relatedEntityType, relatedEntityId]
  );
}

/**
 * Notify all confirmed/waitlisted/invited players of a game when it's updated.
 */
async function notifyGamePlayers(gameId, { type, title, body, relatedEntityType = 'game', relatedEntityId }) {
  const [rows] = await pool.execute(
    `SELECT DISTINCT player_user_id FROM game_invites
     WHERE game_id = ? AND rsvp_status IN ('confirmed','waitlisted','invited')`,
    [gameId]
  );
  for (const row of rows) {
    await createNotification(row.player_user_id, { type, title, body, relatedEntityType, relatedEntityId });
  }
}

module.exports = { createNotification, notifyGamePlayers };
