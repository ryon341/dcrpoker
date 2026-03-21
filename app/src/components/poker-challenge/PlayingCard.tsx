import { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { CARD_ASSET_MAP } from './cardAssetMap';
import { normalizeCardCode } from './cardCode';

interface Props {
  card: string; // e.g. "A♠", "K♣", or already-normalized "AS", "KC"
  hidden?: boolean;
  size?: 'sm' | 'md';
}

export const PlayingCard = memo(function PlayingCard({ card, hidden = false, size = 'md' }: Props) {
  const w = size === 'sm' ? 46 : 60;
  const h = size === 'sm' ? 64 : 84;

  if (hidden) {
    return (
      <View style={[s.wrap, { width: w, height: h }]}>
        <Image
          source={require('../../../assets/card-back.png')}
          style={{ width: w, height: h }}
          resizeMode="contain"
        />
      </View>
    );
  }

  const code   = normalizeCardCode(card);
  const source = CARD_ASSET_MAP[code];

  if (!source) {
    if (__DEV__) console.warn(`[PlayingCard] Missing card asset for code: ${code} (input: "${card}")`);
    // Fallback to card back so the app never crashes
    return (
      <View style={[s.wrap, { width: w, height: h }]}>
        <Image
          source={require('../../../assets/card-back.png')}
          style={{ width: w, height: h }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[s.wrap, { width: w, height: h }]}>
      <Image
        source={source}
        style={{ width: w, height: h }}
        resizeMode="contain"
      />
    </View>
  );
});

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
