// TC092 — Tier 1 / Beginner: now sources from the auto-generated bank (TC090.5).
// The hand-authored bank (tier1BeginnerQuestions) is retained for reference.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { generatedBeginnerQuestions } from './generated/generatedBeginnerQuestions';

export const tier1Questions: ChallengeQuestion[] = generatedBeginnerQuestions;
