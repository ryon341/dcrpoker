import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, TextInput, Switch, Alert, RefreshControl,
} from 'react-native';
import { publicGamesApi, PublicVenue, PublicGame } from '../../../../src/api/publicGames';

type VenueForm = { name: string; city: string; state: string; address: string; website: string; notes: string };
type GameForm  = { venue_id: string; title: string; game_type: string; stake: string; schedule_text: string; buy_in: string; is_tournament: boolean; notes: string };

const EMPTY_VENUE: VenueForm = { name: '', city: '', state: '', address: '', website: '', notes: '' };
const EMPTY_GAME: GameForm  = { venue_id: '', title: '', game_type: 'NLH', stake: '', schedule_text: '', buy_in: '', is_tournament: false, notes: '' };

export default function AdminPublicGamesScreen() {
  const [venues, setVenues] = useState<PublicVenue[]>([]);
  const [games,  setGames]  = useState<PublicGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [tab, setTab] = useState<'venues' | 'games'>('venues');

  // Venue form state
  const [editingVenue, setEditingVenue] = useState<PublicVenue | null>(null);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [venueForm, setVenueForm] = useState<VenueForm>(EMPTY_VENUE);
  const [savingVenue, setSavingVenue] = useState(false);

  // Game form state
  const [editingGame, setEditingGame] = useState<PublicGame | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [gameForm, setGameForm] = useState<GameForm>(EMPTY_GAME);
  const [savingGame, setSavingGame] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const [vRes, gRes] = await Promise.all([
        publicGamesApi.adminListVenues(),
        publicGamesApi.adminListGames(),
      ]);
      setVenues(vRes.data.venues);
      setGames(gRes.data.games);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ─── Venue CRUD ────────────────────────────────────────────────────────────
  function openNewVenue() {
    setEditingVenue(null);
    setVenueForm(EMPTY_VENUE);
    setShowVenueForm(true);
  }

  function openEditVenue(v: PublicVenue) {
    setEditingVenue(v);
    setVenueForm({ name: v.name, city: v.city, state: v.state ?? '', address: v.address || '', website: v.website || '', notes: v.notes || '' });
    setShowVenueForm(true);
  }

  async function saveVenue() {
    if (!venueForm.name.trim() || !venueForm.city.trim()) {
      Alert.alert('Required', 'Name and City are required.');
      return;
    }
    setSavingVenue(true);
    try {
      if (editingVenue) {
        await publicGamesApi.adminUpdateVenue(editingVenue.id, venueForm);
      } else {
        await publicGamesApi.adminCreateVenue(venueForm);
      }
      setShowVenueForm(false);
      load(true);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Save failed');
    } finally {
      setSavingVenue(false);
    }
  }

  async function toggleVenueActive(v: PublicVenue) {
    try {
      await publicGamesApi.adminUpdateVenue(v.id, { is_active: v.is_active ? 0 : 1 });
      load(true);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  // ─── Game CRUD ─────────────────────────────────────────────────────────────
  function openNewGame(venueId?: string) {
    setEditingGame(null);
    setGameForm({ ...EMPTY_GAME, venue_id: venueId || '' });
    setShowGameForm(true);
  }

  function openEditGame(g: PublicGame) {
    setEditingGame(g);
    setGameForm({ venue_id: String(g.venue_id), title: g.title, game_type: g.game_type || 'NLH', stake: g.stake || '', schedule_text: g.schedule_text || '', buy_in: g.buy_in || '', is_tournament: !!g.is_tournament, notes: g.notes || '' });
    setShowGameForm(true);
  }

  async function saveGame() {
    if (!gameForm.title.trim() || !gameForm.venue_id) {
      Alert.alert('Required', 'Title and Venue are required.');
      return;
    }
    setSavingGame(true);
    try {
      const payload = { ...gameForm, venue_id: parseInt(gameForm.venue_id, 10), is_tournament: gameForm.is_tournament ? 1 : 0 };
      if (editingGame) {
        await publicGamesApi.adminUpdateGame(editingGame.id, payload);
      } else {
        await publicGamesApi.adminCreateGame(payload);
      }
      setShowGameForm(false);
      load(true);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Save failed');
    } finally {
      setSavingGame(false);
    }
  }

  async function toggleGameActive(g: PublicGame) {
    try {
      await publicGamesApi.adminUpdateGame(g.id, { is_active: g.is_active ? 0 : 1 });
      load(true);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  if (showVenueForm) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <Text style={s.formTitle}>{editingVenue ? 'Edit Venue' : 'New Venue'}</Text>
        {([['name', 'Venue Name *'], ['city', 'City *'], ['state', 'State'], ['address', 'Address'], ['website', 'Website URL'], ['notes', 'Notes']] as [keyof VenueForm, string][]).map(([key, label]) => (
          <View key={key} style={s.fieldGroup}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={[s.input, key === 'notes' ? { height: 80, textAlignVertical: 'top' } : null]}
              value={venueForm[key]}
              onChangeText={v => setVenueForm(f => ({ ...f, [key]: v }))}
              placeholder={label}
              placeholderTextColor="#555"
              multiline={key === 'notes'}
              autoCapitalize={key === 'website' ? 'none' : 'words'}
              keyboardType={key === 'website' ? 'url' : 'default'}
            />
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: '#333' }]} onPress={() => setShowVenueForm(false)}>
            <Text style={s.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, { flex: 2 }]} onPress={saveVenue} disabled={savingVenue}>
            {savingVenue ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Save Venue</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (showGameForm) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <Text style={s.formTitle}>{editingGame ? 'Edit Game' : 'New Game'}</Text>

        <View style={s.fieldGroup}>
          <Text style={s.label}>Venue *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {venues.filter(v => v.is_active).map(v => (
              <TouchableOpacity
                key={v.id}
                style={[s.filterChip, gameForm.venue_id === String(v.id) ? s.filterChipActive : null]}
                onPress={() => setGameForm(f => ({ ...f, venue_id: String(v.id) }))}
              >
                <Text style={[s.filterChipText, gameForm.venue_id === String(v.id) ? s.filterChipTextActive : null]}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {([['title', 'Game Title *'], ['stake', 'Stakes (e.g. 1/2)'], ['schedule_text', 'Schedule'], ['buy_in', 'Buy-in'], ['notes', 'Notes']] as [keyof GameForm, string][]).map(([key, label]) => (
          <View key={key} style={s.fieldGroup}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={[s.input, key === 'notes' ? { height: 70, textAlignVertical: 'top' } : null]}
              value={String(gameForm[key])}
              onChangeText={v => setGameForm(f => ({ ...f, [key]: v }))}
              placeholder={label}
              placeholderTextColor="#555"
              multiline={key === 'notes'}
            />
          </View>
        ))}

        <View style={s.fieldGroup}>
          <Text style={s.label}>Game Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['NLH', 'PLO', 'Stud', 'Mixed', 'Other'].map(t => (
              <TouchableOpacity
                key={t}
                style={[s.filterChip, gameForm.game_type === t ? s.filterChipActive : null]}
                onPress={() => setGameForm(f => ({ ...f, game_type: t }))}
              >
                <Text style={[s.filterChipText, gameForm.game_type === t ? s.filterChipTextActive : null]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[s.fieldGroup, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={s.label}>Tournament?</Text>
          <Switch value={gameForm.is_tournament} onValueChange={v => setGameForm(f => ({ ...f, is_tournament: v }))} trackColor={{ true: '#e94560' }} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: '#333' }]} onPress={() => setShowGameForm(false)}>
            <Text style={s.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, { flex: 2 }]} onPress={saveGame} disabled={savingGame}>
            {savingGame ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Save Game</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor="#e94560" />}
    >
      <Text style={s.pageTitle}>⚙️ Manage Public Games</Text>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['venues', 'games'] as const).map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t ? s.tabActive : null]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t ? s.tabTextActive : null]}>{t === 'venues' ? 'Venues' : 'Games'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 30 }} /> : null}

      {/* Venues Tab */}
      {!loading && tab === 'venues' && (
        <>
          <TouchableOpacity style={s.addBtn} onPress={openNewVenue}>
            <Text style={s.addBtnText}>+ Add Venue</Text>
          </TouchableOpacity>
          {venues.length === 0 ? (
            <Text style={s.emptyText}>No venues yet. Add one above.</Text>
          ) : venues.map(v => (
            <View key={v.id} style={[s.card, !v.is_active ? s.cardInactive : null]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{v.name}</Text>
                  <Text style={s.cardMeta}>{[v.city, v.state].filter(Boolean).join(', ')}</Text>
                  {v.address ? <Text style={s.cardMeta}>{v.address}</Text> : null}
                </View>
                <Switch value={!!v.is_active} onValueChange={() => toggleVenueActive(v)} trackColor={{ true: '#e94560' }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <TouchableOpacity style={s.editBtn} onPress={() => openEditVenue(v)}>
                  <Text style={s.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.editBtn, { backgroundColor: '#0f3460' }]} onPress={() => openNewGame(String(v.id))}>
                  <Text style={s.editBtnText}>+ Add Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Games Tab */}
      {!loading && tab === 'games' && (
        <>
          <TouchableOpacity style={s.addBtn} onPress={() => openNewGame()}>
            <Text style={s.addBtnText}>+ Add Game</Text>
          </TouchableOpacity>
          {games.length === 0 ? (
            <Text style={s.emptyText}>No games yet. Add one above.</Text>
          ) : games.map(g => (
            <View key={g.id} style={[s.card, !g.is_active ? s.cardInactive : null]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardVenue}>{g.venue_name}</Text>
                  <Text style={s.cardTitle}>{g.title}</Text>
                  {g.game_type || g.stake ? <Text style={s.cardMeta}>{[g.game_type, g.stake].filter(Boolean).join(' · ')}</Text> : null}
                  {g.schedule_text ? <Text style={s.cardMeta}>{g.schedule_text}</Text> : null}
                  {g.is_tournament ? <Text style={{ color: '#ffd080', fontSize: 11, marginTop: 2 }}>🏆 Tournament</Text> : null}
                </View>
                <Switch value={!!g.is_active} onValueChange={() => toggleGameActive(g)} trackColor={{ true: '#e94560' }} />
              </View>
              <TouchableOpacity style={[s.editBtn, { marginTop: 10 }]} onPress={() => openEditGame(g)}>
                <Text style={s.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 60 },

  pageTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 14 },

  tabs:          { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 8, padding: 4, marginBottom: 16 },
  tab:           { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive:     { backgroundColor: '#e94560' },
  tabText:       { color: '#888', fontSize: 14 },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },

  error:     { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 20 },

  addBtn:     { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 14 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  card:         { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a4a' },
  cardInactive: { opacity: 0.5 },
  cardVenue:    { color: '#e94560', fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  cardTitle:    { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  cardMeta:     { color: '#888', fontSize: 12, marginTop: 2 },

  editBtn:     { backgroundColor: '#0f3460', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'flex-start' },
  editBtnText: { color: '#7ab8ff', fontSize: 13 },

  // Form styles
  formTitle:  { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  fieldGroup: { marginBottom: 14 },
  label:      { color: '#aaa', fontSize: 12, marginBottom: 4 },
  input:      { backgroundColor: '#16213e', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 14 },
  btn:        { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  btnText:    { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  filterChip:          { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#0f1a2e', borderWidth: 1, borderColor: '#2a2a4a', marginRight: 8 },
  filterChipActive:    { backgroundColor: '#e94560', borderColor: '#e94560' },
  filterChipText:      { color: '#aaa', fontSize: 13 },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },
});
