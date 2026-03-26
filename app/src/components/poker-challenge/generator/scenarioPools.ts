// ─── TC090.5 — Scenario Pools ─────────────────────────────────────────────────
// Curated scenario configurations for poker challenge question generation.
// All pools use realistic poker values grounded in actual GTO training.

import type { TierKey, DrawType } from './generatorTypes';

// ── Positions ─────────────────────────────────────────────────────────────────
export const ALL_POSITIONS       = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const;
export const EARLY_POSITIONS     = ['UTG', 'MP'] as const;
export const MIDDLE_POSITIONS    = ['HJ', 'CO'] as const;
export const LATE_POSITIONS      = ['BTN', 'CO', 'HJ'] as const;
export const BLIND_POSITIONS     = ['SB', 'BB'] as const;
export const NON_BLIND_POSITIONS = ['UTG', 'MP', 'HJ', 'CO', 'BTN'] as const;

// ── Open-raise sizes ──────────────────────────────────────────────────────────
export const OPEN_SIZES = [2, 2.5, 3] as const;

// ── Board textures for postflop pressure questions ────────────────────────────
export const DRY_BOARDS       = ['A-K-7 rainbow', 'K-T-4 rainbow', 'A-8-3 rainbow', 'Q-7-2 rainbow', 'J-6-2 rainbow', 'K-Q-5 rainbow', 'A-9-4 rainbow'] as const;
export const WET_BOARDS       = ['J-T-8', '9-8-6', 'T-9-7', '8-7-5', 'Q-J-9', 'K-Q-J', 'T-8-7'] as const;
export const SINGLE_SUIT_BOARDS = ['A-7-2 two-tone', 'K-9-3 two-tone', 'Q-8-4 two-tone', 'J-6-3 two-tone', 'T-8-2 two-tone'] as const;

// ── Draw types and their outs ─────────────────────────────────────────────────
export const DRAW_CONFIGS: Record<DrawType, { outs: number; wrongOuts: number[] }> = {
  flush:                  { outs: 9,  wrongOuts: [6, 7, 8, 12] },
  oesd:                   { outs: 8,  wrongOuts: [4, 6, 9, 10] },
  gutshot:                { outs: 4,  wrongOuts: [3, 6, 8, 5] },
  two_overcards:          { outs: 6,  wrongOuts: [3, 8, 9, 4] },
  flush_plus_overcard:    { outs: 12, wrongOuts: [9, 10, 14, 15] },
  flush_plus_two_overcards: { outs: 15, wrongOuts: [9, 12, 14, 11] },
  pair_plus_flush:        { outs: 14, wrongOuts: [9, 12, 15, 11] },
  pair_plus_oesd:         { outs: 10, wrongOuts: [8, 9, 12, 11] },
  oesd_flush:             { outs: 15, wrongOuts: [9, 11, 12, 14] },
  gutshot_plus_overcard:  { outs: 7,  wrongOuts: [4, 6, 9, 8] },
  monster_combo:          { outs: 17, wrongOuts: [12, 14, 15, 16] },
} as const;

// ── Outs question phrasings (unique prompts per draw type) ────────────────────

