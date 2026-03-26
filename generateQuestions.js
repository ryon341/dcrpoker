#!/usr/bin/env node
// generateQuestions.js — TC090.5 Poker Challenge Question Bank Generator
// Self-contained Node.js CJS runner. Produces TypeScript question bank files.
// Usage: node generateQuestions.js [--seed DCR-001] [--tiers Beginner,Apprentice,Grinder]
'use strict';

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// SEEDED PRNG — Mulberry32
// ═══════════════════════════════════════════════════════════════════════════════
function mulberry32(seed) {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6D2B79F5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function makeRng(seedStr) { return mulberry32(seedFromString(seedStr)); }

function pick(arr, rng)  { return arr[Math.floor(rng() * arr.length)]; }
function rngInt(min, max, rng) { return min + Math.floor(rng() * (max - min + 1)); }

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const TIER_TARGETS = {
  Beginner:   { action: 100, ev:  50, outs:  60, position: 40, pressure:  0 },
  Apprentice: { action: 100, ev:  60, outs:  50, position: 40, pressure:  0 },
  Grinder:    { action:  90, ev:  70, outs:  40, position:  0, pressure: 50 },
  ChipLeader: { action:  80, ev:  80, outs:  30, position:  0, pressure: 60 },
  Master:     { action:  70, ev:  90, outs:  20, position:  0, pressure: 70 },
};

// Per-level distribution (counts per category per level)
const TIER_LEVEL_DIST = {
  Beginner:   { action: 20, ev: 10, outs: 12, position:  8, pressure:  0 },
  Apprentice: { action: 20, ev: 12, outs: 10, position:  8, pressure:  0 },
  Grinder:    { action: 18, ev: 14, outs:  8, position:  0, pressure: 10 },
  ChipLeader: { action: 16, ev: 16, outs:  6, position:  0, pressure: 12 },
  Master:     { action: 14, ev: 18, outs:  4, position:  0, pressure: 14 },
};

const TIER_DIFFICULTY = {
  Beginner:   { min: 10, max: 30 },
  Apprentice: { min: 31, max: 55 },
  Grinder:    { min: 56, max: 75 },
  ChipLeader: { min: 76, max: 90 },
  Master:     { min: 91, max: 100 },
};

const TIER_KEY_TO_TIER = {
  Beginner: 'beginner', Apprentice: 'apprentice', Grinder: 'grinder',
  ChipLeader: 'chip_leader', Master: 'master',
};

const TIER_INDEX = { Beginner: 1, Apprentice: 2, Grinder: 3, ChipLeader: 4, Master: 5 };

const EV_MARGIN = { Beginner: 0.10, Apprentice: 0.065, Grinder: 0.038, ChipLeader: 0.03, Master: 0.02 };

// ═══════════════════════════════════════════════════════════════════════════════
// HAND POOLS
// ═══════════════════════════════════════════════════════════════════════════════
const HANDS = {
  premiums:  ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
  broadways: ['TT', 'AQs', 'AQo', 'AJs', 'AJo', 'KQs', 'KQo', 'KJs', 'QJs', 'JTs', 'ATo', 'KTo'],
  suitedCnx: ['T9s', '98s', '87s', '76s', '65s', '54s', 'JTs', '43s'],
  suitedAce: ['ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s'],
  marginal:  ['99', '88', '77', '66', 'KJo', 'QJo', 'J9s', 'K9s', 'T8s', 'Q9s'],
  weakPairs: ['55', '44', '33', '22'],
  trash:     ['72o', '83o', '94o', 'T3o', 'J4o', 'Q5o', '62o', '73o', '84o', '95o', 'T2o', 'J5o', '63o', '74o', '85o'],
  dominated: ['A2o', 'A3o', 'K3o', 'Q6o', 'J6o', 'T5o', '96o', '85o', 'K4o', 'Q7o', 'J7o'],
};

const ACTION_POOLS = {
  Beginner:   { raise: [...HANDS.premiums, ...HANDS.broadways.slice(0,8)], call: ['99','88','77','66',...HANDS.suitedCnx.slice(0,4)], fold: [...HANDS.trash.slice(0,8), ...HANDS.dominated.slice(0,5)] },
  Apprentice: { raise: [...HANDS.premiums, ...HANDS.broadways, 'ATs','A9s'], call: [...HANDS.marginal, ...HANDS.suitedAce.slice(0,4), ...HANDS.suitedCnx], fold: [...HANDS.trash, ...HANDS.dominated, '55','44'] },
  Grinder:    { raise: [...HANDS.premiums, ...HANDS.broadways, ...HANDS.suitedAce.slice(0,4)], call: [...HANDS.marginal, ...HANDS.suitedCnx, '77','66','55'], fold: [...HANDS.trash, ...HANDS.dominated, ...HANDS.weakPairs, 'K4o','Q7o'] },
  ChipLeader: { raise: [...HANDS.premiums, ...HANDS.broadways, ...HANDS.suitedAce, 'K9s','T9s'], call: [...HANDS.marginal, ...HANDS.suitedCnx, '77','66','55','44'], fold: [...HANDS.trash, ...HANDS.dominated, ...HANDS.weakPairs, 'K4o','Q7o','J8o'] },
  Master:     { raise: [...HANDS.premiums, ...HANDS.broadways, ...HANDS.suitedAce, ...HANDS.suitedCnx.slice(0,3)], call: [...HANDS.marginal, '66','55','44', ...HANDS.suitedCnx.slice(3)], fold: [...HANDS.trash, ...HANDS.dominated, ...HANDS.weakPairs.slice(2), 'K4o','J8o','T6o'] },
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSITIONS & SCENARIO CONFIG
// ═══════════════════════════════════════════════════════════════════════════════
const POSITIONS = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const EARLY_POS = ['UTG', 'MP'];
const MID_POS   = ['HJ', 'CO'];
const STACKS    = {
  Beginner: [100], Apprentice: [60,75,100], Grinder: [25,30,40,50,60,75,100],
  ChipLeader: [20,25,30,40,50,60,75,100], Master: [20,25,30,40,50,60,75,100],
};

const ALLOWED_SCENARIOS = {
  Beginner:   ['open_spot','blind_vs_blind','facing_open'],
  Apprentice: ['open_spot','blind_vs_blind','facing_open','facing_3bet','facing_min_raise'],
  Grinder:    ['open_spot','blind_vs_blind','facing_open','facing_3bet','squeeze_spot','iso_raise'],
  ChipLeader: ['open_spot','blind_vs_blind','facing_open','facing_3bet','squeeze_spot','iso_raise','facing_min_raise','late_position_pressure'],
  Master:     ['open_spot','blind_vs_blind','facing_open','facing_3bet','squeeze_spot','iso_raise','facing_min_raise','late_position_pressure'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
function buildActionExplanation(hand, action, scenario) {
  const isPremium = ['AA','KK','QQ','JJ','AKs','AKo'].includes(hand);
  if (action === 'raise') {
    if (isPremium) return `${hand} is a premium hand — always build the pot for value.`;
    if (scenario === 'squeeze_spot') return `${hand} is strong enough to squeeze for value after a raise and a call.`;
    if (scenario === 'facing_3bet') return `${hand} is strong enough to continue aggressively against a 3-bet.`;
    if (scenario === 'iso_raise') return `${hand} is strong enough to isolate limpers and take initiative.`;
    return `${hand} is strong enough to raise for value in this spot.`;
  }
  if (action === 'call') {
    if (scenario === 'facing_3bet') return `${hand} is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet.`;
    if (scenario === 'blind_vs_blind') return `${hand} plays adequately in a blind-versus-blind spot.`;
    return `${hand} has sufficient equity and playability to continue in this spot.`;
  }
  if (scenario === 'facing_3bet') return `${hand} lacks the equity to continue profitably against a 3-bet here.`;
  if (scenario === 'squeeze_spot') return `${hand} is too marginal for this squeeze configuration.`;
  return `${hand} lacks the equity or strength to continue profitably here.`;
}

function buildActionPrompt(scenario, hand, pos, stack, opener, villain, caller, betSz, limpers) {
  switch (scenario) {
    case 'open_spot':
      return `6-max cash game. ${stack}bb effective. Folded to you in ${pos} with ${hand}.`;
    case 'blind_vs_blind':
      return `Action folds to you in the small blind. You hold ${hand} with ${stack}bb effective.`;
    case 'facing_open':
      return `${opener} opens to ${betSz}bb. You are in ${pos} with ${hand}. Effective stack is ${stack}bb.`;
    case 'facing_3bet':
      return `You open from ${opener}. ${pos} 3-bets. You hold ${hand} with ${stack}bb effective.`;
    case 'squeeze_spot':
      return `${opener} opens, ${caller} calls, and action is on you in ${pos} holding ${hand} with ${stack}bb effective.`;
    case 'iso_raise': {
      const desc = limpers === 1 ? 'One player limps' : limpers === 2 ? 'Two players limp' : 'Three players limp';
      return `${desc} before you. You are in ${pos} with ${hand} and ${stack}bb effective.`;
    }
    case 'facing_min_raise':
      return `${opener} makes a minimum raise. You are in ${pos} with ${hand}. Effective stack is ${stack}bb.`;
    case 'late_position_pressure':
      return `${caller} opens wide. You are in ${pos} with ${hand} and ${stack}bb effective.`;
    default:
      return `6-max cash game. ${stack}bb effective. Folded to you in ${pos} with ${hand}.`;
  }
}

function generateActionQuestions(tier, level, count, startSeq, rng) {
  const pool = ACTION_POOLS[tier];
  const scenarios = ALLOWED_SCENARIOS[tier];
  const stacks = STACKS[tier];
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < count && attempts < count * 15) {
    attempts++;
    const scenario = pick(scenarios, rng);
    const pos = pick(POSITIONS, rng);
    const stack = pick(stacks, rng);
    const betSz = pick([2, 2.5, 3], rng);
    const limpers = rngInt(1, 3, rng);
    const opener = pick(EARLY_POS, rng);
    const villain = pick(MID_POS, rng);
    const caller = pick(POSITIONS.filter(p => p !== pos && p !== opener), rng);

    const roll = rng();
    let action, hand;
    if (roll < 0.45)      { action = 'raise'; hand = pick(pool.raise, rng); }
    else if (roll < 0.70) { action = 'call';  hand = pick(pool.call, rng); }
    else                  { action = 'fold';  hand = pick(pool.fold, rng); }

    const prompt = buildActionPrompt(scenario, hand, pos, stack, opener, villain, caller, betSz, limpers);
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l${level}-action-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level, category: 'action',
      prompt, explanation: buildActionExplanation(hand, action, scenario),
      correctAction: action, heroPosition: pos, effectiveStackBb: stack,
      tags: [`l${level}`, scenario, hand.toLowerCase()],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EV QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const POT_SIZES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100, 110, 120, 135, 150, 175, 200, 225, 250];
const BET_FRACS = [0.25, 0.30, 0.33, 0.40, 0.50, 0.55, 0.60, 0.66, 0.70, 0.75, 0.80, 0.90, 1.0, 1.25, 1.5, 2.0];

function generateEVQuestions(tier, level, count, startSeq, rng) {
  const margin = EV_MARGIN[tier];
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < count && attempts < count * 20) {
    attempts++;
    const pot = pick(POT_SIZES, rng);
    const frac = pick(BET_FRACS, rng);
    const bet = Math.round(pot * frac / 5) * 5 || 5;
    const threshold = bet / (pot + 2 * bet);
    const isCall = rng() > 0.5;
    const rawEquity = isCall ? threshold + margin + rng() * 0.02 : threshold - margin - rng() * 0.02;
    const equity = Math.min(95, Math.max(5, Math.round(rawEquity * 100)));
    const correctAnswer = (equity / 100 >= threshold) ? 'CALL' : 'FOLD';
    const thresholdPct = Math.round(threshold * 100);
    const prompt = `The pot is ${pot}. Your opponent bets ${bet}. You estimate your equity at ${equity}%. What is the best action?`;
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l${level}-ev-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level, category: 'ev',
      prompt,
      explanation: `You need ${thresholdPct}% equity to call (bet ÷ (pot + 2×bet)). Your equity is ${equity}%, so the correct move is ${correctAnswer}.`,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: [`l${level}`, 'ev', 'pot-odds'],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTS QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const OUTS_POOL = [
  // flush (9)
  { text: 'You pick up a flush draw on the flop. How many outs do you have?', outs: 9 },
  { text: 'You flop a flush draw with no pair. How many outs do you have?', outs: 9 },
  { text: 'You have a four-flush after the flop. How many outs do you have?', outs: 9 },
  { text: 'You flopped a nut flush draw. How many outs do you have?', outs: 9 },
  { text: 'The flop gave you a flush draw to the nuts. How many outs do you have?', outs: 9 },
  { text: 'You hold two suited cards and the flop brings two more of your suit. How many outs do you have?', outs: 9 },
  { text: 'After the flop you have four cards to your flush. How many outs do you have?', outs: 9 },
  { text: 'You picked up a flush draw on a dry flop. How many outs do you have?', outs: 9 },
  { text: 'You hold a live flush draw on the flop. How many outs remain in the deck?', outs: 9 },
  { text: 'A flush draw on the flop with no backdoor straight. How many outs do you have?', outs: 9 },
  // oesd (8)
  { text: 'You flop an open-ended straight draw (OESD). How many outs do you have?', outs: 8 },
  { text: 'You pick up an OESD on the flop. How many outs do you have?', outs: 8 },
  { text: 'You have a two-way straight draw after the flop. How many outs do you have?', outs: 8 },
  { text: 'You hold four cards to a straight that can hit on either end. How many outs do you have?', outs: 8 },
  { text: 'You flopped a straight draw open on both ends. How many outs do you have?', outs: 8 },
  { text: 'After the flop you hold an open-ended straight draw. How many outs do you have?', outs: 8 },
  { text: 'You have an OESD — both the top and bottom end can complete your straight. How many outs?', outs: 8 },
  { text: 'You flopped a double-sided straight draw. How many outs do you have?', outs: 8 },
  { text: 'Your four cards connect to a straight on both ends. How many outs?', outs: 8 },
  { text: 'You have an open-ended straight draw with no flush draw. How many outs?', outs: 8 },
  // gutshot (4)
  { text: 'You flop a gutshot straight draw. How many outs do you have?', outs: 4 },
  { text: 'You pick up a gutshot (inside straight draw) on the flop. How many outs?', outs: 4 },
  { text: 'You hold an inside straight draw after the flop. How many outs?', outs: 4 },
  { text: 'You need one specific card rank to complete your straight. How many outs?', outs: 4 },
  { text: 'You flopped an inside straight draw (belly buster). How many outs do you have?', outs: 4 },
  { text: 'You have a gutshot draw — only one rank completes your straight. How many outs?', outs: 4 },
  { text: 'After the flop you hold a gutshot straight draw. How many outs do you have?', outs: 4 },
  { text: 'You flopped an inner straight draw with no flush draw. How many outs do you have?', outs: 4 },
  // two overcards (6)
  { text: 'You hold two overcards to a paired board. How many outs do you have?', outs: 6 },
  { text: 'You have two overcards to the entire board. How many outs to improve?', outs: 6 },
  { text: 'Both of your hole cards are higher than any board card. How many outs?', outs: 6 },
  { text: 'You flopped two overcards. How many outs do you have to pair either card?', outs: 6 },
  { text: 'You hold two unpaired cards that are both higher than the board. How many outs?', outs: 6 },
  { text: 'After the flop you have two overcards and no pair. How many outs?', outs: 6 },
  { text: 'You have two live overcards on the flop. How many outs do you have?', outs: 6 },
  // flush + overcard (12)
  { text: 'You hold a flush draw plus one overcard on the flop. How many outs?', outs: 12 },
  { text: 'You have a four-flush and an overcard. How many outs do you have?', outs: 12 },
  { text: 'Your hand combines a flush draw with one overcard. How many outs?', outs: 12 },
  { text: 'You flopped a flush draw and one of your hole cards is an overcard. How many outs?', outs: 12 },
  { text: 'One overcard plus a flush draw on the flop. How many total outs do you have?', outs: 12 },
  { text: 'You have a flush draw and one card that pairs to a winner. How many outs?', outs: 12 },
  { text: 'Flush draw on board plus an overcard that can improve. How many outs?', outs: 12 },
  { text: 'A flush draw plus an overcard to the entire board. How many outs?', outs: 12 },
  // flush + two overcards (15)
  { text: 'You hold a flush draw plus two overcards. How many outs do you have?', outs: 15 },
  { text: 'You flop a flush draw and both hole cards are overcards to the board. How many outs?', outs: 15 },
  { text: 'Flush draw plus two live overcards on the flop. How many outs?', outs: 15 },
  { text: 'You have a four-flush and two overcards. How many total outs do you have?', outs: 15 },
  { text: 'Your hand is a flush draw combined with two overcards. How many outs?', outs: 15 },
  { text: 'Two overcards to the board plus a flush draw. How many outs do you have?', outs: 15 },
  { text: 'You have a monster draw: flush draw plus two overcards. How many outs?', outs: 15 },
  { text: 'Holding two overcards and a flush draw on the flop. How many outs total?', outs: 15 },
  { text: 'You flopped a flush draw; both your hole cards are also overcards. How many outs?', outs: 15 },
  // pair + flush (14)
  { text: 'You hold a small pair plus a flush draw. How many outs do you have?', outs: 14 },
  { text: 'You flopped a pair and picked up a flush draw. How many outs?', outs: 14 },
  { text: 'A pair plus a flush draw — how many outs do you have to improve to trips or a flush?', outs: 14 },
  { text: 'You have a pair and a flush draw after the flop. How many outs?', outs: 14 },
  { text: 'You flopped bottom pair and also picked up a flush draw. How many outs?', outs: 14 },
  { text: 'Pair plus flush draw on the flop. How many total outs?', outs: 14 },
  { text: 'You hold a pair and a four-flush. How many outs do you have?', outs: 14 },
  { text: 'A made pair combined with a flush draw. How many outs to improve?', outs: 14 },
  // pair + oesd (10)
  { text: 'You hold a pair plus an open-ended straight draw. How many outs do you have?', outs: 10 },
  { text: 'You flopped a pair and have an OESD. How many outs?', outs: 10 },
  { text: 'A pair plus OESD combination. How many outs do you have total?', outs: 10 },
  { text: 'You have a made pair and a two-way straight draw. How many outs?', outs: 10 },
  { text: 'You flopped a pair plus a double-sided straight draw. How many outs?', outs: 10 },
  { text: 'Pair combined with an OESD on the flop. How many outs do you have?', outs: 10 },
  { text: 'You have a pair and four cards to a straight open on both ends. How many outs?', outs: 10 },
  { text: 'A pair plus open-ended straight draw. How many total outs?', outs: 10 },
  // oesd + flush (15)
  { text: 'You hold an open-ended straight flush draw. How many outs do you have?', outs: 15 },
  { text: 'You flopped an OESD that also has flush potential. How many outs?', outs: 15 },
  { text: 'You picked up a combo OESD + flush draw on the flop. How many outs?', outs: 15 },
  { text: 'You hold a monstrous draw: OESD plus a flush draw. How many outs?', outs: 15 },
  { text: 'An open-ended straight flush draw on the flop. How many outs?', outs: 15 },
  { text: 'Your hand is an open-ended straight flush draw. How many outs?', outs: 15 },
  // gutshot + overcard (7)
  { text: 'You hold a gutshot plus one overcard. How many outs do you have?', outs: 7 },
  { text: 'You have an inside straight draw plus one overcard. How many outs?', outs: 7 },
  { text: 'A gutshot straight draw combined with an overcard. How many outs?', outs: 7 },
  { text: 'You flopped a gutshot and have one overcard. How many outs total?', outs: 7 },
  { text: 'Gutshot plus an overcard to the board. How many outs do you have?', outs: 7 },
  { text: 'An inside straight draw and an overcard on the flop. How many total outs?', outs: 7 },
  // extra (varied counts to ensure variety)
  { text: 'You have a backdoor flush draw and two overcards. Counting only direct outs, how many do you have?', outs: 6 },
  { text: 'You flopped top pair plus a flush draw. Counting your outs to improve (trips or better flush), how many?', outs: 10 },
  { text: 'You have a gutshot plus a flush draw. How many total outs do you have?', outs: 13 },
  { text: 'You picked up a gutshot straight draw and a flush draw on the flop. How many outs?', outs: 13 },
  { text: 'You hold a straight draw and a flush draw simultaneously on the flop. How many outs?', outs: 13 },
  { text: 'You have middle pair plus a gutshot. How many total outs to improve?', outs: 7 },
  { text: 'Middle pair plus a gutshot straight draw. How many outs do you have?', outs: 7 },
  { text: 'You flopped a set on the board. How many outs do you have to fill up (full house or quads) on the turn?', outs: 7 },
  { text: 'You have trips on the flop. How many outs give you a full house or quads on the turn?', outs: 7 },
  { text: 'You flopped two pair. How many outs to make a full house by the river?', outs: 4 },
  { text: 'You hold two pair after the flop. How many outs give you a full house?', outs: 4 },
  { text: 'On the turn, you have a flush draw. How many outs remain to hit your flush?', outs: 9 },
  { text: 'On the turn, you have an OESD. How many outs remain to hit your straight?', outs: 8 },
  { text: 'On the turn, you have a gutshot. How many outs remain?', outs: 4 },
  { text: 'On the turn, you have two overcards. How many outs remain to pair either card?', outs: 6 },
  // Additional flush phrasings
  { text: 'You flopped the nut flush draw with ace-high. How many outs do you have?', outs: 9 },
  { text: 'You hold a flush draw on a board with no pairs. How many outs do you have?', outs: 9 },
  { text: 'You have four cards to a flush after the flop. How many outs do you have?', outs: 9 },
  // Additional OESD phrasings
  { text: 'You hold a wrap draw that is open on both ends. How many outs do you have?', outs: 8 },
  { text: 'You flopped four cards to a straight with two-way connection. How many outs?', outs: 8 },
  // Additional gutshot phrasings
  { text: 'You have a one-way straight draw. How many outs do you have?', outs: 4 },
  { text: 'You need exactly one rank to complete your straight. How many outs remain?', outs: 4 },
  // Additional multi-draw phrasings
  { text: 'You hold a flush draw plus an inside straight draw. How many outs?', outs: 13 },
  { text: 'You have a flush draw and a gutshot simultaneously. How many outs?', outs: 13 },
  { text: 'Flush draw combined with a gutshot on the flop. How many total outs?', outs: 13 },
  { text: 'You hold two overcards plus a flush draw. Counting only clean outs, how many do you have?', outs: 15 },
  { text: 'A pair with a gutshot — how many outs do you have to improve significantly?', outs: 7 },
  { text: 'You flopped a pair and also have a gutshot draw. How many outs total?', outs: 7 },
  { text: 'You have a pair plus an inside straight draw. How many outs do you have?', outs: 7 },
  { text: 'You hold middle pair plus a flush draw. How many outs to a strong hand?', outs: 14 },
  { text: 'Bottom pair and a flush draw. How many outs do you have?', outs: 14 },
  { text: 'A pair combined with a flush draw on the flop. How many outs total?', outs: 14 },
  // monster combo — pair + OESD + flush draw (17 outs: 9 flush + 8 OESD - 2 overlap + 2 pair)
  { text: 'You flopped a made pair while also holding an OESD and a flush draw. How many total outs?', outs: 17 },
  { text: 'Your hand combines a pair, an open-ended straight draw, and a flush draw. How many outs?', outs: 17 },
  { text: 'You have a pair plus OESD plus flush draw — the ultimate monster combo. How many outs?', outs: 17 },
  { text: 'OESD, flush draw, and a made pair all on the flop. How many total outs do you have?', outs: 17 },
  { text: 'You flopped a pair and picked up both an OESD and a flush draw. How many outs?', outs: 17 },
];

const WRONG_OUTS = {
  2:  [3, 4, 5, 1],  4:  [3, 6, 8, 5],  5:  [6, 7, 8, 4],
  6:  [3, 8, 9, 4],  7:  [4, 6, 9, 8],  8:  [4, 6, 9, 10],
  9:  [6, 7, 8, 12], 10: [8, 9, 12, 11], 12: [9, 10, 14, 15],
  13: [9, 11, 14, 15], 14: [9, 12, 15, 11], 15: [9, 11, 12, 14],
  17: [12, 14, 15, 16],
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const POSITION_POOL = [
  { prompt: 'In 6-max cash poker, which position acts last preflop?', choices: ['UTG','CO','BTN','SB'], correctAnswer: 'BTN', explanation: 'The BTN is last to act preflop.', tags: ['position-basics'] },
  { prompt: 'Which position acts first preflop in a 6-max game?', choices: ['BTN','SB','BB','UTG'], correctAnswer: 'UTG', explanation: 'UTG (under the gun) is left of the big blind and acts first preflop.', tags: ['position-basics'] },
  { prompt: 'Why does acting last (BTN) give you a positional advantage?', choices: ['You see all opponents act before you','You pay less in blinds','You must bet more to build the pot','You always have better cards'], correctAnswer: 'You see all opponents act before you', explanation: 'Position advantage comes from acting last — you have full information before deciding.', tags: ['position-advantage'] },
  { prompt: 'From UTG in a 6-max game, you should generally play:', choices: ['A very wide range','Only strong hands','Any two cards is fine','Only blind hands'], correctAnswer: 'Only strong hands', explanation: 'UTG plays the most opponents after the flop, requiring a tighter preflop range.', tags: ['range-advice'] },
  { prompt: 'Which position is generally considered the best to play most hands from?', choices: ['UTG','SB','BTN','BB'], correctAnswer: 'BTN', explanation: 'BTN acts last postflop (vs all non-BTN players), offering maximum informational advantage.', tags: ['position-advantage'] },
  { prompt: 'In 6-max cash, how many players are typically at the table?', choices: ['9','8','6','4'], correctAnswer: '6', explanation: '6-max means a maximum of 6 players.', tags: ['game-format'] },
  { prompt: 'What does "out of position" (OOP) mean?', choices: ['Acting before your opponent postflop','Having a weaker hand','Sitting to the left of the dealer','Playing from the blinds only'], correctAnswer: 'Acting before your opponent postflop', explanation: 'OOP means you act before your opponent on all postflop streets — a disadvantage.', tags: ['position-basics'] },
  { prompt: 'What does "in position" (IP) mean?', choices: ['Acting after your opponent postflop','Acting first preflop','Having raised preflop','Having a strong hand'], correctAnswer: 'Acting after your opponent postflop', explanation: 'IP means you act after your opponent postflop, giving you an informational advantage.', tags: ['position-basics'] },
  { prompt: 'What is the "button" (BTN) in poker?', choices: ['The dealer position','The player with the biggest stack','The position to the left of the BB','The player who posted the big blind'], correctAnswer: 'The dealer position', explanation: 'BTN is the dealer position; in 6-max it is the best positional spot postflop.', tags: ['position-basics'] },
  { prompt: 'Which player posts the big blind?', choices: ['The player two left of the BTN','The player directly left of the BTN','UTG','The dealer'], correctAnswer: 'The player directly left of the BTN', explanation: 'BB is directly left of the BTN (or two left of the SB).', tags: ['blinds'] },
  { prompt: 'In what order do players act postflop?', choices: ['SB first, then BTN last','BTN first then SB last','Same as preflop order','UTG always acts first postflop'], correctAnswer: 'SB first, then BTN last', explanation: 'Postflop, action starts from the SB (or first remaining player left of dealer) and ends at BTN.', tags: ['position-basics'] },
  { prompt: 'Which position acts last postflop in a 3-way pot (SB, BTN, BB)?', choices: ['SB','BB','BTN','All act simultaneously'], correctAnswer: 'BTN', explanation: 'BTN always acts last postflop regardless of pot configuration.', tags: ['position-advantage'] },
  { prompt: "What does 'HJ' stand for in poker seat names?", choices: ['Hijack','Hard Jack','High Jack seat','Half-Jack'], correctAnswer: 'Hijack', explanation: 'HJ stands for Hijack, the seat two to the right of the BTN.', tags: ['position-names'] },
  { prompt: "What does 'CO' stand for in poker?", choices: ['Cut-Off','Corner Out','Check-Out','Co-dealer'], correctAnswer: 'Cut-Off', explanation: 'CO stands for Cut-Off, the seat directly to the right of the BTN.', tags: ['position-names'] },
  { prompt: "What does 'UTG' stand for?", choices: ['Under the Gun','Up the Game','Under the Guard','Up-to-Go'], correctAnswer: 'Under the Gun', explanation: 'UTG = Under the Gun, the player first to act preflop.', tags: ['position-names'] },
  { prompt: 'Which player has the best position postflop relative to all others?', choices: ['BB','SB','BTN','CO'], correctAnswer: 'BTN', explanation: 'BTN acts last on all postflop streets, which is the best positional advantage.', tags: ['position-advantage'] },
  { prompt: 'Who is at a positional disadvantage vs. the BTN on every single street postflop?', choices: ['Only the BB','Every other player at the table','Only UTG and MP','Only the SB'], correctAnswer: 'Every other player at the table', explanation: 'BTN acts last against all remaining players postflop, putting everyone else at a disadvantage.', tags: ['position-advantage'] },
  { prompt: 'If you are in the SB preflop, how many players act after you preflop?', choices: ['One (the BB)','None','Two (BB and BTN)','All other players'], correctAnswer: 'One (the BB)', explanation: 'SB is second-to-last preflop. Only the BB acts after SB preflop.', tags: ['position-basics'] },
  { prompt: 'In a 6-max table, the BTN opens. How many players can still act before the flop?', choices: ['Five','Four','Two','Three'], correctAnswer: 'Three', explanation: 'After BTN acts, SB, BB, and active players remain to act (SB, BB, plus potentially callers ahead). Typically SB and BB = 2, but standard answer with callers is SB+BB = 2 left. With no prior callers, exactly SB and BB = 2. For a standard 6-max with 6 players and BTN opening = SB and BB still to act = 2.', tags: ['position-basics'] },
  { prompt: 'What is a "steal" in poker?', choices: ['A bluff raise from the BTN/CO targeting the blinds','Calling with a weak hand','Raising with a premium hand from UTG','All-in bluffing'], correctAnswer: 'A bluff raise from the BTN/CO targeting the blinds', explanation: 'A steal is a raise from a late position (CO/BTN/SB) designed to win the blinds without a fight.', tags: ['position-strategy'] },
  { prompt: 'Why should you play tighter from early position (UTG/MP) compared to BTN?', choices: ['Many players behind you can have stronger hands','You have to pay blinds more often','The blinds are smaller from UTG','Because you see the flop first postflop'], correctAnswer: 'Many players behind you can have stronger hands', explanation: 'From early position, more players act after you preflop, increasing the chance of running into a stronger hand.', tags: ['range-advice'] },
  { prompt: 'In a 3-bet pot, you are the BTN vs BB. On the flop, who acts first?', choices: ['BB (out of position)','BTN (in position)','Whoever bet 3x preflop','Whoever has more chips'], correctAnswer: 'BB (out of position)', explanation: 'Positional order is determined by seat position, not by who 3-bet. BB is left of BTN, so BB acts first postflop.', tags: ['position-basics'] },
  { prompt: 'Which seats are typically called "the blinds"?', choices: ['SB and BB','BTN and SB','UTG and MP','CO and HJ'], correctAnswer: 'SB and BB', explanation: 'The SB (small blind) and BB (big blind) are the blind positions and must post mandatory bets before the hand.', tags: ['blinds'] },
  { prompt: 'What is "blind defense"?', choices: ["Calling or re-raising from BB/SB vs a steal attempt",'Folding every hand from the BB','Raising from BTN to attack weak players','Checking back on the flop from position'], correctAnswer: "Calling or re-raising from BB/SB vs a steal attempt", explanation: 'Blind defense means protecting your mandatory investment from the blinds by not folding too readily to steals.', tags: ['position-strategy'] },
  { prompt: 'From the CO in 6-max, you generally have:', choices: ['Good position — only BTN acts after you postflop if BTN calls','Bad position — UTG always acts after you','Equal position to UTG','No advantage over any other player'], correctAnswer: 'Good position — only BTN acts after you postflop if BTN calls', explanation: 'CO is the second-best seat. If BTN does not call, CO acts last postflop.', tags: ['position-advantage'] },
  { prompt: 'What is a "cold call"?', choices: ['Calling a raise when you have not already put any money in the pot','Calling from out of position','Calling a 3-bet after already calling a raise','Folding to a raise'], correctAnswer: 'Calling a raise when you have not already put any money in the pot', explanation: 'A cold call is calling a raise without having voluntarily entered the pot yet this hand.', tags: ['position-strategy'] },
  { prompt: "What does 'SB' stand for?", choices: ['Small Blind','Short Bet','Side Blind','Short Bluff'], correctAnswer: 'Small Blind', explanation: 'SB = Small Blind, the first forced bet position to the left of the BTN.', tags: ['position-names'] },
  { prompt: "What does 'BB' stand for?", choices: ['Big Blind','Biggest Bet','Bad Beat','Back Blind'], correctAnswer: 'Big Blind', explanation: 'BB = Big Blind, the second forced bet position, directly left of the SB.', tags: ['position-names'] },
  { prompt: "What does 'MP' stand for in a 6-max game?", choices: ['Middle Position','Middle Pot','Middle Player','Main Pot'], correctAnswer: 'Middle Position', explanation: 'MP = Middle Position, typically the seat between early position (UTG) and the HJ.', tags: ['position-names'] },
  { prompt: 'Which of these is NOT a valid postflop advantage of being on the BTN?', choices: ["You see everyone's cards before acting",'You act last on the flop','You act last on the turn','You act last on the river'], correctAnswer: "You see everyone's cards before acting", explanation: 'Cards are never revealed before the showdown. BTN advantage is acting LAST (not seeing cards).', tags: ['position-advantage'] },
  { prompt: 'If action folds to the SB, who acts next preflop?', choices: ['BB','BTN','UTG','HJ'], correctAnswer: 'BB', explanation: 'If it folds around to the SB, only the BB remains to act preflop.', tags: ['position-basics'] },
  { prompt: 'In a typical 6-max game, position from best to worst (postflop) is:', choices: ['BTN > CO > HJ > MP > BB > SB','SB > BB > UTG > MP > CO > BTN','BB > BTN > CO > HJ > MP > UTG','UTG > BB > SB > CO > HJ > BTN'], correctAnswer: 'BTN > CO > HJ > MP > BB > SB', explanation: 'BTN is best (acts last), and SB is worst (acts first) on all postflop streets.', tags: ['position-ordering'] },
  { prompt: 'What is "positional awareness" in poker?', choices: ['Understanding how your seat affects your decisions and hand ranges','Knowing how many chips your opponent has','Counting outs on the board','Tracking bets across all streets'], correctAnswer: 'Understanding how your seat affects your decisions and hand ranges', explanation: 'Positional awareness means adapting your strategy based on whether you will act first or last postflop.', tags: ['position-strategy'] },
  { prompt: 'From the BTN, you open. SB folds, BB calls. Postflop, who bets first?', choices: ['BB acts first','BTN acts first','Whoever has a stronger hand','The player with more chips'], correctAnswer: 'BB acts first', explanation: 'Postflop order goes from left of dealer clockwise. BB is left of SB (who folded), so BB acts before BTN.', tags: ['position-basics'] },
  { prompt: 'What is a "positional 3-bet"?', choices: ['A 3-bet from BTN/CO designed to play a big pot in position','A 3-bet from UTG','Any raise to the 3rd level','A squeeze play from the blinds'], correctAnswer: 'A 3-bet from BTN/CO designed to play a big pot in position', explanation: 'A positional 3-bet leverages your positional advantage to play a big pot where you act last.', tags: ['position-strategy'] },
  { prompt: 'Which position acts last preflop?', choices: ['UTG','SB','BB','CO'], correctAnswer: 'BB', explanation: 'The BB is last to act preflop — they face all raises and can check or raise if only called.', tags: ['position-basics'] },
  { prompt: 'Compared to the BB, the SB has:', choices: ['Worse position postflop (acts first)','Better position postflop (acts last)','Equal position postflop','Better position only on the flop'], correctAnswer: 'Worse position postflop (acts first)', explanation: 'SB acts before BB on all postflop streets, making SB the worst positional seat.', tags: ['position-ordering'] },
  { prompt: 'In 6-max, which seat is directly to the right of the BTN?', choices: ['CO','HJ','MP','SB'], correctAnswer: 'CO', explanation: 'CO (Cut-Off) is the seat directly to the right of the BTN.', tags: ['position-names'] },
  { prompt: 'In 6-max, which seat is two to the right of the BTN?', choices: ['HJ','CO','UTG','MP'], correctAnswer: 'HJ', explanation: 'HJ (Hijack) is two seats to the right of the BTN.', tags: ['position-names'] },
  { prompt: 'What is a "limp"?', choices: ["Calling the big blind preflop without raising",'Folding preflop','Raising to 2x the big blind','Checking the flop'], correctAnswer: "Calling the big blind preflop without raising", explanation: 'Limping means calling the BB preflop rather than raising — generally avoided by strong players in 6-max.', tags: ['position-strategy'] },
  { prompt: 'A "3-bet" preflop means:', choices: ['The third raise in the preflop betting sequence','Betting three times the big blind','Raising on three consecutive streets','Betting with three callers in the pot'], correctAnswer: 'The third raise in the preflop betting sequence', explanation: 'BB post = bet 1. Open raise = bet 2. Re-raise = 3-bet.', tags: ['range-advice'] },
  { prompt: 'A "squeeze" preflop is:', choices: ['3-betting when there is an open raiser and at least one caller','Open raising from BTN','Folding to a 3-bet','Calling from the blinds'], correctAnswer: '3-betting when there is an open raiser and at least one caller', explanation: 'A squeeze puts pressure on both the raiser and the caller(s), who must each make a decision.', tags: ['position-strategy'] },
  { prompt: 'What does "donk bet" mean?', choices: ['Betting into the preflop aggressor out of position','Raising from the BTN','Calling a raise from UTG','Checking and folding'], correctAnswer: 'Betting into the preflop aggressor out of position', explanation: 'A donk bet is made by an OOP player betting into the PFA (preflop aggressor) rather than checking to them.', tags: ['position-strategy'] },
  { prompt: 'What is a "c-bet" (continuation bet)?', choices: ['Betting the flop as the preflop raise maker','Calling and then betting the turn','A bet from out of position on the flop','Checking the flop twice'], correctAnswer: 'Betting the flop as the preflop raise maker', explanation: 'A c-bet is a flop bet made by the player who raised preflop — continuing their aggression.', tags: ['position-strategy'] },
  { prompt: 'Being "first to act postflop" is considered:', choices: ['A disadvantage because you reveal info without gaining info','An advantage because you set the price','Neutral for experienced players','Always better than checking'], correctAnswer: 'A disadvantage because you reveal info without gaining info', explanation: 'Acting first means you must bet/check before seeing what opponents do, giving them an informational edge.', tags: ['position-advantage'] },
  { prompt: 'You are the SB in a 3-way pot (SB, BTN, BB) and check-raise the flop. Who acts next?', choices: ['BB must decide first, then BTN','BTN decides,then BB','You act next because you initiated','BB and BTN simultaneously'], correctAnswer: 'BB must decide first, then BTN', explanation: 'After SB check-raises, action moves to the left: BB acts, then BTN.', tags: ['position-basics'] },
  { prompt: 'What is "table position" in poker?', choices: ["Your seat's relationship to the BTN/blinds, which determines acting order",'How many chips you have vs opponents','Whether you are happy with your cards','The physical seat you choose at a live table'], correctAnswer: "Your seat's relationship to the BTN/blinds, which determines acting order", explanation: 'Table position = your relative seat, determining whether you act first or last on each street.', tags: ['position-basics'] },
  { prompt: 'In 6-max, how many seats are "late position"?', choices: ['1 (BTN only)','3 (CO, BTN, HJ)','2 (BTN and CO)','4 (HJ, CO, BTN, SB)'], correctAnswer: '3 (CO, BTN, HJ)', explanation: 'Late position typically includes HJ, CO, and BTN — the three rightmost non-blind seats.', tags: ['position-ordering'] },
];

function generatePositionQuestions(tier, level, count, startSeq, rng) {
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  const pool = shuffle(POSITION_POOL, rng);

  for (let i = 0; i < pool.length && questions.length < count; i++) {
    const q = pool[i];
    const fp = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l${level}-position-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level, category: 'position',
      prompt: q.prompt, explanation: q.explanation,
      choices: [...q.choices],
      correctAnswer: q.correctAnswer,
      tags: [`l${level}`, 'position', ...q.tags],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESSURE QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const DRY_BOARDS   = ['A-K-7 rainbow','K-T-4 rainbow','A-8-3 rainbow','Q-7-2 rainbow','J-6-2 rainbow','K-Q-5 rainbow','A-9-4 rainbow','K-8-2 rainbow'];
const WET_BOARDS   = ['J-T-8','9-8-6','T-9-7','8-7-5','Q-J-9','K-Q-J','T-8-7','J-9-7'];
const WEAK_TOP     = ['K5o','Q6o','J7o','A3o','K2o','T4o','J3o','Q4o','A4o','K3o','J4o','Q3o'];
const UNDERPAIRS   = ['22','33','44','55','66','77'];
const DRAW_HANDS   = ['87s','76s','65s','T9s','98s','54s','JTs','86s','97s','T8s'];
const SET_HANDS    = ['22','33','44','55','66','77','88','99'];
const TWO_PAIR_H   = ['AJo','KQs','QJs','KJs','ATs','T9s','KTo'];
const STRONG_TP    = ['ATs','KQo','AJs','AQo','AKo','QJs','KJs','ATo'];
const MED_PAIRS    = ['55','66','77','88','99'];

function buildPressureQuestion(rng, tier) {
  const type = rngInt(0, 11, rng);
  switch (type) {
    case 0: case 5: {
      const hand = pick(WEAK_TOP, rng);
      const board = pick(DRY_BOARDS, rng);
      const agg = pick(['bets 3/4 pot on the flop and barrels the turn','bets pot on the turn after cbetting the flop','fires large bets on the flop and turn','check-raises the turn after calling the flop'], rng);
      return { prompt: `You hold ${hand} on a ${board} board. Top pair but weak kicker. Villain ${agg}. What is the best action?`, correctAnswer: 'FOLD', tag: 'weak_top_pair_fold', explanation: `Your top pair has a dominated kicker. Villain's aggression on a dry board typically represents a better made hand. Release.` };
    }
    case 1: case 6: {
      const hand = pick(UNDERPAIRS, rng);
      const board = pick(DRY_BOARDS, rng);
      const size = pick(['1/2','2/3','3/4'], rng);
      return { prompt: `You hold ${hand} on a board of ${board}. Villain opened UTG and cbets ${size} pot. What is the best action?`, correctAnswer: 'FOLD', tag: 'underpair_fold', explanation: `A UTG range connects heavily with high cards. Your ${hand} is a small underpair with little showdown value. Fold.` };
    }
    case 2: {
      const hand = pick(DRAW_HANDS, rng);
      const board = pick(WET_BOARDS, rng);
      const pot = pick([50,60,70,80], rng);
      const call = pot * 2;
      return { prompt: `You hold ${hand} (OESD) on a ${board} board. Villain fires a 2x pot overbet. You need to call ${call} into a pot of ${pot}. What is the best action?`, correctAnswer: 'FOLD', tag: 'draw_vs_overbet', explanation: `An OESD gives roughly 32% equity. A 2x overbet requires ~67% equity to break even. The math forces a fold.` };
    }
    case 3: {
      const hand = pick(DRAW_HANDS, rng);
      const pot = pick([50,60,70,80], rng);
      const bet = Math.round(pot * pick([0.25,0.33], rng) / 5) * 5 || 5;
      const threshold = Math.round((bet / (pot + 2 * bet)) * 100);
      return { prompt: `You hold ${hand}. You have an OESD on the flop. Pot is ${pot}. Villain bets ${bet}. What is the best action?`, correctAnswer: 'CALL', tag: 'draw_correct_call', explanation: `You need ${threshold}% equity to call. An OESD gives roughly 32% equity. The pot odds clearly justify a call.` };
    }
    case 4: {
      const hand = pick(MED_PAIRS, rng);
      const board = pick(WET_BOARDS, rng);
      return { prompt: `You hold ${hand}. Board ${board}. Villain check-raised your flop bet to 3x. You have middle pair on a very coordinated board. What is the best action?`, correctAnswer: 'FOLD', tag: 'check_raise_fold', explanation: `On a wet board a check-raise almost always represents a made hand or big equity draw. ${hand} is too vulnerable.` };
    }
    case 7: {
      const hand = pick(SET_HANDS, rng);
      const topCard = pick(['A','K','Q','J','T','9'], rng);
      const board = `${hand.substring(0,1)}-${topCard}-${rngInt(2,8,rng)}`;
      return { prompt: `You hold ${hand} and flopped a set on a board of ${board}. Villain leads the flop and continues with large bets on the turn. What is the best action?`, correctAnswer: 'CALL', tag: 'set_correct_call', explanation: `You have a set — one of the strongest hands possible. You are well ahead of villain's range. Continue and extract value.` };
    }
    case 8: {
      const hand = pick(TWO_PAIR_H, rng);
      const board = pick(['A-K-J','Q-J-9','T-9-7','A-Q-8','K-J-T','A-K-Q'], rng);
      const frac = pick(['1/2','2/3','3/4'], rng);
      return { prompt: `You hold ${hand} in a 3-bet pot. Board ${board}. You have top two pair. Villain bets ${frac} pot. What is the best action?`, correctAnswer: 'CALL', tag: 'two_pair_call', explanation: `Top two pair is a premium holding. Call to keep villain's wider range in the pot.` };
    }
    case 9: {
      const hand = pick(STRONG_TP, rng);
      const board = pick(DRY_BOARDS, rng);
      return { prompt: `You hold ${hand}. Board ${board} rainbow. Top pair good kicker. Villain check-raises your flop bet to 3x. What is the best action?`, correctAnswer: 'CALL', tag: 'top_pair_call', explanation: `Top pair with a solid kicker (${hand}) is strong enough to call a check-raise on a dry board.` };
    }
    case 10: {
      // flush draw with clear pot odds — CALL
      const hand = pick(DRAW_HANDS, rng);
      const pot = pick([60, 70, 80, 90, 100], rng);
      const bet = Math.round(pot * pick([0.33, 0.40, 0.50], rng) / 5) * 5 || 5;
      const threshold = Math.round((bet / (pot + 2 * bet)) * 100);
      return { prompt: `You hold a flush draw on the flop. Pot is ${pot}. Villain bets ${bet}. You have 9 outs to the flush. What is the best action?`, correctAnswer: 'CALL', tag: 'flush_draw_call', explanation: `You need ${threshold}% equity to call. With 9 flush outs (roughly 35% by the river), you have the equity to call profitably.` };
    }
    case 11: {
      // monster draw (OESD + flush) vs reasonable bet — CALL
      const hand = pick(DRAW_HANDS, rng);
      const pot = pick([60, 70, 80, 100], rng);
      const bet = Math.round(pot * pick([0.50, 0.60, 0.66], rng) / 5) * 5 || 5;
      const threshold = Math.round((bet / (pot + 2 * bet)) * 100);
      return { prompt: `You hold ${hand} and flopped an OESD plus a flush draw. Pot is ${pot}. Villain bets ${bet}. What is the best action?`, correctAnswer: 'CALL', tag: 'monster_draw_call', explanation: `An OESD + flush draw carries roughly 54% equity by the river. You need ${threshold}% to call. With a monster draw, calling is clearly profitable.` };
    }
    default: {
      const hand = pick(WEAK_TOP, rng);
      const board = pick(DRY_BOARDS, rng);
      return { prompt: `You hold ${hand} on a ${board} board. Top pair weak kicker. Villain leads all three streets for large bets. What is the best action?`, correctAnswer: 'FOLD', tag: 'three_street_fold', explanation: `Three streets of value from a focused player typically represents a better made hand. ${hand} is likely dominated. Fold.` };
    }
  }
}

function generatePressureQuestions(tier, level, count, startSeq, rng) {
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < count && attempts < count * 20) {
    attempts++;
    const { prompt, correctAnswer, tag, explanation } = buildPressureQuestion(rng, tier);
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l${level}-pressure-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level, category: 'pressure',
      prompt, explanation,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: [`l${level}`, 'postflop', 'pressure', tag],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEDUP
// ═══════════════════════════════════════════════════════════════════════════════
function dedupeByPrompt(questions) {
  const seen = new Set();
  return questions.filter(q => {
    const fp = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) return false;
    seen.add(fp);
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER BUILDER — generate each category as a whole bank, then assign levels
// ═══════════════════════════════════════════════════════════════════════════════

/** Assign level numbers by slicing a flat bank into evenly-sized level buckets. */
function assignLevels(questions, perLevel) {
  for (let i = 0; i < questions.length; i++) {
    const level = Math.min(Math.floor(i / perLevel) + 1, 5);
    questions[i].level = level;
    // Fix id to reflect correct level
    questions[i].id = questions[i].id.replace(/-l\d+-/, `-l${level}-`);
    // Fix tags
    questions[i].tags = questions[i].tags.map(t => /^l\d$/.test(t) ? `l${level}` : t);
  }
  return questions;
}

function buildTier(tier, seed) {
  const rng = makeRng(`${seed}-${tier}`);
  const targets = TIER_TARGETS[tier];
  const dist = TIER_LEVEL_DIST[tier];
  const all = [];
  let seq = 1;

  // Generate each category as a SINGLE whole-bank call (not per-level) to avoid
  // cross-level duplicate prompts being removed by the final dedup pass.
  if ((targets.action || 0) > 0) {
    // Action uses a shared seenSet passed across "virtual levels" to avoid cross-level dupes
    const seenAction = new Set();
    const actionBank = generateActionQuestionsGlobal(tier, targets.action, seq, rng, seenAction);
    assignLevels(actionBank, dist.action);
    all.push(...actionBank); seq += actionBank.length;
  }
  if ((targets.ev || 0) > 0) {
    const seenEv = new Set();
    const evBank = generateEVQuestionsGlobal(tier, targets.ev, seq, rng, seenEv);
    assignLevels(evBank, dist.ev);
    all.push(...evBank); seq += evBank.length;
  }
  if ((targets.outs || 0) > 0) {
    const outsBank = generateOutsQuestionsGlobal(tier, targets.outs, seq, rng);
    assignLevels(outsBank, dist.outs);
    all.push(...outsBank); seq += outsBank.length;
  }
  if ((targets.position || 0) > 0) {
    const posBank = generatePositionQuestionsGlobal(tier, targets.position, seq, rng);
    assignLevels(posBank, dist.position);
    all.push(...posBank); seq += posBank.length;
  }
  if ((targets.pressure || 0) > 0) {
    const seenPressure = new Set();
    const pressureBank = generatePressureQuestionsGlobal(tier, targets.pressure, seq, rng, seenPressure);
    assignLevels(pressureBank, dist.pressure);
    all.push(...pressureBank); seq += pressureBank.length;
  }

  const targets_total = Object.values(targets).reduce((s, n) => s + n, 0);
  if (all.length < targets_total) {
    console.warn(`  [WARN] ${tier}: generated ${all.length} / ${targets_total} unique questions`);
  }
  return all;
}

// ── Global (whole-bank) generator wrappers ────────────────────────────────────

function generateActionQuestionsGlobal(tier, total, startSeq, rng, seen) {
  const pool = ACTION_POOLS[tier];
  const scenarios = ALLOWED_SCENARIOS[tier];
  const stacks = STACKS[tier];
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < total && attempts < total * 20) {
    attempts++;
    const scenario = pick(scenarios, rng);
    const pos = pick(POSITIONS, rng);
    const stack = pick(stacks, rng);
    const betSz = pick([2, 2.5, 3], rng);
    const limpers = rngInt(1, 3, rng);
    const opener = pick(EARLY_POS, rng);
    const mid = MID_POS.filter(p => p !== pos);
    const villain = mid.length > 0 ? pick(mid, rng) : pick(POSITIONS, rng);
    const callerPool = POSITIONS.filter(p => p !== pos && p !== opener);
    const caller = callerPool.length > 0 ? pick(callerPool, rng) : pick(POSITIONS, rng);

    const roll = rng();
    let action, hand;
    if (roll < 0.45)      { action = 'raise'; hand = pick(pool.raise, rng); }
    else if (roll < 0.70) { action = 'call';  hand = pick(pool.call, rng); }
    else                  { action = 'fold';  hand = pick(pool.fold, rng); }

    const prompt = buildActionPrompt(scenario, hand, pos, stack, opener, villain, caller, betSz, limpers);
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    // Derive the correct heroPosition for this scenario
    let heroPos;
    switch (scenario) {
      case 'blind_vs_blind':  heroPos = 'SB'; break;
      case 'facing_3bet':     heroPos = opener; break; // hero opened from opener position
      default:                heroPos = pos;
    }

    questions.push({
      id: `gen-${tierStr}-l1-action-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level: 1, category: 'action',
      prompt, explanation: buildActionExplanation(hand, action, scenario),
      correctAction: action, heroPosition: heroPos, effectiveStackBb: stack,
      tags: ['l1', scenario, hand.toLowerCase()],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

function generateEVQuestionsGlobal(tier, total, startSeq, rng, seen) {
  const margin = EV_MARGIN[tier];
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < total && attempts < total * 30) {
    attempts++;
    const pot = pick(POT_SIZES, rng);
    const frac = pick(BET_FRACS, rng);
    const bet = Math.round(pot * frac / 5) * 5 || 5;
    const threshold = bet / (pot + 2 * bet);
    const isCall = rng() > 0.5;
    const rawEquity = isCall ? threshold + margin + rng() * 0.03 : threshold - margin - rng() * 0.03;
    const equity = Math.min(95, Math.max(5, Math.round(rawEquity * 100)));
    const correctAnswer = (equity / 100 >= threshold) ? 'CALL' : 'FOLD';
    const thresholdPct = Math.round(threshold * 100);
    const prompt = `The pot is ${pot}. Your opponent bets ${bet}. You estimate your equity at ${equity}%. What is the best action?`;
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l1-ev-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level: 1, category: 'ev',
      prompt,
      explanation: `You need ${thresholdPct}% equity to call (bet ÷ (pot + 2×bet)). Your equity is ${equity}%, so the correct move is ${correctAnswer}.`,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: ['l1', 'ev', 'pot-odds'],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

function generateOutsQuestionsGlobal(tier, total, startSeq, rng) {
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  // Shuffle the entire pool once, then iterate
  const pool = shuffle(OUTS_POOL, rng);

  for (let i = 0; i < pool.length && questions.length < total; i++) {
    const { text, outs } = pool[i];
    const fp = text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    const wrong = [...(WRONG_OUTS[outs] || [outs-1, outs+1, outs+2, outs-2])].slice(0, 3);
    const choices = shuffle([String(outs), ...wrong.map(String)], rng);

    questions.push({
      id: `gen-${tierStr}-l1-outs-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level: 1, category: 'outs',
      prompt: text, explanation: `The correct answer is ${outs} outs.`,
      choices, correctAnswer: String(outs),
      tags: ['l1', 'outs', `${outs}-outs`],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

function generatePositionQuestionsGlobal(tier, total, startSeq, rng) {
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const seen = new Set();
  const questions = [];
  let seq = startSeq;
  const pool = shuffle(POSITION_POOL, rng);

  for (let i = 0; i < pool.length && questions.length < total; i++) {
    const q = pool[i];
    const fp = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l1-position-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level: 1, category: 'position',
      prompt: q.prompt, explanation: q.explanation,
      choices: [...q.choices],
      correctAnswer: q.correctAnswer,
      tags: ['l1', 'position', ...q.tags],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

function generatePressureQuestionsGlobal(tier, total, startSeq, rng, seen) {
  const diff = TIER_DIFFICULTY[tier];
  const tierStr = TIER_KEY_TO_TIER[tier];
  const tierIdx = TIER_INDEX[tier];
  const questions = [];
  let seq = startSeq;
  let attempts = 0;

  while (questions.length < total && attempts < total * 20) {
    attempts++;
    const { prompt, correctAnswer, tag, explanation } = buildPressureQuestion(rng, tier);
    const fp = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(fp)) continue;
    seen.add(fp);

    questions.push({
      id: `gen-${tierStr}-l1-pressure-${String(seq).padStart(3,'0')}`,
      tier: tierStr, tierIndex: tierIdx, level: 1, category: 'pressure',
      prompt, explanation,
      choices: ['CALL', 'FOLD'],
      correctAnswer,
      tags: ['l1', 'postflop', 'pressure', tag],
      difficultyScore: rngInt(diff.min, diff.max, rng),
    });
    seq++;
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE WRITER
// ═══════════════════════════════════════════════════════════════════════════════
const TIER_VAR = {
  Beginner: 'generatedBeginnerQuestions',   Apprentice: 'generatedApprenticeQuestions',
  Grinder:  'generatedGrinderQuestions',    ChipLeader: 'generatedChipLeaderQuestions',
  Master:   'generatedMasterQuestions',
};

function serializeQ(q) {
  const lines = [];
  lines.push(`    id: ${JSON.stringify(q.id)}`);
  lines.push(`    tier: ${JSON.stringify(q.tier)}`);
  lines.push(`    tierIndex: ${q.tierIndex}`);
  lines.push(`    level: ${q.level}`);
  lines.push(`    category: ${JSON.stringify(q.category)}`);
  lines.push(`    prompt: ${JSON.stringify(q.prompt)}`);
  lines.push(`    explanation: ${JSON.stringify(q.explanation)}`);
  if (q.correctAction != null)    lines.push(`    correctAction: ${JSON.stringify(q.correctAction)}`);
  if (q.heroPosition != null)     lines.push(`    heroPosition: ${JSON.stringify(q.heroPosition)}`);
  if (q.effectiveStackBb != null) lines.push(`    effectiveStackBb: ${q.effectiveStackBb}`);
  if (q.choices != null)          lines.push(`    choices: ${JSON.stringify(q.choices)}`);
  if (q.correctAnswer != null)    lines.push(`    correctAnswer: ${JSON.stringify(q.correctAnswer)}`);
  lines.push(`    tags: ${JSON.stringify(q.tags)}`);
  lines.push(`    difficultyScore: ${q.difficultyScore}`);
  return `  {\n${lines.join(',\n')},\n  }`;
}

function writeFile(tier, questions, seed, outDir) {
  const varName = TIER_VAR[tier];
  const tierName = varName.replace('generated','').replace('Questions','');
  const fileName = `generated${tierName}Questions.ts`;
  const filePath = path.join(outDir, fileName);

  const content =
    `// Auto-generated by TC090.5 — node generateQuestions.js\n` +
    `// Tier: ${tier} | Seed: ${seed} | Count: ${questions.length}\n` +
    `// DO NOT EDIT MANUALLY — regenerate with: node generateQuestions.js\n\n` +
    `import type { ChallengeQuestion } from '../../challengeQuestionTypes';\n\n` +
    `export const ${varName}: ChallengeQuestion[] = [\n` +
    questions.map(serializeQ).join(',\n') +
    `,\n];\n`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Wrote ${questions.length} questions → ${filePath}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION (per-category counts)
// ═══════════════════════════════════════════════════════════════════════════════
function verifyBank(tier, questions) {
  const targets = TIER_TARGETS[tier];
  const byCat = {};
  const byLevel = {};
  for (const q of questions) {
    byCat[q.category] = (byCat[q.category] || 0) + 1;
    byLevel[q.level]  = (byLevel[q.level]  || 0) + 1;
  }
  const total = Object.values(targets).reduce((s, n) => s + n, 0);
  const passed = questions.length === total;
  console.log(`  [${passed ? 'OK' : 'FAIL'}] ${tier}: total=${questions.length}/${total}  by-category=${JSON.stringify(byCat)}  by-level=${JSON.stringify(byLevel)}`);

  // Check for duplicate prompts
  const prompts = new Set();
  let dups = 0;
  for (const q of questions) {
    const fp = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (prompts.has(fp)) dups++;
    prompts.add(fp);
  }
  if (dups > 0) console.log(`  [WARN] ${dups} duplicate prompt(s) detected in ${tier} bank.`);
  else          console.log(`  [OK]   No duplicate prompts in ${tier} bank.`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
function main() {
  const args = process.argv.slice(2);
  let seed  = 'DCR-001';
  let tiers = ['Beginner', 'Apprentice', 'Grinder'];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--seed'  && args[i+1]) { seed = args[++i]; }
    if (args[i] === '--tiers' && args[i+1]) { tiers = args[++i].split(',').map(s => s.trim()); }
    if (args[i] === '--all') { tiers = ['Beginner','Apprentice','Grinder','ChipLeader','Master']; }
  }

  const outDir = path.resolve(__dirname, 'app/src/components/poker-challenge/data/generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`\nTC090.5 Question Generator`);
  console.log(`  seed  : ${seed}`);
  console.log(`  tiers : ${tiers.join(', ')}`);
  console.log(`  output: ${outDir}\n`);

  for (const tier of tiers) {
    if (!TIER_TARGETS[tier]) { console.error(`  [SKIP] Unknown tier: ${tier}`); continue; }
    console.log(`Building ${tier}…`);
    const questions = buildTier(tier, seed);
    verifyBank(tier, questions);
    writeFile(tier, questions, seed, outDir);
  }

  console.log('\nDone.');
}

main();
