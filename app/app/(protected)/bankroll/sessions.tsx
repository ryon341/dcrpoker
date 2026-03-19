import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { bankrollApi, PokerSession, SummaryFilters } from '../../../src/api/bankroll';

function centsToDisplay(cents: number): string {
  const abs = (Math.abs(cents) / 100).toFixed(2);
  return cents < 0 ? `-$${abs}` : `$${abs}`;
}

function profitColor(cents: number): string {
  if (cents > 0) return '#4caf50';
  if (cents < 0) return '#e94560';
  return '#aaa';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const GAME_TYPES = ['all', 'cash', 'tournament', 'online', 'private'];

type Filters = SummaryFilters & { game_type_ui?: string };

export default function SessionsScreen() {
  const router = useRouter();
  const [sessions, setSessions]     = useState<PokerSession[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]       = useState<Filters>({ game_type_ui: 'all' });
  const applyRef = useRef<Filters>({ game_type_ui: 'all' });

  const load = useCallback(async (isRefresh = false, applied: Filters = applyRef.current) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    const apiFilters: SummaryFilters = { from: applied.from, to: applied.to, game_type: applied.game_type };
    try {
      const data = await bankrollApi.getSessions(apiFilters);
      setSessions(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sessions');
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
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
        <TouchableOpacity style={styles.logBtn} onPress={() => router.push('/(protected)/bankroll/log-session')}>
          <Text style={styles.logBtnText}>+ Log</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(v => !v)}>
        <Text style={styles.filterToggleText}>{showFilters ? 'Hide Filters ▲' : 'Filters ▼'}</Text>
        {(filters.from || filters.to || filters.game_type) && (
          <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>active</Text></View>
        )}
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterBox}>
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>From</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.from || ''}
                onChangeText={v => applyFilters({ ...filters, from: v || undefined })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>To</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.to || ''}
                onChangeText={v => applyFilters({ ...filters, to: v || undefined })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#555"
              />
            </View>
          </View>
          <View style={styles.chipRow}>
            {GAME_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, (filters.game_type_ui || 'all') === t && styles.chipActive]}
                onPress={() => applyFilters({ ...filters, game_type_ui: t, game_type: t === 'all' ? undefined : t })}
              >
                <Text style={[styles.chipText, (filters.game_type_ui || 'all') === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={() => applyFilters({ game_type_ui: 'all' })}>
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {sessions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No sessions found</Text>
          <Text style={styles.emptyBody}>
            {(filters.from || filters.to || filters.game_type)
              ? 'Try adjusting your filters.'
              : 'Log your first poker session to start tracking your results.'}
          </Text>
          {!(filters.from || filters.to || filters.game_type) && (
            <TouchableOpacity style={styles.logBtn} onPress={() => router.push('/(protected)/bankroll/log-session')}>
              <Text style={styles.logBtnText}>+ Log Session</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        sessions.map(s => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            onPress={() => router.push(`/(protected)/bankroll/sessions/${s.id}` as any)}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.dateText}>{formatDate(s.played_at)}</Text>
                <Text style={styles.typeText}>
                  {s.game_type.charAt(0).toUpperCase() + s.game_type.slice(1)}
                  {s.stakes_label ? ` · ${s.stakes_label}` : ''}
                </Text>
              </View>
              <Text style={[styles.plText, { color: profitColor(s.profit_loss_cents) }]}>
                {centsToDisplay(s.profit_loss_cents)}
              </Text>
            </View>

            <View style={styles.cardDetails}>
              {s.location_name && (
                <Text style={styles.detailText}>📍 {s.location_name}</Text>
              )}
              <View style={styles.moneyRow}>
                <Text style={styles.detailText}>Buy-in: {centsToDisplay(s.buy_in_amount_cents)}</Text>
                <Text style={styles.detailSep}>·</Text>
                <Text style={styles.detailText}>Cash-out: {centsToDisplay(s.cash_out_amount_cents)}</Text>
                <Text style={styles.detailSep}>·</Text>
                <Text style={styles.detailText}>{Number(s.hours_played_decimal).toFixed(1)}h</Text>
              </View>
              {s.notes && <Text style={styles.notesText} numberOfLines={2}>{s.notes}</Text>}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#1a1a2e' },
  content:         { padding: 16, paddingBottom: 40 },
  center:          { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title:           { color: '#fff', fontSize: 22, fontWeight: '700' },
  filterToggle:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  filterToggleText: { color: '#e94560', fontSize: 13, fontWeight: '600' },
  filterBadge:     { marginLeft: 8, backgroundColor: '#e94560', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  filterBox:       { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a' },
  filterRow:       { flexDirection: 'row', gap: 10, marginBottom: 10 },
  filterHalf:      { flex: 1 },
  filterLabel:     { color: '#888', fontSize: 11, marginBottom: 4 },
  filterInput:     { backgroundColor: '#1a1a2e', borderRadius: 6, borderWidth: 1, borderColor: '#2a2a4a', color: '#fff', paddingHorizontal: 10, paddingVertical: 7, fontSize: 13 },
  chipRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:            { borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#1a1a2e' },
  chipActive:      { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:        { color: '#888', fontSize: 12 },
  chipTextActive:  { color: '#fff', fontWeight: '600' },
  clearBtn:        { marginTop: 10, alignSelf: 'flex-end' },
  clearText:       { color: '#e94560', fontSize: 12 },
  errorText:       { color: '#e94560', fontSize: 13, marginBottom: 12 },
  card:            { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a4a' },
  cardTop:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  dateText:        { color: '#fff', fontSize: 15, fontWeight: '600' },
  typeText:        { color: '#aaa', fontSize: 12, marginTop: 2 },
  plText:          { fontSize: 20, fontWeight: '700' },
  cardDetails:     { borderTopWidth: 1, borderTopColor: '#2a2a4a', paddingTop: 10 },
  moneyRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 4 },
  detailText:      { color: '#bbb', fontSize: 12 },
  detailSep:       { color: '#555', fontSize: 12 },
  notesText:       { color: '#777', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  emptyCard:       { backgroundColor: '#16213e', borderRadius: 10, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  emptyTitle:      { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  emptyBody:       { color: '#aaa', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  logBtn:          { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  logBtnText:      { color: '#fff', fontWeight: '700', fontSize: 14 },
});
