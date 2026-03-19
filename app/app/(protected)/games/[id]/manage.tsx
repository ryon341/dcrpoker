import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { gamesApi, Game, GameRsvp, RsvpSummary } from '../../../../src/api/games';
import { billingApi } from '../../../../src/api/billing';
import { T, statusBg } from '../../../../src/components/ui/Theme';

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[s.badge, { backgroundColor: color }]}>
      <Text style={s.badgeText}>{label.toUpperCase()}</Text>
    </View>
  );
}

function ActionBtn({
  label, onPress, color = T.statusInvited, small = false, disabled = false,
}: {
  label: string; onPress: () => void; color?: string; small?: boolean; disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[s.actionBtn, { backgroundColor: color, opacity: disabled ? 0.4 : 1 }, small ? s.actionBtnSmall : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={s.actionBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SummaryCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[s.summaryCell, { backgroundColor: color }]}>
      <Text style={s.summaryCellValue}>{value}</Text>
      <Text style={s.summaryCellLabel}>{label}</Text>
    </View>
  );
}

function PlayerRow({
  inv, busy, children,
}: {
  inv: GameRsvp; busy: boolean; children?: React.ReactNode;
}) {
  return (
    <View style={s.playerRow}>
      {busy ? (
        <ActivityIndicator size="small" color={T.red} style={s.rowBusy} />
      ) : null}
      <View style={s.playerInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text style={s.playerName}>{inv.player_display_name}</Text>
          <Badge label={inv.rsvp_status} color={statusBg(inv.rsvp_status)} />
        </View>
        <Text style={s.playerPhone}>{inv.player_phone}</Text>
        {inv.responded_at ? (
          <Text style={s.playerMeta}>Responded: {new Date(inv.responded_at).toLocaleString()}</Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

// â”€â”€â”€ Main screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function GameManageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();

  const [game,    setGame]    = useState<Game | null>(null);
  const [summary, setSummary] = useState<RsvpSummary | null>(null);
  const [rsvps,   setRsvps]   = useState<GameRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState<number | null>(null);
  const [msg,     setMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  const [seatOpen,     setSeatOpen]     = useState<Record<number, boolean>>({});
  const [seatVal,      setSeatVal]      = useState<Record<number, string>>({});
  const [promoOpen,    setPromoOpen]    = useState<Record<number, boolean>>({});
  const [promoVal,     setPromoVal]     = useState<Record<number, string>>({});
  const [showDeclined, setShowDeclined] = useState(false);
  const [canUseSeatTools, setCanUseSeatTools] = useState(false);

  useEffect(() => {
    billingApi.getStatus()
      .then(s => setCanUseSeatTools(s.features.canUseSeatTools))
      .catch(() => setCanUseSeatTools(false));
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setMsg(null);
    try {
      const [gameRes, rsvpRes] = await Promise.all([
        gamesApi.get(id),
        gamesApi.listRsvps(id),
      ]);
      setGame(gameRes.data.game);
      setSummary(rsvpRes.data.summary);
      setRsvps(rsvpRes.data.rsvps);
    } catch (e: any) {
      setMsg({ ok: false, text: e.message || 'Failed to load game' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  function flash(ok: boolean, text: string) {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function act(inviteId: number, fn: () => Promise<unknown>) {
    setBusy(inviteId);
    try {
      await fn();
      await load();
    } catch (e: any) {
      flash(false, e.message || 'Action failed');
    } finally {
      setBusy(null);
    }
  }

  async function doUpdateRsvp(inv: GameRsvp, status: string) {
    await act(inv.id, () => gamesApi.updateRsvp(id!, inv.id, { rsvp_status: status }));
  }

  async function doAssignSeat(inv: GameRsvp) {
    const num = parseInt(seatVal[inv.id] || '', 10);
    if (!num) { flash(false, 'Enter a valid seat number'); return; }
    await act(inv.id, async () => {
      await gamesApi.assignSeat(id!, inv.id, num);
      setSeatOpen(prev => ({ ...prev, [inv.id]: false }));
      setSeatVal(prev => ({ ...prev, [inv.id]: '' }));
    });
  }

  async function doClearSeat(inv: GameRsvp) {
    await act(inv.id, () => gamesApi.clearSeat(id!, inv.id));
  }

  async function doPromote(inv: GameRsvp) {
    const rawVal = promoVal[inv.id] || '';
    const seatNum = rawVal ? parseInt(rawVal, 10) : null;
    if (rawVal && !seatNum) { flash(false, 'Enter a valid seat number or leave blank'); return; }
    await act(inv.id, async () => {
      await gamesApi.promoteWaitlist(id!, inv.id, seatNum);
      setPromoOpen(prev => ({ ...prev, [inv.id]: false }));
      setPromoVal(prev => ({ ...prev, [inv.id]: '' }));
    });
  }

  async function doMoveUp(inv: GameRsvp, all: GameRsvp[]) {
    const idx = all.findIndex(r => r.id === inv.id);
    if (idx <= 0) return;
    const next = [...all];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    await act(inv.id, () => gamesApi.reorderWaitlist(id!, next.map(r => r.id)));
  }

  async function doMoveDown(inv: GameRsvp, all: GameRsvp[]) {
    const idx = all.findIndex(r => r.id === inv.id);
    if (idx < 0 || idx >= all.length - 1) return;
    const next = [...all];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    await act(inv.id, () => gamesApi.reorderWaitlist(id!, next.map(r => r.id)));
  }

  const confirmed  = rsvps.filter(r => r.rsvp_status === 'confirmed');
  const waitlisted = [...rsvps.filter(r => r.rsvp_status === 'waitlisted')]
                       .sort((a, b) => (a.waitlist_position ?? 99) - (b.waitlist_position ?? 99));
  const invited    = rsvps.filter(r => r.rsvp_status === 'invited');
  const declined   = rsvps.filter(r => r.rsvp_status === 'declined');
  const maxPlayers = game?.max_players ?? 9;
  const overCapacity = summary && summary.confirmed_count > maxPlayers;

  if (loading && !game) {
    return <View style={s.center}><ActivityIndicator size="large" color={T.red} /></View>;
  }

  if (!game) {
    return (
      <View style={s.center}>
        <Text style={s.errText}>{msg?.text || 'Game not found'}</Text>
        <TouchableOpacity onPress={load} style={s.reloadBtn}>
          <Text style={s.reloadBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* â”€â”€ Game header â”€â”€ */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={s.title} numberOfLines={1}>{game.title}</Text>
          <TouchableOpacity onPress={load} style={s.refreshBtn}>
            <Text style={s.refreshBtnText}>â†»</Text>
          </TouchableOpacity>
        </View>
        {game.stakes_label ? <Text style={s.stakes}>{game.stakes_label}</Text> : null}
        {game.starts_at ? (
          <Text style={s.date}>{new Date(game.starts_at).toLocaleString()}</Text>
        ) : null}
      </View>

      {/* â”€â”€ Flash message â”€â”€ */}
      {msg ? (
        <View style={[s.flash, msg.ok ? s.flashOk : s.flashErr]}>
          <Text style={s.flashText}>{msg.text}</Text>
        </View>
      ) : null}

      {/* â”€â”€ Upgrade gate â”€â”€ */}
      {!canUseSeatTools ? (
        <View style={s.upgradeCard}>
          <Text style={s.upgradeHeading}>ðŸ”’ Seat Tools â€” Host Pro Required</Text>
          <Text style={s.upgradeBody}>
            Upgrade to Host Pro to manage RSVPs, assign seats, and run your waitlist.
          </Text>
          <TouchableOpacity
            style={s.upgradeBtn}
            onPress={() => router.push('/(protected)/account/billing')}
          >
            <Text style={s.upgradeBtnText}>View Billing &amp; Upgrade</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* â”€â”€ Summary bar â”€â”€ */}
      {canUseSeatTools && summary ? (
        <View style={s.summaryBar}>
          <SummaryCell label="Confirmed"  value={summary.confirmed_count}  color={T.statusConfirmed} />
          <SummaryCell label="Open Seats" value={summary.open_seats}       color={T.statusInvited} />
          <SummaryCell label="Waitlisted" value={summary.waitlisted_count} color={T.statusWaitlisted} />
          <SummaryCell label="Declined"   value={summary.declined_count}   color={T.statusDeclined} />
        </View>
      ) : null}

      {canUseSeatTools && overCapacity ? (
        <View style={s.warningBar}>
          <Text style={s.warningText}>
            âš  Confirmed ({summary!.confirmed_count}) exceeds table capacity ({maxPlayers})
          </Text>
        </View>
      ) : null}

      {canUseSeatTools ? (<>

        {/* Confirmed */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Confirmed ({confirmed.length})</Text>
          {confirmed.length === 0 ? (
            <Text style={s.empty}>No confirmed players yet.</Text>
          ) : confirmed.map(inv => (
            <PlayerRow key={inv.id} inv={inv} busy={busy === inv.id}>
              {inv.assigned_seat_number != null ? (
                <Text style={s.playerMeta}>Seat: #{inv.assigned_seat_number}</Text>
              ) : null}
              {inv.seat_preference ? (
                <Text style={s.playerMeta}>Pref: {inv.seat_preference}</Text>
              ) : null}
              <View style={s.actionRow}>
                <ActionBtn
                  label={seatOpen[inv.id] ? 'Cancel' : inv.assigned_seat_number != null ? 'âœ Seat' : '+ Seat'}
                  onPress={() => setSeatOpen(p => ({ ...p, [inv.id]: !p[inv.id] }))}
                  small
                />
                {inv.assigned_seat_number != null ? (
                  <ActionBtn label="âœ• Seat" onPress={() => doClearSeat(inv)} color={T.statusWaitlisted} small disabled={busy === inv.id} />
                ) : null}
                <ActionBtn label="â¬‡ Waitlist" onPress={() => doUpdateRsvp(inv, 'waitlisted')} color={T.statusWaitlisted} small disabled={busy === inv.id} />
                <ActionBtn label="âœ— Decline"  onPress={() => doUpdateRsvp(inv, 'declined')}  color={T.statusDeclined} small disabled={busy === inv.id} />
              </View>
              {seatOpen[inv.id] ? (
                <View style={s.seatInputRow}>
                  <TextInput
                    style={s.seatInput}
                    placeholder={`Seat 1â€“${maxPlayers}`}
                    placeholderTextColor={T.faint}
                    keyboardType="numeric"
                    value={seatVal[inv.id] || ''}
                    onChangeText={t => setSeatVal(p => ({ ...p, [inv.id]: t }))}
                  />
                  <ActionBtn label="Assign" onPress={() => doAssignSeat(inv)} color={T.statusConfirmed} small disabled={busy === inv.id} />
                </View>
              ) : null}
            </PlayerRow>
          ))}
        </View>

        {/* Waitlist */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Waitlist ({waitlisted.length})</Text>
          {waitlisted.length === 0 ? (
            <Text style={s.empty}>No players on the waitlist.</Text>
          ) : waitlisted.map((inv, idx) => (
            <PlayerRow key={inv.id} inv={inv} busy={busy === inv.id}>
              <Text style={s.playerMeta}>Position: #{inv.waitlist_position ?? idx + 1}</Text>
              {inv.seat_preference ? (
                <Text style={s.playerMeta}>Pref: {inv.seat_preference}</Text>
              ) : null}
              <View style={s.actionRow}>
                <ActionBtn
                  label={promoOpen[inv.id] ? 'Cancel' : 'â–² Promote'}
                  onPress={() => setPromoOpen(p => ({ ...p, [inv.id]: !p[inv.id] }))}
                  color={T.statusConfirmed} small
                />
                {idx > 0 ? (
                  <ActionBtn label="â†‘" onPress={() => doMoveUp(inv, waitlisted)} color={T.statusInvited} small disabled={busy === inv.id} />
                ) : null}
                {idx < waitlisted.length - 1 ? (
                  <ActionBtn label="â†“" onPress={() => doMoveDown(inv, waitlisted)} color={T.statusInvited} small disabled={busy === inv.id} />
                ) : null}
                <ActionBtn label="âœ— Decline" onPress={() => doUpdateRsvp(inv, 'declined')} color={T.statusDeclined} small disabled={busy === inv.id} />
              </View>
              {promoOpen[inv.id] ? (
                <View style={s.seatInputRow}>
                  <TextInput
                    style={s.seatInput}
                    placeholder={`Seat 1â€“${maxPlayers} (optional)`}
                    placeholderTextColor={T.faint}
                    keyboardType="numeric"
                    value={promoVal[inv.id] || ''}
                    onChangeText={t => setPromoVal(p => ({ ...p, [inv.id]: t }))}
                  />
                  <ActionBtn label="Promote" onPress={() => doPromote(inv)} color={T.statusConfirmed} small disabled={busy === inv.id} />
                </View>
              ) : null}
            </PlayerRow>
          ))}
        </View>

        {/* Invited / No Response */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Invited / No Response ({invited.length})</Text>
          {invited.length === 0 ? (
            <Text style={s.empty}>No pending invites.</Text>
          ) : invited.map(inv => (
            <PlayerRow key={inv.id} inv={inv} busy={busy === inv.id}>
              {inv.seat_preference ? (
                <Text style={s.playerMeta}>Pref: {inv.seat_preference}</Text>
              ) : null}
              <View style={s.actionRow}>
                <ActionBtn label="âœ“ Confirm"  onPress={() => doUpdateRsvp(inv, 'confirmed')}  color={T.statusConfirmed} small disabled={busy === inv.id} />
                <ActionBtn label="â¬‡ Waitlist" onPress={() => doUpdateRsvp(inv, 'waitlisted')} color={T.statusWaitlisted} small disabled={busy === inv.id} />
                <ActionBtn label="âœ— Decline"  onPress={() => doUpdateRsvp(inv, 'declined')}   color={T.statusDeclined} small disabled={busy === inv.id} />
              </View>
            </PlayerRow>
          ))}
        </View>

        {/* Declined (collapsible) */}
        {declined.length > 0 ? (
          <View style={s.section}>
            <TouchableOpacity onPress={() => setShowDeclined(x => !x)} style={s.collapseHeader}>
              <Text style={s.sectionTitle}>Declined ({declined.length})</Text>
              <Text style={s.collapseChevron}>{showDeclined ? 'â–²' : 'â–¼'}</Text>
            </TouchableOpacity>
            {showDeclined ? declined.map(inv => (
              <PlayerRow key={inv.id} inv={inv} busy={busy === inv.id}>
                <View style={s.actionRow}>
                  <ActionBtn label="â†© Invite"   onPress={() => doUpdateRsvp(inv, 'invited')}    color={T.statusInvited} small disabled={busy === inv.id} />
                  <ActionBtn label="âœ“ Confirm"  onPress={() => doUpdateRsvp(inv, 'confirmed')}  color={T.statusConfirmed} small disabled={busy === inv.id} />
                  <ActionBtn label="â¬‡ Waitlist" onPress={() => doUpdateRsvp(inv, 'waitlisted')} color={T.statusWaitlisted} small disabled={busy === inv.id} />
                </View>
              </PlayerRow>
            )) : null}
          </View>
        ) : null}

      </>) : null}

    </ScrollView>
  );
}

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  content:   { padding: 16, paddingBottom: 50 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg },
  errText:   { color: '#ff8888', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  reloadBtn: { backgroundColor: T.card, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: T.border },
  reloadBtnText: { color: T.silver, fontWeight: 'bold' },

  header:    { backgroundColor: T.card, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border },
  title:     { fontSize: 20, fontWeight: 'bold', color: T.white, flex: 1, marginRight: 8 },
  stakes:    { fontSize: 14, color: T.muted, marginBottom: 2, marginTop: 4 },
  date:      { fontSize: 13, color: T.faint },

  refreshBtn:     { backgroundColor: T.cardAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: T.border },
  refreshBtnText: { color: T.muted, fontSize: 14 },

  flash:    { borderRadius: 8, padding: 12, marginBottom: 12 },
  flashOk:  { backgroundColor: '#0a2a14' },
  flashErr: { backgroundColor: '#2a0a0a' },
  flashText:{ color: T.white, fontSize: 14 },

  // Upgrade card
  upgradeCard:    { backgroundColor: T.card, borderRadius: 12, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: T.border },
  upgradeHeading: { color: T.red, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  upgradeBody:    { color: T.muted, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  upgradeBtn:     { backgroundColor: T.red, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  upgradeBtnText: { color: T.white, fontWeight: 'bold', fontSize: 14 },

  summaryBar:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryCell:      { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  summaryCellValue: { color: T.white, fontSize: 22, fontWeight: 'bold' },
  summaryCellLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.3 },

  warningBar:  { backgroundColor: '#3a2000', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#5a3000' },
  warningText: { color: '#ffd080', fontSize: 13 },

  section: {
    backgroundColor: T.card, borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: T.border,
  },
  sectionTitle: {
    color: T.red, fontSize: 11, fontWeight: 'bold',
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  empty:  { color: T.faint, fontSize: 13, paddingVertical: 6 },

  playerRow:  { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border, position: 'relative' },
  rowBusy:    { position: 'absolute', top: 14, right: 0 },
  playerInfo: { paddingRight: 28 },
  playerName: { color: T.white, fontSize: 15, fontWeight: '600' },
  playerPhone:{ color: T.muted, fontSize: 12, marginTop: 2 },
  playerMeta: { color: T.faint, fontSize: 12, marginTop: 2 },

  actionRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  actionBtn:      { borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' },
  actionBtnSmall: { paddingHorizontal: 9, paddingVertical: 5 },
  actionBtnText:  { color: T.white, fontSize: 12, fontWeight: '600' },

  seatInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  seatInput: {
    flex: 1, backgroundColor: '#080808', borderWidth: 1, borderColor: T.border,
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6,
    color: T.white, fontSize: 14,
  },

  badge:    { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText:{ color: T.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.3 },

  collapseHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  collapseChevron: { color: T.muted, fontSize: 14 },
});
