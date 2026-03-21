// ─── Challenge type definitions for DCR Poker Challenge (TC051) ──────────────

export type DifficultyTier = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';

export type Challenge = {
  id: string;
  question: string;
  heroHand: [string, string];
  villainHand: [string, string];
  correctAnswer: 'yes' | 'no';
  explanation: string;
  runout: [string, string, string, string, string];
  heroWins: boolean;
  difficulty: DifficultyTier;
  tags: string[];
};
