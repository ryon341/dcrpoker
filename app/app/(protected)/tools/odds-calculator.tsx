import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { calculateOdds, DRAW_TYPES, DrawType } from '../../../src/lib/oddsCalculator';

// ─── strength colours ─────────────────────────────────────────────────────────

const STRENGTH_COLOR = {
  strong: '#2e7d32',
  medium: '#e65100',
  weak:   '#c62828',
} as const;

const STRENGTH_LABEL = {
  strong: 'Strong Draw',
  medium: 'Marginal Draw',
  weak:   'Weak Draw',
} as const;

// ─── Outs stepper ─────────────────────────────────────────────────────────────

function OutsStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  function step(delta: number) {
    onChange(Math.max(1, Math.min(20, value + delta)));
  }
  return (
    <View style={sp.row}>
      <TouchableOpacity style={sp.btn} onPress={() => step(-1)} activeOpacity={0.7}>
        <Text style={sp.btnText}>−</Text>
      </TouchableOpacity>
      <View style={sp.display}>
        <Text style={sp.value}>{value}</Text>
        <Text style={sp.unit}>outs</Text>
      </View>
      <TouchableOpacity style={sp.btn} onPress={() => step(1)} activeOpacity={0.7}>
        <Text style={sp.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const sp = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginVertical: 8 },
  btn:     { backgroundColor: '#0f3460', borderRadius: 10, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 28, fontWeight: 'bold', lineHeight: 30 },
  display: { alignItems: 'center', minWidth: 72 },
  value:   { color: '#fff', fontSize: 40, fontWeight: 'bold', lineHeight: 44 },
  unit:    { color: '#888', fontSize: 13 },
});

// ─── Quick count row (1–20 bubbles) ──────────────────────────────────────────

