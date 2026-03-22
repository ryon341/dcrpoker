import type { ChallengeQuestion, ChallengeTier } from '../challengeQuestionTypes';
import { tier1Questions } from './tier1Questions';
import { tier2Questions } from './tier2Questions';
import { tier3Questions } from './tier3Questions';
import { tier4Questions } from './tier4Questions';
import { tier5Questions } from './tier5Questions';

export const tierQuestionBanks: Record<ChallengeTier, ChallengeQuestion[]> = {
  beginner: tier1Questions,
  apprentice: tier2Questions,
  grinder: tier3Questions,
  chip_leader: tier4Questions,
  master: tier5Questions,
};

function clampGlobalLevel(globalLevel: number): number {
  if (!Number.isFinite(globalLevel)) return 1;
  return Math.max(1, Math.min(25, Math.trunc(globalLevel)));
}

export function getQuestionsForTier(tier: ChallengeTier): ChallengeQuestion[] {
  return tierQuestionBanks[tier];
}

export function getTierIndexForGlobalLevel(globalLevel: number): 1 | 2 | 3 | 4 | 5 {
  const clamped = clampGlobalLevel(globalLevel);
  if (clamped <= 5) return 1;
  if (clamped <= 10) return 2;
  if (clamped <= 15) return 3;
  if (clamped <= 20) return 4;
  return 5;
}

export function getTierForGlobalLevel(globalLevel: number): ChallengeTier {
  const tierIndex = getTierIndexForGlobalLevel(globalLevel);
  switch (tierIndex) {
    case 1:
      return 'beginner';
    case 2:
      return 'apprentice';
    case 3:
      return 'grinder';
    case 4:
      return 'chip_leader';
    case 5:
    default:
      return 'master';
  }
}

export function getLocalLevelWithinTier(globalLevel: number): 1 | 2 | 3 | 4 | 5 {
  const clamped = clampGlobalLevel(globalLevel);
  const localLevel = ((clamped - 1) % 5) + 1;
  return localLevel as 1 | 2 | 3 | 4 | 5;
}

export function getQuestionsForGlobalLevel(globalLevel: number): ChallengeQuestion[] {
  const tier = getTierForGlobalLevel(globalLevel);
  const localLevel = getLocalLevelWithinTier(globalLevel);
  return tierQuestionBanks[tier].filter((question) => question.level === localLevel);
}
