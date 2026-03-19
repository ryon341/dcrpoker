import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { externalInvitesApi, InvitePreview } from '../../src/api/externalInvites';
import { useAuth } from '../../src/context/AuthContext';
import { pendingInvite } from '../../src/utils/pendingInvite';

export default function InviteLandingScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { user } = useAuth();

  const [preview, setPreview] = useState<{ valid: boolean; invite: InvitePreview; reason?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState('');

  useEffect(() => {
    if (!code) {
      setError('No invite code provided');
      setLoading(false);
      return;
    }

    externalInvitesApi.preview(code)
      .then((res) => setPreview(res.data))
      .catch((e) => setError(e.message || 'Failed to load invite'))
      .finally(() => setLoading(false));
  }, [code]);

  async function handleAccept() {
    if (!user) {
      // Store the code and send to login
      await pendingInvite.set(code!);
      router.push('/(auth)/login');
      return;
    }

    setAcceptError('');
    setAccepting(true);
    try {
      await externalInvitesApi.accept(code!);
      setAccepted(true);
      await pendingInvite.clear();
    } catch (e: any) {
      setAcceptError(e.message || 'Could not accept invite');
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (error || !preview) {
    return (
      <View style={styles.center}>
        <Text style={styles.logoText}>DCR Poker</Text>
        <Text style={styles.errorText}>{error || 'Invite not found'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!preview.valid) {
    return (
      <View style={styles.center}>
        <Text style={styles.logoText}>DCR Poker</Text>
        <View style={styles.invalidBox}>
          <Text style={styles.invalidTitle}>Invite Unavailable</Text>
          <Text style={styles.invalidReason}>
            This invite is {preview.reason || 'no longer valid'}.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const invite = preview.invite;

  if (accepted) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.logoText}>DCR Poker</Text>
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>You're in!</Text>
          <Text style={styles.successText}>
            You've been added to {invite.host_display_name}'s network.
          </Text>
          {invite.game_name ? (
            <Text style={styles.successText}>
              You've also been invited to: {invite.game_name}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(protected)')}
        >
          <Text style={styles.buttonText}>Go to My Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.logoText}>DCR Poker</Text>

      <View style={styles.card}>
        <Text style={styles.invitedBy}>You've been invited by</Text>
        <Text style={styles.hostName}>{invite.host_display_name}</Text>

        {invite.game_name ? (
          <View style={styles.gameInfo}>
            <Text style={styles.gameLabel}>to join the game</Text>
            <Text style={styles.gameName}>{invite.game_name}</Text>
            {invite.game_date ? (
              <Text style={styles.gameDate}>{new Date(invite.game_date).toLocaleDateString()}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {acceptError ? <Text style={styles.errorText}>{acceptError}</Text> : null}

      {user ? (
        <TouchableOpacity
          style={[styles.button, accepting && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={accepting}
        >
          {accepting
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Accept Invite</Text>}
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.authPrompt}>Sign in or create an account to accept this invite</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await pendingInvite.set(code!);
              router.push('/(auth)/login');
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={async () => {
              await pendingInvite.set(code!);
              router.push('/(auth)/register');
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 32 },
  card: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 24,
    borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center', marginBottom: 28,
  },
  invitedBy: { color: '#888', fontSize: 14, marginBottom: 6 },
  hostName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  gameInfo: { alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2a2a4a', paddingTop: 16, width: '100%' },
  gameLabel: { color: '#888', fontSize: 13, marginBottom: 4 },
  gameName: { color: '#e94560', fontSize: 17, fontWeight: 'bold' },
  gameDate: { color: '#aaa', fontSize: 13, marginTop: 4 },
  authPrompt: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 16,
    alignItems: 'center', marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ff6b6b', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  invalidBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 20,
    borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center', marginBottom: 24,
  },
  invalidTitle: { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  invalidReason: { color: '#aaa', fontSize: 14 },
  successBox: {
    backgroundColor: '#0d2b1a', borderRadius: 10, padding: 20,
    borderWidth: 1, borderColor: '#2ecc71', alignItems: 'center', marginBottom: 28,
  },
  successTitle: { color: '#2ecc71', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  successText: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 4 },
});
