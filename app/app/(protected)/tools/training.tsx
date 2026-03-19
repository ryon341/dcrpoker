import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import AudiobookGrid from '../../../src/components/AudiobookGrid';

export default function TrainingPage() {
  const router = useRouter();

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.heading}>Training Mode</Text>
      <Text style={s.sub}>Test your poker knowledge with interactive quizzes.</Text>

      <TouchableOpacity
        style={s.card}
        onPress={() => router.push('/(protected)/tools/training-preflop')}
        activeOpacity={0.75}
      >
        <Text style={s.cardIcon}>📊</Text>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>Preflop Trainer</Text>
          <Text style={s.cardDesc}>
            Given a hand, position, and stack depth — should you raise or fold?
          </Text>
        </View>
        <Text style={s.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.card}
        onPress={() => router.push('/(protected)/tools/training-odds')}
        activeOpacity={0.75}
      >
        <Text style={s.cardIcon}>🎯</Text>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>Odds Trainer</Text>
          <Text style={s.cardDesc}>
            Estimate your equity by the river given a draw type or outs count.
          </Text>
        </View>
        <Text style={s.arrow}>›</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 40 }}>
        <Text style={s.sectionTitle}>Learn from the Best</Text>
        <AudiobookGrid />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 40 },
  heading: {
    color: '#e94560',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  sub: { color: '#aaa', fontSize: 14, marginBottom: 28 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardIcon:  { fontSize: 30, marginRight: 14 },
  cardBody:  { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  cardDesc:  { color: '#aaa', fontSize: 13, lineHeight: 18 },
  arrow:     { color: '#555', fontSize: 24, marginLeft: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
});
