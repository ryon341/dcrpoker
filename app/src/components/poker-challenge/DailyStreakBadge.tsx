import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

type Props = {
  streak:    number;
  bestStreak?: number;
  badgeLabel?: string | null;
  compact?:  boolean;
};

export const DailyStreakBadge = memo(function DailyStreakBadge({ streak, bestStreak, badgeLabel, compact = false }: Props) {
  if (streak <= 0) return null;

  return (
    <View style={[s.wrap, compact && s.wrapCompact]}>
      <View style={s.streakRow}>
        <Text style={s.flame}>🔥</Text>
        <Text style={s.streakText}>
          Daily Streak: <Text style={s.streakNum}>{streak}</Text>
        </Text>
      </View>

      {badgeLabel && (
        <View style={s.badgeChip}>
          <Text style={s.badgeText}>🏅 {badgeLabel}</Text>
        </View>
      )}

      {!compact && bestStreak != null && bestStreak > streak && (
        <Text style={s.bestText}>Best: {bestStreak}</Text>
      )}
    </View>
  );
});

const s = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    gap: 4,
  },
  wrapCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flame:       { fontSize: 14 },
  streakText:  { color: T.muted, fontSize: 12, fontWeight: '600' },
  streakNum:   { color: T.gold,  fontWeight: '800' },
  badgeChip: {
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.28)',
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  badgeText: { color: T.gold, fontSize: 11, fontWeight: '700' },
  bestText:  { color: T.muted, fontSize: 11 },
});
