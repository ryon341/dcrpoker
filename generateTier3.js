
const fs = require('fs');
const path = require('path');

const TOTAL_QUESTIONS = 250;
const CARRYOVER_PERCENT = 0.20;
const CARRYOVER_COUNT = Math.floor(TOTAL_QUESTIONS * CARRYOVER_PERCENT); // 50
const NEW_COUNT = TOTAL_QUESTIONS - CARRYOVER_COUNT; // 200

const tier = 'grinder';
const tierIndex = 3;

const positions = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const stacks = [20, 25, 30, 40, 50, 60, 75, 100];

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
  return clampLevel(Math.ceil((idx / total) * 5));
}

function chooseCarryoverQuestions(tier2Questions) {
  if (!Array.isArray(tier2Questions)) {
    throw new Error('tier2Questions.json is not a valid array.');
  }

  const actionQs = tier2Questions.filter(q => q.category === 'action');
  const outsQs = tier2Questions.filter(q => q.category === 'outs');
  const evQs = tier2Questions.filter(q => q.category === 'ev');

  const selected = [
    ...shuffle(actionQs).slice(0, 30),
    ...shuffle(outsQs).slice(0, 12),
    ...shuffle(evQs).slice(0, 8),
  ];

  return shuffle(selected).map((q, idx) => {
    const copied = JSON.parse(JSON.stringify(q));
    return {
      ...copied,
      id: `t3_carry_${String(idx + 1).padStart(3, '0')}`,
      tier,
      tierIndex,
      tags: Array.from(new Set([...(copied.tags || []), 'carryover', 'from_tier_2'])),
      difficultyScore: Math.min(100, Number(copied.difficultyScore || 20) + 6),
    };
  });
}

