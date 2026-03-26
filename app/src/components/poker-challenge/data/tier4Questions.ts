// TC093 — Tier 4 / Chip Leader: now sources from the auto-generated bank.
// The prior hand-authored bank (250 inline JSON questions) is superseded by this.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { generatedChipLeaderQuestions } from './generated/generatedChipLeaderQuestions';

export const tier4Questions: ChallengeQuestion[] = generatedChipLeaderQuestions;
