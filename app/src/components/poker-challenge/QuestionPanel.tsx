import { View, Text, Image, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  question: string;
}

export function QuestionPanel({ question }: Props) {
  return (
    <View style={s.outer}>
      <Image source={require('../../../assets/ui-panel.png')} style={s.bg} resizeMode="stretch" />
      <View style={s.content}>
        <Text style={s.tag}>GTO DECISION</Text>
        <Text style={s.question}>{question}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer:    { width: '100%', position: 'relative', minHeight: 100, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  bg:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 12 },
  content:  { paddingHorizontal: 24, paddingVertical: 20, alignItems: 'center', zIndex: 1 },
  tag:      { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.6, marginBottom: 10 },
  question: { color: T.white, fontSize: 17, fontWeight: '600', textAlign: 'center', lineHeight: 26 },
});
