import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { billingApi, BillingStatus } from '../../../src/api/billing';
import { creditsApi, CreditsData } from '../../../src/api/credits';
import { referralsApi, ReferralsData } from '../../../src/api/referrals';

const PLAN_LABELS: Record<string, string> = {
  level1: 'Level 1 â€” Free',
  level2: 'Level 2 â€” Pro',
  level3: 'Level 3 â€” Elite',
};

const STATUS_LABELS: Record<string, string> = {
  active:    'Active',
  pending:   'Pending',
  cancelled: 'Cancelled',
  suspended: 'Suspended',
  expired:   'Expired',
  inactive:  'Inactive',
};

const PLAN_FEATURES = [
  { label: 'Batch Invite Limit',   level1: '10 contacts', level2: 'Unlimited', level3: 'Unlimited' },
  { label: 'Send SMS Invites',     level1: 'âœ—',           level2: 'âœ“',         level3: 'âœ“' },
  { label: 'Receive SMS RSVPs',    level1: 'âœ—',           level2: 'âœ—',         level3: 'âœ“' },
  { label: 'Seat Tools (RSVP UI)', level1: 'âœ—',           level2: 'âœ—',         level3: 'âœ“' },
  { label: 'Monthly SMS Limit',    level1: 'None',        level2: '500',       level3: '1,000' },
];

