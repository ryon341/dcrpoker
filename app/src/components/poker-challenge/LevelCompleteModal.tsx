import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Image } from 'react-native';
import { T } from '../ui/Theme';
import { playSound } from './gameAudio';
import { triggerLevelUpHaptic } from './gameHaptics';

interface Props {
  visible:          boolean;
  level:            number;
  score:            number;
  nextThreshold:    number;
  currentTitle:     string;
  nextTitleInfo:    { title: string; unlockLevel: number } | null;
  titleJustUnlocked: boolean;
  isFinalLevel:     boolean;
  grandChampionUnlocked: boolean;
  onAdvance:        () => void;
}

export function LevelCompleteModal({
  visible,
  level,
  score,
  nextThreshold,
  currentTitle,
  nextTitleInfo,
  titleJustUnlocked,
  isFinalLevel,
  grandChampionUnlocked,
  onAdvance,
}: Props) {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue:         1,
        useNativeDriver: true,
        speed:           8,
        bounciness:      6,
      }).start();
      playSound('levelUp');
      triggerLevelUpHaptic();
    }
  }, [visible]);

  const cardScale   = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });
  const cardOpacity = cardAnim;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.backdrop}>
        <Animated.View style={[s.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          {/* Gold glow decoration */}
          <View style={s.glow} pointerEvents="none" />

          <View style={s.trophyRow}>
            <Text style={s.trophyIcon}>🏆</Text>
          </View>

          <Text style={s.badgePill}>LEVEL {level} COMPLETE</Text>

          {/* Title unlock banner */}
          {titleJustUnlocked && (
            <View style={s.titleBanner}>
              <Text style={s.titleBannerText}>🏆 Title Unlocked: {currentTitle}</Text>
            </View>
          )}

          <Text style={s.title}>Well played!</Text>
          <Text style={s.sub}>
            {isFinalLevel
              ? 'You completed the full 25-level ladder.'
              : `Your score carries forward into Level ${level + 1}.`}
          </Text>

          {/* Score summary */}
          <View style={s.scoreRow}>
            <View style={s.scoreBox}>
              <Text style={s.scoreBoxLabel}>Your Score</Text>
              <Text style={s.scoreBoxValue}>{score}</Text>
            </View>
            <View style={s.scoreArrow}>
              <Text style={s.arrowText}>→</Text>
            </View>
            <View style={s.scoreBox}>
              <Text style={s.scoreBoxLabel}>{isFinalLevel ? 'Final Goal' : 'Next Goal'}</Text>
              <Text style={s.scoreBoxValue}>{nextThreshold}</Text>
            </View>
          </View>

          <View style={s.divider} />

          {isFinalLevel ? (
            <>
              <Image source={require('../../../assets/dcrchampion.png')} style={s.championImage} resizeMode="contain" />
              <Text style={s.nextLabel}>Final Reward</Text>
              <Text style={s.nextLevel}>Grand Champion</Text>
            </>
          ) : (
            <>
              <Text style={s.nextLabel}>Advancing to</Text>
              <Text style={s.nextLevel}>Level {level + 1}</Text>
            </>
          )}

          {/* Current title + next title hint */}
          <View style={s.titleRow}>
            <Text style={s.titleCurrent}>{currentTitle}</Text>
            {!isFinalLevel && nextTitleInfo && (
              <Text style={s.titleNext}>Next: {nextTitleInfo.title} at Lvl {nextTitleInfo.unlockLevel}</Text>
            )}
            {isFinalLevel && (
              <Text style={s.titleNext}>
                {grandChampionUnlocked ? 'Champion status saved.' : 'Unlock your permanent champion status.'}
              </Text>
            )}
          </View>

          <TouchableOpacity style={s.btn} onPress={onAdvance} activeOpacity={0.8}>
            <Text style={s.btnText}>
              {isFinalLevel
                ? (grandChampionUnlocked ? 'Continue' : 'Claim Grand Champion')
                : `Advance to Level ${level + 1} →`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card:           { width: '100%', maxWidth: 380, backgroundColor: '#100e0c', borderRadius: 24, borderWidth: 2, borderColor: T.gold, padding: 28, alignItems: 'center', gap: 10, overflow: 'hidden' },
  glow:           { position: 'absolute', top: -80, left: -80, right: -80, height: 240, backgroundColor: 'rgba(251,191,36,0.06)', borderRadius: 400 },
  trophyRow:      { marginBottom: 4 },
  trophyIcon:     { fontSize: 48 },
  badgePill:      { color: T.gold, fontSize: 10, fontWeight: '700', letterSpacing: 2.5, backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100 },
  title:          { color: T.white, fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  sub:            { color: T.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  scoreRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  scoreBox:       { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  scoreBoxLabel:  { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 2 },
  scoreBoxValue:  { color: T.gold, fontSize: 24, fontWeight: 'bold' },
  scoreArrow:     { alignItems: 'center', justifyContent: 'center' },
  arrowText:      { color: T.muted, fontSize: 20 },
  divider:        { height: 1, backgroundColor: T.border, alignSelf: 'stretch', marginVertical: 4 },
  nextLabel:      { color: T.muted, fontSize: 12, letterSpacing: 1 },
  nextLevel:      { color: T.gold, fontSize: 22, fontWeight: 'bold' },
  championImage:  { width: 150, height: 92, marginTop: 4 },
  titleBanner:    { backgroundColor: 'rgba(251,191,36,0.18)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7, borderWidth: 1, borderColor: T.gold },
  titleBannerText: { color: T.gold, fontSize: 13, fontWeight: '700' },
  titleRow:       { alignItems: 'center', gap: 2 },
  titleCurrent:   { color: T.white, fontSize: 14, fontWeight: '700' },
  titleNext:      { color: T.muted, fontSize: 11 },
  btn:            { backgroundColor: T.gold, paddingHorizontal: 32, paddingVertical: 15, borderRadius: 24, marginTop: 6, alignSelf: 'stretch', alignItems: 'center' },
  btnText:        { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
});
