// ─── TC090.5 — Generator Entry Point ─────────────────────────────────────────
// Public API for the poker-challenge question generation pipeline.
//
// Usage:
//   import { runGenerator } from './generator';
//   runGenerator({ seed: 'DCR-001', tiers: ['Beginner', 'Apprentice', 'Grinder'] });

export type { TierKey, GeneratorCategory, GeneratorRunOptions, GeneratedQuestion, GeneratorStats } from './generatorTypes';
export { TIER_GENERATION_TARGETS, TIER_DIFFICULTY_ENVELOPES } from './generatorConfig';
export { buildTierQuestionBank, buildAllTierBanks } from './buildTierQuestionBank';
export { dedupeByPrompt, filterNearDuplicates } from './dedupeQuestions';
export { writeTierFile, formatQuestionBankFile } from './exportQuestionBank';

import type { GeneratorRunOptions, TierKey } from './generatorTypes';
import { buildAllTierBanks } from './buildTierQuestionBank';
import { writeTierFile }     from './exportQuestionBank';
import { TIER_GENERATION_TARGETS } from './generatorConfig';

/**
 * Run the full generation pipeline.
 * Builds question banks for all requested tiers and writes .ts files to
 * `app/src/components/poker-challenge/data/generated/`.
 */
export function runGenerator(options: GeneratorRunOptions): void {
  const tiers = options.tiers ?? (['Beginner', 'Apprentice', 'Grinder', 'ChipLeader', 'Master'] as TierKey[]);
  console.log(`[runGenerator] seed=${options.seed} tiers=${tiers.join(', ')}`);

  const banks = buildAllTierBanks({ ...options, tiers });

  for (const tier of tiers) {
    const questions = banks.get(tier);
    if (!questions) continue;

    const targets = TIER_GENERATION_TARGETS[tier];
    const total   = Object.values(targets).reduce((s, n) => s + n, 0);

    writeTierFile(tier, questions, options.seed);

    // Print per-category verification
    const byCat: Record<string, number> = {};
    for (const q of questions) byCat[q.category] = (byCat[q.category] ?? 0) + 1;
    console.log(`[verify] ${tier}: total=${questions.length}/${total}`, byCat);
  }

  console.log('[runGenerator] Done.');
}