function makeActionQuestion(index, level) {
  const pos = random(positions);
  const stack = random(stacks);
  const scenarios = [
    'folds_to_you',
    'facing_open_raise',
    'facing_3bet',
    'blind_vs_blind',
    'squeeze_spot',
  ];

  const openHandsByLevel = {
    1: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo'],
    2: ['99', '88', 'AJs', 'ATs', 'KQs', 'AQo', 'KJs'],
    3: ['77', '66', 'AJo', 'KQo', 'QJs', 'JTs', 'A9s', 'KTs'],
    4: ['55', '44', 'A8s', 'A5s', 'T9s', '98s', 'KJo', 'QJo'],
    5: ['33', '22', 'A4s', 'A3s', '87s', '76s', 'KTo', 'QTo'],
  };

  const defendHandsByLevel = {
    1: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo'],
    2: ['99', '88', 'AQs', 'AJs', 'KQs', 'AQo'],
    3: ['77', '66', 'ATs', 'KJs', 'QJs', 'AJo', 'KQo'],
    4: ['55', '44', 'A9s', 'KTs', 'JTs', 'T9s'],
    5: ['33', '22', 'A8s', '98s', '87s', '76s'],
  };

  const scenario = random(scenarios);

  let hand;
  let prompt;
  let correctAction;
  let explanation;
  let tags = ['preflop', pos, scenario];

  if (scenario === 'folds_to_you') {
    hand = random(openHandsByLevel[level]);

    if (
      level >= 4 &&
      ['UTG', 'MP'].includes(pos) &&
      ['KTo', 'QTo', '33', '22'].includes(hand)
    ) {
      correctAction = 'FOLD';
      explanation = `${hand} is too weak to open from ${pos} in this Grinder-tier spot.`;
    } else {
      correctAction = 'RAISE';
      explanation = `${hand} is a profitable open from ${pos} at ${stack}BB effective.`;
    }

    prompt = `You are in ${pos} with ${hand}. Effective stack is ${stack}BB. Action folds to you. What is the best action?`;
    tags.push(hand, 'open_spot');
  } else if (scenario === 'facing_open_raise') {
    hand = random(defendHandsByLevel[level]);
    const raiserPos = random(['UTG', 'MP', 'HJ', 'CO']);

    if (['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'].includes(hand)) {
      correctAction = 'RAISE';
      explanation = `${hand} is strong enough to reraise for value against an open.`;
    } else if (
      ['TT', '99', '88', 'AQs', 'AJs', 'KQs', 'AQo', 'AJo', 'KQo'].includes(hand) &&
      ['CO', 'BTN', 'SB', 'BB'].includes(pos)
    ) {
      correctAction = 'CALL';
      explanation = `${hand} is strong enough to continue, and flatting is reasonable in position or closing action.`;
    } else {
      correctAction = 'FOLD';
      explanation = `${hand} is not strong enough often enough versus an open from ${raiserPos}.`;
    }

    prompt = `${raiserPos} opens to 2.5BB. You are in ${pos} with ${hand}. Effective stack is ${stack}BB. What is the best action?`;
    tags.push(hand, 'facing_open');
  } else if (scenario === 'facing_3bet') {
    hand = random(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AKo', 'AJs', 'KQs']);
    const heroOpenPos = random(['HJ', 'CO', 'BTN']);
    const villainPos = random(['BTN', 'SB', 'BB']);

    if (['AA', 'KK', 'QQ', 'AKs', 'AKo'].includes(hand)) {
      correctAction = 'RAISE';
      explanation = `${hand} is strong enough to continue aggressively against a 3-bet.`;
    } else if (['JJ', 'TT', '99', 'AQs', 'AJs', 'KQs'].includes(hand)) {
      correctAction = 'CALL';
      explanation = `${hand} is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.`;
    } else {
      correctAction = 'FOLD';
      explanation = `${hand} becomes too weak facing a 3-bet and should be released in this simplified training spot.`;
    }

    prompt = `You open from ${heroOpenPos}. ${villainPos} 3-bets. You hold ${hand} with ${stack}BB effective. What is the best action?`;
    tags.push(hand, 'facing_3bet');
  } else if (scenario === 'blind_vs_blind') {
    const heroPos = random(['SB', 'BB']);
    hand = random(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AJs', 'ATs', 'KQs', 'AJo', 'KQo', 'T9s', '98s', '87s']);

    if (heroPos === 'SB') {
      if (['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AJs', 'ATs', 'KQs', 'AJo'].includes(hand)) {
        correctAction = 'RAISE';
        explanation = `${hand} is strong enough to apply pressure from the small blind.`;
      } else if (['88', 'KQo', 'T9s', '98s'].includes(hand)) {
        correctAction = 'CALL';
        explanation = `${hand} is playable in this simplified blind-versus-blind structure.`;
      } else {
        correctAction = 'FOLD';
        explanation = `${hand} is too weak to continue from the small blind here.`;
      }

      prompt = `Action folds to you in the small blind. You hold ${hand} with ${stack}BB effective. What is the best action?`;
    } else {
      if (['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AJs', 'ATs', 'KQs', 'AJo', 'KQo'].includes(hand)) {
        correctAction = 'RAISE';
        explanation = `${hand} is strong enough to attack or continue aggressively in a blind battle.`;
      } else if (['T9s', '98s', '87s'].includes(hand)) {
        correctAction = 'CALL';
        explanation = `${hand} plays adequately in a blind-versus-blind spot in this simplified model.`;
      } else {
        correctAction = 'FOLD';
        explanation = `${hand} is too marginal here.`;
      }

      prompt = `In a simplified blind-versus-blind spot, you are in the big blind with ${hand} and ${stack}BB effective. What is the best action?`;
    }

    tags.push(hand, 'blind_vs_blind');
  } else {
    hand = random(['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'KQs', 'QJs', 'JTs', 'T9s']);
    const raiserPos = random(['UTG', 'MP', 'HJ']);
    const callerPos = random(['HJ', 'CO', 'BTN']);

    if (['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs'].includes(hand)) {
      correctAction = 'RAISE';
      explanation = `${hand} is strong enough to squeeze for value after a raise and a call.`;
    } else if (['TT', '99', '88', 'AJs', 'KQs', 'QJs'].includes(hand)) {
      correctAction = 'CALL';
      explanation = `${hand} can continue profitably, but a call is the simpler recommended option here.`;
    } else {
      correctAction = 'FOLD';
      explanation = `${hand} is too marginal for this squeeze configuration in a simplified model.`;
    }

    prompt = `${raiserPos} opens, ${callerPos} calls, and action is on you in ${pos} holding ${hand} with ${stack}BB effective. What is the best action?`;
    tags.push(hand, 'squeeze_spot');
  }

  return {
    id: `t3_new_${String(index).padStart(3, '0')}`,
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
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 6),
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
      { label: 'flush draw plus one overcard', outs: 12 },
      { label: 'open-ended straight draw plus one overcard', outs: 11 },
      { label: 'pair plus gutshot', outs: 7 },
    ],
    3: [
      { label: 'flush draw plus gutshot', outs: 12 },
      { label: 'pair plus flush draw', outs: 14 },
      { label: 'open-ended straight draw plus overcard', outs: 11 },
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
    7: ['5', '8', '9', '10'],
    8: ['4', '6', '9', '12'],
    9: ['8', '10', '12', '15'],
    10: ['8', '9', '11', '12'],
    11: ['8', '9', '12', '15'],
    12: ['8', '9', '11', '15'],
    14: ['12', '15', '11', '10'],
    15: ['12', '14', '11', '9'],
  };

  const wrongChoices = shuffle(wrongChoicesMap[scenario.outs] || ['4', '8', '9', '12']).slice(0, 3);
  const choices = shuffle([String(scenario.outs), ...wrongChoices]);

  return {
    id: `t3_new_${String(index).padStart(3, '0')}`,
    tier,
    tierIndex,
    level,
    category: 'outs',
    prompt: `You hold a ${scenario.label}. How many outs do you have?`,
    explanation: `In this simplified training model, that draw gives you ${scenario.outs} outs.`,
    choices,
    correctAnswer: String(scenario.outs),
    tags: ['outs', 'draw_math', scenario.label.replace(/\s+/g, '_')],
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 4),
  };
}

function makeEvQuestion(index, level) {
  const scenariosByLevel = {
    1: [
      { pot: 50, call: 15, equity: 28 },
      { pot: 60, call: 20, equity: 32 },
      { pot: 70, call: 25, equity: 24 },
    ],
    2: [
      { pot: 80, call: 25, equity: 29 },
      { pot: 90, call: 30, equity: 27 },
      { pot: 100, call: 35, equity: 31 },
    ],
    3: [
      { pot: 110, call: 35, equity: 24 },
      { pot: 120, call: 40, equity: 29 },
      { pot: 130, call: 45, equity: 33 },
    ],
    4: [
      { pot: 140, call: 45, equity: 26 },
      { pot: 150, call: 50, equity: 30 },
      { pot: 170, call: 55, equity: 22 },
    ],
    5: [
      { pot: 180, call: 60, equity: 28 },
      { pot: 200, call: 70, equity: 31 },
      { pot: 220, call: 75, equity: 24 },
    ],
  };

  const s = random(scenariosByLevel[level]);
  const required = (s.call / (s.pot + s.call)) * 100;
  const correct = s.equity >= required ? 'CALL' : 'FOLD';

  return {
    id: `t3_new_${String(index).padStart(3, '0')}`,
    tier,
    tierIndex,
    level,
    category: 'ev',
    prompt: `The pot is ${s.pot}. Your opponent bets ${s.call}. You estimate your equity at ${s.equity}%. What is the best action?`,
    explanation: `You need ${required.toFixed(1)}% equity to call. Since your equity is ${s.equity}%, the correct simplified choice is ${correct}.`,
    choices: ['CALL', 'FOLD'],
    correctAnswer: correct,
    tags: ['ev', 'pot_odds'],
    difficultyScore: difficultyForLevel(level, Math.floor(Math.random() * 10) + 5),
  };
}

function generateNewTier3Questions() {
  const generated = [];

  for (let i = 1; i <= NEW_COUNT; i++) {
    const level = levelFromIndex(i, NEW_COUNT);

    let q;
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
      difficultyScore: Math.max(Number(q.difficultyScore || 20), difficultyForLevel(level, 2)),
    };
  });
}

