// ─── Question Bank Content Status Dashboard (TC089) ──────────────────────────
// Dev-only reference for tracking authoring progress per tier.
// Counts are computed at runtime from the live question arrays.

import { tier1Questions } from './tier1Questions';
import { tier2Questions } from './tier2Questions';
import { tier3Questions } from './tier3Questions';
import { tier4Questions } from './tier4Questions';
import { tier5Questions } from './tier5Questions';
import type { ChallengeQuestion, ChallengeCategory } from '../challengeQuestionTypes';

// ─── Constants ────────────────────────────────────────────────────────────────

export const QUESTION_BANK_TARGET = 250;
export const QUESTION_BANK_TOTAL_TARGET = 1250;

// Per-tier category targets (from TC090 spec)
export const TIER_CATEGORY_TARGETS: Record<string, Record<ChallengeCategory, number>> = {
  beginner:    { action: 100, outs: 60, ev: 50, position: 40, pressure: 0 },
  apprentice:  { action: 100, outs: 50, ev: 60, position: 40, pressure: 0 },
  grinder:     { action: 90,  outs: 40, ev: 70, position: 0,  pressure: 50 },
  chip_leader: { action: 80,  outs: 30, ev: 80, position: 0,  pressure: 60 },
  master:      { action: 70,  outs: 20, ev: 90, position: 0,  pressure: 0 },
};

// Suggested difficulty ranges by tier
export const TIER_DIFFICULTY_GUIDE: Record<string, { min: number; max: number; label: string }> = {
  beginner:    { min: 10, max: 35, label: 'mostly 1–2 (score 10–35)' },
  apprentice:  { min: 30, max: 55, label: 'mostly 2–3 (score 30–55)' },
  grinder:     { min: 45, max: 70, label: 'mostly 3 (score 45–70)' },
  chip_leader: { min: 60, max: 85, label: 'mostly 3–4 (score 60–85)' },
  master:      { min: 75, max: 100, label: 'mostly 4–5 (score 75–100)' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type TierStatusEntry = {
  displayName: string;
  target: number;
  current: number;
  coveragePct: number;
  byCategory: Record<ChallengeCategory, number>;
  categoryTargets: Record<ChallengeCategory, number>;
  avgDifficultyScore: number;
};

export type QuestionBankStatus = {
  tiers: Record<string, TierStatusEntry>;
  totalCurrent: number;
  totalTarget: number;
  overallCoveragePct: number;
  generatedAt: string;
};

// ─── Internal builder ─────────────────────────────────────────────────────────

function computeTierStatus(
  tierKey: string,
  displayName: string,
  questions: ChallengeQuestion[],
): TierStatusEntry {
  const byCategory: Record<ChallengeCategory, number> = { action: 0, outs: 0, ev: 0, position: 0, pressure: 0 };
  let totalDifficulty = 0;
  let difficultyCount = 0;

  for (const q of questions) {
    if (q.category === 'action' || q.category === 'outs' || q.category === 'ev' || q.category === 'position' || q.category === 'pressure') {
      byCategory[q.category]++;
    }
    if (typeof q.difficultyScore === 'number') {
      totalDifficulty += q.difficultyScore;
      difficultyCount++;
    }
  }

  const current = questions.length;
  const coveragePct = Math.round((current / QUESTION_BANK_TARGET) * 100);
  const avgDifficultyScore = difficultyCount > 0
    ? Math.round((totalDifficulty / difficultyCount) * 10) / 10
    : 0;

  return {
    displayName,
    target: QUESTION_BANK_TARGET,
    current,
    coveragePct,
    byCategory,
    categoryTargets: TIER_CATEGORY_TARGETS[tierKey] ?? { action: 100, outs: 50, ev: 50, position: 0, pressure: 0 },
    avgDifficultyScore,
  };
}

// ─── Live status (computed at module-load time) ───────────────────────────────

export const questionBankStatus: QuestionBankStatus = (() => {
  const tiers: Record<string, TierStatusEntry> = {
    beginner:    computeTierStatus('beginner',    'Beginner',    tier1Questions),
    apprentice:  computeTierStatus('apprentice',  'Apprentice',  tier2Questions),
    grinder:     computeTierStatus('grinder',     'Grinder',     tier3Questions),
    chip_leader: computeTierStatus('chip_leader', 'Chip Leader', tier4Questions),
    master:      computeTierStatus('master',      'Master',      tier5Questions),
  };

  const totalCurrent = Object.values(tiers).reduce((s, t) => s + t.current, 0);
  const overallCoveragePct = Math.round((totalCurrent / QUESTION_BANK_TOTAL_TARGET) * 100);

  return {
    tiers,
    totalCurrent,
    totalTarget: QUESTION_BANK_TOTAL_TARGET,
    overallCoveragePct,
    generatedAt: new Date().toISOString(),
  };
})();

// ─── Formatted output ─────────────────────────────────────────────────────────

export function formatBankStatus(): string {
  const s = questionBankStatus;
  const lines: string[] = [];
  lines.push('');
  lines.push('Question Bank Status');
  lines.push('─'.repeat(50));

  for (const entry of Object.values(s.tiers)) {
    const bar = '█'.repeat(Math.round(entry.coveragePct / 5)).padEnd(20, '░');
    lines.push(`${entry.displayName.padEnd(12)} ${entry.current}/${entry.target}  [${bar}]  ${entry.coveragePct}%`);
    lines.push(`  action: ${entry.byCategory.action} (target ${entry.categoryTargets.action})  |  outs: ${entry.byCategory.outs} (target ${entry.categoryTargets.outs})  |  ev: ${entry.byCategory.ev} (target ${entry.categoryTargets.ev})  |  position: ${entry.byCategory.position} (target ${entry.categoryTargets.position})  |  pressure: ${entry.byCategory.pressure} (target ${entry.categoryTargets.pressure})`);
    lines.push(`  avg difficulty score: ${entry.avgDifficultyScore}`);
  }

  lines.push('─'.repeat(50));
  lines.push(`Total: ${s.totalCurrent} / ${s.totalTarget} questions  (${s.overallCoveragePct}% of target)`);
  lines.push('');

  return lines.join('\n');
}
