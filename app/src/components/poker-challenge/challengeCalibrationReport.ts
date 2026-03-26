// ─── TC097 — Challenge Calibration Report ────────────────────────────────────
// Consumes analytics summary and produces a developer-readable calibration
// report with per-tier/category accuracy diagnostics and outlier flags.

import { getChallengeAnalyticsSummary } from './challengeAnalyticsStorage';
import type { CategoryStats } from './challengeAnalyticsTypes';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CalibrationInsight = {
  severity: 'info' | 'warning' | 'critical';
  area: 'category' | 'tier' | 'level' | 'question' | 'gauntlet';
  message: string;
};

export type CalibrationQuestionStat = {
  questionId: string;
  attempts: number;
  missRate: number; // 0–1
};

export type ChallengeCalibrationReport = {
  generatedAt: string;
  totalEvents: number;
  overallAccuracy: number; // 0–100 integer
  categoryAccuracy: Record<string, number>; // 0–100 integer per category
  tierAccuracy: Record<string, number>;     // 0–100 integer per tier
  levelAccuracy: Record<string, number>;    // 0–100 integer per level
  mostMissed: CalibrationQuestionStat[];
  easiestQuestions: CalibrationQuestionStat[];
  insights: CalibrationInsight[];
};

// ── Target accuracy bands per tier ────────────────────────────────────────────
// tooLow / tooHigh trigger 'critical'/'warning' insights; low/high define the
// ideal accuracy range for the tier.
const TIER_ACCURACY_BANDS: Record<string, { low: number; high: number; tooLow: number; tooHigh: number }> = {
  beginner:    { low: 75, high: 90, tooLow: 60, tooHigh: 97 },
  apprentice:  { low: 65, high: 85, tooLow: 50, tooHigh: 95 },
  grinder:     { low: 55, high: 75, tooLow: 40, tooHigh: 92 },
  chip_leader: { low: 45, high: 70, tooLow: 30, tooHigh: 90 },
  master:      { low: 35, high: 60, tooLow: 20, tooHigh: 85 },
};

// ── Core Report Generator ─────────────────────────────────────────────────────

export async function generateCalibrationReport(): Promise<ChallengeCalibrationReport> {
  const summary = await getChallengeAnalyticsSummary();
  const insights: CalibrationInsight[] = [];

  // ── Sample size gate ────────────────────────────────────────────────────────
  if (summary.totalAnswered < 50) {
    insights.push({
      severity: 'info',
      area: 'tier',
      message: `Only ${summary.totalAnswered} events recorded — calibration accuracy improves with more data (target: 500+).`,
    });
  }

  // ── Category accuracy ───────────────────────────────────────────────────────
  const categoryAccuracy: Record<string, number> = {};
  for (const [cat, stats] of Object.entries(summary.byCategory)) {
    if ((stats as CategoryStats).answered === 0) continue;
    const acc = (stats as CategoryStats).accuracy; // 0–100
    categoryAccuracy[cat] = acc;
    if (acc < 40) {
      insights.push({ severity: 'critical', area: 'category', message: `Category "${cat}" accuracy ${acc}% is far below target — check for ambiguous wording or incorrect answer keys.` });
    } else if (acc < 55) {
      insights.push({ severity: 'warning', area: 'category', message: `Category "${cat}" accuracy ${acc}% is below expected — may need distractor review.` });
    } else if (acc > 95) {
      insights.push({ severity: 'warning', area: 'category', message: `Category "${cat}" accuracy ${acc}% is very high — distractors may be too obvious.` });
    }
  }

  // ── Tier accuracy ───────────────────────────────────────────────────────────
  const tierAccuracy: Record<string, number> = {};
  for (const [tier, stats] of Object.entries(summary.byTier)) {
    if ((stats as CategoryStats).answered === 0) continue;
    const acc = (stats as CategoryStats).accuracy;
    tierAccuracy[tier] = acc;
    const band = TIER_ACCURACY_BANDS[tier];
    if (!band) continue;
    if (acc < band.tooLow) {
      insights.push({ severity: 'critical', area: 'tier', message: `${tier} accuracy ${acc}% is critically below target range ${band.low}–${band.high}%.` });
    } else if (acc < band.low) {
      insights.push({ severity: 'warning', area: 'tier', message: `${tier} accuracy ${acc}% is below target range ${band.low}–${band.high}%.` });
    } else if (acc > band.tooHigh) {
      insights.push({ severity: 'warning', area: 'tier', message: `${tier} accuracy ${acc}% is above target range — questions may be too easy for this tier.` });
    }
  }

  // ── Adjacent tier difficulty jumps ──────────────────────────────────────────
  const tierOrder = ['beginner', 'apprentice', 'grinder', 'chip_leader', 'master'];
  for (let i = 0; i < tierOrder.length - 1; i++) {
    const t1 = tierOrder[i];
    const t2 = tierOrder[i + 1];
    const a1 = tierAccuracy[t1];
    const a2 = tierAccuracy[t2];
    if (a1 !== undefined && a2 !== undefined) {
      const drop = a1 - a2;
      if (drop > 30) {
        insights.push({ severity: 'warning', area: 'tier', message: `Large difficulty jump of ${drop}pp between ${t1} (${a1}%) and ${t2} (${a2}%) — tier boundary may feel abrupt.` });
      }
    }
  }

  // ── Level accuracy ──────────────────────────────────────────────────────────
  const levelAccuracy: Record<string, number> = {};
  for (const [lvl, stats] of Object.entries(summary.byLevel)) {
    if ((stats as CategoryStats).answered === 0) continue;
    levelAccuracy[lvl] = (stats as CategoryStats).accuracy;
  }

  // ── Most-missed questions ───────────────────────────────────────────────────
  const mostMissed: CalibrationQuestionStat[] = summary.topMissed
    .filter(q => q.attempts >= 5)
    .map(q => ({
      questionId: q.questionId,
      attempts: q.attempts,
      missRate: q.attempts > 0 ? q.missCount / q.attempts : 0,
    }))
    .sort((a, b) => b.missRate - a.missRate)
    .slice(0, 10);

  for (const q of mostMissed) {
    if (q.missRate >= 0.80) {
      insights.push({ severity: 'critical', area: 'question', message: `"${q.questionId}" missed ${Math.round(q.missRate * 100)}% of ${q.attempts} attempts — suspect bad wording or wrong answer key.` });
    }
  }

  // ── Easiest questions (low miss rate from topMissed pool) ───────────────────
  // topMissed is sorted by missCount descending, so the tail has low miss rates
  const easiestQuestions: CalibrationQuestionStat[] = summary.topMissed
    .filter(q => q.attempts >= 5 && q.missCount / q.attempts < 0.05)
    .map(q => ({
      questionId: q.questionId,
      attempts: q.attempts,
      missRate: q.attempts > 0 ? q.missCount / q.attempts : 0,
    }))
    .slice(0, 10);

  // ── Gauntlet vs challenge split insight ─────────────────────────────────────
  if (summary.totalAnswered >= 50) {
    const gauntletShare = summary.gauntletCount / summary.totalAnswered;
    if (gauntletShare > 0.60) {
      insights.push({ severity: 'info', area: 'gauntlet', message: `${Math.round(gauntletShare * 100)}% of events are gauntlet mode — analytics may skew toward advanced questions.` });
    }
  }

  if (insights.length === 0 && summary.totalAnswered >= 50) {
    insights.push({ severity: 'info', area: 'tier', message: 'All tiers within target accuracy bands. No immediate calibration action required.' });
  }

  return {
    generatedAt: new Date().toISOString(),
    totalEvents: summary.totalAnswered,
    overallAccuracy: summary.overallAccuracy,
    categoryAccuracy,
    tierAccuracy,
    levelAccuracy,
    mostMissed,
    easiestQuestions,
    insights,
  };
}

