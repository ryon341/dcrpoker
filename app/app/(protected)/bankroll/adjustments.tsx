import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { bankrollApi, BankrollAdjustment } from '../../../src/api/bankroll';

const ADJUSTMENT_TYPES = ['manual', 'deposit', 'withdrawal', 'correction'];

function centsToDisplay(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = (abs / 100).toFixed(2);
  return cents < 0 ? `-$${dollars}` : `+$${dollars}`;
}

function profitColor(cents: number): string {
  if (cents > 0) return '#4caf50';
  if (cents < 0) return '#e94560';
  return '#aaa';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function dollarsToCents(val: string): number {
  // Strip sign prefix that may come from display
  const n = parseFloat(val.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

export default function AdjustmentsScreen() {
  const [adjustments, setAdjustments]   = useState<BankrollAdjustment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  // Form state
  const [amount, setAmount]             = useState('');
  const [isNegative, setIsNegative]     = useState(false);
  const [adjType, setAdjType]           = useState('manual');
  const [description, setDescription]   = useState('');
  const [submitting, setSubmitting]     = useState(false);

  const loadAdjustments = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await bankrollApi.getAdjustments();
      setAdjustments(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load adjustments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadAdjustments(); }, [loadAdjustments]);

  const handleSubmit = async () => {
    if (!amount) return Alert.alert('Validation', 'Amount is required');
    const cents = dollarsToCents(amount);
    if (cents === 0) return Alert.alert('Validation', 'Amount must be non-zero');

    const finalCents = isNegative ? -cents : cents;

    setSubmitting(true);
    try {
      await bankrollApi.createAdjustment({
        amount_cents:    finalCents,
        adjustment_type: adjType,
        description:     description.trim() || undefined,
      });
      setAmount('');
      setDescription('');
      setIsNegative(false);
      setAdjType('manual');
      await loadAdjustments(true);
      Alert.alert('Saved', 'Bankroll adjustment recorded.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || err?.message || 'Failed to save adjustment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadAdjustments(true)} tintColor="#e94560" />}
      >
        <Text style={styles.title}>Bankroll Adjustments</Text>
        <Text style={styles.sub}>Record deposits, withdrawals, or manual corrections.</Text>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Adjustment</Text>

          <Text style={styles.label}>Amount ($)</Text>
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={[styles.signBtn, !isNegative && styles.signBtnActive]}
              onPress={() => setIsNegative(false)}
            >
              <Text style={[styles.signBtnText, !isNegative && styles.signBtnTextActive]}>+ Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.signBtn, isNegative && styles.signBtnNegActive]}
              onPress={() => setIsNegative(true)}
            >
              <Text style={[styles.signBtnText, isNegative && styles.signBtnTextActive]}>- Remove</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={amount}
              onChangeText={setAmount}
              placeholder="500.00"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Type</Text>
          <View style={styles.chipRow}>
            {ADJUSTMENT_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, adjType === t && styles.chipActive]}
                onPress={() => setAdjType(t)}
              >
                <Text style={[styles.chipText, adjType === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Added starting bankroll"
            placeholderTextColor="#555"
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>{submitting ? 'Saving...' : 'Save Adjustment'}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent adjustments */}
        <Text style={styles.sectionTitle}>Recent Adjustments</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : adjustments.length === 0 ? (
          <Text style={styles.emptyText}>No adjustments yet.</Text>
        ) : (
          adjustments.map(a => (
            <View key={a.id} style={styles.adjRow}>
              <View style={styles.adjLeft}>
                <Text style={styles.adjType}>{a.adjustment_type}</Text>
                {a.description && <Text style={styles.adjDesc}>{a.description}</Text>}
                <Text style={styles.adjDate}>{formatDate(a.created_at)}</Text>
              </View>
              <Text style={[styles.adjAmount, { color: profitColor(a.amount_cents) }]}>
                {centsToDisplay(a.amount_cents)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#1a1a2e' },
  content:          { padding: 16, paddingBottom: 40 },
  title:            { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sub:              { color: '#aaa', fontSize: 13, marginBottom: 20 },
  card:             { backgroundColor: '#16213e', borderRadius: 10, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a4a' },
  cardTitle:        { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  label:            { color: '#ccc', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input:            { backgroundColor: '#1a1a2e', borderRadius: 8, borderWidth: 1, borderColor: '#2a2a4a', color: '#fff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  amountRow:        { flexDirection: 'row', gap: 8, alignItems: 'center' },
  amountInput:      { flex: 1 },
  signBtn:          { borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#1a1a2e' },
  signBtnActive:    { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  signBtnNegActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  signBtnText:      { color: '#aaa', fontSize: 13, fontWeight: '600' },
  signBtnTextActive:{ color: '#fff' },
  chipRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip:             { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#1a1a2e' },
  chipActive:       { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:         { color: '#aaa', fontSize: 13 },
  chipTextActive:   { color: '#fff', fontWeight: '700' },
  submitBtn:        { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 12, marginTop: 16 },
  submitBtnDisabled:{ opacity: 0.5 },
  submitText:       { color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  sectionTitle:     { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  loadingText:      { color: '#aaa', fontSize: 13 },
  emptyText:        { color: '#aaa', fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  adjRow:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a' },
  adjLeft:          { flex: 1 },
  adjType:          { color: '#fff', fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  adjDesc:          { color: '#aaa', fontSize: 12, marginTop: 2 },
  adjDate:          { color: '#555', fontSize: 11, marginTop: 2 },
  adjAmount:        { fontSize: 18, fontWeight: '700' },
});
