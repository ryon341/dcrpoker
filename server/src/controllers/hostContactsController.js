'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// POST /api/host-contacts
async function createContact(req, res) {
  const hostUserId = req.user.id;
  const { display_name, phone, email, source = 'manual', notes } = req.body;

  if (!display_name || display_name.trim() === '') {
    return badRequest(res, 'display_name is required');
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO host_contacts (host_user_id, display_name, phone, email, source, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [hostUserId, display_name.trim(), phone || null, email || null, source, notes || null]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM host_contacts WHERE id = ?',
      [result.insertId]
    );

    return ok(res, { contact: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/host-contacts
async function listContacts(req, res) {
  const hostUserId = req.user.id;
  const { status, source } = req.query;

  let sql = 'SELECT * FROM host_contacts WHERE host_user_id = ?';
  const params = [hostUserId];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { contacts: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/host-contacts/:id
async function getContact(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM host_contacts WHERE id = ? AND host_user_id = ?',
      [id, hostUserId]
    );

    if (!rows.length) return notFound(res, 'Contact not found');
    return ok(res, { contact: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/host-contacts/:id
async function updateContact(req, res) {
  const hostUserId = req.user.id;
  const { id } = req.params;
  const { display_name, phone, email, status, notes } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM host_contacts WHERE id = ? AND host_user_id = ?',
      [id, hostUserId]
    );

    if (!rows.length) return notFound(res, 'Contact not found');

    const allowed = ['imported', 'invited', 'registered', 'declined', 'unsubscribed'];
    if (status && !allowed.includes(status)) {
      return badRequest(res, `status must be one of: ${allowed.join(', ')}`);
    }

    const current = rows[0];
    const newDisplayName = display_name !== undefined ? display_name.trim() : current.display_name;
    const newPhone      = phone   !== undefined ? phone   : current.phone;
    const newEmail      = email   !== undefined ? email   : current.email;
    const newStatus     = status  !== undefined ? status  : current.status;
    const newNotes      = notes   !== undefined ? notes   : current.notes;

    await pool.execute(
      `UPDATE host_contacts
       SET display_name = ?, phone = ?, email = ?, status = ?, notes = ?
       WHERE id = ?`,
      [newDisplayName, newPhone, newEmail, newStatus, newNotes, id]
    );

    const [updated] = await pool.execute(
      'SELECT * FROM host_contacts WHERE id = ?',
      [id]
    );

    return ok(res, { contact: updated[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/host-contacts/bulk
async function bulkCreateContacts(req, res) {
  const hostUserId = req.user.id;
  const { contacts } = req.body;

  if (!Array.isArray(contacts) || contacts.length === 0) {
    return badRequest(res, 'contacts must be a non-empty array');
  }

  // Fetch existing phones/emails for this host to detect duplicates
  const [existing] = await pool.execute(
    'SELECT phone, email FROM host_contacts WHERE host_user_id = ?',
    [hostUserId]
  );
  const existingPhones = new Set(existing.map((r) => r.phone).filter(Boolean));
  const existingEmails = new Set(existing.map((r) => r.email).filter(Boolean));

  const inserted = [];
  const invalid = [];
  const duplicates = [];

  for (let i = 0; i < contacts.length; i++) {
    const row = contacts[i];
    const rowNum = i + 1;

    const displayName = (row.display_name || '').trim();
    const phone = row.phone ? row.phone.trim() : null;
    const email = row.email ? row.email.trim().toLowerCase() : null;
    const source = row.source || 'csv';
    const notes = row.notes ? row.notes.trim() : null;

    if (!displayName) {
      invalid.push({ row: rowNum, reason: 'display_name is required' });
      continue;
    }
    if (!phone && !email) {
      invalid.push({ row: rowNum, reason: 'phone or email is required' });
      continue;
    }

    // Duplicate check
    if (phone && existingPhones.has(phone)) {
      duplicates.push({ row: rowNum, reason: 'phone already exists in your contacts' });
      continue;
    }
    if (email && existingEmails.has(email)) {
      duplicates.push({ row: rowNum, reason: 'email already exists in your contacts' });
      continue;
    }

    try {
      const [result] = await pool.execute(
        `INSERT INTO host_contacts (host_user_id, display_name, phone, email, source, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [hostUserId, displayName, phone, email, source, notes]
      );
      const [newRows] = await pool.execute(
        'SELECT * FROM host_contacts WHERE id = ?',
        [result.insertId]
      );
      inserted.push(newRows[0]);
      if (phone) existingPhones.add(phone);
      if (email) existingEmails.add(email);
    } catch (err) {
      invalid.push({ row: rowNum, reason: 'Insert failed: ' + err.message });
    }
  }

  return ok(res, {
    inserted_count: inserted.length,
    invalid_count: invalid.length,
    duplicate_count: duplicates.length,
    inserted,
    invalid,
    duplicates,
  }, 201);
}

module.exports = { createContact, listContacts, getContact, updateContact, bulkCreateContacts };
