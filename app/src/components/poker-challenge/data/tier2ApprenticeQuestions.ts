// ─── Tier 2 / Apprentice Question Bank (TC084) ────────────────────────────────
// 250 questions across Levels 6–10 (local levels 1–5 within the Apprentice tier)
// Per level: 30 action (20 native + 10 carryover) + 10 outs + 10 EV = 50
// Per level: 40 Apprentice-native + 10 Beginner-carryover = 50
// IDs reference global level numbers (l6–l10) for player-facing clarity.

import type { ChallengeAction } from '../challengeTypes';
import type { ChallengeCategory, ChallengeQuestion, ChallengeTier } from '../challengeQuestionTypes';

type Level = 1 | 2 | 3 | 4 | 5;

/** Maps local level (1–5) to global level (6–10) for ID purposes */
const toGlobal: Record<Level, number> = { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10 };

type ActionSeed = {
  prompt: string;
  correctAction: ChallengeAction;
  heroPosition: string;
  effectiveStackBb: number;
  tags: string[];
  difficultyScore: number;
  sourceTier?: ChallengeTier;
};

type MathSeed = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  difficultyScore: number;
  sourceTier?: ChallengeTier;
};

function makeActionQuestion(level: Level, idx: number, seed: ActionSeed): ChallengeQuestion {
  const gl = toGlobal[level];
  const isCarryover = seed.sourceTier === 'beginner';
  return {
    id: `apprentice-l${gl}-action-${String(idx + 1).padStart(3, '0')}`,
    tier: 'apprentice',
    tierIndex: 2,
    level,
    category: 'action',
    prompt: seed.prompt,
    explanation:
      isCarryover
        ? seed.correctAction === 'raise'
          ? 'Revisiting a Beginner concept: this hand remains a strong aggressive action here.'
          : seed.correctAction === 'call'
            ? 'Revisiting a Beginner concept: this hand retains enough equity to continue.'
            : 'Revisiting a Beginner concept: this hand is still too weak to play profitably here.'
        : seed.correctAction === 'raise'
          ? 'Raising here builds the pot with a strong range advantage and applies position pressure.'
          : seed.correctAction === 'call'
            ? 'Calling preserves equity and implied odds without over-committing to a marginal spot.'
            : 'Folding avoids a dominated spot where equity and position work against you.',
    correctAction: seed.correctAction,
    heroPosition: seed.heroPosition,
    effectiveStackBb: seed.effectiveStackBb,
    tags: seed.tags,
    difficultyScore: seed.difficultyScore,
    sourceTier: seed.sourceTier ?? 'apprentice',
  };
}

function makeMathQuestion(level: Level, idx: number, category: ChallengeCategory, seed: MathSeed): ChallengeQuestion {
  const gl = toGlobal[level];
  return {
    id: `apprentice-l${gl}-${category}-${String(idx + 1).padStart(3, '0')}`,
    tier: 'apprentice',
    tierIndex: 2,
    level,
    category,
    prompt: seed.prompt,
    explanation: seed.explanation,
    choices: seed.choices,
    correctAnswer: seed.correctAnswer,
    tags: seed.tags,
    difficultyScore: seed.difficultyScore,
    sourceTier: seed.sourceTier ?? 'apprentice',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 6  (global level 6, local level 1)  difficulty ~60–65
// ─────────────────────────────────────────────────────────────────────────────

const level6NativeActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with JTs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'suited-connector'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with AKs.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l6', 'vs-open', '3bet-value', 'premium'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with KK.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'cold-3bet', 'premium'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with 87s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'suited-connector'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the big blind with QJo.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'fold'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with K9s.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'suited-king'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with A8s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'open', 'suited-ace'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with AQo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l6', 'blind-vs-btn', '3bet-value'], difficultyScore: 62 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'set-mine', 'pair'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with AJo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'ace-broadway'], difficultyScore: 62 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with T9s.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', 'suited-connector'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with K8o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l6', 'open', 'fold'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with 99.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l6', 'open', 'pair'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with A4s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', '3bet-bluff', 'small-suited-ace'], difficultyScore: 63 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the big blind with J9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'suited-connector'], difficultyScore: 62 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with K5o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'fold'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with QQ.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', '3bet-value', 'premium'], difficultyScore: 62 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with 65s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'suited-connector'], difficultyScore: 60 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with 88.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l6', 'open', 'pair'], difficultyScore: 61 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with A9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'suited-ace'], difficultyScore: 62 },
];

const level6CarryoverActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with A9s.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l6', 'open', 'suited-ace', 'carryover', 'from_tier_1'], difficultyScore: 63, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with 98s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'open', 'suited-connector', 'carryover', 'from_tier_1'], difficultyScore: 63, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb and button calls. You are in the big blind with 99.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'squeeze', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 64, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with AJs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l6', 'blind-vs-btn', '3bet', 'carryover', 'from_tier_1'], difficultyScore: 63, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with T9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'connector', 'carryover', 'from_tier_1'], difficultyScore: 62, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and cutoff calls. You are on the button with KQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'multiway', 'suited-broadway', 'carryover', 'from_tier_1'], difficultyScore: 64, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with A5s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l6', 'vs-open', '3bet-bluff', 'carryover', 'from_tier_1'], difficultyScore: 63, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with ATo.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l6', 'blind-defense', 'ace-x', 'carryover', 'from_tier_1'], difficultyScore: 63, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with J8o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l6', 'open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 62, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with A4s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l6', 'open', 'suited-ace', 'carryover', 'from_tier_1'], difficultyScore: 62, sourceTier: 'beginner' },
];

