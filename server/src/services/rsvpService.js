'use strict';

const pool = require('../config/db');
const { sendSms } = require('./smsService');

/**
 * Normalize a phone number to E.164.
 * Strips formatting; assumes +1 (US) if no country code present.
 */
function normalizePhone(raw) {
  let n = String(raw).replace(/[\s\-().]/g, '');
  if (n && !n.startsWith('+')) n = '+1' + n;
  return n;
}

/**
 * Find the most relevant open invite for a player.
 * Rules:
 *  - rsvp_status IN ('invited', 'waitlisted')
 *  - related game is published, active, and starts in the future (or has no starts_at set)
 *  - ordered by soonest starts_at first, then newest invite
 *
 * @param {number} playerUserId
 * @returns {Object|null} invite row joined with game data
 */
async function findActiveInvite(playerUserId) {
  const [rows] = await pool.execute(
    `SELECT
       gi.id,
       gi.game_id,
       gi.player_user_id,
       gi.host_user_id,
       gi.status,
       gi.rsvp_status,
       gi.seat_preference,
       gi.waitlist_position,
       gi.responded_at,
       g.title          AS game_title,
       g.max_players    AS game_max_players,
       g.starts_at      AS game_starts_at
     FROM game_invites gi
     JOIN games g ON g.id = gi.game_id
     WHERE gi.player_user_id = ?
       AND gi.rsvp_status IN ('invited', 'waitlisted')
       AND g.status = 'published'
       AND g.is_active = 1
       AND (g.starts_at IS NULL OR g.starts_at >= NOW())
     ORDER BY g.starts_at ASC, gi.id DESC
     LIMIT 1`,
    [playerUserId]
  );
  return rows[0] || null;
}

/**
 * Get the count of confirmed players for a game (excluding the current invite).
 */
async function confirmedCount(gameId) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM game_invites
     WHERE game_id = ? AND rsvp_status = 'confirmed'`,
    [gameId]
  );
  return rows[0].cnt;
}

/**
 * Get the next waitlist position for a game (max current + 1, or 1 if none).
 */
async function nextWaitlistPosition(gameId) {
  const [rows] = await pool.execute(
    `SELECT MAX(waitlist_position) AS max_pos FROM game_invites
     WHERE game_id = ? AND waitlist_position IS NOT NULL`,
    [gameId]
  );
  const maxPos = rows[0].max_pos;
  return maxPos ? maxPos + 1 : 1;
}

/**
 * Log an inbound SMS to sms_inbound_logs.
 */
async function logInbound({ fromPhone, toPhone, messageBody, parsedCommand, parsedValue, userId, gameId, inviteId, status, errorMessage }) {
  try {
    await pool.execute(
      `INSERT INTO sms_inbound_logs
         (from_phone, to_phone, message_body, parsed_command, parsed_value,
          user_id, game_id, game_invite_id, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fromPhone, toPhone, messageBody, parsedCommand || null, parsedValue || null,
       userId || null, gameId || null, inviteId || null, status, errorMessage || null]
    );
  } catch (err) {
    // Non-fatal
    console.error('[rsvpService] logInbound error:', err.message);
  }
}

/**
 * Send an outbound confirmation SMS, swallowing errors (already logged by smsService).
 */
async function reply(toPhone, message) {
  await sendSms({ to: toPhone, body: `DCR Poker: ${message}` });
}

/**
 * Main RSVP processing entry point.
 *
 * @param {Object} opts
 * @param {string} opts.fromPhone - normalized E.164 sender phone
 * @param {string} opts.toPhone   - Twilio number that received the message
 * @param {string} opts.rawBody   - raw SMS text
 * @param {{ command: string, seatPreference: string|null }} opts.parsed
 */
async function processRsvp({ fromPhone, toPhone, rawBody, parsed }) {
  const { command, seatPreference } = parsed;

  // ── 1. Look up player by phone ────────────────────────────────────────────
  const [userRows] = await pool.execute(
    'SELECT id, display_name, phone FROM users WHERE phone = ? LIMIT 1',
    [fromPhone]
  );

  if (!userRows.length) {
    await reply(fromPhone, "We couldn't match this number to a DCR Poker account.");
    await logInbound({
      fromPhone, toPhone, messageBody: rawBody,
      parsedCommand: command, parsedValue: seatPreference,
      status: 'no_user',
      errorMessage: 'Phone not matched to any user',
    });
    return;
  }

  const user = userRows[0];

  // ── 2. Find active invite ─────────────────────────────────────────────────
  const invite = await findActiveInvite(user.id);

  if (!invite) {
    await reply(fromPhone, 'No active invitation was found for this number.');
    await logInbound({
      fromPhone, toPhone, messageBody: rawBody,
      parsedCommand: command, parsedValue: seatPreference,
      userId: user.id, status: 'no_invite',
      errorMessage: 'No qualifying invite found',
    });
    return;
  }

  // ── 3. Process command ────────────────────────────────────────────────────
  let newRsvpStatus = invite.rsvp_status;
  let newSeatPreference = invite.seat_preference;
  let newWaitlistPosition = invite.waitlist_position;
  let replyMessage = '';

  if (command === 'NO') {
    newRsvpStatus = 'declined';
    newSeatPreference = null;
    newWaitlistPosition = null;
    replyMessage = "You've been marked as not attending.";

  } else if (command === 'WAIT') {
    const position = await nextWaitlistPosition(invite.game_id);
    newRsvpStatus = 'waitlisted';
    newWaitlistPosition = position;
    replyMessage = `You're on the waitlist at position #${position}.`;

  } else if (command === 'YES') {
    newSeatPreference = seatPreference; // may be null, '1', '2', or 'any'
    const confirmed = await confirmedCount(invite.game_id);

    if (confirmed < invite.game_max_players) {
      newRsvpStatus = 'confirmed';
      newWaitlistPosition = null;
      replyMessage = seatPreference
        ? `You're confirmed for the game (seat preference: ${seatPreference}).`
        : "You're confirmed for the game.";
    } else {
      // Game is full — waitlist
      const position = await nextWaitlistPosition(invite.game_id);
      newRsvpStatus = 'waitlisted';
      newWaitlistPosition = position;
      replyMessage = `The game is currently full. You've been added to the waitlist at position #${position}.`;
    }

  } else {
    // UNKNOWN
    await reply(fromPhone, 'Reply YES, NO, WAIT, YES 1, YES 2, or YES ANY.');
    await logInbound({
      fromPhone, toPhone, messageBody: rawBody,
      parsedCommand: command, parsedValue: seatPreference,
      userId: user.id, gameId: invite.game_id, inviteId: invite.id,
      status: 'unknown_command',
    });
    return;
  }

  // ── 4. Persist RSVP update ────────────────────────────────────────────────
  await pool.execute(
    `UPDATE game_invites
     SET rsvp_status = ?, seat_preference = ?, waitlist_position = ?, responded_at = NOW()
     WHERE id = ?`,
    [newRsvpStatus, newSeatPreference, newWaitlistPosition, invite.id]
  );

  // ── 5. Send confirmation SMS ──────────────────────────────────────────────
  await reply(fromPhone, replyMessage);

  // ── 6. Log ────────────────────────────────────────────────────────────────
  await logInbound({
    fromPhone, toPhone, messageBody: rawBody,
    parsedCommand: command, parsedValue: seatPreference,
    userId: user.id, gameId: invite.game_id, inviteId: invite.id,
    status: 'processed',
  });
}

module.exports = { processRsvp, normalizePhone };
