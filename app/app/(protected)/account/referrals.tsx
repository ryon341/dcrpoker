import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, TextInput, Share, Alert, RefreshControl,
} from 'react-native';
import { referralsApi, ReferralSummary, ReferredHost } from '../../../src/api/referrals';

const STATUS_COLOR: Record<string, string> = {
  pending:   '#888',
  qualified: '#4a9eff',
  credited:  '#4caf50',
  cancelled: '#ff6b6b',
};

export default function ReferralsScreen() {
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [error, setError]                   = useState('');
  const [referralCode, setReferralCode]     = useState('');
  const [summary, setSummary]               = useState<ReferralSummary | null>(null);
  const [referredHosts, setReferredHosts]   = useState<ReferredHost[]>([]);
  const [applyCode, setApplyCode]           = useState('');
  const [applying, setApplying]             = useState(false);
  const [applied, setApplied]               = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await referralsApi.getReferrals();
      setReferralCode(data.referralCode);
      setSummary(data.summary);
      setReferredHosts(data.referredHosts);
    } catch (e: any) {
      setError(e.message || 'Failed to load referrals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleShare() {
    try {
      await Share.share({
        message: `Join DCR Poker with my referral code: ${referralCode}\n\nSign up at: https://dcrpoker.com/join?ref=${referralCode}`,
        title: 'Join DCR Poker',
      });
    } catch {
      // dismissed
    }
  }

  async function handleApply() {
    const code = applyCode.trim().toUpperCase();
    if (!code) return;
    setApplying(true);
    try {
      await referralsApi.applyReferralCode(code);
      setApplied(true);
      setApplyCode('');
      Alert.alert('Referral Applied!', 'You\'ve been connected with your referrer. Credits will be issued once you qualify.');
    } catch (e: any) {
      Alert.alert('Invalid Code', e.message || 'This referral code is not valid or has already been used.');
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <View style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor="#e94560" />}
    >
      <Text style={s.pageTitle}>👥 Referrals</Text>
      <Text style={s.pageSubtitle}>Invite other hosts to DCR Poker and earn credits when they qualify.</Text>

      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Referral code block */}
      <View style={s.codeCard}>
        <Text style={s.codeLabel}>Your Referral Code</Text>
        <Text style={s.codeValue}>{referralCode || '—'}</Text>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare} disabled={!referralCode}>
          <Text style={s.shareBtnText}>↗ Share My Code</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {summary && (
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{summary.totalReferred}</Text>
            <Text style={s.statLabel}>Referred</Text>
          </View>
          <View style={s.statBox}>
            <Text style={[s.statNum, { color: '#4a9eff' }]}>{summary.qualified}</Text>
            <Text style={s.statLabel}>Qualified</Text>
          </View>
          <View style={s.statBox}>
            <Text style={[s.statNum, { color: '#4caf50' }]}>{summary.credited}</Text>
            <Text style={s.statLabel}>Credited</Text>
          </View>
        </View>
      )}

      {/* How it works */}
      <View style={s.infoCard}>
        <Text style={s.infoTitle}>How it works</Text>
        <Text style={s.infoLine}>1. Share your referral code with other hosts</Text>
        <Text style={s.infoLine}>2. They sign up and enter your code</Text>
        <Text style={s.infoLine}>3. Once they host their first game, they're "qualified"</Text>
        <Text style={s.infoLine}>4. You receive a credit bonus applied to your account</Text>
      </View>

      {/* Apply referral code */}
      {!applied && (
        <View style={s.applyCard}>
          <Text style={s.infoTitle}>Have a referral code?</Text>
          <Text style={s.applySubtitle}>Apply a code from the host who referred you.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              value={applyCode}
              onChangeText={t => setApplyCode(t.toUpperCase())}
              placeholder="Enter code"
              placeholderTextColor="#555"
              autoCapitalize="characters"
              maxLength={12}
            />
            <TouchableOpacity
              style={[s.applyBtn, (!applyCode.trim() || applying) ? s.applyBtnDisabled : null]}
              onPress={handleApply}
              disabled={!applyCode.trim() || applying}
            >
              {applying ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.applyBtnText}>Apply</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {applied && (
        <View style={[s.applyCard, { borderColor: '#4caf50' }]}>
          <Text style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ Referral code applied!</Text>
        </View>
      )}

      {/* Referred hosts list */}
      {referredHosts.length > 0 && (
        <>
          <Text style={s.sectionTitle}>Referred Hosts ({referredHosts.length})</Text>
          {referredHosts.map(h => (
            <View key={h.id} style={s.hostRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.hostName}>{h.display_name}</Text>
                <Text style={s.hostMeta}>{new Date(h.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={[s.statusBadge, { borderColor: STATUS_COLOR[h.status] }]}>
                <Text style={[s.statusText, { color: STATUS_COLOR[h.status] }]}>{h.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {referredHosts.length === 0 && !loading && (
        <View style={s.emptyBlock}>
          <Text style={s.emptyIcon}>👥</Text>
          <Text style={s.emptyText}>No referrals yet</Text>
          <Text style={s.emptySubtext}>Share your code above to start earning credits.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 60 },

  pageTitle:    { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  pageSubtitle: { color: '#888', fontSize: 13, marginBottom: 16 },

  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },

  codeCard:   { backgroundColor: '#16213e', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  codeLabel:  { color: '#aaa', fontSize: 12, marginBottom: 6 },
  codeValue:  { color: '#e94560', fontSize: 30, fontWeight: 'bold', letterSpacing: 4, marginBottom: 14, fontFamily: 'monospace' },
  shareBtn:   { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox:  { flex: 1, backgroundColor: '#16213e', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  statNum:  { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },

  infoCard:  { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  infoTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  infoLine:  { color: '#888', fontSize: 13, marginBottom: 4 },

  applyCard:    { backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a4a' },
  applySubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  input:        { backgroundColor: '#0a1020', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 16, letterSpacing: 2 },
  applyBtn:         { backgroundColor: '#e94560', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  applyBtnDisabled: { opacity: 0.4 },
  applyBtnText:     { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  sectionTitle: { color: '#aaa', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  hostRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a' },
  hostName:     { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  hostMeta:     { color: '#888', fontSize: 12, marginTop: 2 },
  statusBadge:  { borderRadius: 4, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  statusText:   { fontSize: 10, fontWeight: 'bold' },

  emptyBlock:   { alignItems: 'center', paddingTop: 30 },
  emptyIcon:    { fontSize: 36, marginBottom: 10 },
  emptyText:    { color: '#aaa', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  emptySubtext: { color: '#666', fontSize: 13, textAlign: 'center' },
});
