import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { externalInvitesApi, ExternalInvite } from '../../../src/api/externalInvites';
import { API_BASE_URL } from '../../../src/api/client';

export default function InviteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [invite, setInvite] = useState<ExternalInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    externalInvitesApi.get(id!)
      .then((res) => setInvite(res.data.invite))
      .catch((e) => setError(e.message || 'Failed to load invite'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (!invite) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Invite not found'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const inviteUrl = invite.invite_url || `${API_BASE_URL}/invite/${invite.invite_code}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Invites</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Invite Detail</Text>

      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>Invite Code</Text>
        <Text style={styles.codeValue}>{invite.invite_code}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(invite.status) }]}>
          <Text style={styles.badgeText}>{invite.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invite URL</Text>
        <Text style={styles.urlValue} selectable>{inviteUrl}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipient</Text>
        {invite.recipient_phone ? (
          <Row label="Phone" value={invite.recipient_phone} />
        ) : null}
        {invite.recipient_email ? (
          <Row label="Email" value={invite.recipient_email} />
        ) : null}
        {!invite.recipient_phone && !invite.recipient_email ? (
          <Text style={styles.metaValue}>—</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Row label="Channel" value={invite.channel} />
        {invite.host_contact_id ? (
          <Row label="Contact ID" value={String(invite.host_contact_id)} />
        ) : null}
        {invite.game_id ? (
          <Row label="Game ID" value={String(invite.game_id)} />
        ) : null}
        {invite.accepted_at ? (
          <Row label="Accepted" value={new Date(invite.accepted_at).toLocaleString()} />
        ) : null}
        {invite.registered_user_id ? (
          <Row label="Registered User" value={`#${invite.registered_user_id}`} />
        ) : null}
        {invite.expires_at ? (
          <Row label="Expires" value={new Date(invite.expires_at).toLocaleString()} />
        ) : null}
        <Row label="Created" value={new Date(invite.created_at).toLocaleString()} />
      </View>

      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => router.push(`/invite/${invite.invite_code}`)}
      >
        <Text style={styles.buttonText}>Open Invite Preview</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
      <Text style={{ color: '#888', fontSize: 13, width: 120 }}>{label}</Text>
      <Text style={{ color: '#ccc', fontSize: 13, flex: 1 }}>{value}</Text>
    </View>
  );
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    generated: '#0f3460', sent: '#d4a017',
    accepted: '#2ecc71', expired: '#666', cancelled: '#e94560',
  };
  return map[s] || '#444';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24 },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  back: { marginBottom: 16 },
  backText: { color: '#e94560', fontSize: 15 },
  errorText: { color: '#ff6b6b', fontSize: 16, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  codeBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center',
  },
  codeLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  codeValue: { color: '#e94560', fontSize: 22, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 8 },
  badge: { borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  section: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  sectionTitle: { color: '#e94560', fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  urlValue: { color: '#7ec8e3', fontSize: 13, fontFamily: 'monospace' },
  metaValue: { color: '#666', fontSize: 13 },
  previewButton: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
