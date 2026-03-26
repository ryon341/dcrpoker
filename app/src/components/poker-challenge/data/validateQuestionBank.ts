// ─── Question Bank Validation Utility (TC089) ────────────────────────────────
// Dev-only. Import and call runQuestionBankAudit() in __DEV__ to surface issues
// before they ship. Never called in production code paths.

import type { ChallengeQuestion, ChallengeTier, ChallengeCategory } from '../challengeQuestionTypes';
import { tier1Questions } from './tier1Questions';
import { tier2Questions } from './tier2Questions';
import { tier3Questions } from './tier3Questions';
import { tier4Questions } from './tier4Questions';
import { tier5Questions } from './tier5Questions';

// ─── Constants ────────────────────────────────────────────────────────────────

export const VALID_CATEGORIES: ChallengeCategory[] = ['action', 'outs', 'ev', 'position', 'pressure'];
export const VALID_TIERS: ChallengeTier[] = ['beginner', 'apprentice', 'grinder', 'chip_leader', 'master'];
const VALID_DIFFICULTY_RANGE = { min: 1, max: 100 };

const TIER_BUCKETS: { tier: ChallengeTier; questions: ChallengeQuestion[] }[] = [
  { tier: 'beginner',   questions: tier1Questions },
  { tier: 'apprentice', questions: tier2Questions },
  { tier: 'grinder',    questions: tier3Questions },
  { tier: 'chip_leader', questions: tier4Questions },
  { tier: 'master',     questions: tier5Questions },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditError = {
  severity: 'error' | 'warning';
  tier: ChallengeTier | 'global';
  id?: string;
  message: string;
};

export type TierAuditResult = {
  tier: ChallengeTier;
  total: number;
  byCategory: Record<ChallengeCategory, number>;
  errors: AuditError[];
};

export type QuestionBankAuditReport = {
  tierResults: TierAuditResult[];
  globalErrors: AuditError[];
  totalQuestions: number;
  passed: boolean;
};

// ─── Validation helpers ───────────────────────────────────────────────────────

function checkQuestion(q: ChallengeQuestion, bucket: ChallengeTier): AuditError[] {
  const errors: AuditError[] = [];
  const ref = `[${bucket}/${q.id ?? '<no-id>'}]`;

  // Required fields
  if (!q.id || q.id.trim() === '') {
    errors.push({ severity: 'error', tier: bucket, message: `${ref} Missing or empty id` });
  }
  if (!q.prompt || q.prompt.trim() === '') {
    errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} Missing or empty prompt` });
  }
  if (!q.explanation || q.explanation.trim() === '') {
    errors.push({ severity: 'warning', tier: bucket, id: q.id, message: `${ref} Missing explanation` });
  }
  if (!q.tags || !Array.isArray(q.tags)) {
    errors.push({ severity: 'warning', tier: bucket, id: q.id, message: `${ref} Missing tags array` });
  }

  // Category
  if (!VALID_CATEGORIES.includes(q.category)) {
    errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} Invalid category: "${q.category}"` });
  }

  // Tier match
  if (q.tier !== bucket) {
    // sourceTier can differ (carryover) — only flag if tier itself is wrong
    if (q.tier !== bucket && !q.sourceTier) {
      errors.push({ severity: 'warning', tier: bucket, id: q.id, message: `${ref} Tier mismatch: question.tier="${q.tier}" found in "${bucket}" bucket` });
    }
  }

  // Difficulty score
  if (typeof q.difficultyScore !== 'number' || q.difficultyScore < VALID_DIFFICULTY_RANGE.min || q.difficultyScore > VALID_DIFFICULTY_RANGE.max) {
    errors.push({ severity: 'warning', tier: bucket, id: q.id, message: `${ref} difficultyScore ${q.difficultyScore} out of 1–100 range` });
  }

  // Category-specific field checks
  if (q.category === 'action') {
    if (!q.correctAction) {
      errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} Action question missing correctAction` });
    }
    const valid = ['fold', 'call', 'raise'];
    if (q.correctAction && !valid.includes(q.correctAction)) {
      errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} correctAction "${q.correctAction}" must be fold|call|raise` });
    }
  }

  if (q.category === 'outs' || q.category === 'ev' || q.category === 'pressure') {
    if (!q.choices || !Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} Math question must have ≥2 choices` });
    }
    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} Math question missing correctAnswer` });
    }
    if (q.choices && q.correctAnswer && !q.choices.includes(q.correctAnswer)) {
      errors.push({ severity: 'error', tier: bucket, id: q.id, message: `${ref} correctAnswer "${q.correctAnswer}" not found in choices` });
    }
  }

  return errors;
}

// ─── Main audit ───────────────────────────────────────────────────────────────

