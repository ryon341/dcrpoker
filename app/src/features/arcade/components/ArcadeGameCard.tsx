import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../../../components/ui/Theme';
import type { ArcadeStat } from '../utils/arcadeApi';

interface ArcadeGameCardProps {
  icon: string;
  title: string;
  description: string;
  stat?: ArcadeStat;
  onPress: () => void;
}

export function ArcadeGameCard({ icon, title, description, stat, onPress }: ArcadeGameCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={s.icon}>{icon}</Text>
      <View style={s.body}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.desc}>{description}</Text>
        {stat ? (
          <View style={s.statsRow}>
            <Text style={s.stat}>Best: <Text style={s.statVal}>{stat.high_score}</Text></Text>
            <Text style={s.stat}>🔥 <Text style={s.statVal}>{stat.best_streak}</Text></Text>
            <Text style={s.stat}>Plays: <Text style={s.statVal}>{stat.total_plays}</Text></Text>
          </View>
        ) : null}
      </View>
      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:     { flexDirection: 'row', alignItems: 'center', backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder, borderRadius: 20, padding: 16, marginBottom: 10, gap: 14 },
  icon:     { fontSize: 32, width: 44, textAlign: 'center' },
  body:     { flex: 1 },
  title:    { color: T.white, fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  desc:     { color: T.muted, fontSize: 13, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  stat:     { color: T.muted, fontSize: 11 },
  statVal:  { color: T.gold, fontWeight: '600' },
  arrow:    { color: T.muted, fontSize: 22, marginLeft: 4 },
});