const level6OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Kh Qh on Jh 4c 2h. How many outs give you a flush?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '13 hearts minus 4 visible (Kh, Qh, Jh, 2h) = 9 flush outs.', tags: ['l6', 'outs', 'flush-draw'], difficultyScore: 60 },
  { prompt: 'You hold 5s 6s on 7d 8h Ac. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 4 makes 4-5-6-7-8; any 9 makes 5-6-7-8-9. OESD: 8 outs.', tags: ['l6', 'outs', 'oesd'], difficultyScore: 60 },
  { prompt: 'You hold Kc Qc on Jd 9h 3s. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a T completes 9-T-J-Q-K. This is a gutshot: 4 outs.', tags: ['l6', 'outs', 'gutshot'], difficultyScore: 61 },
  { prompt: 'You hold Ac Kd on 9s 4h 2c. How many outs pair an ace or king on the turn?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three kings remain as overcard outs.', tags: ['l6', 'outs', 'overcards'], difficultyScore: 61 },
  { prompt: 'You hold 7c 7d on Ks Qh 4s. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two sevens remain in the deck for trips.', tags: ['l6', 'outs', 'pair-to-trips'], difficultyScore: 60 },
  { prompt: 'You hold Jh Th on 9h 8h 3c. How many total outs do you have (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush outs + 8 straight outs (Q or 7) - 2 overlap (Qh, 7h) = 15.', tags: ['l6', 'outs', 'combo-draw'], difficultyScore: 63 },
  { prompt: 'You hold Ah Kh on Qh 7c 2s. How many hearts remain as flush outs?', choices: ['7', '8', '9', '10'], correctAnswer: '10', explanation: 'Hearts seen: Ah and Kh (hand) + Qh (board) = 3 hearts total. Remaining: 13 - 3 = 10 hearts.', tags: ['l6', 'outs', 'flush-draw'], difficultyScore: 60 },
  { prompt: 'You hold 3s 4s on 5d 6h Ac. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 2 makes A-2-3-4-5; any 7 makes 3-4-5-6-7. OESD: 8 outs.', tags: ['l6', 'outs', 'oesd'], difficultyScore: 61 },
  { prompt: 'You hold Qs Js on Ts 9s 2c. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 spade flush outs + 8 straight outs (K or 8) - 2 overlap (Ks, 8s) = 15.', tags: ['l6', 'outs', 'combo-draw'], difficultyScore: 63 },
  { prompt: 'You hold As Qc on Qd 7h 2s. How many outs improve to two pair or trips on the turn?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces improve to two pair; two queens improve to trips. Total: 5 outs.', tags: ['l6', 'outs', 'made-hand-improve'], difficultyScore: 62 },
];

const level6EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $66 and it costs $18 to call. What break-even equity do you need?', choices: ['18%', '21%', '25%', '27%'], correctAnswer: '21%', explanation: 'You call 18 to win 84 total. 18/84 ≈ 21%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 60 },
  { prompt: 'Pot is $40 and it costs $16 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '29%', explanation: '16/56 ≈ 28.6%, about 29%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 61 },
  { prompt: 'Pot is $33 and it costs $11 to call. What break-even equity do you need?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '11/44 = 25%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 60 },
  { prompt: 'Pot is $72 and it costs $36 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '36/108 = 33%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 61 },
  { prompt: 'Pot is $42 and it costs $12 to call. What break-even equity do you need?', choices: ['18%', '20%', '22%', '25%'], correctAnswer: '22%', explanation: '12/54 ≈ 22.2%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 62 },
  { prompt: 'You need 21% equity to call. You estimate 25% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '25% exceeds the 21% break-even threshold, making the call +EV.', tags: ['l6', 'ev', 'decision'], difficultyScore: 61 },
  { prompt: 'You need 33% equity to call. You estimate 29% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '29% is below the required 33% break-even, making the call -EV.', tags: ['l6', 'ev', 'decision'], difficultyScore: 61 },
  { prompt: 'Pot is $60 and villain bets $20. What are your direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '4:1', explanation: 'Call 20 to win 80 total: 80/20 = 4:1 odds.', tags: ['l6', 'ev', 'pot-odds-ratio'], difficultyScore: 62 },
  { prompt: 'Pot is $35 and villain bets $35 (a pot-sized bet). What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: 'Call 35 to win 105 total: 35/105 = 33%.', tags: ['l6', 'ev', 'pot-odds'], difficultyScore: 62 },
  { prompt: 'Pot is $80 and villain bets $28. You estimate 27% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 28/108 ≈ 26%. Your 27% equity exceeds this, so call is +EV.', tags: ['l6', 'ev', 'decision'], difficultyScore: 63 },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 7  (global level 7, local level 2)  difficulty ~65–70
// ─────────────────────────────────────────────────────────────────────────────

const level7NativeActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with 99.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'pair', 'cold-call'], difficultyScore: 65 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the cutoff with KQs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'suited-broadway'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with A7s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', '3bet-bluff', 'suited-ace'], difficultyScore: 67 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with KQs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'blind-vs-btn', '3bet-value'], difficultyScore: 67 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with T9s.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'blind-vs-open', 'fold'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with AQs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', '3bet-value', 'premium'], difficultyScore: 67 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with JTs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'suited-connector'], difficultyScore: 65 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with KQo.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l7', 'blind-defense', 'broadway'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the small blind with 77.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'open', 'blind-vs-blind', 'pair'], difficultyScore: 65 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with AJs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'suited-ace'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with KQo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'broadway'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with TT.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'pair'], difficultyScore: 67 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with K7s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'open', 'suited-king'], difficultyScore: 65 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with 55.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'set-mine', 'small-pair'], difficultyScore: 65 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with ATs.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l7', 'open', 'suited-ace'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and hijack calls. You are on the button with QQ.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'isolation', 'premium', 'multiway'], difficultyScore: 68 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the big blind with J8s.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l7', 'blind-defense', 'fold'], difficultyScore: 67 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with A7o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l7', 'blind-defense', 'fold', 'ace-x'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with Q9s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l7', 'open', 'suited'], difficultyScore: 66 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with AJs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'blind-vs-open', '3bet-value'], difficultyScore: 68 },
];

