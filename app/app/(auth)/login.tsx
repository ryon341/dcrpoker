import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { pendingInvite } from '../../src/utils/pendingInvite';
import { T } from '../../src/components/ui/Theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(phone.trim());
      const code = await pendingInvite.get();
      if (code) {
        await pendingInvite.clear();
        router.replace(`/invite/${code}`);
        return;
      }
      if (returnTo && !returnTo.startsWith('/(auth)')) {
        router.replace(returnTo as any);
        return;
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
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
      {/* Atmosphere glow — bottom */}
      <View style={s.glowBottom} pointerEvents="none" />

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

        {/* Login card */}
        <View style={s.card}>
          <Text style={s.eyebrow}>Sign in</Text>
          <Text style={s.cardTitle}>Welcome back</Text>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <View style={s.field}>
            <Text style={s.label}>Phone Number</Text>
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

          <TouchableOpacity
            style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#0c0a09" />
              : <Text style={s.primaryBtnText}>Sign In</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>or</Text>
            <View style={s.dividerLine} />
          </View>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={s.ghostBtn} activeOpacity={0.7}>
              <Text style={s.ghostBtnText}>Create an account</Text>
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

  // Atmosphere overlays
  glowTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 320,
    backgroundColor: 'rgba(180,138,58,0.07)',
    borderBottomLeftRadius: 320, borderBottomRightRadius: 320,
  },
  glowBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
    backgroundColor: 'rgba(120,72,28,0.05)',
    borderTopLeftRadius: 200, borderTopRightRadius: 200,
  },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoImg:  { height: 80, width: 180 },
  tagline:  { color: T.muted, fontSize: 13, marginTop: 16, letterSpacing: 0.3, textAlign: 'center' },

  // Card — glass effect
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

  // Form fields
  field: { marginBottom: 20 },
  label: { color: T.silver, fontSize: 14, fontWeight: '500', marginBottom: 8 },
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

  // Primary button — amber
  primaryBtn: {
    backgroundColor: T.gold,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { color: '#0c0a09', fontSize: 16, fontWeight: 'bold' },

  // Divider
  dividerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerLabel: { color: T.muted, fontSize: 13, marginHorizontal: 12 },

  // Ghost button
  ghostBtn: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  ghostBtnText: { color: T.silver, fontSize: 15, fontWeight: '600' },

  // Error
  error: { color: '#fb7185', fontSize: 13, marginBottom: 16, textAlign: 'center' },

  // Footer
  footer: { color: T.faint, fontSize: 11, textAlign: 'center', marginTop: 28 },
});
