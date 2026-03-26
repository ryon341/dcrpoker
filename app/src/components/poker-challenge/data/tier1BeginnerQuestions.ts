import type { ChallengeAction } from '../challengeTypes';
import type { ChallengeCategory, ChallengeQuestion } from '../challengeQuestionTypes';

type Level = 1 | 2 | 3 | 4 | 5;

type ActionSeed = {
  prompt: string;
  correctAction: ChallengeAction;
  heroPosition: string;
  effectiveStackBb: number;
  tags: string[];
  difficultyScore: number;
};

type MathSeed = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  difficultyScore: number;
};

function makeActionQuestion(level: Level, idx: number, seed: ActionSeed): ChallengeQuestion {
  return {
    id: `beginner-l${level}-action-${String(idx + 1).padStart(3, '0')}`,
    tier: 'beginner',
    tierIndex: 1,
    level,
    category: 'action',
    prompt: seed.prompt,
    explanation:
      seed.correctAction === 'raise'
        ? 'This is a clear value/profit open or aggressive preflop decision at beginner depth.'
        : seed.correctAction === 'call'
          ? 'This hand has enough equity and playability for a straightforward preflop continue in this spot.'
          : 'This hand is dominated or too weak in this position/spot, so folding avoids a low-EV preflop leak.',
    correctAction: seed.correctAction,
    heroPosition: seed.heroPosition,
    effectiveStackBb: seed.effectiveStackBb,
    tags: seed.tags,
    difficultyScore: seed.difficultyScore,
  };
}

function makeMathQuestion(level: Level, idx: number, category: ChallengeCategory, seed: MathSeed): ChallengeQuestion {
  return {
    id: `beginner-l${level}-${category}-${String(idx + 1).padStart(3, '0')}`,
    tier: 'beginner',
    tierIndex: 1,
    level,
    category,
    prompt: seed.prompt,
    explanation: seed.explanation,
    choices: seed.choices,
    correctAnswer: seed.correctAnswer,
    tags: seed.tags,
    difficultyScore: seed.difficultyScore,
  };
}

const level1ActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with AA.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'open', 'premium'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with KK.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l1', 'open', 'premium'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with QQ.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l1', 'open', 'premium'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with AKs.', correctAction: 'raise', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l1', 'open', 'premium'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with AQs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'open', 'broadway'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with JJ.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l1', 'open', 'pair'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with AKo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'open', 'broadway'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with TT.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l1', 'open', 'pair'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with AJs.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l1', 'open', 'suited-ace'], difficultyScore: 13 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with KQs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'open', 'broadway'], difficultyScore: 13 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with 72o.', correctAction: 'fold', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l1', 'fold', 'trash'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with 83o.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l1', 'fold', 'trash'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with 94o.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l1', 'fold', 'trash'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with T3o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l1', 'fold', 'trash'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with J4o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'fold', 'trash'], difficultyScore: 10 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with AA.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'premium'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with KK.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'premium'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with QQ.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'premium'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with AKo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'broadway'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with 84o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'fold'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the big blind with 93o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'fold'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with T2o.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l1', 'blind-vs-btn', 'fold'], difficultyScore: 11 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the big blind with 54o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'blind-defense', 'fold'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with AQs.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'blind-defense', 'premium'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the big blind with AKs.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'blind-defense', 'premium'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the small blind with QQ.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'premium'], difficultyScore: 13 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with AJs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'suited-ace'], difficultyScore: 13 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the big blind with Q3o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'blind-defense', 'fold'], difficultyScore: 12 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with KQo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'broadway'], difficultyScore: 13 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with Q2o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l1', 'vs-open', 'fold'], difficultyScore: 13 },
];

const level2ActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with KJo.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l2', 'open', 'broadway'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with ATo.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l2', 'open', 'ace-x'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with QTs.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'open', 'suited-broadway'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with K9s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'open', 'suited'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with Q8o.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l2', 'open', 'fold'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with J8o.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l2', 'open', 'fold'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with T7o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'open', 'fold'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with J5o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'open', 'fold'], difficultyScore: 20 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with 88.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'pair'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with AJs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'suited-ace'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with AQo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'broadway'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with KTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'fold'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with A9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'blind-defense', 'suited-ace'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with K8s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'blind-defense', 'suited-king'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with Q5o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'blind-defense', 'fold'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with AQo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l2', 'blind-vs-btn', '3bet'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with A5s.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l2', 'squeeze', 'suited-ace'], difficultyScore: 24 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with AKo.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'premium'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the big blind with 97o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'fold'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the cutoff with 99.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'pair'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with AQs.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'broadway'], difficultyScore: 24 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are in the cutoff with T8o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'fold'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with 66.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'open', 'small-pair'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with A5s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l2', 'open', 'suited-ace'], difficultyScore: 22 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with A4o.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l2', 'open', 'fold'], difficultyScore: 21 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with KJs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'suited-broadway'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with J9o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'fold'], difficultyScore: 23 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with 76s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'blind-defense', 'connector'], difficultyScore: 24 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with QQ.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l2', 'vs-open', 'premium'], difficultyScore: 24 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the big blind with Q9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l2', 'blind-defense', 'suited'], difficultyScore: 24 },
];

const level3ActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with A9s.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l3', 'open', 'suited-ace'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with KTo.', correctAction: 'raise', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l3', 'open', 'broadway'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with 55.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'open', 'small-pair'], difficultyScore: 31 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with 98s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'open', 'connector'], difficultyScore: 31 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with A8o.', correctAction: 'fold', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l3', 'open', 'fold'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with K9o.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l3', 'open', 'fold'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the hijack with Q9o.', correctAction: 'fold', heroPosition: 'HJ', effectiveStackBb: 100, tags: ['l3', 'open', 'fold'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with J8o.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'open', 'fold'], difficultyScore: 30 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with TT.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'pair'], difficultyScore: 32 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with AQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'broadway'], difficultyScore: 32 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with AJo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'fold'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the cutoff with AJs.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'vs-open', '3bet'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'pair'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with QJo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'broadway'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with A5s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', '3bet-bluff'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with KTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'fold'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with AJs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l3', 'blind-vs-btn', '3bet'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with KQo.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l3', 'blind-vs-btn', 'call'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the small blind with K8o.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l3', 'blind-vs-btn', 'fold'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with T9s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l3', 'blind-defense', 'connector'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with ATo.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l3', 'blind-defense', 'ace-x'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.5bb. You are in the big blind with J6o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l3', 'blind-defense', 'fold'], difficultyScore: 33 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb and button calls. You are in the big blind with 99.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l3', 'squeeze', 'pair'], difficultyScore: 35 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with AQo.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'isolation', 'broadway'], difficultyScore: 35 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb and hijack calls. You are in the cutoff with 66.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'set-mine', 'pair'], difficultyScore: 34 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and cutoff calls. You are on the button with KQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'multiway', 'suited-broadway'], difficultyScore: 35 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in the cutoff with QTs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'call'], difficultyScore: 35 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with A4s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l3', 'open', 'suited-ace'], difficultyScore: 31 },
  { prompt: '6-max cash game. 100bb effective. Folded to you on the button with 44.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'open', 'small-pair'], difficultyScore: 31 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are on the button with QTs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l3', 'vs-open', 'suited-broadway'], difficultyScore: 33 },
];

