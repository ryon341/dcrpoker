import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../../src/components/ui/Theme';
import { GameResultModal } from '../../../src/features/arcade/components/GameResultModal';
import { InstructionSheet } from '../../../src/features/arcade/components/InstructionSheet';
import { arcadeApi } from '../../../src/features/arcade/utils/arcadeApi';
import { computeReactionScore } from '../../../src/features/arcade/utils/scoring';

const TOTAL_ATTEMPTS = 5;
type Phase = 'idle' | 'waiting' | 'active' | 'early' | 'done';

export default function ReactionTimerScreen() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<Phase>('idle');
  const [attempt, setAttempt] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const activeAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function startGame() {
    setTimes([]);
    setAttempt(1);
    setGamePhase('waiting');
    scheduleActive();
    arcadeApi.getGameStats('reaction').then(r => setHighScore(r.data?.high_score ?? 0)).catch(() => {});
  }

  function scheduleActive() {
    const delay = 1200 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      activeAtRef.current = Date.now();
      setGamePhase('active');
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start();
    }, delay);
  }

  function handleTap() {
    if (gamePhase === 'waiting') {
      // Early tap
      if (timerRef.current) clearTimeout(timerRef.current);
      setGamePhase('early');
      return;
    }

    if (gamePhase === 'active') {
      const rt = Date.now() - activeAtRef.current;
      const newTimes = [...times, rt];
      setTimes(newTimes);

      const nextAttempt = attempt + 1;
      if (nextAttempt > TOTAL_ATTEMPTS) {
        setGamePhase('done');
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        const score = computeReactionScore(avg);
        arcadeApi.submitResult({ gameId: 'reaction', score, streak: 0 }).catch(() => {});
      } else {
        setAttempt(nextAttempt);
        setGamePhase('waiting');
        scheduleActive();
      }
    }
  }

  function handleEarlyRetry() {
    scheduleActive();
    setGamePhase('waiting');
  }

  const avgMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const finalScore = times.length === TOTAL_ATTEMPTS ? computeReactionScore(avgMs) : 0;

  if (gamePhase === 'idle') {
    return (
      <View style={s.flex}>
        <InstructionSheet
          visible={showInstructions}
          title="Reaction Timer"
          instructions={"5 rounds. Wait for the gold flash — then TAP!\n\nTap too early? You'll have to wait again.\n\nYour score is based on average reaction time.\nSub-300ms = elite. Sub-500ms = sharp. Sub-800ms = solid."}
          onDismiss={() => { setShowInstructions(false); startGame(); }}
        />
      </View>
    );
  }

  if (gamePhase === 'done') {
    return (
      <GameResultModal
        visible
        score={finalScore}
        bestStreak={0}
        highScore={Math.max(finalScore, highScore)}
        extra={`Avg reaction time: ${avgMs} ms`}
        onPlayAgain={() => startGame()}
        onBackToArcade={() => router.back()}
      />
    );
  }

  const bgColor = gamePhase === 'active'
    ? '#7a5200'
    : gamePhase === 'early'
    ? '#5a1a1a'
    : T.bg;

  const statusText =
    gamePhase === 'waiting' ? 'Get ready…' :
    gamePhase === 'active'  ? 'TAP NOW!' :
    gamePhase === 'early'   ? 'Too early! Wait…' : '';

  const statusColor =
    gamePhase === 'active' ? T.gold :
    gamePhase === 'early'  ? T.red  : T.muted;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[s.fullscreen, { backgroundColor: bgColor }]}
      onPress={handleTap}
    >
      <Animated.View style={[s.flash, { opacity: flashAnim, backgroundColor: T.gold }]} pointerEvents="none" />

      <View style={s.hud}>
        <Text style={s.attemptText}>Attempt {attempt} / {TOTAL_ATTEMPTS}</Text>
        {times.length > 0 && (
          <Text style={s.timesRow}>
            {times.map((t, i) => <Text key={i} style={s.timeChip}>{t}ms  </Text>)}
          </Text>
        )}
      </View>

      <View style={s.center}>
        <Text style={[s.statusText, { color: statusColor }]}>{statusText}</Text>
        {gamePhase === 'early' && (
          <TouchableOpacity style={s.retryBtn} onPress={handleEarlyRetry}>
            <Text style={s.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.hint}>
        {gamePhase === 'waiting' ? 'Tap anywhere when gold shows' : gamePhase === 'active' ? '↑ Tap anywhere!' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  flex:        { flex: 1, backgroundColor: T.bg },
  fullscreen:  { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 60 },
  flash:       { ...StyleSheet.absoluteFillObject, zIndex: 10 },

  hud:         { alignItems: 'center', gap: 8 },
  attemptText: { color: T.silver, fontSize: 15, fontWeight: '600' },
  timesRow:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  timeChip:    { color: T.gold, fontSize: 13, fontWeight: '600' },

  center:      { alignItems: 'center', gap: 20 },
  statusText:  { fontSize: 36, fontWeight: 'bold', letterSpacing: 2, textAlign: 'center' },

  retryBtn:    { backgroundColor: T.cardGlass, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: T.cardBorder },
  retryText:   { color: T.white, fontSize: 15, fontWeight: '600' },

  hint:        { color: T.muted, fontSize: 13, textAlign: 'center', marginBottom: 8 },
});
