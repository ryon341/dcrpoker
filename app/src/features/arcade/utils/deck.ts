import { RANKS, SUITS, Card } from './cards';

export function fullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function deal(n: number): Card[] {
  return shuffle(fullDeck()).slice(0, n);
}

export function dealFrom(deck: Card[], n: number): { cards: Card[]; remaining: Card[] } {
  return { cards: deck.slice(0, n), remaining: deck.slice(n) };
}
