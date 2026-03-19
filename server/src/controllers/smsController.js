'use strict';

const pool = require('../config/db');
const { sendSms } = require('../services/smsService');
const { checkAndIncrementUsage } = require('../middleware/usageLimit');
const { ok, badRequest, serverError } = require('../utils/respond');

/** Normalise a phone number: keep digits and leading +. */
function normalizePhone(raw) {
  // Remove spaces, dashes, parentheses, dots
  let n = raw.replace(/[\s\-().]/g, '');
  // Ensure it has a + prefix for E.164; if it starts with digits assume US +1
  if (n && !n.startsWith('+')) {
    n = '+1' + n;
  }
  return n;
}

/**
 * POST /api/sms/send
 * Body: { recipients: string[], message: string }
 *
 * Sends one SMS per recipient, logs each attempt, updates usage, and
 * returns a summary.
 */
async function sendBatch(req, res) {
  const hostUserId = req.user.id;
  const { recipients, message } = req.body;

  // ── Validation ────────────────────────────────────────────────────────────
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return badRequest(res, 'recipients must be a non-empty array of phone numbers');
  }
  if (!message || !message.trim()) {
    return badRequest(res, 'message is required');
  }

  const normalised = recipients
    .map((r) => normalizePhone(String(r).trim()))
    .filter(Boolean);

  if (normalised.length === 0) {
    return badRequest(res, 'No valid phone numbers provided');
  }

  // ── Send loop ─────────────────────────────────────────────────────────────
  let sentCount   = 0;
  let failedCount = 0;
  const logs = [];

  for (const phone of normalised) {
    const result = await sendSms({ to: phone, body: message.trim() });

    if (result.success) {
      sentCount++;
      logs.push({
        to: phone,
        status: result.status || 'sent',
        provider_message_id: result.messageId || null,
        error_message: null,
      });
    } else {
      failedCount++;
      logs.push({
        to: phone,
        status: 'failed',
        provider_message_id: null,
        error_message: result.error || 'Unknown error',
      });
    }
  }

  // ── Log to DB ─────────────────────────────────────────────────────────────
  try {
    for (const log of logs) {
      await pool.execute(
        `INSERT INTO sms_messages
           (host_user_id, to_phone, message_body, provider, provider_message_id, status, error_message)
         VALUES (?, ?, ?, 'twilio', ?, ?, ?)`,
        [hostUserId, log.to, message.trim(), log.provider_message_id, log.status, log.error_message]
      );
    }
  } catch (dbErr) {
    // Non-fatal: messages were (or weren't) sent — log and continue
    console.error('[smsController] DB log error:', dbErr.message);
  }

  // ── Update usage ─────────────────────────────────────────────────────────
  let usage;
  try {
    usage = await checkAndIncrementUsage(hostUserId, sentCount);
  } catch (usageErr) {
    console.error('[smsController] Usage update error:', usageErr.message);
    usage = { currentUsage: 0, limit: 500, overage: false };
  }

  // ── Response ──────────────────────────────────────────────────────────────
  return ok(res, {
    sent_count:   sentCount,
    failed_count: failedCount,
    usage: {
      current: usage.currentUsage,
      limit:   usage.limit,
      overage: usage.overage,
    },
  });
}

module.exports = { sendBatch };
