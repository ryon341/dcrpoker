import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface ScoreTable {
  correctWin:   number;
  correctLose:  number;
  incorrectWin: number;
  incorrectLose: number;
}

interface Props {
  scoreTable: ScoreTable;
}

function Row({ label, value }: { label: string; value: number }) {
  const positive = value >= 0;
  return (
    <View style={r.row}>
      <Text style={r.label}>{label}</Text>
      <Text style={[r.value, positive ? r.pos : r.neg]}>
        {positive ? '+' : ''}{value}
      </Text>
    </View>
  );
}

export const ScoreRulesPanel = memo(function ScoreRulesPanel({ scoreTable }: Props) {
  return (
    <View style={s.outer}>
      <Text style={s.heading}>SCORING</Text>
      <Row label="Correct + Win"    value={scoreTable.correctWin}   />
      <Row label="Correct + Lose"   value={scoreTable.correctLose}  />
      <Row label="Incorrect + Win"  value={scoreTable.incorrectWin} />
      <Row label="Incorrect + Lose" value={scoreTable.incorrectLose} />
    </View>
  );
});

const s = StyleSheet.create({
  outer:   { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: T.border, padding: 14, gap: 6 },
  heading: { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginBottom: 4 },
});

const r = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: T.silver, fontSize: 13 },
  value: { fontSize: 13, fontWeight: 'bold' },
  pos:   { color: '#4caf50' },
  neg:   { color: '#e94560' },
});
