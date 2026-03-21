import { useState } from 'react';
import { ScrollView, View, Text, ImageBackground, StyleSheet } from 'react-native';
import { T } from '../../../src/components/ui/Theme';
import { ChallengeHeader }     from '../../../src/components/poker-challenge/ChallengeHeader';
import { QuestionPanel }       from '../../../src/components/poker-challenge/QuestionPanel';
import { HandDisplay }         from '../../../src/components/poker-challenge/HandDisplay';
import { DecisionButtons }     from '../../../src/components/poker-challenge/DecisionButtons';
import { ResultBanner }        from '../../../src/components/poker-challenge/ResultBanner';
import { ContinuePanel }       from '../../../src/components/poker-challenge/ContinuePanel';
import { ScoreRulesPanel }     from '../../../src/components/poker-challenge/ScoreRulesPanel';
import { WheelModal }          from '../../../src/components/poker-challenge/WheelModal';
import { LevelCompleteModal }  from '../../../src/components/poker-challenge/LevelCompleteModal';
import { MOCK_CHALLENGES }     from '../../../src/components/poker-challenge/mockChallenges';
import { getScoreDelta, applyScore, getPointsRequired } from '../../../src/components/poker-challenge/scoring';

const SCORE_TABLE = { correctWin: 13, correctLose: 7, incorrectWin: -5, incorrectLose: -10 };

interface GameState {
  level: number;
  score: number;
  handsCompleted: number;
  challengeIndex: number;
  selectedAnswer: 'yes' | 'no' | null;
  answerResolved: boolean;
  lastScoreDelta: number;
  lastResultType: 'correct' | 'incorrect' | null;
  wheelPending: boolean;
  levelComplete: boolean;
}

const INITIAL_STATE: GameState = {
  level: 1,
  score: 0,
  handsCompleted: 0,
  challengeIndex: 0,
  selectedAnswer: null,
  answerResolved: false,
  lastScoreDelta: 0,
  lastResultType: null,
  wheelPending: false,
  levelComplete: false,
};

