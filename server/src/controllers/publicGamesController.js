'use strict';

const pool = require('../config/db');
const { ok, notFound, badRequest, serverError } = require('../utils/respond');

// ─── helpers ────────────────────────────────────────────────────────────────

async function isAdmin(userId) {
  const [rows] = await pool.execute(
    `SELECT r.name FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ? AND r.name = 'admin'`,
    [userId]
  );
  return rows.length > 0;
}

// ─── User endpoints ──────────────────────────────────────────────────────────

// GET /api/public-games
async function listPublicGames(req, res) {
  const { city, state, game_type, is_tournament } = req.query;

  let sql = `SELECT pg.*, pv.name AS venue_name, pv.city, pv.state, pv.address, pv.website
             FROM public_games pg
             JOIN public_venues pv ON pv.id = pg.venue_id
             WHERE pg.is_active = 1 AND pv.is_active = 1`;
  const params = [];

  if (city)  { sql += ' AND pv.city LIKE ?';    params.push(`%${city}%`); }
  if (state) { sql += ' AND pv.state = ?';       params.push(state); }
  if (game_type) { sql += ' AND pg.game_type = ?'; params.push(game_type); }
  if (is_tournament !== undefined) { sql += ' AND pg.is_tournament = ?'; params.push(is_tournament === '1' ? 1 : 0); }

  sql += ' ORDER BY pv.state, pv.city, pv.name, pg.title';

  try {
    const [rows] = await pool.execute(sql, params);
    return ok(res, { games: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/public-games/:id
async function getPublicGame(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT pg.*, pv.name AS venue_name, pv.city, pv.state, pv.address, pv.website
       FROM public_games pg
       JOIN public_venues pv ON pv.id = pg.venue_id
       WHERE pg.id = ? AND pg.is_active = 1`,
      [id]
    );
    if (!rows.length) return notFound(res, 'Game not found');
    return ok(res, { game: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── Admin endpoints ─────────────────────────────────────────────────────────

// GET /api/admin/public-venues
async function adminListVenues(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM public_venues ORDER BY state, city, name');
    return ok(res, { venues: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/admin/public-venues
async function adminCreateVenue(req, res) {
  const { name, city, state, address, website, notes } = req.body;
  if (!name || !city) return badRequest(res, 'name and city are required');
  try {
    const [result] = await pool.execute(
      'INSERT INTO public_venues (name, city, state, address, website, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [name, city, state || null, address || null, website || null, notes || null]
    );
    const [rows] = await pool.execute('SELECT * FROM public_venues WHERE id = ?', [result.insertId]);
    return ok(res, { venue: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/admin/public-venues/:id
async function adminUpdateVenue(req, res) {
  const { id } = req.params;
  const { name, city, state, address, website, notes, is_active } = req.body;
  try {
    await pool.execute(
      `UPDATE public_venues SET name = COALESCE(?, name), city = COALESCE(?, city),
       state = COALESCE(?, state), address = COALESCE(?, address), website = COALESCE(?, website),
       notes = COALESCE(?, notes), is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, city, state, address, website, notes, is_active, id]
    );
    const [rows] = await pool.execute('SELECT * FROM public_venues WHERE id = ?', [id]);
    if (!rows.length) return notFound(res, 'Venue not found');
    return ok(res, { venue: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/admin/public-games
async function adminListGames(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT pg.*, pv.name AS venue_name, pv.city, pv.state
       FROM public_games pg JOIN public_venues pv ON pv.id = pg.venue_id
       ORDER BY pv.state, pv.city, pg.title`
    );
    return ok(res, { games: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/admin/public-games
async function adminCreateGame(req, res) {
  const { venue_id, title, game_type, stake, schedule_text, buy_in, is_tournament, notes } = req.body;
  if (!venue_id || !title) return badRequest(res, 'venue_id and title are required');
  try {
    const [result] = await pool.execute(
      `INSERT INTO public_games (venue_id, title, game_type, stake, schedule_text, buy_in, is_tournament, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [venue_id, title, game_type || null, stake || null, schedule_text || null,
       buy_in || null, is_tournament ? 1 : 0, notes || null]
    );
    const [rows] = await pool.execute(
      `SELECT pg.*, pv.name AS venue_name, pv.city, pv.state FROM public_games pg
       JOIN public_venues pv ON pv.id = pg.venue_id WHERE pg.id = ?`,
      [result.insertId]
    );
    return ok(res, { game: rows[0] }, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// PATCH /api/admin/public-games/:id
async function adminUpdateGame(req, res) {
  const { id } = req.params;
  const { venue_id, title, game_type, stake, schedule_text, buy_in, is_tournament, notes, is_active } = req.body;
  try {
    await pool.execute(
      `UPDATE public_games SET
       venue_id = COALESCE(?, venue_id), title = COALESCE(?, title),
       game_type = COALESCE(?, game_type), stake = COALESCE(?, stake),
       schedule_text = COALESCE(?, schedule_text), buy_in = COALESCE(?, buy_in),
       is_tournament = COALESCE(?, is_tournament), notes = COALESCE(?, notes),
       is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [venue_id, title, game_type, stake, schedule_text, buy_in,
       is_tournament === undefined ? null : (is_tournament ? 1 : 0),
       notes, is_active, id]
    );
    const [rows] = await pool.execute(
      `SELECT pg.*, pv.name AS venue_name, pv.city, pv.state FROM public_games pg
       JOIN public_venues pv ON pv.id = pg.venue_id WHERE pg.id = ?`,
      [id]
    );
    if (!rows.length) return notFound(res, 'Game not found');
    return ok(res, { game: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// ─── Admin middleware check ───────────────────────────────────────────────────

async function requireAdmin(req, res, next) {
  const admin = await isAdmin(req.user.id).catch(() => false);
  if (!admin) return res.status(403).json({ ok: false, error: 'Admin access required' });
  next();
}

module.exports = {
  listPublicGames, getPublicGame,
  adminListVenues, adminCreateVenue, adminUpdateVenue,
  adminListGames, adminCreateGame, adminUpdateGame,
  requireAdmin,
};
