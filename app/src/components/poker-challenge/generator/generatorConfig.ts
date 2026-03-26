// ─── TC090.5 — Generator Configuration ───────────────────────────────────────
// Tier targets, difficulty envelopes, and generation rules.

import type { TierKey, GeneratorCategory, ActionScenario } from './generatorTypes';

// ── Target question counts per tier ──────────────────────────────────────────
export const TIER_GENERATION_TARGETS: Record<TierKey, Partial<Record<GeneratorCategory, number>>> = {
  Beginner:   { action: 100, ev:  50, outs:  60, position: 40, pressure:  0 },
  Apprentice: { action: 100, ev:  60, outs:  50, position: 40, pressure:  0 },
  Grinder:    { action:  90, ev:  70, outs:  40, position:  0, pressure: 50 },
  ChipLeader: { action:  80, ev:  80, outs:  30, position:  0, pressure: 60 },
  Master:     { action:  70, ev:  90, outs:  20, position:  0, pressure: 70 },
} as const;

// Per-level distribution (totalPerTier / 5 levels = 50 per level)
// Matches TIER_GENERATION_TARGETS divided by 5
export const TIER_LEVEL_DISTRIBUTION: Record<TierKey, Partial<Record<GeneratorCategory, number>>> = {
  Beginner:   { action: 20, ev: 10, outs: 12, position: 8 },
  Apprentice: { action: 20, ev: 12, outs: 10, position: 8 },
  Grinder:    { action: 18, ev: 14, outs:  8, pressure: 10 },
  ChipLeader: { action: 16, ev: 16, outs:  6, pressure: 12 },
  Master:     { action: 14, ev: 18, outs:  4, pressure: 14 },
} as const;

// ── Difficulty envelopes ──────────────────────────────────────────────────────
export const TIER_DIFFICULTY_ENVELOPES: Record<TierKey, { min: number; max: number }> = {
  Beginner:   { min: 10, max: 30 },
  Apprentice: { min: 31, max: 55 },
  Grinder:    { min: 56, max: 75 },
  ChipLeader: { min: 76, max: 90 },
  Master:     { min: 91, max: 100 },
} as const;

// ── Stack depth pools per tier ─────────────────────────────────────────────────
export const TIER_STACK_POOLS: Record<TierKey, number[]> = {
  Beginner:   [100],
  Apprentice: [60, 75, 100],
  Grinder:    [25, 30, 40, 50, 60, 75, 100],
  ChipLeader: [20, 25, 30, 40, 50, 60, 75, 100],
  Master:     [20, 25, 30, 40, 50, 60, 75, 100],
} as const;

// ── Allowed action scenario types per tier ────────────────────────────────────
export const TIER_ALLOWED_SCENARIOS: Record<TierKey, ActionScenario[]> = {
  Beginner:   ['open_spot', 'blind_vs_blind', 'facing_open'],
  Apprentice: ['open_spot', 'blind_vs_blind', 'facing_open', 'facing_3bet', 'facing_min_raise'],
  Grinder:    ['open_spot', 'blind_vs_blind', 'facing_open', 'facing_3bet', 'squeeze_spot', 'iso_raise'],
  ChipLeader: ['open_spot', 'blind_vs_blind', 'facing_open', 'facing_3bet', 'squeeze_spot', 'iso_raise', 'facing_min_raise', 'late_position_pressure'],
  Master:     ['open_spot', 'blind_vs_blind', 'facing_open', 'facing_3bet', 'squeeze_spot', 'iso_raise', 'facing_min_raise', 'late_position_pressure'],
} as const;

// ── EV margin thresholds per tier (how "thin" the correct call/fold decision is) ─
export const TIER_EV_MARGIN: Record<TierKey, number> = {
  Beginner:   0.10,  // Equity is ±10% of threshold — very clear
  Apprentice: 0.065,
  Grinder:    0.038,
  ChipLeader: 0.03,
  Master:     0.02,  // Equity is ±2% of threshold — very thin
} as const;

// ── Tier narrative descriptions ───────────────────────────────────────────────
export const TIER_RULES: Record<TierKey, string> = {
  Beginner:   'Obvious hands, no 3-bet pressure, clean outs problems, clear pot odds.',
  Apprentice: 'Marginal hands, simple facing-raise spots, moderate outs/EV difficulty.',
  Grinder:    'Pressure, position conflicts, larger EV decisions, postflop squeeze scenarios.',
  ChipLeader: 'Aggressive pressure, stronger punishment for errors, wide scenario range.',
  Master:     'Toughest simplified decision spots, thin margins, advanced multi-street scenarios.',
} as const;

// ── ChallengeTier values (matches app schema) ─────────────────────────────────
export const TIER_KEY_TO_CHALLENGE_TIER: Record<TierKey, string> = {
  Beginner:   'beginner',
  Apprentice: 'apprentice',
  Grinder:    'grinder',
  ChipLeader: 'chip_leader',
  Master:     'master',
} as const;

export const TIER_KEY_TO_INDEX: Record<TierKey, 1 | 2 | 3 | 4 | 5> = {
  Beginner:   1,
  Apprentice: 2,
  Grinder:    3,
  ChipLeader: 4,
  Master:     5,
} as const;
