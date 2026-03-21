import AsyncStorage from '@react-native-async-storage/async-storage';

const HAPTICS_ENABLED_KEY = 'dcr_haptics_enabled';

// In-memory cache
let _hapticsEnabled: boolean | null = null;

export async function getHapticsEnabled(): Promise<boolean> {
  if (_hapticsEnabled !== null) return _hapticsEnabled;
  try {
    const raw = await AsyncStorage.getItem(HAPTICS_ENABLED_KEY);
    _hapticsEnabled = raw === null ? true : raw === 'true';
  } catch {
    _hapticsEnabled = true;
  }
  return _hapticsEnabled;
}

export async function setHapticsEnabled(enabled: boolean): Promise<void> {
  _hapticsEnabled = enabled;
  try {
    await AsyncStorage.setItem(HAPTICS_ENABLED_KEY, String(enabled));
  } catch {
    // silent
  }
}

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(pattern); } catch { /* silent */ }
  }
}

async function haptic(pattern: number | number[]): Promise<void> {
  try {
    const enabled = await getHapticsEnabled();
    if (!enabled) return;
    vibrate(pattern);
  } catch {
    // never crash
  }
}

export function triggerTapHaptic():       void { haptic(8); }
export function triggerCorrectHaptic():   void { haptic([20, 40, 20]); }
export function triggerIncorrectHaptic(): void { haptic([40, 20, 40]); }
export function triggerRewardHaptic():    void { haptic([30, 30, 60]); }
export function triggerLevelUpHaptic():   void { haptic([60, 30, 60, 30, 120]); }
