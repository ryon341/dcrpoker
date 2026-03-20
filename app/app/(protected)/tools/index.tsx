import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AdInterstitial, useAdGate } from '../../../src/components/ui/AdInterstitial';

interface ToolCardProps {
  title: string;
  description: string;
  available: boolean;
  onPress?: () => void;
}

function ToolCard({ title, description, available, onPress }: ToolCardProps) {
  return (
    <TouchableOpacity
      style={[styles.toolCard, !available && styles.toolCardDisabled]}
      onPress={available ? onPress : undefined}
      activeOpacity={available ? 0.75 : 1}
    >
      <View style={styles.toolCardHeader}>
        <Text style={[styles.toolCardTitle, !available && styles.toolCardTitleDisabled]}>
          {title}
        </Text>
        {!available && (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>Coming soon</Text>
          </View>
        )}
      </View>
      <Text style={[styles.toolCardDesc, !available && styles.toolCardDescDisabled]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

export default function ToolsPage() {
  const router = useRouter();
  const { showAd, markAdShown } = useAdGate('tools');

  return (
    <>
      <AdInterstitial visible={showAd} onDismiss={markAdShown} storageKey="tools" />
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Poker Tools</Text>
      <Text style={styles.subheading}>Practical utilities for running better home games.</Text>

      <ToolCard
        title="🎰 Chip Calculator"
        description="Estimate how many chips of each denomination you need for a cash game or tournament."
        available
        onPress={() => router.push('/(protected)/tools/chip-calculator')}
      />

      <ToolCard
        title="📊 Preflop Charts"
        description="Hand range charts for every position at the table."
        available
        onPress={() => router.push('/(protected)/tools/preflop-charts')}
      />

      <ToolCard
        title="🎯 Odds / Outs Calculator"
        description="Calculate your equity and outs on the fly."
        available
        onPress={() => router.push('/(protected)/tools/odds-calculator')}
      />

      <ToolCard
        title="🧠 Training Mode"
        description="Sharpen your game with Preflop and Odds quizzes."
        available
        onPress={() => router.push('/(protected)/tools/training')}
      />

      <ToolCard
        title="🃏 Hand Recorder"
        description="Log hands during or after play. Tag, review, and filter your history."
        available
        onPress={() => router.push('/(protected)/tools/hand-recorder')}
      />

      <ToolCard
        title="📐 EV Analyzer"
        description="Calculate pot odds, required equity, and expected value. Supports direct equity or outs mode."
        available
        onPress={() => router.push('/(protected)/tools/ev-analyzer')}
      />

      <ToolCard
        title="⏱ Tournament Clock"
        description="Manage blind levels, breaks, and level timers."
        available={false}
      />

      <ToolCard
        title="✂️ Deal Split / Chop Calculator"
        description="Negotiate fair chop deals based on chip counts."
        available={false}
      />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 40 },
  heading: {
    color: '#e94560',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  subheading: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  toolCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  toolCardDisabled: {
    opacity: 0.55,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  toolCardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
  },
  toolCardTitleDisabled: {
    color: '#bbb',
  },
  toolCardDesc: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 19,
  },
  toolCardDescDisabled: {
    color: '#666',
  },
  soonBadge: {
    backgroundColor: '#2a2a4a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
});
