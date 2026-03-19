import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { messageTemplatesApi, MessageTemplate } from '../../../../src/api/messageTemplates';

const CHANNEL_COLORS: Record<string, string> = {
  sms: '#0f3460',
  email: '#5a3a00',
};

export default function TemplatesListScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await messageTemplatesApi.list();
      setTemplates(res.data.templates);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load templates');
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
        <Text style={styles.title}>Templates</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(protected)/messages/templates/create')}
        >
          <Text style={styles.createBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No templates yet.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(protected)/messages/templates/create')}
            >
              <Text style={styles.emptyBtnText}>Create First Template</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(protected)/messages/templates/${item.id}`)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: CHANNEL_COLORS[item.channel] || '#333' }]}>
                  <Text style={styles.badgeText}>{item.channel.toUpperCase()}</Text>
                </View>
                {!item.is_active && (
                  <View style={[styles.badge, { backgroundColor: '#3a2a2a' }]}>
                    <Text style={styles.badgeText}>inactive</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.preview} numberOfLines={2}>
              {item.body}
            </Text>
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
  createBtn: { backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  error: { color: '#ff6b6b', textAlign: 'center', marginHorizontal: 20, marginBottom: 12 },
  card: {
    backgroundColor: '#16213e', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  preview: { color: '#aaa', fontSize: 13, lineHeight: 18 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyText: { color: '#888', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  emptyBtn: { backgroundColor: '#e94560', borderRadius: 8, padding: 14, alignItems: 'center' },
  emptyBtnText: { color: '#fff', fontWeight: 'bold' },
});
