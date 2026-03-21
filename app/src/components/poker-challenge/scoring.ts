// ─── Scoring utility for DCR Poker Challenge ─────────────────────────────────

export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 100, 2: 100, 3: 130, 4: 150, 5: 200,
  6: 250, 7: 300, 8: 360, 9: 430, 10: 510,
  11: 600, 12: 700, 13: 820, 14: 950, 15: 1100,
  16: 1275, 17: 1475, 18: 1700, 19: 1950, 20: 2230,
  21: 2540, 22: 2880, 23: 3250, 24: 3650, 25: 4100,
};

export function getScoreDelta(isCorrect: boolean, heroWins: boolean): number {
  if (isCorrect && heroWins)   return 13;
  if (isCorrect && !heroWins)  return 7;
  if (!isCorrect && heroWins)  return -5;
  return -10; // incorrect + lose
}

export function applyScore(current: number, delta: number): number {
  return Math.max(0, current + delta);
}

export function getPointsRequired(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? 4100;
}
