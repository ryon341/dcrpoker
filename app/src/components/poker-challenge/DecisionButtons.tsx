import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { playSound } from './gameAudio';
import { triggerTapHaptic } from './gameHaptics';

interface Props {
  onYes: () => void;
  onNo:  () => void;
  disabled?: boolean;
  selected?: 'yes' | 'no' | null;
}

export function DecisionButtons({ onYes, onNo, disabled = false, selected = null }: Props) {
  return (
    <View style={s.row}>
      <Pressable
        onPress={disabled ? undefined : () => { playSound('tap'); triggerTapHaptic(); onYes(); }}
        style={({ pressed }) =>
          selected === 'yes' ? [s.btn, s.btnSelected]
          : disabled         ? [s.btn, s.btnDimmed]
          : pressed          ? [s.btn, s.btnPressed]
          : s.btn
        }
      >
        <Image source={require('../../../assets/bn-primary-green.png')} style={s.bg} resizeMode="stretch" />
        <Text style={[s.label, disabled && selected !== 'yes' && s.labelDimmed]}>YES</Text>
      </Pressable>

      <Pressable
        onPress={disabled ? undefined : () => { playSound('tap'); triggerTapHaptic(); onNo(); }}
        style={({ pressed }) =>
          selected === 'no' ? [s.btn, s.btnSelected]
          : disabled        ? [s.btn, s.btnDimmed]
          : pressed         ? [s.btn, s.btnPressed]
          : s.btn
        }
      >
        <Image source={require('../../../assets/brn-secondary-red.png')} style={s.bg} resizeMode="stretch" />
        <Text style={[s.label, disabled && selected !== 'no' && s.labelDimmed]}>NO</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row:         { flexDirection: 'row', gap: 16, justifyContent: 'center', paddingVertical: 12 },
  btn:         { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  btnSelected: { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', transform: [{ scale: 1.05 }] },
  btnDimmed:   { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0.35 },
  btnPressed:  { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', transform: [{ scale: 0.94 }], opacity: 0.85 },
  bg:          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 10 },
  label:       { color: T.white, fontWeight: 'bold', fontSize: 18, letterSpacing: 1, zIndex: 1 },
  labelDimmed: { opacity: 0.5 },
});
