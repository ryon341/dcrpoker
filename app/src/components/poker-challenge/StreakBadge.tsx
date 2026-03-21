import { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  streak: number;
}

export const StreakBadge = memo(function StreakBadge({ streak }: Props) {
  if (streak < 2) return null;

  return (
    <View style={s.outer}>
      {/* Background glow */}
      <Image
        source={require('../../../assets/streak-counter-bg.png')}
        style={s.bg}
        resizeMode="contain"
      />
      {/* Fire icon */}
      <Image
        source={require('../../../assets/streak-fire.png')}
        style={s.fire}
        resizeMode="contain"
      />
      {/* Number glow behind count */}
      <Image
        source={require('../../../assets/streak-number-glow.png')}
        style={s.glow}
        resizeMode="contain"
      />
      {/* Streak count */}
      <Text style={s.count}>{streak}</Text>
    </View>
  );
});

const s = StyleSheet.create({
  outer: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bg:    { position: 'absolute', width: 52,  height: 52  },
  fire:  { position: 'absolute', width: 28,  height: 28, top: 2  },
  glow:  { position: 'absolute', width: 32,  height: 20, bottom: 4 },
  count: {
    position: 'absolute',
    bottom: 6,
    color: T.white,
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