const level4ActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with AQs.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'broadway'], difficultyScore: 40 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are in middle position with AQo.', correctAction: 'fold', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'fold'], difficultyScore: 41 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with KQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'suited-broadway'], difficultyScore: 41 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.5bb. You are on the button with KQo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'fold'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.3bb. You are in the cutoff with AJs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'call'], difficultyScore: 41 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb. You are in the cutoff with A5s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l4', 'vs-open', '3bet-bluff'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 99.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'pair'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb. You are on the button with 66.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'pair'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with AJo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'ace-x'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are on the button with K9s.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'suited'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with AQs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l4', 'blind-vs-open', '3bet'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with KJs.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l4', 'blind-vs-open', 'call'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.5bb. You are in the small blind with Q9o.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l4', 'blind-vs-open', 'fold'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with A8s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'suited-ace'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with K7s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'suited-king'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with T7o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'fold'], difficultyScore: 42 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with QTs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'suited-broadway'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the big blind with A5s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', '3bet-bluff'], difficultyScore: 45 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with AQs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'isolation', 'premium'], difficultyScore: 45 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.5bb and cutoff calls. You are on the button with ATo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l4', 'multiway', 'fold'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and hijack calls. You are in the cutoff with TT.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l4', 'set-value', 'pair'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.5bb and hijack calls. You are in the cutoff with AKo.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l4', 'squeeze', 'premium'], difficultyScore: 45 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with JJ.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l4', 'vs-open', '3bet-value'], difficultyScore: 45 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the small blind with 88.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l4', 'vs-open', 'fold'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in the big blind with AJs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'call'], difficultyScore: 44 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the big blind with 65s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'connector'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the big blind with 95o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l4', 'blind-defense', 'fold'], difficultyScore: 43 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in the cutoff with K9o.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l4', 'open', 'late-position'], difficultyScore: 41 },
  { prompt: '6-max cash game. 100bb effective. Folded to you in middle position with A7s.', correctAction: 'raise', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l4', 'open', 'suited-ace'], difficultyScore: 40 },
  { prompt: '6-max cash game. 100bb effective. Folded to you under the gun with KJo.', correctAction: 'fold', heroPosition: 'UTG', effectiveStackBb: 100, tags: ['l4', 'open', 'fold'], difficultyScore: 42 },
];

