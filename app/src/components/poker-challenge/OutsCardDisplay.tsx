import { View, Text, StyleSheet } from 'react-native';
import { PlayingCard } from './PlayingCard';
import { T } from '../ui/Theme';

interface Props {
  heroCards?: string[];
  boardCards?: string[];
}

export function OutsCardDisplay({ heroCards, boardCards }: Props) {
  if (!heroCards?.length && !boardCards?.length) return null;

  return (
    <View style={s.outer}>
      {heroCards && heroCards.length > 0 && (
        <View style={s.group}>
          <Text style={s.label}>Your Hand</Text>
          <View style={s.cards}>
            {heroCards.map((c, i) => <PlayingCard key={i} card={c} size="md" />)}
          </View>
        </View>
      )}
      {boardCards && boardCards.length > 0 && (
        <View style={s.group}>
          <Text style={s.label}>Board</Text>
          <View style={s.cards}>
            {boardCards.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  outer:  { alignItems: 'center', gap: 14, paddingVertical: 10 },
  group:  { alignItems: 'center', gap: 8 },
  label:  { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  cards:  { flexDirection: 'row', gap: 8 },
});
