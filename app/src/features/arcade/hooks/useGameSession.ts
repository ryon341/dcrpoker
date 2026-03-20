import { useState, useCallback } from 'react';

export type GameStatus = 'idle' | 'playing' | 'ended';

export interface GameSession {
  score: number;
  streak: number;
  round: number;
  status: GameStatus;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (by?: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setRound: (n: number) => void;
}

export function useGameSession(totalRounds = 10): GameSession {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRound(1);
    setStatus('playing');
  }, []);

  const endGame = useCallback(() => setStatus('ended'), []);

  const resetGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRound(0);
    setStatus('idle');
  }, []);

  const incrementScore = useCallback((by = 1) => setScore(s => s + by), []);
  const incrementStreak = useCallback(() => setStreak(s => s + 1), []);
  const resetStreak = useCallback(() => setStreak(0), []);

  return {
    score, streak, round, status,
    startGame, endGame, resetGame,
    incrementScore, incrementStreak, resetStreak,
    setRound,
  };
}