export default function BillingScreen() {
  const [status, setStatus]         = useState<BillingStatus | null>(null);
  const [credits, setCredits]       = useState<CreditsData | null>(null);
  const [referrals, setReferrals]   = useState<ReferralsData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upgrading, setUpgrading]   = useState<'level2' | 'level3' | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [applyCode, setApplyCode]   = useState('');
  const [applying, setApplying]     = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [billingData, creditsData, referralsData] = await Promise.allSettled([
        billingApi.getStatus(),
        creditsApi.getCredits(),
        referralsApi.getReferrals(),
      ]);
      if (billingData.status === 'fulfilled')   setStatus(billingData.value);
      if (creditsData.status === 'fulfilled')   setCredits(creditsData.value);
      if (referralsData.status === 'fulfilled') setReferrals(referralsData.value);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load billing info');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpgrade = useCallback(async (planLevel: 'level2' | 'level3') => {
    setUpgrading(planLevel);
    try {
      const result = await billingApi.subscribe(planLevel);
      await Linking.openURL(result.approvalUrl);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not start checkout');
    } finally {
      setUpgrading(null);
    }
  }, []);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel? You will lose access to paid features at the end of the billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await billingApi.cancel();
              Alert.alert('Cancelled', 'Your subscription has been cancelled.');
              load(true);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Could not cancel subscription');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  }, [load]);

  const handleCopyCode = useCallback(() => {
    if (!referrals?.referralCode) return;
    Clipboard.setString(referrals.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, [referrals?.referralCode]);

  const handleApplyCode = useCallback(async () => {
    if (!applyCode.trim()) return;
    setApplying(true);
    try {
      await referralsApi.applyReferralCode(applyCode.trim().toUpperCase());
      Alert.alert('Success', 'Referral code applied! Your referrer will be notified.');
      setApplyCode('');
      load(true);
    } catch (err: any) {
      Alert.alert('Could not apply code', err?.response?.data?.error || err?.message || 'Unknown error');
    } finally {
      setApplying(false);
    }
  }, [applyCode, load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  const planLevel = status?.planLevel ?? 'level1';
  const isActive  = status?.subscriptionStatus === 'active';
  const hasSub    = !!status?.subscription;
  const usagePct  = status && status.smsLimit > 0
    ? Math.min((status.smsUsage / status.smsLimit) * 100, 100)
    : 0;

  const centsToDisplay = (cents: number) =>
    `$${(cents / 100).toFixed(2)}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#e94560" />}
    >
      <Text style={styles.title}>Billing &amp; Plan</Text>

      {/* â”€â”€ Current plan card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.card}>
        <Text style={styles.label}>Current Plan</Text>
        <Text style={styles.planName}>{PLAN_LABELS[planLevel] ?? planLevel}</Text>

        {status?.subscriptionStatus ? (
          <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>
              {STATUS_LABELS[status.subscriptionStatus] ?? status.subscriptionStatus}
            </Text>
          </View>
        ) : null}

        {status?.subscription?.renewsAt ? (
          <Text style={styles.metaText}>
            Renews: {new Date(status.subscription.renewsAt).toLocaleDateString()}
          </Text>
        ) : null}
        {status?.subscription?.cancelledAt ? (
          <Text style={[styles.metaText, { color: '#e94560' }]}>
            Cancelled: {new Date(status.subscription.cancelledAt).toLocaleDateString()}
          </Text>
        ) : null}
      </View>

      {/* â”€â”€ SMS usage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {status && planLevel !== 'level1' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SMS Usage This Month</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${usagePct}%` as any }]} />
          </View>
          <Text style={styles.usageText}>
            {status.smsUsage} / {status.smsLimit} messages included
          </Text>

          {/* Overage breakdown */}
          {status.overageMessages > 0 ? (
            <View style={styles.overageBox}>
              <Text style={styles.overageRow}>
                Overage: {status.overageMessages} msg Ã— $0.02 = <Text style={styles.overageAmt}>{centsToDisplay(status.overageAmountCents)}</Text>
              </Text>
              {status.creditBalanceCents > 0 ? (
                <Text style={styles.overageRow}>
                  Credits applied: <Text style={styles.creditAmt}>-{centsToDisplay(status.creditsAppliedCents)}</Text>
                </Text>
              ) : null}
              <Text style={[styles.overageRow, styles.overageNetRow]}>
                Net overage: {centsToDisplay(status.netAmountCents)}
              </Text>
              <Text style={styles.overageDisclaimer}>
                Overages are tracked for review and are not automatically charged.
              </Text>
            </View>
          ) : (
            <Text style={styles.noOverageText}>No overage this month.</Text>
          )}
        </View>
      )}

      {/* â”€â”€ Credits balance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Credits</Text>
        <Text style={styles.creditBalance}>
          {centsToDisplay(credits?.balanceCents ?? 0)}
        </Text>
        {credits && credits.transactions.length > 0 ? (
          <>
            <Text style={styles.label}>Recent transactions</Text>
            {credits.transactions.slice(0, 5).map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txType}>{tx.type.replace(/_/g, ' ')}</Text>
                  {tx.description ? <Text style={styles.txDesc}>{tx.description}</Text> : null}
                  <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.txAmt, tx.amount_cents >= 0 ? styles.txAmtPos : styles.txAmtNeg]}>
                  {tx.amount_cents >= 0 ? '+' : ''}{centsToDisplay(tx.amount_cents)}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noOverageText}>No credit transactions yet.</Text>
        )}
      </View>

      {/* â”€â”€ Referral section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Referral Code</Text>
        {referrals ? (
          <>
            <View style={styles.referralCodeRow}>
              <Text style={styles.referralCode}>{referrals.referralCode}</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
                <Text style={styles.copyBtnText}>{codeCopied ? 'âœ“ Copied' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.referralStats}>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatVal}>{referrals.summary.totalReferred}</Text>
                <Text style={styles.referralStatLabel}>Referred</Text>
              </View>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatVal}>{referrals.summary.qualified}</Text>
                <Text style={styles.referralStatLabel}>Qualified</Text>
              </View>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatVal}>{referrals.summary.credited}</Text>
                <Text style={styles.referralStatLabel}>Credited</Text>
              </View>
            </View>

            {referrals.referredHosts.length > 0 ? (
              <>
                <Text style={[styles.label, { marginTop: 12 }]}>Referred hosts</Text>
                {referrals.referredHosts.slice(0, 10).map(h => (
                  <View key={h.id} style={styles.referralHostRow}>
                    <Text style={styles.referralHostName}>{h.display_name || h.phone}</Text>
                    <View style={[styles.badge,
                      h.status === 'credited'  ? styles.badgeActive :
                      h.status === 'qualified' ? styles.badgeQualified :
                      styles.badgeInactive]}>
                      <Text style={styles.badgeText}>{h.status}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : null}
          </>
        ) : (
          <Text style={styles.noOverageText}>Loading referral infoâ€¦</Text>
        )}

        {/* Apply a referral code */}
        <Text style={[styles.label, { marginTop: 16 }]}>Apply someone's referral code</Text>
        <View style={styles.applyRow}>
          <TextInput
            style={styles.applyInput}
            placeholder="DCRABC123"
            placeholderTextColor="#555"
            value={applyCode}
            onChangeText={setApplyCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.applyBtn, (!applyCode.trim() || applying) && styles.applyBtnDisabled]}
            onPress={handleApplyCode}
            disabled={!applyCode.trim() || applying}
          >
            {applying
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.applyBtnText}>Apply</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* â”€â”€ Upgrade section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {planLevel !== 'level3' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upgrade Your Plan</Text>

          {planLevel === 'level1' && (
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => handleUpgrade('level2')}
              disabled={upgrading === 'level2'}
            >
              {upgrading === 'level2'
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Upgrade to Level 2 â€” Pro</Text>}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.upgradeBtn, styles.upgradeBtnElite]}
            onPress={() => handleUpgrade('level3')}
            disabled={upgrading === 'level3'}
          >
            {upgrading === 'level3'
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Upgrade to Level 3 â€” Elite</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* â”€â”€ Cancel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isActive && hasSub && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={cancelling}>
          {cancelling
            ? <ActivityIndicator color="#e94560" />
            : <Text style={styles.cancelText}>Cancel Subscription</Text>}
        </TouchableOpacity>
      )}

      {/* â”€â”€ Feature comparison â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Plan Comparison</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.col, styles.colFeature, styles.tableHeadText]}>Feature</Text>
          <Text style={[styles.colVal, styles.tableHeadText]}>L1</Text>
          <Text style={[styles.colVal, styles.tableHeadText]}>L2</Text>
          <Text style={[styles.colVal, styles.tableHeadText]}>L3</Text>
        </View>
        {PLAN_FEATURES.map((row, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.col, styles.colFeature, styles.tableCell]}>{row.label}</Text>
            <Text style={[styles.colVal, styles.tableCell, planLevel === 'level1' && styles.activePlanText]}>{row.level1}</Text>
            <Text style={[styles.colVal, styles.tableCell, planLevel === 'level2' && styles.activePlanText]}>{row.level2}</Text>
            <Text style={[styles.colVal, styles.tableCell, planLevel === 'level3' && styles.activePlanText]}>{row.level3}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#1a1a2e' },
  content:     { padding: 20, paddingBottom: 40 },
  centered:    { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  title:       { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  card:        { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' },
  label:       { color: '#aaa', fontSize: 13, marginBottom: 4 },
  planName:    { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  badge:       { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 6 },
  badgeActive:    { backgroundColor: '#0d5c2c' },
  badgeQualified: { backgroundColor: '#1a3a6b' },
  badgeInactive:  { backgroundColor: '#3a1a1a' },
  badgeText:   { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  metaText:    { color: '#aaa', fontSize: 13, marginTop: 4 },
  progressBg:  { height: 10, backgroundColor: '#2a2a4a', borderRadius: 5, marginVertical: 8, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#e94560', borderRadius: 5 },
  usageText:   { color: '#ccc', fontSize: 13, marginBottom: 8 },
  noOverageText: { color: '#666', fontSize: 13, marginTop: 6 },
  // overage
  overageBox:       { backgroundColor: '#2a1a0a', borderRadius: 8, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#5a3a10' },
  overageRow:       { color: '#ffcc88', fontSize: 13, marginBottom: 4 },
  overageAmt:       { color: '#ff9944', fontWeight: 'bold' },
  creditAmt:        { color: '#44dd88', fontWeight: 'bold' },
  overageNetRow:    { fontWeight: 'bold', fontSize: 14 },
  overageDisclaimer: { color: '#aaa', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  // credits
  creditBalance: { color: '#44dd88', fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  txRow:    { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  txType:   { color: '#fff', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  txDesc:   { color: '#aaa', fontSize: 12, marginTop: 2 },
  txDate:   { color: '#666', fontSize: 11, marginTop: 2 },
  txAmt:    { fontSize: 14, fontWeight: 'bold', minWidth: 60, textAlign: 'right' },
  txAmtPos: { color: '#44dd88' },
  txAmtNeg: { color: '#e94560' },
  // referral
  referralCodeRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  referralCode:      { color: '#e94560', fontSize: 22, fontWeight: 'bold', letterSpacing: 2, flex: 1 },
  copyBtn:           { backgroundColor: '#0f3460', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  copyBtnText:       { color: '#fff', fontWeight: '600', fontSize: 13 },
  referralStats:     { flexDirection: 'row', gap: 12, marginBottom: 4 },
  referralStat:      { flex: 1, backgroundColor: '#1a2a4a', borderRadius: 8, padding: 10, alignItems: 'center' },
  referralStatVal:   { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  referralStatLabel: { color: '#aaa', fontSize: 11, marginTop: 2 },
  referralHostRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  referralHostName:  { color: '#ccc', fontSize: 14, flex: 1 },
  applyRow:          { flexDirection: 'row', gap: 8, marginTop: 6 },
  applyInput:        { flex: 1, backgroundColor: '#0a1020', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 14 },
  applyBtn:          { backgroundColor: '#e94560', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
  applyBtnDisabled:  { opacity: 0.4 },
  applyBtnText:      { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  // upgrade
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  upgradeBtn:   { backgroundColor: '#0f3460', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 10 },
  upgradeBtnElite: { backgroundColor: '#e94560' },
  btnText:     { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelBtn:   { alignItems: 'center', padding: 14, marginBottom: 16 },
  cancelText:  { color: '#e94560', fontSize: 14 },
  // plan comparison table
  tableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a', marginBottom: 4 },
  tableRow:    { flexDirection: 'row', paddingVertical: 8 },
  tableRowAlt: { backgroundColor: '#1a2a4a', borderRadius: 4 },
  tableHeadText: { color: '#aaa', fontWeight: 'bold' },
  tableCell:   { color: '#ccc', fontSize: 13 },
  activePlanText: { color: '#e94560', fontWeight: 'bold' },
  col:         { flex: 1 },
  colFeature:  { flex: 2 },
  colVal:      { flex: 1, textAlign: 'center' },
});
