export const AD_DURATION_SECONDS = 15;

export function getAdDuration(): number {
  return AD_DURATION_SECONDS;
}

export function getAdTriggerKey(mode: string): string {
  return `dcr_poker_ad_trigger_${mode}`;
}

export function shouldShowAdBreak(args: {
  mode: 'main' | 'daily';
  lastShownAt?: string | null;
}): boolean {
  if (!args.lastShownAt) return true;
  const COOLDOWN_MS = 10 * 60 * 1000;
  return Date.now() - Date.parse(args.lastShownAt) > COOLDOWN_MS;
}
