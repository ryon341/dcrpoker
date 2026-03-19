import { useWindowDimensions, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:     '#0a0a0a',
  bgAlt:  '#111111',
  card:   '#161616',
  border: '#222222',
  red:    '#e94560',
  gold:   '#f5a623',
  blue:   '#4a9eff',
  purple: '#9b59b6',
  white:  '#ffffff',
  silver: '#cccccc',
  muted:  '#888888',
  faint:  '#444444',
  green:  '#4caf50',
};
const MAX = 1160;

// ─── Nav ──────────────────────────────────────────────────────────────────────
function NavBar({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={nav.outer}>
      <View style={nav.inner}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={nav.logo}>DCR <Text style={{ color: C.red }}>Poker</Text></Text>
        </TouchableOpacity>
        {wide && (
          <View style={nav.links}>
            {([['Home', '/'], ['Tools', '/poker-tools'], ['Training', '/poker-training'], ['Gear', '/poker-chips'], ['Pricing', '/pricing']] as [string, string][]).map(([label, href]) => (
              <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={nav.link}>
                <Text style={[nav.linkText, label === 'Pricing' ? nav.linkActive : null]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity style={nav.signIn} onPress={() => router.push('/(auth)/login')}>
          <Text style={nav.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={hero.outer}>
      <View style={[hero.content, wide ? hero.contentWide : null]}>
        <Text style={[hero.h1, wide ? hero.h1Wide : null]}>
          Simple Pricing for{'\n'}
          <Text style={{ color: C.red }}>Better Poker Games</Text>
        </Text>
        <Text style={[hero.sub, wide ? hero.subWide : null]}>
          Start free. Upgrade when you're ready to run your game like a pro.
        </Text>
        <View style={[hero.ctaRow, wide ? { flexDirection: 'row' } : null]}>
          <TouchableOpacity style={hero.ctaPrimary} onPress={() => router.push('/(auth)/login')}>
            <Text style={hero.ctaPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={hero.ctaSecondary} onPress={() => router.push('/(protected)/account/billing')}>
            <Text style={hero.ctaSecondaryText}>View Features</Text>
          </TouchableOpacity>
        </View>
        <Text style={hero.noContract}>No contracts. No complicated setup.</Text>
      </View>
    </View>
  );
}

// ─── Pricing Cards ────────────────────────────────────────────────────────────
const FREE_FEATURES    = ['Join private games', 'RSVP to invites', 'Chip calculator & odds tools', 'Limited training access'];
const PRO_FEATURES     = ['Everything in Free', 'Create and manage games', 'Invite players easily', 'SMS RSVP system', 'Seat control + waitlist', 'Full tools access', 'Full training access', 'Prospect import + invite tools'];
const PREMIUM_FEATURES = ['Advanced training tools', 'Detailed analytics', 'Priority features', 'Future upgrades'];

function Check({ good, text }: { good: boolean; text: string }) {
  return (
    <View style={prc.featureRow}>
      <Text style={[prc.check, { color: good ? C.green : C.faint }]}>{good ? '✓' : '—'}</Text>
      <Text style={[prc.featureText, !good ? { color: C.faint } : null]}>{text}</Text>
    </View>
  );
}

function PricingCards({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <View style={[prc.row, wide ? { flexDirection: 'row', alignItems: 'flex-start' } : null]}>

          {/* Free */}
          <View style={[prc.card, wide ? { flex: 1 } : null]}>
            <Text style={prc.planName}>Free</Text>
            <View style={prc.priceRow}>
              <Text style={prc.price}>$0</Text>
              <Text style={prc.period}> / month</Text>
            </View>
            <Text style={prc.bestFor}>Best for players joining games</Text>
            <View style={prc.divider} />
            {FREE_FEATURES.map(f => <Check key={f} good text={f} />)}
            <TouchableOpacity style={prc.btnFree} onPress={() => router.push('/(auth)/login')}>
              <Text style={prc.btnFreeText}>Start Free</Text>
            </TouchableOpacity>
          </View>

          {/* Host Pro — highlighted */}
          <View style={[prc.card, prc.cardPro, wide ? { flex: 1 } : null]}>
            <View style={prc.popularBadge}>
              <Text style={prc.popularText}>⭐ MOST POPULAR</Text>
            </View>
            <Text style={[prc.planName, { color: C.gold }]}>Host Pro</Text>
            <View style={prc.priceRow}>
              <Text style={[prc.price, { color: C.gold }]}>$10</Text>
              <Text style={prc.period}> / month</Text>
            </View>
            <Text style={prc.bestFor}>Best for hosts running regular games</Text>
            <View style={prc.divider} />
            {PRO_FEATURES.map(f => <Check key={f} good text={f} />)}
            <TouchableOpacity style={prc.btnPro} onPress={() => router.push('/(protected)/account/billing')}>
              <Text style={prc.btnProText}>Upgrade to Host Pro</Text>
            </TouchableOpacity>
          </View>

          {/* Premium */}
          <View style={[prc.card, prc.cardPremium, wide ? { flex: 1 } : null]}>
            <Text style={[prc.planName, { color: C.purple }]}>Premium</Text>
            <View style={prc.priceRow}>
              <Text style={[prc.price, { color: C.purple }]}>Coming</Text>
              <Text style={prc.period}> Soon</Text>
            </View>
            <Text style={prc.bestFor}>For serious players and hosts</Text>
            <View style={prc.divider} />
            {PREMIUM_FEATURES.map(f => <Check key={f} good text={f} />)}
            <TouchableOpacity style={prc.btnPremium} disabled>
              <Text style={prc.btnPremiumText}>Join Waitlist</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
}

// ─── Feature Comparison Grid ─────────────────────────────────────────────────
const COMPARE_ROWS: [string, string, string, string][] = [
  ['Join games',           '✅', '✅', '✅'],
  ['Create games',         '❌', '✅', '✅'],
  ['SMS RSVP system',      '❌', '✅', '✅'],
  ['Waitlist management',  '❌', '✅', '✅'],
  ['Basic tools',          '✅', '✅', '✅'],
  ['Advanced tools',       '❌', '✅', '✅'],
  ['Training',             '⚡ Limited', '🟢 Full', '🚀 Advanced'],
  ['Import + invites',     '❌', '✅', '✅'],
];

function CompareGrid({ wide }: { wide: boolean }) {
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>What You Get at Each Level</Text>
        <View style={grid.table}>
          {/* Header */}
          <View style={[grid.row, grid.headerRow]}>
            <Text style={[grid.cell, grid.featureCell, grid.headerText]}>Feature</Text>
            <Text style={[grid.cell, grid.headerText]}>Free</Text>
            <Text style={[grid.cell, grid.headerText, { color: C.gold }]}>Host Pro</Text>
            <Text style={[grid.cell, grid.headerText, { color: C.purple }]}>Premium</Text>
          </View>
          {COMPARE_ROWS.map(([feat, free, pro, prem], i) => (
            <View key={feat} style={[grid.row, i % 2 === 1 ? grid.rowAlt : null]}>
              <Text style={[grid.cell, grid.featureCell]}>{feat}</Text>
              <Text style={[grid.cell, grid.valueCell]}>{free}</Text>
              <Text style={[grid.cell, grid.valueCell]}>{pro}</Text>
              <Text style={[grid.cell, grid.valueCell]}>{prem}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Value Breakdown ─────────────────────────────────────────────────────────
const VALUE = [
  { icon: '🛑', title: 'Stop the Chaos', body: 'No more group texts, confusion, or last-minute dropouts.' },
  { icon: '💺', title: 'Fill Every Seat', body: 'Automatically manage waitlists and keep your table full.' },
  { icon: '🏆', title: 'Run Better Games', body: 'Look organized, professional, and in control.' },
];

function ValueBreakdown({ wide }: { wide: boolean }) {
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Why Hosts Upgrade</Text>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 14 }}>
          {VALUE.map(v => (
            <View key={v.title} style={[val.card, wide ? { flex: 1 } : null]}>
              <Text style={val.icon}>{v.icon}</Text>
              <Text style={val.title}>{v.title}</Text>
              <Text style={val.body}>{v.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Who It's For ─────────────────────────────────────────────────────────────
const WHO = [
  { icon: '🎴', title: 'Casual Players', body: 'Join games and use tools — completely free.' },
  { icon: '🎯', title: 'Home Game Hosts', body: 'Run games smoothly without spreadsheets or texting chaos.' },
  { icon: '🧠', title: 'Serious Players', body: 'Improve your edge with tools and training.' },
];

function WhoItsFor({ wide }: { wide: boolean }) {
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Built for Real Poker Players</Text>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 14 }}>
          {WHO.map(w => (
            <View key={w.title} style={[who.card, wide ? { flex: 1 } : null]}>
              <Text style={who.icon}>{w.icon}</Text>
              <Text style={who.title}>{w.title}</Text>
              <Text style={who.body}>{w.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Do I need to pay to join a game?', a: 'No. Players can join and use basic tools for free.' },
  { q: 'When should I upgrade?', a: 'Upgrade when you start hosting games or want full control.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts.' },
  { q: 'Do players need to pay?', a: 'No. Only hosts need a paid plan.' },
];

function FAQ({ wide }: { wide: boolean }) {
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Frequently Asked Questions</Text>
        <View style={wide ? { flexDirection: 'row', flexWrap: 'wrap', gap: 16 } : { gap: 12 }}>
          {FAQS.map(f => (
            <View key={f.q} style={[faq.card, wide ? { width: '47%' } : null]}>
              <Text style={faq.q}>{f.q}</Text>
              <Text style={faq.a}>{f.a}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={cta.outer}>
      <View style={cta.inner}>
        <Text style={[cta.heading, wide ? { fontSize: 36 } : null]}>Start Running Better Games Today</Text>
        <Text style={cta.sub}>It takes less than a minute to get started.</Text>
        <View style={[cta.btnRow, wide ? { flexDirection: 'row', justifyContent: 'center' } : null]}>
          <TouchableOpacity style={cta.btnPrimary} onPress={() => router.push('/(auth)/login')}>
            <Text style={cta.btnPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cta.btnSecondary} onPress={() => router.push('/(protected)/account/billing')}>
            <Text style={cta.btnSecondaryText}>Upgrade to Host Pro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ wide }: { wide: boolean }) {
  const router = useRouter();
  const cols = [
    { heading: 'Plans', links: [['Free', '/(auth)/login'], ['Host Pro', '/(protected)/account/billing'], ['Pricing', '/pricing']] },
    { heading: 'Tools', links: [['Poker Tools', '/poker-tools'], ['Training', '/poker-training'], ['Gear', '/poker-chips']] },
    { heading: 'App', links: [['Sign In', '/(auth)/login'], ['My Games', '/(protected)/games'], ['Bankroll', '/(protected)/bankroll']] },
  ];
  return (
    <View style={foot.outer}>
      <View style={foot.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 40, marginBottom: 28 } : { gap: 20, marginBottom: 20 }}>
          <View style={wide ? { width: 200 } : null}>
            <Text style={foot.brand}>DCR <Text style={{ color: C.red }}>Poker</Text></Text>
            <Text style={foot.tagline}>Built for Real Games</Text>
          </View>
          <View style={wide ? { flex: 1, flexDirection: 'row', gap: 32 } : { gap: 16 }}>
            {cols.map(col => (
              <View key={col.heading} style={wide ? { flex: 1 } : null}>
                <Text style={foot.colHead}>{col.heading}</Text>
                {col.links.map(([label, href]) => (
                  <TouchableOpacity key={label} onPress={() => router.push(href as any)}>
                    <Text style={foot.link}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={foot.divider} />
        <Text style={foot.copy}>© {new Date().getFullYear()} DCR Poker — Built for Real Games</Text>
      </View>
    </View>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavBar wide={wide} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 60 }}>
        <Hero wide={wide} />
        <PricingCards wide={wide} />
        <CompareGrid wide={wide} />
        <ValueBreakdown wide={wide} />
        <WhoItsFor wide={wide} />
        <FAQ wide={wide} />
        <FinalCTA wide={wide} />
        <Footer wide={wide} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const nav = StyleSheet.create({
  outer:      { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(10,10,10,0.95)', borderBottomWidth: 1, borderBottomColor: C.border, height: 60 },
  inner:      { maxWidth: MAX, alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  logo:       { color: C.white, fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  links:      { flexDirection: 'row', gap: 4 },
  link:       { paddingHorizontal: 14, paddingVertical: 8 },
  linkText:   { color: C.muted, fontSize: 14 },
  linkActive: { color: C.white },
  signIn:     { backgroundColor: C.red, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  signInText: { color: C.white, fontWeight: 'bold', fontSize: 14 },
});

const hero = StyleSheet.create({
  outer:           { backgroundColor: '#0a0a12', paddingTop: 80, paddingBottom: 72, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  content:         { maxWidth: MAX, alignSelf: 'center', width: '100%', alignItems: 'center' },
  contentWide:     { alignItems: 'flex-start' },
  h1:              { color: C.white, fontSize: 32, fontWeight: 'bold', textAlign: 'center', lineHeight: 42, marginBottom: 16 },
  h1Wide:          { fontSize: 48, lineHeight: 60, textAlign: 'left' },
  sub:             { color: C.silver, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 32, maxWidth: 540 },
  subWide:         { fontSize: 18, textAlign: 'left' },
  ctaRow:          { gap: 12, alignItems: 'center', marginBottom: 18 },
  ctaPrimary:      { backgroundColor: C.red, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 34 },
  ctaPrimaryText:  { color: C.white, fontWeight: 'bold', fontSize: 16 },
  ctaSecondary:    { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, borderWidth: 1, borderColor: C.faint },
  ctaSecondaryText: { color: C.silver, fontWeight: 'bold', fontSize: 15 },
  noContract:      { color: C.faint, fontSize: 13 },
});

const sec = StyleSheet.create({
  outer:   { paddingVertical: 60, paddingHorizontal: 20 },
  inner:   { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  heading: { color: C.white, fontSize: 26, fontWeight: 'bold', marginBottom: 28, textAlign: 'center' },
});

const prc = StyleSheet.create({
  row:         { gap: 16 },
  card:        { backgroundColor: C.card, borderRadius: 14, padding: 24, borderWidth: 1, borderColor: C.border },
  cardPro:     { borderColor: C.gold, borderWidth: 2 },
  cardPremium: { borderColor: '#2a1a3a', opacity: 0.85 },
  popularBadge: { backgroundColor: 'rgba(245,166,35,0.12)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(245,166,35,0.4)', marginBottom: 10 },
  popularText: { color: C.gold, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  planName:    { color: C.white, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  priceRow:    { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  price:       { color: C.white, fontSize: 36, fontWeight: 'bold' },
  period:      { color: C.muted, fontSize: 15 },
  bestFor:     { color: C.muted, fontSize: 13, marginBottom: 14 },
  divider:     { height: 1, backgroundColor: C.border, marginBottom: 16 },
  featureRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  check:       { fontSize: 14, width: 18 },
  featureText: { color: C.silver, fontSize: 14, flex: 1, lineHeight: 20 },
  btnFree:     { marginTop: 20, borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingVertical: 13, alignItems: 'center' },
  btnFreeText: { color: C.silver, fontWeight: 'bold', fontSize: 15 },
  btnPro:      { marginTop: 20, backgroundColor: C.gold, borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  btnProText:  { color: '#000', fontWeight: 'bold', fontSize: 15 },
  btnPremium:  { marginTop: 20, borderRadius: 8, borderWidth: 1, borderColor: '#2a1a3a', paddingVertical: 13, alignItems: 'center', opacity: 0.5 },
  btnPremiumText: { color: C.purple, fontWeight: 'bold', fontSize: 15 },
});

const grid = StyleSheet.create({
  table:      { borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  row:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  rowAlt:     { backgroundColor: '#0e0e0e' },
  headerRow:  { backgroundColor: '#161616' },
  cell:       { flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: C.silver, fontSize: 13, textAlign: 'center' },
  featureCell: { flex: 2, textAlign: 'left', color: C.muted },
  valueCell:  { flex: 1, textAlign: 'center' },
  headerText: { color: C.white, fontWeight: 'bold', fontSize: 13 },
});

const val = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 22, borderWidth: 1, borderColor: C.border },
  icon:  { fontSize: 30, marginBottom: 10 },
  title: { color: C.white, fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  body:  { color: C.muted, fontSize: 14, lineHeight: 22 },
});

const who = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 22, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  icon:  { fontSize: 30, marginBottom: 10 },
  title: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  body:  { color: C.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});

const faq = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 10, padding: 18, borderWidth: 1, borderColor: C.border },
  q:    { color: C.white, fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  a:    { color: C.muted, fontSize: 14, lineHeight: 22 },
});

const cta = StyleSheet.create({
  outer:           { backgroundColor: C.red, paddingVertical: 68, paddingHorizontal: 20 },
  inner:           { maxWidth: 740, alignSelf: 'center', width: '100%', alignItems: 'center' },
  heading:         { color: C.white, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub:             { color: 'rgba(255,255,255,0.75)', fontSize: 15, textAlign: 'center', marginBottom: 28 },
  btnRow:          { gap: 12, alignItems: 'center' },
  btnPrimary:      { backgroundColor: C.white, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 36 },
  btnPrimaryText:  { color: C.red, fontWeight: 'bold', fontSize: 16 },
  btnSecondary:    { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  btnSecondaryText: { color: C.white, fontWeight: 'bold', fontSize: 15 },
});

const foot = StyleSheet.create({
  outer:   { backgroundColor: '#060606', paddingVertical: 44, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  inner:   { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  brand:   { color: C.white, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  tagline: { color: C.faint, fontSize: 13 },
  colHead: { color: C.white, fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  link:    { color: C.faint, fontSize: 13, marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#1a1a1a', marginBottom: 16 },
  copy:    { color: '#333333', fontSize: 12, textAlign: 'center' },
});
