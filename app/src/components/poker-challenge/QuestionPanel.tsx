import { View, Text, Image, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  /** Scenario text — no action question embedded. */
  scenario: string;
  explanation?: string;
  showExplanation?: boolean;
  /** Label shown above the question. Defaults to "GTO SCENARIO". */
  tag?: string;
}

export function QuestionPanel({ scenario, explanation, showExplanation, tag = 'GTO SCENARIO' }: Props) {
  return (
    <View style={s.outer}>
      <Image source={require('../../../assets/ui-panel.png')} style={s.bg} resizeMode="stretch" />
      <View style={s.content}>
        <Text style={s.tag}>{tag}</Text>
        <Text style={s.question}>{scenario}</Text>
        {showExplanation && explanation && (
          <View style={s.expWrap}>
            <View style={s.expDivider} />
            <Text style={s.expLabel}>Explanation</Text>
            <Text style={s.expText}>{explanation}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer:    { width: '100%', position: 'relative', minHeight: 100, marginVertical: 8 },
  bg:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', borderRadius: 12 },
  content:  { paddingHorizontal: 20, paddingVertical: 14, zIndex: 1, width: '100%' },
  tag:      { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.6, marginBottom: 8, textAlign: 'center' },
  question: { color: T.white, fontSize: 16, fontWeight: '600', textAlign: 'center', lineHeight: 26, flexShrink: 1 },
  expWrap:  { width: '100%', marginTop: 14, gap: 6 },
  expDivider:{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' },
  expLabel: { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  expText:  { color: T.silver, fontSize: 13, lineHeight: 20 },
});
