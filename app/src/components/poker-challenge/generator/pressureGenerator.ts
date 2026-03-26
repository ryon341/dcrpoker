// ─── TC090.5 — Pressure Question Generator ────────────────────────────────────
// Generates postflop pressure questions (CALL/FOLD) using varied hand,
// board, and context combinations. Used for Grinder, Chip Leader, and Master.

import type { TierKey, GeneratedQuestion } from './generatorTypes';
import { TIER_DIFFICULTY_ENVELOPES, TIER_KEY_TO_CHALLENGE_TIER, TIER_KEY_TO_INDEX } from './generatorConfig';
import { DRY_BOARDS, WET_BOARDS, SINGLE_SUIT_BOARDS } from './scenarioPools';

type RngFn = () => number;

function rngChoice<T>(arr: readonly T[], rng: RngFn): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngInt(min: number, max: number, rng: RngFn): number {
  return min + Math.floor(rng() * (max - min + 1));
}

// ── Hand templates per pressure scenario ─────────────────────────────────────
const WEAK_TOP_PAIR_HANDS = ['K5o', 'Q6o', 'J7o', 'A3o', 'K2o', 'T4o', 'J3o', 'Q4o', 'A4o', 'K3o'];
const UNDERPAIR_HANDS      = ['22', '33', '44', '55', '66', '77'];
const DRAW_HANDS           = ['87s', '76s', '65s', 'T9s', '98s', '54s', 'JTs', '86s'];
const SET_HANDS            = ['22', '33', '44', '55', '66', '77', '88', '99'];
const TWO_PAIR_HANDS       = ['AJo', 'KQs', 'QJs', 'KJs', 'ATs', 'ATs', 'T9s'];
const STRONG_TOP_PAIR      = ['ATs', 'KQo', 'AJs', 'AQo', 'AKo', 'QJs', 'KJs'];
const MEDIUM_PAIR_HANDS    = ['55', '66', '77', '88', '99'];

// ── Pressure scenario builders ────────────────────────────────────────────────

function buildWeakTopPairFoldScenario(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(WEAK_TOP_PAIR_HANDS, rng);
  const board = rngChoice(DRY_BOARDS, rng);
  const aggression = rngChoice(['bets 3/4 pot on the flop and barrels the turn', 'bets pot on the turn after cbetting the flop', 'fires a large bet on each street'], rng);
  return {
    prompt: `You hold ${hand} on a ${board} board. Top pair but weak kicker. Villain ${aggression}. What is the best action?`,
    explanation: `Your top pair has a dominated kicker. Villain's multi-street aggression on a ${board.split(' ')[0]}-high board represents strong made hands. Release.`,
  };
}

function buildUnderpairFoldScenario(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(UNDERPAIR_HANDS, rng);
  const board = rngChoice(DRY_BOARDS, rng);
  const betSize = rngChoice(['1/2', '2/3', '3/4'], rng);
  return {
    prompt: `You hold ${hand} on a board of ${board}. Villain opened UTG and continuation-bets ${betSize} pot. What is the best action?`,
    explanation: `A UTG range connects heavily with the high cards on ${board}. Your ${hand} is a small underpair with little showdown value. Fold.`,
  };
}

function buildDrawVsOverbetFold(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(DRAW_HANDS, rng);
  const board = rngChoice(WET_BOARDS, rng);
  const potSize = rngChoice([50, 60, 70, 80], rng);
  const callSize = potSize * 2;
  return {
    prompt: `You hold ${hand} (OESD) on a ${board} board. Villain fires a 2x pot overbet. You need to call ${callSize} into a pot of ${potSize}. What is the best action?`,
    explanation: `An OESD gives roughly 32% equity. A 2x overbet requires ~67% equity to break even. The math forces a fold.`,
  };
}

