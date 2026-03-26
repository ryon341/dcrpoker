// ─── TC098 — Question Review / Quarantine Registry ───────────────────────────
// Lightweight quality-control layer between generated banks and runtime play.
// Quarantine bad questions by ID, register optional replacements, and apply
// the review filter centrally via applyQuestionReviewLayer / applyReviewToAllBanks.
//
// How to use:
//   1. Add an entry to QUESTION_REVIEW_REGISTRY keyed by original questionId.
//   2. Set status: 'quarantined' to remove, or 'overridden' with a full
//      replacementQuestion to substitute a corrected version.
//   3. The app applies the layer automatically on startup via tierQuestionBanks.ts.
//   4. Run printQuestionReviewReport() in dev to see the current quarantine state.

import type { ChallengeQuestion, ChallengeTier } from './challengeQuestionTypes';

// ── Types ─────────────────────────────────────────────────────────────────────

export type QuestionReviewStatus = 'active' | 'quarantined' | 'overridden';

export type ReviewedQuestionEntry = {
  /** The ID of the question in the generated bank. */
  questionId: string;
  status: QuestionReviewStatus;
  /** Tier of the original question — used for depletion tracking. */
  tier: string;
  /** Category of the original question — used for reporting. */
  category: string;
  /** Why this question was flagged. */
  reason: string;
  /** Optional free-text notes. */
  notes?: string;
  /**
   * Replacement question for 'overridden' entries.
   * Must pass the compatibility guard (correct id/tier/level/category/answers).
   * If omitted or invalid, the entry is treated as quarantined and a dev warning fires.
   */
  replacementQuestion?: ChallengeQuestion;
};

// ── Registry ──────────────────────────────────────────────────────────────────
//
// Key   = original questionId from the generated bank.
// Value = ReviewedQuestionEntry describing what to do with it.
//
// QA STUBS (IDs below do not exist in the generated banks):
//   These stubs prove the pipeline is wired. Replace with real IDs from a
//   calibration report when actual bad questions are identified.

export const QUESTION_REVIEW_REGISTRY: Record<string, ReviewedQuestionEntry> = {

  // ── QA stub: quarantine ────────────────────────────────────────────────────
  // Purpose: Confirms the quarantine filter runs. Any question with this ID
  // will be removed from the runtime bank. Since this ID does not exist in
  // any generated bank, the banks are unaffected — it just proves the filter
  // executes without error.
  'qa-stub-quarantine-001': {
    questionId: 'qa-stub-quarantine-001',
    status: 'quarantined',
    tier: 'beginner',
    category: 'action',
    reason: 'QA stub — confirms the quarantine filter is active. Replace with a real ID when needed.',
  },

  // ── QA stub: override with replacement ────────────────────────────────────
  // Purpose: Confirms replacement injection runs. This ID does not exist in
  // any generated bank, so gameplay is unaffected — the replacement question
  // below is never actually inserted, validating that bank counts are stable.
  'qa-stub-override-001': {
    questionId: 'qa-stub-override-001',
    status: 'overridden',
    tier: 'beginner',
    category: 'outs',
    reason: 'QA stub — confirms replacement serving logic is active. Replace with a real ID when needed.',
    replacementQuestion: {
      id: 'qa-stub-override-001-replacement',
      tier: 'beginner',
      tierIndex: 1,
      level: 1,
      category: 'outs',
      prompt: 'You flop a flush draw with no other made hand. How many outs do you have to make your flush?',
      explanation: '9 cards of the same suit remain in the deck once your 2 + the 2 on the flop are accounted for (13 − 4 = 9), giving you 9 outs.',
      choices: ['4', '6', '9', '12'],
      correctAnswer: '9',
      tags: ['l1', 'outs', 'flush', 'qa-stub'],
      difficultyScore: 15,
    },
  },

};

// ── Compatibility guard ───────────────────────────────────────────────────────

/**
 * Returns true if `q` satisfies the minimum fields required by ChallengeQuestion
 * and the category-specific answer contract.
 */
export function isValidReplacementQuestion(q: unknown): q is ChallengeQuestion {
  if (!q || typeof q !== 'object') return false;
  const c = q as Partial<ChallengeQuestion>;
  if (typeof c.id !== 'string' || c.id.trim() === '') return false;
  if (typeof c.tier !== 'string' || c.tier.trim() === '') return false;
  if (typeof c.level !== 'number' || c.level < 1 || c.level > 5) return false;
  if (typeof c.category !== 'string' || c.category.trim() === '') return false;
  if (typeof c.prompt !== 'string' || c.prompt.trim() === '') return false;
  if (typeof c.explanation !== 'string' || c.explanation.trim() === '') return false;
  if (!Array.isArray(c.tags)) return false;
  // Category-specific answer contract
  if (c.category === 'action') {
    if (!c.correctAction) return false;
  } else {
    if (!Array.isArray(c.choices) || (c.choices as string[]).length === 0) return false;
    if (typeof c.correctAnswer !== 'string' || c.correctAnswer.trim() === '') return false;
  }
  return true;
}

// ── Review layer helpers ──────────────────────────────────────────────────────

/**
 * Apply the review registry to a single bank:
 *  - active      → unchanged
 *  - quarantined → excluded
 *  - overridden with valid replacement → replacement is served instead
 *  - overridden with missing / invalid replacement → excluded + dev warning
 */
export function applyQuestionReviewLayer(bank: ChallengeQuestion[]): ChallengeQuestion[] {
  const result: ChallengeQuestion[] = [];

  for (const q of bank) {
    const entry = QUESTION_REVIEW_REGISTRY[q.id];

    // Not in registry → pass through
    if (!entry || entry.status === 'active') {
      result.push(q);
      continue;
    }

    if (entry.status === 'quarantined') {
      if (__DEV__) {
        console.log(`[ReviewLayer] Quarantined: "${q.id}" (${entry.tier}/${entry.category}) — ${entry.reason}`);
      }
      continue; // excluded
    }

    if (entry.status === 'overridden') {
      const rep = entry.replacementQuestion;
      if (rep && isValidReplacementQuestion(rep)) {
        if (__DEV__) {
          console.log(`[ReviewLayer] Overridden: "${q.id}" → "${rep.id}" (${entry.tier}/${entry.category})`);
        }
        result.push(rep);
      } else {
        if (__DEV__) {
          console.warn(`[ReviewLayer] Override "${q.id}" has no valid replacement — treating as quarantined. Reason: ${entry.reason}`);
        }
        // Fall through without pushing — excluded
      }
    }
  }

  return result;
}

/**
 * Apply the review registry to all tier banks at once. Returns a new Record
 * with every tier's bank filtered and patched. Used in tierQuestionBanks.ts
 * to build the reviewed runtime banks from the raw generated sources.
 */
export function applyReviewToAllBanks(
  banks: Record<ChallengeTier, ChallengeQuestion[]>,
): Record<ChallengeTier, ChallengeQuestion[]> {
  const reviewed = {} as Record<ChallengeTier, ChallengeQuestion[]>;
  for (const tier of Object.keys(banks) as ChallengeTier[]) {
    reviewed[tier] = applyQuestionReviewLayer(banks[tier]);
  }
  return reviewed;
}

/**
 * Look up a reviewed question by its ID in the post-review bank.
 * Returns null if the question was quarantined or not found.
 */
export function getReviewedQuestionById(
  id: string,
  reviewedBank: ChallengeQuestion[],
): ChallengeQuestion | null {
  return reviewedBank.find(q => q.id === id) ?? null;
}