const level7CarryoverActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with AQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 68, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the cutoff with AJs.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l7', 'vs-open', '3bet', 'carryover', 'from_tier_1'], difficultyScore: 68, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 67, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with QJo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'broadway', 'carryover', 'from_tier_1'], difficultyScore: 67, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with KTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 67, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with AQs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'blind-vs-open', '3bet', 'carryover', 'from_tier_1'], difficultyScore: 69, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with Q9o.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l7', 'blind-vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 68, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with A8s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l7', 'blind-defense', 'suited-ace', 'carryover', 'from_tier_1'], difficultyScore: 67, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with QTs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l7', 'blind-defense', 'suited-broadway', 'carryover', 'from_tier_1'], difficultyScore: 68, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with AQo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l7', 'isolation', 'broadway', 'carryover', 'from_tier_1'], difficultyScore: 69, sourceTier: 'beginner' },
];

const level7OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Qh Jh on Th 9h 2c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 hearts visible (Qh, Jh, Th, 9h); 13-4 = 9 hearts remaining.', tags: ['l7', 'outs', 'flush-draw'], difficultyScore: 65 },
  { prompt: 'You hold 7s 8s on 6d 9h 2c. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 makes 5-6-7-8-9; any T makes 6-7-8-9-T. OESD: 8 outs.', tags: ['l7', 'outs', 'oesd'], difficultyScore: 65 },
  { prompt: 'You hold Kd Td on Qh Jc 2s. How many outs complete your straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any A makes A-K-Q-J-T; any 9 makes 9-T-J-Q-K. OESD: 8 outs.', tags: ['l7', 'outs', 'oesd-broadway'], difficultyScore: 66 },
  { prompt: 'You hold Ah Kh on 9s 4h 2h. How many overcard outs do you have on the turn?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three kings remain as overcard outs.', tags: ['l7', 'outs', 'overcards'], difficultyScore: 66 },
  { prompt: 'You hold 9c 9d on As Kh 3c. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two nines remain in the deck for a set.', tags: ['l7', 'outs', 'pair-to-trips'], difficultyScore: 65 },
  { prompt: 'You hold 8d 9d on 7d 6d Ks. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 diamond flush outs + 8 straight outs (5 or T) - 2 overlap (5d, Td) = 15.', tags: ['l7', 'outs', 'combo-draw'], difficultyScore: 68 },
  { prompt: 'You hold As 5s on 2s 7h Kd. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '10', explanation: 'Spades seen: As and 5s (hand) + 2s (board) = 3 spades total. Remaining: 13 - 3 = 10 spades.', tags: ['l7', 'outs', 'flush-draw'], difficultyScore: 65 },
  { prompt: 'You hold 4c 5c on 3s 6d Ah. How many straight outs are there?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 2 makes A-2-3-4-5; any 7 makes 3-4-5-6-7. OESD: 8 outs.', tags: ['l7', 'outs', 'oesd'], difficultyScore: 66 },
  { prompt: 'You hold Kc Qc on Jd Tc 2h. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A makes A-K-Q-J-T; any 9 makes 9-T-J-Q-K. OESD: 8 outs.', tags: ['l7', 'outs', 'broadway-draw'], difficultyScore: 67 },
  { prompt: 'You hold Ah Jh on Jd 9c 2h. How many outs improve to two pair or trips on the turn?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces improve to A-J two pair; two jacks improve to trips. Total: 5 outs.', tags: ['l7', 'outs', 'made-hand-improve'], difficultyScore: 67 },
];

