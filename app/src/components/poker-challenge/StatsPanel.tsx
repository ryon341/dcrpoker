import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import type { PokerStats } from './stats';
import { getAccuracyPercent } from './stats';
import { getTitleForLevel } from './titleSystem';

interface Props {
  stats: PokerStats;
  level: number;
}

export function StatsPanel({ stats, level }: Props) {
  const [expanded, setExpanded] = useState(false);
  const title    = getTitleForLevel(level);
  const accuracy = getAccuracyPercent(stats);

  return (
    <View style={s.outer}>
      {/* Collapsed header row — always visible */}
      <TouchableOpacity style={s.header} onPress={() => setExpanded(v => !v)} activeOpacity={0.75}>
        <View style={s.headerLeft}>
          <Text style={s.titleLabel}>{title}</Text>
          <Text style={s.sep}>·</Text>
          <Text style={s.streakText}>🔥 {stats.currentStreak}</Text>
        </View>
        <Text style={s.toggle}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Expanded detail rows */}
      {expanded && (
        <View style={s.body}>
          <StatRow label="Accuracy"     value={`${accuracy}%`} />
          <StatRow label="Streak"       value={String(stats.currentStreak)} />
          <StatRow label="Best Streak"  value={String(stats.bestStreak)} />
          <StatRow label="Hands Played" value={String(stats.totalHandsPlayed)} />
          <StatRow label="Highest Lvl"  value={String(stats.highestLevelReached)} />
        </View>
      )}
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  outer:      { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleLabel: { color: T.gold, fontSize: 12, fontWeight: '700' },
  sep:        { color: T.muted, fontSize: 12 },
  streakText: { color: T.white, fontSize: 12, fontWeight: '600' },
  toggle:     { color: T.muted, fontSize: 10 },
  body:       { paddingHorizontal: 14, paddingBottom: 10, gap: 4 },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel:   { color: T.muted, fontSize: 12 },
  rowValue:   { color: T.white, fontSize: 12, fontWeight: '600' },
});
