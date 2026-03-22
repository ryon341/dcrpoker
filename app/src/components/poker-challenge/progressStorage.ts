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
};

const GUEST_KEY        = 'dcr_poker_challenge_guest';
const USER_KEY_PREFIX  = 'dcr_poker_challenge_user_';

function normalizeProgress(raw: Partial<PokerChallengeProgress>): PokerChallengeProgress {
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
  };
}

// ─── Guest ───────────────────────────────────────────────────────────────────

export async function loadGuestProgress(): Promise<PokerChallengeProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(GUEST_KEY);
    return raw ? normalizeProgress(JSON.parse(raw) as Partial<PokerChallengeProgress>) : null;
  } catch {
    return null;
  }
}

export async function saveGuestProgress(progress: PokerChallengeProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(progress));
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
    return raw ? normalizeProgress(JSON.parse(raw) as Partial<PokerChallengeProgress>) : null;
  } catch {
    return null;
  }
}

export async function saveUserProgress(userId: string, progress: PokerChallengeProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY_PREFIX + userId, JSON.stringify(progress));
  } catch {}
}

export async function clearUserProgress(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY_PREFIX + userId);
  } catch {}
}
