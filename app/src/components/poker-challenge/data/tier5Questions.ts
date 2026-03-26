// TC094 -- Tier 5 / Master: now sources from the auto-generated bank.
// The prior hand-authored bank (250 inline JSON questions) is superseded by this.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { generatedMasterQuestions } from './generated/generatedMasterQuestions';

export const tier5Questions: ChallengeQuestion[] = generatedMasterQuestions;