function main() {
  const tier2Path = path.join(process.cwd(), 'tier2Questions.json');

  if (!fs.existsSync(tier2Path)) {
    throw new Error(`Missing tier2Questions.json in ${process.cwd()}. Put Tier 2 output in the same folder first.`);
  }

  const tier2Questions = JSON.parse(fs.readFileSync(tier2Path, 'utf8'));
  const carryover = chooseCarryoverQuestions(tier2Questions);
  const fresh = generateNewTier3Questions();
  const finalQuestions = interleaveQuestions(carryover, fresh);

  if (finalQuestions.length !== TOTAL_QUESTIONS) {
    throw new Error(`Expected ${TOTAL_QUESTIONS} questions, got ${finalQuestions.length}`);
  }

  const jsonPath = path.join(process.cwd(), 'tier3Questions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(finalQuestions, null, 2), 'utf8');

  const tsPath = path.join(process.cwd(), 'tier3Questions.ts');
  const tsContent = `export const tier3Questions = ${JSON.stringify(finalQuestions, null, 2)} as const;\n`;
  fs.writeFileSync(tsPath, tsContent, 'utf8');

  console.log(`✅ Generated ${finalQuestions.length} Tier 3 questions`);
  console.log(`📄 JSON: ${jsonPath}`);
  console.log(`📄 TS:   ${tsPath}`);
  console.log(`🔁 Carryover from Tier 2: ${CARRYOVER_COUNT}`);
  console.log(`🆕 New Tier 3 questions: ${NEW_COUNT}`);
}

main();