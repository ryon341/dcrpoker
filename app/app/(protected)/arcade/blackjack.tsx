import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';
import { shuffle, fullDeck } from '../../../src/features/arcade/utils/deck';
import { cardDisplay, parseCard, handValue } from '../../../src/features/arcade/utils/cards';

const SESSION_ROUNDS = 5;

type RoundPhase = 'dealing' | 'player' | 'dealer' | 'result';
type GamePhase = 'idle' | 'session' | 'ended';

type RoundState = {
  playerCards: string[];
  dealerCards: string[];
  deck: string[];
  phase: RoundPhase;
  result: 'win' | 'loss' | 'push' | null;
};

function dealRound(): RoundState {
  const deck = shuffle(fullDeck());
  return {
    playerCards: [deck[0], deck[2]],
    dealerCards: [deck[1], deck[3]],
    deck: deck.slice(4),
    phase: 'player',
    result: null,
  };
}

function resolveRound(state: RoundState): 'win' | 'loss' | 'push' {
  const pv = handValue(state.playerCards);
  const dv = handValue(state.dealerCards);
  if (pv > 21) return 'loss';
  if (dv > 21) return 'win';
  if (pv > dv) return 'win';
  if (pv < dv) return 'loss';
  return 'push';
}

function dealerPlay(state: RoundState): RoundState {
  let { dealerCards, deck } = state;
  while (handValue(dealerCards) < 17 && deck.length > 0) {
    dealerCards = [...dealerCards, deck[0]];
    deck = deck.slice(1);
  }
  const result = resolveRound({ ...state, dealerCards });
  return { ...state, dealerCards, deck, phase: 'result', result };
}

