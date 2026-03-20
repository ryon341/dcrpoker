import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  SpotCategory,
  Spot,
} from '../../../src/lib/spotTrainerData';
import {
  categoryLabel,
  getChoicesForSpot,
  getRandomSpot,
  validateSpotAnswer,
} from '../../../src/lib/spotTrainerEngine';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'question' | 'feedback';

interface Session {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

// ─── Filter options ────────────────────────────────────────────────────────────

type FilterOption = { id: SpotCategory | 'all'; label: string };

const FILTERS: FilterOption[] = [
  { id: 'all',         label: 'All Spots' },
  { id: 'unopened',    label: 'Unopened' },
  { id: 'vs_open',     label: 'vs. Open' },
  { id: 'short_stack', label: 'Short Stack' },
];

// ─── Action button config ─────────────────────────────────────────────────────

const ACTION_STYLES: Record<string, object> = {
  Fold:    { backgroundColor: '#b71c1c' },
  Raise:   { backgroundColor: '#1b5e20' },
  Call:    { backgroundColor: '#1565c0' },
  '3-bet': { backgroundColor: '#6a1b9a' },
  Shove:   { backgroundColor: '#e65100' },
};

// ─── Category badge colors ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<SpotCategory, string> = {
  unopened:    '#1565c0',
  vs_open:     '#6a1b9a',
  short_stack: '#e65100',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpotTrainer() {
  const params = useLocalSearchParams<{
    prefillCategory?: string;
    heroHand?: string;
    position?: string;
    gameType?: string;
    stackDepthBb?: string;
  }>();

  const initCategory: SpotCategory | 'all' =
    (params.prefillCategory && ['unopened', 'vs_open', 'short_stack'].includes(params.prefillCategory))
      ? (params.prefillCategory as SpotCategory)
      : 'all';

  const [activeFilter, setActiveFilter] = useState<SpotCategory | 'all'>(initCategory);
  const [spot,         setSpot]         = useState<Spot>(
    () => getRandomSpot(initCategory === 'all' ? {} : { category: initCategory }),
  );
  const [phase,        setPhase]        = useState<Phase>('question');
  const [chosen,       setChosen]       = useState<string | null>(null);
  const [session,      setSession]      = useState<Session>({ total: 0, correct: 0, streak: 0, bestStreak: 0 });

  const filters = activeFilter === 'all' ? {} : { category: activeFilter };

  const answer = useCallback((choice: string) => {
    const result = validateSpotAnswer(spot, choice);
    setChosen(choice);
    setPhase('feedback');
    setSession(s => {
      const newStreak = result.correct ? s.streak + 1 : 0;
      return {
        total:      s.total + 1,
        correct:    s.correct + (result.correct ? 1 : 0),
        streak:     newStreak,
        bestStreak: Math.max(s.bestStreak, newStreak),
      };
    });
  }, [spot]);

  const nextSpot = useCallback(() => {
    setSpot(getRandomSpot(filters, spot.id));
    setChosen(null);
    setPhase('question');
  }, [filters, spot.id]);

  const changeFilter = useCallback((f: SpotCategory | 'all') => {
    setActiveFilter(f);
    const newFilters = f === 'all' ? {} : { category: f as SpotCategory };
    setSpot(getRandomSpot(newFilters));
    setChosen(null);
    setPhase('question');
  }, []);

  const result        = chosen ? validateSpotAnswer(spot, chosen) : null;
  const isCorrect     = result?.correct ?? false;
  const choices       = getChoicesForSpot(spot);
  const categoryColor = CATEGORY_COLORS[spot.category];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* ── Header ── */}
      <Text style={s.heading}>Spot Trainer</Text>
      <Text style={s.sub}>Realistic scenarios. Choose the best action.</Text>

      {/* Context banner from Hand Recorder */}
      {params.heroHand ? (
        <View style={s.contextBanner}>
          <Text style={s.contextTitle}>Training from: {params.heroHand}</Text>
          {!!(params.position || params.gameType) && (
            <Text style={s.contextMeta}>
              {[params.position, params.gameType, params.stackDepthBb ? `${params.stackDepthBb}bb` : ''].filter(Boolean).join(' · ')}
            </Text>
          )}
        </View>
      ) : null}

