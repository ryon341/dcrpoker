import { useRef, useEffect, memo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { PlayingCard } from './PlayingCard';
import { T } from '../ui/Theme';

interface Props {
  heroHand: [string, string];
  villainHand: [string, string];
  villainRevealed: boolean;
  runout?: [string, string, string, string, string];
  showRunout?: boolean; // legacy: show all 5 at once
  showFlop?: boolean;
  showTurn?: boolean;
  showRiver?: boolean;
}

export const HandDisplay = memo(function HandDisplay({
  heroHand,
  villainHand,
  villainRevealed,
  runout,
  showRunout,
  showFlop,
  showTurn,
  showRiver,
}: Props) {
  const villainAnim = useRef(new Animated.Value(villainRevealed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(villainAnim, {
      toValue:         villainRevealed ? 1 : 0,
      duration:        320,
      useNativeDriver: true,
    }).start();
  }, [villainRevealed]);

  // Number of board cards to show
  const boardCount = showRunout ? 5 : showRiver ? 5 : showTurn ? 4 : showFlop ? 3 : 0;
  const boardVisible = boardCount > 0 && !!runout;
  const visibleCards = boardVisible ? runout!.slice(0, boardCount) : [];

  return (
    <View style={s.outer}>
      {/* Villain */}
      <View style={s.side}>
        <Text style={s.label}>Villain</Text>
        <Animated.View style={[s.cards, { opacity: villainRevealed ? villainAnim : 1 }]}>
          {villainRevealed
            ? villainHand.map((c, i) => <PlayingCard key={i} card={c} />)
            : [0, 1].map(i => <PlayingCard key={i} card="??" hidden />)
          }
        </Animated.View>
      </View>

      {/* Board runout — staged */}
      {boardVisible && (
        <View style={s.board}>
          <Text style={s.boardLabel}>Board</Text>
          <View style={s.boardCards}>
            {visibleCards.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}
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
});

const s = StyleSheet.create({
  outer:      { alignItems: 'center', paddingVertical: 12, gap: 14 },
  side:       { alignItems: 'center', gap: 8 },
  label:      { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  cards:      { flexDirection: 'row', gap: 8 },
  board:      { alignItems: 'center', gap: 6 },
  boardLabel: { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  boardCards: { flexDirection: 'row', gap: 4 },
});
