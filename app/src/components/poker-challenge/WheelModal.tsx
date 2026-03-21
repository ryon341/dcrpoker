import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { spinWheelResult, getWheelSlots } from './wheel';

interface Props {
  visible: boolean;
  onResult: (pts: number) => void;
}

export function WheelModal({ visible, onResult }: Props) {
  const [spun, setSpun] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  function handleSpin() {
    const pts = spinWheelResult();
    setResult(pts);
    setSpun(true);
  }

  function handleClaim() {
    if (result !== null) {
      onResult(result);
      // reset local state for next time
      setSpun(false);
      setResult(null);
    }
  }

  const positive = result !== null && result >= 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>🎡  Bonus Wheel!</Text>
          <Text style={s.sub}>You've completed 15 challenges. Time for a bonus!</Text>

          {/* Wheel image */}
          <View style={s.wheelWrap}>
            <Image source={require('../../../assets/wheel.png')} style={s.wheel} resizeMode="contain" />
            <Image source={require('../../../assets/wheel-pointer.png')} style={s.pointer} resizeMode="contain" />
          </View>

          {/* Result or Spin */}
          {!spun ? (
            <TouchableOpacity style={s.spinBtn} onPress={handleSpin} activeOpacity={0.8}>
              <Image source={require('../../../assets/spin-button.png')} style={s.spinBtnBg} resizeMode="stretch" />
              <Text style={s.spinBtnText}>SPIN!</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.resultWrap}>
              <Text style={s.resultLabel}>You won:</Text>
              <Text style={[s.resultValue, positive ? s.pos : s.neg]}>
                {positive ? '+' : ''}{result} pts
              </Text>
              <TouchableOpacity style={s.claimBtn} onPress={handleClaim} activeOpacity={0.8}>
                <Text style={s.claimBtnText}>Claim & Continue →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:         { width: '100%', maxWidth: 400, backgroundColor: '#111115', borderRadius: 20, borderWidth: 1, borderColor: T.borderAlt, padding: 24, alignItems: 'center', gap: 16 },
  title:        { color: T.gold, fontSize: 24, fontWeight: 'bold' },
  sub:          { color: T.muted, fontSize: 14, textAlign: 'center' },
  wheelWrap:    { position: 'relative', width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  wheel:        { width: 200, height: 200 },
  pointer:      { position: 'absolute', top: -14, width: 30, height: 44 },
  spinBtn:      { width: 160, height: 56, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  spinBtnBg:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, width: '100%', height: '100%' },
  spinBtnText:  { color: T.white, fontWeight: 'bold', fontSize: 20, letterSpacing: 1, zIndex: 1 },
  resultWrap:   { alignItems: 'center', gap: 10 },
  resultLabel:  { color: T.silver, fontSize: 16 },
  resultValue:  { fontSize: 40, fontWeight: 'bold' },
  pos:          { color: '#4caf50' },
  neg:          { color: '#e94560' },
  claimBtn:     { backgroundColor: T.gold, paddingHorizontal: 32, paddingVertical: 13, borderRadius: 22, marginTop: 6 },
  claimBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
