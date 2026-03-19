// Gear / Affiliate Product Data — TC024
// Amazon affiliate links: replace AFFILIATE_TAG placeholder with your actual tag.
// Image fields are intentionally blank (set per product when available).

export type ChipTier = 'budget' | 'mid' | 'premium';
export type BookCategory = 'preflop' | 'odds' | 'mental' | 'general';

export interface ChipProduct {
  id: string;
  name: string;
  tier: ChipTier;
  chipCount: number;   // approximate chip count in the set
  bestFor: string;
  description: string;
  ourPick?: string;    // short badge text e.g. "Best Value"
  link: string;
}

export interface BookProduct {
  id: string;
  name: string;
  author: string;
  category: BookCategory[];
  description: string;
  ourPick?: string;
  link: string;
}

export interface AccessoryProduct {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  link: string;
}

// ─── Poker Chip Sets ──────────────────────────────────────────────────────────

export const CHIP_PRODUCTS: ChipProduct[] = [
  // Budget
  {
    id: 'budget-500',
    name: 'Da Vinci 500-Chip Casino Poker Set',
    tier: 'budget',
    chipCount: 500,
    bestFor: 'casual home games, 4–6 players',
    description: 'A no-nonsense 500-piece set with a solid carry case. Gets the job done for regular home nights without breaking the bank.',
    ourPick: 'Best Budget',
    link: 'https://www.amazon.com/dp/B00004TZY8?tag=YOUR_TAG',
  },
  {
    id: 'budget-300',
    name: 'Trademark Poker 300 Chip Set',
    tier: 'budget',
    chipCount: 300,
    bestFor: 'small games, 2–4 players',
    description: 'A compact starter set that covers the basics. Ideal when you only need to cover a tight table or just getting started.',
    link: 'https://www.amazon.com/dp/B00006L2WL?tag=YOUR_TAG',
  },

  // Mid-tier
  {
    id: 'mid-500',
    name: 'Claysmith Gaming 500-Piece "The Mint" Chip Set',
    tier: 'mid',
    chipCount: 500,
    bestFor: 'regular home games, 6–9 players',
    description: 'Clay composite chips with a satisfying weight and feel. A solid mid-tier set that won\'t fall apart after a few hard nights.',
    ourPick: 'Best Value',
    link: 'https://www.amazon.com/dp/B0185TBLZO?tag=YOUR_TAG',
  },
  {
    id: 'mid-1000',
    name: 'Trademark Poker 1000 Chip "Lucky Crown" Set',
    tier: 'mid',
    chipCount: 1000,
    bestFor: 'larger games, 8–12 players, rebuy tournaments',
    description: 'Full 1000-chip arsenal for bigger nights. Covers deep stacks, multiple rebuys, and tournament formats with room to spare.',
    link: 'https://www.amazon.com/dp/B00006L2WO?tag=YOUR_TAG',
  },

  // Premium
  {
    id: 'prem-500',
    name: 'Paulson Top Hat & Cane 500-Chip Set',
    tier: 'premium',
    chipCount: 500,
    bestFor: 'serious home game players, gifts',
    description: 'Casino-grade clay chips that feel like the real thing. If you want your home game to feel like a real card room, this is the move.',
    ourPick: 'Top Pick',
    link: 'https://www.amazon.com/dp/B0002YCR7E?tag=YOUR_TAG',
  },
  {
    id: 'prem-1000',
    name: 'Nevada Jacks 1000-Chip Ceramic Set',
    tier: 'premium',
    chipCount: 1000,
    bestFor: 'serious games, 10+ players, tournaments',
    description: 'Premium ceramic chips with custom artwork. Built for the host who takes the game seriously and wants the feel to match.',
    link: 'https://www.amazon.com/dp/B07NBVDNJ9?tag=YOUR_TAG',
  },
];

// ─── Poker Books ──────────────────────────────────────────────────────────────