export default function PokerChallengePage() {
  const [gs, setGs] = useState<GameState>(INITIAL_STATE);

  const challenge = MOCK_CHALLENGES[gs.challengeIndex % MOCK_CHALLENGES.length];
  const pointsRequired = getPointsRequired(gs.level);

  function handleAnswer(answer: 'yes' | 'no') {
    if (gs.answerResolved) return;
    const isCorrect = answer === challenge.correctAnswer;
    const delta = getScoreDelta(isCorrect, challenge.heroWins);
    const newScore = applyScore(gs.score, delta);

    setGs(prev => ({
      ...prev,
      selectedAnswer: answer,
      answerResolved: true,
      lastScoreDelta: delta,
      lastResultType: isCorrect ? 'correct' : 'incorrect',
      score: newScore,
    }));
  }

  function handleContinue() {
    const newHandsCompleted = gs.handsCompleted + 1;
    const wheelPending = newHandsCompleted > 0 && newHandsCompleted % 15 === 0;
    const levelComplete = gs.score >= getPointsRequired(gs.level);

    setGs(prev => ({
      ...prev,
      handsCompleted: newHandsCompleted,
      challengeIndex: prev.challengeIndex + 1,
      selectedAnswer: null,
      answerResolved: false,
      lastScoreDelta: 0,
      lastResultType: null,
      wheelPending: wheelPending && !levelComplete,
      levelComplete,
    }));
  }

  function handleWheelResult(pts: number) {
    const newScore = applyScore(gs.score, pts);
    const levelComplete = newScore >= getPointsRequired(gs.level);
    setGs(prev => ({
      ...prev,
      wheelPending: false,
      score: newScore,
      levelComplete,
    }));
  }

  function handleAdvanceLevel() {
    setGs(prev => ({
      ...prev,
      level: prev.level + 1,
      levelComplete: false,
    }));
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
          {/* Header */}
          <ChallengeHeader level={gs.level} points={gs.score} pointsRequired={pointsRequired} />

          <View style={s.divider} />

          {/* Challenge label */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Challenge #{gs.handsCompleted + 1}</Text>

            {/* Question + explanation */}
            <QuestionPanel
              question={challenge.question}
              explanation={challenge.explanation}
              showExplanation={gs.answerResolved}
            />
          </View>

          {/* Cards: villain (top), board (middle), hero (bottom) */}
          <HandDisplay
            heroHand={challenge.heroHand}
            villainHand={challenge.villainHand}
            villainRevealed={gs.answerResolved}
            runout={challenge.runout}
            showRunout={gs.answerResolved}
          />

          {/* Result banner */}
          <ResultBanner result={gs.lastResultType} />

          {/* YES/NO or Continue */}
          {!gs.answerResolved ? (
            <DecisionButtons
              onYes={() => handleAnswer('yes')}
              onNo={() => handleAnswer('no')}
              disabled={false}
              selected={gs.selectedAnswer}
            />
          ) : (
            <ContinuePanel
              scoreDelta={gs.lastScoreDelta}
              heroWins={challenge.heroWins}
              onContinue={handleContinue}
            />
          )}

          <View style={s.divider} />

          {/* Score rules */}
          <View style={s.section}>
            <ScoreRulesPanel scoreTable={SCORE_TABLE} />
          </View>
        </View>
      </ScrollView>

      {/* Bonus wheel modal */}
      <WheelModal visible={gs.wheelPending} onResult={handleWheelResult} />

      {/* Level complete modal */}
      <LevelCompleteModal
        visible={gs.levelComplete}
        level={gs.level}
        onAdvance={handleAdvanceLevel}
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
  divider:      { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 },
  section:      { paddingHorizontal: 16, paddingVertical: 12 },
  sectionLabel: { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
});


const INITIAL = {
  level:            1,
  points:           47,
  pointsRequired:   100,
  challengeNumber:  12,
  wheelEvery:       15,
  question:         'Is AKo a GTO preflop raise from this position?',
  playerHand:       ['A♠', 'K♣'],
  opponentHidden:   true,
  lastResult:       null as 'correct' | 'incorrect' | null,
  scoreTable: {
    correctWin:    13,
    correctLose:    7,
    incorrectWin:  -5,
    incorrectLose: -10,
  },
};

export default function PokerChallengePage() {
  const [state, setState] = useState(INITIAL);

  function handleYes() {
    setState(prev => ({
      ...prev,
      lastResult: 'correct',
      points: Math.max(0, prev.points + prev.scoreTable.correctLose),
      challengeNumber: prev.challengeNumber + 1,
    }));
  }

  function handleNo() {
    setState(prev => ({
      ...prev,
      lastResult: 'incorrect',
      points: Math.max(0, prev.points + prev.scoreTable.incorrectLose),
      challengeNumber: prev.challengeNumber + 1,
    }));
  }

  return (
    <ImageBackground
      source={require('../../../assets/asset01.jpg')}
      style={s.bg}
      resizeMode="cover"
    >
      {/* Dark overlay so UI stays readable */}
      <View style={s.overlay} pointerEvents="none" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.board}>
          {/* Header: level, points, progress */}
          <ChallengeHeader
            level={state.level}
            points={state.points}
            pointsRequired={state.pointsRequired}
          />

          <View style={s.divider} />

          {/* Question */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Challenge #{state.challengeNumber}</Text>
            <QuestionPanel question={state.question} />
          </View>

          {/* Cards */}
          <HandDisplay
            playerHand={state.playerHand}
            opponentHidden={state.opponentHidden}
          />

          {/* Result banner */}
          <ResultBanner result={state.lastResult} />

          {/* YES / NO buttons */}
          <DecisionButtons onYes={handleYes} onNo={handleNo} />

          <View style={s.divider} />

          {/* Score rules */}
          <View style={s.section}>
            <ScoreRulesPanel scoreTable={state.scoreTable} />
          </View>

          <View style={s.divider} />

          {/* Bonus wheel */}
          <BonusWheelPanel
            challengeNumber={state.challengeNumber}
            wheelEvery={state.wheelEvery}
          />
        </View>
      </ScrollView>
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
  divider:      { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 },
  section:      { paddingHorizontal: 16, paddingVertical: 12 },
  sectionLabel: { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
});
