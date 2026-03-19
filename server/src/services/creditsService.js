'use strict';

const pool = require('../config/db');

/**
 * Returns the current credit balance in cents for a host.
 * Balance = SUM of all amount_cents in host_credit_transactions.
 * Positive = credit available. Negative = in debit (shouldn't happen normally).
 */
async function getHostCreditBalanceCents(hostUserId) {
  const [rows] = await pool.execute(
    `SELECT COALESCE(SUM(amount_cents), 0) AS balance
       FROM host_credit_transactions
      WHERE host_user_id = ?`,
    [hostUserId]
  );
  return Number(rows[0].balance);
}

/**
 * Returns recent credit transactions for a host (newest first).
 */
async function getHostCreditTransactions(hostUserId, limit = 50) {
  const [rows] = await pool.execute(
    `SELECT id, type, amount_cents, description, reference_type, reference_id, created_at
       FROM host_credit_transactions
      WHERE host_user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ?`,
    [hostUserId, limit]
  );
  return rows;
}

/**
 * Add a credit transaction for a host.
 * amount_cents > 0 = credit granted, < 0 = credit consumed/reversed.
 */
async function addCreditTransaction({
  hostUserId,
  type,
  amountCents,
  description = null,
  referenceType = null,
  referenceId = null,
}) {
  const [result] = await pool.execute(
    `INSERT INTO host_credit_transactions
       (host_user_id, type, amount_cents, description, reference_type, reference_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [hostUserId, type, amountCents, description, referenceType, referenceId]
  );
  return result.insertId;
}

module.exports = { getHostCreditBalanceCents, getHostCreditTransactions, addCreditTransaction };
