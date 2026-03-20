import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';

const GAME_W = Dimensions.get('window').width - 80;
const CHIP_SIZE = 54;
const STACK_CENTER = GAME_W / 2 - CHIP_SIZE / 2;
const BASE_DURATION = 2000; // ms for full left-to-right traverse

type GamePhase = 'idle' | 'playing' | 'ended';

export default function ChipStackBuilderScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);

  const chipX = useRef(new Animated.Value(0)).current;
  const currentAnim = useRef<Animated.CompositeAnimation | null>(null);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);

  const getDuration = (sc: number) => Math.max(600, BASE_DURATION - sc * 50);

  const startMotion = useCallback((sc: number) => {
    if (currentAnim.current) currentAnim.current.stop();
    chipX.setValue(0);
    const dur = getDuration(sc);
    currentAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(chipX, { toValue: GAME_W - CHIP_SIZE, duration: dur, useNativeDriver: true }),
        Animated.timing(chipX, { toValue: 0, duration: dur, useNativeDriver: true }),
      ])
    );
    currentAnim.current.start();
  }, [chipX]);

  function startGame() {
    setScore(0);
    setStreak(0);
    scoreRef.current = 0;
    streakRef.current = 0;
    setFeedback('');
    arcadeApi.getGameStats('chip_stack').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
    setPhase('playing');
    startMotion(0);
  }

  function handleDrop() {
    if (phase !== 'playing') return;
    // Get current chip X position
    const pos = (chipX as any)._value as number;
    const distance = Math.abs(pos - STACK_CENTER);
    const tolerance = 40 + Math.max(0, 20 - scoreRef.current * 2); // tightens as score increases

    if (distance <= tolerance) {
      const newScore = scoreRef.current + 1;
      const newStreak = streakRef.current + 1;
      scoreRef.current = newScore;
      streakRef.current = newStreak;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`+1 🎯`);
      startMotion(newScore);
    } else {
      // Game over
      if (currentAnim.current) currentAnim.current.stop();
      setPhase('ended');
      arcadeApi.submitResult({ gameId: 'chip_stack', score: scoreRef.current, streak: streakRef.current }).catch(() => {});
    }
  }

  function handleReplay() {
    setPhase('idle');
    startGame();
  }

  useEffect(() => {
    return () => { if (currentAnim.current) currentAnim.current.stop(); };
  }, []);

  if (phase === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Chip Stack Builder"
          instructions={"A chip slides back and forth. Tap when it's directly above the stack zone (the gold band in the center).\n\nMiss = game over.\nEach successful drop speeds things up.\nHow high can you stack?"}
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
          onPlayAgain={handleReplay}
          onBackToArcade={() => router.back()}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={s.flex} onPress={handleDrop} activeOpacity={1}>
      {/* Score */}
      <View style={s.scoreArea}>
        <Text style={s.scoreLabel}>Stack</Text>
        <Text style={s.scoreNum}>{score}</Text>
        {feedback ? <Text style={s.feedback}>{feedback}</Text> : null}
      </View>

      {/* Stack visual */}
      <View style={s.stackArea}>
        {Array.from({ length: Math.min(score, 10) }).map((_, i) => (
          <View key={i} style={[s.stackedChip, { opacity: 1 - i * 0.06 }]} />
        ))}
        {score > 10 && <Text style={s.moreText}>+{score - 10} more</Text>}
      </View>

      {/* Drop zone */}
      <View style={s.gameArea}>
        {/* Target zone indicator */}
        <View style={s.targetZone} />

        {/* Moving chip */}
        <Animated.View style={[s.chip, { transform: [{ translateX: chipX }] }]}>
          <Text style={s.chipText}>🪙</Text>
        </Animated.View>
      </View>

      <Text style={s.tapHint}>TAP ANYWHERE TO DROP</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  flex:       { flex: 1, backgroundColor: T.bg, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 40 },
  scoreArea:  { alignItems: 'center' },
  scoreLabel: { color: T.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  scoreNum:   { color: T.gold, fontSize: 56, fontWeight: 'bold', lineHeight: 64 },
  feedback:   { color: T.green, fontSize: 20, fontWeight: 'bold', marginTop: 4 },

  stackArea:  { alignItems: 'center', minHeight: 80, justifyContent: 'flex-end' },
  stackedChip:{ width: 50, height: 12, backgroundColor: T.gold, borderRadius: 6, marginTop: 2 },
  moreText:   { color: T.muted, fontSize: 12, marginTop: 4 },

  gameArea:   { width: GAME_W, height: 80, backgroundColor: '#1a1a1d', borderRadius: 16, borderWidth: 1, borderColor: T.cardBorder, justifyContent: 'center', overflow: 'hidden' },
  targetZone: { position: 'absolute', left: STACK_CENTER - 20, width: CHIP_SIZE + 40, height: '100%', backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: 8 },
  chip:       { position: 'absolute', top: 13, width: CHIP_SIZE, height: CHIP_SIZE, alignItems: 'center', justifyContent: 'center' },
  chipText:   { fontSize: 36 },

  tapHint:    { color: T.muted, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' },
});
