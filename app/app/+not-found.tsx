import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <Text style={s.code}>404</Text>
      <Text style={s.title}>Page Not Found</Text>
      <Text style={s.sub}>This screen doesn't exist.</Text>
      <TouchableOpacity style={s.btn} onPress={() => router.replace('/')}>
        <Text style={s.btnText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', padding: 24 },
  code:  { color: '#e94560', fontSize: 64, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  sub:   { color: '#888', fontSize: 14, marginTop: 6, marginBottom: 24 },
  btn:   { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 28 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
