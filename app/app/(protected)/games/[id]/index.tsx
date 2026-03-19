import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { gamesApi, Game } from '../../../../src/api/games';
import { T } from '../../../../src/components/ui/Theme';
import { Badge } from '../../../../src/components/ui/Badge';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();

  const [game,    setGame]    = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await gamesApi.get(id);
      setGame(res.data.game);
    } catch (e: any) {
      setError(e.message || 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <View style={s.center}><ActivityIndicator size="large" color={T.red} /></View>;
  }

  if (error || !game) {
    return (
      <View style={s.center}>
        <Text style={s.errText}>{error || 'Game not found'}</Text>
        <TouchableOpacity onPress={load} style={s.reloadBtn}>
          <Text style={s.reloadBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dateStr = game.starts_at
    ? new Date(game.starts_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* ── Hero card ── */}
      <View style={s.heroCard}>
        <Badge label={game.status} status={game.status} />
        <Text style={s.heroTitle}>{game.title}</Text>
        {game.stakes_label ? (
          <View style={s.heroMeta}>
            <Text style={s.heroMetaChip}>💰 {game.stakes_label}</Text>
          </View>
        ) : null}
        {dateStr ? (
          <View style={s.heroMeta}>
            <Text style={s.heroMetaChip}>📅 {dateStr}</Text>
          </View>
        ) : null}
      </View>

      {/* ── Location ── */}
      {game.location_name || game.city ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Location</Text>
          {game.location_name ? <Text style={s.detail}>{game.location_name}</Text> : null}
          {game.address_line_1 ? <Text style={s.detail}>{game.address_line_1}</Text> : null}
          {game.city || game.state ? (
            <Text style={s.detail}>{[game.city, game.state].filter(Boolean).join(', ')}</Text>
          ) : null}
        </View>
      ) : null}

      {/* ── Description ── */}
      {game.description ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.detail}>{game.description}</Text>
        </View>
      ) : null}

      {/* ── Actions ── */}
      <View style={s.actionsCard}>
        <Text style={s.actionsLabel}>Manage this game</Text>

        <TouchableOpacity
          style={s.actionPrimary}
          onPress={() => router.push(`/(protected)/games/${id}/manage`)}
        >
          <Text style={s.actionPrimaryText}>🪑  Manage RSVPs & Seats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.actionSecondary}
          onPress={() => router.push(`/(protected)/games/${id}/invite`)}
        >
          <Text style={s.actionSecondaryText}>+ Invite Players</Text>
        </TouchableOpacity>

        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.actionHalf, { borderColor: '#1a3a5a' }]}
            onPress={() => router.push(`/(protected)/players/search?gameId=${id}&gameTitle=${encodeURIComponent(game.title)}`)}
          >
            <Text style={s.actionHalfText}>🔍 Find Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionHalf, { borderColor: '#1a4a3a' }]}
            onPress={() => router.push(`/(protected)/messages/compose?source=game&gameId=${id}&gameTitle=${encodeURIComponent(game.title)}`)}
          >
            <Text style={s.actionHalfText}>💬 Message</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  content:   { padding: 16, paddingBottom: 50 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg },
  errText:   { color: '#ff8888', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  reloadBtn: { backgroundColor: T.card, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: T.border },
  reloadBtnText: { color: T.silver, fontWeight: 'bold' },

  // Hero card
  heroCard:      { backgroundColor: T.card, borderRadius: 14, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: T.border },
  heroTitle:     { color: T.white, fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  heroMeta:      { flexDirection: 'row', marginBottom: 4 },
  heroMetaChip:  { color: T.muted, fontSize: 14 },

  // Section card
  section: {
    backgroundColor: T.card, borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: T.border,
  },
  sectionTitle: {
    color: T.red, fontSize: 11, fontWeight: 'bold',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  detail: { color: T.silver, fontSize: 14, lineHeight: 22, marginBottom: 2 },

  // Actions card
  actionsCard:   { backgroundColor: T.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: T.border },
  actionsLabel:  { color: T.faint, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  actionPrimary:     { backgroundColor: T.red, borderRadius: 9, paddingVertical: 14, alignItems: 'center', marginBottom: 9 },
  actionPrimaryText: { color: T.white, fontWeight: 'bold', fontSize: 15 },
  actionSecondary:     { backgroundColor: T.cardAlt, borderRadius: 9, paddingVertical: 13, alignItems: 'center', marginBottom: 9, borderWidth: 1, borderColor: T.border },
  actionSecondaryText: { color: T.silver, fontWeight: 'bold', fontSize: 14 },
  actionRow:     { flexDirection: 'row', gap: 9 },
  actionHalf:    { flex: 1, backgroundColor: T.cardAlt, borderRadius: 9, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  actionHalfText: { color: T.muted, fontWeight: '600', fontSize: 13 },
});