// ─── TC096 — Challenge analytics storage ─────────────────────────────────────
// Persists answered-question events in AsyncStorage with a size cap.
// All functions are fire-and-forget safe (they never throw to the caller).

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  ChallengeQuestionEvent,
  ChallengeAnalyticsSummary,
  CategoryStats,
} from './challengeAnalyticsTypes';

const STORAGE_KEY = 'dcr_challenge_analytics_v1';
/** Maximum number of events retained. Oldest are dropped when exceeded. */
const MAX_EVENTS  = 2000;

// ─── Core I/O ────────────────────────────────────────────────────────────────

async function loadRaw(): Promise<ChallengeQuestionEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChallengeQuestionEvent[]) : [];
  } catch {
    return [];
  }
}

async function saveRaw(events: ChallengeQuestionEvent[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Append one event to the analytics store.
 * Trims the oldest events if the store exceeds MAX_EVENTS.
 * Fire-and-forget — call without awaiting from the UI layer.
 */
export async function recordChallengeQuestionEvent(
  event: ChallengeQuestionEvent,
): Promise<void> {
  const events = await loadRaw();
  events.push(event);
  const trimmed = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;
  await saveRaw(trimmed);
}

/** Return all stored analytics events (oldest first). */
export async function getChallengeQuestionEvents(): Promise<ChallengeQuestionEvent[]> {
  return loadRaw();
}

/** Erase all analytics events from storage. */
export async function clearChallengeQuestionEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

function buildStats(answered: number, correct: number): CategoryStats {
  return { answered, correct, accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0 };
}

function buildSummary(events: ChallengeQuestionEvent[]): ChallengeAnalyticsSummary {
  const totalAnswered = events.length;
  const totalCorrect  = events.filter(e => e.correct).length;

  // Group accumulators
  const catMap:   Record<string, { a: number; c: number }> = {};
  const tierMap:  Record<string, { a: number; c: number }> = {};
  const levelMap: Record<number, { a: number; c: number }> = {};
  const missMap:  Record<string, { miss: number; attempts: number }> = {};

  for (const ev of events) {
    // Category
    if (!catMap[ev.category]) catMap[ev.category] = { a: 0, c: 0 };
    catMap[ev.category].a++;
    if (ev.correct) catMap[ev.category].c++;

    // Tier
    if (!tierMap[ev.tier]) tierMap[ev.tier] = { a: 0, c: 0 };
    tierMap[ev.tier].a++;
    if (ev.correct) tierMap[ev.tier].c++;

    // Level
    if (!levelMap[ev.level]) levelMap[ev.level] = { a: 0, c: 0 };
    levelMap[ev.level].a++;
    if (ev.correct) levelMap[ev.level].c++;

    // Miss tracking
    if (!missMap[ev.questionId]) missMap[ev.questionId] = { miss: 0, attempts: 0 };
    missMap[ev.questionId].attempts++;
    if (!ev.correct) missMap[ev.questionId].miss++;
  }

  const byCategory = Object.fromEntries(
    Object.entries(catMap).map(([k, v]) => [k, buildStats(v.a, v.c)]),
  );
  const byTier = Object.fromEntries(
    Object.entries(tierMap).map(([k, v]) => [k, buildStats(v.a, v.c)]),
  );
  const byLevel = Object.fromEntries(
    Object.entries(levelMap).map(([k, v]) => [Number(k), buildStats(v.a, v.c)]),
  ) as Record<number, CategoryStats>;

  const topMissed = Object.entries(missMap)
    .filter(([, v]) => v.miss > 0)
    .sort(([, a], [, b]) => b.miss - a.miss)
    .slice(0, 10)
    .map(([questionId, v]) => ({ questionId, missCount: v.miss, attempts: v.attempts }));

  return {
    totalAnswered,
    totalCorrect,
    overallAccuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    byCategory,
    byTier,
    byLevel,
    topMissed,
    challengeCount: events.filter(e => e.mode === 'challenge').length,
    gauntletCount:  events.filter(e => e.mode === 'gauntlet').length,
  };
}

/** Compute and return a full analytics summary from stored events. */
export async function getChallengeAnalyticsSummary(): Promise<ChallengeAnalyticsSummary> {
  return buildSummary(await loadRaw());
}

// ── Per-question performance (TC099) ─────────────────────────────────────────

/** Per-question performance summary used by the review surface. */
export type QuestionPerformanceSummary = {
  questionId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  /** 0–100 integer accuracy. 0 if no attempts. */
  accuracy: number;
  /** Tier name from the most recent event, if available. */
  tier?: string;
  /** Category from the most recent event, if available. */
  category?: string;
};

/**
 * Build a per-question performance map from stored analytics events.
 * Returns a Record keyed by questionId.
 */
export async function getPerQuestionStats(): Promise<Record<string, QuestionPerformanceSummary>> {
  const events = await loadRaw();
  const map: Record<string, { attempts: number; correct: number; tier?: string; category?: string }> = {};

  for (const ev of events) {
    if (!map[ev.questionId]) {
      map[ev.questionId] = { attempts: 0, correct: 0, tier: ev.tier, category: ev.category };
    }
    map[ev.questionId].attempts++;
    if (ev.correct) map[ev.questionId].correct++;
    // Keep the most recent tier/category tag
    map[ev.questionId].tier = ev.tier;
    map[ev.questionId].category = ev.category;
  }

  const result: Record<string, QuestionPerformanceSummary> = {};
  for (const [id, s] of Object.entries(map)) {
    const incorrect = s.attempts - s.correct;
    result[id] = {
      questionId: id,
      attempts:   s.attempts,
      correct:    s.correct,
      incorrect,
      accuracy:   s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0,
      tier:       s.tier,
      category:   s.category,
    };
  }
  return result;
}

/**
 * Print a dev-only analytics report to the console.
 * No-ops in production builds.
 */
export async function printChallengeAnalyticsReport(): Promise<void> {
  if (!__DEV__) return;
  const s = await getChallengeAnalyticsSummary();
  console.log('\n[DCR Analytics] ─────────────────────────────────────');
  console.log(
    `Total answered: ${s.totalAnswered} | Correct: ${s.totalCorrect} | Accuracy: ${s.overallAccuracy}%`,
  );
  console.log(`Challenge: ${s.challengeCount} | Gauntlet: ${s.gauntletCount}`);

  console.log('\n  By Category:');
  for (const [cat, st] of Object.entries(s.byCategory).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`    ${cat.padEnd(12)} ${st.correct}/${st.answered} (${st.accuracy}%)`);
  }

  console.log('\n  By Tier:');
  for (const [tier, st] of Object.entries(s.byTier)) {
    console.log(`    ${tier.padEnd(14)} ${st.correct}/${st.answered} (${st.accuracy}%)`);
  }

  if (s.topMissed.length > 0) {
    console.log('\n  Top Missed Questions:');
    for (const m of s.topMissed) {
      console.log(`    ${m.questionId.padEnd(28)} missed ${m.missCount}/${m.attempts}`);
    }
  }

  console.log('─────────────────────────────────────────────────────\n');
}