function OutsBubbles({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ob.row}>
      {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
        <TouchableOpacity
          key={n}
          style={[ob.bubble, value === n && ob.bubbleActive]}
          onPress={() => onChange(n)}
          activeOpacity={0.7}
        >
          <Text style={[ob.bubbleText, value === n && ob.bubbleTextActive]}>{n}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const ob = StyleSheet.create({
  row:             { gap: 7, paddingVertical: 8, paddingHorizontal: 2 },
  bubble:          { width: 38, height: 38, borderRadius: 19, backgroundColor: '#0f1b35', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  bubbleActive:    { backgroundColor: '#e94560', borderColor: '#e94560' },
  bubbleText:      { color: '#aaa', fontSize: 13, fontWeight: '600' },
  bubbleTextActive:{ color: '#fff' },
});

// ─── DrawType selector ───────────────────────────────────────────────────────

function DrawSelector({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (draw: DrawType) => void;
}) {
  return (
    <View style={ds.grid}>
      {DRAW_TYPES.map(d => (
        <TouchableOpacity
          key={d.id}
          style={[ds.card, selected === d.id && ds.cardActive]}
          onPress={() => onSelect(d)}
          activeOpacity={0.75}
        >
          <Text style={[ds.label, selected === d.id && ds.labelActive]}>{d.label}</Text>
          <Text style={ds.outs}>{d.outs} outs</Text>
          <Text style={ds.desc}>{d.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ds = StyleSheet.create({
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:       { backgroundColor: '#0f1b35', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#2a2a4a', width: '47%' },
  cardActive: { borderColor: '#e94560', backgroundColor: '#1c0a12' },
  label:      { color: '#ccc', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  labelActive:{ color: '#e94560' },
  outs:       { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  desc:       { color: '#666', fontSize: 11, lineHeight: 15 },
});

// ─── Results card ─────────────────────────────────────────────────────────────

function OddsResults({ outs }: { outs: number }) {
  const result = useMemo(() => calculateOdds(outs), [outs]);

  return (
    <View style={res.card}>
      {/* Big numbers */}
      <View style={res.statsRow}>
        <View style={res.stat}>
          <Text style={res.statValue}>{result.outs}</Text>
          <Text style={res.statLabel}>Outs</Text>
        </View>
        <View style={res.divider} />
        <View style={res.stat}>
          <Text style={res.statValue}>{result.turnPct}%</Text>
          <Text style={res.statLabel}>Turn</Text>
        </View>
        <View style={res.divider} />
        <View style={res.stat}>
          <Text style={[res.statValue, { color: '#e94560' }]}>{result.riverPct}%</Text>
          <Text style={res.statLabel}>By River</Text>
        </View>
      </View>

      {/* Strength badge */}
      <View style={[res.strengthBadge, { backgroundColor: STRENGTH_COLOR[result.strength] }]}>
        <Text style={res.strengthText}>{STRENGTH_LABEL[result.strength]}</Text>
      </View>

      {/* Guidance */}
      <Text style={res.guidance}>{result.guidance}</Text>

      {/* Rule of 2/4 row */}
      <View style={res.approxRow}>
        <Text style={res.approxLabel}>Rule of 2/4 estimate: </Text>
        <Text style={res.approxValue}>~{result.turnApprox}% turn · ~{result.riverApprox}% river</Text>
      </View>
    </View>
  );
}

const res = StyleSheet.create({
  card:          { backgroundColor: '#16213e', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  statsRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
  stat:          { alignItems: 'center', flex: 1 },
  statValue:     { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  statLabel:     { color: '#888', fontSize: 12, marginTop: 2 },
  divider:       { width: 1, height: 40, backgroundColor: '#2a2a4a' },
  strengthBadge: { borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'stretch', alignItems: 'center', marginBottom: 12 },
  strengthText:  { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  guidance:      { color: '#ccc', fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 12 },
  approxRow:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  approxLabel:   { color: '#666', fontSize: 12 },
  approxValue:   { color: '#888', fontSize: 12 },
});

// ─── Main page ────────────────────────────────────────────────────────────────

type Mode = 'quick' | 'manual';

export default function OddsCalculatorPage() {
  const [mode, setMode] = useState<Mode>('quick');
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(DRAW_TYPES[0].id);
  const [manualOuts, setManualOuts] = useState(9);

  function handleDrawSelect(draw: DrawType) {
    setSelectedDrawId(draw.id);
  }

  const activeOuts = mode === 'quick'
    ? (DRAW_TYPES.find(d => d.id === selectedDrawId)?.outs ?? 0)
    : manualOuts;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.pageTitle}>Odds & Outs</Text>

      {/* Mode toggle */}
      <View style={s.modeRow}>
        <TouchableOpacity
          style={[s.modeBtn, mode === 'quick' && s.modeBtnActive]}
          onPress={() => setMode('quick')}
        >
          <Text style={[s.modeBtnText, mode === 'quick' && s.modeBtnTextActive]}>Quick Select</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.modeBtn, mode === 'manual' && s.modeBtnActive]}
          onPress={() => setMode('manual')}
        >
          <Text style={[s.modeBtnText, mode === 'manual' && s.modeBtnTextActive]}>Manual Outs</Text>
        </TouchableOpacity>
      </View>

      {/* Results always visible */}
      <OddsResults outs={activeOuts} />

      {/* Quick mode: draw selector */}
      {mode === 'quick' && (
        <View>
          <Text style={s.sectionLabel}>Select Draw Type</Text>
          <DrawSelector selected={selectedDrawId} onSelect={handleDrawSelect} />
        </View>
      )}

      {/* Manual mode: stepper + bubbles */}
      {mode === 'manual' && (
        <View style={s.card}>
          <Text style={s.sectionLabel}>Number of Outs</Text>
          <OutsStepper value={manualOuts} onChange={setManualOuts} />
          <Text style={[s.sectionLabel, { marginTop: 16 }]}>Tap to set</Text>
          <OutsBubbles value={manualOuts} onChange={setManualOuts} />
        </View>
      )}

      <Text style={s.disclaimer}>
        Calculations assume a standard 52-card deck with 2 cards in hand and 3 on the flop (47 unseen cards). Estimates are for home-game reference only.
      </Text>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 48 },

  pageTitle: {
    color: '#e94560',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 8,
  },

  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn:         { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modeBtnActive:   { backgroundColor: '#e94560' },
  modeBtnText:     { color: '#aaa', fontSize: 15, fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },

  sectionLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },

  disclaimer: {
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 24,
  },
});
