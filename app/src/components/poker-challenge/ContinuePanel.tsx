import { useRef, useEffect } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  scoreDelta: number;
  heroWins:   boolean;
  streak:     number;
  onContinue: () => void;
  showHandOutcome?: boolean;
}

export function ContinuePanel({ scoreDelta, heroWins, streak, onContinue, showHandOutcome = true }: Props) {
  const fadeAnim      = useRef(new Animated.Value(0)).current;
  const slideAnim     = useRef(new Animated.Value(12)).current;
  const deltaPositive = scoreDelta >= 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.outer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Hand outcome */}
      <View style={[s.outcome, heroWins ? s.outcomeWin : s.outcomeLose]}>
        <Text style={[s.outcomeText, heroWins ? s.outcomeWinText : s.outcomeLoseText]}>
          {showHandOutcome
            ? (heroWins ? '🏆 You Win the Hand' : '💀 You Lose the Hand')
            : (scoreDelta >= 0 ? '✅ Correct Answer' : '❌ Incorrect Answer')}
        </Text>
      </View>

      {/* Score delta */}
      <View style={s.delta}>
        <Text style={s.deltaLabel}>Points</Text>
        <Text style={[s.deltaValue, deltaPositive ? s.pos : s.neg]}>
          {deltaPositive ? '+' : ''}{scoreDelta}
        </Text>
      </View>

      {/* Streak feedback */}
      {streak >= 2 && (
        <Text style={s.streakLine}>🔥 {streak} in a row</Text>
      )}
      {scoreDelta < 0 && streak === 0 && (
        <Text style={s.streakBroken}>Streak broken</Text>
      )}

      {/* Continue */}
      <TouchableOpacity style={s.btn} onPress={onContinue} activeOpacity={0.8}>
        <Text style={s.btnText}>Continue →</Text>
      </TouchableOpacity>
    </Animated.View>
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
  streakLine:    { color: T.gold, fontSize: 13, fontWeight: '600' },
  streakBroken:  { color: T.muted, fontSize: 12 },
  btn:           { backgroundColor: T.gold, paddingHorizontal: 40, paddingVertical: 14, borderRadius: 24 },
  btnText:       { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
