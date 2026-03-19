// Training Engine — question generators for Preflop Trainer and Odds Trainer
// Reuses preflopCharts (TC021) and oddsCalculator (TC022) — no logic duplication.

import { ChartConfig, Players, Position, StackDepth, getChart } from './preflopCharts';
import { calculateOdds } from './oddsCalculator';

// ─── helpers ───────────────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Preflop ───────────────────────────────────────────────────────────────────

export type PreflopAnswer = 'Raise' | 'Fold';

export interface PreflopQuestion {
  hand: string;
  position: Position;
  players: Players;
  stack: StackDepth;
  correct: PreflopAnswer;
}

const POSITIONS: readonly Position[]   = ['UTG', 'MP', 'CO', 'BTN'];
const STACKS:    readonly StackDepth[] = ['100bb', '40bb', '20bb'];
const PLAYER_TYPES: readonly Players[] = ['9max', '6max'];

export function generatePreflopQuestion(): PreflopQuestion {
  const position = pick(POSITIONS);
  const stack    = pick(STACKS);
  const players  = pick(PLAYER_TYPES);
  const config: ChartConfig = { gameType: 'cash', players, position, stack };

  const chart = getChart(config)!;
  const hands = Object.keys(chart);
  const hand  = pick(hands);

  const correct: PreflopAnswer = chart[hand] === 'raise' ? 'Raise' : 'Fold';
  return { hand, position, players, stack, correct };
}

export function getPreflopFeedback(q: PreflopQuestion, answer: PreflopAnswer): string {
  const { hand, position, players, stack, correct } = q;
  const playersLabel = players === '9max' ? '9-max' : '6-max';

  if (answer === correct) {
    return correct === 'Raise'
      ? `${hand} is a standard open raise from ${position} at ${stack} (${playersLabel}). It belongs to your RFI range.`
      : `${hand} is correctly folded from ${position} at ${stack} (${playersLabel}). The hand is outside the opening range here.`;
  } else {
    return correct === 'Raise'
      ? `${hand} should be raised from ${position} at ${stack} (${playersLabel}). It's part of your standard opening range in this spot.`
      : `${hand} should be folded from ${position} at ${stack} (${playersLabel}). It's too weak to open profitably from this position.`;
  }
}

// ─── Odds ──────────────────────────────────────────────────────────────────────

export interface OddsQuestion {
  outs: number;
  drawLabel: string;
  correctRiverPct: number; // nearest integer
  choices: number[];       // 4 sorted choices
  correctIndex: number;    // index into choices[]
}

const DRAW_POOL: ReadonlyArray<{ outs: number; label: string }> = [
  { outs: 2,  label: 'a backdoor flush draw' },
  { outs: 4,  label: 'a gutshot straight draw' },
  { outs: 5,  label: 'a pair trying to make two pair or trips' },
  { outs: 6,  label: 'two live overcards' },
  { outs: 8,  label: 'an open-ended straight draw' },
  { outs: 9,  label: 'a flush draw' },
  { outs: 10, label: 'a set drawing to a full house or quads' },
  { outs: 12, label: 'a combo draw (flush + gutshot)' },
  { outs: 15, label: 'a monster combo draw (flush + open-ended straight)' },
];

function buildDistractors(correctPct: number): number[] {
  // Candidate offsets — spread enough to be distinct but plausible
  const offsets = [12, 16, 20, 24, 28, 32, 36];
  const candidates: number[] = [];

  for (const d of offsets) {
    const above = correctPct + d;
    const below = correctPct - d;
    if (above <= 100) candidates.push(above);
    if (below >= 0)   candidates.push(below);
  }

  // Shuffle and pick 3 that are at least 8 apart from each other
  candidates.sort(() => Math.random() - 0.5);
  const chosen: number[] = [];
  for (const c of candidates) {
    if (chosen.length >= 3) break;
    if (chosen.every(x => Math.abs(x - c) >= 8) && c !== correctPct) {
      chosen.push(c);
    }
  }

  // Emergency fallback: simple +/- steps
  let step = 10;
  while (chosen.length < 3 && step <= 60) {
    const v = correctPct + step;
    const v2 = correctPct - step;
    if (v <= 100 && !chosen.includes(v) && v !== correctPct) chosen.push(v);
    if (chosen.length < 3 && v2 >= 0 && !chosen.includes(v2) && v2 !== correctPct) chosen.push(v2);
    step += 4;
  }

  return chosen.slice(0, 3);
}

export function generateOddsQuestion(): OddsQuestion {
  const { outs, label: drawLabel } = pick(DRAW_POOL);
  const result = calculateOdds(outs);
  const correctRiverPct = Math.round(result.riverPct);

  const distractors = buildDistractors(correctRiverPct);
  const allChoices  = [correctRiverPct, ...distractors];
  allChoices.sort((a, b) => a - b);

  const correctIndex = allChoices.indexOf(correctRiverPct);
  return { outs, drawLabel, correctRiverPct, choices: allChoices, correctIndex };
}

export function getOddsFeedback(q: OddsQuestion, isCorrect: boolean): string {
  const { outs, drawLabel, correctRiverPct } = q;
  const rule4 = outs * 4;

  if (isCorrect) {
    return `Correct! With ${outs} outs, you have ~${correctRiverPct}% to improve by the river. The Rule of 4 gives ${rule4}% as a quick estimate.`;
  } else {
    return `With ${outs} outs (${drawLabel}), your equity by the river is ~${correctRiverPct}%. Remember: Rule of 4 → ${outs} × 4 = ${rule4}%.`;
  }
}
