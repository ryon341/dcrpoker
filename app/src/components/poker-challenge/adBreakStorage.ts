import AsyncStorage from '@react-native-async-storage/async-storage';

export type AdBreakState = {
  mainLastShownAt?: string | null;
  dailyLastShownAt?: string | null;
  mainSessionCount?: number;
};

const AD_BREAK_KEY = 'dcr_poker_ad_break_state';

export async function loadAdBreakState(): Promise<AdBreakState> {
  try {
    const raw = await AsyncStorage.getItem(AD_BREAK_KEY);
    return raw ? (JSON.parse(raw) as AdBreakState) : {};
  } catch {
    return {};
  }
}

export async function saveAdBreakState(state: AdBreakState): Promise<void> {
  try {
    await AsyncStorage.setItem(AD_BREAK_KEY, JSON.stringify(state));
  } catch {
    // silent
  }
}

export async function markAdShown(mode: 'main' | 'daily'): Promise<void> {
  const state = await loadAdBreakState();
  const key   = mode === 'main' ? 'mainLastShownAt' : 'dailyLastShownAt';
  await saveAdBreakState({ ...state, [key]: new Date().toISOString() });
}

function isSameDayLocal(dateStr: string): boolean {
  const last = new Date(dateStr);
  const now  = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth()    === now.getMonth()    &&
    last.getDate()     === now.getDate()
  );
}

/**
 * Main mode: show on first entry, then every 3rd session (session 1, 4, 7, ...).
 * Daily mode: show once per calendar day.
 * For main mode this function increments the session count as a side effect.
 */
export async function canShowAd(mode: 'main' | 'daily'): Promise<boolean> {
  const state = await loadAdBreakState();

  if (mode === 'daily') {
    const lastShown = state.dailyLastShownAt;
    if (!lastShown) return true;
    return !isSameDayLocal(lastShown);
  }

  // main mode: session-count based
  const newCount = (state.mainSessionCount ?? 0) + 1;
  await saveAdBreakState({ ...state, mainSessionCount: newCount });
  // Show on sessions 1, 4, 7, 10 ... (newCount % 3 === 1)
  return newCount % 3 === 1;
}
