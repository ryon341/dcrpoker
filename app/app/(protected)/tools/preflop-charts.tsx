import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CHART_PRESETS,
  ChartConfig,
  GameType,
  Players,
  Position,
  POSITION_NOTES,
  RANKS,
  StackDepth,
  getChart,
  getHandKey,
  getRaisePercent,
} from '../../../src/lib/preflopCharts';

// ─── constants ────────────────────────────────────────────────────────────────

const SCREEN_W = Dimensions.get('window').width;
// Reserve 40px for page padding (20px each side) plus 22px for rank header column
const HEADER_W = 22;
const CELL_SIZE = Math.max(20, Math.floor((SCREEN_W - 40 - HEADER_W) / 13));

const ACTION_COLORS = {
  raise: '#2e7d32',   // green
  fold:  '#37474f',   // dark slate
} as const;

const ACTION_LABELS = {
  raise: 'Raise',
  fold:  'Fold',
} as const;

// ─── Selector pill group ──────────────────────────────────────────────────────

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; text: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={sg.wrapper}>
      <Text style={sg.label}>{label}</Text>
      <View style={sg.row}>
        {options.map(o => (
          <TouchableOpacity
            key={o.id}
            style={[sg.pill, value === o.id && sg.pillActive]}
            onPress={() => onChange(o.id)}
          >
            <Text style={[sg.pillText, value === o.id && sg.pillTextActive]}>
              {o.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const sg = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label:   { color: '#888', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7 },
  row:     { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill:    { backgroundColor: '#0f1b35', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#2a2a4a' },
  pillActive:     { backgroundColor: '#e94560', borderColor: '#e94560' },
  pillText:       { color: '#aaa', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
});

// ─── Hand Matrix ──────────────────────────────────────────────────────────────

function HandMatrix({
  range,
  onSelect,
  selected,
}: {
  range: Record<string, 'raise' | 'fold'>;
  onSelect: (r: number, c: number) => void;
  selected: { r: number; c: number } | null;
}) {
  return (
    // Horizontal scroll keeps the grid intact on very small screens
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Column header row */}
        <View style={mx.row}>
          <View style={[mx.headerCell, { width: HEADER_W }]} />
          {RANKS.map(r => (
            <View key={r} style={[mx.headerCell, { width: CELL_SIZE }]}>
              <Text style={mx.rankText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Data rows */}
        {RANKS.map((rowRank, ri) => (
          <View key={rowRank} style={mx.row}>
            {/* Row header */}
            <View style={[mx.headerCell, { width: HEADER_W }]}>
              <Text style={mx.rankText}>{rowRank}</Text>
            </View>

            {/* Data cells */}
            {RANKS.map((_colRank, ci) => {
              const key = getHandKey(ri, ci);
              const action = range[key] ?? 'fold';
              const isSelected = selected?.r === ri && selected?.c === ci;
              return (
                <TouchableOpacity
                  key={ci}
                  style={[
                    mx.cell,
                    { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: ACTION_COLORS[action] },
                    isSelected && mx.cellSelected,
                  ]}
                  onPress={() => onSelect(ri, ci)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const mx = StyleSheet.create({
  row:        { flexDirection: 'row' },
  headerCell: { height: CELL_SIZE, justifyContent: 'center', alignItems: 'center' },
  rankText:   { color: '#888', fontSize: 9, fontWeight: '700' },
  cell:       { borderWidth: 0.5, borderColor: '#1a1a2e' },
  cellSelected: { borderWidth: 2, borderColor: '#fff' },
});

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PreflopChartsPage() {
  const [gameType, setGameType] = useState<GameType>('cash');
  const [players,  setPlayers]  = useState<Players>('9max');
  const [position, setPosition] = useState<Position>('BTN');
  const [stack,    setStack]    = useState<StackDepth>('100bb');
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);

  const config: ChartConfig = { gameType, players, position, stack };
  const range = useMemo(() => getChart(config), [gameType, players, position, stack]);
  const raisePercent = useMemo(() => (range ? getRaisePercent(range) : 0), [range]);

  function applyPreset(idx: number) {
    const p = CHART_PRESETS[idx];
    setGameType(p.config.gameType);
    setPlayers(p.config.players);
    setPosition(p.config.position);
    setStack(p.config.stack);
    setSelected(null);
  }

  const selectedHand = selected != null ? getHandKey(selected.r, selected.c) : null;
  const selectedAction = selectedHand && range ? range[selectedHand] : null;
  const posNote = range ? (POSITION_NOTES[players]?.[position] ?? '') : '';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.pageTitle}>Preflop Charts</Text>

      {/* ── Presets ── */}
      <Text style={s.sectionLabel}>Quick Presets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.presetScroll}
        contentContainerStyle={s.presetRow}
      >
        {CHART_PRESETS.map((p, i) => (
          <TouchableOpacity key={i} style={s.presetChip} onPress={() => applyPreset(i)}>
            <Text style={s.presetChipText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Config ── */}
      <Text style={s.sectionLabel}>Configuration</Text>
      <View style={s.card}>
        <PillGroup
          label="Game Type"
          options={[
            { id: 'cash' as GameType, text: 'Cash' },
            { id: 'tournament' as GameType, text: 'Tournament' },
          ]}
          value={gameType}
          onChange={setGameType}
        />
        <PillGroup
          label="Players"
          options={[
            { id: '9max' as Players, text: '9-max' },
            { id: '6max' as Players, text: '6-max' },
          ]}
          value={players}
          onChange={setPlayers}
        />
        <PillGroup
          label="Position"
          options={[
            { id: 'UTG' as Position, text: 'UTG' },
            { id: 'MP'  as Position, text: 'MP' },
            { id: 'CO'  as Position, text: 'CO' },
            { id: 'BTN' as Position, text: 'BTN' },
          ]}
          value={position}
          onChange={setPosition}
        />
        <PillGroup
          label="Stack Depth"
          options={[
            { id: '100bb' as StackDepth, text: '100bb' },
            { id: '40bb'  as StackDepth, text: '40bb' },
            { id: '20bb'  as StackDepth, text: '20bb' },
          ]}
          value={stack}
          onChange={v => { setStack(v); setSelected(null); }}
        />
      </View>

      {/* ── Summary strip ── */}
      {range && (
        <View style={s.summary}>
          <Text style={s.summaryTitle}>
            {players === '9max' ? '9-Max' : '6-Max'} · {position} · {stack} · {gameType === 'cash' ? 'Cash' : 'Tournament'}
          </Text>
          <View style={s.summaryBadge}>
            <Text style={s.summaryBadgeText}>Opening {raisePercent}% of hands</Text>
          </View>
        </View>
      )}

      {/* ── Matrix ── */}
      {range ? (
        <View style={s.card}>
          <HandMatrix range={range} selected={selected} onSelect={(r, c) => setSelected(selected?.r === r && selected?.c === c ? null : { r, c })} />

          {/* Selected cell info */}
          <View style={s.selectedInfo}>
            {selectedHand && selectedAction ? (
              <>
                <Text style={s.selectedHand}>{selectedHand}</Text>
                <View style={[s.actionBadge, { backgroundColor: ACTION_COLORS[selectedAction] }]}>
                  <Text style={s.actionBadgeText}>{ACTION_LABELS[selectedAction]}</Text>
                </View>
              </>
            ) : (
              <Text style={s.tapHint}>Tap any hand for details</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.noChart}>Chart not available for this configuration.</Text>
        </View>
      )}

      {/* ── Legend ── */}
      <View style={s.legendRow}>
        {(Object.entries(ACTION_COLORS) as [keyof typeof ACTION_COLORS, string][]).map(([action, color]) => (
          <View key={action} style={s.legendItem}>
            <View style={[s.legendSwatch, { backgroundColor: color }]} />
            <Text style={s.legendLabel}>{ACTION_LABELS[action]}</Text>
          </View>
        ))}
      </View>

      {/* ── Position note ── */}
      {posNote ? (
        <Text style={s.posNote}>{posNote}</Text>
      ) : null}

      <Text style={s.disclaimer}>
        Charts represent standard opening ranges (raise-first-in) and are intended as a reference for home-game play. Ranges may vary with reads, table dynamics, and ante structures.
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
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },

  // Presets
  presetScroll: { marginBottom: 20 },
  presetRow:    { gap: 8, paddingRight: 8 },
  presetChip:   { backgroundColor: '#0f3460', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  presetChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Summary strip
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  summaryTitle: { color: '#fff', fontSize: 14, fontWeight: '700', flexShrink: 1, marginRight: 8 },
  summaryBadge: { backgroundColor: '#2e7d32', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  summaryBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Selected cell info
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    minHeight: 28,
    gap: 10,
  },
  selectedHand: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  actionBadge:  { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  actionBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  tapHint: { color: '#555', fontSize: 13 },

  // Legend
  legendRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendSwatch: { width: 14, height: 14, borderRadius: 3 },
  legendLabel:  { color: '#aaa', fontSize: 13 },

  // Position note
  posNote: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  // No chart
  noChart: { color: '#888', fontSize: 14, textAlign: 'center', paddingVertical: 24 },

  // Disclaimer
  disclaimer: {
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
    marginBottom: 16,
  },
});
