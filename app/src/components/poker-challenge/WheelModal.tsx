import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Modal, Animated, Easing, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { getWheelSlots } from './wheel';
import { playSound } from './gameAudio';
import { triggerTapHaptic, triggerRewardHaptic } from './gameHaptics';

const WHEEL_POOL = getWheelSlots();
const SLOT_DEG   = 360 / WHEEL_POOL.length;

interface Props {
  visible: boolean;
  onResult: (pts: number) => void;
}

export function WheelModal({ visible, onResult }: Props) {
  const wheelRot  = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun]         = useState(false);
  const [result, setResult]     = useState<number | null>(null);

  // Reset wheel state each time modal opens
  useEffect(() => {
    if (visible) {
      setSpun(false);
      setSpinning(false);
      setResult(null);
      wheelRot.setValue(0);
    }
  }, [visible]);

  function handleSpin() {
    if (spinning || spun) return;
    playSound('tap');
    triggerTapHaptic();
    const idx  = Math.floor(Math.random() * WHEEL_POOL.length);
    const pts  = WHEEL_POOL[idx];
    const target = 5 * 360 + idx * SLOT_DEG;

    setSpinning(true);
    wheelRot.setValue(0);
    Animated.timing(wheelRot, {
      toValue:  target,
      duration: 3200,
      easing:   Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      setSpun(true);
      setResult(pts);
      playSound('wheelReward');
      triggerRewardHaptic();
    });
  }

  function handleClaim() {
    if (result !== null) {
      playSound('tap');
      triggerTapHaptic();
      onResult(result);
      setSpun(false);
      setResult(null);
      wheelRot.setValue(0);
    }
  }

  const rotInterp = wheelRot.interpolate({
    inputRange:      [0, 360],
    outputRange:     ['0deg', '360deg'],
    extrapolateRight: 'extend',
  });

  const positive = result !== null && result >= 0;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>🎡  Bonus Wheel!</Text>
          <Text style={s.sub}>
            {spinning
              ? 'Spinning…'
              : spun
              ? 'Result locked in!'
              : "You've earned a bonus spin — make it count!"}
          </Text>

          {/* Animated wheel + fixed pointer */}
          <View style={s.wheelWrap}>
            <Animated.Image
              source={require('../../../assets/wheel.png')}
              style={[s.wheel, { transform: [{ rotate: rotInterp }] }]}
              resizeMode="contain"
            />
            <Image
              source={require('../../../assets/wheel-pointer.png')}
              style={s.pointer}
              resizeMode="contain"
            />
          </View>

          {!spun ? (
            <Pressable
              style={({ pressed }) => [s.spinBtn, (pressed || spinning) && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
              onPress={handleSpin}
              disabled={spinning}
            >
              <Image source={require('../../../assets/spin-button.png')} style={s.spinBtnBg} resizeMode="stretch" />
              <Text style={s.spinBtnText}>{spinning ? '…' : 'SPIN!'}</Text>
            </Pressable>
          ) : (
            <View style={s.resultWrap}>
              <Text style={s.resultLabel}>Result</Text>
              <Text style={[s.resultValue, positive ? s.pos : s.neg]}>
                {positive ? '+' : ''}{result} pts
              </Text>
              <Pressable
                style={({ pressed }) => [s.claimBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                onPress={handleClaim}
              >
                <Text style={s.claimBtnText}>Claim & Continue →</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.90)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:         { width: '100%', maxWidth: 400, backgroundColor: '#111115', borderRadius: 20, borderWidth: 1, borderColor: T.borderAlt, padding: 24, alignItems: 'center', gap: 16 },
  title:        { color: T.gold, fontSize: 24, fontWeight: 'bold' },
  sub:          { color: T.muted, fontSize: 13, textAlign: 'center', minHeight: 18 },
  wheelWrap:    { position: 'relative', width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  wheel:        { width: 220, height: 220 },
  pointer:      { position: 'absolute', top: -16, width: 30, height: 44 },
  spinBtn:      { width: 160, height: 56, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  spinBtnBg:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, width: '100%', height: '100%' },
  spinBtnText:  { color: T.white, fontWeight: 'bold', fontSize: 20, letterSpacing: 1, zIndex: 1 },
  resultWrap:   { alignItems: 'center', gap: 10 },
  resultLabel:  { color: T.silver, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  resultValue:  { fontSize: 48, fontWeight: 'bold', letterSpacing: -1 },
  pos:          { color: '#4caf50' },
  neg:          { color: '#e94560' },
  claimBtn:     { backgroundColor: T.gold, paddingHorizontal: 32, paddingVertical: 13, borderRadius: 22, marginTop: 6 },
  claimBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