function buildDrawCorrectCall(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(DRAW_HANDS, rng);
  const potSize = rngChoice([50, 60, 70, 80], rng);
  const betSize = Math.round(potSize * rngChoice([0.25, 0.33], rng) / 5) * 5 || 5;
  const threshold = Math.round((betSize / (potSize + 2 * betSize)) * 100);
  return {
    prompt: `You hold ${hand}. You have an OESD on the flop. Pot is ${potSize}. Villain bets ${betSize}. What is the best action?`,
    explanation: `You need ${threshold}% equity to call. An OESD gives roughly 32% equity. The pot odds clearly justify a call.`,
  };
}

function buildMiddlePairCheckRaiseFold(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(MEDIUM_PAIR_HANDS, rng);
  const board = rngChoice(WET_BOARDS, rng);
  return {
    prompt: `You hold ${hand}. Board ${board}. Villain check-raised your flop bet to 3x. You have middle pair on a very coordinated board. What is the best action?`,
    explanation: `On ${board}, a check-raise almost always represents a made hand or a big equity draw. ${hand} is too vulnerable to continue.`,
  };
}

function buildSetVsAggression(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(SET_HANDS, rng);
  const boardHigh = rngChoice(['A-K-7', 'K-T-4', 'Q-9-3', 'J-8-2', '9-7-3'], rng);
  const setCard = hand.slice(0, 2);
  return {
    prompt: `You hold ${hand} and flopped a set on a board of ${setCard}-${boardHigh.split('-').slice(1).join('-')}. Villain leads the flop and continues with large bets on the turn. What is the best action?`,
    explanation: `You have a set — one of the strongest hands possible. You are well ahead of villain's range. Continue and extract value.`,
  };
}

function buildTwoPairCorrectCall(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(TWO_PAIR_HANDS, rng);
  const board = rngChoice(['A-K-J', 'Q-J-9', 'T-9-7', 'A-Q-8', 'K-J-T'], rng);
  const betFrac = rngChoice(['1/2', '2/3', '3/4'], rng);
  return {
    prompt: `You hold ${hand} in a 3-bet pot. Board ${board}. You have top two pair. Villain bets ${betFrac} pot. What is the best action?`,
    explanation: `Top two pair is a premium hand. Call to let villain include weaker made hands and bluffs in their continuing range.`,
  };
}

function buildThreeStreetFold(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(WEAK_TOP_PAIR_HANDS, rng);
  const board = rngChoice(DRY_BOARDS, rng);
  return {
    prompt: `You hold ${hand} on a ${board} board. Top pair with weak kicker. Villain leads into you on the flop, turn, and river. What is the best action?`,
    explanation: `Three streets of value from a composed player almost always represents top pair with a better kicker or better. ${hand} is likely dominated. Fold the river.`,
  };
}

function buildTopPairGoodKickerCall(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(STRONG_TOP_PAIR, rng);
  const board = rngChoice(DRY_BOARDS, rng);
  return {
    prompt: `You hold ${hand}. Board ${board} rainbow. Top pair good kicker. Villain check-raises your flop bet to 3x. What is the best action?`,
    explanation: `Top pair with a solid kicker (${hand}) is strong enough to call a check-raise on this dry board. Your hand is well-protected.`,
  };
}

function buildUnderpairThreeStreetFold(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(UNDERPAIR_HANDS, rng);
  const board = rngChoice(DRY_BOARDS, rng);
  return {
    prompt: `You hold ${hand} on a ${board} board. You have an underpair. Villain leads all three streets for large bets. What is the best action?`,
    explanation: `Three streets of large bets on a ${board.split(' ')[0]}-high board represents a made hand that dominates your underpair. You are drawing very thin. Fold.`,
  };
}

// New CALL scenario: flush draw with clear pot-odds
function buildFlushDrawPotOddsCall(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(DRAW_HANDS, rng);
  const potSize = rngChoice([60, 70, 80, 90, 100], rng);
  const betFrac = rngChoice([0.33, 0.40, 0.50], rng);
  const betSize = Math.round(potSize * betFrac / 5) * 5 || 5;
  const threshold = Math.round((betSize / (potSize + 2 * betSize)) * 100);
  return {
    prompt: `You hold a flush draw on the flop. Pot is ${potSize}. Villain bets ${betSize}. You have 9 outs to the flush. What is the best action?`,
    explanation: `You need ${threshold}% equity to call. With 9 flush outs on the flop (roughly 35% to hit by the river), you have the equity to call profitably.`,
  };
}

