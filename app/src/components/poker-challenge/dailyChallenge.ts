// ─── Daily Challenge — seeded deterministic hand selection (TC057) ────────────

import type { Challenge } from './challengeTypes';
import {
  BEGINNER_POOL,
  EASY_POOL,
  INTERMEDIATE_POOL,
  ADVANCED_POOL,
  EXPERT_POOL,
} from './challengePools';

export const DAILY_HAND_COUNT = 5;

/** Returns today's date string as YYYY-MM-DD in local time. */
export function getTodayDateString(): string {
  const d   = new Date();
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Daily challenge ID — just the date string. */
export function getDailyChallengeId(dateString: string): string {
  return dateString;
}

/** FNV-1a 32-bit hash of a string → unsigned integer. */
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Simple LCG PRNG seeded with an unsigned 32-bit integer. */
function makeRng(seed: number): () => number {
  let s = seed === 0 ? 1 : seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

/** Fisher-Yates shuffle using a seeded RNG derived from `seed` string. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  const rng = makeRng(hashString(seed));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns exactly 5 challenges for a given date string:
 * 1 from each difficulty tier (beginner, easy, intermediate, advanced, expert).
 * The selection is fully deterministic — same date always yields same 5 hands.
 */
export function getDailyChallengeSet(dateString: string): Challenge[] {
  const tiers = [
    { pool: BEGINNER_POOL,     tierSeed: `${dateString}-b` },
    { pool: EASY_POOL,         tierSeed: `${dateString}-e` },
    { pool: INTERMEDIATE_POOL, tierSeed: `${dateString}-i` },
    { pool: ADVANCED_POOL,     tierSeed: `${dateString}-a` },
    { pool: EXPERT_POOL,       tierSeed: `${dateString}-x` },
  ];
  return tiers.map(({ pool, tierSeed }) => seededShuffle(pool, tierSeed)[0]);
}