// ── Developer Console Report ──────────────────────────────────────────────────

export async function printCalibrationReport(): Promise<void> {
  if (!__DEV__) return;
  try {
    const report = await generateCalibrationReport();
    const line = '─'.repeat(58);
    console.log(`\n${line}`);
    console.log('  CHALLENGE CALIBRATION REPORT  (TC097)');
    console.log(`  Generated : ${report.generatedAt}`);
    console.log(`  Events    : ${report.totalEvents}  |  Overall accuracy: ${report.overallAccuracy}%`);
    console.log(line);

    console.log('\n  TIER ACCURACY');
    const tierOrder = ['beginner', 'apprentice', 'grinder', 'chip_leader', 'master'];
    for (const tier of tierOrder) {
      const acc = report.tierAccuracy[tier];
      if (acc === undefined) continue;
      const band = TIER_ACCURACY_BANDS[tier];
      const ok = band && acc >= band.low && acc <= band.high;
      const flag = ok ? '✓' : '⚠';
      const target = band ? `(target ${band.low}–${band.high}%)` : '';
      console.log(`    ${flag} ${tier.padEnd(12)} ${String(acc).padStart(3)}%  ${target}`);
    }

    console.log('\n  CATEGORY ACCURACY');
    for (const [cat, acc] of Object.entries(report.categoryAccuracy)) {
      console.log(`    ${cat.padEnd(18)} ${String(acc).padStart(3)}%`);
    }

    console.log('\n  LEVEL ACCURACY');
    const sortedLevels = Object.entries(report.levelAccuracy).sort(([a], [b]) => Number(a) - Number(b));
    for (const [lvl, acc] of sortedLevels) {
      console.log(`    Level ${lvl.padEnd(3)}  ${String(acc).padStart(3)}%`);
    }

    if (report.mostMissed.length > 0) {
      console.log('\n  TOP MISSED QUESTIONS');
      report.mostMissed.forEach(q => {
        console.log(`    miss ${String(Math.round(q.missRate * 100)).padStart(3)}%  ${q.questionId}  (n=${q.attempts})`);
      });
    }

    console.log('\n  INSIGHTS');
    if (report.insights.length === 0) {
      console.log('    No issues flagged.');
    } else {
      report.insights.forEach(ins => {
        const icon = ins.severity === 'critical' ? '❌' : ins.severity === 'warning' ? '⚠️ ' : 'ℹ️ ';
        console.log(`    ${icon} [${ins.area}] ${ins.message}`);
      });
    }
    console.log(`${line}\n`);
  } catch (e) {
    console.warn('[CalibrationReport] Error:', e);
  }
}
