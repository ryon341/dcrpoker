import { Card, parseCard } from './cards';
import { HandRank, HAND_RANK_SCORES } from './scoring';

export function evaluateHand(cards: Card[]): HandRank {
  const parsed = cards.map(parseCard);
  const rankCounts: Record<number, number> = {};
  const suitCounts: Record<string, number> = {};

  for (const { rankIndex, suit } of parsed) {
    rankCounts[rankIndex] = (rankCounts[rankIndex] || 0) + 1;
    suitCounts[suit] = (suitCounts[suit] || 0) + 1;
  }

  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const isFlush = Object.values(suitCounts).some(c => c >= 5);

  const rankIndices = parsed.map(p => p.rankIndex).sort((a, b) => a - b);
  const unique = [...new Set(rankIndices)].sort((a, b) => a - b);

  const isStraight = unique.length >= 5 && (() => {
    // Normal straight: 5 consecutive ranks
    const normal = unique[unique.length - 1] - unique[unique.length - 5] === 4 &&
      unique.slice(-5).every((v, i, a) => i === 0 || v === a[i - 1] + 1);
    // Wheel: A-2-3-4-5 (indices 0,1,2,3 + 12)
    const wheel = unique[0] === 0 && unique[1] === 1 && unique[2] === 2 && unique[3] === 3 && unique.includes(12);
    return normal || wheel;
  })();

  if (isFlush && isStraight) {
    return unique.includes(12) && unique.includes(11) ? 'royal_flush' : 'straight_flush';
  }
  if (counts[0] === 4) return 'four_of_a_kind';
  if (counts[0] === 3 && counts[1] >= 2) return 'full_house';
  if (isFlush) return 'flush';
  if (isStraight) return 'straight';
  if (counts[0] === 3) return 'three_of_a_kind';
  if (counts[0] === 2 && counts[1] === 2) return 'two_pair';
  if (counts[0] === 2) return 'pair';
  return 'high_card';
}

export function bestFiveFrom(cards: Card[]): { hand: Card[]; rank: HandRank } {
  if (cards.length <= 5) return { hand: cards, rank: evaluateHand(cards) };

  let best: { hand: Card[]; rank: HandRank } | null = null;

  // Generate all 5-card combinations
  for (let i = 0; i < cards.length - 4; i++) {
    for (let j = i + 1; j < cards.length - 3; j++) {
      for (let k = j + 1; k < cards.length - 2; k++) {
        for (let l = k + 1; l < cards.length - 1; l++) {
          for (let m = l + 1; m < cards.length; m++) {
            const combo = [cards[i], cards[j], cards[k], cards[l], cards[m]];
            const rank = evaluateHand(combo);
            if (!best || HAND_RANK_SCORES[rank] > HAND_RANK_SCORES[best.rank]) {
              best = { hand: combo, rank };
            }
          }
        }
      }
    }
  }

  return best!;
}

// Evaluate a user-selected 5 from 7 array of selected indices
export function evaluateSelected(allCards: Card[], selectedIndices: number[]): HandRank {
  const selected = selectedIndices.map(i => allCards[i]);
  return evaluateHand(selected);
}
