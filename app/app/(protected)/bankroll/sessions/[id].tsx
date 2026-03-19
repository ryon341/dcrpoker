import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { bankrollApi, PokerSession } from '../../../../src/api/bankroll';

function centsToDisplay(cents: number): string {
  const abs = (Math.abs(cents) / 100).toFixed(2);
  return cents < 0 ? `-$${abs}` : `$${abs}`;
}

function profitColor(cents: number): string {
  if (cents > 0) return '#4caf50';
  if (cents < 0) return '#e94560';
  return '#aaa';
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function DetailRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );
}

export default function SessionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = Number(id);

  const [session, setSession]   = useState<PokerSession | null>(null);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankrollApi.getSession(sessionId);
      setSession(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await bankrollApi.deleteSession(sessionId);
              router.replace('/(protected)/bankroll/sessions' as any);
            } catch (err: any) {
              setDeleting(false);
              Alert.alert('Error', err?.message || 'Failed to delete session');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (error || !session) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Session not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pl = session.profit_loss_cents;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.sessionDate}>{formatDateLong(session.played_at)}</Text>
        <Text style={styles.gameType}>{capitalize(session.game_type)}{session.stakes_label ? ` · ${session.stakes_label}` : ''}</Text>
        <Text style={[styles.bigPL, { color: profitColor(pl) }]}>{centsToDisplay(pl)}</Text>
        <Text style={styles.sessionHours}>{Number(session.hours_played_decimal).toFixed(2)} hours played</Text>
      </View>

      {/* Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Details</Text>
        <DetailRow label="Buy-in"    value={centsToDisplay(session.buy_in_amount_cents)} />
        <DetailRow label="Cash-out"  value={centsToDisplay(session.cash_out_amount_cents)} />
        <DetailRow label="Profit / Loss" value={centsToDisplay(pl)} valueColor={profitColor(pl)} />
        <DetailRow label="Hours"     value={`${Number(session.hours_played_decimal).toFixed(2)}h`} />
        {session.location_name && <DetailRow label="Location" value={session.location_name} />}
        {session.stakes_label   && <DetailRow label="Stakes"   value={session.stakes_label} />}
        <DetailRow label="Game Type" value={capitalize(session.game_type)} />
        <DetailRow label="Logged"    value={new Date(session.created_at).toLocaleString()} />
        {session.updated_at !== session.created_at && (
          <DetailRow label="Updated" value={new Date(session.updated_at).toLocaleString()} />
        )}
      </View>

      {/* Notes */}
      {session.notes ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes</Text>
          <Text style={styles.notesText}>{session.notes}</Text>
        </View>
      ) : null}

      {/* Actions */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push(`/(protected)/bankroll/sessions/${sessionId}/edit` as any)}
      >
        <Text style={styles.editBtnText}>Edit Session</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteBtn, deleting && styles.btnDisabled]}
        onPress={handleDelete}
        disabled={deleting}
      >
        {deleting
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.deleteBtnText}>Delete Session</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#1a1a2e' },
  content:      { padding: 16, paddingBottom: 40 },
  center:       { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText:    { color: '#e94560', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  backBtn:      { backgroundColor: '#0f3460', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  backBtnText:  { color: '#fff', fontWeight: '600', fontSize: 14 },
  headerCard:   { backgroundColor: '#16213e', borderRadius: 10, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a', alignItems: 'center' },
  sessionDate:  { color: '#ccc', fontSize: 14, marginBottom: 4 },
  gameType:     { color: '#aaa', fontSize: 13, marginBottom: 12 },
  bigPL:        { fontSize: 42, fontWeight: '700', marginBottom: 4 },
  sessionHours: { color: '#777', fontSize: 12 },
  card:         { backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  cardTitle:    { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  detailRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  detailLabel:  { color: '#888', fontSize: 13 },
  detailValue:  { color: '#fff', fontSize: 13, fontWeight: '600' },
  notesText:    { color: '#bbb', fontSize: 14, lineHeight: 20 },
  editBtn:      { backgroundColor: '#0f3460', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  editBtnText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteBtn:    { backgroundColor: '#7a1a2e', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  deleteBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDisabled:  { opacity: 0.6 },
});
