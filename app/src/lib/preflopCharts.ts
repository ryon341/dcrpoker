// Preflop Chart System — static opening range data (raise-first-in charts)
// All ranges represent recommended opens in an unopened pot (RFI).
// Action: 'raise' = open raise, 'fold' = do not enter pot.

export type Action = 'raise' | 'fold';
export type HandRange = Record<string, Action>;

export type GameType = 'cash' | 'tournament';
export type Players = '6max' | '9max';
export type Position = 'UTG' | 'MP' | 'CO' | 'BTN';
export type StackDepth = '20bb' | '40bb' | '100bb';

export interface ChartConfig {
  gameType: GameType;
  players: Players;
  position: Position;
  stack: StackDepth;
}

export interface ChartPreset {
  label: string;
  config: ChartConfig;
}

// ─── Hand key helpers ──────────────────────────────────────────────────────────
// Standard 13×13 matrix: rows/cols indexed A(0) → 2(12)
// row < col  →  suited   (upper triangle):  ranks[row]+ranks[col]+'s'
// row > col  →  offsuit  (lower triangle):  ranks[col]+ranks[row]+'o'  (higher rank first)
// row === col → pair:                        ranks[row]+ranks[row]

export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

export function getHandKey(row: number, col: number): string {
  if (row === col) return RANKS[row] + RANKS[row];
  if (row < col) return RANKS[row] + RANKS[col] + 's';
  return RANKS[col] + RANKS[row] + 'o';
}

// ─── Range builder ─────────────────────────────────────────────────────────────
function makeRange(raiseHands: ReadonlyArray<string>): HandRange {
  const raiseSet = new Set(raiseHands);
  const range: HandRange = {};
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const key = getHandKey(r, c);
      if (!(key in range)) {
        range[key] = raiseSet.has(key) ? 'raise' : 'fold';
      }
    }
  }
  return range;
}

// ─── 9-max  100bb ──────────────────────────────────────────────────────────────

const R_9MAX_100_UTG = makeRange([
  // Pairs 77+
  'AA','KK','QQ','JJ','TT','99','88','77',
  // All Ax suited
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  // Kx suited (broadway)
  'KQs','KJs','KTs',
  // Qx–Jx suited connectors
  'QJs','QTs','JTs',
  // Suited connectors
  'T9s','98s','87s','76s','65s',
  // Offsuit broadway
  'AKo','AQo','AJo','ATo','KQo',
]);

const R_9MAX_100_MP = makeRange([
  // Pairs 66+
  'AA','KK','QQ','JJ','TT','99','88','77','66',
  // All Ax suited
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  // Kx suited
  'KQs','KJs','KTs','K9s',
  // Qx–Jx suited
  'QJs','QTs','Q9s','JTs','J9s',
  // Suited connectors + one-gappers
  'T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s',
  // Offsuit broadway
  'AKo','AQo','AJo','ATo','KQo','KJo','QJo',
]);

const R_9MAX_100_CO = makeRange([
  // All pairs
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  // All Ax suited
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  // Kx suited
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
  // Qx–Jx suited
  'QJs','QTs','Q9s','Q8s','JTs','J9s','J8s',
  // Tx–9x suited
  'T9s','T8s','T7s','98s','97s','96s',
  // Lower suited connectors
  '87s','86s','85s','76s','75s','74s','65s','64s','54s','53s',
  // Offsuit
  'AKo','AQo','AJo','ATo','A9o',
  'KQo','KJo','KTo','K9o',
  'QJo','QTo','Q9o',
  'JTo','J9o','T9o',
]);

const R_9MAX_100_BTN = makeRange([
  // All pairs
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  // All Ax suited
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  // All Kx suited
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s',
  // Qx suited
  'QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s',
  // Jx suited
  'JTs','J9s','J8s','J7s','J6s',
  // Tx suited
  'T9s','T8s','T7s','T6s',
  // 9x suited
  '98s','97s','96s','95s',
  // Lower suited
  '87s','86s','85s','76s','75s','74s','65s','64s','63s','54s','53s','43s',
  // Offsuit
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o',
  'KQo','KJo','KTo','K9o','K8o','K7o',
  'QJo','QTo','Q9o','Q8o',
  'JTo','J9o','J8o',
  'T9o','T8o',
  '98o','97o','87o',
]);

// ─── 9-max  40bb ───────────────────────────────────────────────────────────────

const R_9MAX_40_UTG = makeRange([
  'AA','KK','QQ','JJ','TT','99','88',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','QJs','QTs','JTs',
  'T9s','98s','87s',
  'AKo','AQo','AJo','ATo','KQo',
]);

