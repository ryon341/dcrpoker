import { View, Text, StyleSheet } from 'react-native';
import { PlayingCard } from './PlayingCard';
import { T } from '../ui/Theme';

interface Props {
  heroHand: [string, string];
  villainHand: [string, string];
  villainRevealed: boolean;
  runout?: [string, string, string, string, string];
  showRunout?: boolean;
}

export function HandDisplay({ heroHand, villainHand, villainRevealed, runout, showRunout }: Props) {
  return (
    <View style={s.outer}>
      {/* Villain */}
      <View style={s.side}>
        <Text style={s.label}>Villain</Text>
        <View style={s.cards}>
          {villainRevealed
            ? villainHand.map((c, i) => <PlayingCard key={i} card={c} />)
            : [0, 1].map(i => <PlayingCard key={i} card="??" hidden />)
          }
        </View>
      </View>

      {/* Board runout (5 cards) */}
      {showRunout && runout && (
        <View style={s.board}>
          <Text style={s.boardLabel}>Board</Text>
          <View style={s.boardCards}>
            {runout.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}
          </View>
        </View>
      )}

      {/* Hero */}
      <View style={s.side}>
        <Text style={s.label}>You</Text>
        <View style={s.cards}>
          {heroHand.map((c, i) => <PlayingCard key={i} card={c} />)}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer:      { alignItems: 'center', paddingVertical: 12, gap: 14 },
  side:       { alignItems: 'center', gap: 8 },
  label:      { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  cards:      { flexDirection: 'row', gap: 8 },
  board:      { alignItems: 'center', gap: 6 },
  boardLabel: { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  boardCards: { flexDirection: 'row', gap: 4 },
});
