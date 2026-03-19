import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { externalInvitesApi, ExternalInvite } from '../../../src/api/externalInvites';

const STATUS_COLORS: Record<string, string> = {
  generated: '#0f3460',
  sent: '#d4a017',
  accepted: '#2ecc71',
  expired: '#666',
  cancelled: '#e94560',
};

export default function InvitesListScreen() {
  const router = useRouter();
  const [invites, setInvites] = useState<ExternalInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await externalInvitesApi.list();
      setInvites(res.data.invites);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load invites');
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
        <Text style={styles.title}>Invites</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(protected)/invites/create')}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={invites}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No invites yet.</Text>
            <Text style={styles.emptySubText}>Generate an invite link to onboard a prospect.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(protected)/invites/${item.id}`)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.code}>{item.invite_code}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || '#444' }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            {item.recipient_phone ? <Text style={styles.meta}>{item.recipient_phone}</Text> : null}
            {item.recipient_email ? <Text style={styles.meta}>{item.recipient_email}</Text> : null}
            {item.game_id ? <Text style={styles.meta}>Game #{item.game_id}</Text> : null}
            <Text style={styles.channel}>via {item.channel} · {new Date(item.created_at).toLocaleDateString()}</Text>
          </TouchableOpacity>
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
  addButton: { backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  error: { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 20, marginBottom: 12 },
  card: {
    backgroundColor: '#16213e', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  code: { color: '#e94560', fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  badge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  meta: { color: '#aaa', fontSize: 13, marginTop: 2 },
  channel: { color: '#666', fontSize: 11, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#888', fontSize: 18, marginBottom: 8 },
  emptySubText: { color: '#555', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});
