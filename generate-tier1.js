const fs = require('fs');

const tier = 'beginner';
const tierIndex = 1;

const positions = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
const stacks = [20, 30, 40, 50, 75, 100];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeActionQuestion(i, level) {
  const pos = random(positions);
  const stack = random(stacks);

  const strongHands = ['AA', 'KK', 'QQ', 'AK'];
  const mediumHands = ['AJ', 'KQ', 'AT', '77'];
  const weakHands = ['J9', 'T8', 'A5', 'K9'];

  let handPool = level <= 2 ? strongHands : level <= 4 ? mediumHands : weakHands;
  const hand = random(handPool);

  let correctAction = 'RAISE';
  if (level >= 4 && weakHands.includes(hand)) correctAction = 'FOLD';
  if (level === 3 && mediumHands.includes(hand)) correctAction = 'CALL';

  return {
    id: `t1_q${i}`,
    tier,
    tierIndex,
    level,
    category: 'action',
    prompt: `You are in ${pos} with ${hand}. Effective stack is ${stack}BB. Action folds to you.`,
    explanation: `At this stack depth and position, ${hand} is ${
      correctAction === 'RAISE'
        ? 'strong enough to open for value'
        : correctAction === 'CALL'
        ? 'playable but not strong enough to raise aggressively'
        : 'too weak to continue from this position'
    }.`,
    correctAction,
    heroPosition: pos,
    effectiveStackBb: stack,
    tags: ['preflop', pos, hand],
    difficultyScore: level * 20 + Math.floor(Math.random() * 10)
  };
}

function makeOutsQuestion(i, level) {
  const outs = [4, 8, 9, 12, 15];
  const o = random(outs);

  return {
    id: `t1_q${i}`,
    tier,
    tierIndex,
    level,
    category: 'outs',
    prompt: `You have a draw with ${o} outs on the flop. How many outs do you have?`,
    explanation: `${o} outs means ${o} cards improve your hand.`,
    choices: ['4', '8', '9', '12', '15'],
    correctAnswer: String(o),
    tags: ['outs'],
    difficultyScore: level * 20 + Math.floor(Math.random() * 10)
  };
}

function makeEvQuestion(i, level) {
  const pot = 50;
  const call = random([10, 15, 20]);
  const equity = random([20, 25, 30, 35]);

  const correct = equity > (call / (pot + call)) * 100 ? 'CALL' : 'FOLD';

  return {
    id: `t1_q${i}`,
    tier,
    tierIndex,
    level,
    category: 'ev',
    prompt: `Pot is ${pot}. Opponent bets ${call}. You have ${equity}% equity. What is correct?`,
    explanation: `You need ${(call / (pot + call) * 100).toFixed(1)}% equity. You have ${equity}%.`,
    choices: ['CALL', 'FOLD'],
    correctAnswer: correct,
    tags: ['ev'],
    difficultyScore: level * 20 + Math.floor(Math.random() * 10)
  };
}

const questions = [];

for (let i = 1; i <= 250; i++) {
  let level = Math.ceil((i / 250) * 5);

  let q;
  if (i % 10 < 6) {
    q = makeActionQuestion(i, level);
  } else if (i % 10 < 9) {
    q = makeOutsQuestion(i, level);
  } else {
    q = makeEvQuestion(i, level);
  }

  questions.push(q);
}

fs.writeFileSync(
  './tier1Questions.json',
  JSON.stringify(questions, null, 2)
);

console.log('✅ Tier 1 question bank generated: tier1Questions.json');