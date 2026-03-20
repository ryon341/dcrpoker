import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { pendingInvite } from '../../src/utils/pendingInvite';
import { notificationsApi } from '../../src/api/notifications';
import { FEATURES } from '../../src/config/features';
import { T } from '../../src/components/ui/Theme';

// ─── NavTile — compact grid button ───────────────────────────────────────────
function NavTile({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={d.tile} onPress={onPress} activeOpacity={0.7}>
      <Text style={d.tileIcon}>{icon}</Text>
      <Text style={d.tileLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── SectionHead ─────────────────────────────────────────────────────────────
function SectionHead({ label }: { label: string }) {
  return <Text style={d.sectionHead}>{label}</Text>;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  // If user just logged in from an invite link, redirect back to it
  useEffect(() => {
    pendingInvite.get().then((code) => {
      if (code) {
        pendingInvite.clear();
        router.replace(`/invite/${code}`);
      }
    });
  }, []);

  const loadUnread = useCallback(() => {
    notificationsApi.list().then(res => {
      setUnreadCount(res.data.unreadCount ?? 0);
    }).catch(() => {});
  }, []);

  useEffect(() => { loadUnread(); }, [loadUnread]);

  return (
    <ScrollView style={d.container} contentContainerStyle={d.content}>

      {/* ── Top bar ── */}
      <View style={d.topBar}>
        <Text style={d.brand}>DCR <Text style={d.brandAccent}>Poker</Text></Text>
        {FEATURES.ENABLE_NOTIFICATIONS && (
          <TouchableOpacity
            style={d.bellBtn}
            onPress={() => router.push('/(protected)/notifications')}
          >
            <Text style={d.bellIcon}>🔔</Text>
            {unreadCount > 0 ? (
              <View style={d.bellBadge}>
                <Text style={d.bellBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      </View>

      {/* ── Welcome card ── */}
      <View style={d.welcomeCard}>
        <Text style={d.welcomeLabel}>Welcome back</Text>
        <Text style={d.welcomeName}>{user?.display_name || user?.phone}</Text>
        {user?.phone && user.display_name ? (
          <Text style={d.welcomePhone}>{user.phone}</Text>
        ) : null}
      </View>

      {/* ── Primary CTAs ── */}
      <TouchableOpacity
        style={d.primaryBtn}
        onPress={() => router.push('/(protected)/games')}
        activeOpacity={0.8}
      >
        <Text style={d.primaryBtnText}>🃏  My Games</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={d.secondaryBtn}
        onPress={() => router.push('/(protected)/games/create')}
        activeOpacity={0.8}
      >
        <Text style={d.secondaryBtnText}>+ Create Game</Text>
      </TouchableOpacity>

      {/* ── Player management ── */}
      <SectionHead label="Players & Contacts" />
      <View style={d.tileGrid}>
        <NavTile icon="👤" label="My Players"      onPress={() => router.push('/(protected)/players')} />
        <NavTile icon="📋" label="Contacts"        onPress={() => router.push('/(protected)/contacts')} />
        <NavTile icon="📥" label="Import"          onPress={() => router.push('/(protected)/players/import')} />
        {FEATURES.ENABLE_INVITE_TOOLS ? (
          <NavTile icon="🔗" label="Invite Tools" onPress={() => router.push('/(protected)/players/invite-tools')} />
        ) : null}
      </View>

      {/* ── Communication ── */}
      <SectionHead label="Communication" />
      <View style={d.tileGrid}>
        <NavTile icon="💬" label="Messages"  onPress={() => router.push('/(protected)/messages')} />
        <NavTile icon="📨" label="Invites"   onPress={() => router.push('/(protected)/invites')} />
        {FEATURES.ENABLE_NOTIFICATIONS ? (
          <NavTile icon="🔔" label="Alerts"  onPress={() => router.push('/(protected)/notifications')} />
        ) : null}
      </View>

      {/* ── Tools & Resources ── */}
      {(FEATURES.ENABLE_TOOLS || FEATURES.ENABLE_GEAR || FEATURES.ENABLE_PUBLIC_GAMES) ? (
        <>
          <SectionHead label="Tools & Resources" />
          <View style={d.tileGrid}>
            {FEATURES.ENABLE_TOOLS ? (
              <NavTile icon="🎰" label="Poker Tools" onPress={() => router.push('/(protected)/tools')} />
            ) : null}
            {FEATURES.ENABLE_GEAR ? (
              <NavTile icon="🛒" label="Gear"        onPress={() => router.push('/(protected)/gear')} />
            ) : null}
            {FEATURES.ENABLE_PUBLIC_GAMES ? (
              <NavTile icon="📍" label="Public Games" onPress={() => router.push('/(protected)/public-games')} />
            ) : null}
          </View>
        </>
      ) : null}

      {/* ── Account ── */}
      <SectionHead label="Account" />
      <View style={d.tileGrid}>
        <NavTile icon="💳" label="Billing"  onPress={() => router.push('/(protected)/account/billing')} />
        {FEATURES.ENABLE_REFERRALS ? (
          <NavTile icon="👥" label="Referrals" onPress={() => router.push('/(protected)/account/referrals')} />
        ) : null}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={d.signOutBtn} onPress={logout}>
        <Text style={d.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const d = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  content:   { padding: 20, paddingBottom: 56 },

  // Top bar
  topBar:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 8 },
  brand:     { fontSize: 24, fontWeight: 'bold', color: T.white },
  brandAccent: { color: T.gold },
  bellBtn:   { padding: 6, position: 'relative' },
  bellIcon:  { fontSize: 22 },
  bellBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: T.red, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  bellBadgeText: { color: T.white, fontSize: 10, fontWeight: 'bold' },

  // Welcome card
  welcomeCard:  { borderRadius: 24, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: T.cardGlass, padding: 22, marginBottom: 24 },
  welcomeLabel: { color: 'rgba(251,191,36,0.7)', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  welcomeName:  { color: T.white, fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  welcomePhone: { color: T.muted, fontSize: 13 },

  // Primary CTAs
  primaryBtn:     { backgroundColor: T.gold, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#0c0a09', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn:     { borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: T.cardGlass },
  secondaryBtnText: { color: T.silver, fontWeight: 'bold', fontSize: 15 },

  // Section
  sectionHead: { color: T.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },

  // Tile grid
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  tile:      { borderRadius: 16, borderWidth: 1, borderColor: T.cardBorder, backgroundColor: T.cardGlass, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', minWidth: '22%', flex: 1 },
  tileIcon:  { fontSize: 22, marginBottom: 6 },
  tileLabel: { color: T.silver, fontSize: 12, fontWeight: '600', textAlign: 'center' },

  // Sign out
  signOutBtn:  { paddingVertical: 20, marginTop: 8, alignItems: 'center' },
  signOutText: { color: T.faint, fontSize: 14 },
});
