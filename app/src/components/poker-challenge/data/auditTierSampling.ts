// ─── Tier Carryover Sampling Audit (TC089) ───────────────────────────────────
// Dev-only. Verifies the 80/20 native/carryover rule is actually respected at
// runtime by simulating `buildSessionPool` across many iterations.

import { buildSessionPool } from '../challengeSelector';
import {
  getTierForGlobalLevel,
  getQuestionsForTier,
  getPreviousTierForGlobalLevel,
} from './tierQuestionBanks';

const SAMPLE_RUNS = 200;
const SESSION_LENGTH = 12;

// Levels to audit — one representative per tier (the first level of each tier)
const AUDIT_LEVELS: Record<number, { label: string; nativeTier: string; carryoverTier: string | null }> = {
  1:  { label: 'Level 1',  nativeTier: 'beginner',   carryoverTier: null },
  6:  { label: 'Level 6',  nativeTier: 'apprentice',  carryoverTier: 'beginner' },
  7:  { label: 'Level 7',  nativeTier: 'apprentice',  carryoverTier: 'beginner' },
  11: { label: 'Level 11', nativeTier: 'grinder',     carryoverTier: 'apprentice' },
  12: { label: 'Level 12', nativeTier: 'grinder',     carryoverTier: 'apprentice' },
  16: { label: 'Level 16', nativeTier: 'chip_leader', carryoverTier: 'grinder' },
  21: { label: 'Level 21', nativeTier: 'master',      carryoverTier: 'chip_leader' },
  25: { label: 'Level 25', nativeTier: 'master',      carryoverTier: 'chip_leader' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type LevelSamplingResult = {
  level: number;
  label: string;
  nativeTier: string;
  carryoverTier: string | null;
  nativePct: number;
  carryoverPct: number;
  forbiddenPct: number;
  forbiddenSources: string[];
  passed: boolean;
};

export type SamplingAuditReport = {
  results: LevelSamplingResult[];
  passed: boolean;
};

// ─── Audit runner ─────────────────────────────────────────────────────────────

export function runSamplingAudit(sampleRuns = SAMPLE_RUNS): SamplingAuditReport {
  const results: LevelSamplingResult[] = [];

  for (const [levelStr, meta] of Object.entries(AUDIT_LEVELS)) {
    const level = Number(levelStr);
    const nativeTier = getTierForGlobalLevel(level) as string;
    const prevTier   = getPreviousTierForGlobalLevel(level) as string | null;

    // Build ID sets for quick tier lookup
    const nativeIds    = new Set(getQuestionsForTier(nativeTier as any).map(q => q.id));
    const carryoverIds = prevTier
      ? new Set(getQuestionsForTier(prevTier as any).map(q => q.id))
      : new Set<string>();

    // Track all question IDs that appeared across sample runs
    let nativeCount   = 0;
    let carryoverCount = 0;
    let forbiddenCount = 0;
    const forbiddenSources = new Set<string>();
    let totalSampled = 0;

    for (let run = 0; run < sampleRuns; run++) {
      const pool = buildSessionPool(level, SESSION_LENGTH);
      totalSampled += pool.length;
      for (const id of pool) {
        if (nativeIds.has(id)) {
          nativeCount++;
        } else if (carryoverIds.has(id)) {
          carryoverCount++;
        } else {
          // Forbidden: came from a tier more than one step back
          forbiddenCount++;
          // Try to identify which tier it came from
          for (const [knownTier, label] of [
            ['beginner', 'beginner'], ['apprentice', 'apprentice'],
            ['grinder', 'grinder'], ['chip_leader', 'chip_leader'], ['master', 'master'],
          ] as const) {
            if (knownTier !== nativeTier && knownTier !== prevTier) {
              const ids = getQuestionsForTier(knownTier as any).map(q => q.id);
              if (ids.includes(id)) {
                forbiddenSources.add(label);
              }
            }
          }
        }
      }
    }

    const nativePct    = totalSampled > 0 ? (nativeCount / totalSampled) * 100 : 0;
    const carryoverPct = totalSampled > 0 ? (carryoverCount / totalSampled) * 100 : 0;
    const forbiddenPct = totalSampled > 0 ? (forbiddenCount / totalSampled) * 100 : 0;

    // Pass = no forbidden leakage AND (no carryover requirement OR carryover is within expected band)
    const noForbiddenLeakage = forbiddenCount === 0;
    const carryoverOk = prevTier == null
      ? true
      : (carryoverPct >= 15 && carryoverPct <= 30); // expect ~20%

    const passed = noForbiddenLeakage && carryoverOk;

    results.push({
      level,
      label: meta.label,
      nativeTier,
      carryoverTier: prevTier,
      nativePct: Math.round(nativePct * 10) / 10,
      carryoverPct: Math.round(carryoverPct * 10) / 10,
      forbiddenPct: Math.round(forbiddenPct * 10) / 10,
      forbiddenSources: Array.from(forbiddenSources),
      passed,
    });
  }

  const passed = results.every(r => r.passed);
  return { results, passed };
}

// ─── Formatted report ─────────────────────────────────────────────────────────

export function formatSamplingReport(report: SamplingAuditReport, sampleRuns = SAMPLE_RUNS): string {
  const lines: string[] = [];
  lines.push('');
  lines.push(`Sampling Audit (${sampleRuns} runs, ${SESSION_LENGTH} questions each)`);
  lines.push('─'.repeat(50));

  for (const r of report.results) {
    const status = r.passed ? '✅' : '❌';
    const tierLabel = r.nativeTier.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    lines.push(`${status}  ${r.label} (${tierLabel})`);
    lines.push(`     native:    ${r.nativePct}%`);
    if (r.carryoverTier) {
      const carryLabel = r.carryoverTier.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      lines.push(`     carryover: ${r.carryoverPct}%  (from ${carryLabel})`);
    }
    if (r.forbiddenPct > 0) {
      lines.push(`  ⚠  FORBIDDEN leakage: ${r.forbiddenPct}% from [${r.forbiddenSources.join(', ')}]`);
    }
  }

  lines.push('─'.repeat(50));
  lines.push(report.passed ? '✅  All carryover ratios within expected 80/20 bands.' : '❌  One or more levels failed the carryover check.');
  lines.push('');

  return lines.join('\n');
}
