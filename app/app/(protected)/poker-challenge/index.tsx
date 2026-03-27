import { useState, useEffect, useRef, useMemo } from 'react';
import { Alert, ScrollView, View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { T }                    from '../../../src/components/ui/Theme';
import { TIMING }               from '../../../src/components/poker-challenge/animations';
import { usePokerProgress }     from '../../../src/components/poker-challenge/usePokerProgress';
import { ChallengeHeader }      from '../../../src/components/poker-challenge/ChallengeHeader';
import { QuestionPanel }        from '../../../src/components/poker-challenge/QuestionPanel';
import { HandDisplay }          from '../../../src/components/poker-challenge/HandDisplay';
import { OutsCardDisplay }      from '../../../src/components/poker-challenge/OutsCardDisplay';
import { DecisionButtons }      from '../../../src/components/poker-challenge/DecisionButtons';
import { MultiChoiceButtons }   from '../../../src/components/poker-challenge/MultiChoiceButtons';
import { ResultBanner }         from '../../../src/components/poker-challenge/ResultBanner';
import { ContinuePanel }        from '../../../src/components/poker-challenge/ContinuePanel';
import { ScoreDeltaPop }        from '../../../src/components/poker-challenge/ScoreDeltaPop';
import { WheelModal }           from '../../../src/components/poker-challenge/WheelModal';
import { LevelCompleteModal }   from '../../../src/components/poker-challenge/LevelCompleteModal';
import { LoginGateModal }       from '../../../src/components/poker-challenge/LoginGateModal';
import { SessionSummaryModal }  from '../../../src/components/poker-challenge/SessionSummaryModal';
import { TierCompleteModal }    from '../../../src/components/poker-challenge/TierCompleteModal';
import { GrandChampionModal }   from '../../../src/components/poker-challenge/GrandChampionModal';
import { LevelSelectPanel }     from '../../../src/components/poker-challenge/LevelSelectPanel';
import { getNextChallenge, buildSessionPool, getQuestionById, getGauntletQuestion } from '../../../src/components/poker-challenge/challengeSelector';
import { getScoreDelta, applyScore, getPointsRequired, MAX_CHALLENGE_LEVEL } from '../../../src/components/poker-challenge/scoring';
import { StatsPanel }          from '../../../src/components/poker-challenge/StatsPanel';
import { getInitialStats, applyHandStats, applyWheelStats, applyLevelProgress } from '../../../src/components/poker-challenge/stats';
import type { PokerStats }     from '../../../src/components/poker-challenge/stats';
import { getTitleForLevel, getNextTitle, isTitleUnlockLevel } from '../../../src/components/poker-challenge/titleSystem';
import { DailyChallengeCard } from '../../../src/components/poker-challenge/DailyChallengeCard';
import { AdBreakModal }       from '../../../src/components/poker-challenge/AdBreakModal';
import { canShowAd, markAdShown } from '../../../src/components/poker-challenge/adBreakStorage';
import { getAuthReturnTarget, clearAuthReturnTarget } from '../../../src/components/poker-challenge/authReturn';
import { PostAuthResumeBanner } from '../../../src/components/poker-challenge/PostAuthResumeBanner';
import { playSound } from '../../../src/components/poker-challenge/gameAudio';
import { triggerTapHaptic, triggerCorrectHaptic, triggerIncorrectHaptic } from '../../../src/components/poker-challenge/gameHaptics';
import type { PokerChallengeProgress } from '../../../src/components/poker-challenge/progressStorage';
import { recordChallengeQuestionEvent } from '../../../src/components/poker-challenge/challengeAnalyticsStorage';
import {
  adaptQuestionToRuntime,
  isRuntimeAnswerCorrect,
  type RuntimeChallenge,
} from '../../../src/components/poker-challenge/challengeQuestionAdapter';

/** Get the next valid (non-null) RuntimeChallenge, retrying if a question is malformed. */
function safeAdapt(level: number, history: string[]): RuntimeChallenge {
  // Try up to 10 different questions before giving up
  for (let attempt = 0; attempt < 10; attempt++) {
    const q = getNextChallenge({ level, history });
    const rt = adaptQuestionToRuntime(q);
    if (rt) return rt;
    // push the bad id so it doesn't get re-selected immediately
    history = [...history, q.id];
  }
  // Last resort fallback — a valid synthetic question so the screen never crashes
  return {
    id:           'fallback',
    category:     'action',
    panelTitle:   'GTO SCENARIO',
    scenario:     'What is the best action in this spot?',
    explanation:  '',
    answerOptions:['FOLD', 'CALL', 'RAISE'],
    correctAnswer:'FOLD',
    heroWins:     false,
    tags:         [],
  };
}

/**
 * Adapt the question at `ids[idx]` to a RuntimeChallenge.
 * Walks forward through the pool if a question fails adaptation,
 * then falls back to safeAdapt() for a random pick.
 */
function safeAdaptFromPool(level: number, ids: string[], idx: number): RuntimeChallenge {
  for (let attempt = 0; attempt < ids.length; attempt++) {
    const targetIdx = (idx + attempt) % ids.length;
    const q = getQuestionById(level, ids[targetIdx]);
    if (q) {
      const rt = adaptQuestionToRuntime(q);
      if (rt) return rt;
    }
  }
  // All pool entries failed adaptation — fall back to random pick
  return safeAdapt(level, []);
}

/**
 * Adapt a gauntlet question to RuntimeChallenge, retrying on malformed questions.
 */
function safeGauntletAdapt(history: string[]): RuntimeChallenge {
  for (let attempt = 0; attempt < 10; attempt++) {
    const q  = getGauntletQuestion(history);
    const rt = adaptQuestionToRuntime(q);
    if (rt) return rt;
    history = [...history, q.id];
  }
  return safeAdapt(MAX_CHALLENGE_LEVEL, []);
}

const MAX_GUEST_LEVEL = 5;
/** Number of questions per level play session. */
const SESSION_LENGTH  = 12;
/** Number of questions per Elite Gauntlet run (TC095). */
const GAUNTLET_LENGTH = 25;
/** Minimum fraction correct to pass a session and unlock the next level. */
const SESSION_PASS_THRESHOLD = 0.7;

// ── Tier system ────────────────────────────────────────────────────────────
const TIER_NAMES     = ['Beginner', 'Apprentice', 'Grinder', 'Chip Leader', 'Master'];
const LEVELS_PER_TIER = 5;

function getTierForLevel(level: number): string {
  const idx = Math.floor((level - 1) / LEVELS_PER_TIER);
  return TIER_NAMES[Math.min(idx, TIER_NAMES.length - 1)];
}

function getNextTier(tier: string): string | null {
  const idx = TIER_NAMES.indexOf(tier);
  return idx >= 0 && idx < TIER_NAMES.length - 1 ? TIER_NAMES[idx + 1] : null;
}

interface GameState {
  level: number;
  score: number;
  handsCompleted: number;
  currentChallenge: RuntimeChallenge;
  challengeHistory: string[];
  selectedAnswer: string | null;
  lastScoreDelta: number;
  lastResultType: 'correct' | 'incorrect' | null;
  wheelPending: boolean;
  levelComplete: boolean;
  grandChampionUnlocked: boolean;
  loginRequiredForNextLevel: boolean;
  stats: PokerStats;
  // ── Session tracking (TC078) ─────────────────────────────────────────────
  /** Correct answers in the current session. */
  sessionCorrect: number;
  /** Total answers given in the current session (0 … SESSION_LENGTH). */
  sessionTotal: number;
  /** True once sessionTotal reaches SESSION_LENGTH. Clears on retry/advance. */
  sessionComplete: boolean;
  /** Global level numbers the user has unlocked. Always includes 1. */
  unlockedLevels: number[];
  /** The 12 question IDs pre-selected for this session (restores on reload). */
  sessionQuestionIds: string[];
  /** Index of the question currently being played in the session pool (0-based). */
  sessionQuestionIndex: number;
  /** Tier name currently active (e.g. 'Beginner'). */
  currentTier: string;
  /** Tier names the player has unlocked. Always includes 'Beginner'. */
  unlockedTiers: string[];
  /** Tier names where all levels have been passed at least once. */
  completedTiers: string[];
  /** True while the tier-complete modal should be visible. Cleared on any navigation. */
  tierComplete: boolean;
  /** True when the Grand Champion reward modal should be visible. */
  grandChampionModal: boolean;
  /** 'challenge' = normal progression; 'gauntlet' = Elite Gauntlet mode (TC095). */
  mode: 'challenge' | 'gauntlet';
  /** History of question IDs served during the current gauntlet run. */
  gauntletHistory: string[];
}

function makeInitialState(): GameState {
  const initialPool = buildSessionPool(1, SESSION_LENGTH);
  return {
    level: 1,
    score: 0,
    handsCompleted: 0,
    currentChallenge: safeAdaptFromPool(1, initialPool, 0),
    challengeHistory: [],
    selectedAnswer: null,
    lastScoreDelta: 0,
    lastResultType: null,
    wheelPending: false,
    levelComplete: false,
    grandChampionUnlocked: false,
    loginRequiredForNextLevel: false,
    stats: getInitialStats(),
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionComplete: false,
    unlockedLevels: [1],
    sessionQuestionIds:   initialPool,
    sessionQuestionIndex: 0,
    currentTier:    'Beginner',
    unlockedTiers:  ['Beginner'],
    completedTiers: [],
    tierComplete:      false,
    grandChampionModal: false,
    mode:               'challenge',
    gauntletHistory:    [],
  };
}

export default function PokerChallengePage() {
  const { isGuest, progressLoaded, savedProgress, saveProgress, resetProgress, didMigrateGuestProgress } = usePokerProgress();
  const [gs, setGs] = useState<GameState>(makeInitialState);
  const [showEntryAd, setShowEntryAd]     = useState(false);
  const [postAuthMessage, setPostAuthMessage] = useState('');

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

  // Dev-only: validate all generated question banks once on mount (TC096)
  useEffect(() => {
    if (__DEV__) {
      import('../../../src/components/poker-challenge/challengeBankValidationReport')
        .then(({ printChallengeBankReport }) => printChallengeBankReport())
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore saved progress once auth + storage resolve
  useEffect(() => {
    if (!progressLoaded || !savedProgress) return;
    const cappedLevel = Math.min(savedProgress.level, MAX_CHALLENGE_LEVEL);
    const level = isGuest ? Math.min(cappedLevel, MAX_GUEST_LEVEL) : cappedLevel;
    const history = savedProgress.challengeHistory ?? [];

    // Restore the saved session pool, or build a fresh one if missing/expired
    const savedIds   = savedProgress.sessionQuestionIds ?? [];
    const savedIdx   = savedProgress.sessionQuestionIndex ?? 0;
    const savedTotal = savedProgress.sessionTotal ?? 0;
    // If the saved session is complete, start fresh rather than resuming into Q12
    const sessionDone = savedTotal >= SESSION_LENGTH;
    const hasPool     = savedIds.length === SESSION_LENGTH && !sessionDone;
    if (__DEV__ && !hasPool) {
      console.log(`[PokerChallenge] Building fresh session pool (savedIds=${savedIds.length}, sessionDone=${sessionDone})`);
    }
    const questionIds = hasPool ? savedIds : buildSessionPool(level, SESSION_LENGTH);
    const questionIdx = hasPool ? Math.min(savedIdx, SESSION_LENGTH - 1) : 0;

    setGs(prev => ({
      ...prev,
      level,
      score:                 savedProgress.score,
      handsCompleted:        savedProgress.handsCompleted,
      currentChallenge:      safeAdaptFromPool(level, questionIds, questionIdx),
      challengeHistory:      history,
      wheelPending:          savedProgress.wheelPending,
      grandChampionUnlocked: !!savedProgress.grandChampionUnlocked,
      stats:                 savedProgress.stats ?? getInitialStats(),
      unlockedLevels:        savedProgress.unlockedLevels ?? [1],
      sessionCorrect:        sessionDone ? 0 : (savedProgress.sessionCorrect ?? 0),
      sessionTotal:          sessionDone ? 0 : savedTotal,
      sessionComplete:       false,   // never restore into summary modal
      sessionQuestionIds:    questionIds,
      sessionQuestionIndex:  questionIdx,
      currentTier:    savedProgress.currentTier   ?? 'Beginner',
      unlockedTiers:  savedProgress.unlockedTiers  ?? ['Beginner'],
      completedTiers: savedProgress.completedTiers ?? [],
      tierComplete:   false,
    }));
    setRevealPhase(0);

    // Check for post-auth return (Level 6 gate or manual login)
    getAuthReturnTarget().then(async (target) => {
      if (
        !isGuest &&
        target?.pendingAdvanceLevel &&
        target.source === 'level6-gate' &&
        level <= MAX_GUEST_LEVEL
      ) {
        await clearAuthReturnTarget();
        const nextLevel    = level + 1;
        const newHistory: string[] = [];
        const nextChallenge = safeAdapt(nextLevel, newHistory);
        const nextStats     = applyLevelProgress(savedProgress.stats ?? getInitialStats(), nextLevel);
        setGs(prev => ({
          ...prev,
          level: nextLevel,
          levelComplete: false,
          loginRequiredForNextLevel: false,
          currentChallenge: nextChallenge,
          challengeHistory: newHistory,
          stats: nextStats,
        }));
        saveProgress({
          level:                 nextLevel,
          score:                 savedProgress.score,
          handsCompleted:        savedProgress.handsCompleted,
          currentChallengeIndex: 0,
          currentChallengeId:    nextChallenge.id,
          challengeHistory:      newHistory,
          wheelPending:          false,
          lastWheelResult:       null,
          grandChampionUnlocked: !!savedProgress.grandChampionUnlocked,
          updatedAt:             new Date().toISOString(),
          stats:                 nextStats,
        });
        setPostAuthMessage(
          didMigrateGuestProgress
            ? 'Progress transferred. Level 6 unlocked.'
            : 'Welcome back. Progress restored.',
        );
      } else {
        canShowAd('main').then(show => { if (show) setShowEntryAd(true); });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

  const challenge         = gs.currentChallenge;
  const pointsRequired    = useMemo(() => getPointsRequired(gs.level), [gs.level]);
  const showGuestPromo    = useMemo(() => isGuest && gs.level >= 4, [isGuest, gs.level]);
  const currentTitle      = useMemo(() => getTitleForLevel(gs.level), [gs.level]);
  const nextTitleInfo     = useMemo(() => getNextTitle(gs.level), [gs.level]);
  const titleJustUnlocked = useMemo(() => isTitleUnlockLevel(gs.level), [gs.level]);

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
      grandChampionUnlocked: state.grandChampionUnlocked,
      updatedAt:             new Date().toISOString(),
      stats:                 state.stats,
      unlockedLevels:        state.unlockedLevels,
      sessionCorrect:        state.sessionCorrect,
      sessionTotal:          state.sessionTotal,
      sessionQuestionIds:    state.sessionQuestionIds,
      sessionQuestionIndex:  state.sessionQuestionIndex,
      currentTier:           state.currentTier,
      unlockedTiers:         state.unlockedTiers,
      completedTiers:        state.completedTiers,
      ...extra,
    };
  }

  function handleAnswer(answer: string) {
    if (revealPhase > 0) return;
    playSound('tap');
    triggerTapHaptic();
    const isCorrect = isRuntimeAnswerCorrect(challenge, answer);
    const handOutcomeForUi = challenge.category === 'action' ? challenge.heroWins : isCorrect;
    const delta     = getScoreDelta(isCorrect, challenge.heroWins, challenge.category, answer);
    const newScore  = applyScore(gs.score, delta);
    const next: GameState = {
      ...gs,
      selectedAnswer: answer,
      lastScoreDelta: delta,
      lastResultType: isCorrect ? 'correct' : 'incorrect',
      score: newScore,
      stats: applyHandStats(gs.stats, { isCorrect, heroWins: handOutcomeForUi }),
      sessionCorrect: gs.sessionCorrect + (isCorrect ? 1 : 0),
    };
    setGs(next);
    setRevealPhase(1);
    cancelTimers();
    scheduleReveal(delta, isCorrect, handOutcomeForUi);
    saveProgress(snap(next));
    // Analytics — fire-and-forget (TC096)
    recordChallengeQuestionEvent({
      questionId:     challenge.id,
      tier:           gs.mode === 'gauntlet' ? 'gauntlet' : gs.currentTier,
      level:          gs.mode === 'gauntlet' ? 0 : gs.level,
      category:       challenge.category,
      correct:        isCorrect,
      selectedAnswer: answer,
      correctAnswer:  challenge.correctAnswer,
      scoreDelta:     delta,
      mode:           gs.mode,
      timestamp:      new Date().toISOString(),
    }).catch(() => {});
  }

  function handleContinue() {
    if (!canContinue) return;
    playSound('tap');
    triggerTapHaptic();
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });

    const newHands        = gs.handsCompleted + 1;
    const newSessionTotal = gs.sessionTotal + 1;
    const newHistory      = [...gs.challengeHistory.slice(-15), gs.currentChallenge.id];

    // ── Elite Gauntlet mode ──────────────────────────────────────────────────────────────────────
    if (gs.mode === 'gauntlet') {
      const newGauntletHistory = [...gs.gauntletHistory, gs.currentChallenge.id];
      if (newSessionTotal >= GAUNTLET_LENGTH) {
        // Gauntlet run complete — re-show Grand Champion modal
        const next: GameState = {
          ...gs,
          handsCompleted:     newHands,
          challengeHistory:   newHistory,
          gauntletHistory:    newGauntletHistory,
          selectedAnswer:     null,
          lastScoreDelta:     0,
          lastResultType:     null,
          wheelPending:       false,
          levelComplete:      false,
          sessionTotal:       newSessionTotal,
          sessionComplete:    false,
          tierComplete:       false,
          grandChampionModal: true,
          mode:               'challenge',
        };
        setGs(next);
        saveProgress(snap(next));
        return;
      }
      // Continue gauntlet — pick next weighted question
      const nextChallenge = safeGauntletAdapt(newGauntletHistory);
      const next: GameState = {
        ...gs,
        handsCompleted:   newHands,
        currentChallenge: nextChallenge,
        challengeHistory: newHistory,
        gauntletHistory:  newGauntletHistory,
        selectedAnswer:   null,
        lastScoreDelta:   0,
        lastResultType:   null,
        wheelPending:     false,
        levelComplete:    false,
        sessionTotal:     newSessionTotal,
      };
      setGs(next);
      saveProgress(snap(next));
      return;
    }

    if (newSessionTotal >= SESSION_LENGTH) {
      // ── Session complete ────────────────────────────────────────────────────────────
      // Detect first-time tier-completing pass (e.g. passing Beginner Level 5)
      const finalCorrect   = gs.sessionCorrect; // handleAnswer already incremented this
      const passed         = finalCorrect / SESSION_LENGTH >= SESSION_PASS_THRESHOLD;
      const isTierEnd      = gs.level % LEVELS_PER_TIER === 0;
      const tierName       = getTierForLevel(gs.level);
      const tierAlreadyDone = gs.completedTiers.includes(tierName);
      const isTierComplete = passed && isTierEnd && !tierAlreadyDone;

      const newCompletedTiers = isTierComplete
        ? Array.from(new Set([...gs.completedTiers, tierName]))
        : gs.completedTiers;
      const nextTierName    = getNextTier(tierName);
      const newUnlockedTiers = isTierComplete && nextTierName
        ? Array.from(new Set([...gs.unlockedTiers, nextTierName]))
        : gs.unlockedTiers;

      const next: GameState = {
        ...gs,
        handsCompleted:   newHands,
        challengeHistory: newHistory,
        selectedAnswer:   null,
        lastScoreDelta:   0,
        lastResultType:   null,
        wheelPending:     false,
        levelComplete:    false,
        sessionTotal:     newSessionTotal,
        // Suppress normal session summary when tier modal fires
        sessionComplete:  !isTierComplete,
        tierComplete:     isTierComplete,
        completedTiers:   newCompletedTiers,
        unlockedTiers:    newUnlockedTiers,
      };
      setGs(next);
      saveProgress(snap(next));
    } else {
      // ── Continue session normally ─────────────────────────────────────────
      const wheel   = newHands > 0 && newHands % 15 === 0;
      // Don't re-trigger level-complete once grand champion is already claimed
      const lvlDone = !gs.grandChampionUnlocked && gs.score >= getPointsRequired(gs.level);
      const nextIdx = gs.sessionQuestionIndex + 1;
      const next: GameState = {
        ...gs,
        handsCompleted:       newHands,
        currentChallenge:     safeAdaptFromPool(gs.level, gs.sessionQuestionIds, nextIdx),
        challengeHistory:     newHistory,
        selectedAnswer:       null,
        lastScoreDelta:       0,
        lastResultType:       null,
        wheelPending:         wheel && !lvlDone,
        levelComplete:        lvlDone,
        sessionTotal:         newSessionTotal,
        sessionQuestionIndex: nextIdx,
      };
      setGs(next);
      saveProgress(snap(next));
    }
  }

  function handleWheelResult(pts: number) {
    const newScore = applyScore(gs.score, pts);
    // Don't re-trigger level-complete once grand champion is already claimed
    const lvlDone  = !gs.grandChampionUnlocked && newScore >= getPointsRequired(gs.level);
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
    if (gs.level >= MAX_CHALLENGE_LEVEL) {
      const now = new Date().toISOString();
      const next: GameState = {
        ...gs,
        level: MAX_CHALLENGE_LEVEL,
        levelComplete: false,
        grandChampionUnlocked: true,
        grandChampionModal: true,
        tierComplete:   false,
        sessionCorrect: 0,
        sessionTotal: 0,
        sessionComplete: false,
      };
      setGs(next);
      saveProgress(snap(next, {
        grandChampionUnlocked:  true,
        hasCompletedChallenge:  true,
        grandChampionAchievedAt: now,
      }));
      return;
    }

    const nextLevel = gs.level + 1;
    if (isGuest && nextLevel > MAX_GUEST_LEVEL) {
      setGs(prev => ({ ...prev, levelComplete: false, sessionComplete: false, tierComplete: false, loginRequiredForNextLevel: true }));
      return;
    }
    const newHistory: string[] = [];
    // Unlock the next level in the progression list
    const updatedUnlocked = Array.from(new Set([...gs.unlockedLevels, nextLevel]));
    const newPool = buildSessionPool(nextLevel, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      level: nextLevel,
      levelComplete: false,
      loginRequiredForNextLevel: false,
      tierComplete:         false,
      currentChallenge:     safeAdaptFromPool(nextLevel, newPool, 0),
      challengeHistory:     newHistory,
      stats:                applyLevelProgress(gs.stats, nextLevel),
      unlockedLevels:       updatedUnlocked,
      currentTier:          getTierForLevel(nextLevel),
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionComplete:      false,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  function handleStartOver() {
    Alert.alert(
      'Reset Progress',
      'This will erase all saved progress, scores, and unlocked levels. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            cancelTimers();
            setRevealPhase(0);
            setDeltaPop({ value: 0, show: false });
            await resetProgress();
            setGs(makeInitialState());
          },
        },
      ],
    );
  }

  function handleRetrySession() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const newHistory: string[] = [];
    const newPool = buildSessionPool(gs.level, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      currentChallenge:     safeAdaptFromPool(gs.level, newPool, 0),
      challengeHistory:     newHistory,
      selectedAnswer:       null,
      lastScoreDelta:       0,
      lastResultType:       null,
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionComplete:      false,
      tierComplete:         false,
      levelComplete:        false,
      wheelPending:         false,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  function handleLevelSelect(level: number) {
    if (!gs.unlockedLevels.includes(level) || level === gs.level) return;
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const newHistory: string[] = [];
    const newPool = buildSessionPool(level, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      level,
      currentChallenge:     safeAdaptFromPool(level, newPool, 0),
      challengeHistory:     newHistory,
      selectedAnswer:       null,
      lastScoreDelta:       0,
      lastResultType:       null,
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionComplete:      false,
      tierComplete:         false,
      levelComplete:        false,
      wheelPending:         false,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
      currentTier:          getTierForLevel(level),
    };
    setGs(next);
    saveProgress(snap(next));
  }

  /** Advance to the first level of the next tier after tier completion modal. */
  function handleTierContinue() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const nextLevel = gs.level + 1;
    // Guest gate: level 6+ requires sign-in
    if (isGuest && nextLevel > MAX_GUEST_LEVEL) {
      setGs(prev => ({ ...prev, tierComplete: false, levelComplete: false, loginRequiredForNextLevel: true }));
      return;
    }
    // Grand champion placeholder (future Level 25 final-reward hook)
    if (gs.level >= MAX_CHALLENGE_LEVEL) {
      const next: GameState = {
        ...gs,
        tierComplete:          false,
        levelComplete:         false,
        grandChampionUnlocked: true,
        grandChampionModal:    true,
      };
      setGs(next);
      saveProgress(snap(next, { grandChampionUnlocked: true }));
      return;
    }
    const newUnlockedLevels = Array.from(new Set([...gs.unlockedLevels, nextLevel]));
    const newPool = buildSessionPool(nextLevel, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      level:                nextLevel,
      tierComplete:         false,
      levelComplete:        false,
      loginRequiredForNextLevel: false,
      currentChallenge:     safeAdaptFromPool(nextLevel, newPool, 0),
      challengeHistory:     [],
      stats:                applyLevelProgress(gs.stats, nextLevel),
      unlockedLevels:       newUnlockedLevels,
      currentTier:          getTierForLevel(nextLevel),
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionComplete:      false,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  /** Replay the last level of the completed tier without leaving to a new tier. */
  function handleTierReplay() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const newPool = buildSessionPool(gs.level, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      tierComplete:         false,
      sessionComplete:      false,
      levelComplete:        false,
      wheelPending:         false,
      currentChallenge:     safeAdaptFromPool(gs.level, newPool, 0),
      challengeHistory:     [],
      selectedAnswer:       null,
      lastScoreDelta:       0,
      lastResultType:       null,
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  // ── Grand Champion handlers ───────────────────────────────────────────────

  function handleGrandChampionClose() {
    setGs(prev => ({ ...prev, grandChampionModal: false }));
  }

  function handleGrandChampionReplayFinalLevel() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const newPool = buildSessionPool(MAX_CHALLENGE_LEVEL, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      grandChampionModal:   false,
      tierComplete:         false,
      sessionComplete:      false,
      levelComplete:        false,
      wheelPending:         false,
      currentChallenge:     safeAdaptFromPool(MAX_CHALLENGE_LEVEL, newPool, 0),
      challengeHistory:     [],
      selectedAnswer:       null,
      lastScoreDelta:       0,
      lastResultType:       null,
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  function handleGrandChampionReplayTier() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const masterStartLevel = 21;
    const newPool = buildSessionPool(masterStartLevel, SESSION_LENGTH);
    const next: GameState = {
      ...gs,
      grandChampionModal:   false,
      tierComplete:         false,
      sessionComplete:      false,
      levelComplete:        false,
      wheelPending:         false,
      level:                masterStartLevel,
      currentTier:          getTierForLevel(masterStartLevel),
      currentChallenge:     safeAdaptFromPool(masterStartLevel, newPool, 0),
      challengeHistory:     [],
      selectedAnswer:       null,
      lastScoreDelta:       0,
      lastResultType:       null,
      sessionCorrect:       0,
      sessionTotal:         0,
      sessionQuestionIds:   newPool,
      sessionQuestionIndex: 0,
    };
    setGs(next);
    saveProgress(snap(next));
  }

  // ── Elite Gauntlet handler (TC095) ────────────────────────────────────────────────────────────

  function handleStartGauntlet() {
    cancelTimers();
    setRevealPhase(0);
    setDeltaPop({ value: 0, show: false });
    const firstChallenge = safeGauntletAdapt([]);
    const next: GameState = {
      ...gs,
      mode:               'gauntlet',
      grandChampionModal: false,
      currentChallenge:   firstChallenge,
      challengeHistory:   [],
      gauntletHistory:    [firstChallenge.id],
      selectedAnswer:     null,
      lastScoreDelta:     0,
      lastResultType:     null,
      sessionCorrect:     0,
      sessionTotal:       0,
      sessionComplete:    false,
      wheelPending:       false,
      levelComplete:      false,
      tierComplete:       false,
    };
    setGs(next);
    saveProgress(snap(next));
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

          {/* Mode HUD */}
          <View style={s.modeBar}>
            <Text style={s.modeLabel}>
              {isGuest ? 'ðŸ‘¤ Guest Mode Â· Free through Lvl 5' : 'âœ… Progress Saved'}
            </Text>
            <TouchableOpacity onPress={handleStartOver} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
              <Text style={s.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Tier label — shows gauntlet progress in Elite Gauntlet mode */}
          <View style={s.tierBar}>
            <Text style={s.tierBarText}>
              {gs.mode === 'gauntlet'
                ? `⚔️ Elite Gauntlet · ${gs.sessionTotal + 1} / ${GAUNTLET_LENGTH}`
                : `${gs.currentTier} · Level ${gs.level}`}
            </Text>
          </View>

          {/* Header */}
          <ChallengeHeader
            level={gs.level}
            points={gs.score}
            pointsRequired={pointsRequired}
            title={currentTitle}
            streak={gs.stats.currentStreak}
            currentTier={gs.currentTier}
          />

          {/* Level select pips — shows for all tiers (1–25) */}
          {(gs.level <= 25) && (
            <LevelSelectPanel
              currentLevel={gs.level}
              unlockedLevels={gs.unlockedLevels}
              onSelect={handleLevelSelect}
              currentTier={gs.currentTier}
            />
          )}

          {gs.grandChampionUnlocked && (
            <View style={s.championBanner}>
              <Text style={s.championBannerText}>🏆 Grand Champion</Text>
              <TouchableOpacity onPress={handleStartGauntlet} style={s.gauntletBannerBtn}>
                <Text style={s.gauntletBannerBtnText}>⚔️ Elite Gauntlet</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={s.divider} />

          {/* Challenge label + question */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>
              {gs.mode === 'gauntlet'
                ? `Gauntlet Q${gs.sessionTotal + 1} / ${GAUNTLET_LENGTH}`
                : `Challenge #${gs.handsCompleted + 1}  ·  ${gs.sessionTotal + 1} / ${SESSION_LENGTH}`}
            </Text>

            {/* Action questions: scenario text + full hand display or card visual */}
            {challenge.category === 'action' && (
              <>
                <QuestionPanel
                  scenario={challenge.scenario}
                  explanation={challenge.explanation}
                  showExplanation={showExplanation}
                  tag={challenge.panelTitle}
                />
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
                ) : challenge.heroCards && challenge.heroCards.length > 0 ? (
                  <OutsCardDisplay
                    heroCards={challenge.heroCards}
                    boardCards={challenge.boardCards}
                  />
                ) : null}
              </>
            )}

            {/* Outs questions: question text + parsed card display */}
            {challenge.category === 'outs' && (
              <>
                <QuestionPanel
                  scenario={challenge.scenario}
                  explanation={challenge.explanation}
                  showExplanation={showExplanation}
                  tag={challenge.panelTitle}
                />
                <OutsCardDisplay
                  heroCards={challenge.heroCards}
                  boardCards={challenge.boardCards}
                />
              </>
            )}

            {/* EV / pot-odds questions: math prompt only */}
            {challenge.category === 'ev' && (
              <QuestionPanel
                scenario={challenge.scenario}
                explanation={challenge.explanation}
                showExplanation={showExplanation}
                tag={challenge.panelTitle}
              />
            )}

            {/* Position / pressure questions: question text only */}
            {(challenge.category === 'position' || challenge.category === 'pressure') && (
              <QuestionPanel
                scenario={challenge.scenario}
                explanation={challenge.explanation}
                showExplanation={showExplanation}
                tag={challenge.panelTitle}
              />
            )}
          </View>


          {/* Correctness banner — springs in after answer */}
          <ResultBanner result={showCorrectness ? gs.lastResultType : null} />

          {/* Decision buttons (disabled once locked) or Continue panel */}
          {!canContinue ? (
            challenge.category === 'action' ? (
              <DecisionButtons
                options={challenge.answerOptions}
                onSelect={handleAnswer}
                disabled={buttonsLocked}
                selected={gs.selectedAnswer}
              />
            ) : (
              <MultiChoiceButtons
                options={challenge.answerOptions}
                onSelect={handleAnswer}
                disabled={buttonsLocked}
                selected={gs.selectedAnswer}
              />
            )
          ) : (
            <ContinuePanel
              scoreDelta={gs.lastScoreDelta}
              heroWins={challenge.category === 'action' ? challenge.heroWins : gs.lastResultType === 'correct'}
              showHandOutcome={challenge.category === 'action'}
              streak={gs.stats.currentStreak}
              onContinue={handleContinue}
            />
          )}

          {/* Stats — repositioned below questions so gameplay stays the visual focus */}
          <View style={s.divider} />
          <StatsPanel stats={gs.stats} level={gs.level} />

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

      <SessionSummaryModal
        visible={gs.sessionComplete}
        level={gs.level}
        sessionCorrect={gs.sessionCorrect}
        sessionLength={SESSION_LENGTH}
        passed={gs.sessionCorrect / SESSION_LENGTH >= SESSION_PASS_THRESHOLD}
        onRetry={handleRetrySession}
        onNext={handleAdvanceLevel}
      />

      <TierCompleteModal
        visible={gs.tierComplete}
        tier={gs.currentTier}
        level={gs.level}
        nextTier={getNextTier(gs.currentTier)}
        onContinue={handleTierContinue}
        onReplay={handleTierReplay}
      />

      <WheelModal visible={gs.wheelPending} onResult={handleWheelResult} />

      <LevelCompleteModal
        visible={gs.levelComplete}
        level={gs.level}
        score={gs.score}
        nextThreshold={getPointsRequired(Math.min(gs.level + 1, MAX_CHALLENGE_LEVEL))}
        currentTitle={currentTitle}
        nextTitleInfo={nextTitleInfo}
        titleJustUnlocked={titleJustUnlocked}
        isFinalLevel={gs.level >= MAX_CHALLENGE_LEVEL}
        grandChampionUnlocked={gs.grandChampionUnlocked}
        onAdvance={handleAdvanceLevel}
      />

      <LoginGateModal
        visible={gs.loginRequiredForNextLevel}
        onStartOver={handleStartOver}
        onClose={() => setGs(prev => ({ ...prev, loginRequiredForNextLevel: false }))}
      />

      <GrandChampionModal
        visible={gs.grandChampionModal}
        onClose={handleGrandChampionClose}
        onReplayFinalLevel={handleGrandChampionReplayFinalLevel}
        onReplayTier={handleGrandChampionReplayTier}
        onRestartChallenge={handleStartOver}
        onGauntlet={handleStartGauntlet}
        finalScore={gs.score}
        accuracy={
          gs.stats.totalHandsPlayed > 0
            ? Math.round((gs.stats.totalCorrect / gs.stats.totalHandsPlayed) * 100)
            : undefined
        }
        bestStreak={gs.stats.bestStreak > 0 ? gs.stats.bestStreak : undefined}
      />

      <AdBreakModal
        visible={showEntryAd}
        variant="main"
        onComplete={async () => {
          setShowEntryAd(false);
          await markAdShown('main');
        }}
      />

      <PostAuthResumeBanner
        message={postAuthMessage}
        visible={!!postAuthMessage}
        onDismiss={() => setPostAuthMessage('')}
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
    paddingBottom: 20,
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
  tierBar: {
    paddingHorizontal: 14,
    paddingVertical:   6,
    alignItems:        'center',
    backgroundColor:   'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tierBarText: {
    color:         T.gold,
    fontSize:      9,
    fontWeight:    '700',
    letterSpacing: 3.5,
  },
  section:        { paddingHorizontal: 16, paddingVertical: 8 },
  sectionLabel:   { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 0.4, marginBottom: 8 },
  championBanner: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
    backgroundColor: 'rgba(251,191,36,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  championBannerText: { color: T.gold, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  gauntletBannerBtn: {
    backgroundColor: T.gold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gauntletBannerBtnText: { color: '#0c0a08', fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
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
