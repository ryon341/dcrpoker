import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { playSound } from './gameAudio';
import { triggerTapHaptic } from './gameHaptics';

interface Props {
  onFold?:  () => void;
  onCall?:  () => void;
  onRaise?: () => void;
  onSelect?: (value: string) => void;
  options?: string[];
  disabled?: boolean;
  selected?: string | null;
}

export function DecisionButtons({ onFold, onCall, onRaise, onSelect, options, disabled = false, selected = null }: Props) {
  const choiceList = options && options.length > 0 ? options : ['FOLD', 'CALL', 'RAISE'];

  function press(action: string, handler?: () => void) {
    if (disabled) return;
    playSound('tap');
    triggerTapHaptic();
    if (onSelect) {
      onSelect(action);
      return;
    }
    handler?.();
  }

  const normalized = (value: string) => value.trim().toUpperCase();

  return (
    <View style={s.row}>
      {choiceList.map((choice, idx) => {
        const isFold = idx === 0 && choiceList.length === 3;
        const isSelected = normalized(selected ?? '') === normalized(choice);
        const textStyle = [s.label, disabled && !isSelected && s.labelDimmed];
        return (
          <Pressable
            key={`${choice}-${idx}`}
            onPress={({ nativeEvent: _ }) => press(choice, idx === 0 ? onFold : idx === 1 ? onCall : onRaise)}
            style={({ pressed }) =>
              isSelected ? [s.btn, s.btnSelected]
              : disabled ? [s.btn, s.btnDimmed]
              : pressed  ? [s.btn, s.btnPressed]
              : s.btn
            }
          >
            <Image
              source={isFold ? require('../../../assets/brn-secondary-red.png') : require('../../../assets/bn-primary-green.png')}
              style={s.bg}
              resizeMode="stretch"
            />
            <Text style={textStyle}>{choice}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row:         { flexDirection: 'row', gap: 10, justifyContent: 'center', paddingVertical: 12 },
  btn:         { width: 100, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  btnSelected: { width: 100, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', transform: [{ scale: 1.05 }] },
  btnDimmed:   { width: 100, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0.35 },
  btnPressed:  { width: 100, height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative', transform: [{ scale: 0.94 }], opacity: 0.85 },
  bg:          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 10 },
  label:       { color: T.white, fontWeight: 'bold', fontSize: 15, letterSpacing: 1, zIndex: 1 },
  labelDimmed: { opacity: 0.5 },
});

