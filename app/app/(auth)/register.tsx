import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { pendingInvite } from '../../src/utils/pendingInvite';
import { T } from '../../src/components/ui/Theme';

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
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Atmosphere glow — top */}
      <View style={s.glowTop} pointerEvents="none" />

      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        {/* Logo area */}
        <View style={s.logoArea}>
          <Image
            source={require('../../assets/logo.png')}
            style={s.logoImg}
            resizeMode="contain"
          />
          <Text style={s.tagline}>Private games · Tools · Training · Bankroll</Text>
        </View>

        {/* Register card */}
        <View style={s.card}>
          <Text style={s.eyebrow}>New account</Text>
          <Text style={s.cardTitle}>Join DCR Poker</Text>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <View style={s.field}>
            <Text style={s.label}>Display Name <Text style={s.required}>*</Text></Text>
            <TextInput
              style={s.input}
              placeholder="Your name"
              placeholderTextColor={T.muted}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Phone Number <Text style={s.required}>*</Text></Text>
            <TextInput
              style={s.input}
              placeholder="+15550001234"
              placeholderTextColor={T.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              autoCapitalize="none"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Email <Text style={s.optional}>(optional)</Text></Text>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={T.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <TouchableOpacity
            style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#0c0a09" />
              : <Text style={s.primaryBtnText}>Create Account</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>already have an account?</Text>
            <View style={s.dividerLine} />
          </View>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={s.ghostBtn} activeOpacity={0.7}>
              <Text style={s.ghostBtnText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={s.footer}>Deer Creek Road Poker · premium tools for serious players</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: T.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 48 },

  // Atmosphere
  glowTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 320,
    backgroundColor: 'rgba(180,138,58,0.07)',
    borderBottomLeftRadius: 320, borderBottomRightRadius: 320,
  },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoImg:  { height: 72, width: 160 },
  tagline:  { color: T.muted, fontSize: 13, marginTop: 14, letterSpacing: 0.3, textAlign: 'center' },

  // Card
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: T.cardBorder,
    backgroundColor: T.cardGlass,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  eyebrow: {
    color: 'rgba(251,191,36,0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  cardTitle: {
    color: T.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  // Fields
  field:    { marginBottom: 18 },
  label:    { color: T.silver, fontSize: 14, fontWeight: '500', marginBottom: 8 },
  required: { color: T.gold },
  optional: { color: T.muted, fontWeight: '400' },
  input: {
    backgroundColor: T.inputBg,
    borderWidth: 1,
    borderColor: T.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: T.white,
    fontSize: 16,
  },

  // Primary button
  primaryBtn:         { backgroundColor: T.gold, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText:     { color: '#0c0a09', fontSize: 16, fontWeight: 'bold' },

  // Divider
  dividerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerLabel: { color: T.muted, fontSize: 12, marginHorizontal: 10 },

  // Ghost button
  ghostBtn:     { borderRadius: 16, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 14, alignItems: 'center' },
  ghostBtnText: { color: T.silver, fontSize: 15, fontWeight: '600' },

  // Error / footer
  error:  { color: '#fb7185', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  footer: { color: T.faint, fontSize: 11, textAlign: 'center', marginTop: 28 },
});
