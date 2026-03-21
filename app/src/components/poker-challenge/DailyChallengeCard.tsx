import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../ui/Theme';
import { useAuth } from '../../context/AuthContext';
import { getTodayDateString } from './dailyChallenge';
import { loadDailyProgress } from './dailyStorage';
import type { DailyChallengeProgress } from './dailyStorage';

type Status = 'loading' | 'not-started' | 'in-progress' | 'completed';

export function DailyChallengeCard() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user ? String(user.id) : null;

  const [status, setStatus] = useState<Status>('loading');
  const [saved, setSaved]   = useState<DailyChallengeProgress | null>(null);
  const todayId = getTodayDateString();

  useEffect(() => {
    (async () => {
      const progress = await loadDailyProgress(userId);
      if (!progress || progress.dailyId !== todayId) {
        setStatus('not-started');
        setSaved(null);
      } else if (progress.completed) {
        setStatus('completed');
        setSaved(progress);
      } else {
        setStatus('in-progress');
        setSaved(progress);
      }
    })();
  }, [userId, todayId]);

  const statusConfig = {
    loading:     { label: '…',           color: T.muted,    bg: 'rgba(255,255,255,0.04)' },
    'not-started': { label: 'Not Started', color: T.muted,    bg: 'rgba(255,255,255,0.04)' },
    'in-progress': { label: 'In Progress', color: '#60A5FA',  bg: 'rgba(96,165,250,0.12)' },
    completed:   { label: '✓ Done',       color: '#4caf50',  bg: 'rgba(76,175,80,0.12)'  },
  };

  const cfg  = statusConfig[status];
  const done = status === 'completed';

  const btnLabel =
    status === 'not-started' ? 'Start' :
    status === 'in-progress' ? `Resume (${saved?.answers.length ?? 0}/5)` :
    status === 'completed'   ? 'View Results' : '…';

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <Text style={s.icon}>📅</Text>
        <View style={s.meta}>
          <Text style={s.title}>Daily Challenge</Text>
          <Text style={s.date}>{todayId}</Text>
        </View>
        <View style={[s.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <Text style={s.desc}>5 hands · same for everyone today</Text>

      {status !== 'loading' && (
        <TouchableOpacity
          style={[s.btn, done && s.btnOutline]}
          onPress={() => router.push('/poker-challenge/daily' as any)}
          activeOpacity={0.8}
        >
          <Text style={[s.btnText, done && s.btnTextOutline]}>{btnLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card:        { marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', gap: 10 },
  topRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon:        { fontSize: 22 },
  meta:        { flex: 1, gap: 1 },
  title:       { color: T.white, fontWeight: '700', fontSize: 14 },
  date:        { color: T.muted, fontSize: 11 },
  badge:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  badgeText:   { fontSize: 11, fontWeight: '700' },
  desc:        { color: T.muted, fontSize: 12 },
  btn:         { backgroundColor: T.gold, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  btnOutline:  { backgroundColor: 'transparent', borderWidth: 1, borderColor: T.gold },
  btnText:     { color: '#0c0a09', fontWeight: 'bold', fontSize: 13 },
  btnTextOutline: { color: T.gold },
});
