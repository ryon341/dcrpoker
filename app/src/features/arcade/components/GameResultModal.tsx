import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { T } from '../../../components/ui/Theme';

interface GameResultModalProps {
  visible: boolean;
  score: number;
  bestStreak: number;
  highScore?: number;
  onPlayAgain: () => void;
  onBackToArcade: () => void;
  extra?: string;
}

export function GameResultModal({
  visible, score, bestStreak, highScore, onPlayAgain, onBackToArcade, extra,
}: GameResultModalProps) {
  const isNewHigh = highScore != null && score >= highScore;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.eyebrow}>Session Complete</Text>

          {isNewHigh && <Text style={s.newHigh}>🏆 New High Score!</Text>}

          <View style={s.statsRow}>
            <StatBox label="Score" value={String(score)} />
            <StatBox label="Best Streak" value={`🔥 ${bestStreak}`} />
            {highScore != null && <StatBox label="High Score" value={String(Math.max(score, highScore))} />}
          </View>

          {extra ? <Text style={s.extra}>{extra}</Text> : null}

          <TouchableOpacity style={s.primaryBtn} onPress={onPlayAgain} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.ghostBtn} onPress={onBackToArcade} activeOpacity={0.7}>
            <Text style={s.ghostBtnText}>Back to Arcade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card:      { width: '100%', maxWidth: 360, backgroundColor: '#1a1a1d', borderRadius: 28, borderWidth: 1, borderColor: T.cardBorder, padding: 28 },
  eyebrow:   { color: 'rgba(251,191,36,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 },
  newHigh:   { color: T.gold, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  statsRow:  { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 20 },
  statBox:   { flex: 1, backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 12, padding: 12, alignItems: 'center' },
  statLabel: { color: T.muted, fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { color: T.white, fontSize: 17, fontWeight: 'bold' },
  extra:     { color: T.silver, fontSize: 13, textAlign: 'center', marginBottom: 16 },
  primaryBtn:     { backgroundColor: T.gold, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
  ghostBtn:       { borderRadius: 14, borderWidth: 1, borderColor: T.cardBorder, paddingVertical: 13, alignItems: 'center' },
  ghostBtnText:   { color: T.silver, fontSize: 14, fontWeight: '500' },
});
