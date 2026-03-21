// ─── Daily Challenge Storage (TC057) ─────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';

export type DailyChallengeAnswer = {
  challengeId:    string;
  selectedAnswer: 'yes' | 'no';
  isCorrect:      boolean;
  heroWins:       boolean;
  delta:          number;
};

export type DailyChallengeProgress = {
  dailyId:      string;           // "YYYY-MM-DD"
  completed:    boolean;
  currentIndex: number;           // next hand index to play (0–4)
  score:        number;
  answers:      DailyChallengeAnswer[];
  completedAt?: string | null;
};

const DAILY_GUEST_KEY       = 'dcr_poker_daily_guest';
const DAILY_USER_KEY_PREFIX = 'dcr_poker_daily_user_';

function key(userId?: string | null): string {
  return userId ? DAILY_USER_KEY_PREFIX + userId : DAILY_GUEST_KEY;
}

export async function loadDailyProgress(
  userId?: string | null,
): Promise<DailyChallengeProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as DailyChallengeProgress) : null;
  } catch {
    return null;
  }
}

export async function saveDailyProgress(
  progress: DailyChallengeProgress,
  userId?: string | null,
): Promise<void> {
  try {
    await AsyncStorage.setItem(key(userId), JSON.stringify(progress));
  } catch {}
}

export async function clearDailyProgress(userId?: string | null): Promise<void> {
  try {
    await AsyncStorage.removeItem(key(userId));
  } catch {}
}
