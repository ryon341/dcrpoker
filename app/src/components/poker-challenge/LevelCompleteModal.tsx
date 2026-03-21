import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  visible: boolean;
  level: number;
  onAdvance: () => void;
}

export function LevelCompleteModal({ visible, level, onAdvance }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.backdrop}>
        <View style={s.card}>
          {/* Glow decoration */}
          <View style={s.glow} pointerEvents="none" />

          <Text style={s.badge}>LEVEL {level}</Text>
          <Text style={s.title}>Complete! 🏆</Text>
          <Text style={s.sub}>
            You've mastered Level {level}. Your score carries forward.
          </Text>

          <View style={s.divider} />

          <Text style={s.nextLabel}>Next up</Text>
          <Text style={s.next}>Level {level + 1}</Text>

          <TouchableOpacity style={s.btn} onPress={onAdvance} activeOpacity={0.8}>
            <Text style={s.btnText}>Advance to Level {level + 1} →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card:     { width: '100%', maxWidth: 380, backgroundColor: '#100e0c', borderRadius: 24, borderWidth: 2, borderColor: T.gold, padding: 32, alignItems: 'center', gap: 12, overflow: 'hidden' },
  glow:     { position: 'absolute', top: -60, left: -60, right: -60, height: 200, backgroundColor: 'rgba(251,191,36,0.07)', borderRadius: 300 },
  badge:    { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2.5, backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100 },
  title:    { color: T.white, fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  sub:      { color: T.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  divider:  { height: 1, backgroundColor: T.border, alignSelf: 'stretch' },
  nextLabel:{ color: T.muted, fontSize: 12, letterSpacing: 1 },
  next:     { color: T.gold, fontSize: 22, fontWeight: 'bold' },
  btn:      { backgroundColor: T.gold, paddingHorizontal: 32, paddingVertical: 15, borderRadius: 24, marginTop: 8, alignSelf: 'stretch', alignItems: 'center' },
  btnText:  { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
