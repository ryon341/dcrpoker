import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, RefreshControl,
} from 'react-native';
import { notificationsApi, AppNotification } from '../../../src/api/notifications';

const TYPE_ICONS: Record<string, string> = {
  promoted_from_waitlist: '🎉',
  rsvp_status_changed:    '📋',
  game_invite:            '🃏',
  game_updated:           '📝',
  seat_assigned:          '💺',
};

function NotifItem({
  notif, onMarkRead,
}: {
  notif: AppNotification;
  onMarkRead: (id: number) => void;
}) {
  const icon = TYPE_ICONS[notif.type] || '🔔';
  const unread = !notif.is_read;
  return (
    <TouchableOpacity
      style={[s.item, unread ? s.itemUnread : null]}
      onPress={() => !notif.is_read && onMarkRead(notif.id)}
      activeOpacity={0.8}
    >
      <Text style={s.itemIcon}>{icon}</Text>
      <View style={s.itemBody}>
        <Text style={[s.itemTitle, unread ? s.itemTitleUnread : null]}>{notif.title}</Text>
        <Text style={s.itemText}>{notif.body}</Text>
        <Text style={s.itemDate}>{new Date(notif.created_at).toLocaleString()}</Text>
      </View>
      {unread ? <View style={s.unreadDot} /> : null}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await notificationsApi.list();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (e: any) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markRead(id: number) {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  }

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  }

  if (loading) {
    return <View style={s.center}><ActivityIndicator size="large" color="#e94560" /></View>;
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor="#e94560" />}
    >
      <View style={s.header}>
        <Text style={s.title}>🔔 Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity style={s.markAllBtn} onPress={markAllRead}>
            <Text style={s.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      {notifications.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🔔</Text>
          <Text style={s.emptyText}>No notifications yet</Text>
          <Text style={s.emptySubtext}>You'll see activity here when things happen in your games.</Text>
        </View>
      ) : (
        notifications.map(n => (
          <NotifItem key={n.id} notif={n} onMarkRead={markRead} />
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 50 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  error:     { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },

  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title:        { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  markAllBtn:   { backgroundColor: '#16213e', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#2a2a4a' },
  markAllText:  { color: '#aaa', fontSize: 13 },

  item:         { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4a' },
  itemUnread:   { borderColor: '#e94560', backgroundColor: '#1e1e3a' },
  itemIcon:     { fontSize: 22, marginRight: 12, marginTop: 2 },
  itemBody:     { flex: 1 },
  itemTitle:    { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  itemTitleUnread: { color: '#fff' },
  itemText:     { color: '#888', fontSize: 13, marginBottom: 4 },
  itemDate:     { color: '#555', fontSize: 11 },
  unreadDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e94560', marginTop: 6, marginLeft: 8 },

  empty:        { alignItems: 'center', paddingTop: 60 },
  emptyIcon:    { fontSize: 48, marginBottom: 16 },
  emptyText:    { color: '#aaa', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubtext: { color: '#666', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
});
