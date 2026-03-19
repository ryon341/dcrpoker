// Poker Chip Calculator — deterministic utility functions
// All values in whole dollars (not cents) for simplicity.

export interface DenomAllocation {
  denomination: number;
  count: number;
  value: number;
}

export interface CashGameInputs {
  players: number;
  avgBuyIn: number;       // dollars
  rebuysPerPlayer: number; // expected rebuys per player
  denominations: number[]; // chip values in dollars
  chipsPerPlayer: number;  // preferred chip count per player
  bufferPct: number;       // reserve buffer %
}

export interface TournamentInputs {
  players: number;
  startingStack: number;  // chip value (not dollars)
  reEntries: number;      // total re-entries expected
  denominations: number[]; // chip values
  chipsPerPlayer: number;  // preferred chip count per player
}

export interface StackComposition {
  allocations: DenomAllocation[];
  totalChips: number;
  totalValue: number;
}

export interface CashGameResult {
  totalBankDollars: number;
  totalBankWithBuffer: number;
  perPlayerStack: StackComposition;
  totalChipsNeeded: StackComposition;
  reserve: StackComposition;
}

export interface TournamentResult {
  totalTournamentValue: number;
  perPlayerStack: StackComposition;
  totalChipsNeeded: StackComposition;
  reEntryChips: StackComposition;
}

/**
 * Builds a starting stack composition for a given target value.
 * Distributes chips across denominations using a doubling-weight heuristic:
 * lower denominations get proportionally more chips.
 */
function buildStack(
  targetValue: number,
  denominations: number[],
  chipsPerPlayer: number,
): StackComposition {
  const sortedDesc = [...denominations].filter(d => d > 0).sort((a, b) => b - a);
  if (sortedDesc.length === 0) {
    return { allocations: [], totalChips: 0, totalValue: 0 };
  }
  if (sortedDesc.length === 1) {
    const count = Math.max(1, Math.round(targetValue / sortedDesc[0]));
    return {
      allocations: [{ denomination: sortedDesc[0], count, value: count * sortedDesc[0] }],
      totalChips: count,
      totalValue: count * sortedDesc[0],
    };
  }

  // Assign base chip weights: each lower denomination gets 2x the chips of the one above it.
  // e.g. 4 denoms → weights [1, 2, 4, 8] (index 0 = highest denom)
  const baseWeights = sortedDesc.map((_, i) => Math.pow(2, i));
  const totalWeight = baseWeights.reduce((a, b) => a + b, 0);

  // Scale weights to chipsPerPlayer
  let counts = baseWeights.map(w => Math.max(1, Math.round((w / totalWeight) * chipsPerPlayer)));

  // Calculate resulting value from all denoms except the lowest
  const lowestIdx = sortedDesc.length - 1;
  const lowestDenom = sortedDesc[lowestIdx];
  let fixedValue = 0;
  for (let i = 0; i < lowestIdx; i++) {
    fixedValue += sortedDesc[i] * counts[i];
  }

  // Assign lowest denomination chips to make up the remaining value
  const remaining = targetValue - fixedValue;
  counts[lowestIdx] = remaining > 0 ? Math.max(1, Math.round(remaining / lowestDenom)) : 1;

  const allocations: DenomAllocation[] = sortedDesc.map((denom, i) => ({
    denomination: denom,
    count: counts[i],
    value: counts[i] * denom,
  }));

  const totalChips = counts.reduce((a, b) => a + b, 0);
  const totalValue = allocations.reduce((a, al) => a + al.value, 0);

  return { allocations, totalChips, totalValue };
}

/**
 * Scale a StackComposition by a multiplier (round up counts).
 */
function scaleStack(stack: StackComposition, multiplier: number): StackComposition {
  const allocations = stack.allocations.map(a => {
    const count = Math.ceil(a.count * multiplier);
    return { denomination: a.denomination, count, value: count * a.denomination };
  });
  return {
    allocations,
    totalChips: allocations.reduce((s, a) => s + a.count, 0),
    totalValue: allocations.reduce((s, a) => s + a.value, 0),
  };
}

export function calculateCashGame(inputs: CashGameInputs): CashGameResult {
  const { players, avgBuyIn, rebuysPerPlayer, denominations, chipsPerPlayer, bufferPct } = inputs;

  const totalBankDollars = players * avgBuyIn * (1 + rebuysPerPlayer);
  const bufferMultiplier = 1 + bufferPct / 100;
  const totalBankWithBuffer = totalBankDollars * bufferMultiplier;

  // Per-player starting stack
  const perPlayerStack = buildStack(avgBuyIn, denominations, chipsPerPlayer);

  // Total chips needed = per-player chips × players × (1 + rebuys) × buffer, rounded up
  const totalMultiplier = players * (1 + rebuysPerPlayer) * bufferMultiplier;
  const totalChipsNeeded = scaleStack(perPlayerStack, totalMultiplier * (avgBuyIn / (perPlayerStack.totalValue || avgBuyIn)));

  // Reserve = buffer portion only
  const reserveMultiplier = players * (1 + rebuysPerPlayer) * (bufferPct / 100);
  const reserve = reserveMultiplier > 0
    ? scaleStack(perPlayerStack, reserveMultiplier)
    : { allocations: perPlayerStack.allocations.map(a => ({ ...a, count: 0, value: 0 })), totalChips: 0, totalValue: 0 };

  return { totalBankDollars, totalBankWithBuffer, perPlayerStack, totalChipsNeeded, reserve };
}

export function calculateTournament(inputs: TournamentInputs): TournamentResult {
  const { players, startingStack, reEntries, denominations, chipsPerPlayer } = inputs;

  const totalTournamentValue = players * startingStack + reEntries * startingStack;

  // Per-player starting stack (chip values, not dollars)
  const perPlayerStack = buildStack(startingStack, denominations, chipsPerPlayer);

  // Re-entry chips
  const reEntryChips = reEntries > 0
    ? scaleStack(perPlayerStack, reEntries)
    : { allocations: perPlayerStack.allocations.map(a => ({ ...a, count: 0, value: 0 })), totalChips: 0, totalValue: 0 };

  // Total chips
  const totalChipsNeeded = scaleStack(perPlayerStack, players + reEntries);

  return { totalTournamentValue, perPlayerStack, totalChipsNeeded, reEntryChips };
}