const level5ActionSeeds: ActionSeed[] = [
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in middle position with JJ.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'pair'], difficultyScore: 50 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are in middle position with TT.', correctAction: 'call', heroPosition: 'MP', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'pair'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are on the button with AQs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'call'], difficultyScore: 51 },
  { prompt: '6-max cash game. 100bb effective. Under the gun opens to 2.2bb. You are on the button with AQo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'fold'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.3bb. You are in the cutoff with KQs.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'call'], difficultyScore: 51 },
  { prompt: '6-max cash game. 100bb effective. Middle position opens to 2.3bb. You are in the cutoff with A5s.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 100, tags: ['l5', 'vs-open', '3bet-bluff'], difficultyScore: 53 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.3bb. You are on the button with 99.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'pair'], difficultyScore: 51 },
  { prompt: '6-max cash game. 100bb effective. Hijack opens to 2.3bb. You are on the button with 77.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'pair'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are on the button with ATo.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'call'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are on the button with KTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 100, tags: ['l5', 'vs-open', 'fold'], difficultyScore: 53 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with AJo.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-btn', '3bet'], difficultyScore: 53 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with KJs.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-btn', 'call'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.2bb. You are in the small blind with QTo.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-btn', 'fold'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.1bb. You are in the big blind with A7s.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l5', 'blind-defense', 'call'], difficultyScore: 51 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.1bb. You are in the big blind with Q7o.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l5', 'blind-defense', 'fold'], difficultyScore: 52 },
  { prompt: '6-max cash game. 100bb effective. Button opens to 2.1bb. You are in the big blind with A5s.', correctAction: 'raise', heroPosition: 'BB', effectiveStackBb: 100, tags: ['l5', 'blind-defense', '3bet-bluff'], difficultyScore: 54 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the small blind with AQs.', correctAction: 'raise', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-open', '3bet-value'], difficultyScore: 54 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the small blind with 99.', correctAction: 'call', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-open', 'call'], difficultyScore: 53 },
  { prompt: '6-max cash game. 100bb effective. Cutoff opens to 2.3bb. You are in the small blind with 76s.', correctAction: 'fold', heroPosition: 'SB', effectiveStackBb: 100, tags: ['l5', 'blind-vs-open', 'fold'], difficultyScore: 53 },
  { prompt: '6-max cash game. 80bb effective. Hijack opens to 2.3bb and cutoff calls. You are on the button with AQs.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 80, tags: ['l5', 'isolation', 'squeeze'], difficultyScore: 55 },
  { prompt: '6-max cash game. 80bb effective. Hijack opens to 2.3bb and cutoff calls. You are on the button with KJs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 80, tags: ['l5', 'multiway', 'call'], difficultyScore: 54 },
  { prompt: '6-max cash game. 80bb effective. Hijack opens to 2.3bb and cutoff calls. You are on the button with QTo.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 80, tags: ['l5', 'multiway', 'fold'], difficultyScore: 54 },
  { prompt: '6-max cash game. 60bb effective. Under the gun opens to 2.2bb. You are in the big blind with AJs.', correctAction: 'call', heroPosition: 'BB', effectiveStackBb: 60, tags: ['l5', 'blind-defense', 'stack-depth'], difficultyScore: 53 },
  { prompt: '6-max cash game. 60bb effective. Under the gun opens to 2.2bb. You are in the big blind with KQo.', correctAction: 'fold', heroPosition: 'BB', effectiveStackBb: 60, tags: ['l5', 'blind-defense', 'fold'], difficultyScore: 54 },
  { prompt: '6-max cash game. 60bb effective. Middle position opens to 2.3bb. You are in the cutoff with AQo.', correctAction: 'raise', heroPosition: 'CO', effectiveStackBb: 60, tags: ['l5', 'vs-open', '3bet'], difficultyScore: 55 },
  { prompt: '6-max cash game. 60bb effective. Middle position opens to 2.3bb. You are in the cutoff with KQo.', correctAction: 'call', heroPosition: 'CO', effectiveStackBb: 60, tags: ['l5', 'vs-open', 'call'], difficultyScore: 54 },
  { prompt: '6-max cash game. 60bb effective. Middle position opens to 2.3bb. You are in the cutoff with JTo.', correctAction: 'fold', heroPosition: 'CO', effectiveStackBb: 60, tags: ['l5', 'vs-open', 'fold'], difficultyScore: 54 },
  { prompt: '6-max cash game. 40bb effective. Cutoff opens to 2.2bb. You are on the button with A9s.', correctAction: 'raise', heroPosition: 'BTN', effectiveStackBb: 40, tags: ['l5', 'shorter-stack', '3bet'], difficultyScore: 55 },
  { prompt: '6-max cash game. 40bb effective. Cutoff opens to 2.2bb. You are on the button with KTs.', correctAction: 'call', heroPosition: 'BTN', effectiveStackBb: 40, tags: ['l5', 'shorter-stack', 'call'], difficultyScore: 55 },
  { prompt: '6-max cash game. 40bb effective. Cutoff opens to 2.2bb. You are on the button with Q9o.', correctAction: 'fold', heroPosition: 'BTN', effectiveStackBb: 40, tags: ['l5', 'shorter-stack', 'fold'], difficultyScore: 55 },
];

const level1OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah Kh on Qh 7c 2h. How many outs improve you to a flush by the river?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'You have 9 hearts remaining to complete a flush.', tags: ['l1', 'outs', 'flush-draw'], difficultyScore: 12 },
  { prompt: 'You hold 8s 9s on 6d 7c Kc. How many outs complete your straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 or T makes the straight: 8 total outs.', tags: ['l1', 'outs', 'oesd'], difficultyScore: 12 },
  { prompt: 'You hold Js Ts on Qd 8c 2h. How many outs give you a straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'This is a gutshot; only a 9 completes your straight.', tags: ['l1', 'outs', 'gutshot'], difficultyScore: 13 },
  { prompt: 'You hold As Kd on 7c 2d 9h. How many outs improve you to top pair or better on the turn?', choices: ['3', '4', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three kings are clean outs.', tags: ['l1', 'outs', 'overcards'], difficultyScore: 13 },
  { prompt: 'You hold 7h 7d on Ac Kc 2s. How many outs give you trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two sevens remain in the deck.', tags: ['l1', 'outs', 'pair-to-trips'], difficultyScore: 12 },
  { prompt: 'You hold Qh Jh on Th 4c 2h. How many outs improve you to a flush?', choices: ['8', '9', '10', '11'], correctAnswer: '9', explanation: 'There are 9 unseen hearts left.', tags: ['l1', 'outs', 'flush-draw'], difficultyScore: 12 },
  { prompt: 'You hold 5s 6s on 7d 8h Kc. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any 4 or 9 completes the straight.', tags: ['l1', 'outs', 'oesd'], difficultyScore: 13 },
  { prompt: 'You hold Ad Qd on Qs 8c 3d. How many outs improve you to two pair or trips on the turn?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces make two pair and two queens make trips.', tags: ['l1', 'outs', 'made-hand-improve'], difficultyScore: 14 },
  { prompt: 'You hold Kc Qc on Jd Tc 2s. How many outs give you a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any A or 9 makes a straight.', tags: ['l1', 'outs', 'double-gutter-basic'], difficultyScore: 14 },
  { prompt: 'You hold 9h Th on 7h 8h 2c. How many outs improve you to a flush or straight (counting overlap once)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush outs + 8 straight outs - 2 overlap = 15.', tags: ['l1', 'outs', 'combo-draw'], difficultyScore: 15 },
];

const level2OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah 5h on Kh 8c 2h. How many outs complete a flush by the river?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'A four-flush has 9 outs.', tags: ['l2', 'outs', 'flush-draw'], difficultyScore: 22 },
  { prompt: 'You hold 6s 7s on 8d 9c 2h. How many outs complete a straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 or T completes the straight.', tags: ['l2', 'outs', 'oesd'], difficultyScore: 22 },
  { prompt: 'You hold Qs Js on Ah Kd 2c. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a T completes your straight (A-K-Q-J-T).', tags: ['l2', 'outs', 'gutshot'], difficultyScore: 23 },
  { prompt: 'You hold Ac Kc on 7d 2s 9h. How many overcard outs do you have on the turn?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three kings.', tags: ['l2', 'outs', 'overcards'], difficultyScore: 23 },
  { prompt: 'You hold 4d 4s on Qc 8h 2d. How many outs improve you to trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two fours remain.', tags: ['l2', 'outs', 'pair-to-trips'], difficultyScore: 22 },
  { prompt: 'You hold Jd Td on 9d 8d 2c. How many outs improve you to a flush or straight (count overlap once)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush outs + 8 straight outs - 2 overlap.', tags: ['l2', 'outs', 'combo-draw'], difficultyScore: 24 },
  { prompt: 'You hold As Qs on Qd 7c 3s. How many outs improve you to two pair or trips?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces and two queens.', tags: ['l2', 'outs', 'made-hand-improve'], difficultyScore: 24 },
  { prompt: 'You hold 8c 9c on 6h 7d 2s. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 or T gives a straight.', tags: ['l2', 'outs', 'oesd'], difficultyScore: 23 },
  { prompt: 'You hold Kd Qd on Jc Tc 2h. How many outs make a straight?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A or 9 makes the straight.', tags: ['l2', 'outs', 'broadway-draw'], difficultyScore: 24 },
  { prompt: 'You hold 5h 6h on 7h 8c Kd. How many outs improve you to a flush?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'Nine hearts remain.', tags: ['l2', 'outs', 'flush-draw'], difficultyScore: 22 },
];

const level3OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah Jh on Qh 9c 2h. How many flush outs do you have?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'A standard four-flush has 9 outs.', tags: ['l3', 'outs', 'flush-draw'], difficultyScore: 32 },
  { prompt: 'You hold 7s 8s on 5d 6c Kc. How many straight outs are live?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 4 or 9 completes your straight.', tags: ['l3', 'outs', 'oesd'], difficultyScore: 32 },
  { prompt: 'You hold Qd Jd on Td 8h 2c. How many outs make a straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a 9 gives a straight in this structure.', tags: ['l3', 'outs', 'gutshot'], difficultyScore: 33 },
  { prompt: 'You hold Ac Kc on 9d 4s 2h. How many outs pair one of your overcards?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces + three kings.', tags: ['l3', 'outs', 'overcards'], difficultyScore: 33 },
  { prompt: 'You hold 9h 9d on As Kc 2s. How many outs give you trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two nines remain.', tags: ['l3', 'outs', 'pair-to-trips'], difficultyScore: 32 },
  { prompt: 'You hold Th Jh on 8h 9h 2c. How many combined flush and straight outs do you have?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush + 8 straight - 2 overlap.', tags: ['l3', 'outs', 'combo-draw'], difficultyScore: 34 },
  { prompt: 'You hold As Qd on Qh 7s 2c. How many outs improve to two pair or trips on the turn?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces and two queens.', tags: ['l3', 'outs', 'made-hand-improve'], difficultyScore: 34 },
  { prompt: 'You hold 4c 5c on 6d 7s Kc. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 3 or 8 makes the straight.', tags: ['l3', 'outs', 'oesd'], difficultyScore: 33 },
  { prompt: 'You hold Ks Qs on Jd Tc 2h. How many straight outs are there?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A or 9 completes.', tags: ['l3', 'outs', 'broadway-draw'], difficultyScore: 34 },
  { prompt: 'You hold 2h 2c on Ah Kd 7s. How many outs improve you to a set on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two twos remain.', tags: ['l3', 'outs', 'set-outs'], difficultyScore: 33 },
];

