import { CashGameInputs, TournamentInputs } from './chipCalculator';

export type PresetMode = 'cash' | 'tournament';

export interface CashPreset {
  mode: 'cash';
  label: string;
  inputs: CashGameInputs;
}

export interface TournamentPreset {
  mode: 'tournament';
  label: string;
  inputs: TournamentInputs;
}

export type ChipPreset = CashPreset | TournamentPreset;

export const CHIP_PRESETS: ChipPreset[] = [
  {
    mode: 'cash',
    label: 'Cash — Low Stakes',
    inputs: {
      players: 4,
      avgBuyIn: 20,
      rebuysPerPlayer: 1,
      denominations: [25, 10, 5, 1],
      chipsPerPlayer: 30,
      bufferPct: 10,
    },
  },
  {
    mode: 'cash',
    label: 'Cash — Standard Home Game',
    inputs: {
      players: 6,
      avgBuyIn: 50,
      rebuysPerPlayer: 1,
      denominations: [100, 25, 5, 1],
      chipsPerPlayer: 40,
      bufferPct: 15,
    },
  },
  {
    mode: 'cash',
    label: 'Cash — Higher Stakes',
    inputs: {
      players: 8,
      avgBuyIn: 200,
      rebuysPerPlayer: 2,
      denominations: [500, 100, 25, 5],
      chipsPerPlayer: 35,
      bufferPct: 20,
    },
  },
  {
    mode: 'tournament',
    label: 'Tournament — Small Home Game',
    inputs: {
      players: 8,
      startingStack: 5000,
      reEntries: 0,
      denominations: [1000, 500, 100, 25],
      chipsPerPlayer: 30,
    },
  },
  {
    mode: 'tournament',
    label: 'Tournament — Deep Stack',
    inputs: {
      players: 10,
      startingStack: 10000,
      reEntries: 5,
      denominations: [5000, 1000, 500, 100],
      chipsPerPlayer: 40,
    },
  },
];
