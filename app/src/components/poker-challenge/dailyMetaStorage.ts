import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyMeta } from './dailyStreak';
import { getInitialDailyMeta } from './dailyStreak';

const GUEST_KEY  = 'dcr_poker_daily_meta_guest';
const userKey    = (userId: string) => `dcr_poker_daily_meta_user_${userId}`;

function resolveKey(userId?: string | null): string {
  return userId ? userKey(userId) : GUEST_KEY;
}

export async function loadDailyMeta(userId?: string | null): Promise<DailyMeta> {
  try {
    const raw = await AsyncStorage.getItem(resolveKey(userId));
    if (!raw) return getInitialDailyMeta();
    return { ...getInitialDailyMeta(), ...(JSON.parse(raw) as Partial<DailyMeta>) };
  } catch {
    return getInitialDailyMeta();
  }
}

export async function saveDailyMeta(
  meta: DailyMeta,
  userId?: string | null,
): Promise<void> {
  try {
    await AsyncStorage.setItem(resolveKey(userId), JSON.stringify(meta));
  } catch {
    // silent
  }
}

export async function clearDailyMeta(userId?: string | null): Promise<void> {
  try {
    await AsyncStorage.removeItem(resolveKey(userId));
  } catch {
    // silent
  }
}
