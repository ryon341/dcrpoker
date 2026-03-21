// ─── Challenge selector — level-based pool routing + anti-repeat (TC051) ─────

import type { Challenge, DifficultyTier } from './challengeTypes';
import {
  BEGINNER_POOL,
  EASY_POOL,
  INTERMEDIATE_POOL,
  ADVANCED_POOL,
  EXPERT_POOL,
} from './challengePools';

const POOLS: Record<DifficultyTier, Challenge[]> = {
  beginner:     BEGINNER_POOL,
  easy:         EASY_POOL,
  intermediate: INTERMEDIATE_POOL,
  advanced:     ADVANCED_POOL,
  expert:       EXPERT_POOL,
};

/** Maps a 1-based level number to a difficulty tier. */
export function getPoolForLevel(level: number): DifficultyTier {
  if (level <= 3)  return 'beginner';
  if (level <= 6)  return 'easy';
  if (level <= 12) return 'intermediate';
  if (level <= 18) return 'advanced';
  return 'expert';
}

/**
 * Returns a challenge for the given level that doesn't appear in the recent
 * history window (last 15 IDs). Falls back to the full pool if all challenges
 * have been seen.
 */
export function getNextChallenge({
  level,
  history,
}: {
  level: number;
  history: string[];
}): Challenge {
  const tier   = getPoolForLevel(level);
  const pool   = POOLS[tier];
  const recent = history.slice(-15);
  const fresh  = pool.filter(c => !recent.includes(c.id));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(Math.random() * source.length)];
}
