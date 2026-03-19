import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, TextInput, RefreshControl, Linking,
} from 'react-native';
import { publicGamesApi, PublicGame } from '../../../src/api/publicGames';

const GAME_TYPES = ['All', 'NLH', 'PLO', 'Stud', 'Mixed'];

export default function PublicGamesScreen() {
  const [games, setGames] = useState<PublicGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [tourneyOnly, setTourneyOnly] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (cityFilter.trim()) params.city = cityFilter.trim();
      if (typeFilter !== 'All') params.game_type = typeFilter;
      if (tourneyOnly) params.is_tournament = '1';
      const res = await publicGamesApi.list(params);
      setGames(res.data.games);
    } catch (e: any) {
      setError(e.message || 'Failed to load games');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cityFilter, typeFilter, tourneyOnly]);

  useEffect(() => { load(); }, [load]);

  function reset() {
    setCityFilter('');
    setTypeFilter('All');
    setTourneyOnly(false);
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor="#e94560" />}
    >
      <Text style={s.pageTitle}>🃏 Public Games Directory</Text>
      <Text style={s.pageSubtitle}>Find legal poker rooms, card clubs, and tournaments near you.</Text>

      {/* Filters */}
      <View style={s.filterCard}>
        <TextInput
          style={s.filterInput}
          placeholder="Filter by city..."
          placeholderTextColor="#666"
          value={cityFilter}
          onChangeText={setCityFilter}
          returnKeyType="search"
          onSubmitEditing={() => load()}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {GAME_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[s.filterChip, typeFilter === t ? s.filterChipActive : null]}
              onPress={() => setTypeFilter(t)}
            >
              <Text style={[s.filterChipText, typeFilter === t ? s.filterChipTextActive : null]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12 }}>
          <TouchableOpacity
            style={[s.filterChip, tourneyOnly ? s.filterChipActive : null]}
            onPress={() => setTourneyOnly(v => !v)}
          >
            <Text style={[s.filterChipText, tourneyOnly ? s.filterChipTextActive : null]}>🏆 Tournaments Only</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset}>
            <Text style={{ color: '#888', fontSize: 12 }}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 30 }} /> : null}

      {!loading && games.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🃏</Text>
          <Text style={s.emptyText}>No public games found</Text>
          <Text style={s.emptySubtext}>Try adjusting your filters or check back later as we add more listings.</Text>
        </View>
      ) : null}

      {games.map(g => (
        <View key={g.id} style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardVenue}>{g.venue_name}</Text>
            {g.is_tournament ? <View style={s.tournBadge}><Text style={s.tournBadgeText}>🏆 TOURNAMENT</Text></View> : null}
          </View>
          <Text style={s.cardTitle}>{g.title}</Text>
          <Text style={s.cardLocation}>{[g.city, g.state].filter(Boolean).join(', ')}</Text>

          {g.game_type || g.stake ? (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              {g.game_type ? <View style={s.chip}><Text style={s.chipText}>{g.game_type}</Text></View> : null}
              {g.stake ? <View style={s.chip}><Text style={s.chipText}>{g.stake}</Text></View> : null}
            </View>
          ) : null}

          {g.schedule_text ? <Text style={s.cardMeta}>🗓 {g.schedule_text}</Text> : null}
          {g.buy_in ? <Text style={s.cardMeta}>💵 Buy-in: {g.buy_in}</Text> : null}
          {g.notes ? <Text style={s.cardNotes}>{g.notes}</Text> : null}

          {g.website ? (
            <TouchableOpacity onPress={() => Linking.openURL(g.website!)}>
              <Text style={s.websiteLink}>🔗 Visit website</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 60 },

  pageTitle:    { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  pageSubtitle: { color: '#888', fontSize: 13, marginBottom: 16 },

  filterCard:  { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  filterInput: { backgroundColor: '#0a1020', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#fff', fontSize: 14 },
  filterChip:  { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#0f1a2e', borderWidth: 1, borderColor: '#2a2a4a', marginRight: 8 },
  filterChipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  filterChipText: { color: '#aaa', fontSize: 13 },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },

  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },

  empty:        { alignItems: 'center', paddingTop: 40 },
  emptyIcon:    { fontSize: 40, marginBottom: 12 },
  emptyText:    { color: '#aaa', fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  emptySubtext: { color: '#666', fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },

  card:         { backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a' },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardVenue:    { color: '#e94560', fontSize: 13, fontWeight: 'bold', flex: 1 },
  cardTitle:    { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardLocation: { color: '#888', fontSize: 13, marginBottom: 6 },
  cardMeta:     { color: '#aaa', fontSize: 13, marginTop: 4 },
  cardNotes:    { color: '#888', fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  websiteLink:  { color: '#4a9eff', fontSize: 13, marginTop: 8 },

  tournBadge:     { backgroundColor: '#5a3a00', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  tournBadgeText: { color: '#ffd080', fontSize: 10, fontWeight: 'bold' },
  chip:           { backgroundColor: '#0f3460', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  chipText:       { color: '#7ab8ff', fontSize: 12 },
});
