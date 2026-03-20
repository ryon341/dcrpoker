import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  calculateEvCall,
  calculatePotOdds,
  calculateRequiredEquity,
  DRAW_PRESETS,
  estimateEquityFromOuts,
  getEvRecommendation,
  potOddsRatio,
} from '../../../src/lib/evAnalyzer';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnalyzerMode = 'equity' | 'outs';
type OutsMode     = 'turn' | 'turn_river';

// ─── Small helpers ────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 1) {
  return n.toFixed(decimals);
}

function pct(n: number) {
  return `${fmt(n * 100)}%`;
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={s.fieldLabel}>{text}</Text>;
}

function NumInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <View style={s.inputRow}>
      <TextInput
        style={[s.input, suffix ? s.inputWithSuffix : undefined]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#555"
        keyboardType="decimal-pad"
      />
      {suffix ? <Text style={s.inputSuffix}>{suffix}</Text> : null}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EvAnalyzer() {
  const params = useLocalSearchParams<{
    handId?: string;
    heroHand?: string;
    position?: string;
    stackDepthBb?: string;
    gameType?: string;
    stakes?: string;
  }>();

  const [mode, setMode] = useState<AnalyzerMode>('equity');

  // Shared inputs
  const [potSize,    setPotSize]    = useState('');
  const [callAmount, setCallAmount] = useState('');

  // Mode A — Direct equity
  const [equityPct, setEquityPct] = useState('');

  // Mode B — Outs
  const [outs,         setOuts]         = useState('');
  const [outsMode,     setOutsMode]     = useState<OutsMode>('turn_river');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const selectPreset = useCallback((label: string, outCount: number) => {
    setOuts(String(outCount));
    setActivePreset(label);
  }, []);

  // ── Derived calculations ─────────────────────────────────────────────────

  const results = useMemo(() => {
    const pot  = parseFloat(potSize);
    const call = parseFloat(callAmount);

    if (!pot || pot <= 0 || !call || call <= 0) return null;

    const reqEq     = calculateRequiredEquity(pot, call);
    const potOdds   = calculatePotOdds(pot, call);
    const oddsRatio = potOddsRatio(pot, call);

    let effectiveEquity: number | null = null;

    if (mode === 'equity') {
      const eq = parseFloat(equityPct);
      if (!isNaN(eq) && eq >= 0 && eq <= 100) {
        effectiveEquity = eq;
      }
    } else {
      const o = parseInt(outs, 10);
      if (!isNaN(o) && o > 0) {
        effectiveEquity = estimateEquityFromOuts(o, outsMode) * 100;
      }
    }

    if (effectiveEquity === null) {
      return { reqEq, potOdds, oddsRatio, effectiveEquity: null, ev: null, rec: null };
    }

    const ev  = calculateEvCall(pot, call, effectiveEquity);
    const rec = getEvRecommendation(ev);
    return { reqEq, potOdds, oddsRatio, effectiveEquity, ev, rec };
  }, [potSize, callAmount, equityPct, outs, outsMode, mode]);

  const recColor = results?.rec
    ? results.rec.positive === true  ? '#2e7d32'
    : results.rec.positive === false ? '#c62828'
    : '#e65100'
    : '#555';

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Text style={s.heading}>EV Analyzer</Text>
        <Text style={s.sub}>Calculate pot odds, required equity, and expected value.</Text>

        {/* Context banner from Hand Recorder */}
        {params.heroHand ? (
          <View style={s.contextBanner}>
            <Text style={s.contextTitle}>Studying: {params.heroHand}</Text>
            {!!(params.position || params.stakes || params.stackDepthBb) && (
              <Text style={s.contextMeta}>
                {[params.position, params.stakes, params.stackDepthBb ? `${params.stackDepthBb}bb` : ''].filter(Boolean).join(' · ')}
              </Text>
            )}
          </View>
        ) : null}

        {/* Mode toggle */}
        <View style={s.modeRow}>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'equity' && s.modeBtnActive]}
            onPress={() => setMode('equity')}
            activeOpacity={0.8}
          >
            <Text style={[s.modeBtnText, mode === 'equity' && s.modeBtnTextActive]}>
              Direct Equity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'outs' && s.modeBtnActive]}
            onPress={() => setMode('outs')}
            activeOpacity={0.8}
          >
            <Text style={[s.modeBtnText, mode === 'outs' && s.modeBtnTextActive]}>
              Outs Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Inputs</Text>

          <FieldLabel text="Pot Size ($)" />
          <NumInput value={potSize} onChange={setPotSize} placeholder="e.g. 100" />

          <FieldLabel text="Amount to Call ($)" />
          <NumInput value={callAmount} onChange={setCallAmount} placeholder="e.g. 50" />

          {mode === 'equity' ? (
            <>
              <FieldLabel text="Your Equity (%)" />
              <NumInput value={equityPct} onChange={setEquityPct} placeholder="e.g. 35" suffix="%" />
            </>
          ) : (
            <>
              <FieldLabel text="Number of Outs" />
              <NumInput value={outs} onChange={v => { setOuts(v); setActivePreset(null); }} placeholder="e.g. 9" />

              <FieldLabel text="Cards to Come" />
              <View style={s.toggleRow}>
                {(['turn_river', 'turn'] as OutsMode[]).map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[s.toggleBtn, outsMode === m && s.toggleBtnActive]}
                    onPress={() => setOutsMode(m)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.toggleBtnText, outsMode === m && s.toggleBtnTextActive]}>
                      {m === 'turn_river' ? 'Turn + River' : 'Turn Only'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Quick Draw Presets */}
              <Text style={s.presetsLabel}>QUICK PRESETS</Text>
              <View style={s.presetsRow}>
                {DRAW_PRESETS.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={[s.presetChip, activePreset === p.label && s.presetChipActive]}
                    onPress={() => selectPreset(p.label, p.outs)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.presetChipText, activePreset === p.label && s.presetChipTextActive]}>
                      {p.label}
                    </Text>
                    <Text style={[s.presetChipOuts, activePreset === p.label && s.presetChipOutsActive]}>
                      {p.outs} outs
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Results */}
        {results && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Results</Text>

            <View style={s.resultGrid}>
              <View style={s.resultCell}>
                <Text style={s.resultCellLabel}>Pot Odds</Text>
                <Text style={s.resultCellValue}>{pct(results.potOdds)}</Text>
                <Text style={s.resultCellSub}>{results.oddsRatio}</Text>
              </View>
              <View style={s.resultCell}>
                <Text style={s.resultCellLabel}>Required Equity</Text>
                <Text style={s.resultCellValue}>{pct(results.reqEq)}</Text>
              </View>
              {results.effectiveEquity !== null && (
                <View style={s.resultCell}>
                  <Text style={s.resultCellLabel}>
                    {mode === 'outs' ? 'Est. Equity' : 'Your Equity'}
                  </Text>
                  <Text style={[
                    s.resultCellValue,
                    { color: results.effectiveEquity / 100 >= results.reqEq ? '#4caf50' : '#ef5350' },
                  ]}>
                    {fmt(results.effectiveEquity)}%
                  </Text>
                </View>
              )}
              {results.ev !== null && (
                <View style={s.resultCell}>
                  <Text style={s.resultCellLabel}>EV of Call</Text>
                  <Text style={[s.resultCellValue, { color: results.ev >= 0 ? '#4caf50' : '#ef5350' }]}>
                    {results.ev >= 0 ? '+' : ''}{fmt(results.ev, 2)}
                  </Text>
                </View>
              )}
            </View>

            {results.rec && (
              <View style={[s.recBox, { borderColor: recColor }]}>
                <Text style={[s.recLabel, { color: recColor }]}>{results.rec.label}</Text>
                <Text style={s.recDetail}>{results.rec.detail}</Text>
              </View>
            )}

            {!results.effectiveEquity && !results.ev && (
              <Text style={s.hintText}>
                {mode === 'equity'
                  ? 'Enter your estimated equity % to see EV.'
                  : 'Enter your outs (or select a preset) to see EV.'}
              </Text>
            )}
          </View>
        )}

        {!results && (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Enter pot size and call amount above to get started.</Text>
          </View>
        )}

        {/* Formula explainer */}
        <View style={s.formulaCard}>
          <Text style={s.formulaTitle}>How it works</Text>
          <Text style={s.formulaLine}>
            <Text style={s.formulaBold}>Required Equity</Text> = Call ÷ (Pot + Call)
          </Text>
          <Text style={s.formulaLine}>
            <Text style={s.formulaBold}>EV of Call</Text> = (Equity × Total Pot) − ((1 − Equity) × Call)
          </Text>
          <Text style={s.formulaLine}>
            <Text style={s.formulaBold}>Outs (turn+river)</Text> = 1 − ((47−n)/47 × (46−n)/46)
          </Text>
          <Text style={s.formulaLine}>
            <Text style={s.formulaBold}>Outs (turn only)</Text> = n ÷ 47
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 60 },

  heading: { color: '#e94560', fontSize: 26, fontWeight: 'bold', marginBottom: 4, marginTop: 8 },
  sub:     { color: '#aaa', fontSize: 14, marginBottom: 20 },

  // Mode toggle
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#0f1b35',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  modeBtnActive:     { backgroundColor: '#e94560' },
  modeBtnText:       { color: '#888', fontSize: 14, fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },

  // Card
  card: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 14 },

  // Field label
  fieldLabel: { color: '#777', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6, marginTop: 14 },

  // Inputs
  inputRow:       { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#0f1b35',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  inputWithSuffix: { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 },
  inputSuffix: {
    backgroundColor: '#0f1b35',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#2a2a4a',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#888',
    fontSize: 15,
  },

  // Cards to come toggle
  toggleRow:           { flexDirection: 'row', gap: 10, marginTop: 6 },
  toggleBtn:           { flex: 1, backgroundColor: '#0f1b35', borderRadius: 8, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  toggleBtnActive:     { backgroundColor: '#e94560', borderColor: '#e94560' },
  toggleBtnText:       { color: '#888', fontSize: 13, fontWeight: '600' },
  toggleBtnTextActive: { color: '#fff' },

  // Presets
  presetsLabel:       { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7, marginTop: 18, marginBottom: 8 },
  presetsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip:         { backgroundColor: '#0f1b35', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center' },
  presetChipActive:   { backgroundColor: '#162d67', borderColor: '#3860c0' },
  presetChipText:     { color: '#aaa', fontSize: 12, fontWeight: '600' },
  presetChipTextActive: { color: '#fff' },
  presetChipOuts:     { color: '#555', fontSize: 10, marginTop: 2 },
  presetChipOutsActive: { color: '#88aaff' },

  // Results grid
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  resultCell: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: '#0f1b35',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  resultCellLabel: { color: '#666', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  resultCellValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  resultCellSub:   { color: '#888', fontSize: 11, marginTop: 2 },

  // Recommendation box
  recBox: {
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 14,
    backgroundColor: '#0a0f20',
  },
  recLabel:  { fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  recDetail: { color: '#ccc', fontSize: 13, lineHeight: 19, textAlign: 'center' },

  hintText: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 8 },

  // Empty
  emptyCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    marginBottom: 18,
  },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Formula explainer
  formulaCard: {
    backgroundColor: '#0d1527',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2a50',
  },
  formulaTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  formulaLine:  { color: '#777', fontSize: 12, lineHeight: 20, marginBottom: 4 },
  formulaBold:  { color: '#aaa', fontWeight: 'bold' },

  // Context banner
  contextBanner: { backgroundColor: '#0f1b35', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1a3060', borderLeftWidth: 3, borderLeftColor: '#e94560' },
  contextTitle:  { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  contextMeta:   { color: '#888', fontSize: 12, marginTop: 2 },
});
