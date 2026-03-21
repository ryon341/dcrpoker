import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  onYes: () => void;
  onNo:  () => void;
  disabled?: boolean;
  selected?: 'yes' | 'no' | null;
}

export function DecisionButtons({ onYes, onNo, disabled = false, selected = null }: Props) {
  return (
    <View style={s.row}>
      <TouchableOpacity
        style={[s.btn, selected === 'yes' && s.btnSelected, (disabled && selected !== 'yes') && s.btnDimmed]}
        onPress={disabled ? undefined : onYes}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Image source={require('../../../assets/bn-primary-green.png')} style={s.bg} resizeMode="stretch" />
        <Text style={[s.label, (disabled && selected !== 'yes') && s.labelDimmed]}>YES</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, selected === 'no' && s.btnSelected, (disabled && selected !== 'no') && s.btnDimmed]}
        onPress={disabled ? undefined : onNo}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Image source={require('../../../assets/brn-secondary-red.png')} style={s.bg} resizeMode="stretch" />
        <Text style={[s.label, (disabled && selected !== 'no') && s.labelDimmed]}>NO</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row:          { flexDirection: 'row', gap: 16, justifyContent: 'center', paddingVertical: 12 },
  btn:          { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  btnSelected:  { transform: [{ scale: 1.05 }] },
  btnDimmed:    { opacity: 0.35 },
  bg:           { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 10 },
  label:        { color: T.white, fontWeight: 'bold', fontSize: 18, letterSpacing: 1, zIndex: 1 },
  labelDimmed:  { opacity: 0.5 },
});