/** Returns a pool of unique outs question prompt texts for the given draw type.  */
export function getOutsPromptPool(draw: DrawType): string[] {
  const pools: Record<DrawType, string[]> = {
    flush: [
      'You pick up a flush draw on the flop. How many outs do you have?',
      'You flop a flush draw with no pair. How many outs do you have?',
      'You have a four-flush after the flop. How many outs do you have?',
      'You flopped a nut flush draw. How many outs do you have?',
      'The flop gave you a flush draw to the nuts. How many outs do you have?',
      'You hold two suited cards and the flop brings two more of your suit. How many outs do you have?',
      'After the flop you have four cards to your flush. How many outs do you have?',
      'You picked up a flush draw on a dry flop. How many outs do you have?',
      'You hold a backdoor... no wait, a live flush draw on the flop. How many outs do you have?',
      'You have a flush draw on the flop. How many outs remain in the deck?',
    ],
    oesd: [
      'You flop an open-ended straight draw (OESD). How many outs do you have?',
      'You pick up an OESD on the flop. How many outs do you have?',
      'You have a two-way straight draw after the flop. How many outs do you have?',
      'You hold four cards to a straight that can hit on either end. How many outs do you have?',
      'You flopped a straight draw open on both ends. How many outs do you have?',
      'After the flop you hold an open-ended straight draw. How many outs do you have?',
      'You have an OESD — both the top and bottom end can complete your straight. How many outs?',
      'You flopped a double-sided straight draw. How many outs do you have?',
      'Your four cards connect to a straight on both ends. How many outs?',
    ],
    gutshot: [
      'You flop a gutshot straight draw. How many outs do you have?',
      'You pick up a gutshot (inside straight draw) on the flop. How many outs?',
      'You hold an inside straight draw after the flop. How many outs?',
      'You need one specific card rank to complete your straight. How many outs?',
      'You flopped an inside straight draw (belly buster). How many outs do you have?',
      'You have a gutshot draw — only one rank completes your straight. How many outs?',
      'After the flop you hold a gutshot straight draw. How many outs do you have?',
      'You flopped an inner straight draw. How many outs do you have?',
    ],
    two_overcards: [
      'You hold two overcards to a paired board. How many outs do you have?',
      'You have two overcards to the entire board. How many outs to improve?',
      'Both of your hole cards are higher than any board card. How many outs?',
      'You flopped two overcards. How many outs do you have to pair either card?',
      'You hold two unpaired cards that are both higher than the board. How many outs?',
      'After the flop you have two overcards and no pair. How many outs?',
      'You have two live overcards. How many outs do you have?',
    ],
    flush_plus_overcard: [
      'You hold a flush draw plus one overcard on the flop. How many outs?',
      'You have a four-flush and an overcard. How many outs do you have?',
      'Your hand combines a flush draw with one overcard. How many outs?',
      'You flopped a flush draw and one of your hole cards is an overcard. How many outs?',
      'One overcard plus a flush draw on the flop. How many total outs do you have?',
      'You have a flush draw and one card that pairs to a winner. How many outs?',
      'Flush draw on board plus an overcard that can improve. How many outs?',
      'A flush draw plus an overcard to the entire board. How many outs?',
    ],
    flush_plus_two_overcards: [
      'You hold a flush draw plus two overcards. How many outs do you have?',
      'You flop a flush draw and both hole cards are overcards to the board. How many outs?',
      'Flush draw plus two live overcards on the flop. How many outs?',
      'You have a four-flush and two overcards. How many total outs do you have?',
      'Your hand is a flush draw combined with two overcards. How many outs?',
      'Two overcards to the board plus a flush draw. How many outs do you have?',
      'You flopped a flush draw; both your hole cards are also overcards. How many outs?',
      'Holding two overcards and a flush draw. How many outs total?',
      'You have a monster draw: flush draw plus two overcards. How many outs?',
    ],
    pair_plus_flush: [
      'You hold a small pair plus a flush draw. How many outs do you have?',
      'You flopped a pair and picked up a flush draw. How many outs?',
      'A pair plus a flush draw — how many outs do you have to improve to trips or a flush?',
      'You have a pair and a flush draw after the flop. How many outs?',
      'You flopped bottom pair and also picked up a flush draw. How many outs?',
      'Pair plus flush draw on the flop. How many total outs?',
      'You hold a pair and a four-flush. How many outs do you have?',
      'A made pair combined with a flush draw. How many outs to improve?',
    ],
    pair_plus_oesd: [
      'You hold a pair plus an open-ended straight draw. How many outs do you have?',
      'You flopped a pair and have an OESD. How many outs?',
      'A pair plus OESD combination. How many outs do you have total?',
      'You have a made pair and a two-way straight draw. How many outs?',
      'You flopped a pair plus a double-sided straight draw. How many outs?',
      'Pair combined with an OESD on the flop. How many outs do you have?',
      'You have a pair and four cards to a straight open on both ends. How many outs?',
      'A pair plus open-ended straight draw. How many total outs?',
    ],
    oesd_flush: [
      'You hold an open-ended straight flush draw. How many outs do you have?',
      'You flopped an OESD that also has flush potential. How many outs?',
      'You have a straight flush draw open on both ends. How many outs?',
      'You picked up a combo OESD + flush draw on the flop. How many outs?',
      'You hold a monstrous draw: OESD plus a flush draw. How many outs?',
      'An open-ended straight flush draw on the flop. How many outs?',
      'You have cards that form both an OESD and a flush draw. How many outs?',
      'Your hand is an open-ended straight flush draw. How many outs?',
    ],
    gutshot_plus_overcard: [
      'You hold a gutshot plus one overcard. How many outs do you have?',
      'You have an inside straight draw plus one overcard. How many outs?',
      'A gutshot straight draw combined with an overcard. How many outs?',
      'You flopped a gutshot and have one overcard. How many outs total?',
      'An inner straight draw plus one overcard. How many outs do you have?',
      'You hold a gutshot draw and one card higher than the board. How many outs?',
    ],
    monster_combo: [
      'You hold a monster combo: OESD + flush draw + a made pair. How many total outs do you have?',
      'You flopped a pair while also picking up an OESD and a flush draw. How many outs?',
      'Your hand combines a made pair with both an open-ended straight draw and a flush draw. How many outs?',
      'You have a pair, an OESD, and a flush draw all at once. How many total outs?',
      'OESD plus flush draw plus a live pair — how many outs do you have to improve to a strong hand?',
    ],
  };
  return pools[draw];
}

