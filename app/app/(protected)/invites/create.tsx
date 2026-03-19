import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { externalInvitesApi } from '../../../src/api/externalInvites';
import { API_BASE_URL } from '../../../src/api/client';

type FlowMode = 'contact' | 'direct';
type Channel = 'manual' | 'sms' | 'email';

const CHANNELS: Channel[] = ['manual', 'sms', 'email'];

export default function CreateInviteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ contact_id?: string; contact_name?: string }>();

  // Determine initial flow based on whether we arrived from a contact
  const [mode, setMode] = useState<FlowMode>(params.contact_id ? 'contact' : 'direct');

  // Flow A — from contact
  const [contactId, setContactId] = useState(params.contact_id || '');
  const [contactName] = useState(params.contact_name ? decodeURIComponent(params.contact_name) : '');

  // Flow B — direct
  const [directName, setDirectName] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directEmail, setDirectEmail] = useState('');

  // Shared
  const [gameId, setGameId] = useState('');
  const [channel, setChannel] = useState<Channel>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ code: string; url: string; id: number } | null>(null);

  async function handleSubmit() {
    setError('');
    if (mode === 'direct' && !directName.trim()) {
      setError('Display name is required for a direct invite');
      return;
    }
    if (mode === 'contact' && !contactId.trim()) {
      setError('Contact ID is required');
      return;
    }

    setLoading(true);
    try {
      const body =
        mode === 'contact'
          ? {
              host_contact_id: Number(contactId),
              game_id: gameId ? Number(gameId) : undefined,
              channel,
            }
          : {
              contact_display_name: directName.trim(),
              recipient_phone: directPhone.trim() || undefined,
              recipient_email: directEmail.trim() || undefined,
              game_id: gameId ? Number(gameId) : undefined,
              channel,
            };

      const res = await externalInvitesApi.create(body);
      const invite = res.data.invite;
      setCreated({
        code: invite.invite_code,
        url: invite.invite_url || `${API_BASE_URL}/invite/${invite.invite_code}`,
        id: invite.id,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to generate invite');
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.successTitle}>Invite Created!</Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Invite Code</Text>
          <Text style={styles.codeValue}>{created.code}</Text>
        </View>

        <View style={styles.urlBox}>
          <Text style={styles.urlLabel}>Invite URL</Text>
          <Text style={styles.urlValue} selectable>{created.url}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace(`/(protected)/invites/${created.id}`)}
        >
          <Text style={styles.buttonText}>View Invite Detail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/(protected)/invites')}
        >
          <Text style={styles.buttonText}>All Invites</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Generate Invite</Text>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'contact' && styles.modeTabActive]}
          onPress={() => setMode('contact')}
        >
          <Text style={[styles.modeTabText, mode === 'contact' && styles.modeTabTextActive]}>
            From Contact
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'direct' && styles.modeTabActive]}
          onPress={() => setMode('direct')}
        >
          <Text style={[styles.modeTabText, mode === 'direct' && styles.modeTabTextActive]}>
            Direct Prospect
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {mode === 'contact' ? (
        <>
          {contactName ? (
            <View style={styles.contactPreview}>
              <Text style={styles.contactPreviewText}>Contact: {contactName}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.label}>Contact ID</Text>
              <TextInput
                style={styles.input}
                value={contactId}
                onChangeText={setContactId}
                placeholder="e.g. 12"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}>Display Name *</Text>
          <TextInput
            style={styles.input}
            value={directName}
            onChangeText={setDirectName}
            placeholder="Prospect's name"
            placeholderTextColor="#555"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={directPhone}
            onChangeText={setDirectPhone}
            placeholder="+15551234567"
            placeholderTextColor="#555"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={directEmail}
            onChangeText={setDirectEmail}
            placeholder="email@example.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </>
      )}

      <Text style={styles.label}>Game ID (optional)</Text>
      <TextInput
        style={styles.input}
        value={gameId}
        onChangeText={setGameId}
        placeholder="Leave blank for no game"
        placeholderTextColor="#555"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Channel</Text>
      <View style={styles.chips}>
        {CHANNELS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, channel === c && styles.chipActive]}
            onPress={() => setChannel(c)}
          >
            <Text style={[styles.chipText, channel === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Generate Invite Link</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24 },
  back: { marginBottom: 16 },
  backText: { color: '#e94560', fontSize: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  modeRow: { flexDirection: 'row', marginBottom: 24, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a4a' },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#16213e' },
  modeTabActive: { backgroundColor: '#0f3460' },
  modeTabText: { color: '#666', fontSize: 14 },
  modeTabTextActive: { color: '#fff', fontWeight: 'bold' },
  error: { color: '#ff6b6b', marginBottom: 16, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 16, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  contactPreview: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 14, marginBottom: 20,
  },
  contactPreviewText: { color: '#7ec8e3', fontSize: 15 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: {
    borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 6,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText: { color: '#aaa', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  primaryButton: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successTitle: { fontSize: 26, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center', marginBottom: 28, marginTop: 20 },
  codeBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center',
  },
  codeLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  codeValue: { color: '#e94560', fontSize: 22, fontWeight: 'bold', fontFamily: 'monospace' },
  urlBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  urlLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  urlValue: { color: '#7ec8e3', fontSize: 13, fontFamily: 'monospace' },
});
