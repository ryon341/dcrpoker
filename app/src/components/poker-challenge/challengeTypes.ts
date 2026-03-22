// ─── Challenge type definitions for DCR Poker Challenge (TC051/TC068) ─────────

export type DifficultyTier   = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';
export type ChallengeAction  = 'fold' | 'call' | 'raise';

export type Challenge = {
  id: string;
  /** Scenario description — no action question embedded. */
  scenario: string;
  heroPosition: string;
  effectiveStackBb: number;
  heroHand: [string, string];
  villainHand: [string, string];
  correctAction: ChallengeAction;
  explanation: string;
  runout: [string, string, string, string, string];
  heroWins: boolean;
  difficulty: DifficultyTier;
  tags: string[];
};

/** Builds a compact display prompt from structured fields. */
export function buildChallengePrompt(c: Challenge): string {
  return `6-max cash game. ${c.effectiveStackBb}bb effective. ${c.scenario} You are ${c.heroPosition}.`;
}