// New CALL scenario: monster draw (OESD + flush) with reasonable pressure
function buildMonsterDrawCall(rng: RngFn): { prompt: string; explanation: string } {
  const hand = rngChoice(DRAW_HANDS, rng);
  const potSize = rngChoice([60, 70, 80, 100], rng);
  const betFrac = rngChoice([0.50, 0.60, 0.66], rng);
  const betSize = Math.round(potSize * betFrac / 5) * 5 || 5;
  const threshold = Math.round((betSize / (potSize + 2 * betSize)) * 100);
  return {
    prompt: `You hold ${hand} and flopped an OESD plus a flush draw. Pot is ${potSize}. Villain bets ${betSize}. What is the best action?`,
    explanation: `An OESD + flush draw carries roughly 54% equity by the river. You need ${threshold}% to call. With a monster draw, calling is clearly profitable.`,
  };
}

/** Generate `count` pressure questions for the given tier and level. */
export function generatePressureQuestions(
  tier: TierKey,
  level: 1 | 2 | 3 | 4 | 5,
  count: number,
  startSeq: number,
  rng: RngFn,
): GeneratedQuestion[] {
  const diffRange = TIER_DIFFICULTY_ENVELOPES[tier];
  const tierStr = TIER_KEY_TO_CHALLENGE_TIER[tier];
  const tierIdx = TIER_KEY_TO_INDEX[tier];

  // Scenario builder weights: [builder, weight]
  const builders: Array<[() => { prompt: string; explanation: string }, string, 'CALL' | 'FOLD']> = [
    [() => buildWeakTopPairFoldScenario(rng),    'weak_top_pair_fold',  'FOLD'],
    [() => buildUnderpairFoldScenario(rng),       'underpair_fold',      'FOLD'],
    [() => buildDrawVsOverbetFold(rng),           'draw_vs_overbet',     'FOLD'],
    [() => buildDrawCorrectCall(rng),             'draw_correct_call',   'CALL'],
    [() => buildMiddlePairCheckRaiseFold(rng),    'check_raise_fold',    'FOLD'],
    [() => buildSetVsAggression(rng),             'set_correct_call',    'CALL'],
    [() => buildTwoPairCorrectCall(rng),          'two_pair_call',       'CALL'],
    [() => buildThreeStreetFold(rng),             'three_street_fold',   'FOLD'],
    [() => buildTopPairGoodKickerCall(rng),       'top_pair_call',       'CALL'],
    [() => buildUnderpairThreeStreetFold(rng),    'underpair_3street',   'FOLD'],
    [() => buildFlushDrawPotOddsCall(rng),        'flush_draw_call',     'CALL'],
    [() => buildMonsterDrawCall(rng),             'monster_draw_call',   'CALL'],
  ];

  const questions: GeneratedQuestion[] = [];
  const seenFingerprints = new Set<string>();
  let seq = startSeq;
  let attempts = 0;
  const maxAttempts = count * 15;

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;

    const builderIdx = Math.floor(rng() * builders.length);
    const [builder, scenarioTag, correctAnswer] = builders[builderIdx];
    const { prompt, explanation } = builder();

    const fingerprint = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    const diffScore = rngInt(diffRange.min, diffRange.max, rng);
    const id = `gen-${tierStr}-l${level}-pressure-${String(seq).padStart(3, '0')}`;
    seq++;

    questions.push({
      id,
      tier: tierStr,
      tierIndex: tierIdx,
      level,
      category: 'pressure',
      prompt,
      explanation,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: [`l${level}`, 'postflop', 'pressure', scenarioTag],
      difficultyScore: diffScore,
    });
  }

  return questions;
}
