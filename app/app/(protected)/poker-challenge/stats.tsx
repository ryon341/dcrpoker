import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { usePokerProgress } from '../../../src/components/poker-challenge/usePokerProgress';
import { getTitleForLevel } from '../../../src/components/poker-challenge/titleSystem';
import { StatsCard } from '../../../src/components/poker-challenge/StatsCard';
import { StatsBar } from '../../../src/components/poker-challenge/StatsBar';
import { StatsSection } from '../../../src/components/poker-challenge/StatsSection';

function buildInsights(stats: {
  totalHandsPlayed: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  bestStreak: number;
  wheelSpins: number;
  totalWheelPoints: number;
  highestLevelReached: number;
}): string[] {
  const insights: string[] = [];
  const accuracy = stats.totalHandsPlayed > 0
    ? Math.round((stats.totalCorrect / stats.totalHandsPlayed) * 100)
    : 0;
  const winRate = (stats.totalWins + stats.totalLosses) > 0
    ? Math.round((stats.totalWins / (stats.totalWins + stats.totalLosses)) * 100)
    : 0;

  if (accuracy >= 75) {
    insights.push(`Your ${accuracy}% accuracy is elite — you're reading hands well.`);
  } else if (accuracy >= 55) {
    insights.push(`At ${accuracy}% accuracy, you're solid — keep studying tricky spots.`);
  } else if (stats.totalHandsPlayed > 0) {
    insights.push(`${accuracy}% accuracy means there's room to grow — review the explanations after each hand.`);
  }

  if (stats.bestStreak >= 7) {
    insights.push(`A best streak of ${stats.bestStreak} shows real consistency at the table.`);
  } else if (stats.bestStreak >= 3) {
    insights.push(`Your best streak of ${stats.bestStreak} — push for 7 to unlock the Weekly Heater badge.`);
  }

  if (winRate >= 60) {
    insights.push(`${winRate}% win rate — you're winning more than you lose. Strong fundamentals.`);
  } else if (winRate > 0 && winRate < 50) {
    insights.push(`Win rate is ${winRate}% — equity decisions in losing hands could improve your score the most.`);
  }

  if (stats.wheelSpins >= 5) {
    insights.push(`${stats.wheelSpins} wheel spins earned you ${stats.totalWheelPoints} bonus points total.`);
  }

  return insights.slice(0, 3);
}

