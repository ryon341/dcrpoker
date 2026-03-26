import { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { T } from '../ui/Theme';
import { playSound } from './gameAudio';
import { triggerLevelUpHaptic } from './gameHaptics';

type Props = {
  visible: boolean;
  /** Called when player closes modal without navigating (stays at level 25). */
  onClose: () => void;
  /** Called when player wants to replay Level 25. */
  onReplayFinalLevel: () => void;
  /** Called when player wants to replay from level 21 (Master tier start). */
  onReplayTier: () => void;
  /** Called when player wants to restart the full challenge from level 1. */
  onRestartChallenge: () => void;
  /** Called when player wants to enter Elite Gauntlet mode (TC095). */
  onGauntlet: () => void;
  /** Final score to display in the summary (optional). */
  finalScore?: number;
  /** Accuracy percentage 0–100 (optional). */
  accuracy?: number;
  /** Best streak count (optional). */
  bestStreak?: number;
};

export function GrandChampionModal({
  visible,
  onClose,
  onReplayFinalLevel,
  onReplayTier,
  onRestartChallenge,
  onGauntlet,
  finalScore,
  accuracy,
  bestStreak,
}: Props) {
  const cardAnim  = useRef(new Animated.Value(0)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cardAnim.setValue(0);
      glowAnim.setValue(0);
      Animated.parallel([
        Animated.spring(cardAnim, {
          toValue:         1,
          useNativeDriver: true,
          speed:           6,
          bounciness:      8,
        }),
        Animated.timing(glowAnim, {
          toValue:         1,
          duration:        800,
          useNativeDriver: true,
        }),
      ]).start();
      playSound('levelUp');
      triggerLevelUpHaptic();
    }
  }, [visible]);

  const cardScale   = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });
  const cardOpacity = cardAnim;
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.backdrop}>
        {/* Animated gold glow background */}
        <Animated.View style={[s.bgGlow, { opacity: glowOpacity }]} pointerEvents="none" />

        <Animated.View style={[s.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          {/* Inner glow */}
          <View style={s.innerGlow} pointerEvents="none" />

          <Text style={s.trophy}>🏆</Text>
          <Text style={s.grandLabel}>GRAND CHAMPION</Text>
          <Text style={s.title}>You Did It.</Text>

          <Text style={s.body}>
            All 25 levels conquered.{'\n'}You've mastered the poker challenge from Beginner to Master.
          </Text>

          {/* DCR bracelet image */}
          <Image
            source={require('../../../assets/dcrchampion.png')}
            style={s.championImg}
            resizeMode="contain"
          />

          <Text style={s.rewardSubtitle}>DCR Bracelet — Earned</Text>

          {/* Score summary */}
          {(finalScore !== undefined || accuracy !== undefined || bestStreak !== undefined) && (
            <View style={s.scoreRow}>
              {finalScore !== undefined && (
                <View style={s.scoreStat}>
                  <Text style={s.scoreVal}>{finalScore}</Text>
                  <Text style={s.scoreKey}>SCORE</Text>
                </View>
              )}
              {accuracy !== undefined && (
                <View style={s.scoreStat}>
                  <Text style={s.scoreVal}>{accuracy}%</Text>
                  <Text style={s.scoreKey}>ACCURACY</Text>
                </View>
              )}
              {bestStreak !== undefined && (
                <View style={s.scoreStat}>
                  <Text style={s.scoreVal}>{bestStreak}</Text>
                  <Text style={s.scoreKey}>BEST STREAK</Text>
                </View>
              )}
            </View>
          )}

          <View style={s.divider} />

          <View style={s.btnStack}>
            <TouchableOpacity style={[s.btn, s.gauntletBtn]} onPress={onGauntlet} activeOpacity={0.8}>
              <Text style={s.gauntletBtnText}>⚔️ Elite Gauntlet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.replayBtn]} onPress={onReplayFinalLevel} activeOpacity={0.8}>
              <Text style={s.replayBtnText}>Replay Level 25</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.replayBtn]} onPress={onReplayTier} activeOpacity={0.8}>
              <Text style={s.replayBtnText}>Replay Master Tier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.restartBtn]} onPress={onRestartChallenge} activeOpacity={0.8}>
              <Text style={s.restartBtnText}>Restart Challenge</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={s.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         28,
  },
  bgGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: T.gold,
  },
  card: {
    width:           '100%',
    maxWidth:        380,
    backgroundColor: '#0c0a08',
    borderRadius:    24,
    borderWidth:     2,
    borderColor:     T.gold,
    padding:         28,
    alignItems:      'center',
    gap:             10,
    overflow:        'hidden',
  },
  innerGlow: {
    position:        'absolute',
    top:             -80,
    left:            -80,
    right:           -80,
    height:          240,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderRadius:    400,
  },
  trophy: {
    fontSize:   52,
    marginBottom: 2,
  },
  grandLabel: {
    color:          T.gold,
    fontSize:       11,
    fontWeight:     '800',
    letterSpacing:  3.5,
    backgroundColor: 'rgba(251,191,36,0.12)',
    paddingHorizontal: 16,
    paddingVertical:   5,
    borderRadius:    100,
  },
  title: {
    color:      T.white,
    fontSize:   28,
    fontWeight: 'bold',
    marginTop:  4,
  },
  body: {
    color:      T.muted,
    fontSize:   13,
    textAlign:  'center',
    lineHeight: 20,
  },
  championImg: {
    width:        200,
    height:       140,
    marginVertical: 8,
  },
  rewardSubtitle: {
    color:         T.gold,
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 1.2,
    marginTop:     -4,
  },
  divider: {
    height:          1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignSelf:       'stretch',
    marginVertical:  4,
  },
  btnStack: {
    alignSelf: 'stretch',
    gap:       8,
  },
  btn: {
    paddingVertical: 13,
    borderRadius:    10,
    alignItems:      'center',
  },
  replayBtn: {
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth:     1,
    borderColor:     'rgba(251,191,36,0.30)',
  },
  gauntletBtn: {
    backgroundColor: T.gold,
    borderWidth:     0,
  },
  gauntletBtnText: {
    color:      '#0c0a08',
    fontWeight: '800',
    fontSize:   15,
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection:   'row',
    justifyContent:  'space-around',
    alignSelf:       'stretch',
    marginVertical:  4,
  },
  scoreStat: {
    alignItems: 'center',
    gap:        2,
  },
  scoreVal: {
    color:      T.white,
    fontSize:   20,
    fontWeight: '700',
  },
  scoreKey: {
    color:         T.muted,
    fontSize:      10,
    letterSpacing: 1.2,
    fontWeight:    '600',
  },
  replayBtnText: {
    color:      T.gold,
    fontWeight: '700',
    fontSize:   14,
  },
  restartBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.12)',
  },
  restartBtnText: {
    color:      T.muted,
    fontWeight: '600',
    fontSize:   14,
  },
  closeBtn: {
    paddingVertical: 8,
    alignItems:      'center',
  },
  closeBtnText: {
    color:      'rgba(255,255,255,0.30)',
    fontSize:   12,
    fontWeight: '600',
  },
});
