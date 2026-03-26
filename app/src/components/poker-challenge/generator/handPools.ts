// ─── TC090.5 — Hand Pools ─────────────────────────────────────────────────────
// Curated hand pools by category for tier-aware generation.
// All hands are in standard poker notation (e.g. 'AKs', 'QJo', 'TT').

import type { TierKey } from './generatorTypes';

// ── Core hand buckets ─────────────────────────────────────────────────────────
export const PREMIUM_HANDS       = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'] as const;
export const BROADWAY_HANDS      = ['TT', 'AQs', 'AQo', 'AJs', 'AJo', 'KQs', 'KQo', 'KJs', 'QJs', 'JTs', 'ATo', 'KTo', 'KJs', 'QJs'] as const;
export const SUITED_CONNECTORS   = ['T9s', '98s', '87s', '76s', '65s', '54s'] as const;
export const SUITED_ACES         = ['ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s'] as const;
export const MEDIUM_PAIRS        = ['99', '88', '77', '66'] as const;
export const SMALL_PAIRS         = ['55', '44', '33', '22'] as const;
export const MARGINAL_HANDS      = ['KJo', 'KTo', 'QJo', 'J9s', 'K9s', 'T8s', 'Q9s', '86s'] as const;
export const DOMINATED_HANDS     = ['K3o', 'K4o', 'Q5o', 'Q6o', 'Q7o', 'J6o', 'J7o', 'J8o', 'T5o', 'T6o', '96o', '85o', '74o'] as const;
export const TRASH_HANDS         = ['72o', '83o', '94o', 'T3o', 'J4o', 'Q5o', '62o', '73o', '84o', '95o', 'T2o', '63o', '52o', '42o'] as const;

/** Returns [raise, call, fold] hand pools for the given tier. */
export function getTierActionHandPools(tier: TierKey): {
  raise: string[];
  call: string[];
  fold: string[];
} {
  switch (tier) {
    case 'Beginner':
      return {
        raise: [...PREMIUM_HANDS, 'TT', 'AQs', 'AQo', 'AJs', 'KQs', 'KQo', 'KJs'],
        call:  ['99', '88', '77', '66', ...SUITED_CONNECTORS.slice(0, 4), 'QJs', 'JTs'],
        fold:  [...TRASH_HANDS, ...DOMINATED_HANDS.slice(0, 5)],
      };
    case 'Apprentice':
      return {
        raise: [...PREMIUM_HANDS, ...BROADWAY_HANDS.slice(0, 10), 'ATs', 'A9s'],
        call:  [...MEDIUM_PAIRS, ...SUITED_CONNECTORS, ...SUITED_ACES.slice(0, 5), ...MARGINAL_HANDS.slice(0, 4)],
        fold:  [...TRASH_HANDS, ...DOMINATED_HANDS, ...SMALL_PAIRS],
      };
    case 'Grinder':
      return {
        raise: [...PREMIUM_HANDS, ...BROADWAY_HANDS.slice(0, 12), ...SUITED_ACES.slice(0, 5)],
        call:  [...MEDIUM_PAIRS, '55', ...SUITED_CONNECTORS, ...MARGINAL_HANDS],
        fold:  [...TRASH_HANDS, ...DOMINATED_HANDS, '44', '33', '22', 'K2o', 'Q4o', 'J3o'],
      };
    case 'ChipLeader':
      return {
        raise: [...PREMIUM_HANDS, ...BROADWAY_HANDS, ...SUITED_ACES, 'K9s', 'T9s'],
        call:  [...MEDIUM_PAIRS, ...SMALL_PAIRS.slice(0, 2), ...SUITED_CONNECTORS, ...MARGINAL_HANDS],
        fold:  [...TRASH_HANDS, ...DOMINATED_HANDS, '33', '22', 'K2o', 'J5o', 'T6o'],
      };
    case 'Master':
      return {
        raise: [...PREMIUM_HANDS, ...BROADWAY_HANDS, ...SUITED_ACES, ...SUITED_CONNECTORS.slice(0, 3)],
        call:  [...MEDIUM_PAIRS, '55', '44', ...SUITED_CONNECTORS.slice(3), ...MARGINAL_HANDS],
        fold:  [...TRASH_HANDS, ...DOMINATED_HANDS, '33', '22', 'T6o', 'J5o', 'K2o'],
      };
  }
}

/** Returns hands suitable for postflop pressure questions at the given tier. */
export function getPressureHands(tier: TierKey): {
  strongHands: string[];      // Sets, two pair, nut draws → CALL
  vulnerableHands: string[];  // Weak pairs, thin top pair → FOLD
  drawHands: string[];        // For draw vs aggression scenarios
} {
  switch (tier) {
    case 'Grinder':
    case 'ChipLeader':
    case 'Master':
      return {
        strongHands:     ['22', '33', '44', '55', '66', 'AJo', 'ATs', 'KQs', 'QQ', 'JJ'],
        vulnerableHands: ['K5o', 'Q6o', 'J7o', '65s', '55', '66', 'K9o', 'Q8o', 'T7s'],
        drawHands:       ['87s', '76s', '65s', 'T9s', '98s', '54s', 'JTs'],
      };
    default:
      return {
        strongHands:     ['AA', 'KK', 'QQ', 'JJ', 'AKs'],
        vulnerableHands: ['K5o', 'Q6o', '66', '55'],
        drawHands:       ['87s', '76s', 'T9s'],
      };
  }
}
