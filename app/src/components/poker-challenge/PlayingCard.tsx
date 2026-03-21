import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  card: string; // e.g. "A♠", "K♣"
  hidden?: boolean;
  size?: 'sm' | 'md';
}

export function PlayingCard({ card, hidden = false, size = 'md' }: Props) {
  const w = size === 'sm' ? 46 : 60;
  const h = size === 'sm' ? 64 : 84;
  const rankSize = size === 'sm' ? 15 : 20;
  const suitSize = size === 'sm' ? 12 : 16;

  if (hidden) {
    return (
      <View style={[s.wrap, { width: w, height: h }]}>
        <Image source={require('../../../assets/card-back.png')} style={[s.img, { width: w, height: h }]} resizeMode="contain" />
      </View>
    );
  }
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const isRed  = suit === '♥' || suit === '♦';

  return (
    <View style={[s.wrap, { width: w, height: h }]}>
      <Image source={require('../../../assets/card-face.png')} style={[s.img, { width: w, height: h }]} resizeMode="contain" />
      <View style={s.overlay}>
        <Text style={[s.rank, { fontSize: rankSize }, isRed && s.red]}>{rank}</Text>
        <Text style={[s.suit, { fontSize: suitSize }, isRed && s.red]}>{suit}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  img:     { position: 'absolute', top: 0, left: 0 },
  overlay: { alignItems: 'center', justifyContent: 'center', gap: 1 },
  rank:    { fontWeight: 'bold', color: '#1a1a1a' },
  suit:    { color: '#1a1a1a' },
  red:     { color: '#cc1111' },
});
