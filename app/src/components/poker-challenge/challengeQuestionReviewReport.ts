// ─── TC098 — Question Review Report ──────────────────────────────────────────
// Dev-only console report showing the current state of the question review
// registry: quarantined counts, override counts, depletion status, and any
// invalid replacement warnings.

import { QUESTION_REVIEW_REGISTRY, type ReviewedQuestionEntry, isValidReplacementQuestion } from './challengeQuestionReviewRegistry';
import { validateReviewedBanks, type ReviewedBanksValidationResult } from './data/challengeQuestionBankRegistry';
import { tierQuestionBanks } from './data/tierQuestionBanks';

// ── Report helpers ────────────────────────────────────────────────────────────

function countByField<T extends ReviewedQuestionEntry>(
  entries: T[],
  field: keyof T,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const e of entries) {
    const val = String(e[field]);
    result[val] = (result[val] ?? 0) + 1;
  }
  return result;
}

// ── Main report ───────────────────────────────────────────────────────────────

export async function printQuestionReviewReport(): Promise<void> {
  if (!__DEV__) return;

  const entries = Object.values(QUESTION_REVIEW_REGISTRY);
  const quarantined = entries.filter(e => e.status === 'quarantined');
  const overridden  = entries.filter(e => e.status === 'overridden');
  const active      = entries.filter(e => e.status === 'active');

  // Identify overrides with missing or invalid replacements
  const invalidOverrides = overridden.filter(
    e => !e.replacementQuestion || !isValidReplacementQuestion(e.replacementQuestion),
  );

  // Tier + category breakdowns for non-active entries
  const flagged = [...quarantined, ...overridden];
  const tierBreakdown     = countByField(flagged, 'tier');
  const categoryBreakdown = countByField(flagged, 'category');

  // Run depletion check on reviewed runtime banks
  const depletionResult: ReviewedBanksValidationResult = validateReviewedBanks(tierQuestionBanks);

  // ── Render ──────────────────────────────────────────────────────────────────
  const line = '─'.repeat(58);

  console.log(`\n${line}`);
  console.log('  QUESTION REVIEW REPORT  (TC098)');
  console.log(line);
  console.log(`  Registry entries : ${entries.length}`);
  console.log(`    active         : ${active.length}`);
  console.log(`    quarantined    : ${quarantined.length}`);
  console.log(`    overridden     : ${overridden.length}`);

  if (invalidOverrides.length > 0) {
    console.warn(`\n  ⚠️  INVALID OVERRIDES (${invalidOverrides.length}) — treated as quarantined at runtime:`);
    invalidOverrides.forEach(e => {
      console.warn(`    • ${e.questionId}  [${e.tier}/${e.category}] — ${e.reason}`);
    });
  }

  if (flagged.length > 0) {
    console.log('\n  TIER BREAKDOWN (quarantined + overridden)');
    Object.entries(tierBreakdown).sort().forEach(([tier, n]) => {
      console.log(`    ${tier.padEnd(12)} ${n}`);
    });

    console.log('\n  CATEGORY BREAKDOWN');
    Object.entries(categoryBreakdown).sort().forEach(([cat, n]) => {
      console.log(`    ${cat.padEnd(12)} ${n}`);
    });

    console.log('\n  QUARANTINED ENTRIES');
    quarantined.forEach(e => {
      console.log(`    • [${e.tier}/${e.category}] ${e.questionId}`);
      console.log(`      Reason: ${e.reason}`);
      if (e.notes) console.log(`      Notes : ${e.notes}`);
    });

    if (overridden.length > 0) {
      console.log('\n  OVERRIDDEN ENTRIES');
      overridden.forEach(e => {
        const repId = e.replacementQuestion?.id ?? '(none)';
        const valid = e.replacementQuestion && isValidReplacementQuestion(e.replacementQuestion);
        const flag  = valid ? '✓' : '⚠ invalid';
        console.log(`    • [${e.tier}/${e.category}] ${e.questionId} → ${repId} [${flag}]`);
        console.log(`      Reason: ${e.reason}`);
      });
    }
  }

  // ── Depletion check ─────────────────────────────────────────────────────────
  console.log('\n  DEPLETION CHECK (reviewed runtime banks)');
  const allErrors: string[]   = [];
  const allWarnings: string[] = [];

  depletionResult.results.forEach(r => {
    r.depletionErrors.forEach(msg => allErrors.push(msg));
    r.depletionWarnings.forEach(msg => allWarnings.push(msg));
  });

  if (allErrors.length > 0) {
    console.error(`  ❌ DEPLETION ERRORS (${allErrors.length}):`);
    allErrors.forEach(msg => console.error(`    • ${msg}`));
  }
  if (allWarnings.length > 0) {
    console.warn(`  ⚠️  DEPLETION WARNINGS (${allWarnings.length}):`);
    allWarnings.forEach(msg => console.warn(`    • ${msg}`));
  }
  if (allErrors.length === 0 && allWarnings.length === 0) {
    console.log(`  ✓ All tier/level counts are within safe range.`);
  }

  console.log(`${line}\n`);
}
