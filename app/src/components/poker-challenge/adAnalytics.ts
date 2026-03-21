import AsyncStorage from '@react-native-async-storage/async-storage';

export type AdEvent = {
  type: 'impression' | 'click' | 'complete' | 'skip';
  mode: 'main' | 'daily';
  timestamp: string;
};

export type AdAnalytics = {
  impressions: number;
  clicks: number;
  completions: number;
  skips: number;
  ctr: number; // percentage: clicks / impressions * 100
};

const AD_ANALYTICS_KEY = 'dcr_poker_ad_analytics';

export async function trackAdEvent(event: AdEvent): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(AD_ANALYTICS_KEY);
    const events: AdEvent[] = raw ? (JSON.parse(raw) as AdEvent[]) : [];
    events.push(event);
    await AsyncStorage.setItem(AD_ANALYTICS_KEY, JSON.stringify(events));
  } catch {
    // silent
  }
}

export async function getAdAnalytics(): Promise<AdAnalytics> {
  try {
    const raw = await AsyncStorage.getItem(AD_ANALYTICS_KEY);
    const events: AdEvent[] = raw ? (JSON.parse(raw) as AdEvent[]) : [];
    const impressions = events.filter(e => e.type === 'impression').length;
    const clicks      = events.filter(e => e.type === 'click').length;
    const completions = events.filter(e => e.type === 'complete').length;
    const skips       = events.filter(e => e.type === 'skip').length;
    const ctr         = impressions > 0 ? Math.round((clicks / impressions) * 100) : 0;
    return { impressions, clicks, completions, skips, ctr };
  } catch {
    return { impressions: 0, clicks: 0, completions: 0, skips: 0, ctr: 0 };
  }
}
