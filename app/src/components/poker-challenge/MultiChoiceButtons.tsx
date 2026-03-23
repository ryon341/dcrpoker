import { View, Text, Pressable, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { playSound } from './gameAudio';
import { triggerTapHaptic } from './gameHaptics';

interface Props {
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  selected?: string | null;
}

export function MultiChoiceButtons({ options, onSelect, disabled = false, selected = null }: Props) {
  const normalized = (v: string) => v.trim().toUpperCase();

  function press(value: string) {
    if (disabled) return;
    playSound('tap');
    triggerTapHaptic();
    onSelect(value);
  }

  return (
    <View style={s.grid}>
      {options.map((opt, idx) => {
        const isSelected = normalized(selected ?? '') === normalized(opt);
        return (
          <Pressable
            key={`${opt}-${idx}`}
            onPress={() => press(opt)}
            style={({ pressed }) =>
              isSelected
                ? [s.btn, s.btnSelected]
                : disabled
                ? [s.btn, s.btnDimmed]
                : pressed
                ? [s.btn, s.btnPressed]
                : s.btn
            }
          >
            <Text style={[s.label, isSelected && s.labelSelected, disabled && !isSelected && s.labelDimmed]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', paddingVertical: 10 },
  btn:          { borderRadius: 12, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 12, paddingVertical: 16, width: '47%', alignItems: 'center' },
  btnSelected:  { borderRadius: 12, borderWidth: 1.5, borderColor: T.gold, backgroundColor: 'rgba(180,138,58,0.25)', paddingHorizontal: 12, paddingVertical: 16, width: '47%', alignItems: 'center' },
  btnDimmed:    { borderRadius: 12, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 12, paddingVertical: 16, width: '47%', alignItems: 'center', opacity: 0.45 },
  btnPressed:   { borderRadius: 12, borderWidth: 1, borderColor: T.silver, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 16, width: '47%', alignItems: 'center' },
  label:        { color: T.silver, fontWeight: '700', fontSize: 15, letterSpacing: 0.5, textAlign: 'center' },
  labelSelected:{ color: T.gold },
  labelDimmed:  { opacity: 0.5 },
});
