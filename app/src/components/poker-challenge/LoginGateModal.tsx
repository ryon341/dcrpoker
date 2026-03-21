import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../ui/Theme';

interface Props {
  visible: boolean;
  onStartOver: () => void;
  onClose: () => void;
}

export function LoginGateModal({ visible, onStartOver, onClose }: Props) {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Save Your Progress 🏆</Text>

          <Text style={s.body}>
            Levels 1–5 are free to play for everyone.{'\n\n'}
            Level 6 and beyond requires a free account — sign up to save your run,
            unlock all levels, and track your leaderboard position.
          </Text>

          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.push('/(auth)/login' as any)}
          >
            <Text style={s.primaryBtnText}>Log In / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryBtn} onPress={onStartOver}>
            <Text style={s.secondaryBtnText}>Start Over at Level 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111115',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.gold,
    padding: 28,
    alignItems: 'center',
  },
  title: {
    color: T.gold,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },
  body: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: T.gold,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryBtn: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtnText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 14,
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeBtnText: {
    color: T.muted,
    fontSize: 13,
  },
});
