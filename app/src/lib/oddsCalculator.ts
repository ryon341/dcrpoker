// Odds & Outs Calculator — exact probability formulas (Rule of 2/4 approximation also provided)

export interface OddsResult {
  outs: number;
  turnPct: number;      // % chance to hit on the turn (1 card)
  riverPct: number;     // % chance to hit by the river (turn OR river)
  turnApprox: number;   // Rule-of-2 approximation
  riverApprox: number;  // Rule-of-4 approximation
  strength: 'strong' | 'medium' | 'weak';
  guidance: string;
}

export function calculateOdds(outs: number): OddsResult {
  const clamped = Math.max(0, Math.min(outs, 46));

  // Exact formulas
  const turnPct   = (clamped / 47) * 100;
  const riverPct  = (1 - ((47 - clamped) / 47) * ((46 - clamped) / 46)) * 100;

  // Rule of 2 & 4 approximations
  const turnApprox  = clamped * 2;
  const riverApprox = clamped * 4;

  let strength: OddsResult['strength'];
  let guidance: string;

  if (riverPct >= 30) {
    strength = 'strong';
    guidance = 'Strong draw — aggressive play is often viable. Consider raising or semi-bluffing.';
  } else if (riverPct >= 15) {
    strength = 'medium';
    guidance = 'Marginal draw — check pot odds before calling. Worth continuing if the price is right.';
  } else {
    strength = 'weak';
    guidance = 'Weak draw — proceed cautiously. Only continue with very favorable pot odds.';
  }

  return {
    outs: clamped,
    turnPct:  Math.round(turnPct * 10) / 10,
    riverPct: Math.round(riverPct * 10) / 10,
    turnApprox,
    riverApprox,
    strength,
    guidance,
  };
}

// ─── Predefined draw types ─────────────────────────────────────────────────────

export interface DrawType {
  id: string;
  label: string;
  description: string;
  outs: number;
}

export const DRAW_TYPES: DrawType[] = [
  { id: 'flush',     label: 'Flush Draw',              description: '9 suited cards remaining',                outs: 9  },
  { id: 'oesd',      label: 'Open-Ended Straight',     description: '8 cards complete the straight',           outs: 8  },
  { id: 'overcards', label: 'Two Overcards',           description: '~6 outs to pair either card',             outs: 6  },
  { id: 'gutshot',   label: 'Gutshot Straight',        description: '4 cards fill the inside straight',        outs: 4  },
  { id: 'set',       label: 'Set → Full House / Quads',description: '~10 outs (full house or quads)',          outs: 10 },
  { id: 'combo',     label: 'Combo Draw',              description: 'Flush + straight — typically 12–15 outs', outs: 15 },
  { id: 'pair',      label: 'One Pair → Two Pair / Trips', description: '5 outs to improve',                 outs: 5  },
  { id: 'backdoor',  label: 'Backdoor Flush Draw',     description: '~1–2 outs equity added per street',       outs: 2  },
];
