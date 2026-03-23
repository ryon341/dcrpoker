// TC084 — Tier 2 / Apprentice question bank re-export
// The authoritative source is tier2ApprenticeQuestions.ts.
// This file keeps the legacy export name for backward compatibility.
import type { ChallengeQuestion } from '../challengeQuestionTypes';
import { tier2ApprenticeQuestions } from './tier2ApprenticeQuestions';

export const tier2Questions: ChallengeQuestion[] = tier2ApprenticeQuestions;
