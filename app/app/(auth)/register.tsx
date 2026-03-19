import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { pendingInvite } from '../../src/utils/pendingInvite';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        phone: phone.trim(),
        display_name: displayName.trim(),
        email: email.trim() || undefined,
      });
      // Check for pending invite redirect
      const code = await pendingInvite.get();
      if (code) {
        await pendingInvite.clear();
        router.replace(`/invite/${code}`);
        return;
      }
      // Navigation handled by root layout
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>DCR Poker</Text>
        <Text style={styles.title}>Create Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Display Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#666"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="+15550001234"
          placeholderTextColor="#666"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Create Account</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          Already have an account? Sign In
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 22, color: '#fff', textAlign: 'center', marginBottom: 32 },
  label: { color: '#ccc', marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#ff6b6b', marginBottom: 16, textAlign: 'center' },
  link: { color: '#4a90e2', textAlign: 'center', marginTop: 20, fontSize: 15 },
});
