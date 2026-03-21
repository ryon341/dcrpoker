// Title ladder by level range
const TITLE_LADDER: { title: string; minLevel: number; maxLevel: number }[] = [
  { title: 'Rookie',          minLevel: 1,  maxLevel: 3  },
  { title: 'Novice',          minLevel: 4,  maxLevel: 5  },
  { title: 'Apprentice',      minLevel: 6,  maxLevel: 7  },
  { title: 'Regular',         minLevel: 8,  maxLevel: 10 },
  { title: 'Skilled Player',  minLevel: 11, maxLevel: 13 },
  { title: 'Advanced Player', minLevel: 14, maxLevel: 16 },
  { title: 'Expert',          minLevel: 17, maxLevel: 19 },
  { title: 'Pro',             minLevel: 20, maxLevel: 22 },
  { title: 'Elite',           minLevel: 23, maxLevel: 24 },
  { title: 'High Roller',     minLevel: 25, maxLevel: 25 },
];

export function getTitleForLevel(level: number): string {
  const clamped = Math.max(1, Math.min(level, 25));
  return TITLE_LADDER.find(t => clamped >= t.minLevel && clamped <= t.maxLevel)!.title;
}

export function getTitleTier(level: number): string {
  return getTitleForLevel(level);
}

export function getNextTitle(level: number): { title: string; unlockLevel: number } | null {
  const clamped = Math.max(1, Math.min(level, 25));
  const currentIdx = TITLE_LADDER.findIndex(t => clamped >= t.minLevel && clamped <= t.maxLevel);
  if (currentIdx < 0 || currentIdx === TITLE_LADDER.length - 1) return null;
  const next = TITLE_LADDER[currentIdx + 1];
  return { title: next.title, unlockLevel: next.minLevel };
}

export function isTitleUnlockLevel(level: number): boolean {
  return TITLE_LADDER.some(t => t.minLevel === level);
}