const level7EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $48 and it costs $20 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '29%', explanation: '20/68 ≈ 29.4%. You need about 29% equity.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 65 },
  { prompt: 'Pot is $75 and it costs $25 to call. What break-even equity do you need?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '25/100 = 25%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 65 },
  { prompt: 'Pot is $24 and it costs $16 to call. What break-even equity do you need?', choices: ['30%', '33%', '40%', '50%'], correctAnswer: '40%', explanation: '16/40 = 40%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 66 },
  { prompt: 'Pot is $90 and it costs $18 to call. What break-even equity do you need?', choices: ['14%', '17%', '20%', '25%'], correctAnswer: '17%', explanation: '18/108 ≈ 16.7%, about 17%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 67 },
  { prompt: 'Pot is $50 and villain bets $50. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: 'Call 50 to win 150 total. 50/150 = 33%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 66 },
  { prompt: 'You need 29% equity to call. You estimate 33% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '33% exceeds the 29% break-even; the call is +EV.', tags: ['l7', 'ev', 'decision'], difficultyScore: 66 },
  { prompt: 'You need 25% equity to call. You estimate 22% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '22% falls short of the required 25%; folding saves chips.', tags: ['l7', 'ev', 'decision'], difficultyScore: 66 },
  { prompt: 'Pot is $120 and villain bets $60. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '60/180 = 33%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 67 },
  { prompt: 'Pot is $32 and it costs $10 to call. What break-even equity do you need?', choices: ['20%', '24%', '25%', '30%'], correctAnswer: '24%', explanation: '10/42 ≈ 23.8%, about 24%.', tags: ['l7', 'ev', 'pot-odds'], difficultyScore: 67 },
  { prompt: 'Pot is $64 and villain bets $16. You estimate 22% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 16/80 = 20%. Your 22% exceeds 20%; call is +EV.', tags: ['l7', 'ev', 'decision'], difficultyScore: 68 },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 8  (global level 8, local level 3)  difficulty ~70–75
// ─────────────────────────────────────────────────────────────────────────────

const level8NativeActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with ATs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'isolation', 'squeeze', 'suited-ace'], difficultyScore: 70 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with A2s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', '3bet-bluff', 'small-suited-ace'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with JTs.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l8', 'blind-vs-btn', 'suited-connector'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with QTs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l8', 'blind-defense', 'suited-broadway'], difficultyScore: 70 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the hijack with AQo.', correctAction: 'call', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'call', 'broadway'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with QQ.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', '3bet-value', 'premium'], difficultyScore: 72 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are on the button with 88.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'pair'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with KJo.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l8', 'open', 'broadway'], difficultyScore: 70 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with T8s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l8', 'blind-defense', 'suited-connector'], difficultyScore: 70 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with JJ.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'cold-3bet', 'premium'], difficultyScore: 72 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with QTs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'suited-broadway'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the small blind with KQo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l8', 'open', 'blind-vs-blind', 'broadway'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb and button calls. You are in the big blind with AKo.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l8', 'squeeze', 'premium'], difficultyScore: 73 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the hijack with A5s.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'fold', 'suited-ace'], difficultyScore: 72 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with AQs.', correctAction: 'raise', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l8', 'open', 'premium', 'early-position'], difficultyScore: 70 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the small blind with A8s.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l8', 'blind-vs-open', 'fold'], difficultyScore: 72 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the big blind with K9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l8', 'blind-defense', 'suited-king'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with AKo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', '3bet-value', 'premium'], difficultyScore: 72 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with QJo.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l8', 'blind-vs-btn', 'fold'], difficultyScore: 71 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with 66.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l8', 'open', 'small-pair'], difficultyScore: 70 },
];

const level8CarryoverActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with AQs.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 73, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with AQo.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 73, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with KQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 72, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with KQo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 73, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.3bb. You are in the cutoff with AJs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 72, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with AJo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l8', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 72, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with KJs.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l8', 'blind-vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 73, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with K7s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l8', 'blind-defense', 'suited-king', 'carryover', 'from_tier_1'], difficultyScore: 72, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and hijack calls. You are in the cutoff with TT.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l8', 'multiway', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 73, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and hijack calls. You are in the cutoff with AKo.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l8', 'squeeze', 'premium', 'carryover', 'from_tier_1'], difficultyScore: 74, sourceTier: 'beginner' },
];

