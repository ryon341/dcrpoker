import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  scoreDelta: number;
  heroWins: boolean;
  onContinue: () => void;
}

export function ContinuePanel({ scoreDelta, heroWins, onContinue }: Props) {
  const deltaPositive = scoreDelta >= 0;

  return (
    <View style={s.outer}>
      {/* Hand outcome */}
      <View style={[s.outcome, heroWins ? s.outcomeWin : s.outcomeLose]}>
        <Text style={[s.outcomeText, heroWins ? s.outcomeWinText : s.outcomeLoseText]}>
          {heroWins ? '🏆 You Win the Hand' : '💀 You Lose the Hand'}
        </Text>
      </View>

      {/* Score delta */}
      <View style={s.delta}>
        <Text style={s.deltaLabel}>Points</Text>
        <Text style={[s.deltaValue, deltaPositive ? s.pos : s.neg]}>
          {deltaPositive ? '+' : ''}{scoreDelta}
        </Text>
      </View>

      {/* Continue */}
      <TouchableOpacity style={s.btn} onPress={onContinue} activeOpacity={0.8}>
        <Text style={s.btnText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  outer:         { paddingHorizontal: 16, paddingVertical: 14, gap: 12, alignItems: 'center' },
  outcome:       { width: '100%', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  outcomeWin:    { backgroundColor: 'rgba(76,175,80,0.12)', borderColor: 'rgba(76,175,80,0.4)' },
  outcomeLose:   { backgroundColor: 'rgba(233,69,96,0.12)', borderColor: 'rgba(233,69,96,0.4)' },
  outcomeText:   { fontWeight: '700', fontSize: 15 },
  outcomeWinText:  { color: '#4caf50' },
  outcomeLoseText: { color: '#e94560' },
  delta:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deltaLabel:    { color: T.muted, fontSize: 14 },
  deltaValue:    { fontSize: 28, fontWeight: 'bold' },
  pos:           { color: '#4caf50' },
  neg:           { color: '#e94560' },
  btn:           { backgroundColor: T.gold, paddingHorizontal: 40, paddingVertical: 14, borderRadius: 24 },
  btnText:       { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
