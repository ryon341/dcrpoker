// ─── TC096 — Bank validation report (dev-only) ────────────────────────────────
// Call printChallengeBankReport() in __DEV__ to surface bank integrity issues.
// Does nothing in production builds.

import {
  validateAllChallengeBanks,
  type AllChallengeBanksValidationResult,
} from './data/challengeQuestionBankRegistry';

/**
 * Print a compact human-readable bank integrity report to the dev console.
 * No-ops outside __DEV__.
 */
export function printChallengeBankReport(): void {
  if (!__DEV__) return;
  const result = validateAllChallengeBanks();
  printReport(result);
}

/**
 * Run validateAllChallengeBanks() and return the result.
 * Prints a compact console report in __DEV__ as a side effect.
 */
export function runChallengeBankValidation(): AllChallengeBanksValidationResult {
  const result = validateAllChallengeBanks();
  if (__DEV__) printReport(result);
  return result;
}

function printReport(result: AllChallengeBanksValidationResult): void {
  const overall = result.passed ? 'PASS ✓' : 'FAIL ✗';
  console.log('\n[DCR BankValidation] ─────────────────────────────────');
  console.log(
    `Banks: ${result.passedBanks}/${result.totalBanks} passed | Overall: ${overall}`,
  );

  for (const r of result.results) {
    const status = r.passed ? '✓' : '✗';
    console.log(`\n  [${status}] ${r.tier}: ${r.total}/${r.expectedTotal} total`);

    const perLvl = Object.entries(r.perLevelCounts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([l, c]) => `L${l}:${c}`)
      .join('  ');
    console.log(`       Per-level: ${perLvl || '(none)'}`);

    const cats = Object.entries(r.categoryCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([c, n]) => `${c}:${n}`)
      .join('  ');
    console.log(`       Categories: ${cats || '(none)'}`);

    if (r.duplicateIds.length > 0) {
      console.log(
        `       ⚠ Duplicate IDs (${r.duplicateIds.length}): ${r.duplicateIds.slice(0, 5).join(', ')}`,
      );
    }
    if (r.duplicatePrompts.length > 0) {
      console.log(`       ⚠ Duplicate prompts: ${r.duplicatePrompts.length}`);
    }
    if (r.malformedQuestionIds.length > 0) {
      console.log(
        `       ✗ Malformed (${r.malformedQuestionIds.length}): ${r.malformedQuestionIds.slice(0, 5).join(', ')}`,
      );
    }
    if (r.errors.length > 0) {
      console.log(`       Errors (${r.errors.length}): ${r.errors.slice(0, 3).join('; ')}`);
    }
    if (r.warnings.length > 0) {
      console.log(`       Warnings (${r.warnings.length}): ${r.warnings.slice(0, 3).join('; ')}`);
    }
  }

  if (!result.passed) {
    console.error(
      `[DCR BankValidation] ✗ ${result.failedBanks} bank(s) failed validation. See errors above.`,
    );
  }

  console.log('─────────────────────────────────────────────────────\n');
}
