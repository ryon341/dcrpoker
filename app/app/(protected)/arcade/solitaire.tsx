import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';
import { deal } from '../../../src/features/arcade/utils/deck';
import { cardDisplay, parseCard } from '../../../src/features/arcade/utils/cards';
import { evaluateHand } from '../../../src/features/arcade/utils/solitaireUtils';
import { HAND_RANK_LABELS, HAND_RANK_SCORES } from '../../../src/features/arcade/utils/scoring';

const SESSION_ROUNDS = 5;

type GamePhase = 'idle' | 'playing' | 'result' | 'ended';

export default function SolitaireScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [cards, setCards] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundResult, setRoundResult] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  function startGame() {
    setScore(0);
    setStreak(0);
    setRound(1);
    setPhase('playing');
    setCards(deal(7));
    setSelected([]);
    arcadeApi.getGameStats('solitaire').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
  }

  function toggleCard(idx: number) {
    if (phase !== 'playing') return;
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= 5) return prev;
      return [...prev, idx];
    });
  }

  function handleSubmit() {
    if (selected.length !== 5) return;
    const hand = selected.map(i => cards[i]);
    const rank = evaluateHand(hand);
    const pts = HAND_RANK_SCORES[rank];
    setScore(s => s + pts);
    setStreak(st => st + 1);
    setRoundResult(HAND_RANK_LABELS[rank]);
    setPhase('result');
  }

  function handleNext() {
    const next = round + 1;
    if (next > SESSION_ROUNDS) {
      setPhase('ended');
      arcadeApi.submitResult({ gameId: 'solitaire', score: score, streak }).catch(() => {});
      return;
    }
    setRound(next);
    setCards(deal(7));
    setSelected([]);
    setPhase('playing');
  }

  if (phase === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Swipe Poker Solitaire"
          instructions={"You are dealt 7 cards. Select the best 5 to form the strongest poker hand.\n\nTap 5 cards, then press Submit.\nPoints are awarded by hand rank:\nHigh Card=1, Pair=2, Two Pair=3, Trips=4, Straight=5, Flush=6, Full House=7, Quads=8, SF=9, Royal=10.\n5 rounds per session."}
          onDismiss={() => { setShowInstructions(false); startGame(); }}
        />
      </View>
    );
  }

  if (phase === 'ended') {
    return (
      <View style={s.flex}>
        <GameResultModal
          visible
          score={score}
          bestStreak={streak}
          highScore={Math.max(score, highScore)}
          onPlayAgain={() => { setPhase('idle'); startGame(); }}
          onBackToArcade={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Header */}
      <View style={s.headerRow}>
        <Text style={s.roundLabel}>Round {round}/{SESSION_ROUNDS}</Text>
        <Text style={s.scoreLabel}>Score: <Text style={{ color: T.gold }}>{score}</Text></Text>
      </View>

      <Text style={s.instruction}>
        {phase === 'playing' ? `Select 5 cards (${selected.length}/5)` : `Result: ${roundResult}`}
      </Text>

      {/* Cards */}
      <View style={s.cardsRow}>
        {cards.map((card, idx) => {
          const { suit } = parseCard(card);
          const isRed = suit === 'h' || suit === 'd';
          const isSel = selected.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              style={[s.card, isSel && s.cardSelected]}
              onPress={() => toggleCard(idx)}
              activeOpacity={0.8}
              disabled={phase !== 'playing'}
            >
              <Text style={[s.cardText, { color: isRed ? '#e74c3c' : '#f5f5f5' }]}>{cardDisplay(card)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {phase === 'playing' && (
        <TouchableOpacity
          style={[s.primaryBtn, selected.length !== 5 && s.primaryBtnDisabled]}
          onPress={handleSubmit}
          disabled={selected.length !== 5}
        >
          <Text style={s.primaryBtnText}>Submit Hand</Text>
        </TouchableOpacity>
      )}

      {phase === 'result' && (
        <View style={s.resultCard}>
          <Text style={s.resultHand}>{roundResult}</Text>
          <Text style={s.resultPoints}>+{HAND_RANK_SCORES[Object.keys(HAND_RANK_LABELS).find(k => HAND_RANK_LABELS[k as any] === roundResult) as any] ?? 0} pts</Text>
          <TouchableOpacity style={s.primaryBtn} onPress={handleNext}>
            <Text style={s.primaryBtnText}>{round >= SESSION_ROUNDS ? 'Finish' : 'Next Round →'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  flex:       { flex: 1, backgroundColor: T.bg },
  container:  { flex: 1, backgroundColor: T.bg },
  content:    { padding: 20, paddingBottom: 48 },

  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  roundLabel:  { color: T.muted, fontSize: 13, fontWeight: '600' },
  scoreLabel:  { color: T.silver, fontSize: 13, fontWeight: '600' },
  instruction: { color: T.silver, fontSize: 15, textAlign: 'center', marginBottom: 20 },

  cardsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  card:        { backgroundColor: '#2a2a2e', borderRadius: 14, borderWidth: 1, borderColor: T.cardBorder, paddingHorizontal: 14, paddingVertical: 18, minWidth: 60, alignItems: 'center' },
  cardSelected:{ borderColor: T.gold, backgroundColor: 'rgba(251,191,36,0.12)' },
  cardText:    { fontSize: 20, fontWeight: 'bold' },

  primaryBtn:         { backgroundColor: T.gold, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText:     { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },

  resultCard:   { backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8 },
  resultHand:   { color: T.gold, fontSize: 22, fontWeight: 'bold' },
  resultPoints: { color: T.silver, fontSize: 16, marginBottom: 12 },
});
