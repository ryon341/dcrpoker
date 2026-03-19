'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');
const { validateSeat, renumberWaitlist } = require('../services/seatAssignmentService');
const { createNotification } = require('../services/notificationService');

// Helper: verify game ownership, returns game row or null
async function ownershipCheck(gameId, hostUserId) {
  const [rows] = await pool.execute(
    'SELECT * FROM games WHERE id = ? AND host_user_id = ?',
    [gameId, hostUserId]
  );
  return rows[0] || null;
}

// POST /api/my/games
async function createGame(req, res) {
  const hostUserId = req.user.id;
  const {
    title,
    description,
    location_name,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    game_type,
    stakes_label,
    starts_at,
    ends_at,
    status = 'draft',
  } = req.body;

  if (!title || title.trim() === '') {
    return badRequest(res, 'title is required');
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO games
         (host_user_id, title, description, location_name, address_line_1, address_line_2,
          city, state, postal_code, game_type, stakes_label, starts_at, ends_at, status,
          visibility, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'private', 1)`,
      [
        hostUserId,
        title.trim(),
        description || null,
        location_name || null,
        address_line_1 || null,
        address_line_2 || null,
        city || null,
        state || null,
        postal_code || null,
        game_type || null,
        stakes_label || null,
        starts_at || null,
        ends_at || null,
        status,
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM games WHERE id = ?', [result.insertId]);
    return ok(res, { game: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/games
async function listMyGames(req, res) {
  const hostUserId = req.user.id;
  const { status, is_active } = req.query;

  let sql = 'SELECT * FROM games WHERE host_user_id = ?';
  const params = [hostUserId];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (is_active !== undefined) {
    sql += ' AND is_active = ?';
    params.push(Number(is_active));
  }

  sql += ' ORDER BY starts_at ASC, created_at DESC';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { games: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/games/:id
async function getMyGame(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT g.*,
              (SELECT COUNT(*) FROM game_invites gi WHERE gi.game_id = g.id) AS invite_count
       FROM games g
       WHERE g.id = ? AND g.host_user_id = ?`,
      [id, hostUserId]
    );

    if (!rows.length) return notFound(res, 'Game not found');
    return ok(res, { game: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/games/:id
async function updateMyGame(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  try {
    const game = await ownershipCheck(id, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    const allowedFields = [
      'title', 'description', 'location_name', 'address_line_1', 'address_line_2',
      'city', 'state', 'postal_code', 'game_type', 'stakes_label',
      'starts_at', 'ends_at', 'status', 'is_active',
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (!Object.keys(updates).length) {
      return badRequest(res, 'No updatable fields provided');
    }

    if (updates.title !== undefined && updates.title.trim() === '') {
      return badRequest(res, 'title cannot be empty');
    }

    const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await pool.execute(`UPDATE games SET ${setClauses} WHERE id = ?`, values);

    const [updated] = await pool.execute('SELECT * FROM games WHERE id = ?', [id]);
    return ok(res, { game: updated[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/games/:id/invites
async function invitePlayer(req, res) {
  const hostUserId = req.user.id;
  const gameId = req.params.id;
  const { player_user_id } = req.body;

  if (!player_user_id || isNaN(Number(player_user_id))) {
    return badRequest(res, 'player_user_id (numeric) is required');
  }

  try {
    const game = await ownershipCheck(gameId, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    const [playerRows] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [player_user_id]
    );
    if (!playerRows.length) return notFound(res, 'Player not found');

    const conn = await pool.getConnection();
    let invite;
    let hostPlayerCreated = false;

    try {
      await conn.beginTransaction();

      // Auto-create host_players link if not present
      const [hp] = await conn.execute(
        'SELECT id FROM host_players WHERE host_user_id = ? AND player_user_id = ?',
        [hostUserId, player_user_id]
      );
      if (!hp.length) {
        await conn.execute(
          "INSERT INTO host_players (host_user_id, player_user_id, status) VALUES (?, ?, 'active')",
          [hostUserId, player_user_id]
        );
        hostPlayerCreated = true;
      }

      const [result] = await conn.execute(
        "INSERT INTO game_invites (game_id, host_user_id, player_user_id, status) VALUES (?, ?, ?, 'invited')",
        [gameId, hostUserId, player_user_id]
      );

      const [invRows] = await conn.execute(
        'SELECT * FROM game_invites WHERE id = ?',
        [result.insertId]
      );
      invite = invRows[0];

      await conn.commit();
    } catch (txErr) {
      await conn.rollback();
      if (txErr.code === 'ER_DUP_ENTRY') {
        conn.release();
        return res.status(409).json({ ok: false, error: 'Player already invited to this game' });
      }
      throw txErr;
    } finally {
      conn.release();
    }

    return ok(res, { invite_created: true, host_player_created: hostPlayerCreated, game_invite: invite }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/games/:id/invites/from-host-list
async function inviteFromHostList(req, res) {
  const hostUserId = req.user.id;
  const gameId = req.params.id;
  const { player_user_ids } = req.body;

  if (!Array.isArray(player_user_ids) || !player_user_ids.length) {
    return badRequest(res, 'player_user_ids must be a non-empty array');
  }

  try {
    const game = await ownershipCheck(gameId, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    const [activeRoster] = await pool.execute(
      "SELECT player_user_id FROM host_players WHERE host_user_id = ? AND status = 'active'",
      [hostUserId]
    );
    const activeSet = new Set(activeRoster.map(r => Number(r.player_user_id)));

    const [existingInvites] = await pool.execute(
      'SELECT player_user_id FROM game_invites WHERE game_id = ?',
      [gameId]
    );
    const invitedSet = new Set(existingInvites.map(r => Number(r.player_user_id)));

    const invited = [];
    const skippedDuplicates = [];
    const invalidNotOnHostList = [];

    for (const rawId of player_user_ids) {
      const pid = Number(rawId);
      if (isNaN(pid)) {
        invalidNotOnHostList.push(rawId);
        continue;
      }
      if (!activeSet.has(pid)) {
        invalidNotOnHostList.push(pid);
        continue;
      }
      if (invitedSet.has(pid)) {
        skippedDuplicates.push(pid);
        continue;
      }
      invited.push(pid);
    }

    for (const pid of invited) {
      await pool.execute(
        "INSERT IGNORE INTO game_invites (game_id, host_user_id, player_user_id, status) VALUES (?, ?, ?, 'invited')",
        [gameId, hostUserId, pid]
      );
    }

    return ok(res, {
      invited_count: invited.length,
      duplicate_count: skippedDuplicates.length,
      invalid_count: invalidNotOnHostList.length,
      invited_player_user_ids: invited,
      duplicate_player_user_ids: skippedDuplicates,
      invalid_player_user_ids: invalidNotOnHostList,
    });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/games/:id/invites
async function listGameInvites(req, res) {
  const hostUserId = req.user.id;
  const gameId = req.params.id;
  const { status } = req.query;

  try {
    const game = await ownershipCheck(gameId, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    let sql = `
      SELECT gi.id, gi.game_id, gi.player_user_id, gi.status, gi.invited_at, gi.responded_at,
             u.display_name AS player_display_name,
             u.username     AS player_username,
             u.phone        AS player_phone,
             u.email        AS player_email
      FROM game_invites gi
      JOIN users u ON u.id = gi.player_user_id
      WHERE gi.game_id = ? AND gi.host_user_id = ?
    `;
    const params = [gameId, hostUserId];

    if (status) {
      sql += ' AND gi.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY gi.invited_at ASC';

    const [rows] = await pool.execute(sql, params);
    return ok(res, { invites: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/games/:gameId/invites/:inviteId
async function cancelInvite(req, res) {
  const hostUserId = req.user.id;
  const { gameId, inviteId } = req.params;

  try {
    const game = await ownershipCheck(gameId, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    const [rows] = await pool.execute(
      'SELECT * FROM game_invites WHERE id = ? AND game_id = ?',
      [inviteId, gameId]
    );
    if (!rows.length) return notFound(res, 'Invite not found');

    await pool.execute(
      "UPDATE game_invites SET status = 'removed', responded_at = NOW() WHERE id = ?",
      [inviteId]
    );

    const [updated] = await pool.execute('SELECT * FROM game_invites WHERE id = ?', [inviteId]);
    return ok(res, { invite: updated[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/games/:id/add-player
// Ensures host_players link exists AND creates game invite in one call
async function addPlayerToGame(req, res) {
  const hostUserId = req.user.id;
  const gameId = req.params.id;
  const { player_user_id, notes } = req.body;

  if (!player_user_id) {
    return badRequest(res, 'player_user_id is required');
  }

  try {
    const game = await ownershipCheck(gameId, hostUserId);
    if (!game) return notFound(res, 'Game not found');

    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [player_user_id]
    );
    if (!users.length) return notFound(res, 'Player not found');

    const conn = await pool.getConnection();
    let hostPlayerCreated = false;
    let gameInviteCreated = false;

    try {
      await conn.beginTransaction();

      // Ensure host_players link
      const [hp] = await conn.execute(
        'SELECT id FROM host_players WHERE host_user_id = ? AND player_user_id = ?',
        [hostUserId, player_user_id]
      );
      if (!hp.length) {
        await conn.execute(
          "INSERT INTO host_players (host_user_id, player_user_id, status, notes) VALUES (?, ?, 'active', ?)",
          [hostUserId, player_user_id, notes || null]
        );
        hostPlayerCreated = true;
      }

      // Ensure game invite
      const [gi] = await conn.execute(
        'SELECT id FROM game_invites WHERE game_id = ? AND player_user_id = ?',
        [gameId, player_user_id]
      );
      if (!gi.length) {
        await conn.execute(
          "INSERT INTO game_invites (game_id, host_user_id, player_user_id, status) VALUES (?, ?, ?, 'invited')",
          [gameId, hostUserId, player_user_id]
        );
        gameInviteCreated = true;
      }

      await conn.commit();
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }

    return ok(res, { host_player_created: hostPlayerCreated, game_invite_created: gameInviteCreated });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/games/:id/rsvps  — enhanced with summary counts + username
async function listGameRsvps(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  try {
    const [rows] = await pool.execute(
      `SELECT
         gi.id,
         gi.status,
         gi.rsvp_status,
         gi.seat_preference,
         gi.assigned_seat_number,
         gi.waitlist_position,
         gi.responded_at,
         u.display_name AS player_display_name,
         u.username     AS player_username,
         u.phone        AS player_phone,
         u.email        AS player_email
       FROM game_invites gi
       JOIN users u ON u.id = gi.player_user_id
       WHERE gi.game_id = ?
       ORDER BY
         FIELD(gi.rsvp_status,'confirmed','waitlisted','invited','declined'),
         gi.waitlist_position ASC,
         gi.id ASC`,
      [id]
    );

    const confirmed_count  = rows.filter(r => r.rsvp_status === 'confirmed').length;
    const waitlisted_count = rows.filter(r => r.rsvp_status === 'waitlisted').length;
    const declined_count   = rows.filter(r => r.rsvp_status === 'declined').length;
    const maxPlayers       = game.max_players || 9;
    const open_seats       = Math.max(0, maxPlayers - confirmed_count);

    return ok(res, {
      game: { id: game.id, title: game.title, max_players: maxPlayers, seat_assignment_enabled: game.seat_assignment_enabled },
      summary: { confirmed_count, waitlisted_count, declined_count, open_seats },
      rsvps: rows,
    });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/my/games/:id/rsvps/:inviteId  — host override of RSVP fields
async function updateRsvp(req, res) {
  const hostUserId = req.user.id;
  const { id, inviteId } = req.params;

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  const [invRows] = await pool.execute(
    'SELECT * FROM game_invites WHERE id = ? AND game_id = ?',
    [inviteId, id]
  );
  if (!invRows.length) return notFound(res, 'Invite not found');
  const invite = invRows[0];

  const { rsvp_status, seat_preference, assigned_seat_number, waitlist_position } = req.body;

  const ALLOWED_STATUSES = ['invited', 'confirmed', 'declined', 'waitlisted'];
  if (rsvp_status !== undefined && !ALLOWED_STATUSES.includes(rsvp_status)) {
    return badRequest(res, `rsvp_status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  // Determine final values
  let finalStatus           = rsvp_status           !== undefined ? rsvp_status           : invite.rsvp_status;
  let finalSeatPref         = seat_preference        !== undefined ? seat_preference        : invite.seat_preference;
  let finalSeatNum          = assigned_seat_number   !== undefined ? assigned_seat_number   : invite.assigned_seat_number;
  let finalWaitlistPos      = waitlist_position      !== undefined ? waitlist_position      : invite.waitlist_position;

  // Clear seat when moving off confirmed
  if (finalStatus === 'declined' || finalStatus === 'waitlisted') {
    finalSeatNum = null;
  }
  if (finalStatus === 'waitlisted' && finalWaitlistPos == null) {
    finalWaitlistPos = invite.waitlist_position; // keep if already set
  }

  // Validate seat number if being assigned
  if (finalSeatNum != null) {
    if (finalStatus !== 'confirmed') {
      return badRequest(res, 'assigned_seat_number can only be set when rsvp_status is confirmed');
    }
    const maxPlayers = game.max_players || 9;
    const seatErr = await validateSeat(id, Number(finalSeatNum), maxPlayers, invite.id);
    if (seatErr) return badRequest(res, seatErr);
  }

  // When a confirmed player loses their seat, auto-promote the top waitlist player
  const seatOpens = invite.rsvp_status === 'confirmed' && finalStatus !== 'confirmed';

  if (!seatOpens) {
    try {
      await pool.execute(
        `UPDATE game_invites
         SET rsvp_status = ?, seat_preference = ?, assigned_seat_number = ?,
             waitlist_position = ?, responded_at = NOW()
         WHERE id = ?`,
        [finalStatus, finalSeatPref, finalSeatNum, finalWaitlistPos, invite.id]
      );
      const [updated] = await pool.execute(
        `SELECT gi.*, u.display_name AS player_display_name, u.phone AS player_phone
         FROM game_invites gi JOIN users u ON u.id = gi.player_user_id
         WHERE gi.id = ?`,
        [invite.id]
      );
      return ok(res, updated[0]);
    } catch (err) {
      return serverError(res, err);
    }
  }

  // Auto-promotion path — use a transaction
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE game_invites
       SET rsvp_status = ?, seat_preference = ?, assigned_seat_number = ?,
           waitlist_position = ?, responded_at = NOW()
       WHERE id = ?`,
      [finalStatus, finalSeatPref, finalSeatNum, finalWaitlistPos, invite.id]
    );

    // Find the top waitlist player
    const [wl] = await conn.execute(
      `SELECT id FROM game_invites
       WHERE game_id = ? AND rsvp_status = 'waitlisted'
       ORDER BY waitlist_position ASC, id ASC
       LIMIT 1`,
      [id]
    );

    let autoPromotedId = null;
    if (wl.length) {
      autoPromotedId = wl[0].id;
      await conn.execute(
        `UPDATE game_invites
         SET rsvp_status = 'confirmed', waitlist_position = NULL, responded_at = NOW()
         WHERE id = ?`,
        [autoPromotedId]
      );
      await renumberWaitlist(id, conn);
    }

    await conn.commit();

    // Notify auto-promoted player
    if (autoPromotedId) {
      const [promoInv] = await pool.execute(
        'SELECT player_user_id FROM game_invites WHERE id = ?', [autoPromotedId]
      );
      if (promoInv.length) {
        createNotification(promoInv[0].player_user_id, {
          type: 'promoted_from_waitlist',
          title: 'You got a seat!',
          body: `You've been promoted from the waitlist for "${game.title}"`,
          relatedEntityType: 'game',
          relatedEntityId: id,
        }).catch(() => {});
      }
    }

    const [updated] = await pool.execute(
      `SELECT gi.*, u.display_name AS player_display_name, u.phone AS player_phone
       FROM game_invites gi JOIN users u ON u.id = gi.player_user_id
       WHERE gi.id = ?`,
      [invite.id]
    );
    return ok(res, { ...updated[0], auto_promoted_invite_id: autoPromotedId });
  } catch (err) {
    await conn.rollback();
    return serverError(res, err);
  } finally {
    conn.release();
  }
}

// POST /api/my/games/:id/assign-seat
async function assignSeat(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { invite_id, seat_number } = req.body;

  if (!invite_id || seat_number == null) {
    return badRequest(res, 'invite_id and seat_number are required');
  }

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  const [invRows] = await pool.execute(
    'SELECT * FROM game_invites WHERE id = ? AND game_id = ?',
    [invite_id, id]
  );
  if (!invRows.length) return notFound(res, 'Invite not found');

  const maxPlayers = game.max_players || 9;
  const seatErr = await validateSeat(id, Number(seat_number), maxPlayers, invite_id);
  if (seatErr) return badRequest(res, seatErr);

  try {
    await pool.execute(
      `UPDATE game_invites
       SET rsvp_status = 'confirmed', assigned_seat_number = ?, waitlist_position = NULL
       WHERE id = ?`,
      [seat_number, invite_id]
    );
    return ok(res, { invite_id, assigned_seat_number: seat_number, rsvp_status: 'confirmed' });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/games/:id/clear-seat
async function clearSeat(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { invite_id } = req.body;

  if (!invite_id) return badRequest(res, 'invite_id is required');

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  const [invRows] = await pool.execute(
    'SELECT id FROM game_invites WHERE id = ? AND game_id = ?',
    [invite_id, id]
  );
  if (!invRows.length) return notFound(res, 'Invite not found');

  try {
    await pool.execute(
      'UPDATE game_invites SET assigned_seat_number = NULL WHERE id = ?',
      [invite_id]
    );
    return ok(res, { invite_id, assigned_seat_number: null });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/my/games/:id/promote-waitlist
async function promoteWaitlist(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { invite_id, seat_number } = req.body;

  if (!invite_id) return badRequest(res, 'invite_id is required');

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  const [invRows] = await pool.execute(
    'SELECT * FROM game_invites WHERE id = ? AND game_id = ?',
    [invite_id, id]
  );
  if (!invRows.length) return notFound(res, 'Invite not found');
  if (invRows[0].rsvp_status !== 'waitlisted') {
    return badRequest(res, 'Player must be waitlisted to be promoted');
  }

  let finalSeat = null;
  if (seat_number != null) {
    const maxPlayers = game.max_players || 9;
    const seatErr = await validateSeat(id, Number(seat_number), maxPlayers, invite_id);
    if (seatErr) return badRequest(res, seatErr);
    finalSeat = seat_number;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE game_invites
       SET rsvp_status = 'confirmed', waitlist_position = NULL,
           assigned_seat_number = ?, responded_at = NOW()
       WHERE id = ?`,
      [finalSeat, invite_id]
    );

    // Re-number remaining waitlist
    await renumberWaitlist(id, conn);

    await conn.commit();

    // Notify the promoted player
    createNotification(invRows[0].player_user_id, {
      type: 'promoted_from_waitlist',
      title: 'You got a seat!',
      body: `You've been promoted from the waitlist for "${game.title}"`,
      relatedEntityType: 'game',
      relatedEntityId: id,
    }).catch(() => {});

    return ok(res, { promoted_invite_id: invite_id, assigned_seat_number: finalSeat, rsvp_status: 'confirmed' });
  } catch (err) {
    await conn.rollback();
    return serverError(res, err);
  } finally {
    conn.release();
  }
}

// POST /api/my/games/:id/reorder-waitlist
async function reorderWaitlist(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { ordered_invite_ids } = req.body;

  if (!Array.isArray(ordered_invite_ids) || ordered_invite_ids.length === 0) {
    return badRequest(res, 'ordered_invite_ids must be a non-empty array');
  }

  const game = await ownershipCheck(id, hostUserId);
  if (!game) return notFound(res, 'Game not found');

  // Verify all invites belong to this game and are waitlisted
  const placeholders = ordered_invite_ids.map(() => '?').join(',');
  const [invRows] = await pool.execute(
    `SELECT id, rsvp_status FROM game_invites WHERE game_id = ? AND id IN (${placeholders})`,
    [id, ...ordered_invite_ids]
  );

  if (invRows.length !== ordered_invite_ids.length) {
    return badRequest(res, 'One or more invite IDs are invalid or do not belong to this game');
  }
  const nonWaitlisted = invRows.filter(r => r.rsvp_status !== 'waitlisted');
  if (nonWaitlisted.length) {
    return badRequest(res, 'All invites in ordered_invite_ids must have rsvp_status = waitlisted');
  }

  try {
    for (let i = 0; i < ordered_invite_ids.length; i++) {
      await pool.execute(
        'UPDATE game_invites SET waitlist_position = ? WHERE id = ?',
        [i + 1, ordered_invite_ids[i]]
      );
    }
    return ok(res, { reordered_count: ordered_invite_ids.length });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = {
  createGame,
  listMyGames,
  getMyGame,
  updateMyGame,
  invitePlayer,
  inviteFromHostList,
  listGameInvites,
  cancelInvite,
  addPlayerToGame,
  listGameRsvps,
  updateRsvp,
  assignSeat,
  clearSeat,
  promoteWaitlist,
  reorderWaitlist,
};
