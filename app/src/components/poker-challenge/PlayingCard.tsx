import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  card: string; // e.g. "A♠", "K♣"
  hidden?: boolean;
}

export function PlayingCard({ card, hidden = false }: Props) {
  if (hidden) {
    return (
      <View style={s.wrap}>
        <Image source={require('../../../assets/card-back.png')} style={s.img} resizeMode="contain" />
      </View>
    );
  }
  // split rank and suit
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const isRed  = suit === '♥' || suit === '♦';

  return (
    <View style={s.wrap}>
      <Image source={require('../../../assets/card-face.png')} style={s.img} resizeMode="contain" />
      <View style={s.overlay}>
        <Text style={[s.rank, isRed && s.red]}>{rank}</Text>
        <Text style={[s.suit, isRed && s.red]}>{suit}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { width: 60, height: 84, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  img:     { width: 60, height: 84, position: 'absolute', top: 0, left: 0 },
  overlay: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  rank:    { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  suit:    { fontSize: 16, color: '#1a1a1a' },
  red:     { color: '#cc1111' },
});
