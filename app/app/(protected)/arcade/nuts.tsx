import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { ScorePanel } from '../../../src/features/arcade/components/ScorePanel';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { useGameSession } from '../../../src/features/arcade/hooks/useGameSession';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';
import { useAuth } from '../../../src/context/AuthContext';
import { getGuestGameStats, submitGuestResult } from '../../../src/utils/guestStorage';
import nutsQuestions, { NutsQuestion } from '../../../src/features/arcade/data/nutsQuestions';
import { shuffle } from '../../../src/features/arcade/utils/deck';
import { cardDisplay, parseCard } from '../../../src/features/arcade/utils/cards';

const SESSION_SIZE = 10;

function buildSession() {
  return shuffle([...nutsQuestions]).slice(0, SESSION_SIZE);
}

export default function SpotTheNutsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const session = useGameSession(SESSION_SIZE);
  const [questions, setQuestions] = useState<NutsQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const currentQ = questions[qIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === currentQ?.correctAnswer;

  function start() {
    setQuestions(buildSession());
    setQIndex(0);
    setSelected(null);
    session.startGame();
    if (user) {
      arcadeApi.getGameStats('nuts').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
    } else {
      getGuestGameStats('nuts').then(s => setHighScore(s?.high_score ?? 0)).catch(() => {});
    }
  }

  function handleAnswer(opt: string) {
    if (isAnswered) return;
    setSelected(opt);
    if (opt === currentQ.correctAnswer) {
      session.incrementScore();
      session.incrementStreak();
    } else {
      session.resetStreak();
    }
  }

  function handleNext() {
    const nextIndex = qIndex + 1;
    if (nextIndex >= SESSION_SIZE) {
      session.endGame();
      const finalScore = session.score + (isCorrect ? 1 : 0);
      if (user) {
        arcadeApi.submitResult({ gameId: 'nuts', score: finalScore, streak: session.streak }).catch(() => {});
      } else {
        submitGuestResult('nuts', finalScore, session.streak).catch(() => {});
      }
      return;
    }
    setQIndex(nextIndex);
    setSelected(null);
    session.setRound(nextIndex + 1);
  }

  function handleReplay() {
    session.resetGame();
    setQuestions(buildSession());
    setQIndex(0);
    setSelected(null);
    session.startGame();
  }

  if (session.status === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Spot the Nuts"
          instructions={"You'll see a board, then 4 hole-card options. Tap the hand that makes the absolute best possible hand.\n\n+1 point per correct answer.\nStreak resets on wrong answers.\n10 questions per session."}
          onDismiss={() => { setShowInstructions(false); start(); }}
        />
      </View>
    );
  }

  if (session.status === 'ended') {
    return (
      <View style={s.flex}>
        <GameResultModal
          visible
          score={session.score}
          bestStreak={session.streak}
          highScore={Math.max(session.score, highScore)}
          onPlayAgain={handleReplay}
          onBackToArcade={() => router.back()}
        />
      </View>
    );
  }

  if (!currentQ) return null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <ScorePanel score={session.score} streak={session.streak} round={qIndex + 1} totalRounds={SESSION_SIZE} />

      <View style={s.card}>
        <Text style={s.label}>Board</Text>
        <View style={s.cardRow}>
          {currentQ.board.map(c => <PlayingCard key={c} card={c} />)}
        </View>
        <Text style={s.prompt}>{currentQ.prompt}</Text>
      </View>

      <View style={s.optionsGrid}>
        {currentQ.options.map(opt => {
          let btnStyle = s.optionBtn;
          if (isAnswered) {
            if (opt === currentQ.correctAnswer) btnStyle = { ...s.optionBtn, ...s.optionCorrect };
            else if (opt === selected) btnStyle = { ...s.optionBtn, ...s.optionWrong };
          }
          return (
            <TouchableOpacity key={opt} style={btnStyle} onPress={() => handleAnswer(opt)} activeOpacity={0.8}>
              <Text style={[s.optionText, isAnswered && opt === currentQ.correctAnswer && { color: '#0c0a09' }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isAnswered && (
        <View style={s.explanationCard}>
          <Text style={[s.explanationLabel, { color: isCorrect ? T.green : T.red }]}>
            {isCorrect ? '✓ Correct!' : '✗ Wrong'}
          </Text>
          <Text style={s.explanationText}>{currentQ.explanation}</Text>
          <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={s.nextBtnText}>{qIndex + 1 >= SESSION_SIZE ? 'Finish' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function PlayingCard({ card }: { card: string }) {
  const { suit } = parseCard(card);
  const isRed = suit === 'h' || suit === 'd';
  return (
    <View style={pc.card}>
      <Text style={[pc.text, { color: isRed ? '#e74c3c' : '#f5f5f5' }]}>{cardDisplay(card)}</Text>
    </View>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: '#2a2a2e', borderRadius: 10, borderWidth: 1, borderColor: T.cardBorder, paddingHorizontal: 12, paddingVertical: 10, marginRight: 6, minWidth: 48, alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});

const s = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: T.bg },
  container: { flex: 1, backgroundColor: T.bg },
  content:   { padding: 20, paddingBottom: 48 },

  card:    { backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 20, padding: 20, marginBottom: 20 },
  label:   { color: T.muted, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  prompt:  { color: T.silver, fontSize: 16, fontWeight: '600', marginTop: 18, textAlign: 'center' },

  optionsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  optionBtn:     { flex: 1, minWidth: '45%', backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  optionCorrect: { backgroundColor: T.gold, borderColor: T.gold },
  optionWrong:   { backgroundColor: '#5a1a1a', borderColor: T.red },
  optionText:    { color: T.white, fontSize: 15, fontWeight: 'bold' },

  explanationCard:  { backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 16, padding: 18 },
  explanationLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  explanationText:  { color: T.silver, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  nextBtn:          { backgroundColor: T.gold, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  nextBtnText:      { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
});
