import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface StatsBarProps {
  percent: number;
  label?: string;
}

function barColor(pct: number): string {
  if (pct > 70) return T.green;
  if (pct >= 50) return T.gold;
  return T.red;
}

export const StatsBar = memo(function StatsBar({ percent, label }: StatsBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={s.wrap}>
      <View style={s.track}>
        <View style={[s.fill, { width: `${clamped}%` as any, backgroundColor: barColor(clamped) }]} />
      </View>
      {label ? <Text style={s.label}>{label}</Text> : null}
    </View>
  );
});

const s = StyleSheet.create({
  wrap:  { gap: 4 },
  track: { height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  fill:  { height: 10, borderRadius: 5 },
  label: { color: T.muted, fontSize: 11 },
});
