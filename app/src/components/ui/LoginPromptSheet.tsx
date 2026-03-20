import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from './Theme';

interface Props {
  visible: boolean;
  featureName: string;
  onDismiss: () => void;
  returnTo?: string;
}

export function LoginPromptSheet({ visible, featureName, onDismiss, returnTo }: Props) {
  const router = useRouter();
  const q = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';

  function goLogin() {
    onDismiss();
    router.push(`/(auth)/login${q}` as any);
  }

  function goRegister() {
    onDismiss();
    router.push(`/(auth)/register${q}` as any);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onDismiss} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.title}>Sign in to continue</Text>
        <Text style={s.body}>
          Create a free account to use <Text style={s.feature}>{featureName}</Text> and manage your games, invitations, and player lists.
        </Text>
        <View style={s.bullets}>
          {[
            '🎮  Find games near you',
            '🃏  Host and manage your own games',
            '📨  Send and track invitations',
            '💬  Message players directly',
          ].map(b => (
            <Text key={b} style={s.bullet}>{b}</Text>
          ))}
        </View>
        <TouchableOpacity style={s.primaryBtn} onPress={goRegister} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Create Free Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.ghostBtn} onPress={goLogin} activeOpacity={0.7}>
          <Text style={s.ghostBtnText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelBtn} onPress={onDismiss}>
          <Text style={s.cancelText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: T.cardBorder,
    padding: 28,
    paddingBottom: 44,
    gap: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: T.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    color: T.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    color: T.silver,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  feature: {
    color: T.gold,
    fontWeight: '600',
  },
  bullets: {
    gap: 8,
    marginBottom: 24,
  },
  bullet: {
    color: T.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: T.gold,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#0c0a09',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ghostBtn: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.cardBorder,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  ghostBtnText: {
    color: T.silver,
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: T.faint,
    fontSize: 13,
  },
});