export function runQuestionBankAudit(): QuestionBankAuditReport {
  const globalErrors: AuditError[] = [];
  const tierResults: TierAuditResult[] = [];

  // Global duplicate tracking
  const globalIds   = new Map<string, ChallengeTier>();
  const globalPrompts = new Map<string, ChallengeTier>();

  for (const { tier, questions } of TIER_BUCKETS) {
    const tierErrors: AuditError[] = [];
    const tierIds    = new Set<string>();
    const tierPrompts = new Set<string>();
    const byCategory: Record<ChallengeCategory, number> = { action: 0, outs: 0, ev: 0, position: 0, pressure: 0 };

    for (const q of questions) {
      // Per-question field validation
      tierErrors.push(...checkQuestion(q, tier));

      // Category tally
      if (VALID_CATEGORIES.includes(q.category)) {
        byCategory[q.category]++;
      }

      // Duplicate IDs within tier
      if (q.id) {
        if (tierIds.has(q.id)) {
          tierErrors.push({ severity: 'error', tier, id: q.id, message: `Duplicate id within ${tier}: "${q.id}"` });
        } else {
          tierIds.add(q.id);
        }
        // Global cross-tier duplicate
        if (globalIds.has(q.id)) {
          globalErrors.push({ severity: 'error', tier: 'global', id: q.id, message: `Cross-tier duplicate id "${q.id}" in both "${globalIds.get(q.id)}" and "${tier}"` });
        } else {
          globalIds.set(q.id, tier);
        }
      }

      // Duplicate prompts within tier
      if (q.prompt) {
        const key = q.prompt.trim().toLowerCase();
        if (tierPrompts.has(key)) {
          tierErrors.push({ severity: 'warning', tier, id: q.id, message: `Duplicate prompt in ${tier}: "${q.prompt.slice(0, 60)}..."` });
        } else {
          tierPrompts.add(key);
        }
        // Global prompt duplicate
        if (globalPrompts.has(key)) {
          globalErrors.push({ severity: 'warning', tier: 'global', id: q.id, message: `Cross-tier duplicate prompt "${q.prompt.slice(0, 60)}..."` });
        } else {
          globalPrompts.set(key, tier);
        }
      }
    }

    tierResults.push({
      tier,
      total: questions.length,
      byCategory,
      errors: tierErrors,
    });
  }

  const totalQuestions = TIER_BUCKETS.reduce((sum, b) => sum + b.questions.length, 0);
  const allErrors = [...globalErrors, ...tierResults.flatMap(r => r.errors)];
  const passed = allErrors.filter(e => e.severity === 'error').length === 0;

  return { tierResults, globalErrors, totalQuestions, passed };
}

// ─── Formatted report ─────────────────────────────────────────────────────────

export function formatAuditReport(report: QuestionBankAuditReport): string {
  const lines: string[] = [];
  lines.push('');
  lines.push('Question Bank Audit');
  lines.push('─'.repeat(40));

  for (const r of report.tierResults) {
    const tierLabel = r.tier.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    lines.push(`${tierLabel}: ${r.total} questions`);
    lines.push(`  action: ${r.byCategory.action}  |  outs: ${r.byCategory.outs}  |  ev: ${r.byCategory.ev}`);
    const errCount = r.errors.filter(e => e.severity === 'error').length;
    const warnCount = r.errors.filter(e => e.severity === 'warning').length;
    if (errCount > 0 || warnCount > 0) {
      lines.push(`  ⚠  ${errCount} errors, ${warnCount} warnings`);
    }
  }

  lines.push('─'.repeat(40));
  lines.push(`Total: ${report.totalQuestions} questions`);

  const allErrors = [
    ...report.globalErrors,
    ...report.tierResults.flatMap(r => r.errors),
  ].filter(e => e.severity === 'error');

  const allWarnings = [
    ...report.globalErrors,
    ...report.tierResults.flatMap(r => r.errors),
  ].filter(e => e.severity === 'warning');

  if (allErrors.length > 0) {
    lines.push('');
    lines.push(`Errors (${allErrors.length}):`);
    allErrors.forEach(e => lines.push(`  ✗ ${e.message}`));
  }

  if (allWarnings.length > 0 && allWarnings.length <= 20) {
    lines.push('');
    lines.push(`Warnings (${allWarnings.length}):`);
    allWarnings.forEach(e => lines.push(`  ⚠ ${e.message}`));
  } else if (allWarnings.length > 20) {
    lines.push(`  (${allWarnings.length} warnings — run with verbose=true to see all)`);
  }

  lines.push('');
  lines.push(report.passed ? '✅  PASSED — no errors found.' : '❌  FAILED — fix errors above before shipping.');
  lines.push('');

  return lines.join('\n');
}
