// ─── TC092/TC093/TC094 — Normalized question bank registry ──────────────────────
// Single source of truth that maps every ChallengeTier to its authoritative
// ChallengeQuestion[]. All 5 tiers now use auto-generated banks (TC090.5–TC094).

import type { ChallengeQuestion, ChallengeTier } from '../challengeQuestionTypes';
import { generatedBeginnerQuestions }    from './generated/generatedBeginnerQuestions';
import { generatedApprenticeQuestions }  from './generated/generatedApprenticeQuestions';
import { generatedGrinderQuestions }     from './generated/generatedGrinderQuestions';
import { generatedChipLeaderQuestions }  from './generated/generatedChipLeaderQuestions';
import { generatedMasterQuestions }      from './generated/generatedMasterQuestions';

/** All generated banks re-exported for direct access */
export {
  generatedBeginnerQuestions,
  generatedApprenticeQuestions,
  generatedGrinderQuestions,
  generatedChipLeaderQuestions,
  generatedMasterQuestions,
};

/** Full registry: ChallengeTier → ChallengeQuestion[] */
export const CHALLENGE_BANKS: Record<ChallengeTier, ChallengeQuestion[]> = {
  beginner:    generatedBeginnerQuestions,
  apprentice:  generatedApprenticeQuestions,
  grinder:     generatedGrinderQuestions,
  chip_leader: generatedChipLeaderQuestions,
  master:      generatedMasterQuestions,
};

// ── Validation types + helpers (TC096) ───────────────────────────────────────

/** Rich per-tier bank validation result (TC096). */
export type TierBankValidationResult = {
  tier: string;
  total: number;
  expectedTotal: number;
  perLevelCounts: Record<number, number>;
  expectedPerLevel: number;
  categoryCounts: Record<string, number>;
  duplicateIds: string[];
  duplicatePrompts: string[];
  malformedQuestionIds: string[];
  passed: boolean;
  errors: string[];
  warnings: string[];
};

/** Aggregate result returned by validateAllChallengeBanks(). */
export type AllChallengeBanksValidationResult = {
  passed: boolean;
  totalBanks: number;
  passedBanks: number;
  failedBanks: number;
  results: TierBankValidationResult[];
};

const VALID_CATEGORIES: ChallengeQuestion['category'][] = [
  'action', 'outs', 'ev', 'position', 'pressure',
];

const TIER_DISPLAY_NAMES: Record<ChallengeTier, string> = {
  beginner:    'Beginner',
  apprentice:  'Apprentice',
  grinder:     'Grinder',
  chip_leader: 'Chip Leader',
  master:      'Master',
};

/**
 * Validate a question bank against structural constraints (TC096 expanded).
 *
 * Checks (errors = fail, warnings = informational):
 *  - exact total count
 *  - 50 questions per level (levels 1–5 only)
 *  - no levels outside 1–5
 *  - all categories within allowed set
 *  - unique question IDs
 *  - unique prompts (normalized)
 *  - required fields present per category
 */
