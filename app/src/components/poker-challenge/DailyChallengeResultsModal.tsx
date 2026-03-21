import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import type { DailyChallengeAnswer } from './dailyStorage';
import { DAILY_HAND_COUNT } from './dailyChallenge';

interface Props {
  visible:  boolean;
  score:    number;
  answers:  DailyChallengeAnswer[];
  onClose:  () => void;
}

export function DailyChallengeResultsModal({ visible, score, answers, onClose }: Props) {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue:         1,
        useNativeDriver: true,
        speed:           8,
        bounciness:      6,
      }).start();
    }
  }, [visible]);

  const cardScale   = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });
  const cardOpacity = cardAnim;

  const correctCount = answers.filter(a => a.isCorrect).length;
  const winCount     = answers.filter(a => a.heroWins).length;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.backdrop}>
        <Animated.View style={[s.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          <View style={s.glow} pointerEvents="none" />

          <Text style={s.emoji}>🗓️</Text>
          <Text style={s.pill}>DAILY CHALLENGE COMPLETE</Text>
          <Text style={s.heading}>Nice work!</Text>

          {/* Score */}
          <View style={s.scoreBox}>
            <Text style={s.scoreLabel}>Daily Score</Text>
            <Text style={s.scoreValue}>{score}</Text>
          </View>

          {/* Stat row */}
          <View style={s.statRow}>
            <StatCell label="Correct" value={`${correctCount} / ${DAILY_HAND_COUNT}`} color="#4caf50" />
            <StatCell label="Hands Won" value={`${winCount} / ${DAILY_HAND_COUNT}`} color={T.gold} />
          </View>

          <View style={s.divider} />

          <Text style={s.comeback}>Come back tomorrow for a new challenge</Text>

          <TouchableOpacity style={s.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.btnText}>Back to Lobby</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

function StatCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={ss.cell}>
      <Text style={ss.cellLabel}>{label}</Text>
      <Text style={[ss.cellValue, { color }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card:       { width: '100%', maxWidth: 380, backgroundColor: '#100e0c', borderRadius: 24, borderWidth: 2, borderColor: T.gold, padding: 28, alignItems: 'center', gap: 10, overflow: 'hidden' },
  glow:       { position: 'absolute', top: -80, left: -80, right: -80, height: 240, backgroundColor: 'rgba(251,191,36,0.06)', borderRadius: 400 },
  emoji:      { fontSize: 44, marginBottom: 2 },
  pill:       { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 2.5, backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100 },
  heading:    { color: T.white, fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  scoreBox:   { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 36, paddingVertical: 12, marginVertical: 4 },
  scoreLabel: { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 2 },
  scoreValue: { color: T.gold, fontSize: 36, fontWeight: 'bold' },
  statRow:    { flexDirection: 'row', gap: 12 },
  divider:    { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', marginVertical: 4 },
  comeback:   { color: T.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  btn:        { backgroundColor: T.gold, paddingHorizontal: 32, paddingVertical: 15, borderRadius: 24, marginTop: 6, alignSelf: 'stretch', alignItems: 'center' },
  btnText:    { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});

const ss = StyleSheet.create({
  cell:       { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, paddingVertical: 10 },
  cellLabel:  { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  cellValue:  { fontSize: 18, fontWeight: 'bold' },
});
