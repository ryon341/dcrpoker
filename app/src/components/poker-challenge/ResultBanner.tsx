import { View, Image, StyleSheet } from 'react-native';

interface Props {
  result: 'correct' | 'incorrect' | null;
}

export function ResultBanner({ result }: Props) {
  if (!result) return null;

  return (
    <View style={s.outer}>
      {result === 'correct' ? (
        <Image source={require('../../../assets/result-correct.png')} style={s.img} resizeMode="contain" />
      ) : (
        <Image source={require('../../../assets/result-incorrect.png')} style={s.img} resizeMode="contain" />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  outer: { alignItems: 'center', paddingVertical: 8 },
  img:   { width: 240, height: 60 },
});
