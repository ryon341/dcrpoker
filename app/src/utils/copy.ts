import { Platform } from 'react-native';

/**
 * Copy text to the clipboard.
 * On web: uses navigator.clipboard (requires HTTPS or localhost).
 * On native: uses a textarea hack as a fallback (expo-clipboard not installed).
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return;
  }
  // Native fallback — log warning (expo-clipboard not installed)
  console.warn('[copyToClipboard] Native clipboard not available without expo-clipboard');
}