const R_9MAX_40_MP = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s',
  'QJs','QTs','Q9s','JTs','J9s',
  'T9s','T8s','98s','87s','76s',
  'AKo','AQo','AJo','ATo','KQo','KJo','QJo',
]);

const R_9MAX_40_CO = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s',
  'QJs','QTs','Q9s','Q8s','JTs','J9s','J8s',
  'T9s','T8s','T7s',
  '98s','97s','87s','86s','76s','65s','54s',
  'AKo','AQo','AJo','ATo','A9o',
  'KQo','KJo','KTo','K9o',
  'QJo','QTo','JTo','J9o','T9o',
]);

const R_9MAX_40_BTN = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s',
  'QJs','QTs','Q9s','Q8s','Q7s',
  'JTs','J9s','J8s','J7s',
  'T9s','T8s','T7s',
  '98s','97s','96s','87s','86s','76s','75s','65s','54s','43s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o',
  'KQo','KJo','KTo','K9o','K8o',
  'QJo','QTo','Q9o',
  'JTo','J9o','T9o','T8o',
  '98o','87o',
]);

// ─── 9-max  20bb ───────────────────────────────────────────────────────────────

const R_9MAX_20_UTG = makeRange([
  'AA','KK','QQ','JJ','TT','99','88',
  'AKs','AQs','AJs','ATs','A9s','A5s','A4s','A3s','A2s',
  'KQs','KJs','QJs','JTs',
  'AKo','AQo','AJo',
]);

const R_9MAX_20_MP = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77',
  'AKs','AQs','AJs','ATs','A9s','A8s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','QJs','JTs',
  'AKo','AQo','AJo','ATo','KQo',
]);

const R_9MAX_20_CO = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s',
  'QJs','QTs','Q9s','JTs','J9s',
  'T9s','98s','87s','76s',
  'AKo','AQo','AJo','ATo','A9o',
  'KQo','KJo','KTo','QJo',
]);

const R_9MAX_20_BTN = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s',
  'QJs','QTs','Q9s','Q8s',
  'JTs','J9s','J8s',
  'T9s','T8s',
  '98s','87s','76s','65s',
  'AKo','AQo','AJo','ATo','A9o','A8o',
  'KQo','KJo','KTo','K9o',
  'QJo','QTo','JTo','T9o',
]);

// ─── 6-max  100bb ──────────────────────────────────────────────────────────────
// 6-max ranges are wider than 9-max from the same position label.
// UTG in 6-max ≈ CO in 9-max; BTN is very wide (~65%).

const R_6MAX_100_UTG = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s',
  'QJs','QTs','Q9s','Q8s',
  'JTs','J9s','J8s',
  'T9s','T8s','T7s',
  '98s','97s','87s','86s','76s','75s','65s','64s','54s',
  'AKo','AQo','AJo','ATo','A9o',
  'KQo','KJo','KTo','K9o',
  'QJo','QTo','JTo',
]);

const R_6MAX_100_MP = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s',
  'QJs','QTs','Q9s','Q8s','Q7s',
  'JTs','J9s','J8s','J7s',
  'T9s','T8s','T7s','T6s',
  '98s','97s','96s','87s','86s','85s','76s','75s','65s','64s','54s','53s',
  'AKo','AQo','AJo','ATo','A9o','A8o',
  'KQo','KJo','KTo','K9o','K8o',
  'QJo','QTo','Q9o',
  'JTo','J9o','T9o',
]);

const R_6MAX_100_CO = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s',
  'QJs','QTs','Q9s','Q8s','Q7s','Q6s',
  'JTs','J9s','J8s','J7s','J6s',
  'T9s','T8s','T7s','T6s',
  '98s','97s','96s','95s','87s','86s','85s','76s','75s','74s','65s','64s','54s','53s','43s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o',
  'KQo','KJo','KTo','K9o','K8o','K7o','K6o',
  'QJo','QTo','Q9o','Q8o',
  'JTo','J9o','J8o',
  'T9o','T8o','T7o',
  '98o','97o','87o',
]);

const R_6MAX_100_BTN = makeRange([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s',
  'QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s','Q3s',
  'JTs','J9s','J8s','J7s','J6s','J5s','J4s',
  'T9s','T8s','T7s','T6s','T5s','T4s',
  '98s','97s','96s','95s','94s',
  '87s','86s','85s','84s','76s','75s','74s','65s','64s','63s','54s','53s','43s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o',
  'KQo','KJo','KTo','K9o','K8o','K7o','K6o','K5o',
  'QJo','QTo','Q9o','Q8o','Q7o',
  'JTo','J9o','J8o','J7o',
  'T9o','T8o','T7o',
  '98o','97o','96o','87o','86o','76o',
]);

