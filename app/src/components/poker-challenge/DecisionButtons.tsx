import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  onYes: () => void;
  onNo:  () => void;
}

export function DecisionButtons({ onYes, onNo }: Props) {
  return (
    <View style={s.row}>
      <TouchableOpacity style={s.btn} onPress={onYes} activeOpacity={0.8}>
        <Image source={require('../../../assets/bn-primary-green.png')} style={s.bg} resizeMode="stretch" />
        <Text style={s.label}>YES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={onNo} activeOpacity={0.8}>
        <Image source={require('../../../assets/brn-secondary-red.png')} style={s.bg} resizeMode="stretch" />
        <Text style={s.label}>NO</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 16, justifyContent: 'center', paddingVertical: 12 },
  btn:   { width: 140, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bg:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 10 },
  label: { color: T.white, fontWeight: 'bold', fontSize: 18, letterSpacing: 1, zIndex: 1 },
});