const level8OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah Kh on Jh Th 7c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 hearts visible (Ah, Kh in hand + Jh, Th on board); 13-4 = 9 remaining.', tags: ['l8', 'outs', 'flush-draw'], difficultyScore: 70 },
  { prompt: 'You hold 9s 8s on 7d 6c Ah. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 makes 5-6-7-8-9; any T makes 6-7-8-9-T. OESD: 8 outs.', tags: ['l8', 'outs', 'oesd'], difficultyScore: 70 },
  { prompt: 'You hold Jd Qd on Kc Ad 2d. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 diamonds seen (Jd, Qd in hand + Ad, 2d on board); 13-4 = 9 flush outs.', tags: ['l8', 'outs', 'flush-draw'], difficultyScore: 71 },
  { prompt: 'You hold Tc Jc on 9c 8c 2d. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 club flush outs + 8 straight outs (Q or 7) - 2 overlap (Qc, 7c) = 15.', tags: ['l8', 'outs', 'combo-draw'], difficultyScore: 73 },
  { prompt: 'You hold 2d 2s on 8h Ks 4d. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two deuces remain in the deck.', tags: ['l8', 'outs', 'pair-to-trips'], difficultyScore: 71 },
  { prompt: 'You hold Qs Ks on Js 6s 2c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (Qs, Ks in hand + Js, 6s on board); 13-4 = 9 remaining.', tags: ['l8', 'outs', 'flush-draw'], difficultyScore: 70 },
  { prompt: 'You hold As 4s on 3s 5d 9h. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '4', explanation: 'Only a 2 completes A-2-3-4-5. This is a one-sided gutshot: 4 outs.', tags: ['l8', 'outs', 'gutshot-wheel'], difficultyScore: 72 },
  { prompt: 'You hold 6d 7d on 8d 9d Ks. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 diamond flush outs + 8 straight outs (5 or T) - 2 overlap (5d, Td) = 15.', tags: ['l8', 'outs', 'combo-draw'], difficultyScore: 73 },
  { prompt: 'You hold Ah Tc on Th Jc 2d. How many outs improve to two pair or trips on the turn?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces make two pair; two tens make trips. Total: 5 outs.', tags: ['l8', 'outs', 'made-hand-improve'], difficultyScore: 72 },
  { prompt: 'You hold 4h 4c on Ah Kd 7s. How many outs make a set or better on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two fours remain for a set.', tags: ['l8', 'outs', 'set-outs'], difficultyScore: 71 },
];

const level8EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $54 and villain bets $18. What break-even equity do you need?', choices: ['20%', '23%', '25%', '30%'], correctAnswer: '25%', explanation: '18/72 = 25%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 70 },
  { prompt: 'Pot is $44 and it costs $24 to call. What break-even equity do you need?', choices: ['30%', '33%', '35%', '40%'], correctAnswer: '35%', explanation: '24/68 ≈ 35.3%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 71 },
  { prompt: 'Pot is $66 and it costs $33 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '33/99 = 33%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 71 },
  { prompt: 'Pot is $80 and villain bets $40. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '40/120 = 33%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 71 },
  { prompt: 'Pot is $100 and villain bets $20. You estimate 25% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 20/120 ≈ 17%. Your 25% exceeds this; call is +EV.', tags: ['l8', 'ev', 'decision'], difficultyScore: 72 },
  { prompt: 'You need 40% equity to call. You estimate 48% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '48% well exceeds the 40% requirement; call is strongly +EV.', tags: ['l8', 'ev', 'decision'], difficultyScore: 72 },
  { prompt: 'Pot is $36 and villain bets $12. What break-even equity do you need?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '12/48 = 25%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 70 },
  { prompt: 'Pot is $42 and villain bets $21. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '21/63 = 33%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 71 },
  { prompt: 'Pot is $56 and it costs $14 to call. What break-even equity do you need?', choices: ['14%', '18%', '20%', '25%'], correctAnswer: '20%', explanation: '14/70 = 20%.', tags: ['l8', 'ev', 'pot-odds'], difficultyScore: 72 },
  { prompt: 'You need 33% equity to call. You estimate 31% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '31% falls short of the 33% break-even threshold; fold saves chips.', tags: ['l8', 'ev', 'decision'], difficultyScore: 73 },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 9  (global level 9, local level 4)  difficulty ~75–80
// ─────────────────────────────────────────────────────────────────────────────

const level9NativeActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the cutoff with KJs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'suited-broadway'], difficultyScore: 75 },
  { prompt: '6-max cash game. 80bb effective. Cutoff opens to 2.5bb. You are on the button with KQo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 80, tags: ['l9', 'vs-open', 'stack-depth', 'broadway'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the big blind with Q9s.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', 'fold'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb and hijack calls. You are in the cutoff with TT.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l9', 'squeeze', 'pair', 'isolation'], difficultyScore: 77 },
  { prompt: '6-max cash game. 120bb effective. Folded to you in the cutoff with T9s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 120, tags: ['l9', 'open', 'deep-stack', 'suited-connector'], difficultyScore: 75 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with 88.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l9', 'blind-vs-btn', 'pair'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the big blind with QJo.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', 'fold'], difficultyScore: 77 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb and button calls. You are in the small blind with AQo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l9', 'squeeze', 'broadway', '3-way'], difficultyScore: 78 },
  { prompt: '6-max cash game. 60bb effective. Under the gun opens to 2.5bb. You are on the button with 99.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 60, tags: ['l9', 'vs-open', 'shallow-stack', '3bet-jam'], difficultyScore: 78 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with A3s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'open', 'small-suited-ace'], difficultyScore: 75 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the hijack with KTs.', correctAction: 'call', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'suited-king'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with J9s.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'suited-connector'], difficultyScore: 75 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with AKo.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l9', 'vs-open', '3bet-value', 'premium'], difficultyScore: 77 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with A3s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', '3bet-bluff', 'small-suited-ace'], difficultyScore: 78 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the hijack with J8s.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'fold'], difficultyScore: 77 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with A9o.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l9', 'open', 'fold', 'ace-x'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with K8s.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'suited-king'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the big blind with 54s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', 'suited-connector'], difficultyScore: 76 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with KJs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'isolation', 'squeeze', 'suited-broadway'], difficultyScore: 78 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the small blind with QTs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l9', 'open', 'blind-vs-blind', 'suited-broadway'], difficultyScore: 76 },
];

