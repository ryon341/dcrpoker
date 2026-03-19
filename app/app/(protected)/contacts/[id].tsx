import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hostContactsApi, HostContact } from '../../../src/api/hostContacts';

const STATUS_OPTIONS = ['imported', 'invited', 'registered', 'declined', 'unsubscribed'];

export default function ContactDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [contact, setContact] = useState<HostContact | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    hostContactsApi.get(id!)
      .then((res) => {
        const c = res.data.contact;
        setContact(c);
        setDisplayName(c.display_name);
        setPhone(c.phone || '');
        setEmail(c.email || '');
        setNotes(c.notes || '');
        setStatus(c.status);
      })
      .catch((e) => setError(e.message || 'Failed to load contact'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setError('');
    setSaved(false);
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await hostContactsApi.update(id!, {
        display_name: displayName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
        status,
      });
      setContact(res.data.contact);
      setSaved(true);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Contact not found'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Contacts</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{contact.display_name}</Text>

      {contact.registered_user_id ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>✓ Registered — User ID {contact.registered_user_id}</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {saved ? <Text style={styles.success}>Saved successfully</Text> : null}

      <Text style={styles.label}>Display Name *</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholderTextColor="#555"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+15551234567"
        placeholderTextColor="#555"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes..."
        placeholderTextColor="#555"
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.chips}>
        {STATUS_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, status === s && styles.chipActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Save Changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => router.push(`/(protected)/invites/create?contact_id=${id}&contact_name=${encodeURIComponent(displayName)}`)}
      >
        <Text style={styles.buttonText}>Generate Invite</Text>
      </TouchableOpacity>

      <Text style={styles.meta}>Source: {contact.source}</Text>
      <Text style={styles.meta}>Created: {new Date(contact.created_at).toLocaleDateString()}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24 },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  back: { marginBottom: 16 },
  backText: { color: '#e94560', fontSize: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  infoBox: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 12, marginBottom: 16,
  },
  infoText: { color: '#7ec8e3', fontSize: 13 },
  error: { color: '#ff6b6b', marginBottom: 12, textAlign: 'center' },
  errorText: { color: '#ff6b6b', fontSize: 16, marginBottom: 12 },
  success: { color: '#2ecc71', marginBottom: 12, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 16, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  chipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText: { color: '#aaa', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 16,
    alignItems: 'center', marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  meta: { color: '#555', fontSize: 12, marginBottom: 4 },
});
