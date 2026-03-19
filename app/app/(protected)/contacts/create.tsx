import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { hostContactsApi } from '../../../src/api/hostContacts';

export default function CreateContactScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError('Provide at least a phone number or email');
      return;
    }

    setLoading(true);
    try {
      const res = await hostContactsApi.create({
        display_name: displayName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.replace(`/(protected)/contacts/${res.data.contact.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create contact');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>New Contact</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Display Name *</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Full name or nickname"
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

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Save Contact</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24 },
  back: { marginBottom: 16 },
  backText: { color: '#e94560', fontSize: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  error: { color: '#ff6b6b', marginBottom: 16, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 16, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  button: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