const level9CarryoverActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 99.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 66.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with T7o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 77, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with A5s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', '3bet-bluff', 'carryover', 'from_tier_1'], difficultyScore: 79, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with JJ.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l9', 'vs-open', '3bet-value', 'carryover', 'from_tier_1'], difficultyScore: 79, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with 88.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the big blind with AJs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l9', 'blind-defense', 'call', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in middle position with TT.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 79, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.3bb. You are in the cutoff with KQs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'suited-broadway', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are on the button with ATo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l9', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 78, sourceTier: 'beginner' },
];

const level9OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ad 2d on Kd Qd 7c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 diamonds seen (Ad, 2d in hand + Kd, Qd on board); 13-4 = 9 flush outs.', tags: ['l9', 'outs', 'flush-draw'], difficultyScore: 75 },
  { prompt: 'You hold 5h 6h on 7d 8c Ac. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 4 makes 4-5-6-7-8; any 9 makes 5-6-7-8-9. OESD: 8 outs.', tags: ['l9', 'outs', 'oesd'], difficultyScore: 75 },
  { prompt: 'You hold Jd Qd on Kc Ac 2d. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a T completes A-K-Q-J-T. One-sided draw (gutshot): 4 outs.', tags: ['l9', 'outs', 'gutshot'], difficultyScore: 76 },
  { prompt: 'You hold Ac Kc on Qd 7h 2c. How many overcard outs pair an ace or king?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three kings remain as overcard outs.', tags: ['l9', 'outs', 'overcards'], difficultyScore: 76 },
  { prompt: 'You hold 8c 8d on Kh Qs 4c. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two eights remain in the deck for a set.', tags: ['l9', 'outs', 'pair-to-trips'], difficultyScore: 75 },
  { prompt: 'You hold Th Jh on 9h 8h 3d. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 heart flush outs + 8 straight outs (Q or 7) - 2 overlap (Qh, 7h) = 15.', tags: ['l9', 'outs', 'combo-draw'], difficultyScore: 78 },
  { prompt: 'You hold Ks 4s on As 5s Kd. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (Ks, 4s in hand + As, 5s on board); 13-4 = 9 flush outs.', tags: ['l9', 'outs', 'flush-draw'], difficultyScore: 76 },
  { prompt: 'You hold 2c 3c on 4d 5c 9h. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any A makes A-2-3-4-5; any 6 makes 2-3-4-5-6. OESD: 8 outs.', tags: ['l9', 'outs', 'oesd'], difficultyScore: 76 },
  { prompt: 'You hold Qs Ks on Js Ts Ah. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (Qs, Ks in hand + Js, Ts on board); 13-4 = 9.', tags: ['l9', 'outs', 'flush-draw'], difficultyScore: 75 },
  { prompt: 'You hold As Ad on Kh Qc 5s. How many outs improve to trips or better on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two aces remain for trips; the other two are in hero\'s hand.', tags: ['l9', 'outs', 'pair-to-trips'], difficultyScore: 77 },
];

