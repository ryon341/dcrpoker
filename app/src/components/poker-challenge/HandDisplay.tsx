import { View, Text, Image, StyleSheet } from 'react-native';
import { PlayingCard } from './PlayingCard';
import { T } from '../ui/Theme';

interface Props {
  playerHand: string[];
  opponentHidden: boolean;
}

export function HandDisplay({ playerHand, opponentHidden }: Props) {
  return (
    <View style={s.outer}>
      {/* Player hand */}
      <View style={s.side}>
        <Text style={s.label}>You</Text>
        <View style={s.cards}>
          {playerHand.map((c, i) => <PlayingCard key={i} card={c} />)}
        </View>
      </View>

      <View style={s.divider} />

      {/* Opponent */}
      <View style={s.side}>
        <Text style={s.label}>Villain</Text>
        <View style={s.cards}>
          <PlayingCard card="??" hidden />
          <PlayingCard card="??" hidden />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, paddingVertical: 12 },
  side:    { alignItems: 'center', gap: 8 },
  label:   { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  cards:   { flexDirection: 'row', gap: 8 },
  divider: { width: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
});
