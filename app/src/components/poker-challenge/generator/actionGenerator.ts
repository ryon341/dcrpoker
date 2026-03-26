// ─── TC090.5 — Action Question Generator ──────────────────────────────────────
// Generates preflop action questions (fold/call/raise) using tier-aware
// hand pools, scenario templates, and a seeded PRNG.

import type { TierKey, GeneratedQuestion } from './generatorTypes';
import { TIER_ALLOWED_SCENARIOS, TIER_STACK_POOLS, TIER_DIFFICULTY_ENVELOPES, TIER_KEY_TO_CHALLENGE_TIER, TIER_KEY_TO_INDEX } from './generatorConfig';
import { getTierActionHandPools } from './handPools';
import { ALL_POSITIONS, EARLY_POSITIONS, MIDDLE_POSITIONS, LATE_POSITIONS } from './scenarioPools';

type RngFn = () => number;

function rngChoice<T>(arr: readonly T[], rng: RngFn): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngInt(min: number, max: number, rng: RngFn): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function buildActionExplanation(hand: string, action: 'fold' | 'call' | 'raise', scenario: string): string {
  const premiums = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'];
  const isPremium = premiums.includes(hand);

  if (action === 'raise') {
    if (isPremium) return `${hand} is a premium hand — always build the pot for value.`;
    if (scenario === 'squeeze_spot') return `${hand} is strong enough to squeeze for value after a raise and a call.`;
    if (scenario === 'facing_3bet') return `${hand} is strong enough to continue aggressively against a 3-bet.`;
    if (scenario === 'iso_raise') return `${hand} is strong enough to isolate limpers and take initiative.`;
    if (scenario === 'late_position_pressure') return `${hand} is strong enough to apply late-position pressure against a wide opening range.`;
    return `${hand} is strong enough to raise for value in this spot.`;
  }
  if (action === 'call') {
    if (scenario === 'facing_3bet') return `${hand} is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet.`;
    if (scenario === 'blind_vs_blind') return `${hand} plays adequately in a blind-versus-blind spot.`;
    return `${hand} has sufficient equity and playability to continue in this spot.`;
  }
  // fold
  if (scenario === 'facing_3bet') return `${hand} lacks the equity to continue profitably against a 3-bet in this configuration.`;
  if (scenario === 'squeeze_spot') return `${hand} is too marginal for this squeeze configuration.`;
  return `${hand} lacks the equity or strength to continue profitably here.`;
}

function buildActionPrompt(
  scenario: string,
  hand: string,
  position: string,
  stack: number,
  openerPos: string,
  villainPos: string,
  callerPos: string,
  betSize: number,
  limpers: number,
): string {
  switch (scenario) {
    case 'open_spot':
      return `6-max cash game. ${stack}bb effective. Folded to you in ${position} with ${hand}.`;
    case 'blind_vs_blind':
      return `Action folds to you in the small blind. You hold ${hand} with ${stack}bb effective.`;
    case 'facing_open':
      return `${openerPos} opens to ${betSize}bb. You are in ${position} with ${hand}. Effective stack is ${stack}bb.`;
    case 'facing_3bet':
      return `You open from ${openerPos}. ${position} 3-bets. You hold ${hand} with ${stack}bb effective.`;
    case 'squeeze_spot':
      return `${openerPos} opens, ${callerPos} calls, and action is on you in ${position} holding ${hand} with ${stack}bb effective.`;
    case 'iso_raise': {
      const limpDesc = limpers === 1 ? 'One player limps' : limpers === 2 ? 'Two players limp' : 'Three players limp';
      return `${limpDesc} before you. You are in ${position} with ${hand} and ${stack}bb effective.`;
    }
    case 'facing_min_raise':
      return `${openerPos} makes a minimum raise. You are in ${position} with ${hand}. Effective stack is ${stack}bb.`;
    case 'late_position_pressure':
      return `${callerPos} opens wide. You are in ${position} with ${hand} and ${stack}bb effective.`;
    default:
      return `6-max cash game. ${stack}bb effective. Folded to you in ${position} with ${hand}.`;
  }
}

/** Generate `count` action questions for the given tier and level, using `rng`. */
export function generateActionQuestions(
  tier: TierKey,
  level: 1 | 2 | 3 | 4 | 5,
  count: number,
  startSeq: number,
  rng: RngFn,
): GeneratedQuestion[] {
  const pools = getTierActionHandPools(tier);
  const scenarios = TIER_ALLOWED_SCENARIOS[tier];
  const stacks = TIER_STACK_POOLS[tier];
  const diffRange = TIER_DIFFICULTY_ENVELOPES[tier];
  const tierStr = TIER_KEY_TO_CHALLENGE_TIER[tier];
  const tierIdx = TIER_KEY_TO_INDEX[tier];

  const questions: GeneratedQuestion[] = [];
  const seenFingerprints = new Set<string>();
  let seq = startSeq;
  let attempts = 0;
  const maxAttempts = count * 10;

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;

    const scenario = rngChoice(scenarios, rng);
    const position = rngChoice(ALL_POSITIONS, rng);
    const stack = rngChoice(stacks, rng);
    const openSize = rngChoice([2, 2.5, 3], rng);
    const limpers = rngInt(1, 3, rng);

    const openerPos = rngChoice(EARLY_POSITIONS, rng);
    const midsLeft = MIDDLE_POSITIONS.filter((p) => p !== position);
    const villainPos = midsLeft.length > 0 ? rngChoice(midsLeft, rng) : rngChoice(ALL_POSITIONS, rng);
    const callerPos = rngChoice(ALL_POSITIONS.filter((p) => p !== position && p !== openerPos), rng);

    // Determine action and hand
    const actionRoll = rng();
    let action: 'fold' | 'call' | 'raise';
    let hand: string;

    if (actionRoll < 0.45) {
      action = 'raise';
      hand = rngChoice(pools.raise, rng);
    } else if (actionRoll < 0.70) {
      action = 'call';
      hand = rngChoice(pools.call, rng);
    } else {
      action = 'fold';
      hand = rngChoice(pools.fold, rng);
    }

    const prompt = buildActionPrompt(scenario, hand, position, stack, openerPos, villainPos, callerPos, openSize, limpers);
    const fingerprint = prompt.toLowerCase().replace(/\s+/g, ' ').trim();

    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    const diffScore = rngInt(diffRange.min, diffRange.max, rng);
    const id = `gen-${tierStr}-l${level}-action-${String(seq).padStart(3, '0')}`;
    seq++;

    questions.push({
      id,
      tier: tierStr,
      tierIndex: tierIdx,
      level,
      category: 'action',
      prompt,
      explanation: buildActionExplanation(hand, action, scenario),
      correctAction: action,
      heroPosition: position,
      effectiveStackBb: stack,
      tags: [`l${level}`, scenario, hand.toLowerCase()],
      difficultyScore: diffScore,
    });
  }

  return questions;
}
