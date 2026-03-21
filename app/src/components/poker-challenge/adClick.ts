import { Linking } from 'react-native';

const DCR_URL = 'https://www.deercreekroad.com';

export async function openDeerCreekRoad(): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(DCR_URL);
    if (supported) {
      await Linking.openURL(DCR_URL);
    }
  } catch (e) {
    console.warn('[adClick] Failed to open DeerCreekRoad:', e);
  }
}
