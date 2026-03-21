import { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { T }                    from '../../../src/components/ui/Theme';
import { TIMING }               from '../../../src/components/poker-challenge/animations';
import { usePokerProgress }     from '../../../src/components/poker-challenge/usePokerProgress';
import { ChallengeHeader }      from '../../../src/components/poker-challenge/ChallengeHeader';
import { QuestionPanel }        from '../../../src/components/poker-challenge/QuestionPanel';
import { HandDisplay }          from '../../../src/components/poker-challenge/HandDisplay';
import { DecisionButtons }      from '../../../src/components/poker-challenge/DecisionButtons';
import { ResultBanner }         from '../../../src/components/poker-challenge/ResultBanner';
import { ContinuePanel }        from '../../../src/components/poker-challenge/ContinuePanel';
import { ScoreRulesPanel }      from '../../../src/components/poker-challenge/ScoreRulesPanel';
import { ScoreDeltaPop }        from '../../../src/components/poker-challenge/ScoreDeltaPop';
import { WheelModal }           from '../../../src/components/poker-challenge/WheelModal';
import { LevelCompleteModal }   from '../../../src/components/poker-challenge/LevelCompleteModal';
import { LoginGateModal }       from '../../../src/components/poker-challenge/LoginGateModal';
import { getNextChallenge }     from '../../../src/components/poker-challenge/challengeSelector';
import { getScoreDelta, applyScore, getPointsRequired } from '../../../src/components/poker-challenge/scoring';
import { StatsPanel }          from '../../../src/components/poker-challenge/StatsPanel';
import { StreakBadge }         from '../../../src/components/poker-challenge/StreakBadge';
import { getInitialStats, applyHandStats, applyWheelStats, applyLevelProgress } from '../../../src/components/poker-challenge/stats';
import type { PokerStats }     from '../../../src/components/poker-challenge/stats';
import { getTitleForLevel, getNextTitle, isTitleUnlockLevel } from '../../../src/components/poker-challenge/titleSystem';
import { DailyChallengeCard } from '../../../src/components/poker-challenge/DailyChallengeCard';
import type { PokerChallengeProgress } from '../../../src/components/poker-challenge/progressStorage';
import type { Challenge }       from '../../../src/components/poker-challenge/challengeTypes';

const SCORE_TABLE     = { correctWin: 13, correctLose: 7, incorrectWin: -5, incorrectLose: -10 };
const MAX_GUEST_LEVEL = 5;

interface GameState {
  level: number;
  score: number;
  handsCompleted: number;
  currentChallenge: Challenge;
  challengeHistory: string[];
  selectedAnswer: 'yes' | 'no' | null;
  lastScoreDelta: number;
  lastResultType: 'correct' | 'incorrect' | null;
  wheelPending: boolean;
  levelComplete: boolean;
  loginRequiredForNextLevel: boolean;
  stats: PokerStats;
}

function makeInitialState(): GameState {
  return {
    level: 1,
    score: 0,
    handsCompleted: 0,
    currentChallenge: getNextChallenge({ level: 1, history: [] }),
    challengeHistory: [],
    selectedAnswer: null,
    lastScoreDelta: 0,
    lastResultType: null,
    wheelPending: false,
    levelComplete: false,
    loginRequiredForNextLevel: false,
    stats: getInitialStats(),
  };
}

export default function PokerChallengePage() {
  const { isGuest, progressLoaded, savedProgress, saveProgress, resetProgress } = usePokerProgress();
  const [gs, setGs] = useState<GameState>(makeInitialState);

  // â”€â”€ Staged reveal state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 0=idle, 2=correctness, 3=explanation, 4=villain, 5=flop, 6=turn,
  // 7=river, 9=delta pop, 10=continue enabled
  const [revealPhase, setRevealPhase] = useState(0);
  const timerRefs    = useRef<ReturnType<typeof setTimeout>[]>([]);

  // â”€â”€ Score delta pop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [deltaPop, setDeltaPop] = useState<{ value: number; show: boolean }>({ value: 0, show: false });

  function cancelTimers() {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }

  // Cancel timers on unmount
  useEffect(() => () => cancelTimers(), []);

  // Restore saved progress once auth + storage resolve
  useEffect(() => {
    if (!progressLoaded || !savedProgress) return;
    const level = isGuest ? Math.min(savedProgress.level, MAX_GUEST_LEVEL) : savedProgress.level;
    const history = savedProgress.challengeHistory ?? [];
    setGs(prev => ({
      ...prev,
      level,
      score:            savedProgress.score,
      handsCompleted:   savedProgress.handsCompleted,
      currentChallenge: getNextChallenge({ level, history }),
      challengeHistory: history,
      wheelPending:     savedProgress.wheelPending,
      stats:            savedProgress.stats ?? getInitialStats(),
    }));
    setRevealPhase(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

  const challenge = gs.currentChallenge;
  const pointsRequired = getPointsRequired(gs.level);
  const showGuestPromo = isGuest && gs.level >= 4;

  // Derived reveal flags
  const buttonsLocked    = revealPhase >= 1;
  const showCorrectness  = revealPhase >= 2;
  const showExplanation  = revealPhase >= 3;
  const showVillainCards = revealPhase >= 4;
  const showFlop         = revealPhase >= 5;
  const showTurn         = revealPhase >= 6;
  const showRiver        = revealPhase >= 7;
  const canContinue      = revealPhase >= 10;

  // â”€â”€ Reveal sequence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function scheduleReveal(delta: number) {
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
        if (phase === 9) setDeltaPop({ value: delta, show: true });
      }, delay));
    });
  }

  function snap(state: GameState, extra?: Partial<PokerChallengeProgress>): PokerChallengeProgress {
    return {
      level:                 state.level,
      score:                 state.score,
      handsCompleted:        state.handsCompleted,
      currentChallengeIndex: 0,
      currentChallengeId:    state.currentChallenge.id,
      challengeHistory:      state.challengeHistory,
      wheelPending:          state.wheelPending,
      lastWheelResult:       null,
      updatedAt:             new Date().toISOString(),
      stats:                 state.stats,
      ...extra,
    };
  }

  function handleAnswer(answer: 'yes' | 'no') {
    if (revealPhase > 0) return;
    const isCorrect = answer === challenge.correctAnswer;
    const delta     = getScoreDelta(isCorrect, challenge.heroWins);
    const newScore  = applyScore(gs.score, delta);
    const next: GameState = {
      ...gs,
      selectedAnswer: answer,
      lastScoreDelta: delta,
      lastResultType: isCorrect ? 'correct' : 'incorrect',
      score: newScore,
      stats: applyHandStats(gs.stats, { isCorrect, heroWins: challenge.heroWins }),
    };
    setGs(next);
    setRevealPhase(1);
    cancelTimers();
    scheduleReveal(delta);
    saveProgress(snap(next));
  }

  function handleContinue() {
    if (!canContinue) return;
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });

    const newHands = gs.handsCompleted + 1;
    const wheel    = newHands > 0 && newHands % 15 === 0;
    const lvlDone  = gs.score >= getPointsRequired(gs.level);
    const newHistory = [...gs.challengeHistory.slice(-15), gs.currentChallenge.id];
    const next: GameState = {
      ...gs,
      handsCompleted:   newHands,
      currentChallenge: getNextChallenge({ level: gs.level, history: newHistory }),
      challengeHistory: newHistory,
      selectedAnswer: null,
      lastScoreDelta: 0,
      lastResultType: null,
      wheelPending:   wheel && !lvlDone,
      levelComplete:  lvlDone,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  function handleWheelResult(pts: number) {
    const newScore = applyScore(gs.score, pts);
    const lvlDone  = newScore >= getPointsRequired(gs.level);
    const next: GameState = {
      ...gs,
      wheelPending: false,
      score: newScore,
      levelComplete: lvlDone,
      stats: applyWheelStats(gs.stats, pts),
    };
    setGs(next);
    saveProgress(snap(next, { lastWheelResult: pts }));
    setDeltaPop({ value: pts, show: true });
  }

  function handleAdvanceLevel() {
    const nextLevel = gs.level + 1;
    if (isGuest && nextLevel > MAX_GUEST_LEVEL) {
      setGs(prev => ({ ...prev, levelComplete: false, loginRequiredForNextLevel: true }));
      return;
    }
    const newHistory: string[] = [];
    const next: GameState = {
      ...gs,
      level: nextLevel,
      levelComplete: false,
      loginRequiredForNextLevel: false,
      currentChallenge: getNextChallenge({ level: nextLevel, history: newHistory }),
      challengeHistory: newHistory,
      stats: applyLevelProgress(gs.stats, nextLevel),
    };
    setGs(next);
    saveProgress(snap(next));
  }

  async function handleStartOver() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    await resetProgress();
    setGs(makeInitialState());
  }

  const currentTitle = getTitleForLevel(gs.level);
  const nextTitleInfo = getNextTitle(gs.level);
  const titleJustUnlocked = isTitleUnlockLevel(gs.level);

  return (
    <ImageBackground
      source={require('../../../assets/asset01.jpg')}
      style={s.bg}
      resizeMode="cover"
    >
      <View style={s.overlay} pointerEvents="none" />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.board}>

          {/* Mode HUD */}
          <View style={s.modeBar}>
            <Text style={s.modeLabel}>
              {isGuest ? 'ðŸ‘¤ Guest Mode Â· Free through Lvl 5' : 'âœ… Progress Saved'}
            </Text>
            <TouchableOpacity onPress={handleStartOver} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
              <Text style={s.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <ChallengeHeader
            level={gs.level}
            points={gs.score}
            pointsRequired={pointsRequired}
            title={currentTitle}
            streak={gs.stats.currentStreak}
          />

          {/* Stats panel */}
          <StatsPanel stats={gs.stats} level={gs.level} />

          <View style={s.divider} />

          {/* Challenge label + question */}}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Challenge #{gs.handsCompleted + 1}</Text>
            <QuestionPanel
              question={challenge.question}
              explanation={challenge.explanation}
              showExplanation={showExplanation}
            />
          </View>

          {/* Cards â€” villain reveal + staged board */}
          <HandDisplay
            heroHand={challenge.heroHand}
            villainHand={challenge.villainHand}
            villainRevealed={showVillainCards}
            runout={challenge.runout}
            showFlop={showFlop}
            showTurn={showTurn}
            showRiver={showRiver}
          />

          {/* Correctness banner â€” springs in after answer */}
          <ResultBanner result={showCorrectness ? gs.lastResultType : null} />

          {/* Decision buttons (disabled once locked) or Continue panel */}
          {!canContinue ? (
            <DecisionButtons
              onYes={() => handleAnswer('yes')}
              onNo={() => handleAnswer('no')}
              disabled={buttonsLocked}
              selected={gs.selectedAnswer}
            />
          ) : (
            <ContinuePanel
              scoreDelta={gs.lastScoreDelta}
              heroWins={challenge.heroWins}
              streak={gs.stats.currentStreak}
              onContinue={handleContinue}
            />
          )}

          <View style={s.divider} />

          {/* Score rules */}
          <View style={s.section}>
            <ScoreRulesPanel scoreTable={SCORE_TABLE} />
          </View>

          {/* Guest upsell â€” only on level 4+ */}
          {showGuestPromo && (
            <View style={s.guestPromoWrap}>
              <Text style={s.guestPromoText}>
                ðŸ”“ Create a free account to save your run and unlock Level 6+
              </Text>
            </View>
          )}

        </View>

        {/* Daily Challenge entry card */}
        <DailyChallengeCard />

      </ScrollView>

      {/* Floating score delta popup */}
      <View style={s.popOverlay} pointerEvents="none">
        <ScoreDeltaPop
          delta={deltaPop.value}
          visible={deltaPop.show}
          onDone={() => setDeltaPop(prev => ({ ...prev, show: false }))}
        />
      </View>

      <WheelModal visible={gs.wheelPending} onResult={handleWheelResult} />

      <LevelCompleteModal
        visible={gs.levelComplete}
        level={gs.level}
        score={gs.score}
        nextThreshold={getPointsRequired(gs.level + 1)}
        currentTitle={currentTitle}
        nextTitleInfo={nextTitleInfo}
        titleJustUnlocked={titleJustUnlocked}
        onAdvance={handleAdvanceLevel}
      />

      <LoginGateModal
        visible={gs.loginRequiredForNextLevel}
        onStartOver={handleStartOver}
        onClose={() => setGs(prev => ({ ...prev, loginRequiredForNextLevel: false }))}
      />
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg:      { flex: 1, backgroundColor: T.bg },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6,6,8,0.72)' },
  scroll:  { flex: 1 },
  content: { alignItems: 'center', paddingVertical: 16, paddingBottom: 48 },
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
  modeLabel:      { color: T.muted, fontSize: 11, fontWeight: '600' },
  resetText:      { color: T.gold, fontSize: 11, fontWeight: '700' },
  divider:        { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 },
  section:        { paddingHorizontal: 16, paddingVertical: 12 },
  sectionLabel:   { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  guestPromoWrap: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.25)',
  },
  guestPromoText: { color: T.gold, fontSize: 12, textAlign: 'center', lineHeight: 18 },
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
