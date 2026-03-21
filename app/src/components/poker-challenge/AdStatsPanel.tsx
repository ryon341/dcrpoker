import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { getAdAnalytics, type AdAnalytics } from './adAnalytics';

export function AdStatsPanel() {
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);

  useEffect(() => {
    getAdAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) return null;

  return (
    <View style={s.panel}>
      <Text style={s.heading}>Ad Performance</Text>
      <View style={s.row}>
        <View style={s.stat}>
          <Text style={s.value}>{analytics.impressions}</Text>
          <Text style={s.label}>Impressions</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.value}>{analytics.clicks}</Text>
          <Text style={s.label}>Clicks</Text>
        </View>
        <View style={s.stat}>
          <Text style={[s.value, { color: analytics.ctr >= 5 ? T.green : analytics.ctr > 0 ? T.gold : T.muted }]}>
            {analytics.ctr}%
          </Text>
          <Text style={s.label}>CTR</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.value}>{analytics.completions}</Text>
          <Text style={s.label}>Completions</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  panel:   { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 14, gap: 10 },
  heading: { color: T.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  row:     { flexDirection: 'row', gap: 8 },
  stat:    { flex: 1, alignItems: 'center', gap: 3 },
  value:   { color: T.gold, fontSize: 18, fontWeight: '800' },
  label:   { color: T.muted, fontSize: 10, textAlign: 'center' },
});
