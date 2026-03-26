// TC092 — Tier 3 / Grinder: now sources from the auto-generated bank (TC090.5).
// The prior hand-authored bank (250 inline JSON questions) is superseded by this.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { generatedGrinderQuestions } from './generated/generatedGrinderQuestions';

export const tier3Questions: ChallengeQuestion[] = generatedGrinderQuestions;
