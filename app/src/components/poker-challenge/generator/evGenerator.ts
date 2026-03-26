// ─── TC090.5 — EV / Pot Odds Question Generator ───────────────────────────────
// Generates CALL/FOLD pot-odds questions with tier-appropriate margin tightness.
// Formula: required_equity = bet / (pot + 2 * bet)

import type { TierKey, GeneratedQuestion } from './generatorTypes';
import { TIER_EV_MARGIN, TIER_DIFFICULTY_ENVELOPES, TIER_KEY_TO_CHALLENGE_TIER, TIER_KEY_TO_INDEX } from './generatorConfig';

type RngFn = () => number;

function rngChoice<T>(arr: readonly T[], rng: RngFn): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngInt(min: number, max: number, rng: RngFn): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Pot sizes by tier: larger pots appear at higher tiers. */
const TIER_POT_SIZES: Record<TierKey, number[]> = {
  Beginner:   [40, 50, 60, 70, 80],
  Apprentice: [60, 70, 80, 90, 100, 120],
  Grinder:    [70, 80, 90, 100, 110, 120, 140],
  ChipLeader: [80, 100, 120, 140, 160, 180, 200],
  Master:     [100, 120, 140, 160, 180, 200, 240, 260, 280, 300, 320],
};

/** Bet fractions (bet / pot) by tier: more extreme bets at higher tiers. */
const TIER_BET_FRACTIONS: Record<TierKey, number[]> = {
  Beginner:   [0.33, 0.5, 0.67],
  Apprentice: [0.33, 0.5, 0.67, 0.75],
  Grinder:    [0.33, 0.4, 0.5, 0.67, 0.75, 1.0],
  ChipLeader: [0.33, 0.4, 0.5, 0.67, 0.75, 1.0, 1.5],
  Master:     [0.33, 0.4, 0.5, 0.67, 0.75, 1.0, 1.5, 2.0],
};

/** Generate `count` EV questions for the given tier and level. */
export function generateEVQuestions(
  tier: TierKey,
  level: 1 | 2 | 3 | 4 | 5,
  count: number,
  startSeq: number,
  rng: RngFn,
): GeneratedQuestion[] {
  const margin = TIER_EV_MARGIN[tier];
  const potSizes = TIER_POT_SIZES[tier];
  const betFractions = TIER_BET_FRACTIONS[tier];
  const diffRange = TIER_DIFFICULTY_ENVELOPES[tier];
  const tierStr = TIER_KEY_TO_CHALLENGE_TIER[tier];
  const tierIdx = TIER_KEY_TO_INDEX[tier];

  const questions: GeneratedQuestion[] = [];
  const seenFingerprints = new Set<string>();
  let seq = startSeq;
  let attempts = 0;
  const maxAttempts = count * 20;

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;

    const pot = rngChoice(potSizes, rng);
    const fraction = rngChoice(betFractions, rng);
    const rawBet = pot * fraction;
    // Round bet to nearest 5
    const bet = Math.round(rawBet / 5) * 5 || 5;

    // Required equity to break even = bet / (pot + 2*bet)
    const threshold = bet / (pot + 2 * bet);

    // Decide if this is a call or fold, then compute equity accordingly
    const isCall = rng() > 0.5;
    // Add/subtract a margin between 1% and max_margin
    const marginPct = margin * (0.3 + rng() * 0.7); // between 30% and 100% of max margin
    const rawEquity = isCall ? threshold + marginPct : threshold - marginPct;
    const equityPct = Math.max(5, Math.min(95, Math.round(rawEquity * 100)));
    const correctAnswer = equityPct > Math.round(threshold * 100) ? 'CALL' : 'FOLD';
    const thresholdPct = Math.round(threshold * 100 * 10) / 10; // 1 decimal

    const prompt = `The pot is ${pot}. Your opponent bets ${bet}. You estimate your equity at ${equityPct}%. What is the best action?`;
    const fingerprint = prompt.toLowerCase().replace(/\s+/g, ' ').trim();

    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    const explanation = `You need ${thresholdPct}% equity to call. Since your equity is ${equityPct}%, the correct simplified choice is ${correctAnswer}.`;
    const diffScore = rngInt(diffRange.min, diffRange.max, rng);
    const id = `gen-${tierStr}-l${level}-ev-${String(seq).padStart(3, '0')}`;
    seq++;

    questions.push({
      id,
      tier: tierStr,
      tierIndex: tierIdx,
      level,
      category: 'ev',
      prompt,
      explanation,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: [`l${level}`, 'ev', 'pot_odds'],
      difficultyScore: diffScore,
    });
  }

  return questions;
}
