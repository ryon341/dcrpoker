import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { hostContactsApi, HostContact } from '../../../src/api/hostContacts';

const STATUS_COLORS: Record<string, string> = {
  imported: '#888',
  invited: '#0f3460',
  registered: '#2ecc71',
  declined: '#e94560',
  unsubscribed: '#666',
};

export default function ContactsListScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<HostContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await hostContactsApi.list();
      setContacts(res.data.contacts);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load contacts');
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
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.importButton}
            onPress={() => router.push('/(protected)/contacts/import')}
          >
            <Text style={styles.importButtonText}>Import</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(protected)/contacts/create')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={contacts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No contacts yet.</Text>
            <Text style={styles.emptySubText}>Add your first prospect to get started.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(protected)/contacts/${item.id}`)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.name}>{item.display_name}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || '#444' }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            {item.phone ? <Text style={styles.meta}>{item.phone}</Text> : null}
            {item.email ? <Text style={styles.meta}>{item.email}</Text> : null}
            <Text style={styles.source}>via {item.source}</Text>
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
  headerButtons: { flexDirection: 'row', gap: 8 },
  importButton: { backgroundColor: '#0f3460', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  importButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  addButton: { backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  error: { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 20, marginBottom: 12 },
  card: {
    backgroundColor: '#16213e', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  badge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  meta: { color: '#aaa', fontSize: 13, marginTop: 2 },
  source: { color: '#666', fontSize: 11, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#888', fontSize: 18, marginBottom: 8 },
  emptySubText: { color: '#555', fontSize: 14 },
});
