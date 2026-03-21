import AsyncStorage from '@react-native-async-storage/async-storage';

export type AdBreakState = {
  mainLastShownAt?: string | null;
  dailyLastShownAt?: string | null;
};

const AD_BREAK_KEY = 'dcr_poker_ad_break_state';
const COOLDOWN_MS  = 10 * 60 * 1000; // 10 minutes

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

export async function canShowAd(mode: 'main' | 'daily'): Promise<boolean> {
  const state     = await loadAdBreakState();
  const lastShown = mode === 'main' ? state.mainLastShownAt : state.dailyLastShownAt;
  if (!lastShown) return true;
  return Date.now() - Date.parse(lastShown) > COOLDOWN_MS;
}
