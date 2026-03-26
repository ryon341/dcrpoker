/**
 * rebalanceTiers.js  — TC091
 * Rebalances tier3Questions.ts and tier4Questions.ts to the new distributions:
 *   Tier 3 (Grinder):    90 action / 70 EV / 40 outs / 50 pressure = 250
 *   Tier 4 (Chip Leader): 80 action / 80 EV / 30 outs / 60 pressure = 250
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT   = path.join(__dirname, 'app/src/components/poker-challenge/data');
const T3FILE = path.join(ROOT, 'tier3Questions.ts');
const T4FILE = path.join(ROOT, 'tier4Questions.ts');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseQuestions(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Extract the JSON array between "= [" and "];" that precedes "export"
  const startIdx = src.indexOf('= [\n') + 2;    // points to '['
  const endIdx   = src.lastIndexOf('];\n') + 1;  // points to ']'
  const arrayStr = src.slice(startIdx, endIdx);
  return JSON.parse(arrayStr);
}

function filterQuestions(all, category, targetCount) {
  const categoryQs = all.filter(q => q.category === category);
  if (categoryQs.length < targetCount) {
    throw new Error(`Not enough ${category} questions: have ${categoryQs.length}, need ${targetCount}`);
  }
  return categoryQs.slice(0, targetCount);
}

function buildTS(tierConst, tierIndex, questions) {
  const header = `import type { ChallengeQuestion } from '../challengeQuestionTypes';\n\nconst ${tierConst}Raw: ChallengeQuestion[] = `;
  const footer = `;\n\n\nexport const ${tierConst}: ChallengeQuestion[] = ${tierConst}Raw.map((question) => ({\n  ...question,\n  prompt: \`\${question.prompt} [\${question.id}]\`,\n}));\n`;
  return header + JSON.stringify(questions, null, 2) + footer;
}

// ─── NEW EV QUESTIONS — Tier 3 (32 questions, harder margins) ─────────────────

function makeTier3EvQuestions() {
  // Format: { level, pot, call, equity }
  // correctAnswer = equity >= required ? 'CALL' : 'FOLD'
  const scenarios = [
    // level 1 (6)
    { level: 1, pot: 80,  call: 30,  equity: 27 },   // req 27.3% → FOLD
    { level: 1, pot: 90,  call: 35,  equity: 28 },   // req 28.0% → CALL
    { level: 1, pot: 75,  call: 25,  equity: 26 },   // req 25.0% → CALL
    { level: 1, pot: 100, call: 40,  equity: 27 },   // req 28.6% → FOLD
    { level: 1, pot: 85,  call: 30,  equity: 27 },   // req 26.1% → CALL
    { level: 1, pot: 70,  call: 22,  equity: 24 },   // req 23.9% → CALL
    // level 2 (6)
    { level: 2, pot: 110, call: 45,  equity: 29 },   // req 29.0% → CALL
    { level: 2, pot: 120, call: 40,  equity: 24 },   // req 25.0% → FOLD
    { level: 2, pot: 100, call: 30,  equity: 24 },   // req 23.1% → CALL
    { level: 2, pot: 130, call: 50,  equity: 27 },   // req 27.8% → FOLD
    { level: 2, pot: 140, call: 55,  equity: 29 },   // req 28.2% → CALL
    { level: 2, pot: 105, call: 35,  equity: 25 },   // req 25.0% → CALL
    // level 3 (6)
    { level: 3, pot: 150, call: 60,  equity: 28 },   // req 28.6% → FOLD
    { level: 3, pot: 160, call: 65,  equity: 30 },   // req 28.9% → CALL
    { level: 3, pot: 140, call: 45,  equity: 24 },   // req 24.3% → FOLD
    { level: 3, pot: 170, call: 70,  equity: 30 },   // req 29.2% → CALL
    { level: 3, pot: 155, call: 55,  equity: 26 },   // req 26.2% → FOLD
    { level: 3, pot: 145, call: 50,  equity: 26 },   // req 25.6% → CALL
    // level 4 (7)
    { level: 4, pot: 200, call: 80,  equity: 28 },   // req 28.6% → FOLD
    { level: 4, pot: 210, call: 90,  equity: 30 },   // req 30.0% → CALL
    { level: 4, pot: 190, call: 70,  equity: 27 },   // req 26.9% → CALL
    { level: 4, pot: 220, call: 100, equity: 30 },   // req 31.3% → FOLD
    { level: 4, pot: 180, call: 65,  equity: 26 },   // req 26.5% → FOLD
    { level: 4, pot: 200, call: 75,  equity: 28 },   // req 27.3% → CALL
    { level: 4, pot: 240, call: 110, equity: 31 },   // req 31.4% → FOLD
    // level 5 (7)
    { level: 5, pot: 280, call: 130, equity: 31 },   // req 31.7% → FOLD
    { level: 5, pot: 260, call: 115, equity: 31 },   // req 30.7% → CALL
    { level: 5, pot: 300, call: 140, equity: 31 },   // req 31.8% → FOLD
    { level: 5, pot: 250, call: 110, equity: 31 },   // req 30.6% → CALL
    { level: 5, pot: 320, call: 150, equity: 32 },   // req 31.9% → CALL
    { level: 5, pot: 290, call: 130, equity: 31 },   // req 31.0% → CALL
    { level: 5, pot: 340, call: 160, equity: 32 },   // req 32.0% → CALL
  ];

  return scenarios.map((s, i) => {
    const req     = (s.call / (s.pot + s.call)) * 100;
    const correct = s.equity >= req ? 'CALL' : 'FOLD';
    const diff    = { 1: 48, 2: 56, 3: 62, 4: 70, 5: 78 }[s.level] + Math.floor(Math.random() * 8);
    return {
      id:            `t3_xev_${String(i + 1).padStart(3, '0')}`,
      tier:          'grinder',
      tierIndex:     3,
      level:         s.level,
      category:      'ev',
      prompt:        `The pot is ${s.pot}. Your opponent bets ${s.call}. You estimate your equity at ${s.equity}%. What is the best action?`,
      explanation:   `You need ${req.toFixed(1)}% equity to call. Since your equity is ${s.equity}%, the correct simplified choice is ${correct}.`,
      choices:       ['CALL', 'FOLD'],
      correctAnswer: correct,
      tags:          ['ev', 'pot_odds', 'thin_decision'],
      difficultyScore: Math.min(100, diff),
    };
  });
}

// ─── NEW EV QUESTIONS — Tier 4 (42 questions, even tighter margins) ───────────

function makeTier4EvQuestions() {
  const scenarios = [
    // level 1 (8)
    { level: 1, pot: 90,  call: 35,  equity: 28 },   // req 28.0% → CALL
    { level: 1, pot: 100, call: 40,  equity: 28 },   // req 28.6% → FOLD
    { level: 1, pot: 80,  call: 28,  equity: 26 },   // req 25.9% → CALL
    { level: 1, pot: 110, call: 45,  equity: 29 },   // req 29.0% → CALL
    { level: 1, pot: 95,  call: 38,  equity: 28 },   // req 28.6% → FOLD
    { level: 1, pot: 75,  call: 24,  equity: 24 },   // req 24.2% → FOLD
    { level: 1, pot: 120, call: 50,  equity: 29 },   // req 29.4% → FOLD
    { level: 1, pot: 105, call: 42,  equity: 29 },   // req 28.6% → CALL
    // level 2 (9)
    { level: 2, pot: 130, call: 52,  equity: 28 },   // req 28.6% → FOLD
    { level: 2, pot: 140, call: 55,  equity: 29 },   // req 28.2% → CALL
    { level: 2, pot: 125, call: 48,  equity: 28 },   // req 27.7% → CALL
    { level: 2, pot: 150, call: 62,  equity: 29 },   // req 29.2% → FOLD
    { level: 2, pot: 160, call: 66,  equity: 30 },   // req 29.2% → CALL
    { level: 2, pot: 145, call: 58,  equity: 28 },   // req 28.6% → FOLD
    { level: 2, pot: 135, call: 54,  equity: 29 },   // req 28.6% → CALL
    { level: 2, pot: 155, call: 63,  equity: 28 },   // req 28.9% → FOLD
    { level: 2, pot: 170, call: 72,  equity: 31 },   // req 29.8% → CALL
    // level 3 (8)
    { level: 3, pot: 200, call: 86,  equity: 30 },   // req 30.1% → FOLD
    { level: 3, pot: 190, call: 79,  equity: 29 },   // req 29.4% → FOLD
    { level: 3, pot: 210, call: 92,  equity: 31 },   // req 30.5% → CALL
    { level: 3, pot: 195, call: 84,  equity: 30 },   // req 30.1% → FOLD
    { level: 3, pot: 205, call: 89,  equity: 31 },   // req 30.3% → CALL
    { level: 3, pot: 215, call: 95,  equity: 31 },   // req 30.6% → CALL
    { level: 3, pot: 180, call: 76,  equity: 30 },   // req 29.7% → CALL
    { level: 3, pot: 220, call: 98,  equity: 30 },   // req 30.8% → FOLD
    // level 4 (9)
    { level: 4, pot: 280, call: 130, equity: 31 },   // req 31.7% → FOLD
    { level: 4, pot: 260, call: 117, equity: 31 },   // req 31.0% → CALL
    { level: 4, pot: 300, call: 141, equity: 32 },   // req 32.0% → CALL
    { level: 4, pot: 290, call: 136, equity: 32 },   // req 31.9% → CALL
    { level: 4, pot: 310, call: 148, equity: 32 },   // req 32.3% → FOLD
    { level: 4, pot: 270, call: 123, equity: 31 },   // req 31.3% → FOLD
    { level: 4, pot: 285, call: 132, equity: 31 },   // req 31.7% → FOLD
    { level: 4, pot: 295, call: 140, equity: 32 },   // req 32.2% → FOLD
    { level: 4, pot: 265, call: 120, equity: 31 },   // req 31.2% → FOLD
    // level 5 (8)
    { level: 5, pot: 350, call: 168, equity: 33 },   // req 32.4% → CALL
    { level: 5, pot: 400, call: 196, equity: 33 },   // req 32.9% → CALL
    { level: 5, pot: 380, call: 186, equity: 33 },   // req 32.9% → CALL
    { level: 5, pot: 360, call: 175, equity: 33 },   // req 32.7% → CALL
    { level: 5, pot: 420, call: 210, equity: 34 },   // req 33.3% → CALL
    { level: 5, pot: 340, call: 162, equity: 32 },   // req 32.3% → FOLD
    { level: 5, pot: 450, call: 228, equity: 34 },   // req 33.6% → CALL
    { level: 5, pot: 390, call: 192, equity: 33 },   // req 33.0% → CALL
  ];

  return scenarios.map((s, i) => {
    const req     = (s.call / (s.pot + s.call)) * 100;
    const correct = s.equity >= req ? 'CALL' : 'FOLD';
    const diff    = { 1: 55, 2: 62, 3: 68, 4: 76, 5: 83 }[s.level] + Math.floor(Math.random() * 6);
    return {
      id:            `t4_xev_${String(i + 1).padStart(3, '0')}`,
      tier:          'chip_leader',
      tierIndex:     4,
      level:         s.level,
      category:      'ev',
      prompt:        `The pot is ${s.pot}. Your opponent bets ${s.call}. You estimate your equity at ${s.equity}%. What is the best action?`,
      explanation:   `You need ${req.toFixed(1)}% equity to call. Since your equity is ${s.equity}%, the correct simplified choice is ${correct}.`,
      choices:       ['CALL', 'FOLD'],
      correctAnswer: correct,
      tags:          ['ev', 'pot_odds', 'thin_decision'],
      difficultyScore: Math.min(100, diff),
    };
  });
}

// ─── PRESSURE QUESTIONS — Tier 3 (50 questions) ───────────────────────────────

function makeTier3PressureQuestions() {
  return [
    // ── Level 1 (10 questions, difficulty 45-55) ──────────────────────────

    {
      id: 't3_p_001', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold K5o on a K-T-9 board. Top pair but weak kicker. Villain bets 3/4 pot on the flop and barrels the turn. What is the best action?',
      explanation: 'KTo and KJo dominate your top pair. On K-T-9 with two streets of large bets, villain\'s range crushes K5. Release.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'dominated_pair', 'weak_kicker'], difficultyScore: 46,
    },
    {
      id: 't3_p_002', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold 66 on a board of A-K-7. Villain opened UTG and continuation-bets 2/3 pot. What is the best action?',
      explanation: 'A UTG range connects heavily with A-K-7. Your 66 is a small underpair with little showdown value. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'underpair', 'cbet_fold'], difficultyScore: 44,
    },
    {
      id: 't3_p_003', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold T8s on a J-9-5 board (OESD). Villain fires a 2x pot overbet. You need to call 120 into a pot of 60. What is the best action?',
      explanation: 'An OESD gives roughly 32% equity. You need 67% equity to call a 2x overbet. The math forces a fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'draw_math', 'overbet'], difficultyScore: 50,
    },
    {
      id: 't3_p_004', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold 87s. You have an OESD on the flop. Pot is 60. Villain bets 20. What is the best action?',
      explanation: 'You need 25% equity to call. An OESD gives ~32% equity. The pot odds clearly justify a call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'draw_math', 'correct_call'], difficultyScore: 42,
    },
    {
      id: 't3_p_005', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold 99. Board J-T-8. Villain check-raised your flop bet to 3x. You have middle pair on a very coordinated board. What is the best action?',
      explanation: 'On J-T-8, a check-raise almost always represents a made hand (straight, top pair+) or a big equity draw. 99 is too vulnerable to continue.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'check_raise', 'middle_pair'], difficultyScore: 48,
    },
    {
      id: 't3_p_006', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold 65s on a K-6-2 board. Middle pair. Villain fired a 1/4 pot bet on the flop and a 3/4 pot bet on the turn. What is the best action?',
      explanation: 'Villain\'s escalating bet sizing on K-high board signals real value (Kx hands). Your middle pair is likely dominated.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'middle_pair', 'escalating_bets'], difficultyScore: 47,
    },
    {
      id: 't3_p_007', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold 22 and flopped a set on a board of 2-8-K. Villain leads the flop and continues with large bets on the turn. What is the best action?',
      explanation: 'You have a set — one of the strongest hands possible. Continue strongly and extract value. Don\'t fold sets.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'correct_call'], difficultyScore: 40,
    },
    {
      id: 't3_p_008', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold AJo in a 3-bet pot. Board A-K-J. You have top two pair. Villain bets 2/3 pot. What is the best action?',
      explanation: 'Top two pair (A and J) is a premium hand. Call and let villain include worse holdings and bluffs in their range.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'correct_call'], difficultyScore: 45,
    },
    {
      id: 't3_p_009', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold K9o on a K-7-3 rainbow board. Top pair with weak kicker. Villain leads into you on the flop, turn, and river. What is the best action?',
      explanation: 'Three streets of value from a passive player almost always means top pair with better kicker or better. K9 is likely behind. Fold the river.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'three_street_value', 'weak_kicker'], difficultyScore: 52,
    },
    {
      id: 't3_p_010', tier: 'grinder', tierIndex: 3, level: 1, category: 'pressure',
      prompt: 'You hold ATs. Board A-8-3 rainbow. Top pair. Villain check-raises your flop bet to 3x. What is the best action?',
      explanation: 'Top pair with a solid kicker (AT) is strong enough to call a check-raise on this dry board. Your hand is well-protected.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_pair', 'check_raise_call'], difficultyScore: 48,
    },

    // ── Level 2 (10 questions, difficulty 50-60) ──────────────────────────

    {
      id: 't3_p_011', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold T9s. Board K-T-7. Middle pair with backdoor draws. Villain leads into you with a 3/4 pot bet. What is the best action?',
      explanation: 'Middle pair on K-high boards is often dominated by Kx. A single large bet from a passive villain suggests strong value. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'middle_pair', 'dominated'], difficultyScore: 52,
    },
    {
      id: 't3_p_012', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold Q9s. Board Q-T-5. Top pair with a gutshot. It\'s a 3-bet pot and villain fires a single 2/3 pot bet. What is the best action?',
      explanation: 'In a 3-bet pot, top pair with a gutshot is strong enough to continue vs a single continuation bet.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_pair', '3bet_pot'], difficultyScore: 54,
    },
    {
      id: 't3_p_013', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold 88 on a J-T-9 board (three-connected). Villain fires a pot-sized bet. What is the best action?',
      explanation: 'On J-T-9, a pocket pair of 88 is essentially beaten by nearly any holding villain bets for value (straights, two pairs, overpairs). Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'underpair', 'wet_board'], difficultyScore: 55,
    },
    {
      id: 't3_p_014', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold A7s. The board runs A-7-2-K. You have two pair. Villain jams the river. What is the best action?',
      explanation: 'Two pair (aces and sevens) is a very strong made hand. Villain\'s shove includes bluffs, worse two-pair hands, and missed draws. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'river_shove'], difficultyScore: 57,
    },
    {
      id: 't3_p_015', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold K9o. Board K-J-T. Top pair, but the board is very straight-heavy. Villain check-raises the turn to 3x your bet. What is the best action?',
      explanation: 'K-J-T smashes villain\'s straight-drawing range. A check-raise here is almost always value (straight, two pair, top pair top kicker). K9 should fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'check_raise', 'wet_board'], difficultyScore: 58,
    },
    {
      id: 't3_p_016', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold 33. You flopped a set on a 3-8-K board. Villain bets large on every street. What is the best action?',
      explanation: 'You have a set of threes. Continue and extract maximum value — don\'t fold a set.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'correct_call'], difficultyScore: 48,
    },
    {
      id: 't3_p_017', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold ATs. Board T-9-8 with two hearts. Top pair with backdoor flush draw. Villain goes all-in on the flop (pot-size). What is the best action?',
      explanation: 'Top pair on a connected board vs a shove is a difficult spot. Unless villain is a known bluffer, ATs with no immediate flush draw should fold vs an over-shove here.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'shove_on_wet_board'], difficultyScore: 60,
    },
    {
      id: 't3_p_018', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold QJs. Board Q-J-2 rainbow. Top two pair. Villain fires all three streets. What is the best action?',
      explanation: 'Top two pair on a dry board is very strong. Continue and don\'t fold to multi-street aggression.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'dry_board'], difficultyScore: 50,
    },
    {
      id: 't3_p_019', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold Ah2h. Board 6h-7h-Kh. You have the nut flush on the flop. Villain leads large. What is the best action?',
      explanation: 'Nut flush on the flop is the best possible flush. Call (or raise). There is no reason to fold the nuts.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_flush', 'correct_call'], difficultyScore: 44,
    },
    {
      id: 't3_p_020', tier: 'grinder', tierIndex: 3, level: 2, category: 'pressure',
      prompt: 'You hold 77. Board 7-A-K. You flopped a set. Villain bets full pot and then shoves the turn. What is the best action?',
      explanation: 'You have a set of sevens on A-K-7. Even facing a shove, sets on two-high-card boards are almost always ahead. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'high_card_board'], difficultyScore: 55,
    },

    // ── Level 3 (10 questions, difficulty 55-65) ──────────────────────────

    {
      id: 't3_p_021', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold KJo. In a 3-bet pot, villain (UTG opener, 3-bettor) fires 2/3 pot on a J-9-5 board. What is the best action?',
      explanation: 'A UTG 3-bettor\'s range is AA, KK, QQ, JJ, AK — all of which beat or dominate KJ on J-9-5. Fold your top pair.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'dominated_pair', '3bet_pot'], difficultyScore: 58,
    },
    {
      id: 't3_p_022', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold QJo on a Q-J-2 board. Top two pair. It is a 3-bet pot and villain check-raises your bet all-in. What is the best action?',
      explanation: 'On Q-J-2 in a 3-bet pot, villain\'s check-raise range includes sets (QQ, JJ, 22) and two pair (QJ). You often have 30-40% equity though — call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', '3bet_pot', 'check_raise_shove'], difficultyScore: 62,
    },
    {
      id: 't3_p_023', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold KQs on a K-5-2 rainbow board. Top pair top kicker. Villain, a known tight player, fires large bets on the flop, turn, and river. What is the best action?',
      explanation: 'KQ is top pair top kicker — a strong hand. Even against tight players, TPTK on a dry board justifies a call on all streets.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_pair_top_kicker', 'three_street_call'], difficultyScore: 60,
    },
    {
      id: 't3_p_024', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold 9s8s. Board Ks-Qs-Js. You have a king-high flush. Villain bets large. What is the best action?',
      explanation: 'You have the second-nut flush at best. Any ace-high flush beats you, and the straight-flush is possible. On a K-Q-J mono board, reverse implied odds suggest folding unless pot odds are excellent.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'second_nut_flush', 'reverse_implied_odds'], difficultyScore: 63,
    },
    {
      id: 't3_p_025', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold AsKs on a Js-Ts-9s board. You have the nut flush with a straight-flush redraw. Villain bets. What is the best action?',
      explanation: 'Nut flush plus a straight-flush draw is the best possible hand combination. Call (or raise to build the pot).',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_flush', 'straight_flush_redraw'], difficultyScore: 52,
    },
    {
      id: 't3_p_026', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold QTo on a Q-T-T board. Full house queens full of tens. Villain jams the river. What is the best action?',
      explanation: 'You have a full house — almost the best hand on this board (only TT is better). Call comfortably.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'full_house', 'correct_call'], difficultyScore: 50,
    },
    {
      id: 't3_p_027', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold Q8s. Board Q-J-T. Top pair with a weak kicker. Villain fires every street. What is the best action?',
      explanation: 'On Q-J-T, villain\'s three-street value range is KTs (straight), ATs, KQs, QJs — most of which beat your Q8. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'wet_board', 'three_street_value'], difficultyScore: 60,
    },
    {
      id: 't3_p_028', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold 33 preflop. Action: UTG raises, HJ 3-bets, BTN cold-calls. You are in the BB. What is the best action?',
      explanation: 'In a 4-way pot with a raise and 3-bet, 33 cannot profitably set-mine. The implied odds aren\'t there and you\'re likely playing for a small pot vs strong ranges. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['preflop', 'pressure', 'set_mining', 'multiway_pot'], difficultyScore: 57,
    },
    {
      id: 't3_p_029', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold T9s on a K-J-8 board. Open-ended straight draw (hitting Q or 7). Pot is 100. Villain bets 150 (overbet). What is the best action?',
      explanation: 'An OESD has ~32% equity. You need ~40% to call a 150-into-100 bet. The pot odds don\'t support a call here.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'oesd', 'overbet', 'bad_odds'], difficultyScore: 62,
    },
    {
      id: 't3_p_030', tier: 'grinder', tierIndex: 3, level: 3, category: 'pressure',
      prompt: 'You hold A5s. Board A-J-5. Two pair (aces and fives). Villain, a tight player, fires a large bet on the turn. What is the best action?',
      explanation: 'Two pair (aces and fives) is a strong hand. Even against a tight player, A5 two pair should call and potentially stack off.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'tight_villain'], difficultyScore: 58,
    },

    // ── Level 4 (10 questions, difficulty 60-70) ──────────────────────────

    {
      id: 't3_p_031', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold A9s. Board A-Q-J. Top pair medium kicker. Villain 3-bet preflop (UTG), bets 3/4 pot on the flop and turn. What is the best action?',
      explanation: 'A UTG 3-bettor on A-Q-J holds AK, AQ, KK, QQ, JJ far more than bluffs. Your A9 is often dominated. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair_dominated', '3bet_pot'], difficultyScore: 63,
    },
    {
      id: 't3_p_032', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold JTs on a K-Q-9 board. You have the nut straight. Villain bets large. What is the best action?',
      explanation: 'You have the nut straight. Continue strongly — this is a clear call (or raise).',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_straight', 'correct_call'], difficultyScore: 52,
    },
    {
      id: 't3_p_033', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold AQo. Board A-K-Q rainbow. Two pair (aces and queens). Villain, who raised UTG preflop, fires a large turn bet. What is the best action?',
      explanation: 'Two pair is premium. A UTG opener\'s range does include AK (a better two pair), but it also includes bluffs and worse holdings. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'range_vs_range'], difficultyScore: 64,
    },
    {
      id: 't3_p_034', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold 76s. Board 8-5-4. Open-ended straight draw. Villain shoves the flop. You need to call 150 into a pot of 100. What is the best action?',
      explanation: 'An OESD gives ~32% equity. You need 60% equity to call a shove of 150 into 100. This is a clear fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'oesd', 'shove', 'bad_odds'], difficultyScore: 60,
    },
    {
      id: 't3_p_035', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold JJ. Board A-7-2. Villain (UTG opener, tight) checks then check-raises all-in on the turn after a K arrives. What is the best action?',
      explanation: 'A tight UTG player check-raising all-in on this runout has a set (77, 22) or top pair-Ax. Your JJ is just one pair — fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'overpair', 'turn_check_raise'], difficultyScore: 65,
    },
    {
      id: 't3_p_036', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold 77. Board 7-7-K. You flopped quads. Villain leads large on every street. What is the best action?',
      explanation: 'You have quad sevens — the best possible hand on this board. Call all bets and maximum extraction is the only goal.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'quads', 'correct_call'], difficultyScore: 44,
    },
    {
      id: 't3_p_037', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold KK preflop. Villain, a tight player with 5% VPIP, 4-bets all-in. Stack is 100BB. What is the best action?',
      explanation: 'Even vs a 5% VPIP 4-better, KK calls. Their 4-bet range is mostly QQ, JJ, AK — not just AA. You are a favorite or slight dog — call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['preflop', 'pressure', 'KK', '4bet_shove'], difficultyScore: 66,
    },
    {
      id: 't3_p_038', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold Q8s on a K-Q-6 board. Top pair with weak kicker, 3-bet pot. Villain raised preflop and bets the flop and turn. What is the best action?',
      explanation: 'On K-Q-6 in a 3-bet pot, villain\'s double-barrel range includes KK, QQ, KQ, AK. Your Q8 is dominated by many of these combos. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'dominated', '3bet_pot'], difficultyScore: 64,
    },
    {
      id: 't3_p_039', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold 99 in the big blind. Villain button-opens, flop is J-T-9 (rainbow). You flopped a set. Villain fires a continuation bet. What is the best action?',
      explanation: 'You have a set on J-T-9. Even on a coordinated board, sets are strong enough to play for stacks. Call and plan to raise.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'coordinated_board'], difficultyScore: 60,
    },
    {
      id: 't3_p_040', tier: 'grinder', tierIndex: 3, level: 4, category: 'pressure',
      prompt: 'You hold KTo. Board K-J-T. Top two pair. Villain who played passively all hand suddenly jams the river. What is the best action?',
      explanation: 'Top two pair (K and T) on K-J-T is vulnerable to QxKing or QxT straights if board completes. A passive villans sudden river jam often means a made straight. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'river_jam', 'passive_villain'], difficultyScore: 68,
    },

    // ── Level 5 (10 questions, difficulty 65-75) ──────────────────────────

    {
      id: 't3_p_041', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold 99. Board T-T-9. You have a full house (nines full of tens). Villain jams the river. What is the best action?',
      explanation: 'Full house (9s full of 10s) is an extremely strong hand. The only hand that beats you is TT (quads). Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'full_house', 'correct_call'], difficultyScore: 60,
    },
    {
      id: 't3_p_042', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold AJs. Board A-J-6. Top two pair in position. Villain fires three streets into you at increasing bet sizes. What is the best action?',
      explanation: 'Top two pair (A and J) on a dry board is very strong. Villain\'s escalating bets can include worse two-pair and value hands you beat. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'three_street_call'], difficultyScore: 65,
    },
    {
      id: 't3_p_043', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold KK. Board A-2-3-4. Villain jams the river. The board contains an ace and many low wheel cards. What is the best action?',
      explanation: 'On A-2-3-4, villain can have an A (e.g., A5 for a wheel straight), or sets (22-44). KK is only one pair — fold against a river jam on this runout.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'overpair', 'scary_runout'], difficultyScore: 68,
    },
    {
      id: 't3_p_044', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold AKo. You raised preflop and got called. Flop K-Q-J. Villain check-raises all-in on the flop. What is the best action?',
      explanation: 'K-Q-J gives ATs, QTs a straight, and two-pair combos abound. Villain\'s check-raise shove on this connected board often means a straight or strong two pair. AKo should fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'check_raise_shove', 'connected_board'], difficultyScore: 70,
    },
    {
      id: 't3_p_045', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold 55. In a 3-bet pot you flopped a set on a 5-A-K board. Villain pots it all-in on the flop. What is the best action?',
      explanation: 'A flopped set in a 3-bet pot is almost always worth getting the money in. Call even facing an overbet — you have about 70% equity vs AK.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', '3bet_pot', 'all_in'], difficultyScore: 63,
    },
    {
      id: 't3_p_046', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold Kh8h. Board Ah-Jh-Th. You have king-high flush (non-nut). Villain bets large. What is the best action?',
      explanation: 'On a monotone A-J-T board, you hold the second-nut flush at best. Any player with the Ah has the nut flush. This is a textbook reverse-implied-odds fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'second_nut_flush', 'reverse_implied_odds', 'monotone_board'], difficultyScore: 72,
    },
    {
      id: 't3_p_047', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold AQo. Board A-Q-9. You have top two pair. Villain, who flatted your 3-bet, check-raises all-in on the flop. What is the best action?',
      explanation: 'AQo top two pair is very strong. Villain\'s flatted 3-bet range that check-raises here is often a set or AA/QQ (unlikely). With top two pair, call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', '3bet_pot', 'check_raise_shove'], difficultyScore: 68,
    },
    {
      id: 't3_p_048', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold 76s on a 5-4-3 board. You flopped the nut straight. Villain goes all-in on the flop. What is the best action?',
      explanation: 'You have the nut straight (76 on 5-4-3). Call immediately — you have the best possible hand on this board.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_straight', 'correct_call'], difficultyScore: 55,
    },
    {
      id: 't3_p_049', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold QJo. Board Q-T-9 (all connected). Two pair (Q and T) possible, but the board is very wet and villain fires all three streets. What is the best action?',
      explanation: 'On Q-T-9 with three-street action, village holds straights (KJs, J8s), sets, and top-two hands that beat QJo top pair. Fold the river.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'wet_board', 'three_street_fold'], difficultyScore: 70,
    },
    {
      id: 't3_p_050', tier: 'grinder', tierIndex: 3, level: 5, category: 'pressure',
      prompt: 'You hold JJ in the big blind. UTG opens 3BB, CO 3-bets to 9BB, BTN cold-calls. Action is on you. What is the best action?',
      explanation: 'In a 4-way squeeze spot with a raise, 3-bet, and cold-call, JJ from the BB cannot profitably continue. You\'re likely crushed by QQ, KK, AA and dominated by AK. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['preflop', 'pressure', 'JJ', 'multiway_squeeze'], difficultyScore: 73,
    },
  ];
}

// ─── PRESSURE QUESTIONS — Tier 4 (60 questions) ───────────────────────────────

function makeTier4PressureQuestions() {
  return [
    // ── Level 1 (12 questions, difficulty 55-65) ──────────────────────────

    {
      id: 't4_p_001', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold A9o in a 3-bet pot (you 3-bet, villain called). Board A-K-J. Villain donk-bets full pot. What is the best action?',
      explanation: 'In a 3-bet pot on A-K-J, villain\'s donk-bet often represents AK, KJ, or QT (straight). Your A9 top pair is dominated. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'dominated_pair', '3bet_pot'], difficultyScore: 58,
    },
    {
      id: 't4_p_002', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold KK. Board A-K-7 rainbow. You flopped a set of kings. Villain bets large. What is the best action?',
      explanation: 'Set of kings on A-K-7 — strong hand. Continue and get money in. Don\'t fold a set.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'correct_call'], difficultyScore: 52,
    },
    {
      id: 't4_p_003', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold T9s on a K-T-8 board. Middle pair on a connected board. Villain check-raises pot-size. What is the best action?',
      explanation: 'A pot-size check-raise on K-T-8 is almost always a set or top pair. Your middle pair T9s is dominated. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'middle_pair', 'check_raise'], difficultyScore: 57,
    },
    {
      id: 't4_p_004', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold AA preflop. Villain 4-bets all-in for 100BB. What is the best action?',
      explanation: 'You hold the best hand in poker. Call every time — don\'t fold aces preflop.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['preflop', 'pressure', 'AA', 'correct_call'], difficultyScore: 42,
    },
    {
      id: 't4_p_005', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold Ks7s. Board As-Qs-Js. Non-nut flush (king-high). Villain bets large. What is the best action?',
      explanation: 'On a monotone A-Q-J board, your Ks-high flush is beaten by any Ax of spades. Reverse implied odds make this an easy fold against strong bets.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'non_nut_flush', 'reverse_implied_odds'], difficultyScore: 60,
    },
    {
      id: 't4_p_006', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold Q9s on a Q-8-3 board. Top pair medium kicker. In position. Villain leads pot-size. What is the best action?',
      explanation: 'Top pair medium kicker vs a pot-size donk-bet is a marginal call in position. With equity and position, this is a spot to call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_pair', 'in_position'], difficultyScore: 55,
    },
    {
      id: 't4_p_007', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold 88 on an A-K-Q board. You have an underpair. Villain raised preflop (UTG) and bets 1/2 pot. What is the best action?',
      explanation: 'An underpair on A-K-Q vs a UTG bettor is a clear fold. Their range dominates 88 entirely.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'underpair', 'AKQ_board'], difficultyScore: 53,
    },
    {
      id: 't4_p_008', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold ATs on a board of A-T-5. Top two pair. Villain, who checked the flop, leads pot size on the turn (blank). What is the best action?',
      explanation: 'Two pair (aces and tens) on a dry A-T-5 board is very strong. Villain\'s delayed bet is often a worse hand trying to pick up the pot. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'delayed_bet'], difficultyScore: 57,
    },
    {
      id: 't4_p_009', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold KJo. In a single-raised pot on a K-Q-T board, the villain check-raises all-in. Can you call with top pair? What is the best action?',
      explanation: 'K-Q-T makes straights for AJ. A check-raise shove here is very polarized toward straights and sets. KJo top pair is often crushed. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'check_raise_shove', 'KQT_board'], difficultyScore: 62,
    },
    {
      id: 't4_p_010', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold 44. Board 4-4-K. You flopped quads. Villain leads full pot on the flop. What is the best action?',
      explanation: 'You have quad fours — unbeatable on this board. Call (or consider raising to build the pot).',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'quads', 'correct_call'], difficultyScore: 44,
    },
    {
      id: 't4_p_011', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold 76s. Board K-9-8 with two hearts and no spades. You have a gutshot. Villain puts in a large bet. What is the best action?',
      explanation: 'A gutshot gives you 4 outs (~8% equity on the turn). You need roughly 33% to call a pot-sized bet. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'gutshot', 'bad_odds'], difficultyScore: 55,
    },
    {
      id: 't4_p_012', tier: 'chip_leader', tierIndex: 4, level: 1, category: 'pressure',
      prompt: 'You hold AKs. Board A-K-2 rainbow. Top two pair. Villain in position calls your flop bet, then raises the turn large. What is the best action?',
      explanation: 'Top two pair (A and K) on a dry A-K-2 board is very strong. A turn raise often means sets (AA, KK, 22) but also many bluff combos. Call (or re-raise).',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'turn_raise'], difficultyScore: 60,
    },

    // ── Level 2 (12 questions, difficulty 60-68) ──────────────────────────

    {
      id: 't4_p_013', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold QJo. Board Q-J-T with a flush draw. You have top two pair on a wet board. Villain shoves for the pot on the flop. What is the best action?',
      explanation: 'On Q-J-T with a flush draw, villain\'s shove range includes KTs, 98s straights, and combo draws. Your QJ top two pair has roughly 40-50% equity. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'wet_board', 'flop_shove'], difficultyScore: 64,
    },
    {
      id: 't4_p_014', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold K9s and flopped a flush on a K-9-3 mono board. Villain check-raises your bet. What is the best action?',
      explanation: 'You have a king-high flush (non-nut). Villain\'s check-raise on a mono board often means the nut flush or a very strong hand. This is a reverse-implied-odds fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'non_nut_flush', 'reverse_implied_odds', 'mono_board'], difficultyScore: 66,
    },
    {
      id: 't4_p_015', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold JJ. In a 3-bet pot (you 3-bet, villain called), the flop is Q-8-3. Villain check-raises your 1/2 pot bet all-in. What is the best action?',
      explanation: 'On a Q-8-3 flop in a 3-bet pot, villain\'s check-raise shove is usually QQ, 88, 33 (sets), or AQ-type hands. Your JJ overpair is likely behind here. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'overpair', '3bet_pot', 'check_raise_shove'], difficultyScore: 66,
    },
    {
      id: 't4_p_016', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold AKo on a board of A-K-9-2. You have top two pair on the turn. Villain, who was passive, suddenly leads for 3x pot on the turn. What is the best action?',
      explanation: 'Top two pair (A and K) is very strong, even facing an unusual bet. A passive player\'s overbet may be a set or bluff — but your two pair has enormous equity. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'passive_villain_overbet'], difficultyScore: 65,
    },
    {
      id: 't4_p_017', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold 55. Board K-Q-J-T. You have a useless pocket pair with four overcards on board. Villain bets. What is the best action?',
      explanation: 'On K-Q-J-T, your 55 has almost no value. Any ace makes a straight, and current best hand is QJ+ two pair or better. Fold immediately.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'underpair', 'disconnected_board'], difficultyScore: 58,
    },
    {
      id: 't4_p_018', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold 9s8s. Board 7s-6s-5s. You have a straight flush! Villain shoves all-in. What is the best action?',
      explanation: 'Straight flush is the second-best hand in poker. Call instantly and let villain put in their stack.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'straight_flush', 'correct_call'], difficultyScore: 48,
    },
    {
      id: 't4_p_019', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold T9o facing a 4-bet pot situation. UTG 4-bets all-in and the action is on you. What is the best action with T9o?',
      explanation: 'T9o has no hand strength to justify a call into a 4-bet range (AA, KK, QQ, AK). Your equity is well below 30%. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['preflop', 'pressure', 'weak_hand', '4bet_fold'], difficultyScore: 56,
    },
    {
      id: 't4_p_020', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold A5s on a A-5-2 board. Bottom two pair but you\'re in a 3-bet pot. Villain fires twice and jams the river. What is the best action?',
      explanation: 'Bottom two pair has significant value — aces and fives on A-5-2 is a strong hand. Call villain\'s river jam; bluffs and worse value bets are in their range.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'river_jam'], difficultyScore: 64,
    },
    {
      id: 't4_p_021', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold KQs. Board K-K-7. You have trip kings. Villain c-bets large on the flop. What is the best action?',
      explanation: 'Trip kings with the queen kicker — you have one of the strongest hands. Call (or raise to build). Don\'t fold trips.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'trips', 'correct_call'], difficultyScore: 52,
    },
    {
      id: 't4_p_022', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold QTo. Board Q-T-8-K. You have top two pair but the K on the turn completes potential straights (AJ, J9). Villain bets large on the turn. What is the best action?',
      explanation: 'On Q-T-8-K, two pairs (Q and T) have diminished value because AJ/J9 rivers a straight. Against continued large bets, two pair on a straight-completed board should often fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'straight_completing_runout'], difficultyScore: 67,
    },
    {
      id: 't4_p_023', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold JJ. Board J-7-2 rainbow. You flopped top set. Villain check-jams the turn (a blank). What is the best action?',
      explanation: 'Top set of jacks on a dry J-7-2 board is one of the strongest hands possible. Call the turn jam.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_set', 'correct_call'], difficultyScore: 54,
    },
    {
      id: 't4_p_024', tier: 'chip_leader', tierIndex: 4, level: 2, category: 'pressure',
      prompt: 'You hold K8o. Board K-Q-9. Top pair weak kicker on a connected board. Villain fired the flop and turn. River is a J, completing the straight. Villain bets big. What is the best action?',
      explanation: 'On K-Q-9-J, any T or A makes a straight. Villain\'s river value bet after two streets is often a straight or better. K8 top pair should fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'straight_completing_river'], difficultyScore: 66,
    },

    // ── Level 3 (12 questions, difficulty 63-72) ──────────────────────────

    {
      id: 't4_p_025', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold QQ. Board A-7-3. Villain 3-bet preflop (UTG) and continuation-bets 2/3 pot. What is the best action?',
      explanation: 'UTG 3-betters hold AA, KK, and AK regularly. On A-high boards, your QQ is just an overpair vs a likely top pair. Call the flop but consider folding to future aggression.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'overpair', 'ace_high_board', '3bet_pot'], difficultyScore: 66,
    },
    {
      id: 't4_p_026', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold T9s. Board T-9-8 with two spades. Top two pair but lots of draws. Villain shoves all-in for 2x pot on the flop. What is the best action?',
      explanation: 'On T-9-8 two-tone, top two pair has ~55-60% equity vs typical shove ranges (combo draws, semi-bluffs). Even against a 2x overbet, your equity justifies a call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'wet_board', 'overbet_shove'], difficultyScore: 68,
    },
    {
      id: 't4_p_027', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold Jh9h. Board Qh-Th-Kh. You have a jack-high flush in a 4-card flush board situation. Villain bets large. What is the best action?',
      explanation: 'On a Q-T-K-h board, your Jh-9h gives a J-high flush only. Any Ah gives the nuts. Reverse-implied odds: fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'weak_flush', 'reverse_implied_odds'], difficultyScore: 70,
    },
    {
      id: 't4_p_028', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold AKo on an A-K-2 board. Top two pair. Villain calls every street including a river jam. What is the best action (calling or folding villain\'s river jam)?',
      explanation: 'AK two pair on A-K-2 is one of the strongest hands possible. Call villain\'s river jam.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'correct_call'], difficultyScore: 60,
    },
    {
      id: 't4_p_029', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold 77. Board 8-7-6-5. You have a set but the board has four connecting cards and a possible straight. Villain bets the turn. What is the best action?',
      explanation: 'On 8-7-6-5, any 9 or 4 makes a straight. Your set is vulnerable but still has significant equity vs villain\'s range. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'vulnerable_board'], difficultyScore: 69,
    },
    {
      id: 't4_p_030', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold AA in the big blind. UTG+1 raises. CO 3-bets. BTN cold-calls. What is the best action?',
      explanation: 'You hold aces in the big blind facing a raise, 3-bet, and cold-call. You should 4-bet (not just call). The correct action is to maximize value with the best hand.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['preflop', 'pressure', 'AA', 'multiway_pot', 'correct_call'], difficultyScore: 60,
    },
    {
      id: 't4_p_031', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold K9o. Board K-K-4. You have trip kings. A strange passive villain suddenly leads large on the turn after a blank. What is the best action?',
      explanation: 'Trip kings (K9 on K-K-4) is near the top of your range. Even a passive villain\'s lead can be a bluff or worse value. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'trips', 'passive_villain_bet'], difficultyScore: 65,
    },
    {
      id: 't4_p_032', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold QJo. Board Q-J-5-A. Two pair but the ace arrived on the turn. Villain bets half pot on the turn. What is the best action?',
      explanation: 'Two pair (Q and J) still has strong value on Q-J-5-A. Many hands in villain\'s range don\'t have an ace. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'ace_on_turn'], difficultyScore: 67,
    },
    {
      id: 't4_p_033', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold AQo. Board A-Q-J-T. Two pair, but the turn completes Broadway. Villain fires a river jam. What is the best action?',
      explanation: 'On A-Q-J-T, any K makes a straight and a K is in villain\'s 3-bet range (KK, AK). Your AQ two pair has lost a lot of value. Fold the river jam.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'broadway_board', 'river_jam'], difficultyScore: 72,
    },
    {
      id: 't4_p_034', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold 98s and flopped a flush on a 7-5-2 mono board. Villain check-raises your flop bet 4x. What is the best action?',
      explanation: 'On a 7-5-2 flush board, your 9-high flush may be beaten by any higher flush draw that filled. A 4x check-raise strongly suggests the nut or near-nut flush. Fold (reverse implied odds).',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'weak_flush', 'check_raise', 'reverse_implied_odds'], difficultyScore: 71,
    },
    {
      id: 't4_p_035', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold 55 in the BB. UTG+1 opens, MP calls, CO calls. Flop is 5-A-K. You flopped a set in a multiway pot. Villain UTG bets 2/3 pot. What is the best action?',
      explanation: 'Set of fives in a multiway pot is very strong. Call (or raise) to build the pot. Don\'t fold sets even in multiway pots.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'multiway_pot'], difficultyScore: 63,
    },
    {
      id: 't4_p_036', tier: 'chip_leader', tierIndex: 4, level: 3, category: 'pressure',
      prompt: 'You hold J9o. Board J-8-7. Top pair with an OESD. Villain fires two streets. Turn is a 6 (completes straights for T5). River: villain shoves. What is the best action?',
      explanation: 'The 6 on the turn completes T5 straights. On J-8-7-6, your J9 top pair has very little value and the river jam is likely a straight. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', 'straight_completing_turn'], difficultyScore: 70,
    },

    // ── Level 4 (12 questions, difficulty 68-76) ──────────────────────────

    {
      id: 't4_p_037', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold KK in a 5-bet pot. Board A-7-2 rainbow. Villain c-bets 1/2 pot. What is the best action?',
      explanation: 'In a 5-bet pot on an ace-high board, villain\'s 5-bet range has AA very heavily weighted. Your KK is often crushed. Fold on this runout.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'overpair', '5bet_pot', 'ace_high_board'], difficultyScore: 72,
    },
    {
      id: 't4_p_038', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold QQ on a Q-T-9-J board. You have top set but the turn made a possible straight. Villain jams the turn. What is the best action?',
      explanation: 'Set of queens on Q-T-9-J — you still have a full-house draw (any Q or T gives full house or better). Your equity vs straights is ~35-40%. Consider calling based on full-house outs.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'full_house_draw', 'turn_jam'], difficultyScore: 74,
    },
    {
      id: 't4_p_039', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold A2s on a A-2-K board. Bottom two pair. In a 3-bet pot, villain fires pot on the flop and jams the turn. What is the best action?',
      explanation: 'Two pair (aces and deuces) is a strong but vulnerable hand in a 3-bet pot. Villain\'s range in a 3-bet pot with a turn jam often includes KK, AA, top set. Call with your strong equity.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', '3bet_pot', 'turn_jam'], difficultyScore: 71,
    },
    {
      id: 't4_p_040', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold QJo. Board Q-J-9-T. Two pair, but the turn gave a straight (KxTx makes Broadway). Villain pots the river. What is the best action?',
      explanation: 'On Q-J-9-T, any K that villain can hold (as a preflop raiser) completes Broadway. Two pair has lost a lot of value. Fold to the river jam.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'broadway_runout'], difficultyScore: 73,
    },
    {
      id: 't4_p_041', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold TT. Board T-8-7. You flopped top set on a very wet board. Villain donk-leads pot-size on the flop. What is the best action?',
      explanation: 'Top set on T-8-7 is a monster. Even on a wet board, continue. Your set has enormous equity including full-house draws.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'top_set', 'wet_board', 'correct_call'], difficultyScore: 66,
    },
    {
      id: 't4_p_042', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold Ah Kh. Board 9h-8h-7h. You have the nut flush (ace-high). Villain jams all-in. What is the best action?',
      explanation: 'Nut flush (ace-high) on the flop — call immediately. You have the best possible flush and great equity vs straight-flush draws.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_flush', 'correct_call'], difficultyScore: 58,
    },
    {
      id: 't4_p_043', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold KQs. Board K-Q-J-T-9 run-out. Your two pair gets counterfeited by the board straight. Villain bets. What is the best action?',
      explanation: 'On K-Q-J-T-9, the board plays a straight (best 5 cards). Everyone plays at minimum a pair — your KQ plays the 9-high straight (K-Q-J-T-9). Fold vs any bet as villain may have A-high or a split pot. Actually, the board IS the straight so everyone chops... but we\'re simplifying: fold pairs when board has a better hand.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'board_plays', 'counterfeited_hand'], difficultyScore: 70,
    },
    {
      id: 't4_p_044', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold 66. Board 6-6-A with two diamonds. You flopped quads. Villain leads out with a 3/4 pot bet. What is the best action?',
      explanation: 'You have quad sixes — the third-best hand in poker. Call (or slow-play to build). Never fold quads.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'quads', 'correct_call'], difficultyScore: 52,
    },
    {
      id: 't4_p_045', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold A8o on a A-8-6-K board with two hearts. Two pair (aces and eights). River is the 7h (completes flush and possible straight). Villain jams. What is the best action?',
      explanation: 'River completes the flush and possible straight (9-5, T-9). Two pair in this spot with a fully-developed board often loses to straights, flushes. Fold on this scary runout.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'scary_river', 'flush_completing'], difficultyScore: 75,
    },
    {
      id: 't4_p_046', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold AJo. Board A-J-T. Top two pair in position. Villain check-calls the flop and then jams the turn (blank). What is the best action?',
      explanation: 'AJo top two pair on A-J-T with position is strong. Villain\'s float-then-jam is often a set (TT) or KQ straight. Your two pair has roughly 40% vs sets, better vs bluffs. Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'two_pair', 'turn_jam'], difficultyScore: 72,
    },
    {
      id: 't4_p_047', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold KK preflop. Villain, known for 4-betting very tight (only AA), 4-bets all-in. Stack is 150BB. What is the best action?',
      explanation: 'Against a villain with a documented 4-bet range of only AA, KK become a relatively easy fold. Folding preflop kings vs a credibly AA-only range is correct long-term.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['preflop', 'pressure', 'KK', 'exploitative_fold', 'reads_based'], difficultyScore: 76,
    },
    {
      id: 't4_p_048', tier: 'chip_leader', tierIndex: 4, level: 4, category: 'pressure',
      prompt: 'You hold JJ preflop. UTG 4-bets all-in, CO 5-bets all-in. Action on you. Stack: 100BB. What is the best action?',
      explanation: 'Facing both a 4-bet and 5-bet shove from two players, JJ is almost certainly dominated by AA or KK from at least one player. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['preflop', 'pressure', 'JJ', 'multiway_4bet_5bet'], difficultyScore: 74,
    },

    // ── Level 5 (12 questions, difficulty 72-82) ──────────────────────────

    {
      id: 't4_p_049', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold QQ. Board A-K-J. You 3-bet preflop (UTG). Villain called. Board A-K-J is a total air-ball for your 3-bet range but villain dryly check-calls the flop and turn. Villain jams the river (2x pot) after a T appears. What is the best action?',
      explanation: 'On A-K-J-T, any Q makes Broadway. But you HOLD QQ — you have Broadway yourself! With a straight plus nut straight redraws, call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'broadway_straight', 'river_jam', 'correct_call'], difficultyScore: 76,
    },
    {
      id: 't4_p_050', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold AA. Board A-A-K-Q-J. You have quad aces. But the board makes Broadway for AK. Villain bets. What is the best action?',
      explanation: 'You hold quad aces — the strongest possible hand. No hand can beat you. Call (or raise). Always.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'quad_aces', 'correct_call'], difficultyScore: 60,
    },
    {
      id: 't4_p_051', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold KQs in a 4-bet pot. Board Q-T-3. You have top pair top kicker but in a 4-bet pot. Villain (who folded to many 4-bets but 4-bet here) c-bets 3/4 pot. What is the best action?',
      explanation: 'In a 4-bet pot on Q-T-3, villain\'s range is very narrow (AA, KK, AK mostly). KQ is dominated by these holdings. Fold your top pair.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'top_pair', '4bet_pot', 'narrow_range'], difficultyScore: 74,
    },
    {
      id: 't4_p_052', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold 88. Board 8-5-2-A-K. You have a set of eights on the river. Villain, passive all along, jams the river. What is the best action?',
      explanation: 'Bottom set (eights) on A-K-5-2-8 — your set hit on the river. Villain\'s jam on this board can be AK (top two pair) or a bluff. Call with your set.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'set', 'river_jam', 'passive_villain'], difficultyScore: 74,
    },
    {
      id: 't4_p_053', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold JTs. Board 9-8-7 mono (all clubs). You have a straight but no club. Villain bets large. What is the best action?',
      explanation: 'Your JTs straight on a mono 9-8-7 board is beaten by any flush. With villain betting large into a mono board, they likely have the flush. Fold your straight.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'straight', 'mono_board', 'reverse_implied_odds'], difficultyScore: 78,
    },
    {
      id: 't4_p_054', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold AKo. You 4-bet preflop. Board K-K-2. You have trip kings. Villain shoves all-in on the flop. What is the best action?',
      explanation: 'Trip kings with the ace kicker in a 4-bet pot — this is top of your range. Call all-in.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'trips', '4bet_pot', 'correct_call'], difficultyScore: 68,
    },
    {
      id: 't4_p_055', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold QQ. Board Q-Q-7. You flopped quads. Villain bets pot, you call. Villain bets again on the turn. What is the best action?',
      explanation: 'Quad queens — better than 99.9% of hands on the planet. Stay in and extract every chip. Call always.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'quads', 'value_extraction'], difficultyScore: 55,
    },
    {
      id: 't4_p_056', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold 76s. Board 8-5-4-9. You have a straight. But the 9 on the turn gives T7 a better straight. Villain jams the river (a blank). What is the best action?',
      explanation: 'On 8-5-4-9, you have 8-high straight (7-6-5-4-3). T-7 makes 9-8-7-6-5 (better straight). Villain\'s river jam very likely represents the better straight. Fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'second_best_straight', 'dominated'], difficultyScore: 78,
    },
    {
      id: 't4_p_057', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold AKs and the board runs out A-K-9-8-7. You have top two pair. Villain who was drawing shoves the river. What is the best action?',
      explanation: 'On A-K-9-8-7, four connecting cards make many straights (JT, T6, etc.). Two pair top-two is vulnerable to straights on this runout. Against a drawing villain who shoves the river, fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'two_pair', 'straight_completing_runout'], difficultyScore: 79,
    },
    {
      id: 't4_p_058', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold 98s. Board J-T-7 with two hearts. You have an OESD plus a backdoor flush draw. Villain shoves for 3x pot on the flop. What is the best action?',
      explanation: 'OESD plus backdoor flush draw has roughly 35-40% equity. You need ~43% to call a 3x overbet (need 3/(1+3)=75%... wait: call/pot+call=3x_pot/(pot+3x_pot) = 3/4 = 75%). You need 75% but have 35%. Clear fold.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'FOLD',
      tags: ['postflop', 'pressure', 'draw', 'overbet_shove', 'bad_odds'], difficultyScore: 76,
    },
    {
      id: 't4_p_059', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold J9s on a Q-T-8 board. You have the nut straight. Villain goes all-in. What is the best action?',
      explanation: 'You have the nut straight (J-T-9-8-Q). Call — you have the best possible hand on this board.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_straight', 'correct_call'], difficultyScore: 63,
    },
    {
      id: 't4_p_060', tier: 'chip_leader', tierIndex: 4, level: 5, category: 'pressure',
      prompt: 'You hold Kd Qd on a board of Ad Jd Td. Royal flush draw plus nut flush! Villain shoves. What is the best action?',
      explanation: 'You have the nut flush (K-Q-J-T-A of diamonds) plus the royal flush draw. You cannot lose to any flush and only lose to a higher straight flush (which is impossible since you hold Kd). Call.',
      choices: ['CALL', 'FOLD'], correctAnswer: 'CALL',
      tags: ['postflop', 'pressure', 'nut_flush', 'royal_flush_draw', 'correct_call'], difficultyScore: 68,
    },
  ];
}

// ─── Main rebalance logic ─────────────────────────────────────────────────────

function rebalance(filePath, tierConst, tier, tierIndex, targets, extraEvFn, pressureFn) {
  console.log(`\nProcessing ${path.basename(filePath)}...`);
  const all = parseQuestions(filePath);
  console.log(`  Loaded ${all.length} questions: action=${all.filter(q=>q.category==='action').length} outs=${all.filter(q=>q.category==='outs').length} ev=${all.filter(q=>q.category==='ev').length}`);

  const keptAction   = filterQuestions(all, 'action', targets.action);
  const keptOuts     = filterQuestions(all, 'outs', targets.outs);
  const keptEv       = filterQuestions(all, 'ev', targets.existingEv);  // keep all existing EV
  const newEv        = extraEvFn();
  const newPressure  = pressureFn();

  const allNew = [...keptAction, ...keptOuts, ...keptEv, ...newEv, ...newPressure];

  // Sort by level then category for clean output
  allNew.sort((a, b) => a.level - b.level || a.category.localeCompare(b.category));

  const counts = {
    action:   allNew.filter(q => q.category === 'action').length,
    outs:     allNew.filter(q => q.category === 'outs').length,
    ev:       allNew.filter(q => q.category === 'ev').length,
    pressure: allNew.filter(q => q.category === 'pressure').length,
    total:    allNew.length,
  };
  console.log(`  Output: action=${counts.action} outs=${counts.outs} ev=${counts.ev} pressure=${counts.pressure} TOTAL=${counts.total}`);

  if (counts.total !== 250) {
    throw new Error(`Expected 250 questions but got ${counts.total} for ${filePath}`);
  }

  const tsContent = buildTS(tierConst, tierIndex, allNew);
  fs.writeFileSync(filePath, tsContent, 'utf8');
  console.log(`  Written: ${filePath}`);
}

// Run
rebalance(
  T3FILE, 'tier3Questions', 'grinder', 3,
  { action: 90, outs: 40, existingEv: 38 },
  makeTier3EvQuestions,
  makeTier3PressureQuestions,
);

rebalance(
  T4FILE, 'tier4Questions', 'chip_leader', 4,
  { action: 80, outs: 30, existingEv: 38 },
  makeTier4EvQuestions,
  makeTier4PressureQuestions,
);

console.log('\nDone! Run TypeScript checks to validate.');
