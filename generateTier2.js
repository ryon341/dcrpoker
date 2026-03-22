const fs = require('fs');
const path = require('path');

const TOTAL_QUESTIONS = 250;
const CARRYOVER_PERCENT = 0.20;
const CARRYOVER_COUNT = Math.floor(TOTAL_QUESTIONS * CARRYOVER_PERCENT); // 50
const NEW_COUNT = TOTAL_QUESTIONS - CARRYOVER_COUNT; // 200

const tier = 'apprentice';
const tierIndex = 2;

const positions = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const stacks = [20, 25, 30, 40, 50, 60, 75, 100];

const actionChoices = ['FOLD', 'CALL', 'RAISE'];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clampLevel(n) {
  if (n < 1) return 1;
  if (n > 5) return 5;
  return n;
}

function difficultyForLevel(level, offset = 0) {
  return Math.min(100, level * 20 + offset);
}

function levelFromIndex(idx, total) {
  // spreads 1..5 across the generated block
  return clampLevel(Math.ceil((idx / total) * 5));
}

function chooseCarryoverQuestions(tier1Questions) {
  if (!Array.isArray(tier1Questions)) {
    throw new Error('tier1Questions.json is not a valid array.');
  }

  const actionQs = tier1Questions.filter(q => q.category === 'action');
  const outsQs = tier1Questions.filter(q => q.category === 'outs');
  const evQs = tier1Questions.filter(q => q.category === 'ev');

  // balanced carryover mix: 30 action, 12 outs, 8 ev = 50
  const selected = [
    ...shuffle(actionQs).slice(0, 30),
    ...shuffle(outsQs).slice(0, 12),
    ...shuffle(evQs).slice(0, 8),
  ];

  return shuffle(selected).map((q, idx) => {
    const copied = JSON.parse(JSON.stringify(q));
    return {
      ...copied,
      id: `t2_carry_${String(idx + 1).padStart(3, '0')}`,
      tier,
      tierIndex,
      tags: Array.from(new Set([...(copied.tags || []), 'carryover', 'from_tier_1'])),
      difficultyScore: Math.min(
        100,
        Number(copied.difficultyScore || 20) + 5
      ),
    };
  });
}

