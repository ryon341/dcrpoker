'use strict';

const twilio = require('twilio');

/**
 * Lazily initialise the Twilio client so the server starts even if Twilio
 * credentials are not yet configured (they will fail at send-time instead).
 */
let _client = null;
function getClient() {
  if (!_client) {
    _client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return _client;
}

const FROM = () => process.env.TWILIO_PHONE_NUMBER;

/**
 * Send one SMS message via Twilio.
 * @param {Object} opts
 * @param {string} opts.to   - E.164 recipient phone number
 * @param {string} opts.body - Message text
 * @returns {{ success: boolean, messageId?: string, status?: string, error?: string }}
 */
async function sendSms({ to, body }) {
  try {
    const message = await getClient().messages.create({
      to,
      from: FROM(),
      body,
    });
    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Twilio send failed',
    };
  }
}

module.exports = { sendSms };
