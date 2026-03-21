export type PokerStats = {
  totalHandsPlayed:   number;
  totalCorrect:       number;
  totalIncorrect:     number;
  totalWins:          number;
  totalLosses:        number;
  currentStreak:      number;
  bestStreak:         number;
  wheelSpins:         number;
  totalWheelPoints:   number;
  highestLevelReached: number;
};

export function getInitialStats(): PokerStats {
  return {
    totalHandsPlayed:    0,
    totalCorrect:        0,
    totalIncorrect:      0,
    totalWins:           0,
    totalLosses:         0,
    currentStreak:       0,
    bestStreak:          0,
    wheelSpins:          0,
    totalWheelPoints:    0,
    highestLevelReached: 1,
  };
}

export function applyHandStats(
  stats: PokerStats,
  { isCorrect, heroWins }: { isCorrect: boolean; heroWins: boolean },
): PokerStats {
  const newStreak   = isCorrect ? stats.currentStreak + 1 : 0;
  const newBest     = Math.max(stats.bestStreak, newStreak);
  return {
    ...stats,
    totalHandsPlayed: stats.totalHandsPlayed + 1,
    totalCorrect:     isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
    totalIncorrect:   isCorrect ? stats.totalIncorrect : stats.totalIncorrect + 1,
    totalWins:        heroWins ? stats.totalWins + 1 : stats.totalWins,
    totalLosses:      heroWins ? stats.totalLosses : stats.totalLosses + 1,
    currentStreak:    newStreak,
    bestStreak:       newBest,
  };
}

export function applyWheelStats(stats: PokerStats, wheelDelta: number): PokerStats {
  return {
    ...stats,
    wheelSpins:        stats.wheelSpins + 1,
    totalWheelPoints:  stats.totalWheelPoints + wheelDelta,
  };
}

export function applyLevelProgress(stats: PokerStats, level: number): PokerStats {
  return {
    ...stats,
    highestLevelReached: Math.max(stats.highestLevelReached, level),
  };
}

export function getAccuracyPercent(stats: PokerStats): number {
  if (stats.totalHandsPlayed === 0) return 0;
  return Math.round((stats.totalCorrect / stats.totalHandsPlayed) * 100);
}

export function getWinPercent(stats: PokerStats): number {
  if (stats.totalHandsPlayed === 0) return 0;
  return Math.round((stats.totalWins / stats.totalHandsPlayed) * 100);
}
