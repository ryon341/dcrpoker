import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { bankrollApi } from '../../../src/api/bankroll';

const GAME_TYPES = ['cash', 'tournament', 'online', 'private', 'public'];

function dollarsToCents(val: string): number {
  const n = parseFloat(val.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

export default function LogSessionScreen() {
  const router = useRouter();

  const [playedAt, setPlayedAt]         = useState(new Date().toISOString().slice(0, 16));
  const [gameType, setGameType]         = useState('cash');
  const [stakes, setStakes]             = useState('');
  const [location, setLocation]         = useState('');
  const [buyIn, setBuyIn]               = useState('');
  const [cashOut, setCashOut]           = useState('');
  const [hours, setHours]               = useState('');
  const [notes, setNotes]               = useState('');
  const [submitting, setSubmitting]     = useState(false);

  const profitCents = dollarsToCents(cashOut) - dollarsToCents(buyIn);
  const profitDisplay = () => {
    const b = dollarsToCents(buyIn);
    const c = dollarsToCents(cashOut);
    if (!buyIn && !cashOut) return null;
    const diff = c - b;
    const abs  = (Math.abs(diff) / 100).toFixed(2);
    return diff >= 0 ? `+$${abs}` : `-$${abs}`;
  };

  const handleSubmit = async () => {
    if (!playedAt)  return Alert.alert('Validation', 'Date/time is required');
    if (!buyIn)     return Alert.alert('Validation', 'Buy-in amount is required');
    if (!cashOut)   return Alert.alert('Validation', 'Cash-out amount is required');
    if (!hours)     return Alert.alert('Validation', 'Hours played is required');

    setSubmitting(true);
    try {
      await bankrollApi.createSession({
        played_at:             playedAt.length === 16 ? playedAt + ':00' : playedAt,
        game_type:             gameType,
        stakes_label:          stakes.trim() || undefined,
        location_name:         location.trim() || undefined,
        buy_in_amount_cents:   dollarsToCents(buyIn),
        cash_out_amount_cents: dollarsToCents(cashOut),
        hours_played_decimal:  parseFloat(hours) || 0,
        notes:                 notes.trim() || undefined,
      });
      Alert.alert('Session Logged', 'Your session has been saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || err?.message || 'Failed to save session');
    } finally {
      setSubmitting(false);
    }
  };

  const pl = profitDisplay();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Log Session</Text>
        <Text style={styles.sub}>Track your bankroll, sessions, and hourly rate.</Text>

        <Label text="Date & Time" />
        <TextInput
          style={styles.input}
          value={playedAt}
          onChangeText={setPlayedAt}
          placeholder="YYYY-MM-DDTHH:MM"
          placeholderTextColor="#555"
        />

        <Label text="Game Type" />
        <View style={styles.chipRow}>
          {GAME_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, gameType === t && styles.chipActive]}
              onPress={() => setGameType(t)}
            >
              <Text style={[styles.chipText, gameType === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label text="Stakes (optional)" />
        <TextInput
          style={styles.input}
          value={stakes}
          onChangeText={setStakes}
          placeholder="e.g. 1/2 NL"
          placeholderTextColor="#555"
        />

        <Label text="Location (optional)" />
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Friday Home Game"
          placeholderTextColor="#555"
        />

        <View style={styles.row}>
          <View style={styles.halfWrap}>
            <Label text="Buy-In ($)" />
            <TextInput
              style={styles.input}
              value={buyIn}
              onChangeText={setBuyIn}
              placeholder="200.00"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.halfWrap}>
            <Label text="Cash-Out ($)" />
            <TextInput
              style={styles.input}
              value={cashOut}
              onChangeText={setCashOut}
              placeholder="285.00"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {pl && (
          <Text style={[styles.profitPreview, { color: profitCents >= 0 ? '#4caf50' : '#e94560' }]}>
            Profit / Loss: {pl}
          </Text>
        )}

        <Label text="Hours Played" />
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={setHours}
          placeholder="4.5"
          placeholderTextColor="#555"
          keyboardType="decimal-pad"
        />

        <Label text="Notes (optional)" />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Good game, soft table..."
          placeholderTextColor="#555"
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Saving...' : 'Save Session'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#1a1a2e' },
  content:          { padding: 16, paddingBottom: 40 },
  title:            { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sub:              { color: '#aaa', fontSize: 13, marginBottom: 20 },
  label:            { color: '#ccc', fontSize: 13, fontWeight: '600', marginTop: 14, marginBottom: 4 },
  input:            { backgroundColor: '#16213e', borderRadius: 8, borderWidth: 1, borderColor: '#2a2a4a', color: '#fff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textArea:         { minHeight: 70, textAlignVertical: 'top' },
  chipRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip:             { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#16213e' },
  chipActive:       { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:         { color: '#aaa', fontSize: 13 },
  chipTextActive:   { color: '#fff', fontWeight: '700' },
  row:              { flexDirection: 'row', gap: 10 },
  halfWrap:         { flex: 1 },
  profitPreview:    { fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 8 },
  submitBtn:        { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 14, marginTop: 24 },
  submitBtnDisabled:{ opacity: 0.5 },
  submitText:       { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  cancelBtn:        { marginTop: 12, paddingVertical: 10 },
  cancelText:       { color: '#aaa', textAlign: 'center', fontSize: 14 },
});
