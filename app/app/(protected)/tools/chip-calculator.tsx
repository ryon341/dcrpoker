import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CashGameInputs,
  CashGameResult,
  TournamentInputs,
  TournamentResult,
  calculateCashGame,
  calculateTournament,
  DenomAllocation,
} from '../../../src/lib/chipCalculator';
import { CHIP_PRESETS } from '../../../src/lib/chipPresets';
import { ChipProduct, recommendChipSets, TIER_LABEL } from '../../../src/lib/gearData';

// ─── Chip Recommendations ────────────────────────────────────────────────────

function ChipRecommendations({ totalChips }: { totalChips: number }) {
  const products = recommendChipSets(totalChips);
  if (products.length === 0) return null;
  return (
    <View style={crStyles.wrap}>
      <Text style={crStyles.heading}>🛒 Recommended Chip Sets</Text>
      <Text style={crStyles.sub}>
        Based on your results ({totalChips.toLocaleString('en-US')} chips needed)
      </Text>
      {products.map((p: ChipProduct) => (
        <View key={p.id} style={crStyles.card}>
          <View style={crStyles.row}>
            <Text style={crStyles.name} numberOfLines={2}>{p.name}</Text>
            <View style={crStyles.tierTag}>
              <Text style={crStyles.tierText}>{TIER_LABEL[p.tier]}</Text>
            </View>
          </View>
          {p.ourPick ? (
            <View style={crStyles.badge}>
              <Text style={crStyles.badgeText}>{p.ourPick}</Text>
            </View>
          ) : null}
          <Text style={crStyles.desc} numberOfLines={2}>{p.description}</Text>
          <TouchableOpacity
            style={crStyles.btn}
            onPress={() => Linking.openURL(p.link).catch(() => {})}
            activeOpacity={0.8}
          >
            <Text style={crStyles.btnText}>View on Amazon  →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const crStyles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 8 },
  heading: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sub:     { color: '#888', fontSize: 12, marginBottom: 12 },
  card: {
    backgroundColor: '#0f1b35',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a3060',
  },
  row:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  name:     { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1 },
  tierTag:  { backgroundColor: '#16213e', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  tierText: { color: '#aaa', fontSize: 11 },
  badge:    { alignSelf: 'flex-start', backgroundColor: '#e94560', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 6 },
  badgeText:{ color: '#fff', fontSize: 11, fontWeight: 'bold' },
  desc:     { color: '#aaa', fontSize: 12, lineHeight: 17, marginBottom: 10 },
  btn:      { backgroundColor: '#16213e', borderRadius: 7, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  btnText:  { color: '#e94560', fontSize: 13, fontWeight: 'bold' },
});

type Mode = 'cash' | 'tournament';

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtDollars(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtChips(n: number) {
  return n.toLocaleString('en-US');
}
function fmtDenom(n: number) {
  if (n >= 1) return `$${n.toLocaleString('en-US')}`;
  return `${(n * 100).toFixed(0)}¢`;
}

// ─── small sub-components ────────────────────────────────────────────────────

function LabeledInput({
  label,
  value,
  onChange,
  keyboardType = 'numeric',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'numeric' | 'default';
  placeholder?: string;
}) {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder ?? ''}
        placeholderTextColor="#555"
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function DenomTable({ allocations }: { allocations: DenomAllocation[] }) {
  return (
    <View style={styles.denomTable}>
      <View style={styles.denomRow}>
        <Text style={[styles.denomCell, styles.denomCellHead]}>Denomination</Text>
        <Text style={[styles.denomCell, styles.denomCellHead, styles.denomCellRight]}>Chips</Text>
        <Text style={[styles.denomCell, styles.denomCellHead, styles.denomCellRight]}>Value</Text>
      </View>
      {allocations.map((a) => (
        <View key={a.denomination} style={styles.denomRow}>
          <Text style={styles.denomCell}>{fmtDenom(a.denomination)}</Text>
          <Text style={[styles.denomCell, styles.denomCellRight]}>{fmtChips(a.count)}</Text>
          <Text style={[styles.denomCell, styles.denomCellRight]}>{fmtDollars(a.value)}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Chip Calculator ─────────────────────────────────────────────────────────

export default function ChipCalculatorPage() {
  const [mode, setMode] = useState<Mode>('cash');

  // Cash inputs
  const [cashPlayers, setCashPlayers] = useState('6');
  const [cashBuyIn, setCashBuyIn] = useState('50');
  const [cashRebuys, setCashRebuys] = useState('1');
  const [cashDenoms, setCashDenoms] = useState('100,25,5,1');
  const [cashChipsPerPlayer, setCashChipsPerPlayer] = useState('40');
  const [cashBuffer, setCashBuffer] = useState('15');

  // Tournament inputs
  const [tournPlayers, setTournPlayers] = useState('10');
  const [tournStack, setTournStack] = useState('10000');
  const [tournReEntries, setTournReEntries] = useState('0');
  const [tournDenoms, setTournDenoms] = useState('5000,1000,500,100');
  const [tournChipsPerPlayer, setTournChipsPerPlayer] = useState('35');

  // Results
  const [cashResult, setCashResult] = useState<CashGameResult | null>(null);
  const [tournResult, setTournResult] = useState<TournamentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function parseDenoms(raw: string): number[] {
    return raw
      .split(/[,\s]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
  }

  function calculate() {
    setError(null);
    try {
      if (mode === 'cash') {
        const inputs: CashGameInputs = {
          players: parseInt(cashPlayers) || 0,
          avgBuyIn: parseFloat(cashBuyIn) || 0,
          rebuysPerPlayer: parseFloat(cashRebuys) || 0,
          denominations: parseDenoms(cashDenoms),
          chipsPerPlayer: parseInt(cashChipsPerPlayer) || 30,
          bufferPct: parseFloat(cashBuffer) || 0,
        };
        if (inputs.players < 1) { setError('Enter at least 1 player.'); return; }
        if (inputs.avgBuyIn <= 0) { setError('Buy-in must be greater than 0.'); return; }
        if (inputs.denominations.length === 0) { setError('Enter at least one chip denomination.'); return; }
        setCashResult(calculateCashGame(inputs));
      } else {
        const inputs: TournamentInputs = {
          players: parseInt(tournPlayers) || 0,
          startingStack: parseInt(tournStack) || 0,
          reEntries: parseInt(tournReEntries) || 0,
          denominations: parseDenoms(tournDenoms),
          chipsPerPlayer: parseInt(tournChipsPerPlayer) || 30,
        };
        if (inputs.players < 1) { setError('Enter at least 1 player.'); return; }
        if (inputs.startingStack <= 0) { setError('Starting stack must be greater than 0.'); return; }
        if (inputs.denominations.length === 0) { setError('Enter at least one chip denomination.'); return; }
        setTournResult(calculateTournament(inputs));
      }
    } catch {
      setError('Could not calculate. Check your inputs and try again.');
    }
  }

  function applyPreset(idx: number) {
    const preset = CHIP_PRESETS[idx];
    if (!preset) return;
    if (preset.mode === 'cash') {
      const { inputs } = preset;
      setMode('cash');
      setCashPlayers(String(inputs.players));
      setCashBuyIn(String(inputs.avgBuyIn));
      setCashRebuys(String(inputs.rebuysPerPlayer));
      setCashDenoms(inputs.denominations.join(','));
      setCashChipsPerPlayer(String(inputs.chipsPerPlayer));
      setCashBuffer(String(inputs.bufferPct));
    } else {
      const { inputs } = preset;
      setMode('tournament');
      setTournPlayers(String(inputs.players));
      setTournStack(String(inputs.startingStack));
      setTournReEntries(String(inputs.reEntries));
      setTournDenoms(inputs.denominations.join(','));
      setTournChipsPerPlayer(String(inputs.chipsPerPlayer));
    }
    setCashResult(null);
    setTournResult(null);
    setError(null);
  }

  const result = mode === 'cash' ? cashResult : tournResult;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.pageTitle}>Chip Calculator</Text>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'cash' && styles.modeBtnActive]}
          onPress={() => { setMode('cash'); setCashResult(null); setTournResult(null); setError(null); }}
        >
          <Text style={[styles.modeBtnText, mode === 'cash' && styles.modeBtnTextActive]}>Cash Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'tournament' && styles.modeBtnActive]}
          onPress={() => { setMode('tournament'); setCashResult(null); setTournResult(null); setError(null); }}
        >
          <Text style={[styles.modeBtnText, mode === 'tournament' && styles.modeBtnTextActive]}>Tournament</Text>
        </TouchableOpacity>
      </View>

      {/* Presets */}
      <SectionHeader title="Quick Presets" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll} contentContainerStyle={styles.presetRow}>
        {CHIP_PRESETS.filter(p => p.mode === mode).map((p, idx) => {
          const absoluteIdx = CHIP_PRESETS.indexOf(p);
          return (
            <TouchableOpacity key={idx} style={styles.presetChip} onPress={() => applyPreset(absoluteIdx)}>
              <Text style={styles.presetChipText}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Inputs */}
      <SectionHeader title="Settings" />
      <View style={styles.card}>
        {mode === 'cash' ? (
          <>
            <LabeledInput label="Players" value={cashPlayers} onChange={setCashPlayers} placeholder="6" />
            <LabeledInput label="Avg Buy-In ($)" value={cashBuyIn} onChange={setCashBuyIn} placeholder="50" />
            <LabeledInput label="Expected Rebuys / Player" value={cashRebuys} onChange={setCashRebuys} placeholder="1" />
            <LabeledInput
              label="Denominations (comma-separated)"
              value={cashDenoms}
              onChange={setCashDenoms}
              keyboardType="default"
              placeholder="100,25,5,1"
            />
            <LabeledInput label="Target Chips / Player" value={cashChipsPerPlayer} onChange={setCashChipsPerPlayer} placeholder="40" />
            <LabeledInput label="Reserve Buffer (%)" value={cashBuffer} onChange={setCashBuffer} placeholder="15" />
          </>
        ) : (
          <>
            <LabeledInput label="Players" value={tournPlayers} onChange={setTournPlayers} placeholder="10" />
            <LabeledInput label="Starting Stack" value={tournStack} onChange={setTournStack} placeholder="10000" />
            <LabeledInput label="Re-Entries (total)" value={tournReEntries} onChange={setTournReEntries} placeholder="0" />
            <LabeledInput
              label="Denominations (comma-separated)"
              value={tournDenoms}
              onChange={setTournDenoms}
              keyboardType="default"
              placeholder="5000,1000,500,100"
            />
            <LabeledInput label="Target Chips / Player" value={tournChipsPerPlayer} onChange={setTournChipsPerPlayer} placeholder="35" />
          </>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.calcButton} onPress={calculate}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>

      {/* Results */}
      {mode === 'cash' && cashResult ? (
        <View>
          <SectionHeader title="Results" />

          <View style={styles.card}>
            <Text style={styles.summaryLabel}>Total Bank Needed</Text>
            <Text style={styles.summaryValue}>{fmtDollars(cashResult.totalBankDollars)}</Text>
            <Text style={styles.summaryLabel}>Total Bank with Reserve</Text>
            <Text style={[styles.summaryValue, { color: '#e94560' }]}>{fmtDollars(cashResult.totalBankWithBuffer)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Starting Stack Per Player</Text>
            <Text style={styles.summaryLabel}>Chips: {fmtChips(cashResult.perPlayerStack.totalChips)} &nbsp;|&nbsp; Value: {fmtDollars(cashResult.perPlayerStack.totalValue)}</Text>
            <DenomTable allocations={cashResult.perPlayerStack.allocations} />
          </View>

          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Total Chips to Buy</Text>
            <Text style={styles.summaryLabel}>Incl. rebuys &amp; reserve buffer</Text>
            <DenomTable allocations={cashResult.totalChipsNeeded.allocations} />
            <Text style={[styles.summaryLabel, { marginTop: 8 }]}>
              Total chips: {fmtChips(cashResult.totalChipsNeeded.totalChips)}
            </Text>
          </View>

          {cashResult.reserve.totalChips > 0 && (
            <View style={styles.card}>
              <Text style={styles.subSectionTitle}>Reserve Chips</Text>
              <Text style={styles.summaryLabel}>Recommended buffer on top of rebuys</Text>
              <DenomTable allocations={cashResult.reserve.allocations} />
            </View>
          )}

          <Text style={styles.disclaimer}>
            Estimates are intended for home-game planning and may be adjusted based on your blind structure, rebuy habits, and preferred stack depth.
          </Text>

          <ChipRecommendations totalChips={cashResult.totalChipsNeeded.totalChips} />
        </View>
      ) : null}

      {mode === 'tournament' && tournResult ? (
        <View>
          <SectionHeader title="Results" />

          <View style={styles.card}>
            <Text style={styles.summaryLabel}>Total Tournament Stack Value</Text>
            <Text style={[styles.summaryValue, { color: '#e94560' }]}>
              {tournResult.totalTournamentValue.toLocaleString('en-US')}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Starting Stack Per Player</Text>
            <Text style={styles.summaryLabel}>Chips: {fmtChips(tournResult.perPlayerStack.totalChips)} &nbsp;|&nbsp; Value: {tournResult.perPlayerStack.totalValue.toLocaleString('en-US')}</Text>
            <DenomTable allocations={tournResult.perPlayerStack.allocations} />
          </View>

          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Total Chips to Buy</Text>
            <DenomTable allocations={tournResult.totalChipsNeeded.allocations} />
            <Text style={[styles.summaryLabel, { marginTop: 8 }]}>
              Total chips: {fmtChips(tournResult.totalChipsNeeded.totalChips)}
            </Text>
          </View>

          {tournResult.reEntryChips.totalChips > 0 && (
            <View style={styles.card}>
              <Text style={styles.subSectionTitle}>Re-Entry Chips</Text>
              <DenomTable allocations={tournResult.reEntryChips.allocations} />
            </View>
          )}

          <Text style={styles.disclaimer}>
            Estimates are intended for home-game planning and may be adjusted based on your blind structure, re-entry rules, and preferred stack depth.
          </Text>

          <ChipRecommendations totalChips={tournResult.totalChipsNeeded.totalChips} />
        </View>
      ) : null}
    </ScrollView>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 48 },

  pageTitle: {
    color: '#e94560',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 8,
  },

  // Mode toggle
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#e94560' },
  modeBtnText: { color: '#aaa', fontSize: 15, fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },

  // Presets
  presetScroll: { marginBottom: 24 },
  presetRow: { gap: 8, paddingRight: 8 },
  presetChip: {
    backgroundColor: '#0f3460',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  presetChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Section headers
  sectionHeader: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // Card
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },

  // Inputs
  inputRow: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#0f1b35',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  // Error
  errorText: {
    color: '#e94560',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -4,
  },

  // Calculate button
  calcButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  calcButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  // Results
  summaryLabel: { color: '#aaa', fontSize: 13, marginBottom: 2 },
  summaryValue: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  subSectionTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },

  // Denomination table
  denomTable: { marginTop: 6 },
  denomRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  denomCell: { flex: 1, color: '#ccc', fontSize: 14 },
  denomCellHead: { color: '#888', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  denomCellRight: { textAlign: 'right' },

  // Disclaimer
  disclaimer: {
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
