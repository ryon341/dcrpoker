import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthReturnTarget = {
  route: string;
  source: 'level6-gate' | 'manual-login';
  pendingAdvanceLevel?: boolean;
  savedAt: string;
};

const AUTH_RETURN_KEY = 'dcr_poker_auth_return_target';
const MAX_AGE_MS      = 15 * 60 * 1000; // 15 minutes

export async function setAuthReturnTarget(
  payload: Omit<AuthReturnTarget, 'savedAt'>,
): Promise<void> {
  try {
    const target: AuthReturnTarget = { ...payload, savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(AUTH_RETURN_KEY, JSON.stringify(target));
  } catch {
    // silent
  }
}

export async function getAuthReturnTarget(): Promise<AuthReturnTarget | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_RETURN_KEY);
    if (!raw) return null;
    const target = JSON.parse(raw) as AuthReturnTarget;
    if (Date.now() - Date.parse(target.savedAt) > MAX_AGE_MS) {
      await AsyncStorage.removeItem(AUTH_RETURN_KEY);
      return null;
    }
    return target;
  } catch {
    return null;
  }
}

export async function clearAuthReturnTarget(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_RETURN_KEY);
  } catch {
    // silent
  }
}