export default function StatsPage() {
  const router = useRouter();
  const { savedProgress, progressLoaded } = usePokerProgress();

  const stats = savedProgress?.stats;
  const level = savedProgress?.level ?? 1;
  const hasData = progressLoaded && stats && stats.totalHandsPlayed > 0;

  const accuracy = (stats && stats.totalHandsPlayed > 0)
    ? Math.round((stats.totalCorrect / stats.totalHandsPlayed) * 100)
    : 0;
  const winRate = (stats && (stats.totalWins + stats.totalLosses) > 0)
    ? Math.round((stats.totalWins / (stats.totalWins + stats.totalLosses)) * 100)
    : 0;
  const insights = stats ? buildInsights(stats) : [];

  return (
    <ImageBackground
      source={require('../../../assets/asset01.jpg')}
      style={s.bg}
      resizeMode="cover"
    >
      <View style={s.overlay} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header — Player Identity */}
        <View style={s.header}>
          <View style={s.levelChip}>
            <Text style={s.levelChipText}>LVL {level}</Text>
          </View>
          <Text style={s.titleText}>{getTitleForLevel(level)}</Text>
          <Text style={s.subtitleText}>Performance Dashboard</Text>
        </View>

        {!progressLoaded ? (
          <Text style={s.emptyText}>Loading…</Text>
        ) : !hasData ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyIcon}>🃏</Text>
            <Text style={s.emptyTitle}>No stats yet</Text>
            <Text style={s.emptyBody}>Play your first hands to see your lifetime performance here.</Text>
          </View>
        ) : (
          <View style={s.sections}>

            {/* Core Performance */}
            <StatsSection title="Core Performance">
              <View style={s.barBlock}>
                <View style={s.barLabelRow}>
                  <Text style={s.barLabel}>Accuracy</Text>
                  <Text style={s.barValue}>{accuracy}%</Text>
                </View>
                <StatsBar percent={accuracy} />
              </View>
              <View style={s.barBlock}>
                <View style={s.barLabelRow}>
                  <Text style={s.barLabel}>Win Rate</Text>
                  <Text style={s.barValue}>{winRate}%</Text>
                </View>
                <StatsBar percent={winRate} />
              </View>
              <View style={s.cardRow}>
                <StatsCard label="Hands Played" value={String(stats!.totalHandsPlayed)} icon="🃏" />
                <StatsCard label="Highest Level" value={`LVL ${stats!.highestLevelReached}`} icon="🏆" />
              </View>
            </StatsSection>

            {/* Streaks */}
            <StatsSection title="Streaks">
              <View style={s.cardRow}>
                <StatsCard label="Current Streak" value={String(stats!.currentStreak)} icon="🔥" />
                <StatsCard label="Best Streak" value={String(stats!.bestStreak)} subtext="all-time best" />
              </View>
            </StatsSection>

            {/* Totals */}
            <StatsSection title="Totals">
              <View style={s.cardRow}>
                <StatsCard label="Correct" value={String(stats!.totalCorrect)} icon="✅" />
                <StatsCard label="Incorrect" value={String(stats!.totalIncorrect)} icon="❌" />
              </View>
              <View style={s.cardRow}>
                <StatsCard label="Wins" value={String(stats!.totalWins)} icon="🟢" />
                <StatsCard label="Losses" value={String(stats!.totalLosses)} icon="🔴" />
              </View>
            </StatsSection>

            {/* Wheel / Rewards */}
            {stats!.wheelSpins > 0 && (
              <StatsSection title="Wheel & Rewards">
                <View style={s.cardRow}>
                  <StatsCard label="Wheel Spins" value={String(stats!.wheelSpins)} icon="🎡" />
                  <StatsCard label="Wheel Points" value={String(stats!.totalWheelPoints)} subtext="bonus pts earned" />
                </View>
              </StatsSection>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <StatsSection title="Insights">
                <View style={s.insightsCard}>
                  {insights.map((line, i) => (
                    <Text key={i} style={s.insightLine}>• {line}</Text>
                  ))}
                </View>
              </StatsSection>
            )}

          </View>
        )}

        <View style={s.bottomPad} />
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg:           { flex: 1, backgroundColor: T.bg },
  overlay:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,11,12,0.82)' },
  scroll:       { flex: 1 },
  content:      { paddingHorizontal: 20, paddingTop: 56 },
  backBtn:      { marginBottom: 16 },
  backText:     { color: T.gold, fontSize: 14, fontWeight: '600' },
  header:       { alignItems: 'center', marginBottom: 28, gap: 6 },
  levelChip:    { backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)' },
  levelChipText:{ color: T.gold, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  titleText:    { color: T.white, fontWeight: '800', fontSize: 22 },
  subtitleText: { color: T.muted, fontSize: 13 },
  sections:     { gap: 28 },
  barBlock:     { gap: 6 },
  barLabelRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabel:     { color: T.white, fontSize: 13, fontWeight: '600' },
  barValue:     { color: T.gold, fontSize: 13, fontWeight: '700' },
  cardRow:      { flexDirection: 'row', gap: 10 },
  insightsCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 14, gap: 10 },
  insightLine:  { color: T.white, fontSize: 13, lineHeight: 20 },
  emptyCard:    { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 28, alignItems: 'center', gap: 10, marginTop: 20 },
  emptyIcon:    { fontSize: 36 },
  emptyTitle:   { color: T.white, fontWeight: '700', fontSize: 18 },
  emptyBody:    { color: T.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyText:    { color: T.muted, textAlign: 'center', marginTop: 40 },
  bottomPad:    { height: 60 },
});