// ── Position question pool ────────────────────────────────────────────────────
/** Complete pool of unique position-knowledge question objects.
 *  Each item: { prompt, choices, correctAnswer, explanation } */
export const POSITION_QUESTIONS: Array<{
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
}> = [
  {
    prompt: 'In 6-max cash poker, which position acts last preflop?',
    choices: ['UTG', 'CO', 'BTN', 'SB'],
    correctAnswer: 'BTN',
    explanation: 'The Button (BTN) acts last preflop and postflop, making it the most powerful position.',
    tags: ['position', 'btn', 'preflop_order'],
  },
  {
    prompt: 'Which position is generally considered the best in a 6-max game?',
    choices: ['Big Blind', 'UTG', 'Button', 'Small Blind'],
    correctAnswer: 'Button',
    explanation: 'The Button acts last on every postflop street, providing maximum information advantage.',
    tags: ['position', 'btn', 'positional_advantage'],
  },
  {
    prompt: 'In 6-max poker, which seat is forced to post the big blind?',
    choices: ['UTG', 'BB', 'SB', 'BTN'],
    correctAnswer: 'BB',
    explanation: 'The player in the Big Blind seat posts the big blind before seeing any cards.',
    tags: ['position', 'bb', 'blinds'],
  },
  {
    prompt: 'You are "out of position" in a hand. What does that mean?',
    choices: [
      'You act before your opponent postflop',
      'You act after your opponent postflop',
      'You posted a blind',
      'You are on the button',
    ],
    correctAnswer: 'You act before your opponent postflop',
    explanation: 'Being out of position means you must act before your opponent, giving them the information edge.',
    tags: ['position', 'oop', 'concept'],
  },
  {
    prompt: 'Why is acting in position (IP) advantageous in poker?',
    choices: [
      'You can see your opponent\'s action before deciding',
      'You always have the best hand',
      'You pay fewer blinds',
      'You can bluff more freely preflop',
    ],
    correctAnswer: 'You can see your opponent\'s action before deciding',
    explanation: 'Acting last gives you information about your opponent\'s intentions before committing chips.',
    tags: ['position', 'ip', 'advantage'],
  },
  {
    prompt: 'In 6-max, UTG stands for:',
    choices: ['Under the Gun', 'Under the Guard', 'Up The Gain', 'Upper Table Game'],
    correctAnswer: 'Under the Gun',
    explanation: 'UTG (Under the Gun) is the first player to act preflop — the most difficult position.',
    tags: ['position', 'utg', 'terminology'],
  },
  {
    prompt: 'In a 6-max game, how many players typically sit at the table?',
    choices: ['9', '6', '8', '4'],
    correctAnswer: '6',
    explanation: '6-max games have 6 seats, making the game more action-heavy than full ring (9-player) games.',
    tags: ['position', 'game_format', 'basics'],
  },
  {
    prompt: 'From which position should you generally play the tightest preflop range?',
    choices: ['Button', 'UTG', 'Big Blind', 'Cutoff'],
    correctAnswer: 'UTG',
    explanation: 'UTG acts first preflop with multiple players left to act, so you should play only strong hands.',
    tags: ['position', 'utg', 'range', 'tight'],
  },
  {
    prompt: 'The "Cutoff" position (CO) in 6-max is one seat to the:',
    choices: ['Right of UTG', 'Right of the Button', 'Left of the Button', 'Left of UTG'],
    correctAnswer: 'Right of the Button',
    explanation: 'The Cutoff is directly to the right of the Button, making it the second-best position.',
    tags: ['position', 'co', 'terminology'],
  },
  {
    prompt: 'You are in the Small Blind. Postflop, relative to the Button, you are:',
    choices: ['In position', 'Out of position', 'Neutral', 'Last to act'],
    correctAnswer: 'Out of position',
    explanation: 'The Small Blind is the worst position postflop — you act first on every street.',
    tags: ['position', 'sb', 'postflop'],
  },
  {
    prompt: 'Which position acts first postflop in a heads-up pot?',
    choices: ['The player who raised preflop', 'The player to the left of the Button', 'The Small Blind', 'The Button'],
    correctAnswer: 'The Small Blind',
    explanation: 'Postflop, action starts to the left of the dealer button — the Small Blind acts first.',
    tags: ['position', 'postflop_order', 'sb'],
  },
  {
    prompt: 'Why is late position (BTN/CO) better for stealing blinds?',
    choices: [
      'You have better cards in late position',
      'Fewer players remain to act, lowering resistance',
      'The blinds are smaller',
      'You can see the flop for free',
    ],
    correctAnswer: 'Fewer players remain to act, lowering resistance',
    explanation: 'With fewer players to act, your steal attempt faces less opposition and succeeds more often.',
    tags: ['position', 'steal', 'late_position'],
  },
  {
    prompt: 'Which statement about position is TRUE?',
    choices: [
      'Position changes every hand in a rotating sequence',
      'The Button acts first preflop',
      'Being OOP (out of position) is always a disadvantage',
      'UTG is the best position',
    ],
    correctAnswer: 'Position changes every hand in a rotating sequence',
    explanation: 'The dealer button moves clockwise each hand, meaning every player cycles through all positions.',
    tags: ['position', 'rotation', 'basics'],
  },
  {
    prompt: 'In the Big Blind, you already have money invested. Facing a small raise, you should:',
    choices: [
      'Always fold to avoid losing more',
      'Call more frequently since you get a discount',
      'Always re-raise to protect your blind',
      'Always fold unless you have top 10 hands',
    ],
    correctAnswer: 'Call more frequently since you get a discount',
    explanation: 'The BB gets a "price break" when calling raises — your pot odds are better than any other position.',
    tags: ['position', 'bb', 'blind_defense', 'pot_odds'],
  },
  {
    prompt: 'What is "positional advantage" in poker?',
    choices: [
      'Having chips in the pot from blinds',
      'Acting after your opponents on postflop streets',
      'Sitting to the left of aggressive players',
      'Having the best starting hand',
    ],
    correctAnswer: 'Acting after your opponents on postflop streets',
    explanation: 'Positional advantage means seeing your opponents\' actions before making your own decision.',
    tags: ['position', 'advantage', 'concept'],
  },
  {
    prompt: 'How many positions are there in a 6-max game?',
    choices: ['4', '9', '6', '8'],
    correctAnswer: '6',
    explanation: '6-max has: UTG, MP, HJ (Hijack), CO (Cutoff), BTN (Button), SB/BB (Blinds).',
    tags: ['position', 'count', 'basics'],
  },
  {
    prompt: 'The Hijack (HJ) position is to the right of which seat?',
    choices: ['UTG', 'MP', 'BTN', 'CO'],
    correctAnswer: 'CO',
    explanation: 'Seat order from UTG: UTG → MP → HJ → CO → BTN → SB → BB.',
    tags: ['position', 'hj', 'terminology'],
  },
  {
    prompt: 'From the Button in a 6-max game, how many players are still to act preflop?',
    choices: ['1', '2', '3', '0'],
    correctAnswer: '2',
    explanation: 'After the Button acts preflop, only the Small Blind and Big Blind remain.',
    tags: ['position', 'btn', 'preflop_order'],
  },
  {
    prompt: 'Which best describes a "blind steal" attempt?',
    choices: [
      'Raising from late position when folded to you, hoping the blinds fold',
      'Limping into the pot from early position',
      'Calling the big blind from UTG',
      'Check-raising the flop as the Big Blind',
    ],
    correctAnswer: 'Raising from late position when folded to you, hoping the blinds fold',
    explanation: 'A steal raise uses positional advantage to win the blinds without a showdown.',
    tags: ['position', 'steal', 'late_position', 'preflop'],
  },
  {
    prompt: 'In 6-max, which player posts the small blind?',
    choices: ['The player to the left of the Big Blind', 'The Button', 'UTG', 'The player to the left of the Button'],
    correctAnswer: 'The player to the left of the Button',
    explanation: 'The Small Blind sits directly to the left of the Button and posts half the big blind.',
    tags: ['position', 'sb', 'blinds'],
  },
  {
    prompt: 'Acting "in position" (IP) against a single opponent most commonly means:',
    choices: [
      'Being on the Button',
      'Having invested the most chips',
      'Having the strongest hand',
      'Being first to act',
    ],
    correctAnswer: 'Being on the Button',
    explanation: 'The Button is the most common in-position seat in heads-up and multi-way pots.',
    tags: ['position', 'btn', 'ip', 'concept'],
  },
  {
    prompt: 'From UTG in 6-max, which of these would you generally fold preflop?',
    choices: ['AA', 'KK', 'QQ', 'T8o'],
    correctAnswer: 'T8o',
    explanation: 'T8o is a marginal hand that plays poorly from UTG — too many players left to act behind you.',
    tags: ['position', 'utg', 'range', 'fold'],
  },
  {
    prompt: 'Being in the Big Blind is disadvantageous postflop because:',
    choices: [
      'You act first on all postflop streets',
      'You must post money before seeing cards',
      'You always face aggression from UTG',
      'You cannot raise preflop',
    ],
    correctAnswer: 'You act first on all postflop streets',
    explanation: 'The BB is the first to act postflop — giving all other players the information advantage.',
    tags: ['position', 'bb', 'postflop', 'disadvantage'],
  },
  {
    prompt: 'Why can you profitably open wider ranges from the Button?',
    choices: [
      'The Button always has the best hand',
      'You will be in position postflop against the blinds',
      'The Button pays fewer blinds',
      'BTN hands have more equity vs all ranges',
    ],
    correctAnswer: 'You will be in position postflop against the blinds',
    explanation: 'Position allows you to realize hand equity more efficiently and bluff more effectively.',
    tags: ['position', 'btn', 'opening_range', 'advantage'],
  },
  {
    prompt: 'In 6-max, "MP" usually refers to:',
    choices: ['Min Pot', 'Middle Position', 'More Players', 'Main Position'],
    correctAnswer: 'Middle Position',
    explanation: 'MP is the Middle Position seat, between UTG and the HJ (Hijack).',
    tags: ['position', 'mp', 'terminology'],
  },
  {
    prompt: 'Which scenario puts you in the WORST positional spot postflop?',
    choices: [
      'You are on the Button vs one opponent in the Big Blind',
      'You are the Big Blind vs one opponent on the Button',
      'You are in the Cutoff vs the Big Blind',
      'You are in the Hijack vs the Button',
    ],
    correctAnswer: 'You are the Big Blind vs one opponent on the Button',
    explanation: 'Being the BB vs BTN means you are OOP on every postflop street against the best position.',
    tags: ['position', 'bb', 'btn', 'oop_vs_ip'],
  },
  {
    prompt: 'Three players fold to you on the Button. You should:',
    choices: [
      'Play a narrow range of premium hands only',
      'Play a wide range since you are in position vs only the blinds',
      'Limp with all hands to see cheap flops',
      'Always raise 3x to isolate the Big Blind',
    ],
    correctAnswer: 'Play a wide range since you are in position vs only the blinds',
    explanation: 'With position on the blinds and only two opponents, you can profitably open a wide range.',
    tags: ['position', 'btn', 'steal', 'range'],
  },
  {
    prompt: 'What happens to your positional advantage in a 3-bet pot?',
    choices: [
      'It stays the same',
      'It disappears entirely',
      'It becomes more pronounced — larger pots amplify positional edge',
      'The 3-bettor always has position',
    ],
    correctAnswer: 'It becomes more pronounced — larger pots amplify positional edge',
    explanation: 'Bigger pots make positional advantage worth more — you can extract more value or bluff more effectively.',
    tags: ['position', '3bet', 'advantage'],
  },
  {
    prompt: 'The player on the Button is also known as the:',
    choices: ['Dealer', 'Cutter', 'Hijacker', 'Grinder'],
    correctAnswer: 'Dealer',
    explanation: 'The Button represents the (theoretical) dealer position and acts last postflop.',
    tags: ['position', 'btn', 'terminology'],
  },
  {
    prompt: 'In 6-max, which two positions are in the "blinds"?',
    choices: ['UTG and MP', 'BTN and CO', 'SB and BB', 'HJ and CO'],
    correctAnswer: 'SB and BB',
    explanation: 'The Small Blind and Big Blind post forced bets before seeing cards.',
    tags: ['position', 'sb', 'bb', 'blinds'],
  },
  {
    prompt: 'A coin is flipped and you win 55% of the time. In poker, this is like:',
    choices: [
      'Having a slight edge but not a guarantee',
      'Always winning in the long run',
      'Being a 2:1 favorite',
      'Having a free card',
    ],
    correctAnswer: 'Having a slight edge but not a guarantee',
    explanation: 'Small edges compound over many hands — consistent slight edges lead to long-term profit in poker.',
    tags: ['position', 'equity', 'edge'],
  },
  {
    prompt: 'In heads-up poker (2 players), the dealer is also the:',
    choices: ['Big Blind', 'Small Blind and acts first preflop', 'Big Blind and acts last preflop', 'First to act postflop'],
    correctAnswer: 'Small Blind and acts first preflop',
    explanation: 'In HU poker, the dealer posts the small blind and acts first preflop, but acts last postflop.',
    tags: ['position', 'hu', 'btn', 'sb'],
  },
  {
    prompt: 'You open from UTG and get called by the Button. On the flop, who acts first?',
    choices: ['UTG', 'The Button', 'Whoever has the best hand', 'The Big Blind'],
    correctAnswer: 'UTG',
    explanation: 'Postflop action starts from the first active player to the left of the dealer button — UTG in this case.',
    tags: ['position', 'utg', 'postflop_order'],
  },
  {
    prompt: 'Which position benefits most from "blind stealing" preflop?',
    choices: ['UTG', 'BB', 'CO', 'SB'],
    correctAnswer: 'CO',
    explanation: 'The Cutoff (CO) can steal with only the BTN and blinds left — nearly as good as the Button.',
    tags: ['position', 'co', 'steal'],
  },
  {
    prompt: 'In the Small Blind, why is defending against BTN raises more difficult?',
    choices: [
      'You will be out of position on every postflop street',
      'The BTN always has pocket aces',
      'You have fewer chips in the pot',
      'The Small Blind cannot 3-bet',
    ],
    correctAnswer: 'You will be out of position on every postflop street',
    explanation: 'The SB is the only position that is OOP on all three postflop streets when out of position.',
    tags: ['position', 'sb', 'blind_defense', 'oop'],
  },
  {
    prompt: 'UTG raises. The action folds to the Big Blind. The BB should:',
    choices: [
      'Always fold since UTG has a very strong range',
      'Defend with hands that play well out of position vs a tight range',
      'Always re-raise to apply pressure',
      'Always call since they already have money invested',
    ],
    correctAnswer: 'Defend with hands that play well out of position vs a tight range',
    explanation: 'The BB should defend selectively — UTG has a strong range, so many BB hands cannot continue profitably.',
    tags: ['position', 'bb', 'vs_utg', 'range'],
  },
  {
    prompt: 'Late position (BTN/CO/HJ) allows you to do which of the following MORE effectively?',
    choices: [
      'Semi-bluff with draws',
      'Limp into pots cheaply',
      'Win at showdown with weak hands',
      'Outplay opponents preflop only',
    ],
    correctAnswer: 'Semi-bluff with draws',
    explanation: 'Position makes semi-bluffs more effective — you can take free cards if called, or win immediately if opponent folds.',
    tags: ['position', 'semibluff', 'late_position', 'draws'],
  },
  {
    prompt: 'In a multi-way pot (3+ players), position becomes:',
    choices: [
      'Less important because of pot odds',
      'Even more important since multiple opponents can act',
      'Irrelevant since the best hand wins anyway',
      'Reversed — early position is better multi-way',
    ],
    correctAnswer: 'Even more important since multiple opponents can act',
    explanation: 'With multiple opponents, acting last provides even more informational advantage to make correct decisions.',
    tags: ['position', 'multiway', 'advantage'],
  },
  {
    prompt: 'What does "closing the action" mean in poker?',
    choices: [
      'Being the last player to act in a betting round',
      'Ending the game early',
      'Winning the pot without a showdown',
      'Checking on the river',
    ],
    correctAnswer: 'Being the last player to act in a betting round',
    explanation: 'Closing the action means no one can re-open betting after you — you see all information before deciding.',
    tags: ['position', 'close_action', 'concept'],
  },
  {
    prompt: 'The term "IP" in poker stands for:',
    choices: ['In Position', 'Implied Pot', 'In Play', 'Initial Pressure'],
    correctAnswer: 'In Position',
    explanation: 'IP means In Position — acting after your opponent postflop.',
    tags: ['position', 'ip', 'terminology'],
  },
  {
    prompt: 'What does "OOP" mean in poker discussion?',
    choices: ['Out of Position', 'Out of Play', 'Over-Pair Problem', 'Original Open Pot'],
    correctAnswer: 'Out of Position',
    explanation: 'OOP stands for Out of Position — acting before your opponent, with less information.',
    tags: ['position', 'oop', 'terminology'],
  },
  {
    prompt: 'When you are on the button vs a single opponent in the big blind, and you raise preflop — postflop you are:',
    choices: ['OOP (act first)', 'IP (act last)', 'Checked to automatically', 'In the same spot as the BB'],
    correctAnswer: 'IP (act last)',
    explanation: 'The Button acts last postflop regardless of preflop action — you maintain position throughout the hand.',
    tags: ['position', 'btn', 'ip', 'postflop'],
  },
  {
    prompt: 'From the Hijack (HJ) in a 6-max game, how many players act before you preflop?',
    choices: ['1', '2', '3', '4'],
    correctAnswer: '2',
    explanation: 'In 6-max: UTG and MP both act before the HJ preflop.',
    tags: ['position', 'hj', 'preflop_order'],
  },
  {
    prompt: 'Which of these is a benefit of being on the Button?',
    choices: [
      'You can see community cards first',
      'You can adjust your decision based on all opponents\' actions',
      'You always get dealt premium hands',
      'You are first to act preflop',
    ],
    correctAnswer: 'You can adjust your decision based on all opponents\' actions',
    explanation: 'Acting last with full information lets you make much more accurate decisions than earlier positions.',
    tags: ['position', 'btn', 'information', 'advantage'],
  },
  {
    prompt: 'The position directly to the right of the Button is called the:',
    choices: ['Hijack', 'Cutoff', 'Small Blind', 'UTG'],
    correctAnswer: 'Cutoff',
    explanation: 'The Cutoff (CO) sits directly to the right of the Button — second-best position.',
    tags: ['position', 'co', 'terminology'],
  },
  {
    prompt: 'Why should you call 3-bets more frequently when you are in position?',
    choices: [
      'You can bluff more freely since you act first',
      'You can realize your equity more efficiently by acting last',
      'Calling in position means you never lose the pot',
      'Position reverses the equity advantage',
    ],
    correctAnswer: 'You can realize your equity more efficiently by acting last',
    explanation: 'In-position calls are more profitable because acting last helps you maximize value and minimize losses.',
    tags: ['position', '3bet', 'call', 'ip', 'equity'],
  },
  {
    prompt: 'In 6-max, a "full ring" game would have:',
    choices: ['6 players', '9 players', '2 players', '8 players'],
    correctAnswer: '9 players',
    explanation: 'Full ring games seat 9 players; 6-max limits seats to 6 for more action-heavy play.',
    tags: ['position', 'game_format', 'terminology'],
  },
  {
    prompt: 'You open from CO and get 3-bet by the Button. If you call, postflop you are:',
    choices: ['In position', 'Out of position', 'First to act', 'Last to act on every street'],
    correctAnswer: 'Out of position',
    explanation: 'Calling a BTN 3-bet puts you OOP on all postflop streets — the Button will act after you.',
    tags: ['position', 'co', 'vs_btn', '3bet', 'oop'],
  },
  {
    prompt: 'The concept of "range advantage" is most effectively leveraged by:',
    choices: [
      'The player with the most chips',
      'The player who is in position',
      'The player who raised preflop',
      'The player with the longest session',
    ],
    correctAnswer: 'The player who is in position',
    explanation: 'A range advantage combined with position allows for more aggressive value betting and bluffing.',
    tags: ['position', 'range_advantage', 'concept'],
  },
];