const level4OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah Th on Qh 8c 2h. How many flush outs do you have?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'Nine hearts complete your flush.', tags: ['l4', 'outs', 'flush-draw'], difficultyScore: 42 },
  { prompt: 'You hold 9s 8s on 7d 6c Kc. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 5 or T completes your straight.', tags: ['l4', 'outs', 'oesd'], difficultyScore: 42 },
  { prompt: 'You hold Qs Ts on Jd 8c 2h. How many outs complete a straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a 9 makes your straight.', tags: ['l4', 'outs', 'gutshot'], difficultyScore: 43 },
  { prompt: 'You hold Ac Kd on 8s 4h 2c. How many overcard outs do you have?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces plus three kings.', tags: ['l4', 'outs', 'overcards'], difficultyScore: 43 },
  { prompt: 'You hold 6h 6d on As Qc 2s. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two sixes remain.', tags: ['l4', 'outs', 'pair-to-trips'], difficultyScore: 42 },
  { prompt: 'You hold Jc Tc on 9c 8c 2d. How many flush or straight outs do you have total?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush outs + 8 straight outs - 2 overlap.', tags: ['l4', 'outs', 'combo-draw'], difficultyScore: 44 },
  { prompt: 'You hold As Jd on Jh 7c 2s. How many outs improve to two pair or trips?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces and two jacks.', tags: ['l4', 'outs', 'made-hand-improve'], difficultyScore: 44 },
  { prompt: 'You hold 5s 4s on 6d 7h Ac. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 3 or 8 makes a straight.', tags: ['l4', 'outs', 'oesd'], difficultyScore: 43 },
  { prompt: 'You hold Kd Qd on Jc Tc 3h. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A or 9 makes your straight.', tags: ['l4', 'outs', 'broadway-draw'], difficultyScore: 44 },
  { prompt: 'You hold 3h 3c on As Kd 9s. How many outs improve you to a set on turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two threes remain.', tags: ['l4', 'outs', 'set-outs'], difficultyScore: 43 },
];

