import { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { T }               from '../../../src/components/ui/Theme';
import { TIMING }          from '../../../src/components/poker-challenge/animations';
import { useAuth }         from '../../../src/context/AuthContext';
import { QuestionPanel }   from '../../../src/components/poker-challenge/QuestionPanel';
import { HandDisplay }     from '../../../src/components/poker-challenge/HandDisplay';
import { DecisionButtons } from '../../../src/components/poker-challenge/DecisionButtons';
import { ResultBanner }    from '../../../src/components/poker-challenge/ResultBanner';
import { ContinuePanel }   from '../../../src/components/poker-challenge/ContinuePanel';
import { ScoreDeltaPop }   from '../../../src/components/poker-challenge/ScoreDeltaPop';
import { DailyChallengeResultsModal } from '../../../src/components/poker-challenge/DailyChallengeResultsModal';
import { getScoreDelta, applyScore } from '../../../src/components/poker-challenge/scoring';
import {
  DAILY_HAND_COUNT,
  getTodayDateString,
  getDailyChallengeSet,
} from '../../../src/components/poker-challenge/dailyChallenge';
import {
  loadDailyProgress,
  saveDailyProgress,
  DailyChallengeProgress,
  DailyChallengeAnswer,
} from '../../../src/components/poker-challenge/dailyStorage';
import { pokerProgressApi } from '../../../src/api/pokerProgress';
import { loadDailyMeta, saveDailyMeta } from '../../../src/components/poker-challenge/dailyMetaStorage';
import { applyDailyCompletion, getInitialDailyMeta } from '../../../src/components/poker-challenge/dailyStreak';
import type { DailyMeta } from '../../../src/components/poker-challenge/dailyStreak';
import {
  adaptQuestionToRuntime,
  isRuntimeAnswerCorrect,
  type RuntimeChallenge,
} from '../../../src/components/poker-challenge/challengeQuestionAdapter';
import { playSound } from '../../../src/components/poker-challenge/gameAudio';
import { triggerTapHaptic, triggerCorrectHaptic, triggerIncorrectHaptic } from '../../../src/components/poker-challenge/gameHaptics';

// ─── State ────────────────────────────────────────────────────────────────────

interface DailyState {
  dailyId:         string;
  challenges:      RuntimeChallenge[];
  currentIndex:    number;       // 0–4: which hand we are ON right now
  score:           number;
  answers:         DailyChallengeAnswer[];
  completed:       boolean;
  // per-hand transient
  selectedAnswer:  string | null;
  lastScoreDelta:  number;
  lastResultType:  'correct' | 'incorrect' | null;
  currentStreak:   number;       // within this run, for display only
}

function buildState(
  todayId: string,
  saved: DailyChallengeProgress | null,
): DailyState {
  const challenges = getDailyChallengeSet(todayId).map(adaptQuestionToRuntime);
  if (saved && saved.dailyId === todayId) {
    // Resume or show completed
    const streak = saved.answers.reduce((acc, a) => a.isCorrect ? acc + 1 : 0, 0);
    return {
      dailyId:       todayId,
      challenges,
      currentIndex:  saved.completed ? DAILY_HAND_COUNT : saved.answers.length,
      score:         saved.score,
      answers:       saved.answers,
      completed:     saved.completed,
      selectedAnswer: null,
      lastScoreDelta: 0,
      lastResultType: null,
      currentStreak: streak,
    };
  }
  return {
    dailyId:        todayId,
    challenges,
    currentIndex:   0,
    score:          0,
    answers:        [],
    completed:      false,
    selectedAnswer: null,
    lastScoreDelta: 0,
    lastResultType: null,
    currentStreak:  0,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DailyChallengePage() {
  const router   = useRouter();
  const { user } = useAuth();
  const userId   = user ? String(user.id) : null;
  const todayId  = getTodayDateString();

  const [ds, setDs] = useState<DailyState>(() => buildState(todayId, null));
  const [loaded, setLoaded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dailyMeta, setDailyMeta]     = useState<DailyMeta>(getInitialDailyMeta);
  const [newBadgeLabel, setNewBadgeLabel] = useState<string | null>(null);

  // Staged reveal state
  const [revealPhase, setRevealPhase] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [deltaPop, setDeltaPop] = useState<{ value: number; show: boolean }>({ value: 0, show: false });

  function cancelTimers() {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }

  useEffect(() => () => cancelTimers(), []);

  // Load saved daily progress
  useEffect(() => {
    (async () => {
      let saved: DailyChallengeProgress | null = null;

      if (userId) {
        // Try backend first
        try {
          saved = await pokerProgressApi.loadDailyProgress(todayId);
        } catch {
          // offline fallback
          saved = await loadDailyProgress(userId);
          if (saved && saved.dailyId !== todayId) saved = null;
        }
        // Also mirror to local storage for offline use
        if (saved) saveDailyProgress(saved, userId).catch(() => {});
      } else {
        saved = await loadDailyProgress(null);
        if (saved && saved.dailyId !== todayId) saved = null;
      }

      const state = buildState(todayId, saved);
      setDs(state);
      if (state.completed) setShowResults(true);

      // Load daily meta (streak)
      const meta = await loadDailyMeta(userId);
      setDailyMeta(meta);

      setLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const challenge    = ds.challenges[Math.min(ds.currentIndex, DAILY_HAND_COUNT - 1)];
  const handNumber   = ds.currentIndex + 1; // 1-based display

  // Derived reveal flags
  const buttonsLocked    = revealPhase >= 1;
  const showCorrectness  = revealPhase >= 2;
  const showExplanation  = revealPhase >= 3;
  const showVillainCards = revealPhase >= 4;
  const showFlop         = revealPhase >= 5;
  const showTurn         = revealPhase >= 6;
  const showRiver        = revealPhase >= 7;
  const canContinue      = revealPhase >= 10;

  // ── Reveal sequence ─────────────────────────────────────────────────────────
  function scheduleReveal(delta: number, isCorrect: boolean, heroWins: boolean) {
    const phases: [number, number][] = [
      [TIMING.correctness,    2],
      [TIMING.explanation,    3],
      [TIMING.villainReveal,  4],
      [TIMING.flop,           5],
      [TIMING.turn,           6],
      [TIMING.river,          7],
      [TIMING.scoreDelta,     9],
      [TIMING.continueEnable, 10],
    ];
    phases.forEach(([delay, phase]) => {
      timerRefs.current.push(setTimeout(() => {
        setRevealPhase(phase);
        if (phase === 2) {
          if (isCorrect) { playSound('correct'); triggerCorrectHaptic(); }
          else           { playSound('incorrect'); triggerIncorrectHaptic(); }
        }
        if (phase === 4 || phase === 5 || phase === 6 || phase === 7) {
          playSound('cardFlip');
        }
        if (phase === 10) {
          playSound(heroWins ? 'win' : 'lose');
        }
        if (phase === 9) setDeltaPop({ value: delta, show: true });
      }, delay));
    });
  }

  function persist(state: DailyState) {
    const progress: DailyChallengeProgress = {
      dailyId:      state.dailyId,
      completed:    state.completed,
      currentIndex: state.currentIndex,
      score:        state.score,
      answers:      state.answers,
      completedAt:  state.completed ? new Date().toISOString() : null,
    };
    // Local backup
    saveDailyProgress(progress, userId).catch(() => {});
    // Backend sync (fire and forget)
    if (userId) {
      pokerProgressApi.saveDailyProgress(state.dailyId, progress).catch(() => {});
    }
  }

  function handleAnswer(answer: string) {
    if (revealPhase > 0 || ds.completed) return;
    playSound('tap');
    triggerTapHaptic();
    const isCorrect = isRuntimeAnswerCorrect(challenge, answer);
    const handOutcomeForUi = challenge.category === 'action' ? challenge.heroWins : isCorrect;
    const delta     = getScoreDelta(isCorrect, challenge.heroWins, challenge.category, answer);
    const newScore  = applyScore(ds.score, delta);
    const newStreak = isCorrect ? ds.currentStreak + 1 : 0;
    const next: DailyState = {
      ...ds,
      selectedAnswer: answer,
      lastScoreDelta: delta,
      lastResultType: isCorrect ? 'correct' : 'incorrect',
      score:          newScore,
      currentStreak:  newStreak,
    };
    setDs(next);
    setRevealPhase(1);
    cancelTimers();
    scheduleReveal(delta, isCorrect, handOutcomeForUi);
  }

  function handleContinue() {
    if (!canContinue) return;
    playSound('tap');
    triggerTapHaptic();
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });

    const newAnswer: DailyChallengeAnswer = {
      challengeId:    challenge.id,
      selectedAnswer: ds.selectedAnswer!,
      isCorrect:      ds.lastResultType === 'correct',
      heroWins:       challenge.category === 'action' ? challenge.heroWins : ds.lastResultType === 'correct',
      delta:          ds.lastScoreDelta,
    };
    const newAnswers  = [...ds.answers, newAnswer];
    const nextIndex   = ds.currentIndex + 1;
    const isCompleted = nextIndex >= DAILY_HAND_COUNT;

    const next: DailyState = {
      ...ds,
      answers:        newAnswers,
      currentIndex:   nextIndex,
      completed:      isCompleted,
      selectedAnswer: null,
      lastScoreDelta: 0,
      lastResultType: null,
    };
    setDs(next);
    persist(next);

    if (isCompleted) {
      // Update daily streak meta
      const updatedMeta = applyDailyCompletion(dailyMeta, todayId);
      setDailyMeta(updatedMeta);
      setNewBadgeLabel(updatedMeta.newBadge?.label ?? null);
      saveDailyMeta(updatedMeta, userId).catch(() => {});
      setShowResults(true);
    }
  }

  if (!loaded) {
    return (
      <View style={s.loadingScreen}>
        <Text style={s.loadingText}>Loading…</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/asset01.jpg')}
      style={s.bg}
      resizeMode="cover"
    >
      <View style={s.overlay} pointerEvents="none" />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.board}>

          {/* Daily mode top bar */}
          <View style={s.modeBar}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
              <Text style={s.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.modeLabel}>📅 Daily Challenge</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Daily header */}
          <View style={s.dailyHeader}>
            <View style={s.handPill}>
              <Text style={s.handPillText}>
                {ds.completed ? 'Complete' : `Hand ${handNumber} of ${DAILY_HAND_COUNT}`}
              </Text>
            </View>
            <Text style={s.dailyScore}>
              Daily Score: <Text style={s.dailyScoreVal}>{ds.score}</Text>
            </Text>
            {dailyMeta.currentDailyStreak > 0 && (
              <Text style={s.streakHud}>
                🔥 Streak: <Text style={s.streakHudNum}>{dailyMeta.currentDailyStreak}</Text>
              </Text>
            )}
          </View>

          <View style={s.divider} />

          {/* Challenge label + question */}
          {!ds.completed && (
            <>
              <View style={s.section}>
                <Text style={s.sectionLabel}>Hand {handNumber} of {DAILY_HAND_COUNT}</Text>
                <QuestionPanel
                  scenario={challenge.scenario}
                  explanation={challenge.explanation}
                  showExplanation={showExplanation}
                />
              </View>

              {challenge.heroHand && challenge.villainHand && challenge.runout ? (
                <HandDisplay
                  heroHand={challenge.heroHand}
                  villainHand={challenge.villainHand}
                  villainRevealed={showVillainCards}
                  runout={challenge.runout}
                  showFlop={showFlop}
                  showTurn={showTurn}
                  showRiver={showRiver}
                />
              ) : (
                <View style={s.noCardsWrap}>
                  <Text style={s.noCardsText}>No card runout for this question type.</Text>
                </View>
              )}

              <ResultBanner result={showCorrectness ? ds.lastResultType : null} />

              {!canContinue ? (
                <DecisionButtons
                  options={challenge.answerOptions}
                  onSelect={handleAnswer}
                  disabled={buttonsLocked}
                  selected={ds.selectedAnswer}
                />
              ) : (
                <ContinuePanel
                  scoreDelta={ds.lastScoreDelta}
                  heroWins={challenge.category === 'action' ? challenge.heroWins : ds.lastResultType === 'correct'}
                  showHandOutcome={challenge.category === 'action'}
                  streak={ds.currentStreak}
                  onContinue={handleContinue}
                />
              )}
            </>
          )}

          {/* Summary while waiting for results modal */}
          {ds.completed && (
            <View style={s.section}>
              <Text style={s.completedMsg}>All 5 hands complete!</Text>
              <TouchableOpacity style={s.viewResultsBtn} onPress={() => setShowResults(true)}>
                <Text style={s.viewResultsBtnText}>View Results</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={s.divider} />

          {/* Hand recap list */}
          {ds.answers.length > 0 && (
            <View style={s.recapSection}>
              <Text style={s.recapTitle}>Your Hands</Text>
              {ds.answers.map((a, i) => (
                <View key={i} style={s.recapRow}>
                  <Text style={s.recapHand}>Hand {i + 1}</Text>
                  <Text style={[s.recapResult, a.isCorrect ? s.correct : s.incorrect]}>
                    {a.isCorrect ? '✓' : '✗'}
                  </Text>
                  <Text style={[s.recapDelta, a.delta >= 0 ? s.correct : s.incorrect]}>
                    {a.delta >= 0 ? '+' : ''}{a.delta}
                  </Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Floating score delta popup */}
      <View style={s.popOverlay} pointerEvents="none">
        <ScoreDeltaPop
          delta={deltaPop.value}
          visible={deltaPop.show}
          onDone={() => setDeltaPop(prev => ({ ...prev, show: false }))}
        />
      </View>

      <DailyChallengeResultsModal
        visible={showResults}
        score={ds.score}
        answers={ds.answers}
        currentDailyStreak={dailyMeta.currentDailyStreak}
        bestDailyStreak={dailyMeta.bestDailyStreak}
        newBadgeLabel={newBadgeLabel}
        onClose={() => {
          setShowResults(false);
          router.back();
        }}
      />
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  loadingScreen:    { flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  loadingText:      { color: T.muted, fontSize: 14 },
  bg:               { flex: 1, backgroundColor: T.bg },
  overlay:          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6,6,8,0.72)' },
  scroll:           { flex: 1 },
  content:          { alignItems: 'center', paddingVertical: 16, paddingBottom: 48 },
  board: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(11,11,14,0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  modeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn:          { color: T.gold, fontSize: 13, fontWeight: '700' },
  modeLabel:        { color: T.white, fontSize: 13, fontWeight: '700' },
  dailyHeader:      { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 6 },
  handPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(251,191,36,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  handPillText:     { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  dailyScore:       { color: T.muted, fontSize: 14 },
  dailyScoreVal:    { color: T.white, fontWeight: 'bold' },
  streakHud:        { color: T.muted, fontSize: 12, fontWeight: '600' },
  streakHudNum:     { color: T.gold,  fontWeight: '800' },
  divider:          { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 },
  section:          { paddingHorizontal: 16, paddingVertical: 12 },
  sectionLabel:     { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  completedMsg:     { color: T.gold, fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  viewResultsBtn:   { backgroundColor: T.gold, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  viewResultsBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
  recapSection:     { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  recapTitle:       { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  recapRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recapHand:        { color: T.muted, fontSize: 13, flex: 1 },
  recapResult:      { fontSize: 15, fontWeight: 'bold', width: 20 },
  recapDelta:       { fontSize: 13, fontWeight: '600', width: 36, textAlign: 'right' },
  correct:          { color: '#4caf50' },
  incorrect:        { color: '#e94560' },
  noCardsWrap: {
    marginTop: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  noCardsText: {
    color: T.muted,
    fontSize: 12,
  },
  popOverlay: {
    position: 'absolute',
    top: '30%' as any,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'none' as any,
  },
});
