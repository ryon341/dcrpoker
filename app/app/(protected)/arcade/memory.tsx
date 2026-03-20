import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';
import { computeMemoryScore } from '../../../src/features/arcade/utils/scoring';
import { shuffle } from '../../../src/features/arcade/utils/deck';

// 8 pairs from high poker cards
const CARD_PAIRS = ['A♠','K♠','Q♠','J♠','T♠','9♠','8♠','7♠'];

function buildGrid() {
  const pairs = [...CARD_PAIRS, ...CARD_PAIRS];
  return shuffle(pairs).map((card, idx) => ({ id: idx, card, flipped: false, matched: false }));
}

type CardCell = { id: number; card: string; flipped: boolean; matched: boolean };
type GamePhase = 'idle' | 'playing' | 'ended';

export default function CardMemoryScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [grid, setGrid] = useState<CardCell[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [score, setScore] = useState(0);
  const [streak] = useState(0);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef(0);

  function startGame() {
    setGrid(buildGrid());
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setElapsed(0);
    setScore(0);
    setPhase('playing');
    arcadeApi.getGameStats('memory').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
  }

  // Start timer on first flip
  function ensureTimer() {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  useEffect(() => () => stopTimer(), []);

  function handleFlip(idx: number) {
    if (phase !== 'playing') return;
    if (grid[idx].flipped || grid[idx].matched) return;
    if (selected.length >= 2) return;

    ensureTimer();

    const newGrid = grid.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const newSelected = [...selected, idx];
    setGrid(newGrid);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (newGrid[a].card === newGrid[b].card) {
        // Match!
        setTimeout(() => {
          setGrid(g => g.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c));
          setSelected([]);
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === CARD_PAIRS.length) {
            stopTimer();
            const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const finalScore = computeMemoryScore(finalElapsed);
            setScore(finalScore);
            setPhase('ended');
            arcadeApi.submitResult({ gameId: 'memory', score: finalScore, streak: 0 }).catch(() => {});
          }
        }, 300);
      } else {
        // No match — flip back
        setTimeout(() => {
          setGrid(g => g.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 900);
      }
    }
  }

  if (phase === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Card Memory"
          instructions={"16 cards are face-down in a 4×4 grid. Tap two cards to flip them. If they match, they stay face-up.\n\nMatch all 8 pairs as fast as possible.\nYour score is based on completion time."}
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
          bestStreak={0}
          highScore={Math.max(score, highScore)}
          extra={`Completed in ${elapsed}s with ${moves} moves`}
          onPlayAgain={() => { setPhase('idle'); startGame(); }}
          onBackToArcade={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={s.flex}>
      {/* Stats row */}
      <View style={s.statsRow}>
        <Stat label="Pairs" value={`${matches}/${CARD_PAIRS.length}`} />
        <Stat label="Moves" value={String(moves)} />
        <Stat label="Time" value={`${elapsed}s`} />
      </View>

      {/* Grid */}
      <View style={s.grid}>
        {grid.map((cell, idx) => (
          <TouchableOpacity
            key={cell.id}
            style={[s.cell, cell.matched && s.cellMatched]}
            onPress={() => handleFlip(idx)}
            activeOpacity={0.8}
          >
            {cell.flipped || cell.matched
              ? <Text style={s.cellText}>{cell.card}</Text>
              : <Text style={s.cellBack}>?</Text>
            }
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  flex:     { flex: 1, backgroundColor: T.bg, padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 24, marginTop: 8 },
  stat:     { backgroundColor: T.cardGlass, borderRadius: 12, borderWidth: 1, borderColor: T.cardBorder, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', flex: 1 },
  statLabel:{ color: T.muted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  statValue:{ color: T.white, fontSize: 16, fontWeight: 'bold' },

  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  cell:     { width: 72, height: 72, backgroundColor: T.cardGlass, borderRadius: 12, borderWidth: 1, borderColor: T.cardBorder, justifyContent: 'center', alignItems: 'center' },
  cellMatched: { borderColor: T.gold, backgroundColor: 'rgba(251,191,36,0.1)' },
  cellText: { color: T.white, fontSize: 18, fontWeight: 'bold' },
  cellBack: { color: T.muted, fontSize: 28, fontWeight: 'bold' },
});
