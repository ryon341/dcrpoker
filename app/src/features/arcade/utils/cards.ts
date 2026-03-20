export type Suit = 'h' | 'd' | 'c' | 's';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Card = string; // e.g. "Ah", "Td", "2c"

export const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
export const SUITS: Suit[] = ['h','d','c','s'];

export function parseCard(card: Card): { rank: Rank; suit: Suit; rankIndex: number } {
  const suit = card.slice(-1) as Suit;
  const rank = card.slice(0, -1) as Rank;
  return { rank, suit, rankIndex: RANKS.indexOf(rank) };
}

export function suitSymbol(suit: Suit): string {
  return ({ h: '♥', d: '♦', c: '♣', s: '♠' } as Record<Suit, string>)[suit];
}

export function rankDisplay(rank: Rank): string {
  return rank === 'T' ? '10' : rank;
}

export function cardDisplay(card: Card): string {
  const { rank, suit } = parseCard(card);
  return `${rankDisplay(rank)}${suitSymbol(suit)}`;
}

export function suitColor(suit: Suit): string {
  return suit === 'h' || suit === 'd' ? '#e74c3c' : '#f5f5f5';
}

export function cardValue(rank: Rank): number {
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  if (rank === 'A') return 11;
  if (rank === 'T') return 10;
  return parseInt(rank, 10);
}

export function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    const { rank } = parseCard(card);
    if (rank === 'A') { aces++; total += 11; }
    else total += cardValue(rank);
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}
