import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { gamesApi, Game } from '../../../src/api/games';
import { T } from '../../../src/components/ui/Theme';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';

export default function MyGamesScreen() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    setLoading(true);
    setError('');
    try {
      const res = await gamesApi.list();
      setGames(res.data.games);
    } catch (e: any) {
      setError(e.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={T.red} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.heading}>My Games</Text>
        <TouchableOpacity
          style={s.createBtn}
          onPress={() => router.push('/(protected)/games/create')}
        >
          <Text style={s.createBtnText}>+ New Game</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadGames} style={s.retryBtn}>
            <Text style={s.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {!error && games.length === 0 ? (
        <EmptyState
          icon="🃏"
          title="No games yet"
          body="Create your first game to get started."
          action="+ Create Game"
          onAction={() => router.push('/(protected)/games/create')}
        />
      ) : (
        <FlatList
          data={games}
          keyExtractor={g => String(g.id)}
          contentContainerStyle={s.list}
          refreshing={loading}
          onRefresh={loadGames}
          renderItem={({ item }) => <GameCard game={item} router={router} />}
        />
      )}
    </View>
  );
}

function GameCard({ game, router }: { game: Game; router: ReturnType<typeof useRouter> }) {
  const dateStr = game.starts_at
    ? new Date(game.starts_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/(protected)/games/${game.id}`)}
    >
      {/* Title row */}
      <View style={s.cardTop}>
        <Text style={s.cardTitle} numberOfLines={1}>{game.title}</Text>
        <Badge label={game.status} status={game.status} />
      </View>

      {/* Meta row */}
      <View style={s.cardMeta}>
        {game.stakes_label ? (
          <Text style={s.metaChip}>💰 {game.stakes_label}</Text>
        ) : null}
        {dateStr ? (
          <Text style={s.metaChip}>📅 {dateStr}</Text>
        ) : null}
      </View>

      {/* Actions */}
      <View style={s.cardActions}>
        <TouchableOpacity
          style={s.actionBtnPrimary}
          onPress={() => router.push(`/(protected)/games/${game.id}/manage`)}
        >
          <Text style={s.actionBtnPrimaryText}>Manage RSVPs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.actionBtnSecondary}
          onPress={() => router.push(`/(protected)/games/${game.id}`)}
        >
          <Text style={s.actionBtnSecondaryText}>Details →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg },

  // Header
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  heading:       { color: T.white, fontSize: 22, fontWeight: 'bold' },
  createBtn:     { backgroundColor: T.red, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 9 },
  createBtnText: { color: T.white, fontWeight: 'bold', fontSize: 14 },

  // Error
  errorBanner: { backgroundColor: '#2a0a0a', borderRadius: 8, marginHorizontal: 16, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  errorText:   { color: '#ff8888', fontSize: 14, flex: 1, marginRight: 10 },
  retryBtn:    { backgroundColor: T.statusDeclined, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  retryBtnText: { color: T.white, fontSize: 13, fontWeight: 'bold' },

  list: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 4 },

  // Card
  card: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  cardTop:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { color: T.white, fontSize: 17, fontWeight: 'bold', flex: 1, marginRight: 10 },

  // Meta chips
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  metaChip: { color: T.muted, fontSize: 13 },

  // Card actions
  cardActions:          { flexDirection: 'row', gap: 8 },
  actionBtnPrimary:     { flex: 1, backgroundColor: T.red, borderRadius: 7, paddingVertical: 10, alignItems: 'center' },
  actionBtnPrimaryText: { color: T.white, fontWeight: 'bold', fontSize: 13 },
  actionBtnSecondary:     { backgroundColor: T.cardAlt, borderRadius: 7, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  actionBtnSecondaryText: { color: T.silver, fontWeight: '600', fontSize: 13 },
});
