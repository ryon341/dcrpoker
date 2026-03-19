'use strict';

const pool = require('../config/db');

/**
 * Returns an array of seat numbers already assigned to confirmed players in a game.
 *
 * @param {number|string} gameId
 * @param {number|string|null} excludeInviteId - invite to exclude from conflict check
 * @returns {number[]}
 */
async function getOccupiedSeats(gameId, excludeInviteId = null) {
  let sql = `SELECT assigned_seat_number FROM game_invites
             WHERE game_id = ? AND rsvp_status = 'confirmed'
               AND assigned_seat_number IS NOT NULL`;
  const params = [gameId];

  if (excludeInviteId != null) {
    sql += ' AND id != ?';
    params.push(excludeInviteId);
  }

  const [rows] = await pool.execute(sql, params);
  return rows.map(r => r.assigned_seat_number);
}

/**
 * Validates that seatNumber is legal for the game and not already taken.
 * Returns an error string, or null if valid.
 *
 * @param {number} gameId
 * @param {number} seatNumber
 * @param {number} maxPlayers
 * @param {number|null} excludeInviteId
 * @returns {string|null}
 */
async function validateSeat(gameId, seatNumber, maxPlayers, excludeInviteId = null) {
  if (!Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > maxPlayers) {
    return `Seat number must be between 1 and ${maxPlayers}`;
  }
  const occupied = await getOccupiedSeats(gameId, excludeInviteId);
  if (occupied.includes(seatNumber)) {
    return `Seat ${seatNumber} is already assigned to another player`;
  }
  return null;
}

/**
 * Re-numbers all waitlisted players for a game so positions are contiguous (1, 2, 3, …).
 * Uses the provided connection if given (for transactions), otherwise uses pool.
 *
 * @param {number|string} gameId
 * @param {object|null} conn - optional mysql2 connection from pool.getConnection()
 */
async function renumberWaitlist(gameId, conn = null) {
  const db = conn || pool;
  const [rows] = await db.execute(
    `SELECT id FROM game_invites
     WHERE game_id = ? AND rsvp_status = 'waitlisted'
     ORDER BY waitlist_position ASC, id ASC`,
    [gameId]
  );
  for (let i = 0; i < rows.length; i++) {
    await db.execute(
      'UPDATE game_invites SET waitlist_position = ? WHERE id = ?',
      [i + 1, rows[i].id]
    );
  }
}

module.exports = { getOccupiedSeats, validateSeat, renumberWaitlist };
