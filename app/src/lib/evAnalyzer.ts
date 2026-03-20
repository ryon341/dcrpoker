// EV Analyzer — TC043
// Pure calculation utilities for pot odds, equity requirements, EV, and outs estimation.

// ─── Core Calculations ────────────────────────────────────────────────────────

/**
 * Required equity to break even on a call.
 * requiredEquity = callAmount / (potSize + callAmount)
 */
export function calculateRequiredEquity(potSize: number, callAmount: number): number {
  if (callAmount <= 0 || potSize + callAmount <= 0) return 0;
  return callAmount / (potSize + callAmount);
}

/**
 * EV of calling.
 * evCall = (equity * totalPotAfterCall) - ((1 - equity) * callAmount)
 */
export function calculateEvCall(potSize: number, callAmount: number, equityPct: number): number {
  const eq = equityPct / 100;
  const totalPot = potSize + callAmount;
  return eq * totalPot - (1 - eq) * callAmount;
}

/**
 * Pot odds as a decimal fraction.
 * potOdds = callAmount / (potSize + callAmount)
 * This equals requiredEquity; surfaced separately for display clarity.
 */
export function calculatePotOdds(potSize: number, callAmount: number): number {
  return calculateRequiredEquity(potSize, callAmount);
}

/**
 * Estimate equity from outs using the rule-of-4/2 approximation
 * or exact combinatorial formulas.
 * mode 'turn'       → 1 card to come  (outs / 47)
 * mode 'turn_river' → 2 cards to come (1 - ((47-outs)/47 * (46-outs)/46))
 */
export function estimateEquityFromOuts(outs: number, mode: 'turn' | 'turn_river'): number {
  if (outs <= 0) return 0;
  if (mode === 'turn') {
    return outs / 47;
  }
  // Exact two-card formula
  return 1 - ((47 - outs) / 47) * ((46 - outs) / 46);
}

/**
 * Quick pot-odds ratio string, e.g. "2:1".
 */
export function potOddsRatio(potSize: number, callAmount: number): string {
  if (callAmount <= 0) return '—';
  const ratio = potSize / callAmount;
  return `${ratio.toFixed(1)}:1`;
}

/**
 * Return a plain-language recommendation based on EV.
 */
export function getEvRecommendation(ev: number): {
  label: string;
  detail: string;
  positive: boolean | null;
} {
  if (ev > 5) {
    return {
      label: 'Profitable Call',
      detail: 'Calling has positive expected value. Continue unless strong read says fold.',
      positive: true,
    };
  }
  if (ev >= -5) {
    return {
      label: 'Marginal Spot',
      detail: 'EV is near zero. Exploitative reads, position, and blockers may tip the decision.',
      positive: null,
    };
  }
  return {
    label: 'Lean Fold',
    detail: 'Calling has negative expected value. Fold unless you have a strong exploitative reason.',
    positive: false,
  };
}

// ─── Quick Draw Presets ───────────────────────────────────────────────────────

export interface DrawPreset {
  label: string;
  outs: number;
}

export const DRAW_PRESETS: DrawPreset[] = [
  { label: 'Flush Draw',      outs: 9 },
  { label: 'OESD',            outs: 8 },
  { label: 'Combo Draw',      outs: 15 },
  { label: 'Gutshot',         outs: 4 },
  { label: 'Two Overcards',   outs: 6 },
  { label: 'Pair + Flush Draw', outs: 14 },
];

// ─── Hand Recorder integration shape ─────────────────────────────────────────
// Pass this object to prefill the EV Analyzer from a recorded hand.

export interface EvPrefill {
  potSize?: number;
  callAmount?: number;
  equityPct?: number;
  notes?: string;
}
