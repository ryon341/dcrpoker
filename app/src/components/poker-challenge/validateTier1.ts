/**
 * TC080 — Tier 1 validation utility
 *
 * Call validateTier1Questions() at any time (e.g. in __DEV__ startup code or
 * a Jest test) to verify structural correctness of the Beginner question bank.
 *
 * Note: this checks structural/parse validity. Semantic GTO correctness
 * (whether the marked correctAction is strategically sound) requires human
 * review and is not automatable here.
 */
import { tier1BeginnerQuestions } from './data/tier1BeginnerQuestions';

/** Mirrors the same regex used in challengeQuestionAdapter.ts */
function parseOutsCards(prompt: string): { heroCards: string[]; boardCards: string[] } | null {
  const m = prompt.match(
    /you\s+hold\s+([2-9TJQKA][cdhs])\s+([2-9TJQKA][cdhs])\s+on\s+((?:[2-9TJQKA][cdhs]\s*){2,5})/i,
  );
  if (!m) return null;
  return { heroCards: [m[1], m[2]], boardCards: m[3].trim().split(/\s+/) };
}

export type ValidationResult = {
  pass: boolean;
  totalCount: number;
  levelCounts: Record<number, number>;
  /** Keys like "L1_action", "L3_outs", etc. */
  categoryCounts: Record<string, number>;
  errors: string[];
};

export function validateTier1Questions(): ValidationResult {
  const questions = tier1BeginnerQuestions;
  const errors: string[] = [];

  const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const categoryCounts: Record<string, number> = {};
  for (let lvl = 1; lvl <= 5; lvl++) {
    categoryCounts[`L${lvl}_action`] = 0;
    categoryCounts[`L${lvl}_outs`]   = 0;
    categoryCounts[`L${lvl}_ev`]     = 0;
  }

  // ── Total count ────────────────────────────────────────────────────────────
  if (questions.length !== 250) {
    errors.push(`Total count: expected 250, got ${questions.length}`);
  }

  // ── Unique IDs ─────────────────────────────────────────────────────────────
  const idSet = new Set<string>();
  for (const q of questions) {
    if (idSet.has(q.id)) errors.push(`Duplicate ID: "${q.id}"`);
    else idSet.add(q.id);
  }

  // ── Unique prompts ─────────────────────────────────────────────────────────
  const promptMap = new Map<string, string>();
  for (const q of questions) {
    const key = q.prompt.trim().toLowerCase();
    const existing = promptMap.get(key);
    if (existing) {
      errors.push(`Duplicate prompt at ${q.id} (matches ${existing})`);
    } else {
      promptMap.set(key, q.id);
    }
  }

  // ── Per-question field checks ──────────────────────────────────────────────
  for (const q of questions) {
    // Level range
    if (q.level < 1 || q.level > 5) {
      errors.push(`${q.id}: invalid level ${q.level}`);
      continue;
    }
    levelCounts[q.level]++;
    const catKey = `L${q.level}_${q.category}`;
    categoryCounts[catKey] = (categoryCounts[catKey] ?? 0) + 1;

    // Prompt
    if (!q.prompt?.trim()) {
      errors.push(`${q.id}: missing prompt`);
      continue;
    }

    if (q.category === 'action') {
      // correctAction must be one of the three valid values
      if (!['fold', 'call', 'raise'].includes(q.correctAction ?? '')) {
        errors.push(`${q.id}: invalid correctAction "${q.correctAction}"`);
      }
    } else if (q.category === 'outs' || q.category === 'ev') {
      const choices = q.choices ?? [];
      if (choices.length < 2) {
        errors.push(`${q.id}: fewer than 2 choices (got ${choices.length})`);
      }
      const answer = q.correctAnswer?.trim() ?? '';
      if (!answer) {
        errors.push(`${q.id}: missing correctAnswer`);
      } else if (choices.length > 0 && !choices.includes(answer)) {
        errors.push(`${q.id}: correctAnswer "${answer}" not in choices [${choices.join(', ')}]`);
      }
      // Outs: verify card data can be parsed from prompt
      if (q.category === 'outs') {
        const parsed = parseOutsCards(q.prompt);
        if (!parsed) {
          errors.push(`${q.id}: card parse failed – "${q.prompt.substring(0, 70)}…"`);
        } else if (parsed.boardCards.length < 3) {
          errors.push(`${q.id}: board has fewer than 3 cards (got ${parsed.boardCards.length})`);
        }
      }
    } else {
      errors.push(`${q.id}: unknown category "${q.category}"`);
    }
  }

  // ── Per-level count checks ─────────────────────────────────────────────────
  for (let lvl = 1; lvl <= 5; lvl++) {
    if (levelCounts[lvl] !== 50) {
      errors.push(`Level ${lvl}: expected 50 questions, got ${levelCounts[lvl]}`);
    }
    if (categoryCounts[`L${lvl}_action`] !== 30) {
      errors.push(`Level ${lvl} action: expected 30, got ${categoryCounts[`L${lvl}_action`]}`);
    }
    if (categoryCounts[`L${lvl}_outs`] !== 10) {
      errors.push(`Level ${lvl} outs: expected 10, got ${categoryCounts[`L${lvl}_outs`]}`);
    }
    if (categoryCounts[`L${lvl}_ev`] !== 10) {
      errors.push(`Level ${lvl} ev: expected 10, got ${categoryCounts[`L${lvl}_ev`]}`);
    }
  }

  return {
    pass: errors.length === 0,
    totalCount: questions.length,
    levelCounts,
    categoryCounts,
    errors,
  };
}