const level9EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $52 and villain bets $26. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '26/78 = 33%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 75 },
  { prompt: 'Pot is $72 and it costs $30 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '29%', explanation: '30/102 ≈ 29.4%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 76 },
  { prompt: 'Pot is $28 and it costs $20 to call. What break-even equity do you need?', choices: ['40%', '42%', '45%', '50%'], correctAnswer: '42%', explanation: '20/48 ≈ 41.7%, about 42%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 77 },
  { prompt: 'Pot is $110 and villain bets $22. What break-even equity do you need?', choices: ['14%', '17%', '20%', '25%'], correctAnswer: '17%', explanation: '22/132 ≈ 16.7%, about 17%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 77 },
  { prompt: 'Pot is $60 and villain bets $30. You estimate 35% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 30/90 = 33%. Your 35% exceeds this; call is +EV.', tags: ['l9', 'ev', 'decision'], difficultyScore: 76 },
  { prompt: 'You need 25% equity to call. You estimate 23% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '23% is below the 25% break-even; fold is the correct decision.', tags: ['l9', 'ev', 'decision'], difficultyScore: 76 },
  { prompt: 'Pot is $48 and villain bets $12. What break-even equity do you need?', choices: ['16%', '18%', '20%', '25%'], correctAnswer: '20%', explanation: '12/60 = 20%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 76 },
  { prompt: 'Pot is $64 and it costs $32 to call. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '32/96 = 33%.', tags: ['l9', 'ev', 'pot-odds'], difficultyScore: 77 },
  { prompt: 'Pot is $40 and villain bets $20. What are your direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '3:1', explanation: 'Call 20 to win 60 total: 60/20 = 3:1 odds.', tags: ['l9', 'ev', 'pot-odds-ratio'], difficultyScore: 77 },
  { prompt: 'Pot is $75 and villain bets $25. You estimate 29% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 25/100 = 25%. Your 29% exceeds this; call is +EV.', tags: ['l9', 'ev', 'decision'], difficultyScore: 78 },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 10  (global level 10, local level 5)  difficulty ~80–85
// ─────────────────────────────────────────────────────────────────────────────

const level10NativeActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 150bb effective. Under the gun opens to 2.5bb. You are in the cutoff with KQs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 150, tags: ['l10', 'vs-open', 'deep-stack', 'suited-broadway'], difficultyScore: 80 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb and middle position calls. You are on the button with QQ.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'isolation', 'squeeze', 'premium'], difficultyScore: 81 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb and button calls. You are in the small blind with KK.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'squeeze', 'premium', '3-way'], difficultyScore: 82 },
  { prompt: '6-max cash game. 40bb effective. Under the gun opens to 2.5bb. You are on the button with 99.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 40, tags: ['l10', 'vs-open', 'shallow-stack', 'shove-leverage'], difficultyScore: 82 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with QTo.', correctAction: 'fold', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l10', 'open', 'fold', 'early-position'], difficultyScore: 80 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are in the big blind with AKs.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l10', 'squeeze', 'premium', '3-way'], difficultyScore: 82 },
  { prompt: '6-max cash game. 80bb effective. Cutoff opens to 2.5bb. You are on the button with A6s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 80, tags: ['l10', 'vs-open', '3bet-bluff', 'suited-ace', 'stack-depth'], difficultyScore: 82 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with QQ.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l10', 'blind-defense', '3bet-value', 'premium'], difficultyScore: 83 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with 76s.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-open', 'fold'], difficultyScore: 81 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with T8s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'open', 'suited-connector'], difficultyScore: 80 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with KTs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-btn', '3bet-value'], difficultyScore: 82 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb and middle position calls. You are in the cutoff with JJ.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l10', 'squeeze', 'premium', 'multiway'], difficultyScore: 83 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with A4s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l10', 'vs-open', '3bet-bluff', 'small-suited-ace'], difficultyScore: 82 },
  { prompt: '6-max cash game. 60bb effective. Button opens to 2.5bb. You are in the big blind with A7s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 60, tags: ['l10', 'blind-vs-btn', 'stack-depth', '3bet'], difficultyScore: 83 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with ATo.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l10', 'open', 'ace-broadway'], difficultyScore: 80 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with 88.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'fold', 'position'], difficultyScore: 82 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with J9o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'fold', 'broadway'], difficultyScore: 81 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the small blind with A8o.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'open', 'blind-vs-blind', 'ace-x'], difficultyScore: 80 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'multiway', 'set-mine', 'pair'], difficultyScore: 81 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with JJ.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-open', '3bet-value', 'premium'], difficultyScore: 83 },
];

const level10CarryoverActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are on the button with AQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 83, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are on the button with AQo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 84, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.3bb. You are on the button with 99.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 83, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.3bb. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'pair', 'carryover', 'from_tier_1'], difficultyScore: 83, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are on the button with KTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l10', 'vs-open', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 84, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with AJo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-btn', '3bet', 'carryover', 'from_tier_1'], difficultyScore: 84, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with KJs.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-btn', 'call', 'carryover', 'from_tier_1'], difficultyScore: 83, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with QTo.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-btn', 'fold', 'carryover', 'from_tier_1'], difficultyScore: 83, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the small blind with AQs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-open', '3bet-value', 'carryover', 'from_tier_1'], difficultyScore: 84, sourceTier: 'beginner' },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the small blind with 99.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l10', 'blind-vs-open', 'call', 'carryover', 'from_tier_1'], difficultyScore: 84, sourceTier: 'beginner' },
];

const level10OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Kh Ah on Qh Jh 4c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 hearts seen (Kh, Ah in hand + Qh, Jh on board); 13-4 = 9 flush outs.', tags: ['l10', 'outs', 'flush-draw'], difficultyScore: 80 },
  { prompt: 'You hold 8c 9c on 7d 6c Ks. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 makes 5-6-7-8-9; any T makes 6-7-8-9-T. OESD: 8 outs.', tags: ['l10', 'outs', 'oesd'], difficultyScore: 80 },
  { prompt: 'You hold Qs Js on Ks As 2c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (Qs, Js in hand + Ks, As on board); 13-4 = 9 flush outs.', tags: ['l10', 'outs', 'flush-draw'], difficultyScore: 81 },
  { prompt: 'You hold 5d 6d on 4d 7d Kh. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 diamond flush outs + 8 straight outs (3 or 8) - 2 overlap (3d, 8d) = 15.', tags: ['l10', 'outs', 'combo-draw'], difficultyScore: 83 },
  { prompt: 'You hold Ah Kh on Qh 9h 4c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 hearts seen (Ah, Kh in hand + Qh, 9h on board); 13-4 = 9 flush outs.', tags: ['l10', 'outs', 'flush-draw'], difficultyScore: 80 },
  { prompt: 'You hold 3d 4d on 2d 5d 9h. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 diamond flush outs + 8 straight outs (A or 6) - 2 overlap (Ad, 6d) = 15.', tags: ['l10', 'outs', 'combo-draw'], difficultyScore: 83 },
  { prompt: 'You hold Kc Qc on Jd Tc 7h. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A makes A-K-Q-J-T; any 9 makes 9-T-J-Q-K. OESD: 8 outs.', tags: ['l10', 'outs', 'oesd-broadway'], difficultyScore: 82 },
  { prompt: 'You hold 7h 8h on 6h 9h Ks. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 heart flush outs + 8 straight outs (5 or T) - 2 overlap (5h, Th) = 15.', tags: ['l10', 'outs', 'combo-draw'], difficultyScore: 83 },
  { prompt: 'You hold Jd Td on Qc 9s 5d. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any K makes K-Q-J-T-9; any 8 makes 8-9-T-J-Q. OESD: 8 outs.', tags: ['l10', 'outs', 'oesd'], difficultyScore: 82 },
  { prompt: 'You hold Kd Qd on Jd Td 2h. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 diamonds seen (Kd, Qd in hand + Jd, Td on board); 13-4 = 9 flush outs.', tags: ['l10', 'outs', 'flush-draw'], difficultyScore: 81 },
];