export function validateTierBank(
  tierKey: string,
  questions: ChallengeQuestion[],
  opts: {
    total?: number;
    perLevel?: number;
    categories?: ChallengeQuestion['category'][];
  } = {},
): TierBankValidationResult {
  const expectedTotal    = opts.total    ?? 250;
  const expectedPerLevel = opts.perLevel ?? 50;
  const allowedCats      = opts.categories ?? VALID_CATEGORIES;
  const errors: string[]   = [];
  const warnings: string[] = [];

  // ── Total count ──────────────────────────────────────────────────────────────
  if (questions.length !== expectedTotal) {
    errors.push(`Expected ${expectedTotal} questions, found ${questions.length}.`);
  }

  // ── Category counts + unknown-category check ─────────────────────────────────
  const categoryCounts: Record<string, number> = {};
  for (const q of questions) {
    categoryCounts[q.category] = (categoryCounts[q.category] ?? 0) + 1;
    if (!allowedCats.includes(q.category as ChallengeQuestion['category'])) {
      errors.push(`Question ${q.id} has unexpected category: "${q.category}".`);
    }
  }

  // ── Duplicate IDs ─────────────────────────────────────────────────────────────
  const idSet = new Set<string>();
  const duplicateIds: string[] = [];
  for (const q of questions) {
    if (idSet.has(q.id)) {
      duplicateIds.push(q.id);
      errors.push(`Duplicate id: "${q.id}".`);
    }
    idSet.add(q.id);
  }

  // ── Per-level counts ──────────────────────────────────────────────────────────
  const perLevelCounts: Record<number, number> = {};
  for (const q of questions) {
    perLevelCounts[q.level] = (perLevelCounts[q.level] ?? 0) + 1;
  }
  for (let lvl = 1; lvl <= 5; lvl++) {
    const count = perLevelCounts[lvl] ?? 0;
    if (count !== expectedPerLevel) {
      errors.push(`Level ${lvl}: expected ${expectedPerLevel} questions, found ${count}.`);
    }
  }
  for (const lvl of Object.keys(perLevelCounts).map(Number)) {
    if (lvl < 1 || lvl > 5) {
      errors.push(`Unexpected level value ${lvl} found in bank.`);
    }
  }

  // ── Duplicate prompts (normalized) ───────────────────────────────────────────
  const promptMap = new Map<string, string>(); // normalized → first id
  const duplicatePrompts: string[] = [];
  for (const q of questions) {
    const norm = (q.prompt ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (norm.length === 0) continue;
    if (promptMap.has(norm)) {
      duplicatePrompts.push(q.id);
      warnings.push(`Duplicate prompt for id "${q.id}" (matches "${promptMap.get(norm)}").`);
    } else {
      promptMap.set(norm, q.id);
    }
  }

  // ── Malformed question check ──────────────────────────────────────────────────
  const malformedQuestionIds: string[] = [];
  for (const q of questions) {
    const issues: string[] = [];
    if (!q.id || q.id.trim() === '')              issues.push('missing id');
    if (!q.prompt || q.prompt.trim() === '')       issues.push('missing prompt');
    if (!q.tier)                                   issues.push('missing tier');
    if (q.level == null || q.level < 1 || q.level > 5) issues.push('invalid level');
    if (!q.category)                               issues.push('missing category');
    if (q.category === 'action' && !q.correctAction) {
      issues.push('action: missing correctAction');
    }
    if (q.category !== 'action' && (!q.choices || q.choices.length === 0)) {
      issues.push(`${q.category}: missing choices`);
    }
    if (q.category !== 'action' && !q.correctAnswer) {
      issues.push(`${q.category}: missing correctAnswer`);
    }
    if (issues.length > 0) {
      const qid = q.id ?? '<no-id>';
      malformedQuestionIds.push(qid);
      errors.push(`Malformed question "${qid}": ${issues.join(', ')}.`);
    }
  }

  return {
    tier: tierKey,
    total: questions.length,
    expectedTotal,
    perLevelCounts,
    expectedPerLevel,
    categoryCounts,
    duplicateIds,
    duplicatePrompts,
    malformedQuestionIds,
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/** Reviewed-bank depletion validation result (TC098). */
export type ReviewedBanksValidationResult = {
  passed: boolean;
  results: Array<{
    tier: string;
    perLevelCounts: Record<number, number>;
    depletionErrors: string[];
    depletionWarnings: string[];
  }>;
};

const DEPLETION_MIN_ERROR   = 40;
const DEPLETION_MIN_WARNING = 45;

/**
 * Validate reviewed runtime banks for dangerous depletion caused by quarantine.
 *
 * Rules (after TC098 review layer applied):
 *  - warning  if any level drops below 45 questions
 *  - error    if any level drops below 40 questions
 *
 * Pass reviewed banks (e.g. from tierQuestionBanks) — NOT raw CHALLENGE_BANKS.
 */
export function validateReviewedBanks(
  reviewedBanks: Record<ChallengeTier, ChallengeQuestion[]>,
): ReviewedBanksValidationResult {
  const results: ReviewedBanksValidationResult['results'] = [];
  let passed = true;

  for (const [tier, questions] of Object.entries(reviewedBanks) as [ChallengeTier, ChallengeQuestion[]][]) {
    const perLevelCounts: Record<number, number> = {};
    for (const q of questions) {
      perLevelCounts[q.level] = (perLevelCounts[q.level] ?? 0) + 1;
    }

    const depletionErrors: string[]   = [];
    const depletionWarnings: string[] = [];

    for (let lvl = 1; lvl <= 5; lvl++) {
      const count = perLevelCounts[lvl] ?? 0;
      if (count < DEPLETION_MIN_ERROR) {
        depletionErrors.push(`${tier} level ${lvl}: only ${count} questions (minimum ${DEPLETION_MIN_ERROR}).`);
        passed = false;
      } else if (count < DEPLETION_MIN_WARNING) {
        depletionWarnings.push(`${tier} level ${lvl}: ${count} questions (below safe threshold ${DEPLETION_MIN_WARNING}).`);
      }
    }

    results.push({ tier, perLevelCounts, depletionErrors, depletionWarnings });
  }

  return { passed, results };
}

/**
 * Run validateTierBank() across all 5 generated banks and return an aggregate
 * result (TC096).
 */
export function validateAllChallengeBanks(): AllChallengeBanksValidationResult {
  const results = (Object.keys(CHALLENGE_BANKS) as ChallengeTier[]).map(tier =>
    validateTierBank(TIER_DISPLAY_NAMES[tier], CHALLENGE_BANKS[tier]),
  );
  const passedBanks = results.filter(r => r.passed).length;
  return {
    passed:     passedBanks === results.length,
    totalBanks: results.length,
    passedBanks,
    failedBanks: results.length - passedBanks,
    results,
  };
}
