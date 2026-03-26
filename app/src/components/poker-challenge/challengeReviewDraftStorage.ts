// ─── TC099 — Review Draft Storage ────────────────────────────────────────────
// AsyncStorage-backed persistence for in-progress question review drafts.
// Drafts are the mutable editing layer; the checked-in registry is immutable.
// Call getMergedReviewRegistry() to get the combined live+draft registry.

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  QUESTION_REVIEW_REGISTRY,
  type ReviewedQuestionEntry,
  type QuestionReviewStatus,
} from './challengeQuestionReviewRegistry';
import type { ChallengeQuestion } from './challengeQuestionTypes';

const STORAGE_KEY = 'dcr_review_drafts_v1';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Editable draft for a single question in the review surface. */
export type ReviewDraftEntry = {
  questionId: string;
  status: QuestionReviewStatus;
  tier: string;
  category: string;
  reason: string;
  notes?: string;
  /**
   * Replacement question encoded as a JSON string.
   * The review surface validates this on save.
   */
  replacementQuestionJson?: string;
  /** ISO-8601 timestamp of last edit. */
  updatedAt: string;
};

// ── I/O ───────────────────────────────────────────────────────────────────────

async function loadRaw(): Promise<Record<string, ReviewDraftEntry>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewDraftEntry>) : {};
  } catch {
    return {};
  }
}

async function saveRaw(drafts: Record<string, ReviewDraftEntry>): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Load all saved drafts (keyed by questionId). */
export async function loadReviewDrafts(): Promise<Record<string, ReviewDraftEntry>> {
  return loadRaw();
}

/** Save or update the draft for a single question. */
export async function saveReviewDraft(entry: ReviewDraftEntry): Promise<void> {
  const drafts = await loadRaw();
  drafts[entry.questionId] = { ...entry, updatedAt: new Date().toISOString() };
  await saveRaw(drafts);
}

/** Remove the draft for a single question (revert to checked-in registry state). */
export async function removeReviewDraft(questionId: string): Promise<void> {
  const drafts = await loadRaw();
  delete drafts[questionId];
  await saveRaw(drafts);
}

/** Erase all drafts. */
export async function clearReviewDrafts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Merge the checked-in QUESTION_REVIEW_REGISTRY with the mutable draft layer.
 * Drafts override checked-in entries for the same questionId.
 * Returns a plain Record<string, ReviewedQuestionEntry> suitable for passing
 * to applyQuestionReviewLayer().
 */
export function getMergedReviewRegistry(
  drafts: Record<string, ReviewDraftEntry>,
): Record<string, ReviewedQuestionEntry> {
  const merged: Record<string, ReviewedQuestionEntry> = { ...QUESTION_REVIEW_REGISTRY };

  for (const [id, draft] of Object.entries(drafts)) {
    let replacementQuestion: ChallengeQuestion | undefined;
    if (draft.replacementQuestionJson) {
      try {
        replacementQuestion = JSON.parse(draft.replacementQuestionJson) as ChallengeQuestion;
      } catch {
        // Invalid JSON — treat as quarantined (no replacement)
        replacementQuestion = undefined;
      }
    }
    merged[id] = {
      questionId: draft.questionId,
      status:     draft.status,
      tier:       draft.tier,
      category:   draft.category,
      reason:     draft.reason,
      notes:      draft.notes,
      replacementQuestion,
    };
  }

  return merged;
}
