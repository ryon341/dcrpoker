import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PokerStats } from './stats';
import { getInitialStats } from './stats';

export type PokerChallengeProgress = {
  level: number;
  score: number;
  handsCompleted: number;
  currentChallengeIndex: number;   // legacy, kept as 0
  currentChallengeId?: string | null;
  challengeHistory: string[];
  wheelPending: boolean;
  lastWheelResult: number | null;
  grandChampionUnlocked: boolean;
  updatedAt: string;
  stats: PokerStats;
  /** Global level numbers the user has unlocked (always includes 1). */
  unlockedLevels: number[];
  /** Correct answers in the current session (0 … SESSION_LENGTH). */
  sessionCorrect: number;
  /** Total answers given in the current session. */
  sessionTotal: number;
  /** IDs of the 12 questions pre-selected for the current session pool. Empty = no saved pool. */
  sessionQuestionIds?: string[];
  /** Index of the question currently being played in the session pool (0-based). */
  sessionQuestionIndex?: number;
  /** The tier name currently being played (e.g. 'Beginner'). */
  currentTier?: string;
  /** Tier names the player has unlocked access to. */
  unlockedTiers?: string[];
  /** Tier names where all 5 levels have been passed at least once. */
  completedTiers?: string[];
};

const PROGRESS_SCHEMA_VERSION = 2;

const GUEST_KEY        = 'dcr_poker_challenge_guest';
const USER_KEY_PREFIX  = 'dcr_poker_challenge_user_';

// ─── Schema versioning helpers ────────────────────────────────────────────────

/** Deserialize a raw storage string, handling both v1 (bare object) and v2+ (envelope) */
function parseRawProgress(raw: string): PokerChallengeProgress | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    let data: unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'v' in (parsed as Record<string, unknown>) &&
      'd' in (parsed as Record<string, unknown>)
    ) {
      data = (parsed as Record<string, unknown>).d;
    } else {
      // Legacy v1: bare progress object stored directly
      if (__DEV__) console.warn('[PokerProgress] Migrating v1 saved state to v2 schema');
      data = parsed;
    }
    return normalizeProgress(data as Partial<PokerChallengeProgress>);
  } catch {
    if (__DEV__) console.warn('[PokerProgress] Corrupt saved state – resetting to defaults');
    return null;
  }
}

function serializeProgress(p: PokerChallengeProgress): string {
  const envelope: { v: number; d: PokerChallengeProgress } = { v: PROGRESS_SCHEMA_VERSION, d: p };
  return JSON.stringify(envelope);
}

function normalizeProgress(raw: Partial<PokerChallengeProgress>): PokerChallengeProgress {
  // ── Sanitize session counters ──────────────────────────────────────────────
  const rawTotal   = Math.max(0, Math.trunc(raw.sessionTotal   ?? 0));
  const rawCorrect = Math.max(0, Math.trunc(raw.sessionCorrect ?? 0));
  if (__DEV__ && rawCorrect > rawTotal) {
    console.warn(`[PokerProgress] sessionCorrect (${rawCorrect}) > sessionTotal (${rawTotal}) – correcting`);
  }
  // ── Validate unlockedLevels ──────────────────────────────────────────────
  const rawUnlocked = Array.isArray(raw.unlockedLevels)
    ? raw.unlockedLevels.filter((l): l is number => Number.isInteger(l) && l >= 1 && l <= 25)
    : [];
  if (__DEV__ && Array.isArray(raw.unlockedLevels) && rawUnlocked.length < raw.unlockedLevels.length) {
    console.warn('[PokerProgress] Removed invalid level values from unlockedLevels');
  }
  // ── Validate session pool ────────────────────────────────────────────────
  const validIds = Array.isArray(raw.sessionQuestionIds)
    ? raw.sessionQuestionIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [];
  const rawIdx = Math.max(0, Math.trunc(raw.sessionQuestionIndex ?? 0));

  return {
    level: Math.max(1, Math.min(25, Math.trunc(raw.level ?? 1))),
    score: Math.max(0, Math.trunc(raw.score ?? 0)),
    handsCompleted: Math.max(0, Math.trunc(raw.handsCompleted ?? 0)),
    currentChallengeIndex: 0,
    currentChallengeId: raw.currentChallengeId ?? null,
    challengeHistory: Array.isArray(raw.challengeHistory) ? raw.challengeHistory : [],
    wheelPending: !!raw.wheelPending,
    lastWheelResult: typeof raw.lastWheelResult === 'number' ? raw.lastWheelResult : null,
    grandChampionUnlocked: !!raw.grandChampionUnlocked,
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    stats: raw.stats ?? getInitialStats(),
    unlockedLevels:      rawUnlocked.length > 0 ? rawUnlocked : [1],
    sessionCorrect:      Math.min(rawCorrect, rawTotal),   // can't exceed sessionTotal
    sessionTotal:        Math.min(rawTotal, 99),           // sanity cap
    sessionQuestionIds:  validIds,
    sessionQuestionIndex: rawIdx,
    currentTier:    typeof raw.currentTier === 'string' && raw.currentTier.length > 0
      ? raw.currentTier
      : 'Beginner',
    unlockedTiers:  Array.isArray(raw.unlockedTiers)
      ? raw.unlockedTiers.filter((t): t is string => typeof t === 'string' && t.length > 0)
      : ['Beginner'],
    completedTiers: Array.isArray(raw.completedTiers)
      ? raw.completedTiers.filter((t): t is string => typeof t === 'string' && t.length > 0)
      : [],
  };
}

// ─── Guest ───────────────────────────────────────────────────────────────────

export async function loadGuestProgress(): Promise<PokerChallengeProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(GUEST_KEY);
    return raw ? parseRawProgress(raw) : null;
  } catch {
    return null;
  }
}

export async function saveGuestProgress(progress: PokerChallengeProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_KEY, serializeProgress(progress));
  } catch {}
}

export async function clearGuestProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GUEST_KEY);
  } catch {}
}

// ─── Authenticated user ───────────────────────────────────────────────────────
// Uses AsyncStorage keyed by userId for now. Swap internals for API calls later.

export async function loadUserProgress(userId: string): Promise<PokerChallengeProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY_PREFIX + userId);
    return raw ? parseRawProgress(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUserProgress(userId: string, progress: PokerChallengeProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY_PREFIX + userId, serializeProgress(progress));
  } catch {}
}

export async function clearUserProgress(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY_PREFIX + userId);
  } catch {}
}
