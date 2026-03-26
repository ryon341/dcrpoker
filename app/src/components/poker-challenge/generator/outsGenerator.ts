// ─── TC090.5 — Outs Question Generator ────────────────────────────────────────
// Generates outs-counting questions using curated draw-type pools with
// unique prompts per tier and level.

import type { TierKey, DrawType, GeneratedQuestion } from './generatorTypes';
import { TIER_DIFFICULTY_ENVELOPES, TIER_KEY_TO_CHALLENGE_TIER, TIER_KEY_TO_INDEX } from './generatorConfig';
import { DRAW_CONFIGS, getOutsPromptPool } from './scenarioPools';

type RngFn = () => number;

function rngChoice<T>(arr: readonly T[], rng: RngFn): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngInt(min: number, max: number, rng: RngFn): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function rngShuffle<T>(arr: T[], rng: RngFn): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Draw types allowed per tier (harder combos at higher tiers). */
const TIER_DRAW_TYPES: Record<TierKey, DrawType[]> = {
  Beginner:   ['flush', 'oesd', 'gutshot', 'two_overcards', 'flush_plus_overcard', 'flush_plus_two_overcards'],
  Apprentice: ['flush', 'oesd', 'gutshot', 'two_overcards', 'flush_plus_overcard', 'flush_plus_two_overcards', 'pair_plus_flush'],
  Grinder:    ['flush', 'oesd', 'gutshot', 'flush_plus_two_overcards', 'pair_plus_flush', 'pair_plus_oesd', 'oesd_flush'],
  ChipLeader: ['flush', 'oesd', 'flush_plus_two_overcards', 'pair_plus_flush', 'pair_plus_oesd', 'oesd_flush', 'gutshot_plus_overcard'],
  Master:     ['flush_plus_two_overcards', 'pair_plus_flush', 'pair_plus_oesd', 'oesd_flush', 'gutshot_plus_overcard', 'monster_combo'],
};

/** Generate `count` outs questions for the given tier and level. */
export function generateOutsQuestions(
  tier: TierKey,
  level: 1 | 2 | 3 | 4 | 5,
  count: number,
  startSeq: number,
  rng: RngFn,
): GeneratedQuestion[] {
  const drawTypes = TIER_DRAW_TYPES[tier];
  const diffRange = TIER_DIFFICULTY_ENVELOPES[tier];
  const tierStr = TIER_KEY_TO_CHALLENGE_TIER[tier];
  const tierIdx = TIER_KEY_TO_INDEX[tier];

  // Pre-build a flat pool of all available (drawType, promptText) combos
  const promptCandidates: Array<{ draw: DrawType; text: string }> = [];
  for (const draw of drawTypes) {
    const pool = getOutsPromptPool(draw);
    for (const text of pool) {
      promptCandidates.push({ draw, text });
    }
  }

  const shuffled = rngShuffle(promptCandidates, rng);

  const questions: GeneratedQuestion[] = [];
  const seenPrompts = new Set<string>();
  let seq = startSeq;
  let idx = 0;

  while (questions.length < count && idx < shuffled.length) {
    const { draw, text } = shuffled[idx];
    idx++;

    const fingerprint = text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenPrompts.has(fingerprint)) continue;
    seenPrompts.add(fingerprint);

    const config = DRAW_CONFIGS[draw];
    const correctAnswer = String(config.outs);

    // Build choice set: correct answer + 3 wrong options, shuffled
    const wrong = rngShuffle([...config.wrongOuts], rng).slice(0, 3).map(String);
    const choices = rngShuffle([correctAnswer, ...wrong], rng);

    const explanation = `In this simplified training model, that draw gives you ${config.outs} outs.`;
    const diffScore = rngInt(diffRange.min, diffRange.max, rng);
    const id = `gen-${tierStr}-l${level}-outs-${String(seq).padStart(3, '0')}`;
    seq++;

    questions.push({
      id,
      tier: tierStr,
      tierIndex: tierIdx,
      level,
      category: 'outs',
      prompt: text,
      explanation,
      choices,
      correctAnswer,
      tags: [`l${level}`, 'outs', 'draw_math', draw],
      difficultyScore: diffScore,
    });
  }

  return questions;
}