export const BOOK_PRODUCTS: BookProduct[] = [
  {
    id: 'modern-poker-theory',
    name: 'Modern Poker Theory',
    author: 'Michael Acevedo',
    category: ['preflop', 'general'],
    description: 'The definitive guide to GTO-based play. Covers preflop ranges, position, and exploitative adjustments with rigorous solver-backed analysis.',
    ourPick: 'Best for Preflop',
    link: 'https://www.amazon.com/dp/1909457892?tag=YOUR_TAG',
  },
  {
    id: 'mental-game',
    name: 'The Mental Game of Poker',
    author: 'Jared Tendler',
    category: ['mental', 'general'],
    description: 'Tackles tilt, confidence, and the psychology that separates winning players from everyone else. The most recommended poker book for a reason.',
    ourPick: 'Essential Read',
    link: 'https://www.amazon.com/dp/0615504442?tag=YOUR_TAG',
  },
  {
    id: 'applications-nlh',
    name: 'Applications of No-Limit Hold\'em',
    author: 'Matthew Janda',
    category: ['odds', 'general'],
    description: 'A math-first breakdown of equity, ranges, and bet sizing. Required reading if you want to understand the numbers behind the game.',
    ourPick: 'Best for Odds/Math',
    link: 'https://www.amazon.com/dp/1880685558?tag=YOUR_TAG',
  },
  {
    id: 'poker-blueprint',
    name: 'Excelling at No-Limit Hold\'em',
    author: 'Jonathan Little et al.',
    category: ['preflop', 'general'],
    description: 'Multiple elite coaches cover preflop, postflop, and tournament fundamentals. A rare multi-author book that actually delivers.',
    link: 'https://www.amazon.com/dp/1909457590?tag=YOUR_TAG',
  },
];

// ─── Accessories ──────────────────────────────────────────────────────────────

export const ACCESSORY_PRODUCTS: AccessoryProduct[] = [
  {
    id: 'kem-cards',
    name: 'KEM Arrow Poker Playing Cards (2-Deck Set)',
    description: 'The industry standard. Used in casinos and major live events. 100% plastic — they last years, not sessions.',
    bestFor: 'any serious home game',
    link: 'https://www.amazon.com/dp/B00000J1ER?tag=YOUR_TAG',
  },
  {
    id: 'copag-cards',
    name: 'Copag 1546 Poker Size Playing Cards',
    description: 'Casino-quality plastic cards at a fair price. A solid alternative to KEM when you want durability without the premium cost.',
    bestFor: 'everyday use, budget-conscious hosts',
    link: 'https://www.amazon.com/dp/B001QFOGBU?tag=YOUR_TAG',
  },
  {
    id: 'dealer-button',
    name: 'Casino Dealer Button Set (Dealer + Blind Buttons)',
    description: 'Heavy, real-deal casino buttons. The kind of detail that signals your table means business.',
    bestFor: 'any home game setup',
    link: 'https://www.amazon.com/dp/B00NGXLHHI?tag=YOUR_TAG',
  },
  {
    id: 'card-shuffler',
    name: 'Brybelly 6-Deck Automatic Card Shuffler',
    description: 'Cuts deal time in half and keeps the action moving. Guests love it, dealers love it more.',
    bestFor: 'hosts running longer sessions',
    link: 'https://www.amazon.com/dp/B0195HKZBA?tag=YOUR_TAG',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Recommend chip products based on total chips needed from the calculator */
export function recommendChipSets(totalChipsNeeded: number): ChipProduct[] {
  if (totalChipsNeeded < 400) {
    return CHIP_PRODUCTS.filter(p => p.chipCount <= 500);
  } else if (totalChipsNeeded <= 800) {
    return CHIP_PRODUCTS.filter(p => p.chipCount >= 500 && p.chipCount <= 1000);
  } else {
    return CHIP_PRODUCTS.filter(p => p.chipCount >= 1000);
  }
}

/** Books recommended for the preflop trainer */
export const PREFLOP_BOOKS = BOOK_PRODUCTS.filter(b =>
  b.category.includes('preflop') || b.id === 'mental-game',
);

/** Books recommended for the odds trainer */
export const ODDS_BOOKS = BOOK_PRODUCTS.filter(b =>
  b.category.includes('odds') || b.id === 'mental-game',
);

export const TIER_LABEL: Record<ChipTier, string> = {
  budget:  'Budget',
  mid:     'Mid-Tier',
  premium: 'Premium',
};
