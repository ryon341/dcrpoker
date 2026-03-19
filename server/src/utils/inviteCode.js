'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Generates a compact, URL-safe invite code by stripping dashes from a UUIDv4.
 * Returns a 32-character hex string, e.g. "a1b2c3d4e5f6..."
 */
function generateInviteCode() {
  return uuidv4().replace(/-/g, '');
}

module.exports = { generateInviteCode };