function makeActionQuestion(index, level) {
  const pos = random(positions);
  const stack = random(stacks);

  const openHandsByLevel = {
    1: ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs', 'AKo'],
    2: ['TT', '99', 'AJs', 'KQs', 'AQo', 'ATs', 'KJs'],
    3: ['88', '77', 'AJo', 'KQo', 'QJs', 'JTs', 'A9s', 'KTs'],
    4: ['66', '55', 'ATo', 'KJo', 'QJo', 'T9s', '98s', 'A8s'],
    5: ['44', '33', '22', 'A5s', 'A4s', 'KTo', 'QTo', '87s'],
  };

  const facingRaiseHandsByLevel = {
    1: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    2: ['JJ', 'TT', 'AQs', 'AJs', 'KQs'],
    3: ['99', '88', 'AQo', 'ATs', 'QJs'],
    4: ['77', '66', 'AJo', 'KQo', 'JTs'],
    5: ['55', '44', 'A9s', 'KJs', 'T9s'],
  };

  const scenarios = [
    'folds_to_you',
    'facing_min_raise',
    'facing_open_raise',
    'small_blind_vs_big_blind',
  ];

  const scenario = random(scenarios);

  let hand;
  let prompt;
  let correctAction;
  let explanation;
  let tags = ['preflop', pos, scenario];

  if (scenario === 'folds_to_you') {
    hand = random(openHandsByLevel[level]);

    // mostly raise, but some weaker level-5 hands from early position can fold
    if (
      level >= 4 &&
      ['UTG', 'MP'].includes(pos) &&
      ['KTo', 'QTo', '44', '33', '22'].includes(hand)
    ) {
      correctAction = 'FOLD';
      explanation = `${hand} is too weak to profitably open from ${pos} at this difficulty level.`;
    } else {
      correctAction = 'RAISE';
      explanation = `${hand} is strong enough to open from ${pos}, especially at ${stack}BB effective.`;
    }

    prompt = `You are in ${pos} with ${hand}. Effective stack is ${stack}BB. Action folds to you. What is the best action?`;
    tags.push(hand, 'open_spot');
  } else if (scenario === 'facing_min_raise') {
    hand = random(facingRaiseHandsByLevel[level]);
    const raiserPos = random(['UTG', 'MP', 'HJ', 'CO', 'BTN']);

    if (['AA', 'KK', 'QQ', 'AKs'].includes(hand)) {
      correctAction = 'RAISE';
      explanation = `${hand} is strong enough to reraise for value versus a minimum open.`;
    } else if (['JJ', 'TT', '99', 'AQs', 'AJs', 'KQs', 'AQo'].includes(hand)) {
      correctAction = 'CALL';
      explanation = `${hand} plays well against a minimum raise and is often a profitable continue as a call.`;
    } else {
      correctAction = 'FOLD';
      explanation = `${hand} is too marginal in this spot and should usually be folded.`;
    }

    prompt = `${raiserPos} makes a minimum raise. You are in ${pos} with ${hand}. Effective stack is ${stack}BB. What is the best action?`;
    tags.push(hand, 'facing_raise');
  } else if (scenario === 'facing_open_raise') {
    hand = random(facingRaiseHandsByLevel[level]);
    const raiserPos = random(['UTG', 'MP', 'HJ', 'CO']);

    if (['AA', 'KK', 'QQ', 'AKs', 'AKo'].includes(hand)) {
      correctAction = 'RAISE';
      explanation = `${hand} is premium and should usually reraise for value against an open.`;
    } else if (['JJ', 'TT', 'AQs', 'KQs'].includes(hand) && ['CO', 'BTN', 'SB', 'BB'].includes(pos)) {
      correctAction = 'CALL';
      explanation = `${hand} is strong enough to continue, but flatting keeps dominated hands in and controls variance.`;
    } else {
      correctAction = 'FOLD';
      explanation = `${hand} is not strong enough often enough versus an open from ${raiserPos}.`;
    }

    prompt = `${raiserPos} opens to 3BB. You are in ${pos} with ${hand}. Effective stack is ${stack}BB. What is the best action?`;
    tags.push(hand, 'facing_open');
  } else {
    hand = random(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AJs', 'AQs', 'AKs', 'KQs', 'AJo', 'KQo', 'T9s', '98s']);
    const heroPos = random(['SB', 'BB']);

    if (heroPos === 'SB') {
      if (['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo'].includes(hand)) {
        correctAction = 'RAISE';
        explanation = `${hand} is strong enough to apply pressure from the small blind.`;
      } else if (['99', 'AJs', 'KQs', 'AJo', 'KQo'].includes(hand)) {
        correctAction = 'CALL';
        explanation = `${hand} is playable blind-versus-blind but not always a mandatory raise in a simplified model.`;
      } else {
        correctAction = 'FOLD';
        explanation = `${hand} is too weak to continue profitably from the small blind in this simplified spot.`;
      }

      prompt = `Action folds to you in the small blind. You hold ${hand} with ${stack}BB effective. What is the best action?`;
      tags.push(hand, 'blind_vs_blind');
    } else {
      if (['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo', 'AJs', 'KQs'].includes(hand)) {
        correctAction = 'RAISE';
        explanation = `${hand} is strong enough to attack from the big blind when action is checked to a simplified decision point.`;
      } else if (['99', 'AJo', 'KQo', 'T9s', '98s'].includes(hand)) {
        correctAction = 'CALL';
        explanation = `${hand} can continue in a lower-pressure blind situation.`;
      } else {
        correctAction = 'FOLD';
        explanation = `${hand} is too marginal here.`;
      }

      prompt = `In a simplified blind-versus-blind spot, you are in the big blind with ${hand} and ${stack}BB effective. What is the best action?`;
      tags.push(hand, 'blind_vs_blind');
    }
  }

  return {
    id: `t2_new_${String(index).padStart(3, '0')}`,
    tier,
    tierIndex,
    level,
    category: 'action',
    prompt,
    explanation,
    correctAction,
    heroPosition: pos,
    effectiveStackBb: stack,
    tags: Array.from(new Set(tags)),
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 4),
  };
}

function makeOutsQuestion(index, level) {
  const drawTypesByLevel = {
    1: [
      { label: 'flush draw on the flop', outs: 9 },
      { label: 'open-ended straight draw on the flop', outs: 8 },
      { label: 'gutshot straight draw on the flop', outs: 4 },
    ],
    2: [
      { label: 'flush draw with one overcard', outs: 12 },
      { label: 'open-ended straight draw with one overcard', outs: 11 },
      { label: 'pair plus two overcards', outs: 5 },
    ],
    3: [
      { label: 'combo draw: flush draw plus gutshot', outs: 12 },
      { label: 'open-ended straight draw plus overcard', outs: 11 },
      { label: 'pair plus flush draw', outs: 14 },
    ],
    4: [
      { label: 'flush draw plus two overcards', outs: 15 },
      { label: 'open-ended straight flush draw', outs: 15 },
      { label: 'pair plus open-ended straight draw', outs: 10 },
    ],
    5: [
      { label: 'monster combo draw: flush draw plus open-ended straight draw', outs: 15 },
      { label: 'flush draw plus gutshot plus overcard', outs: 15 },
      { label: 'pair plus flush draw plus overcard', outs: 14 },
    ],
  };

  const scenario = random(drawTypesByLevel[level]);

  const wrongChoicesMap = {
    4: ['3', '5', '6', '8'],
    5: ['4', '6', '8', '9'],
    8: ['4', '6', '9', '12'],
    9: ['8', '10', '12', '15'],
    10: ['8', '9', '11', '12'],
    11: ['8', '9', '12', '15'],
    12: ['8', '9', '11', '15'],
    14: ['12', '15', '11', '10'],
    15: ['12', '14', '11', '9'],
  };

  const wrongChoices = shuffle(wrongChoicesMap[scenario.outs] || ['4', '8', '9', '12'])
    .slice(0, 3);

  const choices = shuffle([
    String(scenario.outs),
    ...wrongChoices,
  ]);

  return {
    id: `t2_new_${String(index).padStart(3, '0')}`,
    tier,
    tierIndex,
    level,
    category: 'outs',
    prompt: `You hold a ${scenario.label}. How many outs do you have?`,
    explanation: `This draw type gives you ${scenario.outs} outs in this simplified training model.`,
    choices,
    correctAnswer: String(scenario.outs),
    tags: ['outs', 'draw_math', scenario.label.replace(/\s+/g, '_')],
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 2),
  };
}

