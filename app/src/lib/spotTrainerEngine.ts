// Spot Trainer Engine — TC041
// Helpers for selecting, filtering, and validating spots.

import { Spot, SpotCategory, SPOTS } from './spotTrainerData';

export interface SpotFilters {
  category?: SpotCategory;
}

export interface SpotResult {
  correct: boolean;
  correctAction: string;
  explanation: string;
}

/** Pick a random spot from the dataset, optionally filtered by category. */
export function getRandomSpot(filters: SpotFilters = {}, exclude?: string): Spot {
  let pool = filters.category
    ? SPOTS.filter(s => s.category === filters.category)
    : SPOTS;

  // Avoid repeating the same spot back-to-back if the pool allows
  if (pool.length > 1 && exclude) {
    const narrowed = pool.filter(s => s.id !== exclude);
    if (narrowed.length > 0) pool = narrowed;
  }

  if (pool.length === 0) pool = SPOTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Check a user's answer against the spot's correct action. */
export function validateSpotAnswer(spot: Spot, answer: string): SpotResult {
  return {
    correct: answer === spot.correctAction,
    correctAction: spot.correctAction,
    explanation: spot.explanation,
  };
}

/** Return the appropriate answer choices for a given spot. */
export function getChoicesForSpot(spot: Spot): string[] {
  return spot.choices;
}

/** Human-readable label for a category. */
export function categoryLabel(category: SpotCategory): string {
  switch (category) {
    case 'unopened':    return 'Unopened Pot';
    case 'vs_open':     return 'vs. Open';
    case 'short_stack': return 'Short Stack';
  }
}