const level5OutsSeeds: MathSeed[] = [
  { prompt: 'You hold Ah 9h on Kh 7c 2h. How many flush outs do you have?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: 'Any remaining heart completes your flush.', tags: ['l5', 'outs', 'flush-draw'], difficultyScore: 52 },
  { prompt: 'You hold Ts 9s on 8d 7c Kc. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 6 or J completes a straight.', tags: ['l5', 'outs', 'oesd'], difficultyScore: 52 },
  { prompt: 'You hold Qd Td on Jc 8h 2s. How many outs complete your straight?', choices: ['4', '6', '8', '9'], correctAnswer: '4', explanation: 'Only a 9 gives you a straight.', tags: ['l5', 'outs', 'gutshot'], difficultyScore: 53 },
  { prompt: 'You hold Ac Qc on 8s 4h 2d. How many overcard outs do you have?', choices: ['4', '5', '6', '8'], correctAnswer: '6', explanation: 'Three aces and three queens.', tags: ['l5', 'outs', 'overcards'], difficultyScore: 53 },
  { prompt: 'You hold 8h 8d on As Kc 3s. How many outs make trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two eights remain in the deck.', tags: ['l5', 'outs', 'pair-to-trips'], difficultyScore: 52 },
  { prompt: 'You hold Jh Th on 9h 8h 2c. How many total flush/straight outs are there?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 flush + 8 straight - 2 overlap.', tags: ['l5', 'outs', 'combo-draw'], difficultyScore: 54 },
  { prompt: 'You hold As Kd on Ks 7c 2h. How many outs improve to two pair or trips?', choices: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'Three aces and two kings improve your hand.', tags: ['l5', 'outs', 'made-hand-improve'], difficultyScore: 54 },
  { prompt: 'You hold 6s 5s on 7d 8h Ac. How many straight outs do you have?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 4 or 9 completes a straight.', tags: ['l5', 'outs', 'oesd'], difficultyScore: 53 },
  { prompt: 'You hold Kc Qc on Jd Tc 4h. How many straight outs are live?', choices: ['4', '6', '8', '9'], correctAnswer: '8', explanation: 'Any A or 9 completes your straight.', tags: ['l5', 'outs', 'broadway-draw'], difficultyScore: 54 },
  { prompt: 'You hold 5h 5c on As Kd 9s. How many outs make a set on turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two fives remain.', tags: ['l5', 'outs', 'set-outs'], difficultyScore: 53 },
];

const level1EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $40 and it costs $10 to call. What break-even equity do you need?', choices: ['20%', '25%', '33%', '40%'], correctAnswer: '20%', explanation: 'You call 10 to win 50 total, so 10/50 = 20%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 12 },
  { prompt: 'Pot is $30 and it costs $10 to call. What break-even equity do you need?', choices: ['20%', '25%', '33%', '40%'], correctAnswer: '25%', explanation: 'You call 10 to win 40 total, so 10/40 = 25%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 12 },
  { prompt: 'Pot is $20 and it costs $10 to call. What break-even equity do you need?', choices: ['25%', '33%', '40%', '50%'], correctAnswer: '33%', explanation: 'You call 10 to win 30 total, so 10/30 = 33%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 13 },
  { prompt: 'Pot is $15 and it costs $10 to call. What break-even equity do you need?', choices: ['33%', '40%', '50%', '67%'], correctAnswer: '40%', explanation: 'You call 10 to win 25 total, so 10/25 = 40%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 13 },
  { prompt: 'Pot is $10 and it costs $10 to call. What break-even equity do you need?', choices: ['33%', '40%', '50%', '67%'], correctAnswer: '50%', explanation: 'You call 10 to win 20 total, so 10/20 = 50%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 14 },
  { prompt: 'You need 25% equity to call. Your hand has 30% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '30% is above the required 25%, so calling is +EV.', tags: ['l1', 'ev', 'decision'], difficultyScore: 13 },
  { prompt: 'You need 33% equity to call. Your hand has 28% equity. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '28% is below the required 33%, so folding is better.', tags: ['l1', 'ev', 'decision'], difficultyScore: 13 },
  { prompt: 'Pot is $60 and villain bets $20. What are your direct pot odds to call?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '4:1', explanation: 'You call 20 to win 80, which is 4:1.', tags: ['l1', 'ev', 'pot-odds-ratio'], difficultyScore: 14 },
  { prompt: 'Pot is $45 and villain bets $15. What break-even equity is required?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: 'You call 15 to win 60 total, so 15/60 = 25%.', tags: ['l1', 'ev', 'pot-odds'], difficultyScore: 14 },
  { prompt: 'Pot is $50 and villain bets $25. You estimate 40% equity. Best decision?', choices: ['Call', 'Fold', 'Either is equal', 'Raise only'], correctAnswer: 'Call', explanation: 'Calling 25 to win 75 needs 33%; 40% is enough.', tags: ['l1', 'ev', 'decision'], difficultyScore: 15 },
];

const level2EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $36 and call is $12. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '12/48 = 25%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 22 },
  { prompt: 'Pot is $50 and call is $20. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '29%', explanation: '20/70 is about 28.6%, rounded to 29%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 23 },
  { prompt: 'Pot is $25 and call is $15. Break-even equity?', choices: ['30%', '33%', '38%', '45%'], correctAnswer: '38%', explanation: '15/40 = 37.5%, about 38%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 23 },
  { prompt: 'Pot is $18 and call is $6. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '6/24 = 25%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 22 },
  { prompt: 'Pot is $80 and call is $20. Break-even equity?', choices: ['16%', '20%', '25%', '33%'], correctAnswer: '20%', explanation: '20/100 = 20%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 22 },
  { prompt: 'Need 30% equity to call. You estimate 34%. Best play?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '34% exceeds the requirement.', tags: ['l2', 'ev', 'decision'], difficultyScore: 23 },
  { prompt: 'Need 40% equity to call. You estimate 35%. Best play?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '35% is under the requirement.', tags: ['l2', 'ev', 'decision'], difficultyScore: 23 },
  { prompt: 'Pot is $70 and villain bets $35. Direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '3:1', explanation: 'Call 35 to win 105 gives 3:1.', tags: ['l2', 'ev', 'ratio'], difficultyScore: 24 },
  { prompt: 'Pot is $28 and villain bets $14. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '14/42 = 33%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 24 },
  { prompt: 'Pot is $54 and call is $18. Required equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '18/72 = 25%.', tags: ['l2', 'ev', 'pot-odds'], difficultyScore: 24 },
];

const level3EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $42 and call is $14. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '14/56 = 25%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 32 },
  { prompt: 'Pot is $55 and call is $22. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '29%', explanation: '22/77 is about 28.6%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 33 },
  { prompt: 'Pot is $32 and call is $18. Break-even equity?', choices: ['30%', '36%', '40%', '45%'], correctAnswer: '36%', explanation: '18/50 = 36%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 33 },
  { prompt: 'Pot is $24 and call is $8. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '8/32 = 25%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 32 },
  { prompt: 'Pot is $90 and call is $30. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '30/120 = 25%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 32 },
  { prompt: 'You need 33% equity. You estimate 37%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '37% is above break-even.', tags: ['l3', 'ev', 'decision'], difficultyScore: 33 },
  { prompt: 'You need 29% equity. You estimate 24%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '24% does not meet the threshold.', tags: ['l3', 'ev', 'decision'], difficultyScore: 33 },
  { prompt: 'Pot is $66 and villain bets $22. Direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '4:1', explanation: 'Call 22 to win 88 equals 4:1.', tags: ['l3', 'ev', 'ratio'], difficultyScore: 34 },
  { prompt: 'Pot is $39 and villain bets $13. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '13/52 = 25%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 34 },
  { prompt: 'Pot is $48 and call is $24. Required equity?', choices: ['25%', '33%', '40%', '50%'], correctAnswer: '33%', explanation: '24/72 = 33%.', tags: ['l3', 'ev', 'pot-odds'], difficultyScore: 34 },
];

const level4EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $45 and call is $15. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '15/60 = 25%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 42 },
  { prompt: 'Pot is $52 and call is $26. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '26/78 = 33%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 43 },
  { prompt: 'Pot is $35 and call is $20. Break-even equity?', choices: ['30%', '36%', '40%', '45%'], correctAnswer: '36%', explanation: '20/55 is about 36.4%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 43 },
  { prompt: 'Pot is $30 and call is $10. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '10/40 = 25%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 42 },
  { prompt: 'Pot is $100 and call is $40. Break-even equity?', choices: ['20%', '25%', '29%', '33%'], correctAnswer: '29%', explanation: '40/140 is about 28.6%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 42 },
  { prompt: 'Need 36% equity. You estimate 39%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '39% beats 36%.', tags: ['l4', 'ev', 'decision'], difficultyScore: 43 },
  { prompt: 'Need 25% equity. You estimate 22%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '22% is below break-even.', tags: ['l4', 'ev', 'decision'], difficultyScore: 43 },
  { prompt: 'Pot is $72 and villain bets $24. Direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '4:1', explanation: 'Call 24 to win 96 equals 4:1.', tags: ['l4', 'ev', 'ratio'], difficultyScore: 44 },
  { prompt: 'Pot is $44 and villain bets $22. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '22/66 = 33%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 44 },
  { prompt: 'Pot is $63 and call is $21. Required equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '21/84 = 25%.', tags: ['l4', 'ev', 'pot-odds'], difficultyScore: 44 },
];

const level5EvSeeds: MathSeed[] = [
  { prompt: 'Pot is $48 and call is $16. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '16/64 = 25%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 52 },
  { prompt: 'Pot is $58 and call is $29. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '29/87 = 33%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 53 },
  { prompt: 'Pot is $38 and call is $22. Break-even equity?', choices: ['30%', '37%', '40%', '45%'], correctAnswer: '37%', explanation: '22/60 is about 36.7%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 53 },
  { prompt: 'Pot is $27 and call is $9. Break-even equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '9/36 = 25%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 52 },
  { prompt: 'Pot is $110 and call is $44. Break-even equity?', choices: ['20%', '25%', '29%', '33%'], correctAnswer: '29%', explanation: '44/154 is about 28.6%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 52 },
  { prompt: 'Need 33% equity. You estimate 31%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Fold', explanation: '31% is below the requirement.', tags: ['l5', 'ev', 'decision'], difficultyScore: 53 },
  { prompt: 'Need 29% equity. You estimate 34%. Best decision?', choices: ['Call', 'Fold', 'Either', 'Raise only'], correctAnswer: 'Call', explanation: '34% exceeds break-even.', tags: ['l5', 'ev', 'decision'], difficultyScore: 53 },
  { prompt: 'Pot is $84 and villain bets $28. Direct pot odds?', choices: ['2:1', '3:1', '4:1', '5:1'], correctAnswer: '4:1', explanation: 'Call 28 to win 112 gives 4:1 odds.', tags: ['l5', 'ev', 'ratio'], difficultyScore: 54 },
  { prompt: 'Pot is $46 and villain bets $23. Break-even equity?', choices: ['25%', '29%', '33%', '40%'], correctAnswer: '33%', explanation: '23/69 = 33%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 54 },
  { prompt: 'Pot is $69 and call is $23. Required equity?', choices: ['20%', '25%', '30%', '33%'], correctAnswer: '25%', explanation: '23/92 = 25%.', tags: ['l5', 'ev', 'pot-odds'], difficultyScore: 54 },
];

// ─── TC090: Extra outs seeds (2 per level → 60 total outs) ───────────────────

const level1ExtraOutsSeeds: MathSeed[] = [
  { prompt: 'You hold As Ks on Qs Js 2d. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (As, Ks in hand + Qs, Js on board). 13-4 = 9 flush outs remain.', tags: ['l1', 'outs', 'flush-draw'], difficultyScore: 12 },
  { prompt: 'You hold 5s 6s on 4d 3c Ah. How many outs complete your straight?', choices: ['4', '6', '8', '10'], correctAnswer: '8', explanation: 'Any 2 makes a straight (A-2-3-4-5); any 7 makes 3-4-5-6-7. 8 total outs.', tags: ['l1', 'outs', 'oesd'], difficultyScore: 13 },
];

const level2ExtraOutsSeeds: MathSeed[] = [
  { prompt: 'You hold Kh Qh on Jh Th 4d. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 hearts seen (Kh, Qh in hand + Jh, Th on board). 13-4 = 9 flush outs remain.', tags: ['l2', 'outs', 'flush-draw'], difficultyScore: 22 },
  { prompt: 'You hold 3d 3c on Ah Kd 2s. How many outs give you trips on the turn?', choices: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Two threes remain in the deck.', tags: ['l2', 'outs', 'pair-to-trips'], difficultyScore: 22 },
];

const level3ExtraOutsSeeds: MathSeed[] = [
  { prompt: 'You hold 5c 6c on 3c 4c Kd. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 club flush outs + 8 straight outs (2 or 7) - 2 overlap (2c, 7c) = 15.', tags: ['l3', 'outs', 'combo-draw'], difficultyScore: 34 },
  { prompt: 'You hold Td Jd on 8d 9d 3c. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 diamonds seen (Td, Jd in hand + 8d, 9d on board). 13-4 = 9 flush outs.', tags: ['l3', 'outs', 'flush-draw'], difficultyScore: 32 },
];

const level4ExtraOutsSeeds: MathSeed[] = [
  { prompt: 'You hold 7h 8h on 5h 6h Kd. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 heart flush outs + 8 straight outs (4 or 9) - 2 overlap (4h, 9h) = 15.', tags: ['l4', 'outs', 'combo-draw'], difficultyScore: 44 },
  { prompt: 'You hold Js Qs on Ks As 4d. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen (Js, Qs in hand + Ks, As on board). 13-4 = 9 flush outs.', tags: ['l4', 'outs', 'flush-draw'], difficultyScore: 42 },
];

const level5ExtraOutsSeeds: MathSeed[] = [
  { prompt: 'You hold Tc Jc on 8c 9c 4h. How many total outs (flush + straight, no double-count)?', choices: ['12', '13', '15', '17'], correctAnswer: '15', explanation: '9 club flush outs + 8 straight outs (7 or Q) - 2 overlap (7c, Qc) = 15.', tags: ['l5', 'outs', 'combo-draw'], difficultyScore: 54 },
  { prompt: 'You hold As Ks on Qs Js 7d. How many flush outs remain?', choices: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '4 spades seen. 13-4 = 9 flush outs remaining.', tags: ['l5', 'outs', 'flush-draw'], difficultyScore: 52 },
];

// ─── TC090: Position seeds (8 per level → 40 total position) ─────────────────

const level1PositionSeeds: MathSeed[] = [
  { prompt: 'In 6-max poker, which pre-flop position requires the tightest starting hand range?', choices: ['Button', 'Cutoff', 'Under the Gun', 'Small Blind'], correctAnswer: 'Under the Gun', explanation: 'UTG acts first pre-flop among 6 players, facing the most opponents still to act, so it requires the tightest range.', tags: ['l1', 'position', 'concept'], difficultyScore: 12 },
  { prompt: '6-max cash, 100bb. Folded to you UTG with J5o. Best play?', choices: ['Fold', 'Raise', 'Limp', 'Call'], correctAnswer: 'Fold', explanation: 'J5o is far too weak to open from UTG. Early position demands a tight range of strong hands.', tags: ['l1', 'position', 'utg-fold'], difficultyScore: 11 },
  { prompt: '6-max cash, 100bb. Folded to you BTN with 97o. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Check'], correctAnswer: 'Raise', explanation: 'From the BTN you have position on all opponents post-flop, making 97o a profitable open raise.', tags: ['l1', 'position', 'btn-open'], difficultyScore: 12 },
  { prompt: 'What is the primary benefit of being "in position" post-flop?', choices: ['You act first', 'You act last with full information', 'You see opponent cards', 'You pay no blinds'], correctAnswer: 'You act last with full information', explanation: 'Acting last on every post-flop street lets you make decisions with maximum information.', tags: ['l1', 'position', 'concept'], difficultyScore: 13 },
  { prompt: '6-max cash, 100bb. BTN opens 2.5bb. You are SB with 83o. Best play?', choices: ['Call', 'Raise', 'Fold', 'Limp'], correctAnswer: 'Fold', explanation: '83o is too weak to defend from the SB vs a BTN open. Fold and wait for a better spot.', tags: ['l1', 'position', 'sb-defense'], difficultyScore: 11 },
  { prompt: '6-max cash, 100bb. Folded to you UTG with Q6o. Best play?', choices: ['Fold', 'Raise', 'Limp', 'Call'], correctAnswer: 'Fold', explanation: 'Q6o is too weak to open from UTG. Out-of-position equity with a weak hand bleeds chips.', tags: ['l1', 'position', 'utg-fold'], difficultyScore: 11 },
  { prompt: '6-max cash, 100bb. Folded to you CO with 55. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Check'], correctAnswer: 'Raise', explanation: '55 is a profitable CO open. Position and set-mining potential make it a raise.', tags: ['l1', 'position', 'co-open'], difficultyScore: 12 },
  { prompt: '6-max cash, 100bb. BTN opens 2.5bb. SB folds. You are BB with T4o. Best play?', choices: ['Call', 'Raise', 'Fold', 'Check'], correctAnswer: 'Fold', explanation: 'T4o vs a BTN open gives you poor equity in the worst post-flop position. Fold.', tags: ['l1', 'position', 'bb-defense'], difficultyScore: 12 },
];

const level2PositionSeeds: MathSeed[] = [
  { prompt: 'As you move from UTG to BTN in 6-max, your pre-flop opening range should...?', choices: ['Get tighter', 'Stay the same', 'Get wider', 'Depend only on card ranks'], correctAnswer: 'Get wider', explanation: 'Later seats face fewer opponents and enjoy post-flop position, so you can open more hands profitably.', tags: ['l2', 'position', 'concept'], difficultyScore: 21 },
  { prompt: '6-max cash, 100bb. Folded to you MP with K6o. Best play?', choices: ['Raise', 'Limp', 'Fold', 'Call'], correctAnswer: 'Fold', explanation: 'K6o is below MP opening standards. Position discipline means folding weak hands from MP.', tags: ['l2', 'position', 'mp-fold'], difficultyScore: 21 },
  { prompt: '6-max cash, 100bb. Folded to you CO with 76s. Best play?', choices: ['Fold', 'Limp only', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: '76s is a standard CO open. It has straight and flush potential with position.', tags: ['l2', 'position', 'co-open'], difficultyScore: 22 },
  { prompt: '6-max cash, 100bb. CO opens 2.5bb. You are SB with J7o. Best play?', choices: ['Call', 'Raise', 'Fold', 'Limp'], correctAnswer: 'Fold', explanation: 'J7o vs CO open from SB is a clear fold. OOP with a marginal hand is a chip-spill.', tags: ['l2', 'position', 'sb-fold'], difficultyScore: 22 },
  { prompt: 'Which 6-max seat is considered the most profitable to play from?', choices: ['Under the Gun', 'Middle Position', 'Small Blind', 'Button'], correctAnswer: 'Button', explanation: 'The BTN acts last on every post-flop street, providing consistent information advantage.', tags: ['l2', 'position', 'concept'], difficultyScore: 20 },
  { prompt: '6-max cash, 100bb. Folded to you SB with A6o (BB only left). Best play?', choices: ['Fold', 'Limp', 'Raise', 'Check'], correctAnswer: 'Raise', explanation: 'A6o heads-up vs BB is a profitable steal attempt from the SB.', tags: ['l2', 'position', 'sb-steal'], difficultyScore: 23 },
  { prompt: '6-max cash, 100bb. UTG opens. You are BB with 53o. Best play?', choices: ['Call', 'Raise', 'Fold', 'Limp'], correctAnswer: 'Fold', explanation: '53o vs a UTG open: too weak to defend. Poor equity and OOP on every street.', tags: ['l2', 'position', 'bb-fold'], difficultyScore: 22 },
  { prompt: '6-max cash, 100bb. Folded to you BTN with T8o. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Check'], correctAnswer: 'Raise', explanation: 'T8o on the BTN is a profitable open. Post-flop position makes marginal hands playable.', tags: ['l2', 'position', 'btn-open'], difficultyScore: 23 },
];

const level3PositionSeeds: MathSeed[] = [
  { prompt: 'Acting in position post-flop gives you which additional option?', choices: ['Mandatory bigger raise', 'Checking behind to control pot size', 'Seeing both hole cards first', 'Always last to bet pre-flop'], correctAnswer: 'Checking behind to control pot size', explanation: 'In position you can check behind on the turn to keep the pot small or take a free card.', tags: ['l3', 'position', 'concept'], difficultyScore: 31 },
  { prompt: '6-max cash, 100bb. Folded to you UTG with KJo. Best play?', choices: ['Fold', 'Raise', 'Limp', 'Call'], correctAnswer: 'Raise', explanation: 'KJo is a marginal but profitable UTG open in 6-max. It plays well against defense ranges.', tags: ['l3', 'position', 'utg-open'], difficultyScore: 32 },
  { prompt: '6-max cash, 100bb. HJ opens. You are BTN with Q4o. Best play?', choices: ['Call', '3-bet', 'Fold', 'Raise'], correctAnswer: 'Fold', explanation: 'Q4o vs HJ open from BTN is still a fold. Position helps, but not enough to rescue a weak hand.', tags: ['l3', 'position', 'btn-fold'], difficultyScore: 31 },
  { prompt: '6-max cash, 100bb. Folded to you CO with K8s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'K8s is a standard CO open with flush potential and solid equity.', tags: ['l3', 'position', 'co-open'], difficultyScore: 32 },
  { prompt: '6-max cash, 100bb. BTN opens. You are SB with 75s. Best play?', choices: ['Raise', '3-bet', 'Fold', 'Call'], correctAnswer: 'Fold', explanation: '75s from the SB vs BTN open is a fold. Being OOP all streets outweighs the speculative value.', tags: ['l3', 'position', 'sb-fold'], difficultyScore: 33 },
  { prompt: 'Why should your opening range from UTG be much tighter than from BTN?', choices: ['Bigger blind investment', 'UTG faces 5 opponents and is OOP post-flop', 'Card rank is lower UTG', 'Rake difference'], correctAnswer: 'UTG faces 5 opponents and is OOP post-flop', explanation: 'UTG opens vs up to 5 opponents who can call and have position on UTG post-flop.', tags: ['l3', 'position', 'concept'], difficultyScore: 30 },
  { prompt: '6-max cash, 100bb. Folded to you BTN with A2s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'A2s on BTN is a profitable open. Nut flush potential and position cover the weak kicker.', tags: ['l3', 'position', 'btn-open'], difficultyScore: 33 },
  { prompt: '6-max cash, 100bb. UTG opens. You are MP with T9o. Best play?', choices: ['Call', 'Raise', 'Fold', 'Limp'], correctAnswer: 'Fold', explanation: 'T9o vs UTG open from MP: you will be OOP post-flop and dominated by UTG range.', tags: ['l3', 'position', 'mp-fold'], difficultyScore: 33 },
];

const level4PositionSeeds: MathSeed[] = [
  { prompt: 'Being "out of position" (OOP) post-flop is a structural disadvantage because...?', choices: ['You pay more rake', 'You act first without seeing opponent response', 'Your cards are weaker', 'You cannot raise'], correctAnswer: 'You act first without seeing opponent response', explanation: 'Acting first forces you to bet or check without knowing what the in-position player will do.', tags: ['l4', 'position', 'concept'], difficultyScore: 41 },
  { prompt: '6-max cash, 100bb. Folded to you MP with A7s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'A7s is a profitable MP open with strong flush equity and an ace.', tags: ['l4', 'position', 'mp-open'], difficultyScore: 41 },
  { prompt: '6-max cash, 100bb. CO opens. You are BTN with J8o. Best play?', choices: ['Call', '3-bet', 'Raise', 'Fold'], correctAnswer: 'Fold', explanation: 'J8o vs CO open from BTN: not enough equity to call even in position vs a strong CO range.', tags: ['l4', 'position', 'btn-fold'], difficultyScore: 42 },
  { prompt: '6-max cash, 100bb. Folded to you UTG with A8o. Best play?', choices: ['Fold', 'Raise', 'Limp', 'Call'], correctAnswer: 'Fold', explanation: 'A8o from UTG is too weak. It is dominated by many UTG calling/3-betting hands.', tags: ['l4', 'position', 'utg-fold'], difficultyScore: 42 },
  { prompt: 'What makes the Small Blind the hardest position to play profitably?', choices: ['It costs 0.5bb', 'Acts last pre-flop but first on every post-flop street', 'Cannot 3-bet', 'Card discount applies'], correctAnswer: 'Acts last pre-flop but first on every post-flop street', explanation: 'SB acts last pre-flop (among blinds) but must act first on every post-flop street vs all opponents.', tags: ['l4', 'position', 'concept-sb'], difficultyScore: 41 },
  { prompt: '6-max cash, 100bb. Folded to you CO with J9s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'J9s is a standard CO open with straight and flush draws and good post-flop playability.', tags: ['l4', 'position', 'co-open'], difficultyScore: 43 },
  { prompt: '6-max cash, 100bb. BTN opens. SB folds. You are BB with Q6o. Best play?', choices: ['Raise', 'Call', 'Fold', 'Check'], correctAnswer: 'Fold', explanation: 'Q6o vs BTN open: poor equity and OOP post-flop. A losing defend even at the BB discount.', tags: ['l4', 'position', 'bb-fold'], difficultyScore: 43 },
  { prompt: 'Being in position vs opponents allows you to...?', choices: ['Limp more hands', 'Bluff and value-bet more effectively', 'Fold your way to profit', 'Call all bets freely'], correctAnswer: 'Bluff and value-bet more effectively', explanation: 'Position lets you control pot size and bluff or value-bet with complete information.', tags: ['l4', 'position', 'concept'], difficultyScore: 44 },
];

const level5PositionSeeds: MathSeed[] = [
  { prompt: '6-max cash, 100bb. Folded to you BTN with K4s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'K4s on BTN is profitable. Position and nut flush draws compensate for the weak kicker.', tags: ['l5', 'position', 'btn-open'], difficultyScore: 51 },
  { prompt: '6-max cash, 100bb. UTG opens. You are CO with A8o. Best play?', choices: ['Call', '3-bet', 'Fold', 'Raise'], correctAnswer: 'Fold', explanation: 'A8o vs UTG open from CO: dominated by UTG range and without enough equity to continue.', tags: ['l5', 'position', 'co-fold'], difficultyScore: 52 },
  { prompt: '6-max cash, 100bb. Folded to you MP with QTs. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'QTs is a profitable MP open with straight and flush potential and good connectivity.', tags: ['l5', 'position', 'mp-open'], difficultyScore: 51 },
  { prompt: '6-max cash, 100bb. CO opens. You are SB with 86o. Best play?', choices: ['Fold', 'Call', 'Raise', 'Limp'], correctAnswer: 'Fold', explanation: '86o OOP vs CO open is a clear fold. Weak hand plus positional disadvantage is a chip leak.', tags: ['l5', 'position', 'sb-fold'], difficultyScore: 52 },
  { prompt: '"Tight is right from early position, wide is fine from late position." Is this correct?', choices: ['Yes', 'No', 'Only in tournaments', 'Only deep-stacked'], correctAnswer: 'Yes', explanation: 'EP players face more opponents and are OOP post-flop; LP players have strong position advantages.', tags: ['l5', 'position', 'concept'], difficultyScore: 50 },
  { prompt: '6-max cash, 100bb. Folded to you UTG with ATo. Best play?', choices: ['Fold', 'Raise', 'Limp', 'Call'], correctAnswer: 'Raise', explanation: 'ATo is a standard UTG open in 6-max. It has strong Broadway equity vs EP calling ranges.', tags: ['l5', 'position', 'utg-open'], difficultyScore: 53 },
  { prompt: '6-max cash, 100bb. HJ opens. You are BTN with KJo. Best play?', choices: ['3-bet', 'Call', 'Fold', 'Shove'], correctAnswer: 'Call', explanation: 'KJo from BTN vs HJ open: call to see a flop in position. Not strong enough to 3-bet.', tags: ['l5', 'position', 'btn-call'], difficultyScore: 54 },
  { prompt: '6-max cash, 100bb. Folded to you CO with T8s. Best play?', choices: ['Fold', 'Limp', 'Raise', 'Call'], correctAnswer: 'Raise', explanation: 'T8s is a profitable CO open with suited connector playability and position advantage.', tags: ['l5', 'position', 'co-open'], difficultyScore: 52 },
];

function buildLevel(
  level: Level,
  actionSeeds: ActionSeed[],
  outsSeeds: MathSeed[],
  evSeeds: MathSeed[],
  positionSeeds: MathSeed[],
): ChallengeQuestion[] {
  return [
    ...actionSeeds.map((seed, i) => makeActionQuestion(level, i, seed)),
    ...outsSeeds.map((seed, i) => makeMathQuestion(level, i, 'outs', seed)),
    ...evSeeds.map((seed, i) => makeMathQuestion(level, i, 'ev', seed)),
    ...positionSeeds.map((seed, i) => makeMathQuestion(level, i, 'position', seed)),
  ];
}

export const tier1BeginnerQuestions: ChallengeQuestion[] = [
  ...buildLevel(1, level1ActionSeeds.slice(0, 20), [...level1OutsSeeds, ...level1ExtraOutsSeeds], level1EvSeeds, level1PositionSeeds),
  ...buildLevel(2, level2ActionSeeds.slice(0, 20), [...level2OutsSeeds, ...level2ExtraOutsSeeds], level2EvSeeds, level2PositionSeeds),
  ...buildLevel(3, level3ActionSeeds.slice(0, 20), [...level3OutsSeeds, ...level3ExtraOutsSeeds], level3EvSeeds, level3PositionSeeds),
  ...buildLevel(4, level4ActionSeeds.slice(0, 20), [...level4OutsSeeds, ...level4ExtraOutsSeeds], level4EvSeeds, level4PositionSeeds),
  ...buildLevel(5, level5ActionSeeds.slice(0, 20), [...level5OutsSeeds, ...level5ExtraOutsSeeds], level5EvSeeds, level5PositionSeeds),
];

export function getTier1ByLevel(level: Level): ChallengeQuestion[] {
  return tier1BeginnerQuestions.filter((q) => q.level === level);
}

export function getTier1ByCategory(category: ChallengeCategory): ChallengeQuestion[] {
  return tier1BeginnerQuestions.filter((q) => q.category === category);
}
