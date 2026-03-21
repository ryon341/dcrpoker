import { useState } from 'react';
import { ScrollView, View, Text, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { T } from '../../../src/components/ui/Theme';
import { ChallengeHeader }  from '../../../src/components/poker-challenge/ChallengeHeader';
import { QuestionPanel }    from '../../../src/components/poker-challenge/QuestionPanel';
import { HandDisplay }      from '../../../src/components/poker-challenge/HandDisplay';
import { DecisionButtons }  from '../../../src/components/poker-challenge/DecisionButtons';
import { ResultBanner }     from '../../../src/components/poker-challenge/ResultBanner';
import { ScoreRulesPanel }  from '../../../src/components/poker-challenge/ScoreRulesPanel';
import { BonusWheelPanel }  from '../../../src/components/poker-challenge/BonusWheelPanel';

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
