// ─── TC090.5 — Tier Question Bank Builder ─────────────────────────────────────
// Orchestrates all sub-generators, distributes questions across 5 levels,
// and deduplicates by prompt fingerprint.

import type { TierKey, GeneratedQuestion, GeneratorRunOptions } from './generatorTypes';
import { TIER_GENERATION_TARGETS, TIER_LEVEL_DISTRIBUTION } from './generatorConfig';
import { generateActionQuestions }   from './actionGenerator';
import { generateEVQuestions }       from './evGenerator';
import { generateOutsQuestions }     from './outsGenerator';
import { generatePositionQuestions } from './positionGenerator';
import { generatePressureQuestions } from './pressureGenerator';
import { dedupeByPrompt }            from './dedupeQuestions';

type RngFn = () => number;

function mulberry32(seed: number): RngFn {
  let state = seed;
  return function (): number {
    state = (state + 0x6D2B79F5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/**
 * Build a full question bank for a single tier.
 * Returns exactly the number of questions matching TIER_GENERATION_TARGETS[tier].
 */
export function buildTierQuestionBank(
  tier: TierKey,
  seed: string,
): GeneratedQuestion[] {
  const rng = mulberry32(seedFromString(`${seed}-${tier}`));
  const targets = TIER_GENERATION_TARGETS[tier];
  const levelDist = TIER_LEVEL_DISTRIBUTION[tier];

  const allQuestions: GeneratedQuestion[] = [];
  let globalSeq = 1;

  for (let level = 1 as 1 | 2 | 3 | 4 | 5; level <= 5; level++) {
    const lc = levelDist as Record<string, number>;

    if ((lc.action ?? 0) > 0) {
      const qs = generateActionQuestions(tier, level, lc.action, globalSeq, rng);
      allQuestions.push(...qs);
      globalSeq += qs.length;
    }
    if ((lc.ev ?? 0) > 0) {
      const qs = generateEVQuestions(tier, level, lc.ev, globalSeq, rng);
      allQuestions.push(...qs);
      globalSeq += qs.length;
    }
    if ((lc.outs ?? 0) > 0) {
      const qs = generateOutsQuestions(tier, level, lc.outs, globalSeq, rng);
      allQuestions.push(...qs);
      globalSeq += qs.length;
    }
    if ((lc.position ?? 0) > 0) {
      const qs = generatePositionQuestions(tier, level, lc.position, globalSeq, rng);
      allQuestions.push(...qs);
      globalSeq += qs.length;
    }
    if ((lc.pressure ?? 0) > 0) {
      const qs = generatePressureQuestions(tier, level, lc.pressure, globalSeq, rng);
      allQuestions.push(...qs);
      globalSeq += qs.length;
    }
  }

  // Deduplicate and verify counts
  const deduped = dedupeByPrompt(allQuestions);
  const totalTarget = Object.values(targets).reduce((sum, n) => sum + n, 0);
  if (deduped.length < totalTarget) {
    console.warn(
      `[buildTierQuestionBank] ${tier}: dedup reduced ${allQuestions.length} → ${deduped.length} ` +
        `(target ${totalTarget}). Increase generator pool size.`,
    );
  }

  return deduped.slice(0, totalTarget);
}

/**
 * Build question banks for all requested tiers, returning a map.
 */
export function buildAllTierBanks(
  options: GeneratorRunOptions,
): Map<TierKey, GeneratedQuestion[]> {
  const tiers = options.tiers ?? (['Beginner', 'Apprentice', 'Grinder', 'ChipLeader', 'Master'] as TierKey[]);
  const result = new Map<TierKey, GeneratedQuestion[]>();
  for (const tier of tiers) {
    console.log(`[buildAllTierBanks] Building ${tier}…`);
    result.set(tier, buildTierQuestionBank(tier, options.seed));
  }
  return result;
}
