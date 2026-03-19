import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { playersApi, HostPlayer } from '../../../src/api/players';

const STATUS_COLORS: Record<string, string> = {
  active: '#2ecc71',
  inactive: '#666',
  banned: '#e94560',
};

export default function MyPlayersScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState<HostPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await playersApi.listMyPlayers();
      setPlayers(res.data.players);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load players');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Players</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.msgBtn}
            onPress={() => router.push('/(protected)/messages/compose?source=players')}
          >
            <Text style={styles.msgBtnText}>💬 Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push('/(protected)/players/search')}
          >
            <Text style={styles.searchBtnText}>+ Find Player</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={players}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No players on your list yet.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(protected)/players/search')}
            >
              <Text style={styles.emptyBtnText}>Search Registered Players</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.playerName}>{item.display_name}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || '#444' }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            {item.username ? <Text style={styles.meta}>@{item.username}</Text> : null}
            {item.phone ? <Text style={styles.meta}>{item.phone}</Text> : null}
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 48,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerButtons: { flexDirection: 'row', gap: 8 },
  msgBtn: { backgroundColor: '#0f3460', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  msgBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  searchBtn: { backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  searchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  error: { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 20, marginBottom: 12 },
  card: {
    backgroundColor: '#16213e', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  playerName: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  badge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  meta: { color: '#aaa', fontSize: 13, marginTop: 2 },
  notes: { color: '#666', fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyText: { color: '#888', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  emptyBtn: { backgroundColor: '#e94560', borderRadius: 8, padding: 14, alignItems: 'center' },
  emptyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
