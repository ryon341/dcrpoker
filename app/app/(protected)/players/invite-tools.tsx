import { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Share, Alert, RefreshControl,
} from 'react-native';
import { externalInvitesApi, ExternalInvite } from '../../../src/api/externalInvites';

const CHANNELS = ['sms', 'email', 'link'] as const;

export default function InviteToolsScreen() {
  const [loading, setLoading] = useState(false);
  const [myInvites, setMyInvites] = useState<ExternalInvite[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [channel, setChannel] = useState<typeof CHANNELS[number]>('link');

  const loadInvites = useCallback(async (silent = false) => {
    if (!silent) setListLoading(true);
    try {
      const res = await externalInvitesApi.list();
      setMyInvites(res.data.invites.slice(0, 20));
    } catch {
      // non-fatal
    } finally {
      setListLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on mount
  useState(() => { loadInvites(); });

  async function createAndShare() {
    setLoading(true);
    setError('');
    try {
      const res = await externalInvitesApi.create({ channel });
      const invite = res.data.invite;
      const url = invite.invite_url;

      await Share.share({
        message: `Join me on DCR Poker! Tap to create your player profile: ${url}`,
        url,
        title: 'DCR Poker Invite',
      });

      // Refresh list
      loadInvites(true);
    } catch (e: any) {
      if (e.message !== 'User did not share') {
        setError(e.message || 'Failed to create invite');
      }
    } finally {
      setLoading(false);
    }
  }

  async function shareExisting(invite: ExternalInvite) {
    try {
      await Share.share({
        message: `Join me on DCR Poker! Tap to create your player profile: ${invite.invite_url}`,
        url: invite.invite_url,
        title: 'DCR Poker Invite',
      });
    } catch {
      // dismissed
    }
  }

  function statusColor(s: string) {
    if (s === 'accepted') return '#4caf50';
    if (s === 'expired')  return '#888';
    return '#e94560';
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadInvites(true); }} tintColor="#e94560" />}
    >
      <Text style={s.pageTitle}>🔗 Invite Tools</Text>
      <Text style={s.pageSubtitle}>Generate shareable invite links to grow your player list. New players who tap your link are automatically connected to your roster.</Text>

      {/* Channel selector */}
      <View style={s.card}>
        <Text style={s.cardLabel}>Channel</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          {CHANNELS.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.chip, channel === c ? s.chipActive : null]}
              onPress={() => setChannel(c)}
            >
              <Text style={[s.chipText, channel === c ? s.chipTextActive : null]}>
                {c === 'sms' ? '💬 SMS' : c === 'email' ? '📧 Email' : '🔗 Link'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.channelHint}>
          {channel === 'sms'   ? 'Sends via SMS — recipient\'s phone will be logged.'
          : channel === 'email' ? 'Sends via email — recipient\'s email will be logged.'
          : 'General link — share anywhere (text, social, etc.)'}
        </Text>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity style={[s.btn, loading ? s.btnDisabled : null]} onPress={createAndShare} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Generate & Share Invite Link</Text>}
      </TouchableOpacity>

      {/* Existing invites */}
      <Text style={s.sectionTitle}>Recent Invites</Text>

      {listLoading ? <ActivityIndicator color="#e94560" style={{ marginTop: 12 }} /> : null}

      {!listLoading && myInvites.length === 0 ? (
        <Text style={s.emptyText}>No invites yet. Generate one above!</Text>
      ) : null}

      {myInvites.map(inv => (
        <View key={inv.id} style={s.inviteRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.inviteCode} numberOfLines={1}>{inv.invite_url}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <View style={[s.statusBadge, { borderColor: statusColor(inv.status) }]}>
                <Text style={[s.statusText, { color: statusColor(inv.status) }]}>{inv.status.toUpperCase()}</Text>
              </View>
              <Text style={s.inviteMeta}>{inv.channel} · {new Date(inv.created_at).toLocaleDateString()}</Text>
              {inv.recipient_phone ? <Text style={s.inviteMeta}>{inv.recipient_phone}</Text> : null}
            </View>
          </View>
          {inv.status === 'pending' && (
            <TouchableOpacity style={s.shareBtn} onPress={() => shareExisting(inv)}>
              <Text style={s.shareBtnText}>↗ Share</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 60 },

  pageTitle:    { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  pageSubtitle: { color: '#888', fontSize: 13, marginBottom: 16, lineHeight: 18 },

  card:        { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  cardLabel:   { color: '#aaa', fontSize: 12, fontWeight: 'bold' },
  channelHint: { color: '#666', fontSize: 12, marginTop: 8 },

  chip:          { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#0f1a2e', borderWidth: 1, borderColor: '#2a2a4a' },
  chipActive:    { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:      { color: '#aaa', fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },

  error:      { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },

  btn:         { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  btnDisabled: { opacity: 0.5 },
  btnText:     { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  sectionTitle: { color: '#aaa', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  emptyText:    { color: '#555', textAlign: 'center', marginTop: 12 },

  inviteRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a', gap: 10 },
  inviteCode:   { color: '#7ab8ff', fontSize: 12, fontFamily: 'monospace' },
  inviteMeta:   { color: '#888', fontSize: 12 },
  statusBadge:  { borderRadius: 4, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1 },
  statusText:   { fontSize: 10, fontWeight: 'bold' },
  shareBtn:     { backgroundColor: '#0f3460', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10 },
  shareBtnText: { color: '#7ab8ff', fontSize: 12, fontWeight: 'bold' },
});
