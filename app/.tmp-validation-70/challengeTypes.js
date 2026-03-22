"use strict";
// ─── Challenge type definitions for DCR Poker Challenge (TC051/TC068) ─────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChallengePrompt = buildChallengePrompt;
/** Builds a compact display prompt from structured fields. */
function buildChallengePrompt(c) {
    return `6-max cash game. ${c.effectiveStackBb}bb effective. ${c.scenario} You are ${c.heroPosition}.`;
}