export default function MiniBlackjackScreen() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [round, setRound] = useState<RoundState | null>(null);
  const [roundNum, setRoundNum] = useState(0);
  const [wins, setWins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  function startGame() {
    setWins(0);
    setStreak(0);
    setRoundNum(1);
    setRound(dealRound());
    setGamePhase('session');
    arcadeApi.getGameStats('blackjack').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
  }

  function handleHit() {
    if (!round || round.phase !== 'player') return;
    const newPlayer = [...round.playerCards, round.deck[0]];
    const newDeck = round.deck.slice(1);
    const pv = handValue(newPlayer);
    if (pv > 21) {
      // Bust
      setRound({ ...round, playerCards: newPlayer, deck: newDeck, phase: 'result', result: 'loss' });
      setStreak(0);
    } else {
      setRound({ ...round, playerCards: newPlayer, deck: newDeck });
    }
  }

  function handleStand() {
    if (!round || round.phase !== 'player') return;
    const resolved = dealerPlay(round);
    setRound(resolved);
    if (resolved.result === 'win') { setWins(w => w + 1); setStreak(s => s + 1); }
    else setStreak(0);
  }

  function handleNext() {
    const next = roundNum + 1;
    if (next > SESSION_ROUNDS) {
      setGamePhase('ended');
      arcadeApi.submitResult({ gameId: 'blackjack', score: wins, streak }).catch(() => {});
      return;
    }
    setRoundNum(next);
    setRound(dealRound());
  }

  if (gamePhase === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Mini Blackjack"
          instructions={"Classic blackjack — no betting, no money.\n\nDealer shows one card. You choose Hit or Stand.\nDealer auto-plays to 17.\nGet closer to 21 than the dealer without busting.\n\n5 rounds per session. Score = wins."}
          onDismiss={() => { setShowInstructions(false); startGame(); }}
        />
      </View>
    );
  }

  if (gamePhase === 'ended') {
    return (
      <View style={s.flex}>
        <GameResultModal
          visible
          score={wins}
          bestStreak={streak}
          highScore={Math.max(wins, highScore)}
          extra={`${wins} wins out of ${SESSION_ROUNDS} rounds`}
          onPlayAgain={() => { setGamePhase('idle'); startGame(); }}
          onBackToArcade={() => router.back()}
        />
      </View>
    );
  }

  if (!round) return null;

  const pv = handValue(round.playerCards);
  const dv = handValue(round.dealerCards);
  const showDealer = round.phase === 'result' || round.phase === 'dealer';

  const resultColors = { win: T.green, loss: T.red, push: T.muted };
  const resultLabels = { win: '✓ Win!', loss: '✗ Bust / Dealer wins', push: '= Push' };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Header */}
      <View style={s.headerRow}>
        <Text style={s.roundLabel}>Round {roundNum}/{SESSION_ROUNDS}</Text>
        <Text style={s.winsLabel}>Wins: <Text style={{ color: T.gold }}>{wins}</Text>  🔥{streak}</Text>
      </View>

      {/* Dealer */}
      <View style={s.handSection}>
        <Text style={s.handLabel}>Dealer {showDealer ? `(${dv})` : ''}</Text>
        <View style={s.cardRow}>
          {round.dealerCards.map((c, i) => (
            i === 0 || showDealer
              ? <PlayingCard key={i} card={c} />
              : <HiddenCard key={i} />
          ))}
        </View>
      </View>

      {/* Player */}
      <View style={s.handSection}>
        <Text style={s.handLabel}>You ({pv}){pv > 21 ? ' — BUST' : pv === 21 ? ' — 21!' : ''}</Text>
        <View style={s.cardRow}>
          {round.playerCards.map((c, i) => <PlayingCard key={i} card={c} />)}
        </View>
      </View>

      {/* Result */}
      {round.phase === 'result' && round.result && (
        <View style={[s.resultCard, { borderColor: resultColors[round.result] }]}>
          <Text style={[s.resultText, { color: resultColors[round.result] }]}>
            {resultLabels[round.result]}
          </Text>
          <TouchableOpacity style={s.primaryBtn} onPress={handleNext}>
            <Text style={s.primaryBtnText}>{roundNum >= SESSION_ROUNDS ? 'Finish' : 'Next Round →'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      {round.phase === 'player' && (
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtn} onPress={handleHit} activeOpacity={0.8}>
            <Text style={s.actionBtnText}>Hit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.actionBtnGold]} onPress={handleStand} activeOpacity={0.8}>
            <Text style={[s.actionBtnText, { color: '#0c0a09' }]}>Stand</Text>
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

function HiddenCard() {
  return (
    <View style={[pc.card, { backgroundColor: '#2a1a4a' }]}>
      <Text style={{ fontSize: 22 }}>🂠</Text>
    </View>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: '#2a2a2e', borderRadius: 10, borderWidth: 1, borderColor: T.cardBorder, paddingHorizontal: 14, paddingVertical: 12, marginRight: 8, minWidth: 52, alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});

const s = StyleSheet.create({
  flex:        { flex: 1, backgroundColor: T.bg },
  container:   { flex: 1, backgroundColor: T.bg },
  content:     { padding: 20, paddingBottom: 48 },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roundLabel:  { color: T.muted, fontSize: 13, fontWeight: '600' },
  winsLabel:   { color: T.silver, fontSize: 13, fontWeight: '600' },

  handSection: { marginBottom: 24 },
  handLabel:   { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  cardRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },

  resultCard:   { backgroundColor: T.cardGlass, borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, gap: 14 },
  resultText:   { fontSize: 18, fontWeight: 'bold' },

  actionsRow:   { flexDirection: 'row', gap: 12, marginTop: 8 },
  actionBtn:    { flex: 1, backgroundColor: T.cardGlass, borderRadius: 14, borderWidth: 1, borderColor: T.cardBorder, paddingVertical: 18, alignItems: 'center' },
  actionBtnGold:{ backgroundColor: T.gold, borderColor: T.gold },
  actionBtnText:{ color: T.white, fontSize: 18, fontWeight: 'bold' },

  primaryBtn:     { backgroundColor: T.gold, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 32, alignItems: 'center' },
  primaryBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
});
