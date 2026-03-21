import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  challengeNumber: number;
  wheelEvery:      number;
}

export function BonusWheelPanel({ challengeNumber, wheelEvery }: Props) {
  const challengesUntilSpin = wheelEvery - (challengeNumber % wheelEvery);
  const spinAvailable = challengeNumber > 0 && challengeNumber % wheelEvery === 0;

  return (
    <View style={s.outer}>
      <Text style={s.heading}>BONUS WHEEL</Text>

      {/* Wheel + pointer */}
      <View style={s.wheelWrap}>
        <Image source={require('../../../assets/wheel.png')} style={s.wheel} resizeMode="contain" />
        <Image source={require('../../../assets/wheel-pointer.png')} style={s.pointer} resizeMode="contain" />
      </View>

      {spinAvailable ? (
        <TouchableOpacity style={s.spinBtn} activeOpacity={0.8}>
          <Image source={require('../../../assets/spin-button.png')} style={s.spinBtnBg} resizeMode="stretch" />
          <Text style={s.spinBtnText}>SPIN!</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.countdown}>
          <Text style={s.countdownText}>{challengesUntilSpin} challenges until next spin</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  outer:        { alignItems: 'center', gap: 12, paddingVertical: 12 },
  heading:      { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  wheelWrap:    { position: 'relative', width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  wheel:        { width: 180, height: 180 },
  pointer:      { position: 'absolute', top: -12, width: 28, height: 40 },
  spinBtn:      { width: 140, height: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  spinBtnBg:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 10, width: '100%', height: '100%' },
  spinBtnText:  { color: T.white, fontWeight: 'bold', fontSize: 18, letterSpacing: 1, zIndex: 1 },
  countdown:    { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, borderWidth: 1, borderColor: T.border },
  countdownText:{ color: T.muted, fontSize: 13 },
});