// ── Postflop pressure scenario templates ──────────────────────────────────────
export const PRESSURE_SCENARIOS: Array<{
  promptTemplate: string;
  correctAnswer: 'CALL' | 'FOLD';
  tags: string[];
  category: 'fold' | 'call';
}> = [
  {
    promptTemplate: 'You hold {weak_hand}. {board_desc}. Top pair but weak kicker. Villain bets 3/4 pot on the flop and barrels the turn. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'weak_kicker', 'multi_street'],
    category: 'fold',
  },
  {
    promptTemplate: 'You hold {small_pair} on a board of {high_board}. Villain opened UTG and continuation-bets 2/3 pot. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'underpair', 'cbet_fold'],
    category: 'fold',
  },
  {
    promptTemplate: 'You hold {draw_hand} (OESD). Villain fires a 2x pot overbet. You need to call {call_size} into a pot of {pot_size}. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'draw_math', 'overbet'],
    category: 'fold',
  },
  {
    promptTemplate: 'You hold {draw_hand}. You have an OESD on the flop. Pot is {small_pot}. Villain bets {small_bet}. What is the best action?',
    correctAnswer: 'CALL',
    tags: ['postflop', 'pressure', 'draw_correct_call', 'pot_odds'],
    category: 'call',
  },
  {
    promptTemplate: 'You hold {medium_pair} on board {wet_board}. Villain check-raised your flop bet to 3x. You have middle pair on a very coordinated board. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'check_raise', 'middle_pair'],
    category: 'fold',
  },
  {
    promptTemplate: 'You hold {set_hand} and flopped a set on a board of {board_with_low}. Villain leads the flop and continues with large bets on the turn. What is the best action?',
    correctAnswer: 'CALL',
    tags: ['postflop', 'pressure', 'set', 'correct_call'],
    category: 'call',
  },
  {
    promptTemplate: 'You hold {two_pair_hand} in a 3-bet pot. Board {two_pair_board}. You have top two pair. Villain bets 2/3 pot. What is the best action?',
    correctAnswer: 'CALL',
    tags: ['postflop', 'pressure', 'two_pair', 'correct_call'],
    category: 'call',
  },
  {
    promptTemplate: 'You hold {weak_hand}. Top pair on {dry_board}. Villain leads flop, turn, and river for large bets. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'three_street_value', 'weak_kicker'],
    category: 'fold',
  },
  {
    promptTemplate: 'You hold {top_pair_good_kicker}. Board {dry_board} rainbow. Top pair good kicker. Villain check-raises your flop bet to 3x. What is the best action?',
    correctAnswer: 'CALL',
    tags: ['postflop', 'pressure', 'top_pair', 'check_raise_call'],
    category: 'call',
  },
  {
    promptTemplate: 'You hold {medium_pair} on board {high_board}. You have an underpair. Villain leads all three streets. What is the best action?',
    correctAnswer: 'FOLD',
    tags: ['postflop', 'pressure', 'underpair', 'multi_street_fold'],
    category: 'fold',
  },
];
