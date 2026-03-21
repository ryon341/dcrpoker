import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: string;
}

export const StatsCard = memo(function StatsCard({ label, value, subtext, icon }: StatsCardProps) {
  return (
    <View style={s.card}>
      {icon ? (
        <Text style={s.icon}>{icon}</Text>
      ) : null}
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
      {subtext ? <Text style={s.subtext}>{subtext}</Text> : null}
    </View>
  );
});

const s = StyleSheet.create({
  card:    { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 14, gap: 4 },
  icon:    { fontSize: 20 },
  label:   { color: T.muted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  value:   { color: T.gold, fontSize: 26, fontWeight: '800' },
  subtext: { color: T.muted, fontSize: 11 },
});
