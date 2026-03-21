import { useState, useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface Props {
  delta: number;
  visible: boolean;
  onDone?: () => void;
}

export function ScoreDeltaPop({ delta, visible, onDone }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!visible) {
      anim.stopAnimation();
      anim.setValue(0);
      setActive(false);
      return;
    }
    setActive(true);
    anim.setValue(0);
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 10,
      }),
      Animated.delay(700),
      Animated.timing(anim, {
        toValue: 2,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDone?.();
    });
  }, [visible]);

  if (!active) return null;

  const opacity = anim.interpolate({
    inputRange: [0, 0.15, 1, 1.6, 2],
    outputRange: [0, 1, 1, 0.7, 0],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [12, 0, -52],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.4, 1.3, 0.9, 1],
    extrapolate: 'clamp',
  });

  const positive = delta > 0;
  const neutral  = delta === 0;

  return (
    <Animated.View
      style={[s.wrap, { opacity, transform: [{ translateY }, { scale }] }]}
      pointerEvents="none"
    >
      <Text style={[s.text, positive ? s.pos : neutral ? s.neutral : s.neg]}>
        {positive ? '+' : ''}{delta}
      </Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap:    { alignItems: 'center', justifyContent: 'center' },
  text:    {
    fontSize: 52,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  pos:     { color: '#4caf50' },
  neutral: { color: '#aaa' },
  neg:     { color: '#e94560' },
});