// 6-max 40bb/20bb — use same 6-max 100bb ranges as reasonable approximation
const R_6MAX_40_UTG  = R_6MAX_100_UTG;
const R_6MAX_40_MP   = R_6MAX_100_MP;
const R_6MAX_40_CO   = R_6MAX_100_CO;
const R_6MAX_40_BTN  = R_6MAX_100_BTN;
const R_6MAX_20_UTG  = R_9MAX_20_UTG;
const R_6MAX_20_MP   = R_9MAX_20_MP;
const R_6MAX_20_CO   = R_9MAX_20_CO;
const R_6MAX_20_BTN  = R_9MAX_20_BTN;

// ─── Chart lookup ──────────────────────────────────────────────────────────────

const CHART_MAP: Record<string, HandRange> = {
  '9max_100bb_UTG': R_9MAX_100_UTG,
  '9max_100bb_MP':  R_9MAX_100_MP,
  '9max_100bb_CO':  R_9MAX_100_CO,
  '9max_100bb_BTN': R_9MAX_100_BTN,
  '9max_40bb_UTG':  R_9MAX_40_UTG,
  '9max_40bb_MP':   R_9MAX_40_MP,
  '9max_40bb_CO':   R_9MAX_40_CO,
  '9max_40bb_BTN':  R_9MAX_40_BTN,
  '9max_20bb_UTG':  R_9MAX_20_UTG,
  '9max_20bb_MP':   R_9MAX_20_MP,
  '9max_20bb_CO':   R_9MAX_20_CO,
  '9max_20bb_BTN':  R_9MAX_20_BTN,
  '6max_100bb_UTG': R_6MAX_100_UTG,
  '6max_100bb_MP':  R_6MAX_100_MP,
  '6max_100bb_CO':  R_6MAX_100_CO,
  '6max_100bb_BTN': R_6MAX_100_BTN,
  '6max_40bb_UTG':  R_6MAX_40_UTG,
  '6max_40bb_MP':   R_6MAX_40_MP,
  '6max_40bb_CO':   R_6MAX_40_CO,
  '6max_40bb_BTN':  R_6MAX_40_BTN,
  '6max_20bb_UTG':  R_6MAX_20_UTG,
  '6max_20bb_MP':   R_6MAX_20_MP,
  '6max_20bb_CO':   R_6MAX_20_CO,
  '6max_20bb_BTN':  R_6MAX_20_BTN,
};

export function getChart(config: ChartConfig): HandRange | null {
  // game type does not affect the range data for MVP
  const key = `${config.players}_${config.stack}_${config.position}`;
  return CHART_MAP[key] ?? null;
}

export function getRaisePercent(range: HandRange): number {
  const total = Object.keys(range).length;
  const raises = Object.values(range).filter(a => a === 'raise').length;
  return Math.round((raises / total) * 100);
}

// ─── Quick presets ─────────────────────────────────────────────────────────────

export const CHART_PRESETS: ChartPreset[] = [
  {
    label: 'Standard Cash 100bb',
    config: { gameType: 'cash', players: '9max', position: 'BTN', stack: '100bb' },
  },
  {
    label: 'Tournament 40bb',
    config: { gameType: 'tournament', players: '9max', position: 'CO', stack: '40bb' },
  },
  {
    label: 'Short Stack 20bb',
    config: { gameType: 'tournament', players: '9max', position: 'BTN', stack: '20bb' },
  },
  {
    label: '6-max BTN',
    config: { gameType: 'cash', players: '6max', position: 'BTN', stack: '100bb' },
  },
];

// ─── Position descriptions ─────────────────────────────────────────────────────

export const POSITION_NOTES: Record<Players, Record<Position, string>> = {
  '9max': {
    UTG: 'UTG 9-max: First to act with 8 players left. Play tight, premium hands only.',
    MP:  'MP 9-max: Slightly wider than UTG. Add suited-connectors and suited one-gappers.',
    CO:  'CO 9-max: Cutoff. One from the button — open wide and pressure the blinds.',
    BTN: 'BTN 9-max: Best seat at the table. Play your widest range and control the pot.',
  },
  '6max': {
    UTG: 'UTG 6-max (LJ): First to act with only 5 left. Wider range than 9-max UTG.',
    MP:  'MP 6-max (HJ): Hijack. Similar to CO in 9-max — moderately aggressive.',
    CO:  'CO 6-max: Cutoff. Open very wide; 3-bets from BTN/blinds are common.',
    BTN: 'BTN 6-max: Best position. Open extremely wide and attack the 2-player blinds.',
  },
};
