'use strict';

const { parseSmsCommand } = require('../services/smsParser');
const { processRsvp, normalizePhone } = require('../services/rsvpService');

/**
 * Handle an inbound Twilio SMS webhook.
 * Route: POST /api/twilio/webhook/sms
 *
 * Twilio sends application/x-www-form-urlencoded with fields:
 *   From, To, Body, MessageSid, AccountSid, …
 *
 * This endpoint is intentionally public (no JWT) — Twilio signs requests but
 * we accept openly for now. In production, add Twilio signature validation.
 *
 * Always returns HTTP 200 so Twilio doesn't retry.
 */
async function handleInboundSms(req, res) {
  try {
    const from = req.body.From || '';
    const to = req.body.To || '';
    const body = req.body.Body || '';

    const fromPhone = normalizePhone(from);
    const parsed = parseSmsCommand(body);

    await processRsvp({ fromPhone, toPhone: to, rawBody: body, parsed });
  } catch (err) {
    console.error('[smsWebhookController] Error processing inbound SMS:', err);
  }

  // Always 200 — never let Twilio retry on application errors
  return res.sendStatus(200);
}

module.exports = { handleInboundSms };
