'use strict';

/**
 * Parse a raw inbound SMS body into a structured RSVP command.
 *
 * Supported inputs (case-insensitive, whitespace-tolerant):
 *   YES           → { command: 'YES', seatPreference: null }
 *   YES 1         → { command: 'YES', seatPreference: '1' }
 *   YES 2         → { command: 'YES', seatPreference: '2' }
 *   YES ANY       → { command: 'YES', seatPreference: 'any' }
 *   NO            → { command: 'NO',  seatPreference: null }
 *   WAIT          → { command: 'WAIT', seatPreference: null }
 *   <anything else> → { command: 'UNKNOWN', seatPreference: null }
 *
 * @param {string} rawBody
 * @returns {{ command: string, seatPreference: string|null }}
 */
function parseSmsCommand(rawBody) {
  if (!rawBody || typeof rawBody !== 'string') {
    return { command: 'UNKNOWN', seatPreference: null };
  }

  // Normalize: uppercase, collapse spaces, trim
  const text = rawBody.trim().toUpperCase().replace(/\s+/g, ' ');

  if (text === 'NO') {
    return { command: 'NO', seatPreference: null };
  }

  if (text === 'WAIT') {
    return { command: 'WAIT', seatPreference: null };
  }

  if (text === 'YES') {
    return { command: 'YES', seatPreference: null };
  }

  if (text === 'YES 1') {
    return { command: 'YES', seatPreference: '1' };
  }

  if (text === 'YES 2') {
    return { command: 'YES', seatPreference: '2' };
  }

  if (text === 'YES ANY') {
    return { command: 'YES', seatPreference: 'any' };
  }

  return { command: 'UNKNOWN', seatPreference: null };
}

module.exports = { parseSmsCommand };
