// Hand Study Helpers — TC044
// Heuristic mapping from a recorded hand to Spot Trainer prefill context.

import { SpotCategory } from './spotTrainerData';
import { HandRecord } from '../api/hands';

export interface SpotPrefill {
  category: SpotCategory;
  gameType?: string;
  position?: string;
  stackDepthBb?: number;
  heroHand?: string;
}

/**
 * Map a recorded hand to a Spot Trainer category using simple heuristics:
 *   - stackDepth <= 15bb            → short_stack
 *   - preflop_action mentions open/raise/call/3bet responding to someone → vs_open
 *   - otherwise                     → unopened
 */
export function getSpotPrefillFromHand(hand: HandRecord): SpotPrefill {
  const stack = hand.stack_depth_bb;
  const preflopText = (hand.preflop_action ?? '').toLowerCase();

  let category: SpotCategory;

  if (stack != null && stack <= 15) {
    category = 'short_stack';
  } else if (
    preflopText.match(/open|raises|raise|calls|call|3.?bet|3bet|squeeze|re.?raise|open to|opens/)
  ) {
    // If the preflop text mentions a villain's action (CO opens, UTG raises, etc.) it's a vs_open spot
    const villainActing = preflopText.match(
      /(utg|mp|hj|co|btn|sb|bb)\s+(opens|raises|open|raise)/,
    );
    category = villainActing ? 'vs_open' : 'unopened';
  } else {
    category = 'unopened';
  }

  return {
    category,
    gameType:     hand.game_type,
    position:     hand.position,
    stackDepthBb: hand.stack_depth_bb ?? undefined,
    heroHand:     hand.hero_hand,
  };
}
