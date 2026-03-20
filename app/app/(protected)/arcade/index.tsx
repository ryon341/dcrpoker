import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArcadeGameCard } from '../../../src/features/arcade/components/ArcadeGameCard';
import { useArcadeStats } from '../../../src/features/arcade/hooks/useArcadeStats';
import { T } from '../../../src/components/ui/Theme';

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
  const { statsMap, loading } = useArcadeStats();

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Poker Arcade</Text>
        <Text style={s.subtitle}>Quick games for waiting time, warmups, and poker instincts.</Text>
      </View>

      {GAMES.map(g => (
        <ArcadeGameCard
          key={g.id}
          icon={g.icon}
          title={g.title}
          description={g.desc}
          stat={statsMap[g.id]}
          onPress={() => router.push(g.route as any)}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  content:   { padding: 20, paddingBottom: 48 },
  header:    { marginBottom: 20 },
  eyebrow:   { color: T.gold, fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle:  { color: T.muted, fontSize: 14, lineHeight: 20 },
});