      {/* ── Session stats ── */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statLabel}>Score</Text>
          <Text style={s.statValue}>{session.correct}/{session.total}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statLabel}>Streak</Text>
          <Text style={[s.statValue, session.streak > 0 && s.statStreak]}>
            {session.streak}🔥
          </Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statLabel}>Best</Text>
          <Text style={s.statValue}>{session.bestStreak}</Text>
        </View>
        {session.total > 0 && (
          <View style={s.statBox}>
            <Text style={s.statLabel}>Accuracy</Text>
            <Text style={s.statValue}>
              {Math.round((session.correct / session.total) * 100)}%
            </Text>
          </View>
        )}
      </View>

      {/* ── Category filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterRow}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[s.filterPill, activeFilter === f.id && s.filterPillActive]}
            onPress={() => changeFilter(f.id)}
            activeOpacity={0.75}
          >
            <Text style={[s.filterText, activeFilter === f.id && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Scenario card ── */}
      <View style={s.scenarioCard}>
        {/* Category badge */}
        <View style={[s.badge, { backgroundColor: categoryColor }]}>
          <Text style={s.badgeText}>{categoryLabel(spot.category).toUpperCase()}</Text>
        </View>

        {/* Context line */}
        <Text style={s.contextLine}>
          {spot.gameType === 'cash' ? 'Cash Game' : 'Tournament'} · {spot.tableFormat} · {spot.stackDepthBb}bb
        </Text>

        {/* Prior action */}
        <View style={s.priorActionBox}>
          <Text style={s.priorActionLabel}>ACTION</Text>
          <Text style={s.priorActionText}>{spot.priorAction}</Text>
          {spot.villainPosition && (
            <Text style={s.villainNote}>Villain: {spot.villainPosition}</Text>
          )}
        </View>

        {/* Hero info */}
        <View style={s.heroRow}>
          <View style={s.heroDetail}>
            <Text style={s.heroDetailLabel}>Position</Text>
            <Text style={s.heroDetailValue}>{spot.heroPosition}</Text>
          </View>
          <View style={s.heroDetail}>
            <Text style={s.heroDetailLabel}>Stack</Text>
            <Text style={s.heroDetailValue}>{spot.stackDepthBb}bb</Text>
          </View>
        </View>

        {/* Hero hand */}
        <Text style={s.handCaption}>Your Hand</Text>
        <Text style={s.hand}>{spot.heroHand}</Text>
        <Text style={s.prompt}>What is the best action?</Text>
      </View>

      {/* ── Answer buttons ── */}
      {phase === 'question' && (
        <View style={s.choicesGrid}>
          {choices.map(choice => (
            <TouchableOpacity
              key={choice}
              style={[s.choiceBtn, ACTION_STYLES[choice] ?? s.choiceBtnDefault]}
              onPress={() => answer(choice)}
              activeOpacity={0.8}
            >
              <Text style={s.choiceBtnText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Feedback ── */}
      {phase === 'feedback' && result && (
        <>
          <View style={[s.feedbackCard, isCorrect ? s.fbCorrect : s.fbWrong]}>
            <Text style={s.feedbackIcon}>{isCorrect ? '✓' : '✗'}</Text>
            <Text style={s.feedbackTitle}>
              {isCorrect ? 'Correct!' : `Incorrect — correct play: ${result.correctAction}`}
            </Text>
            {!isCorrect && (
              <Text style={s.yourAnswerText}>You chose: {chosen}</Text>
            )}
            <Text style={s.feedbackBody}>{result.explanation}</Text>
          </View>

          <TouchableOpacity style={s.nextBtn} onPress={nextSpot} activeOpacity={0.8}>
            <Text style={s.nextBtnText}>Next Spot  →</Text>
          </TouchableOpacity>
        </>
      )}

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 60 },

  heading: { color: '#e94560', fontSize: 26, fontWeight: 'bold', marginBottom: 4, marginTop: 8 },
  sub:     { color: '#aaa', fontSize: 14, marginBottom: 18 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  statLabel:  { color: '#666', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue:  { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  statStreak: { color: '#f4a261' },

  // Filters
  filterScroll: { marginBottom: 16 },
  filterRow:    { flexDirection: 'row', gap: 8, paddingRight: 4 },
  filterPill: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  filterPillActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  filterText:       { color: '#aaa', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  // Scenario card
  scenarioCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText:   { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  contextLine: { color: '#888', fontSize: 12, marginBottom: 14 },

  priorActionBox: {
    backgroundColor: '#0f1b35',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1a3060',
  },
  priorActionLabel: { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  priorActionText:  { color: '#ddd', fontSize: 14, lineHeight: 20 },
  villainNote:      { color: '#888', fontSize: 12, marginTop: 4 },

  heroRow: { flexDirection: 'row', gap: 10, marginBottom: 18, width: '100%' },
  heroDetail: {
    flex: 1,
    backgroundColor: '#0f1b35',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a3060',
  },
  heroDetailLabel: { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  heroDetailValue: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  handCaption: { color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  hand: { color: '#fff', fontSize: 52, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  prompt: { color: '#aaa', fontSize: 14 },

  // Answer buttons
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10 },
  choiceBtn: {
    flex: 1,
    minWidth: '40%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  choiceBtnDefault: { backgroundColor: '#334' },
  choiceBtnText:    { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  // Feedback
  feedbackCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  fbCorrect: { backgroundColor: '#1b5e2022', borderColor: '#2e7d32' },
  fbWrong:   { backgroundColor: '#b71c1c22', borderColor: '#c62828' },
  feedbackIcon:    { fontSize: 28, textAlign: 'center', marginBottom: 4 },
  feedbackTitle:   { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  yourAnswerText:  { color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  feedbackBody:    { color: '#ccc', fontSize: 13, lineHeight: 20, textAlign: 'center' },

  // Next button
  nextBtn:     { backgroundColor: '#e94560', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Context banner
  contextBanner: { backgroundColor: '#0f1b35', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1a3060', borderLeftWidth: 3, borderLeftColor: '#e94560' },
  contextTitle:  { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  contextMeta:   { color: '#888', fontSize: 12, marginTop: 2 },
});