const level10EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $58 and villain bets $29. What break-even equity do you need?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '29/87 = 33%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 80 },
  { prompt: 'Pot is $84 and it costs $21 to call. What break-even equity do you need?', choices: ['16%', '18%', '20%', '25%'], correctAnswer: '20%', explanation: '21/105 = 20%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 81 },
  { prompt: 'Pot is $30 and it costs $22 to call. What break-even equity do you need?', choices: ['38%', '40%', '42%', '45%'], correctAnswer: '42%', explanation: '22/52 ≈ 42.3%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 82 },
  { prompt: 'Pot is $120 and villain bets $48. What break-even equity do you need?', choices: ['25%', '27%', '29%', '33%'], correctAnswer: '29%', explanation: '48/168 ≈ 28.6%, about 29%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 82 },
  { prompt: 'Pot is $96 and villain bets $24. You estimate 21% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 24/120 = 20%. Your 21% exceeds this; call is +EV.', tags: ['l10', 'ev', 'decision'], difficultyScore: 82 },
  { prompt: 'You need 42% equity to call. You estimate 38% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '38% falls short of the 42% break-even threshold; folding is correct.', tags: ['l10', 'ev', 'decision'], difficultyScore: 83 },
  { prompt: 'Pot is $42 and villain bets $14. What break-even equity do you need?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '14/56 = 25%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 80 },
  { prompt: 'Pot is $78 and it costs $26 to call. What break-even equity do you need?', choices: ['20%', '23%', '25%', '29%'], correctAnswer: '25%', explanation: '26/104 = 25%.', tags: ['l10', 'ev', 'pot-odds'], difficultyScore: 81 },
  { prompt: 'Pot is $50 and villain bets $25. What are your direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '3:1', explanation: 'Call 25 to win 75 total: 75/25 = 3:1 odds.', tags: ['l10', 'ev', 'pot-odds-ratio'], difficultyScore: 82 },
  { prompt: 'Pot is $90 and villain bets $45. You estimate 38% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: 'Break-even: 45/135 = 33%. Your 38% exceeds this; call is +EV.', tags: ['l10', 'ev', 'decision'], difficultyScore: 83 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Assemble questions per level
// ─────────────────────────────────────────────────────────────────────────────

function buildLevel(
  level: Level,
  nativeActionSeeds: ActionSeed[],
  carryoverActionSeeds: ActionSeed[],
  outsSeeds: MathSeed[],
  evSeeds: MathSeed[],
): ChallengeQuestion[] {
  const allActionSeeds = [...nativeActionSeeds, ...carryoverActionSeeds];
  return [
    ...allActionSeeds.map((seed, i) => makeActionQuestion(level, i, seed)),
    ...outsSeeds.map((seed, i) => makeMathQuestion(level, i, 'outs', seed)),
    ...evSeeds.map((seed, i) => makeMathQuestion(level, i, 'ev', seed)),
  ];
}

export const tier2ApprenticeQuestions: ChallengeQuestion[] = [
  ...buildLevel(1, level6NativeActionSeeds, level6CarryoverActionSeeds, level6OutsSeeds, level6EvSeeds),
  ...buildLevel(2, level7NativeActionSeeds, level7CarryoverActionSeeds, level7OutsSeeds, level7EvSeeds),
  ...buildLevel(3, level8NativeActionSeeds, level8CarryoverActionSeeds, level8OutsSeeds, level8EvSeeds),
  ...buildLevel(4, level9NativeActionSeeds, level9CarryoverActionSeeds, level9OutsSeeds, level9EvSeeds),
  ...buildLevel(5, level10NativeActionSeeds, level10CarryoverActionSeeds, level10OutsSeeds, level10EvSeeds),
];

export function getTier2ByLevel(level: 1 | 2 | 3 | 4 | 5): ChallengeQuestion[] {
  return tier2ApprenticeQuestions.filter((q) => q.level === level);
}

export function getTier2ByCategory(category: 'action' | 'outs' | 'ev'): ChallengeQuestion[] {
  return tier2ApprenticeQuestions.filter((q) => q.category === category);
}
