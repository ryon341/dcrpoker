import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { playersApi, PlayerResult } from '../../../src/api/players';

type ActionState = 'idle' | 'loading' | 'done' | 'error';

interface RowAction {
  addState: ActionState;
  addMessage?: string;
  inviteState: ActionState;
  inviteMessage?: string;
  bothState: ActionState;
  bothMessage?: string;
}

export default function PlayerSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ gameId?: string; gameTitle?: string }>();
  const gameId = params.gameId ? Number(params.gameId) : undefined;
  const gameTitle = params.gameTitle ? decodeURIComponent(params.gameTitle) : undefined;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [rowActions, setRowActions] = useState<Record<number, RowAction>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleQueryChange(text: string) {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setResults([]);
      setSearchError('');
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(text.trim()), 500);
  }

  async function doSearch(q: string) {
    setSearching(true);
    setSearchError('');
    try {
      const res = await playersApi.search(q);
      setResults(res.data.players);
    } catch (e: any) {
      setSearchError(e.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }

  function setRowAction(playerId: number, patch: Partial<RowAction>) {
    setRowActions((prev) => {
      const current = prev[playerId] ?? { addState: 'idle', inviteState: 'idle', bothState: 'idle' };
      return { ...prev, [playerId]: { ...current, ...patch } };
    });
  }

  async function handleAdd(player: PlayerResult) {
    setRowAction(player.id, { addState: 'loading' });
    try {
      await playersApi.addToMyPlayers(player.id);
      setRowAction(player.id, { addState: 'done', addMessage: 'Added!' });
    } catch (e: any) {
      const msg = e.message?.includes('already') ? 'Already on list' : (e.message || 'Failed');
      setRowAction(player.id, { addState: 'error', addMessage: msg });
    }
  }

  async function handleInvite(player: PlayerResult) {
    if (!gameId) return;
    setRowAction(player.id, { inviteState: 'loading' });
    try {
      await playersApi.addPlayerToGame(gameId, player.id);
      setRowAction(player.id, { inviteState: 'done', inviteMessage: 'Invited!' });
    } catch (e: any) {
      setRowAction(player.id, { inviteState: 'error', inviteMessage: e.message || 'Failed' });
    }
  }

  async function handleAddAndInvite(player: PlayerResult) {
    if (!gameId) return;
    setRowAction(player.id, { bothState: 'loading' });
    try {
      await playersApi.addPlayerToGame(gameId, player.id);
      setRowAction(player.id, { bothState: 'done', bothMessage: 'Added + Invited!' });
    } catch (e: any) {
      setRowAction(player.id, { bothState: 'error', bothMessage: e.message || 'Failed' });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {gameId ? `Add Players to ${gameTitle || 'Game'}` : 'Search Players'}
        </Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Name, username, or phone…"
          placeholderTextColor="#555"
          autoCapitalize="none"
          autoFocus
        />
        {searching && <ActivityIndicator style={styles.spinner} color="#e94560" />}
      </View>

      {searchError ? <Text style={styles.error}>{searchError}</Text> : null}

      {query.trim().length > 0 && query.trim().length < 2 ? (
        <Text style={styles.hint}>Type at least 2 characters to search</Text>
      ) : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !searching && query.trim().length >= 2 ? (
            <Text style={styles.emptyText}>No players found</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const actions = rowActions[item.id] || { addState: 'idle', inviteState: 'idle', bothState: 'idle' };
          return (
            <View style={styles.card}>
              <Text style={styles.playerName}>{item.display_name}</Text>
              {item.username ? <Text style={styles.playerMeta}>@{item.username}</Text> : null}
              {item.phone ? <Text style={styles.playerMeta}>{item.phone}</Text> : null}

              <View style={styles.actionRow}>
                {/* Add to My Players */}
                <ActionButton
                  label="Add to My Players"
                  state={actions.addState}
                  message={actions.addMessage}
                  color="#0f3460"
                  onPress={() => handleAdd(item)}
                />

                {/* Game-context actions */}
                {gameId ? (
                  <>
                    <ActionButton
                      label="Invite to Game"
                      state={actions.inviteState}
                      message={actions.inviteMessage}
                      color="#1a5276"
                      onPress={() => handleInvite(item)}
                    />
                    <ActionButton
                      label="Add + Invite"
                      state={actions.bothState}
                      message={actions.bothMessage}
                      color="#e94560"
                      onPress={() => handleAddAndInvite(item)}
                    />
                  </>
                ) : null}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

function ActionButton({
  label, state, message, color, onPress,
}: {
  label: string; state: ActionState; message?: string; color: string; onPress: () => void;
}) {
  const done = state === 'done';
  const err = state === 'error';
  const loading = state === 'loading';

  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: done ? '#1a4a2a' : err ? '#4a1a1a' : color },
        loading && styles.actionBtnDisabled]}
      onPress={onPress}
      disabled={loading || done}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small" />
        : <Text style={styles.actionBtnText}>{done || err ? (message || label) : label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  topBar: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 12 },
  backBtn: { marginBottom: 8 },
  backText: { color: '#e94560', fontSize: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 8,
  },
  input: {
    flex: 1, backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#2a2a4a',
  },
  spinner: { marginLeft: 10 },
  error: { color: '#ff6b6b', textAlign: 'center', marginVertical: 8 },
  hint: { color: '#555', textAlign: 'center', marginVertical: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  emptyText: { color: '#666', textAlign: 'center', paddingTop: 40 },
  card: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4a',
  },
  playerName: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  playerMeta: { color: '#888', fontSize: 13, marginBottom: 2 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  actionBtn: { borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, minWidth: 80, alignItems: 'center' },
  actionBtnDisabled: { opacity: 0.6 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
});
