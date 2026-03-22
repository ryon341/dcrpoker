// ─── Challenge selector — tier-bank queue + anti-repeat (TC071) ───────────────

import type { ChallengeTier, ChallengeQuestion } from './challengeQuestionTypes';
import {
  getQuestionsForGlobalLevel,
  getTierForGlobalLevel,
} from './data/tierQuestionBanks';

/** Maps a 1-based global level to the canonical challenge tier. */
export function getPoolForLevel(level: number): ChallengeTier {
  return getTierForGlobalLevel(level);
}

// ── Session state ─────────────────────────────────────────────────────────────

export type ChallengeSessionState = {
  remainingIds: string[];
  recentIds:    string[];
};

/** Fisher-Yates in-place shuffle (returns mutated array). */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function poolForLevel(level: number): ChallengeQuestion[] {
  return getQuestionsForGlobalLevel(level);
}

/**
 * How many recent IDs to exclude based on pool size.
 * Degrades gracefully for small pools.
 */
function recentWindowSize(poolSize: number): number {
  if (poolSize >= 10) return 8;
  if (poolSize >= 5)  return 3;
  return 1; // only prevent immediate repeat
}

/**
 * Create a fresh session for a given global level.
 * The queue is shuffled once and consumed sequentially.
 */
export function initSession(level: number): ChallengeSessionState {
  const pool = poolForLevel(level);
  const ids  = shuffle(pool.map(c => c.id));
  return { remainingIds: ids, recentIds: [] };
}

/**
 * Returns the next challenge from the session, advancing internal state.
 * Mutates `session` in place and returns the selected Challenge.
 *
 * Anti-repeat rules:
 *  - Questions are served from a shuffled queue (no `Math.random()` per pick).
 *  - After the queue is exhausted it refills and reshuffles.
 *  - After reshuffle, the first item must not match the last served question.
 *  - While there are enough questions, none from `recentIds` are served.
 */
export function getNextFromSession(
  session: ChallengeSessionState,
  level: number,
): ChallengeQuestion {
  const pool    = poolForLevel(level);
  const poolMap = new Map(pool.map(c => [c.id, c]));
  const window  = recentWindowSize(pool.length);

  // Refill queue if empty
  if (session.remainingIds.length === 0) {
    const refilled = shuffle(pool.map(c => c.id));
    // Ensure the first item after reshuffle differs from the last served question
    const lastServed = session.recentIds[session.recentIds.length - 1];
    if (refilled[0] === lastServed && refilled.length > 1) {
      // Swap with a random other position
      const swapIdx = Math.floor(Math.random() * (refilled.length - 1)) + 1;
      [refilled[0], refilled[swapIdx]] = [refilled[swapIdx], refilled[0]];
    }
    session.remainingIds = refilled;
  }

  // Find the first remaining ID not in the recent window (if possible)
  const recent = session.recentIds.slice(-window);
  let pickedIdx = session.remainingIds.findIndex(id => !recent.includes(id));
  if (pickedIdx === -1) {
    // All remaining are in recent window — just take the first (pool too small)
    pickedIdx = 0;
  }

  const [pickedId] = session.remainingIds.splice(pickedIdx, 1);

  // Update recent history (cap at window+2 for memory efficiency)
  session.recentIds.push(pickedId);
  if (session.recentIds.length > window + 2) {
    session.recentIds.shift();
  }

  return poolMap.get(pickedId)!;
}

// ── Legacy single-call API (used by existing handleContinue path) ─────────────

/**
 * Stateless helper kept for compatibility where a full session object is not
 * available.  Prefers fresh questions outside the last-15 history window but
 * falls back to the full pool.  Does NOT guarantee a shuffled sequence —
 * migrate callers to `initSession / getNextFromSession` for full protection.
 */
export function getNextChallenge({
  level,
  history,
}: {
  level: number;
  history: string[];
}): ChallengeQuestion {
  const pool   = poolForLevel(level);
  const window = recentWindowSize(pool.length);
  const recent = history.slice(-window);
  const fresh  = pool.filter(c => !recent.includes(c.id));
  const source = fresh.length > 0 ? fresh : pool;
  // Avoid immediate repeat: also remove the very last history entry from source
  const last    = history[history.length - 1];
  const safe    = source.filter(c => c.id !== last);
  const bucket  = safe.length > 0 ? safe : source;
  return bucket[Math.floor(Math.random() * bucket.length)];
}

