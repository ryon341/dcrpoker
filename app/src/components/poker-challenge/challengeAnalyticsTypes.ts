// ─── TC096 — Challenge analytics types ───────────────────────────────────────

/** One answered-question event recorded on every submit. */
export type ChallengeQuestionEvent = {
  /** The question's unique ID. */
  questionId: string;
  /** Tier display name (e.g. 'Beginner') or 'gauntlet' in gauntlet mode. */
  tier: string;
  /** Global challenge level (1–25) or 0 in gauntlet mode. */
  level: number;
  /** Question category: action | outs | ev | position | pressure. */
  category: string;
  /** Whether the player answered correctly. */
  correct: boolean;
  /** The answer the player selected. */
  selectedAnswer: string;
  /** The correct answer for this question. */
  correctAnswer: string;
  /** Score delta applied (positive = correct, negative = wrong). */
  scoreDelta: number;
  /** Which mode this question was answered in. */
  mode: 'challenge' | 'gauntlet';
  /** ISO-8601 timestamp of the answer. */
  timestamp: string;
};

/** Per-group accuracy stats used in the summary. */
export type CategoryStats = {
  answered: number;
  correct: number;
  /** Accuracy expressed as 0–100 integer. */
  accuracy: number;
};

/** Aggregate analytics summary with per-category, per-tier, and per-level breakdowns. */
export type ChallengeAnalyticsSummary = {
  totalAnswered: number;
  totalCorrect: number;
  /** Overall accuracy as 0–100 integer. */
  overallAccuracy: number;
  /** Accuracy breakdown by question category. */
  byCategory: Record<string, CategoryStats>;
  /** Accuracy breakdown by tier name. */
  byTier: Record<string, CategoryStats>;
  /** Accuracy breakdown by global level number. */
  byLevel: Record<number, CategoryStats>;
  /** Top 10 most-missed question IDs, highest miss count first. */
  topMissed: Array<{ questionId: string; missCount: number; attempts: number }>;
  /** Total events recorded in challenge mode. */
  challengeCount: number;
  /** Total events recorded in gauntlet mode. */
  gauntletCount: number;
};
