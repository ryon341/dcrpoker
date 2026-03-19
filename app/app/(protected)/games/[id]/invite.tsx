import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { gamesApi } from '../../../../src/api/games';
import { hostPlayersApi, HostPlayer } from '../../../../src/api/hostPlayers';

type Mode = 'direct' | 'roster';

export default function InviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('direct');

  // Direct invite state
  const [playerId, setPlayerId] = useState('');
  const [directLoading, setDirectLoading] = useState(false);
  const [directResult, setDirectResult] = useState('');
  const [directError, setDirectError] = useState('');

  // Roster invite state
  const [roster, setRoster] = useState<HostPlayer[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState('');

  useEffect(() => {
    if (mode === 'roster' && roster.length === 0) loadRoster();
  }, [mode]);

  async function loadRoster() {
    setRosterLoading(true);
    setRosterError('');
    try {
      const res = await hostPlayersApi.getMyRoster();
      setRoster(res.data.players);
    } catch (e: any) {
      setRosterError(e.message || 'Failed to load roster');
    } finally {
      setRosterLoading(false);
    }
  }

  function toggleSelect(pid: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(pid) ? next.delete(pid) : next.add(pid);
      return next;
    });
  }

  async function handleDirectInvite() {
    const pid = parseInt(playerId, 10);
    if (!playerId || isNaN(pid)) {
      setDirectError('Enter a valid numeric player ID');
      return;
    }
    setDirectError('');
    setDirectResult('');
    setDirectLoading(true);
    try {
      const res = await gamesApi.invitePlayer(id!, pid);
      setDirectResult(
        `Invited! ${res.data.host_player_created ? '(added to your roster)' : ''}`
      );
      setPlayerId('');
    } catch (e: any) {
      setDirectError(e.message || 'Failed to invite player');
    } finally {
      setDirectLoading(false);
    }
  }

  async function handleBulkInvite() {
    if (selected.size === 0) {
      setBulkResult('Select at least one player');
      return;
    }
    setBulkLoading(true);
    setBulkResult('');
    try {
      const res = await gamesApi.inviteFromHostList(id!, Array.from(selected));
      setBulkResult(
        `Invited: ${res.data.invited_count} | Duplicates: ${res.data.duplicate_count} | Invalid: ${res.data.invalid_count}`
      );
      setSelected(new Set());
    } catch (e: any) {
      setBulkResult(e.message || 'Failed');
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Invite Players</Text>

      {/* Mode tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mode === 'direct' && styles.tabActive]}
          onPress={() => setMode('direct')}
        >
          <Text style={[styles.tabText, mode === 'direct' && styles.tabTextActive]}>By Player ID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'roster' && styles.tabActive]}
          onPress={() => setMode('roster')}
        >
          <Text style={[styles.tabText, mode === 'roster' && styles.tabTextActive]}>My Roster</Text>
        </TouchableOpacity>
      </View>

      {/* Direct invite */}
      {mode === 'direct' && (
        <View style={styles.section}>
          <Text style={styles.label}>Player User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 7"
            placeholderTextColor="#555"
            value={playerId}
            onChangeText={setPlayerId}
            keyboardType="numeric"
          />
          {directError ? <Text style={styles.error}>{directError}</Text> : null}
          {directResult ? <Text style={styles.success}>{directResult}</Text> : null}
          <TouchableOpacity
            style={[styles.button, directLoading && styles.buttonDisabled]}
            onPress={handleDirectInvite}
            disabled={directLoading}
          >
            {directLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Invite Player</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* Roster invite */}
      {mode === 'roster' && (
        <View style={styles.section}>
          {rosterLoading ? (
            <ActivityIndicator color="#e94560" />
          ) : rosterError ? (
            <Text style={styles.error}>{rosterError}</Text>
          ) : roster.length === 0 ? (
            <Text style={styles.emptyText}>No active players on your roster.</Text>
          ) : (
            <>
              {roster.map(p => {
                const sel = selected.has(p.player_user_id);
                return (
                  <TouchableOpacity
                    key={p.player_user_id}
                    style={[styles.playerRow, sel && styles.playerRowSelected]}
                    onPress={() => toggleSelect(p.player_user_id)}
                  >
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{p.player_display_name}</Text>
                      <Text style={styles.playerPhone}>{p.player_phone}</Text>
                    </View>
                    <View style={[styles.checkbox, sel && styles.checkboxChecked]}>
                      {sel ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {bulkResult ? <Text style={styles.success}>{bulkResult}</Text> : null}

              <TouchableOpacity
                style={[styles.button, (bulkLoading || selected.size === 0) && styles.buttonDisabled]}
                onPress={handleBulkInvite}
                disabled={bulkLoading || selected.size === 0}
              >
                {bulkLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.buttonText}>Invite {selected.size > 0 ? `${selected.size} Selected` : 'Selected'}</Text>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Game</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  tabs: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a4a' },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#16213e' },
  tabActive: { backgroundColor: '#e94560' },
  tabText: { color: '#aaa', fontSize: 14 },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
  section: { backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 16 },
  label: { color: '#ccc', marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: '#0f0f1a', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 12, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  button: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  error: { color: '#ff6b6b', marginBottom: 10, fontSize: 14 },
  success: { color: '#4caf50', marginBottom: 10, fontSize: 14 },
  emptyText: { color: '#666', fontSize: 14 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a',
  },
  playerRowSelected: { backgroundColor: 'rgba(233,69,96,0.08)', borderRadius: 6, paddingHorizontal: 8 },
  playerInfo: { flex: 1 },
  playerName: { color: '#fff', fontSize: 15 },
  playerPhone: { color: '#888', fontSize: 13 },
  checkbox: {
    width: 24, height: 24, borderRadius: 4, borderWidth: 2,
    borderColor: '#444', justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#e94560', borderColor: '#e94560' },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  backButton: { padding: 14, alignItems: 'center' },
  backButtonText: { color: '#4a90e2', fontSize: 15 },
});
