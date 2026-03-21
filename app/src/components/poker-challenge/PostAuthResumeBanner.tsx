import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { T } from '../ui/Theme';

type Props = {
  message: string;
  visible: boolean;
  onDismiss: () => void;
};

export function PostAuthResumeBanner({ message, visible, onDismiss }: Props) {
  const translateY  = useRef(new Animated.Value(-80)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef  = useRef(onDismiss);

  useEffect(() => { dismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0,   duration: 300, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 1,   duration: 300, useNativeDriver: true }),
      ]).start();
      timerRef.current = setTimeout(() => animateDismiss(), 3500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function animateDismiss() {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 0,   duration: 250, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setRendered(false);
        dismissRef.current();
      }
    });
  }

  if (!rendered) return null;

  return (
    <Animated.View style={[s.banner, { transform: [{ translateY }], opacity }]}>
      <TouchableOpacity style={s.inner} onPress={animateDismiss} activeOpacity={0.85}>
        <Text style={s.check}>✓</Text>
        <Text style={s.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    zIndex: 200,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d2b0d',
    borderWidth: 1.5,
    borderColor: T.green,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  check:   { color: T.green, fontSize: 17, fontWeight: '800' },
  message: { color: T.white, fontSize: 14, fontWeight: '600', flex: 1 },
});
