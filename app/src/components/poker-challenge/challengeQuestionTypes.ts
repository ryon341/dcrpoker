// ─── Extended challenge question types (TC069) ────────────────────────────────
// Supports Tier 1–5 progression with action, outs, and EV question categories.
// Coexists with the existing `Challenge` type (TC051/TC068) used for card-reveal
// gameplay — this type is for the question-bank progression system.

import type { ChallengeAction } from './challengeTypes';

export type ChallengeTier     = 'beginner' | 'apprentice' | 'grinder' | 'chip_leader' | 'master';
export type ChallengeCategory = 'action' | 'outs' | 'ev';

export type ChallengeQuestion = {
  id: string;
  tier: ChallengeTier;
  /** 1-based index within the tier (1 = beginner, 5 = master) */
  tierIndex: 1 | 2 | 3 | 4 | 5;
  /** Level within the tier (1–5) */
  level: 1 | 2 | 3 | 4 | 5;
  category: ChallengeCategory;

  /** Display prompt — describes the situation only; no "what should you do?" */
  prompt: string;
  explanation: string;

  // ── Action question fields ─────────────────────────────────────────────────
  correctAction?: ChallengeAction;
  heroPosition?: string;
  effectiveStackBb?: number;

  // ── Math / outs / EV question fields ──────────────────────────────────────
  choices?: string[];
  correctAnswer?: string;

  tags: string[];
  /** 1–100 relative difficulty score within the tier */
  difficultyScore: number;
};
