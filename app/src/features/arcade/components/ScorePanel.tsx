import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../../../components/ui/Theme';

interface ScorePanelProps {
  score: number;
  streak: number;
  round?: number;
  totalRounds?: number;
  timerLabel?: string;
}

export function ScorePanel({ score, streak, round, totalRounds, timerLabel }: ScorePanelProps) {
  return (
    <View style={s.row}>
      <Chip label="Score" value={String(score)} />
      <Chip label="Streak" value={`🔥 ${streak}`} />
      {round != null && totalRounds != null && (
        <Chip label="Round" value={`${round}/${totalRounds}`} />
      )}
      {timerLabel != null && (
        <Chip label="Time" value={timerLabel} />
      )}
    </View>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.chip}>
      <Text style={s.chipLabel}>{label}</Text>
      <Text style={s.chipValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row:       { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16 },
  chip:      { backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', minWidth: 64 },
  chipLabel: { color: T.muted, fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  chipValue: { color: T.white, fontSize: 15, fontWeight: 'bold' },
});
