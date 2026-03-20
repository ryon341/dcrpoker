import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArcadeGameCard } from '../../../src/features/arcade/components/ArcadeGameCard';
import { useArcadeStats } from '../../../src/features/arcade/hooks/useArcadeStats';
import { useAuth } from '../../../src/context/AuthContext';
import { LoginPromptSheet } from '../../../src/components/ui/LoginPromptSheet';
import { T } from '../../../src/components/ui/Theme';
import { AdInterstitial, useAdGate } from '../../../src/components/ui/AdInterstitial';

const GAMES = [
  { id: 'outs',      icon: '🃏', title: 'Outs Calculator',       route: '/(protected)/arcade/outs',       desc: 'Count your draws fast. 10-question quiz sessions.' },
  { id: 'nuts',      icon: '🥜', title: 'Spot the Nuts',         route: '/(protected)/arcade/nuts',       desc: 'Find the unbeatable hand on any board.' },
  { id: 'chip_stack',icon: '🪙', title: 'Chip Stack Builder',    route: '/(protected)/arcade/chip-stack', desc: 'Drop chips with precision. How high can you stack?' },
  { id: 'memory',    icon: '🧠', title: 'Card Memory',           route: '/(protected)/arcade/memory',     desc: 'Match the deck pairs as fast as you can.' },
  { id: 'solitaire', icon: '♠️', title: 'Swipe Poker Solitaire', route: '/(protected)/arcade/solitaire',  desc: 'Choose the best five from seven cards.' },
  { id: 'blackjack', icon: '🎴', title: 'Mini Blackjack',        route: '/(protected)/arcade/blackjack',  desc: 'Fast blackjack, no betting. 5-round sessions.' },
  { id: 'reaction',  icon: '⚡', title: 'Reaction Timer',        route: '/(protected)/arcade/reaction',   desc: 'Test your dealer reflexes. 5 attempts.' },
];

export default function ArcadeHubScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { statsMap } = useArcadeStats();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { showAd, markAdShown } = useAdGate('arcade');

  return (
    <>
      <AdInterstitial
        visible={showAd}
        onDismiss={markAdShown}
        storageKey="arcade"
      />
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.eyebrow}>Poker Arcade</Text>
          <Text style={s.subtitle}>Quick games for waiting time, warmups, and poker instincts.</Text>
        </View>

        {!user && (
          <TouchableOpacity style={s.guestBanner} onPress={() => setShowLoginPrompt(true)} activeOpacity={0.8}>
            <Text style={s.guestBannerText}>📊  Scores saved locally — <Text style={s.guestBannerLink}>Log in to sync across devices</Text></Text>
          </TouchableOpacity>
        )}

        {GAMES.map(g => (
          <ArcadeGameCard
            key={g.id}
            icon={g.icon}
            title={g.title}
            description={g.desc}
            stat={statsMap[g.id] as any}
            onPress={() => router.push(g.route as any)}
          />
        ))}

        <LoginPromptSheet
          visible={showLoginPrompt}
          featureName="score sync"
          onDismiss={() => setShowLoginPrompt(false)}
          returnTo="/(protected)/arcade"
        />
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: T.bg },
  content:         { padding: 20, paddingBottom: 48 },
  header:          { marginBottom: 20 },
  eyebrow:         { color: T.gold, fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle:        { color: T.muted, fontSize: 14, lineHeight: 20 },
  guestBanner:     { backgroundColor: 'rgba(251,191,36,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16 },
  guestBannerText: { color: T.muted, fontSize: 13 },
  guestBannerLink: { color: T.gold, fontWeight: '600' },
});
