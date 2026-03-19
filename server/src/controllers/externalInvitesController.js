'use strict';

const pool = require('../config/db');
const { generateInviteCode } = require('../utils/inviteCode');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// POST /api/external-invites
async function createInvite(req, res) {
  const hostUserId = req.user.id;
  const {
    game_id,
    host_contact_id,
    recipient_phone,
    recipient_email,
    channel = 'manual',
    expires_at,
    // optional: create a new host_contact on the fly
    contact_display_name,
  } = req.body;

  try {
    let contactId = host_contact_id || null;

    // If no existing contact but a name was supplied, auto-create one
    if (!contactId && contact_display_name) {
      const [ins] = await pool.execute(
        `INSERT INTO host_contacts (host_user_id, display_name, phone, email, source, status)
         VALUES (?, ?, ?, ?, 'invite', 'invited')`,
        [hostUserId, contact_display_name.trim(), recipient_phone || null, recipient_email || null]
      );
      contactId = ins.insertId;
    }

    const code = generateInviteCode();
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:8081';
    const inviteUrl = `${baseUrl}/invite/${code}`;

    const [result] = await pool.execute(
      `INSERT INTO external_invites
         (host_user_id, host_contact_id, game_id, invite_code, invite_url,
          channel, status, recipient_phone, recipient_email, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, 'generated', ?, ?, ?)`,
      [
        hostUserId,
        contactId,
        game_id || null,
        code,
        inviteUrl,
        channel,
        recipient_phone || null,
        recipient_email || null,
        expires_at || null,
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM external_invites WHERE id = ?',
      [result.insertId]
    );

    return ok(res, { invite: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/external-invites
async function listInvites(req, res) {
  const hostUserId = req.user.id;
  const { status, game_id } = req.query;

  let sql = 'SELECT * FROM external_invites WHERE host_user_id = ?';
  const params = [hostUserId];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (game_id) {
    sql += ' AND game_id = ?';
    params.push(game_id);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { invites: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/external-invites/:id
async function getInvite(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM external_invites WHERE id = ? AND host_user_id = ?',
      [id, hostUserId]
    );

    if (!rows.length) return notFound(res, 'Invite not found');
    return ok(res, { invite: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/invites/:inviteCode  — PUBLIC, no auth
async function getInvitePreview(req, res) {
  const { inviteCode } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT ei.*,
              u.display_name AS host_display_name,
              g.title        AS game_name,
              g.starts_at    AS game_date
       FROM external_invites ei
       JOIN users u ON u.id = ei.host_user_id
       LEFT JOIN games g ON g.id = ei.game_id
       WHERE ei.invite_code = ?`,
      [inviteCode]
    );

    if (!rows.length) return notFound(res, 'Invite not found');

    const invite = rows[0];

    if (invite.status === 'expired' || invite.status === 'cancelled') {
      return ok(res, { valid: false, reason: invite.status, invite });
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      // Mark expired lazily
      await pool.execute(
        "UPDATE external_invites SET status = 'expired' WHERE id = ?",
        [invite.id]
      );
      return ok(res, { valid: false, reason: 'expired', invite });
    }

    return ok(res, { valid: true, invite });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/invites/:inviteCode/accept  — AUTH required
async function acceptInvite(req, res) {
  const userId = req.user.id;
  const { inviteCode } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM external_invites WHERE invite_code = ?',
      [inviteCode]
    );

    if (!rows.length) return notFound(res, 'Invite not found');

    const invite = rows[0];

    if (invite.status === 'accepted') {
      return badRequest(res, 'Invite has already been accepted');
    }
    if (invite.status === 'expired' || invite.status === 'cancelled') {
      return badRequest(res, `Invite is ${invite.status}`);
    }
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      await pool.execute(
        "UPDATE external_invites SET status = 'expired' WHERE id = ?",
        [invite.id]
      );
      return badRequest(res, 'Invite has expired');
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Mark invite accepted
      await conn.execute(
        `UPDATE external_invites
         SET status = 'accepted', registered_user_id = ?, accepted_at = NOW()
         WHERE id = ?`,
        [userId, invite.id]
      );

      // Link contact to registered user if contact exists
      if (invite.host_contact_id) {
        await conn.execute(
          `UPDATE host_contacts
           SET registered_user_id = ?, status = 'registered'
           WHERE id = ?`,
          [userId, invite.host_contact_id]
        );
      }

      // Add to host_players if not already there
      if (invite.host_user_id) {
        await conn.execute(
          `INSERT IGNORE INTO host_players (host_user_id, player_user_id)
           VALUES (?, ?)`,
          [invite.host_user_id, userId]
        );
      }

      // Add to game_invites if a game is attached and not already present
      if (invite.game_id) {
        const [existing] = await conn.execute(
          'SELECT id FROM game_invites WHERE game_id = ? AND player_user_id = ?',
          [invite.game_id, userId]
        );

        if (!existing.length) {
          await conn.execute(
            `INSERT INTO game_invites (game_id, host_user_id, player_user_id, status)
             VALUES (?, ?, ?, 'accepted')`,
            [invite.game_id, invite.host_user_id, userId]
          );
        } else {
          await conn.execute(
            "UPDATE game_invites SET status = 'accepted', responded_at = NOW() WHERE game_id = ? AND player_user_id = ?",
            [invite.game_id, userId]
          );
        }
      }

      await conn.commit();
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }

    return ok(res, { message: 'Invite accepted successfully' });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { createInvite, listInvites, getInvite, getInvitePreview, acceptInvite };
