// TC092 — Tier 2 / Apprentice: now sources from the auto-generated bank (TC090.5).
// The hand-authored bank (tier2ApprenticeQuestions) is retained for reference.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { generatedApprenticeQuestions } from './generated/generatedApprenticeQuestions';

export const tier2Questions: ChallengeQuestion[] = generatedApprenticeQuestions;
