import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function MessagesHomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Messaging</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Level 1 sends through your device — no messages are sent by DCR Poker.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(protected)/messages/compose?source=game')}
      >
        <Text style={styles.cardTitle}>📅 Message a Game</Text>
        <Text style={styles.cardDesc}>
          Choose a game and message its invited players.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(protected)/messages/compose?source=players')}
      >
        <Text style={styles.cardTitle}>👥 Message My Players</Text>
        <Text style={styles.cardDesc}>
          Select players from your private roster and send a message.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(protected)/messages/templates')}
      >
        <Text style={styles.cardTitle}>📋 Templates</Text>
        <Text style={styles.cardDesc}>
          Create and reuse saved message templates.
        </Text>
      </TouchableOpacity>

      <Text style={styles.upgrade}>
        Upgrade for automated SMS sending.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingTop: 48, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  notice: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 14, marginBottom: 24,
    borderLeftWidth: 4, borderLeftColor: '#e94560',
  },
  noticeText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 20,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  cardDesc: { color: '#aaa', fontSize: 13, lineHeight: 19 },
  upgrade: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
});
