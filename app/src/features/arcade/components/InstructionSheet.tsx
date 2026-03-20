import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { T } from '../../../components/ui/Theme';

interface InstructionSheetProps {
  visible: boolean;
  title: string;
  instructions: string;
  onDismiss: () => void;
}

export function InstructionSheet({ visible, title, instructions, onDismiss }: InstructionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.eyebrow}>How to Play</Text>
          <Text style={s.title}>{title}</Text>
          <Text style={s.body}>{instructions}</Text>
          <TouchableOpacity style={s.btn} onPress={onDismiss} activeOpacity={0.85}>
            <Text style={s.btnText}>Got it — Let's Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: '#1a1a1d', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: T.cardBorder, padding: 28, paddingBottom: 40 },
  eyebrow: { color: 'rgba(251,191,36,0.75)', fontSize: 11, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 },
  title:   { color: T.white, fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  body:    { color: T.silver, fontSize: 15, lineHeight: 24, marginBottom: 28 },
  btn:     { backgroundColor: T.gold, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  btnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
});
