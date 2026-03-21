import { View, Text, Image, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface Props {
  level: number;
  points: number;
  pointsRequired: number;
  title: string;
  streak: number;
}

export function ChallengeHeader({ level, points, pointsRequired, title, streak }: Props) {
  const progress = Math.min(points / pointsRequired, 1);

  return (
    <View style={s.outer}>
      {/* Level badge + label */}
      <View style={s.topRow}>
        <View style={s.levelWrap}>
          <Image source={require('../../../assets/level-badge.png')} style={s.badge} resizeMode="contain" />
          <Text style={s.levelText}>LVL {level}</Text>
        </View>
        <View style={s.titleStreakWrap}>
          <Text style={s.titleText}>{title}</Text>
          {streak >= 2 && <Text style={s.streakText}>🔥 {streak}</Text>}
        </View>
      </View>

      {/* Points + chip */}
      <View style={s.pointsWrap}>
        <Image source={require('../../../assets/chip-icon.png')} style={s.chip} resizeMode="contain" />
        <Text style={s.points}>{points}<Text style={s.required}> / {pointsRequired}</Text></Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressBg}>
        <Image source={require('../../../assets/progress-bar-bg.png')} style={s.progressBgImg} resizeMode="stretch" />
        <View style={[s.progressFillWrap, { width: `${Math.round(progress * 100)}%` as any }]}>
          <Image source={require('../../../assets/progress-bar-fill.png')} style={s.progressFillImg} resizeMode="stretch" />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer:           { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 8 },
  topRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelWrap:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge:           { width: 32, height: 32 },
  levelText:       { color: T.gold, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  titleStreakWrap:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleText:       { color: T.muted, fontSize: 11, fontWeight: '600' },
  streakText:      { color: T.white, fontSize: 12, fontWeight: '700' },
  pointsWrap:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chip:            { width: 22, height: 22 },
  points:          { color: T.white, fontWeight: '700', fontSize: 18 },
  required:        { color: T.muted, fontWeight: '400', fontSize: 14 },
  progressBg:      { height: 14, borderRadius: 7, overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(0,0,0,0.4)' },
  progressBgImg:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  progressFillWrap:  { position: 'absolute', top: 0, left: 0, bottom: 0, overflow: 'hidden' },
  progressFillImg:   { height: 14, minWidth: 200 },
});
