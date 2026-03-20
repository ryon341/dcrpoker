export type HandRank =
  | 'high_card' | 'pair' | 'two_pair' | 'three_of_a_kind'
  | 'straight' | 'flush' | 'full_house' | 'four_of_a_kind'
  | 'straight_flush' | 'royal_flush';

export const HAND_RANK_SCORES: Record<HandRank, number> = {
  high_card: 1, pair: 2, two_pair: 3, three_of_a_kind: 4,
  straight: 5, flush: 6, full_house: 7, four_of_a_kind: 8,
  straight_flush: 9, royal_flush: 10,
};

export const HAND_RANK_LABELS: Record<HandRank, string> = {
  royal_flush: 'Royal Flush 🏆', straight_flush: 'Straight Flush',
  four_of_a_kind: 'Four of a Kind', full_house: 'Full House',
  flush: 'Flush', straight: 'Straight', three_of_a_kind: 'Three of a Kind',
  two_pair: 'Two Pair', pair: 'Pair', high_card: 'High Card',
};

export function computeReactionScore(avgMs: number): number {
  return Math.max(0, Math.round(1000 - avgMs));
}

export function computeMemoryScore(elapsedSeconds: number): number {
  return Math.max(1, Math.round(1000 - elapsedSeconds * 10));
}