function makeEvQuestion(index, level) {
  const scenariosByLevel = {
    1: [
      { pot: 40, call: 10, equity: 25 },
      { pot: 50, call: 15, equity: 30 },
      { pot: 60, call: 20, equity: 28 },
    ],
    2: [
      { pot: 50, call: 20, equity: 35 },
      { pot: 70, call: 20, equity: 24 },
      { pot: 80, call: 25, equity: 32 },
    ],
    3: [
      { pot: 90, call: 30, equity: 27 },
      { pot: 100, call: 25, equity: 22 },
      { pot: 120, call: 40, equity: 31 },
    ],
    4: [
      { pot: 110, call: 35, equity: 29 },
      { pot: 140, call: 50, equity: 33 },
      { pot: 150, call: 45, equity: 21 },
    ],
    5: [
      { pot: 160, call: 50, equity: 26 },
      { pot: 180, call: 60, equity: 30 },
      { pot: 200, call: 70, equity: 24 },
    ],
  };

  const s = random(scenariosByLevel[level]);
  const required = (s.call / (s.pot + s.call)) * 100;
  const correct = s.equity >= required ? 'CALL' : 'FOLD';

  return {
    id: `t2_new_${String(index).padStart(3, '0')}`,
    tier,
    tierIndex,
    level,
    category: 'ev',
    prompt: `The pot is ${s.pot}. Your opponent bets ${s.call}. You estimate your equity at ${s.equity}%. What is the best action?`,
    explanation: `You need ${required.toFixed(1)}% equity to call. Since your equity is ${s.equity}%, the better simplified decision is ${correct}.`,
    choices: ['CALL', 'FOLD'],
    correctAnswer: correct,
    tags: ['ev', 'pot_odds'],
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 3),
  };
}

function generateNewTier2Questions() {
  const generated = [];

  for (let i = 1; i <= NEW_COUNT; i++) {
    const level = levelFromIndex(i, NEW_COUNT);

    let q;
    // 60% action, 25% outs, 15% ev
    if (i <= 120) {
      q = makeActionQuestion(i, level);
    } else if (i <= 170) {
      q = makeOutsQuestion(i, level);
    } else {
      q = makeEvQuestion(i, level);
    }

    generated.push(q);
  }

  return generated;
}

function interleaveQuestions(carryover, fresh) {
  const result = [];
  const carry = [...carryover];
  const newer = [...fresh];

  // roughly one carryover every 4-5 questions
  while (carry.length || newer.length) {
    if (newer.length) result.push(newer.shift());
    if (newer.length) result.push(newer.shift());
    if (newer.length) result.push(newer.shift());
    if (newer.length) result.push(newer.shift());
    if (carry.length) result.push(carry.shift());
  }

  return result.slice(0, TOTAL_QUESTIONS).map((q, idx) => {
    const level = clampLevel(Math.ceil(((idx + 1) / TOTAL_QUESTIONS) * 5));
    return {
      ...q,
      level,
      difficultyScore: Math.max(
        Number(q.difficultyScore || 20),
        difficultyForLevel(level, 1)
      ),
    };
  });
}

function main() {
  const tier1Path = path.join(process.cwd(), 'tier1Questions.json');

  if (!fs.existsSync(tier1Path)) {
    throw new Error(
      `Missing tier1Questions.json in ${process.cwd()}. Put Tier 1 output in the same folder first.`
    );
  }

  const tier1Questions = JSON.parse(fs.readFileSync(tier1Path, 'utf8'));
  const carryover = chooseCarryoverQuestions(tier1Questions);
  const fresh = generateNewTier2Questions();
  const finalQuestions = interleaveQuestions(carryover, fresh);

  if (finalQuestions.length !== TOTAL_QUESTIONS) {
    throw new Error(`Expected ${TOTAL_QUESTIONS} questions, got ${finalQuestions.length}`);
  }

  const jsonPath = path.join(process.cwd(), 'tier2Questions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(finalQuestions, null, 2), 'utf8');

  const tsPath = path.join(process.cwd(), 'tier2Questions.ts');
  const tsContent = `export const tier2Questions = ${JSON.stringify(finalQuestions, null, 2)} as const;\n`;
  fs.writeFileSync(tsPath, tsContent, 'utf8');

  console.log(`✅ Generated ${finalQuestions.length} Tier 2 questions`);
  console.log(`📄 JSON: ${jsonPath}`);
  console.log(`📄 TS:   ${tsPath}`);
  console.log(`🔁 Carryover from Tier 1: ${CARRYOVER_COUNT}`);
  console.log(`🆕 New Tier 2 questions: ${NEW_COUNT}`);
}

main();