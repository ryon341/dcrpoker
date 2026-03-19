import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { bankrollApi, BankrollSummary, TrendData, SummaryFilters } from '../../../src/api/bankroll';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W  = SCREEN_W - 64;
const CHART_H  = 100;

function centsToDisplay(cents: number): string {
  const abs = (Math.abs(cents) / 100).toFixed(2);
  return cents < 0 ? `-$${abs}` : `$${abs}`;
}
function profitColor(cents: number) {
  if (cents > 0) return '#4caf50';
  if (cents < 0) return '#e94560';
  return '#aaa';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function LineChart({ points, color = '#e94560', label }: { points: number[]; color?: string; label: string }) {
  if (!points || points.length < 2) {
    return (
      <View style={chartStyles.wrapper}>
        <Text style={chartStyles.label}>{label}</Text>
        <View style={[chartStyles.container, { height: CHART_H }]}>
          <Text style={chartStyles.empty}>Not enough data yet</Text>
        </View>
      </View>
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = CHART_W / (points.length - 1);
  const segments: { x: number; y: number; len: number; angle: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = i * stepX;
    const y1 = CHART_H - ((points[i] - min) / span) * CHART_H;
    const x2 = (i + 1) * stepX;
    const y2 = CHART_H - ((points[i + 1] - min) / span) * CHART_H;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    segments.push({ x: x1, y: y1, len, angle });
  }
  const dots = points.map((v, i) => ({
    x: i * stepX - 3,
    y: CHART_H - ((v - min) / span) * CHART_H - 3,
  }));
  return (
    <View style={chartStyles.wrapper}>
      <Text style={chartStyles.label}>{label}</Text>
      <View style={[chartStyles.container, { width: CHART_W, height: CHART_H }]}>
        {segments.map((s, i) => (
          <View
            key={i}
            style={{
              position: 'absolute', left: s.x, top: s.y,
              width: s.len, height: 2, backgroundColor: color,
              transformOrigin: 'left center',
              transform: [{ rotate: `${s.angle}deg` }],
            }}
          />
        ))}
        {dots.map((d, i) => (
          <View
            key={`dot-${i}`}
            style={{
              position: 'absolute', left: d.x, top: d.y,
              width: 6, height: 6, borderRadius: 3, backgroundColor: color,
            }}
          />
        ))}
        {min < 0 && max >= 0 && (
          <View style={{
            position: 'absolute', left: 0,
            top: CHART_H - ((0 - min) / span) * CHART_H,
            width: CHART_W, height: 1, backgroundColor: '#444',
          }} />
        )}
      </View>
    </View>
  );
}

function BarChart({ values, label }: { values: number[]; label: string }) {
  if (!values || values.length === 0) {
    return (
      <View style={chartStyles.wrapper}>
        <Text style={chartStyles.label}>{label}</Text>
        <View style={[chartStyles.container, { height: CHART_H }]}>
          <Text style={chartStyles.empty}>Not enough data yet</Text>
        </View>
      </View>
    );
  }
  const maxAbs = Math.max(...values.map(Math.abs), 1);
  const halfH = CHART_H / 2;
  const barW = Math.max(4, Math.floor((CHART_W / values.length) - 2));
  return (
    <View style={chartStyles.wrapper}>
      <Text style={chartStyles.label}>{label}</Text>
      <View style={[chartStyles.container, { width: CHART_W, height: CHART_H }]}>
        <View style={{ position: 'absolute', left: 0, top: halfH, width: CHART_W, height: 1, backgroundColor: '#444' }} />
        {values.map((v, i) => {
          const h = Math.max(2, (Math.abs(v) / maxAbs) * halfH);
          const isPos = v >= 0;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: i * (CHART_W / values.length) + (CHART_W / values.length - barW) / 2,
                top: isPos ? halfH - h : halfH,
                width: barW, height: h,
                backgroundColor: isPos ? '#4caf50' : '#e94560',
                borderRadius: 1,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrapper:   { marginBottom: 8 },
  label:     { color: '#aaa', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  container: { backgroundColor: '#0f1a2e', borderRadius: 6, overflow: 'hidden' },
  empty:     { color: '#555', fontSize: 12, textAlign: 'center', paddingVertical: 30 },
});

const GAME_TYPES = ['all', 'cash', 'tournament', 'online', 'private'];

function FilterBar({ filters, onChange }: { filters: any; onChange: (f: any) => void }) {
  return (
    <View style={filterStyles.container}>
      <Text style={filterStyles.title}>Filters</Text>
      <View style={filterStyles.row}>
        <View style={filterStyles.half}>
          <Text style={filterStyles.label}>From</Text>
          <TextInput
            style={filterStyles.input}
            value={filters.from || ''}
            onChangeText={v => onChange({ ...filters, from: v || undefined })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#555"
          />
        </View>
        <View style={filterStyles.half}>
          <Text style={filterStyles.label}>To</Text>
          <TextInput
            style={filterStyles.input}
            value={filters.to || ''}
            onChangeText={v => onChange({ ...filters, to: v || undefined })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#555"
          />
        </View>
      </View>
      <View style={filterStyles.chipRow}>
        {GAME_TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[filterStyles.chip, (filters.game_type_ui || 'all') === t && filterStyles.chipActive]}
            onPress={() => onChange({ ...filters, game_type_ui: t, game_type: t === 'all' ? undefined : t })}
          >
            <Text style={[filterStyles.chipText, (filters.game_type_ui || 'all') === t && filterStyles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={filterStyles.clearBtn} onPress={() => onChange({ game_type_ui: 'all' })}>
        <Text style={filterStyles.clearText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const filterStyles = StyleSheet.create({
  container:    { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  title:        { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  row:          { flexDirection: 'row', gap: 10, marginBottom: 10 },
  half:         { flex: 1 },
  label:        { color: '#888', fontSize: 11, marginBottom: 4 },
  input:        { backgroundColor: '#1a1a2e', borderRadius: 6, borderWidth: 1, borderColor: '#2a2a4a', color: '#fff', paddingHorizontal: 10, paddingVertical: 7, fontSize: 13 },
  chipRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:         { borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#1a1a2e' },
  chipActive:   { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:     { color: '#888', fontSize: 12 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  clearBtn:     { marginTop: 10, alignSelf: 'flex-end' },
  clearText:    { color: '#e94560', fontSize: 12 },
});

type Filters = SummaryFilters & { game_type_ui?: string };

export default function BankrollDashboard() {
  const router = useRouter();
  const [summary, setSummary]       = useState<BankrollSummary | null>(null);
  const [trends, setTrends]         = useState<TrendData | null>(null);
  const [recent, setRecent]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]       = useState<Filters>({ game_type_ui: 'all' });
  const applyRef = useRef<Filters>({ game_type_ui: 'all' });

  const load = useCallback(async (isRefresh = false, applied: Filters = applyRef.current) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    const apiFilters: SummaryFilters = { from: applied.from, to: applied.to, game_type: applied.game_type };
    try {
      const [summaryData, trendsData, sessionsData] = await Promise.all([
        bankrollApi.getSummary(apiFilters),
        bankrollApi.getTrends(apiFilters),
        bankrollApi.getSessions(apiFilters),
      ]);
      setSummary(summaryData);
      setTrends(trendsData);
      setRecent(sessionsData.slice(0, 5));
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const applyFilters = (f: Filters) => {
    applyRef.current = f;
    setFilters(f);
    load(false, f);
  };

  const cumulativePoints = trends?.points.map(p => p.cumulative_profit_cents) ?? [];
  const sessionPoints    = trends?.points.map(p => p.profit_loss_cents) ?? [];
  const recent7  = trends?.recent.last7DaysProfitCents ?? 0;
  const recent30 = trends?.recent.last30DaysProfitCents ?? 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#e94560" />}
    >
      <Text style={styles.headline}>Bankroll Tracker</Text>
      <Text style={styles.subheadline}>Run your poker like a business.</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Filter Toggle */}
      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(v => !v)}>
        <Text style={styles.filterToggleText}>{showFilters ? 'Hide Filters ▲' : 'Filters ▼'}</Text>
        {(filters.from || filters.to || filters.game_type) && (
          <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>active</Text></View>
        )}
      </TouchableOpacity>
      {showFilters && <FilterBar filters={filters} onChange={applyFilters} />}

      {/* Current Bankroll */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Bankroll (all-time)</Text>
        <Text style={[styles.bigNumber, { color: profitColor(summary?.current_bankroll_cents ?? 0) }]}>
          {centsToDisplay(summary?.current_bankroll_cents ?? 0)}
        </Text>
        {(filters.from || filters.to || filters.game_type) && (
          <Text style={styles.filterNote}>Stats below are filtered</Text>
        )}
      </View>

      {/* Recent Performance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Performance</Text>
        <View style={styles.grid}>
          <StatCell label="Last 7 Days"   value={centsToDisplay(recent7)}  color={profitColor(recent7)} />
          <StatCell label="Last 30 Days"  value={centsToDisplay(recent30)} color={profitColor(recent30)} />
          <StatCell label="7-Day Hours"   value={`${(trends?.recent.last7DaysHours ?? 0).toFixed(1)}h`} />
          <StatCell label="30-Day Hours"  value={`${(trends?.recent.last30DaysHours ?? 0).toFixed(1)}h`} />
        </View>
      </View>

      {/* Session Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Stats</Text>
        <View style={styles.grid}>
          <StatCell label="Sessions"      value={String(summary?.session_count ?? 0)} />
          <StatCell label="Total P/L"     value={centsToDisplay(summary?.total_profit_loss_cents ?? 0)}          color={profitColor(summary?.total_profit_loss_cents ?? 0)} />
          <StatCell label="Total Hours"   value={`${(summary?.total_hours_played_decimal ?? 0).toFixed(1)}h`} />
          <StatCell label="Avg / Session" value={centsToDisplay(summary?.average_profit_per_session_cents ?? 0)} color={profitColor(summary?.average_profit_per_session_cents ?? 0)} />
          <StatCell label="Avg / Hour"    value={centsToDisplay(summary?.average_profit_per_hour_cents ?? 0)}    color={profitColor(summary?.average_profit_per_hour_cents ?? 0)} />
          <StatCell label="Biggest Win"   value={centsToDisplay(summary?.biggest_win_cents ?? 0)}  color="#4caf50" />
          <StatCell label="Biggest Loss"  value={centsToDisplay(summary?.biggest_loss_cents ?? 0)} color="#e94560" />
        </View>
      </View>

      {/* Charts */}
      {cumulativePoints.length >= 2 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Charts</Text>
          <LineChart points={cumulativePoints} color="#e94560" label="Cumulative Profit / Loss" />
          <View style={{ height: 16 }} />
          <BarChart values={sessionPoints} label="Per-Session Result" />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(protected)/bankroll/log-session')}>
          <Text style={styles.btnPrimaryText}>+ Log Session</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/(protected)/bankroll/sessions')}>
          <Text style={styles.btnSecondaryText}>Sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/(protected)/bankroll/adjustments')}>
          <Text style={styles.btnSecondaryText}>Adjustments</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Sessions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Sessions</Text>
        {recent.length === 0 ? (
          <Text style={styles.emptyText}>No sessions yet. Log your first game!</Text>
        ) : (
          recent.map((s: any) => (
            <TouchableOpacity
              key={s.id}
              style={styles.sessionRow}
              onPress={() => router.push(`/(protected)/bankroll/sessions/${s.id}` as any)}
            >
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionDate}>{formatDate(s.played_at)}</Text>
                <Text style={styles.sessionMeta}>
                  {s.game_type}{s.stakes_label ? ` · ${s.stakes_label}` : ''}{s.location_name ? ` · ${s.location_name}` : ''}
                </Text>
              </View>
              <View style={styles.sessionRight}>
                <Text style={[styles.sessionPL, { color: profitColor(s.profit_loss_cents) }]}>
                  {centsToDisplay(s.profit_loss_cents)}
                </Text>
                <Text style={styles.sessionHours}>{Number(s.hours_played_decimal).toFixed(1)}h</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        {recent.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/(protected)/bankroll/sessions')}>
            <Text style={styles.seeAll}>See all sessions →</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function StatCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#1a1a2e' },
  content:         { padding: 16, paddingBottom: 40 },
  center:          { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  headline:        { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subheadline:     { color: '#aaa', fontSize: 13, marginBottom: 16 },
  errorText:       { color: '#e94560', fontSize: 13, marginBottom: 12 },
  filterToggle:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  filterToggleText: { color: '#e94560', fontSize: 13, fontWeight: '600' },
  filterBadge:     { marginLeft: 8, backgroundColor: '#e94560', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  card:            { backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  cardLabel:       { color: '#aaa', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  cardTitle:       { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  filterNote:      { color: '#e94560', fontSize: 11, marginTop: 4 },
  bigNumber:       { fontSize: 36, fontWeight: '700' },
  grid:            { flexDirection: 'row', flexWrap: 'wrap' },
  statCell:        { width: '50%', paddingVertical: 8 },
  statValue:       { color: '#fff', fontSize: 18, fontWeight: '700' },
  statLabel:       { color: '#aaa', fontSize: 11, marginTop: 2 },
  buttonRow:       { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  btnPrimary:      { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flex: 1 },
  btnPrimaryText:  { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 14 },
  btnSecondary:    { backgroundColor: '#0f3460', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, flex: 1 },
  btnSecondaryText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 13 },
  sessionRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  sessionLeft:     { flex: 1 },
  sessionDate:     { color: '#fff', fontSize: 14, fontWeight: '600' },
  sessionMeta:     { color: '#aaa', fontSize: 12, marginTop: 2 },
  sessionRight:    { alignItems: 'flex-end' },
  sessionPL:       { fontSize: 16, fontWeight: '700' },
  sessionHours:    { color: '#aaa', fontSize: 12 },
  emptyText:       { color: '#aaa', fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  seeAll:          { color: '#e94560', fontSize: 13, marginTop: 12, textAlign: 'right' },
});
