// ─── TC090.5 — Deduplication Utilities ───────────────────────────────────────
// Fingerprint-based deduplication for generated question banks.

import type { GeneratedQuestion } from './generatorTypes';

/** Collapse whitespace + lowercase → stable fingerprint string. */
export function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Build a scenario signature from structural fields (not the prompt text). */
export function buildScenarioSignature(q: GeneratedQuestion): string {
  const parts = [
    q.category,
    q.correctAction ?? q.correctAnswer ?? '',
    q.heroPosition ?? '',
    String(q.effectiveStackBb ?? ''),
  ];
  return parts.join('|');
}

/** Remove questions whose prompt fingerprint has already been seen. */
export function dedupeByPrompt(questions: GeneratedQuestion[]): GeneratedQuestion[] {
  const seen = new Set<string>();
  const out: GeneratedQuestion[] = [];
  for (const q of questions) {
    const fp = normalizePrompt(q.prompt);
    if (!seen.has(fp)) {
      seen.add(fp);
      out.push(q);
    }
  }
  return out;
}

/** Further filter near-duplicates that share the same (category, correctAction, position, stack). */
export function filterNearDuplicates(questions: GeneratedQuestion[]): GeneratedQuestion[] {
  const seen = new Set<string>();
  const out: GeneratedQuestion[] = [];
  for (const q of questions) {
    const sig = buildScenarioSignature(q);
    if (!seen.has(sig)) {
      seen.add(sig);
      out.push(q);
    }
  }
  return out;
}

/** Ensure every question has a unique ID within the bank. */
export function dedupeByID(questions: GeneratedQuestion[]): GeneratedQuestion[] {
  const seen = new Set<string>();
  const out: GeneratedQuestion[] = [];
  for (const q of questions) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      out.push(q);
    }
  }
  return out;
}
