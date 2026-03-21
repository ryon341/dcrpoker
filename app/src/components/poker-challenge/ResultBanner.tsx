import { useRef, useEffect } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

interface Props {
  result: 'correct' | 'incorrect' | null;
}

export function ResultBanner({ result }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!result) {
      anim.setValue(0);
      return;
    }
    anim.setValue(0);
    Animated.spring(anim, {
      toValue:         1,
      useNativeDriver: true,
      speed:           14,
      bounciness:      7,
    }).start();
  }, [result]);

  if (!result) return null;

  return (
    <Animated.View
      style={[s.outer, {
        opacity:   anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
      }]}
    >
      {result === 'correct' ? (
        <Image source={require('../../../assets/result-correct.png')} style={s.img} resizeMode="contain" />
      ) : (
        <Image source={require('../../../assets/result-incorrect.png')} style={s.img} resizeMode="contain" />
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  outer: { alignItems: 'center', paddingVertical: 8 },
  img:   { width: 240, height: 60 },
});
