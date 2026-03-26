// ─── TC090.5 — Generator Type Definitions ────────────────────────────────────
// Source-of-truth types for the poker challenge question generator engine.

export type TierKey =
  | 'Beginner'
  | 'Apprentice'
  | 'Grinder'
  | 'ChipLeader'
  | 'Master';

export type GeneratorCategory =
  | 'action'
  | 'ev'
  | 'outs'
  | 'position'
  | 'pressure';

export type Position =
  | 'UTG'
  | 'MP'
  | 'HJ'
  | 'CO'
  | 'BTN'
  | 'SB'
  | 'BB';

export type StackDepthBucket =
  | 'short'
  | 'medium'
  | 'deep';

export type PriorAction =
  | 'folded_to_hero'
  | 'limp_before_hero'
  | 'single_raise_before_hero'
  | 'hero_facing_3bet'
  | 'single_caller_before_hero';

export type ActionScenario =
  | 'open_spot'
  | 'blind_vs_blind'
  | 'facing_open'
  | 'facing_3bet'
  | 'squeeze_spot'
  | 'iso_raise'
  | 'facing_min_raise'
  | 'late_position_pressure';

export type DrawType =
  | 'flush'
  | 'oesd'
  | 'gutshot'
  | 'two_overcards'
  | 'flush_plus_overcard'
  | 'flush_plus_two_overcards'
  | 'pair_plus_flush'
  | 'pair_plus_oesd'
  | 'oesd_flush'
  | 'gutshot_plus_overcard'
  | 'monster_combo';

export type GeneratorQuestionSeed = {
  tier: TierKey;
  category: GeneratorCategory;
  heroPosition?: Position;
  villainPosition?: Position;
  stackDepthBb?: number;
  hand: string;
  priorAction?: PriorAction;
  potSize?: number;
  callSize?: number;
  board?: string[];
  outs?: number;
  correctAnswer: string | number;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type GeneratorRunOptions = {
  /** Deterministic seed — same seed produces the same bank. */
  seed: string;
  /** Which tiers to generate. Defaults to all five. */
  tiers?: TierKey[];
  /** Output directory for generated files. */
  outputDir?: string;
  /** Whether to log progress. */
  verbose?: boolean;
};

export type GeneratedQuestion = {
  id: string;
  tier: string;
  tierIndex: number;
  level: 1 | 2 | 3 | 4 | 5;
  category: GeneratorCategory;
  prompt: string;
  explanation: string;
  correctAction?: 'fold' | 'call' | 'raise';
  heroPosition?: string;
  effectiveStackBb?: number;
  choices?: string[];
  correctAnswer?: string;
  tags: string[];
  difficultyScore: number;
};

export type GeneratorStats = {
  tier: TierKey;
  total: number;
  byCategory: Record<GeneratorCategory, number>;
  byLevel: Record<1 | 2 | 3 | 4 | 5, number>;
  duplicatesRejected: number;
};
