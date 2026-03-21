/**
 * Utilities for normalizing card codes into the canonical 2-character format
 * used by CARD_ASSET_MAP: rank (A K Q J T 9–2) + suit (S H D C).
 *
 * Accepts:
 *   "A♠"  "K♣"  "Q♥"  "J♦"  "T♠"  "9♣"  "2♦"
 *   already-normalized "AS" "KC" "TD" etc.
 */

const SUIT_MAP: Record<string, string> = {
  '♠': 'S',
  '♥': 'H',
  '♦': 'D',
  '♣': 'C',
};

/** Convert a raw card string from challenge data into a canonical code. */
export function normalizeCardCode(input: string): string {
  if (!input) return '';
  const s = input.trim();

  // Already normalized (e.g. "AS", "TD", "9C")
  if (/^[AKQJT98765432][SHDC]$/.test(s)) return s;

  // Symbol suit form: "A♠", "T♦", "10♥" etc.
  const lastChar = s.slice(-1);
  const suitLetter = SUIT_MAP[lastChar];
  if (suitLetter) {
    const rankPart = s.slice(0, -1);
    const rank = rankPart === '10' ? 'T' : rankPart;
    return rank + suitLetter;
  }

  return s.toUpperCase();
}

/** Build a code from separate rank and suit strings. */
export function rankSuitToCode(rank: string, suit: string): string {
  const r = rank === '10' ? 'T' : rank.toUpperCase();
  const s = SUIT_MAP[suit] ?? suit.toUpperCase();
  return r + s;
}
