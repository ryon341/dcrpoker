// ─── TC090.5 — Position Question Generator ────────────────────────────────────
// Generates position-knowledge questions from a curated pool.
// Used for Beginner and Apprentice tiers.

import type { TierKey, GeneratedQuestion } from './generatorTypes';
import { TIER_DIFFICULTY_ENVELOPES, TIER_KEY_TO_CHALLENGE_TIER, TIER_KEY_TO_INDEX } from './generatorConfig';
import { POSITION_QUESTIONS } from './scenarioPools';

type RngFn = () => number;

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

/** Generate `count` position questions for the given tier and level. */
export function generatePositionQuestions(
  tier: TierKey,
  level: 1 | 2 | 3 | 4 | 5,
  count: number,
  startSeq: number,
  rng: RngFn,
): GeneratedQuestion[] {
  const diffRange = TIER_DIFFICULTY_ENVELOPES[tier];
  const tierStr = TIER_KEY_TO_CHALLENGE_TIER[tier];
  const tierIdx = TIER_KEY_TO_INDEX[tier];

  // Shuffle the pool and take unique questions
  const shuffled = rngShuffle([...POSITION_QUESTIONS], rng);

  const questions: GeneratedQuestion[] = [];
  const seenPrompts = new Set<string>();
  let seq = startSeq;

  for (const q of shuffled) {
    if (questions.length >= count) break;

    const fingerprint = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenPrompts.has(fingerprint)) continue;
    seenPrompts.add(fingerprint);

    const diffScore = rngInt(diffRange.min, diffRange.max, rng);
    const id = `gen-${tierStr}-l${level}-position-${String(seq).padStart(3, '0')}`;
    seq++;

    questions.push({
      id,
      tier: tierStr,
      tierIndex: tierIdx,
      level,
      category: 'position',
      prompt: q.prompt,
      explanation: q.explanation,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      tags: [`l${level}`, 'position', ...q.tags],
      difficultyScore: diffScore,
    });
  }

  return questions;
}
