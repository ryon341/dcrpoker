const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.error('[auth] JWT_SECRET is not set in environment');
  process.exit(1);
}

/**
 * Normalise a phone string: strip spaces, dashes, parentheses.
 */
const normalizePhone = (phone) => String(phone).replace(/[\s\-().]/g, '');

/**
 * Fetch role names for a user.
 */
const getUserRoles = async (userId) => {
  const [rows] = await pool.query(
    `SELECT r.name FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map((r) => r.name);
};

/**
 * Sign a JWT for the given user.
 */
const signToken = (user, roles) =>
  jwt.sign(
    { userId: user.id, phone: user.phone, roles },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

/**
 * Register: create user if not exists, assign player role, return JWT.
 */
const register = async ({ phone, display_name, email }) => {
  const normalised = normalizePhone(phone);

  // Check if user already exists
  const [existing] = await pool.query(
    'SELECT id, phone, display_name FROM users WHERE phone = ?',
    [normalised]
  );

  if (existing.length) {
    const err = new Error('Phone number already registered');
    err.status = 409;
    throw err;
  }

  // Insert user
  const [result] = await pool.query(
    `INSERT INTO users (phone, display_name, email) VALUES (?, ?, ?)`,
    [normalised, display_name, email || null]
  );
  const userId = result.insertId;

  // Assign default 'player' role
  const [roleRows] = await pool.query(`SELECT id FROM roles WHERE name = 'player'`);
  if (roleRows.length) {
    await pool.query(
      `INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userId, roleRows[0].id]
    );
  }

  const roles = await getUserRoles(userId);
  const user = { id: userId, phone: normalised, display_name };
  const token = signToken(user, roles);

  return { user, roles, token };
};

/**
 * Login: find user by phone, return JWT.
 */
const login = async ({ phone }) => {
  const normalised = normalizePhone(phone);

  const [rows] = await pool.query(
    'SELECT id, phone, display_name, email, is_active FROM users WHERE phone = ?',
    [normalised]
  );

  if (!rows.length) {
    const err = new Error('No account found for that phone number');
    err.status = 404;
    throw err;
  }

  const user = rows[0];

  if (!user.is_active) {
    const err = new Error('Account is inactive');
    err.status = 403;
    throw err;
  }

  const roles = await getUserRoles(user.id);
  const token = signToken(user, roles);

  return { user, roles, token };
};

module.exports = { register, login };
