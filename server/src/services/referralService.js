'use strict';

const crypto = require('crypto');
const pool   = require('../config/db');

/**
 * Return a random uppercase DCR referral code, e.g. DCRA3F9B21.
 */
function generateCode() {
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `DCR${suffix}`;
}

/**
 * Return the active referral code for a host, creating one if none exists.
 */
async function getOrCreateReferralCode(hostUserId) {
  const [rows] = await pool.execute(
    `SELECT referral_code FROM host_referral_codes
      WHERE host_user_id = ? AND is_active = 1
      ORDER BY id DESC LIMIT 1`,
    [hostUserId]
  );

  if (rows.length > 0) return rows[0].referral_code;

  // Generate a unique code
  let code;
  let attempts = 0;
  while (true) {
    code = generateCode();
    const [existing] = await pool.execute(
      'SELECT id FROM host_referral_codes WHERE referral_code = ?',
      [code]
    );
    if (existing.length === 0) break;
    if (++attempts > 10) throw new Error('Could not generate unique referral code');
  }

  await pool.execute(
    `INSERT INTO host_referral_codes (host_user_id, referral_code, is_active)
     VALUES (?, ?, 1)`,
    [hostUserId, code]
  );

  return code;
}

/**
 * Look up who owns a given referral code.
 * Returns { host_user_id, referral_code } or null.
 */
async function findReferralCode(code) {
  const [rows] = await pool.execute(
    `SELECT host_user_id, referral_code
       FROM host_referral_codes
      WHERE referral_code = ? AND is_active = 1`,
    [code]
  );
  return rows[0] || null;
}

/**
 * Apply a referral code to a referred host.
 * Creates a host_referrals row with status 'pending'.
 * Throws descriptive errors if invalid/already applied.
 */
async function applyReferralCode(referredHostUserId, code) {
  const codeRow = await findReferralCode(code);
  if (!codeRow) throw Object.assign(new Error('Referral code not found'), { status: 404 });

  if (codeRow.host_user_id === referredHostUserId) {
    throw Object.assign(new Error('You cannot use your own referral code'), { status: 400 });
  }

  // Check if already referred
  const [existing] = await pool.execute(
    'SELECT id FROM host_referrals WHERE referred_host_user_id = ?',
    [referredHostUserId]
  );
  if (existing.length > 0) {
    throw Object.assign(new Error('A referral has already been applied to your account'), { status: 409 });
  }

  const [result] = await pool.execute(
    `INSERT INTO host_referrals
       (referrer_host_user_id, referred_host_user_id, referral_code, status)
     VALUES (?, ?, ?, 'pending')`,
    [codeRow.host_user_id, referredHostUserId, code]
  );

  return { id: result.insertId, referrerHostUserId: codeRow.host_user_id, status: 'pending' };
}

/**
 * Get referral summary for a host (as the referrer).
 */
async function getReferralSummary(hostUserId) {
  const [rows] = await pool.execute(
    `SELECT hr.id, hr.referred_host_user_id, hr.status, hr.created_at,
            u.display_name, u.phone
       FROM host_referrals hr
       JOIN users u ON u.id = hr.referred_host_user_id
      WHERE hr.referrer_host_user_id = ?
      ORDER BY hr.created_at DESC`,
    [hostUserId]
  );

  const total     = rows.length;
  const qualified = rows.filter(r => r.status === 'qualified').length;
  const credited  = rows.filter(r => r.status === 'credited').length;

  return {
    summary: { totalReferred: total, qualified, credited },
    referredHosts: rows.map(r => ({
      id:           r.referred_host_user_id,
      display_name: r.display_name,
      phone:        r.phone,
      status:       r.status,
      created_at:   r.created_at,
    })),
  };
}

module.exports = { getOrCreateReferralCode, findReferralCode, applyReferralCode, getReferralSummary };
