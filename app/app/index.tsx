import { useWindowDimensions, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

// ─── Shared tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#0a0a0a',
  bgAlt:    '#111111',
  card:     '#161616',
  border:   '#222222',
  red:      '#e94560',
  redDim:   '#b0303f',
  blue:     '#4a9eff',
  white:    '#ffffff',
  silver:   '#cccccc',
  muted:    '#888888',
  faint:    '#444444',
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
function NavBar({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[nav.outer, wide ? nav.outerWide : null]}>
      <View style={nav.inner}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={nav.logo}>DCR <Text style={{ color: C.red }}>Poker</Text></Text>
        </TouchableOpacity>
        {wide && (
          <View style={nav.links}>
            {[['Tools', '/(protected)/tools'], ['Training', '/(protected)/tools/training'], ['Gear', '/(protected)/gear'], ['Pricing', '/(protected)/account/billing']].map(([label, href]) => (
              <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={nav.link}>
                <Text style={nav.linkText}>{label}</Text>
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
  const suits = ['♠', '♥', '♦', '♣'];
  return (
    <View style={hero.outer}>
      {/* Floating suit symbols for atmosphere */}
      {suits.map((s, i) => (
        <Text key={i} style={[hero.suitBg, { top: 20 + i * 80, left: 10 + i * 60, opacity: 0.05 + i * 0.015 }]}>{s}</Text>
      ))}
      <View style={[hero.content, wide ? hero.contentWide : null]}>
        <View style={hero.badge}>
          <Text style={hero.badgeText}>🃏 FOR HOME GAME HOSTS</Text>
        </View>
        <Text style={[hero.h1, wide ? hero.h1Wide : null]}>
          Run Your Home Poker Game{'\n'}
          <Text style={{ color: C.red }}>Like a Pro</Text>
        </Text>
        <Text style={[hero.sub, wide ? hero.subWide : null]}>
          Manage players, track bankroll, and improve your edge —{'\n'}all in one app built for real games.
        </Text>
        <View style={[hero.ctaRow, wide ? { flexDirection: 'row' } : null]}>
          <TouchableOpacity style={hero.ctaPrimary} onPress={() => router.push('/(auth)/login')}>
            <Text style={hero.ctaPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={hero.ctaSecondary} onPress={() => router.push('/(protected)/tools')}>
            <Text style={hero.ctaSecondaryText}>Explore Tools</Text>
          </TouchableOpacity>
        </View>
        <Text style={hero.noDownload}>No downloads. No complicated setup.</Text>
      </View>
    </View>
  );
}

// ─── ValueCards ───────────────────────────────────────────────────────────────
const VALUE_CARDS = [
  { icon: '🎯', title: 'Run Your Game Without the Chaos', body: 'Invite players, track RSVPs, manage seats, and handle waitlists — all in one place.' },
  { icon: '🧠', title: 'Make Better Decisions at the Table', body: 'Use built-in tools and training to improve your edge before and during every session.' },
  { icon: '🛒', title: 'Upgrade Your Poker Setup', body: 'Find the right chips, gear, and tools to run a smooth, professional game.' },
];

function ValueCards({ wide }: { wide: boolean }) {
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 16 }}>
          {VALUE_CARDS.map(c => (
            <View key={c.title} style={[vc.card, wide ? { flex: 1 } : null]}>
              <Text style={vc.icon}>{c.icon}</Text>
              <Text style={vc.title}>{c.title}</Text>
              <Text style={vc.body}>{c.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '📋', title: 'Game Management', body: 'Create games, invite players, and manage attendance in real time.' },
  { icon: '✅', title: 'Smart RSVP System', body: 'Players respond by text. You see confirmed, waitlist, and open seats instantly.' },
  { icon: '🔧', title: 'Built-In Tools', body: 'Chip calculator, odds calculator, and preflop charts — all in one place.' },
  { icon: '🏋️', title: 'Training Mode', body: 'Sharpen your game with fast, interactive training scenarios.' },
];

function Features({ wide }: { wide: boolean }) {
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Everything You Need to Run Better Games</Text>
        <View style={wide ? { flexDirection: 'row', flexWrap: 'wrap', gap: 16 } : { gap: 14 }}>
          {FEATURES.map(f => (
            <View key={f.title} style={[feat.card, wide ? { width: '47%' } : null]}>
              <Text style={feat.icon}>{f.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={feat.title}>{f.title}</Text>
                <Text style={feat.body}>{f.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Create or Join a Game', body: 'Set up your game or accept an invite in seconds.' },
  { num: '02', title: 'Manage Players', body: 'Track RSVPs, fill seats, and control your table.' },
  { num: '03', title: 'Play Smarter', body: 'Use tools and training to gain an edge.' },
];

function HowItWorks({ wide }: { wide: boolean }) {
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>How It Works</Text>
        <View style={wide ? { flexDirection: 'row', gap: 0 } : { gap: 0 }}>
          {STEPS.map((s, i) => (
            <View key={s.num} style={[hiw.step, wide ? { flex: 1 } : null]}>
              {i > 0 && wide ? <View style={hiw.connector} /> : null}
              <Text style={hiw.num}>{s.num}</Text>
              <Text style={hiw.title}>{s.title}</Text>
              <Text style={hiw.body}>{s.body}</Text>
              {i < STEPS.length - 1 && !wide ? <View style={hiw.connectorV} /> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Tools Preview ────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '🪙', title: 'Chip Calculator', body: 'Know exactly how many chips you need for any game.', cta: 'Use Calculator', href: '/(protected)/tools/chip-calculator' },
  { icon: '🃏', title: 'Preflop Charts', body: 'Learn what to play from every position.', cta: 'View Charts', href: '/(protected)/tools/preflop-charts' },
  { icon: '🎲', title: 'Odds Calculator', body: 'Quickly calculate your chances and make better decisions.', cta: 'Calculate Odds', href: '/(protected)/tools/odds-calculator' },
];

function ToolsPreview({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Free Poker Tools Built Into the App</Text>
        <Text style={sec.subheading}>Everything you need to run and improve your game — no spreadsheets, no guesswork.</Text>
        <View style={wide ? { flexDirection: 'row', gap: 16 } : { gap: 14 }}>
          {TOOLS.map(t => (
            <View key={t.title} style={[tool.card, wide ? { flex: 1 } : null]}>
              <Text style={tool.icon}>{t.icon}</Text>
              <Text style={tool.title}>{t.title}</Text>
              <Text style={tool.body}>{t.body}</Text>
              <TouchableOpacity style={tool.cta} onPress={() => router.push(t.href as any)}>
                <Text style={tool.ctaText}>{t.cta} →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => router.push('/(protected)/tools')} style={tool.allLink}>
          <Text style={tool.allLinkText}>Use Free Tools →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Training + Books ─────────────────────────────────────────────────────────
function TrainingBooks({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 24 } : { gap: 20 }}>
          <View style={[tb.half, wide ? { flex: 1 } : null]}>
            <Text style={tb.tag}>TRAINING</Text>
            <Text style={tb.title}>Improve Your Game Faster</Text>
            <Text style={tb.body}>Train with real scenarios and build better instincts without risking money.</Text>
            <TouchableOpacity style={tb.btn} onPress={() => router.push('/(protected)/tools/training')}>
              <Text style={tb.btnText}>Start Training</Text>
            </TouchableOpacity>
          </View>
          <View style={wide ? tb.dividerV : tb.dividerH} />
          <View style={[tb.half, wide ? { flex: 1 } : null]}>
            <Text style={tb.tag}>RESOURCES</Text>
            <Text style={tb.title}>Learn from the Best</Text>
            <Text style={tb.body}>Explore our recommended poker books and audiobooks used by serious players.</Text>
            <TouchableOpacity style={[tb.btn, { backgroundColor: '#0f3460' }]} onPress={() => router.push('/(protected)/tools')}>
              <Text style={tb.btnText}>Browse Books</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Gear ─────────────────────────────────────────────────────────────────────
function Gear({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: '#0d0812' }]}>
      <View style={sec.inner}>
        <View style={[gear.banner, wide ? { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } : null]}>
          <View style={wide ? { flex: 1 } : null}>
            <Text style={gear.supertitle}>GEAR</Text>
            <Text style={[gear.heading, wide ? { textAlign: 'left' } : null]}>Build the Perfect Game Setup</Text>
            <Text style={[gear.body, wide ? { textAlign: 'left' } : null]}>From casual home games to serious tables — get the right chips and gear.</Text>
          </View>
          <TouchableOpacity style={[gear.btn, wide ? { marginTop: 0, marginLeft: 32 } : null]} onPress={() => router.push('/(protected)/gear')}>
            <Text style={gear.btnText}>View Poker Chips & Gear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Trust ────────────────────────────────────────────────────────────────────
function Trust() {
  return (
    <View style={trust.outer}>
      <View style={trust.inner}>
        <Text style={trust.text}>Built for real players running real home games.</Text>
        <Text style={trust.sub}>No public listings. No spam. Just better poker.</Text>
        <View style={trust.chips}>
          {['🔒 Private', '⚡ Fast Setup', '🃏 Real Games', '📱 Mobile-First'].map(l => (
            <View key={l} style={trust.chip}><Text style={trust.chipText}>{l}</Text></View>
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
        <Text style={[cta.heading, wide ? { fontSize: 38 } : null]}>Start Running Better Games Today</Text>
        <Text style={cta.sub}>It takes less than a minute to get started.</Text>
        <View style={[cta.btnRow, wide ? { flexDirection: 'row', justifyContent: 'center' } : null]}>
          <TouchableOpacity style={cta.btnPrimary} onPress={() => router.push('/(auth)/login')}>
            <Text style={cta.btnPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cta.btnSecondary} onPress={() => router.push('/(protected)/tools')}>
            <Text style={cta.btnSecondaryText}>Explore Tools</Text>
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
    { heading: 'App', links: [['My Games', '/(protected)/games'], ['Players', '/(protected)/players'], ['Bankroll', '/(protected)/bankroll'], ['Notifications', '/(protected)/notifications']] },
    { heading: 'Tools', links: [['Chip Calculator', '/(protected)/tools/chip-calculator'], ['Preflop Charts', '/(protected)/tools/preflop-charts'], ['Odds Calculator', '/(protected)/tools/odds-calculator'], ['Training', '/(protected)/tools/training']] },
    { heading: 'Account', links: [['Sign In', '/(auth)/login'], ['Billing & Plan', '/(protected)/account/billing'], ['Referrals', '/(protected)/account/referrals']] },
    { heading: 'About', links: [['Public Games', '/(protected)/public-games'], ['Gear', '/(protected)/gear'], ['Tools', '/(protected)/tools']] },
  ];
  return (
    <View style={foot.outer}>
      <View style={foot.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 40, marginBottom: 32 } : { gap: 24, marginBottom: 24 }}>
          <View style={wide ? { width: 220 } : null}>
            <Text style={foot.brand}>DCR <Text style={{ color: C.red }}>Poker</Text></Text>
            <Text style={foot.tagline}>Built for Real Games</Text>
          </View>
          <View style={wide ? { flex: 1, flexDirection: 'row', gap: 32 } : { gap: 20 }}>
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

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  if (!isLoading && user) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavBar wide={wide} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 60 }}>
        <Hero wide={wide} />
        <ValueCards wide={wide} />
        <Features wide={wide} />
        <HowItWorks wide={wide} />
        <ToolsPreview wide={wide} />
        <TrainingBooks wide={wide} />
        <Gear wide={wide} />
        <Trust />
        <FinalCTA wide={wide} />
        <Footer wide={wide} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const MAX = 1160;

const nav = StyleSheet.create({
  outer:     { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(10,10,10,0.95)', borderBottomWidth: 1, borderBottomColor: C.border, height: 60 },
  outerWide: {},
  inner:     { maxWidth: MAX, alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  logo:      { color: C.white, fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  links:     { flexDirection: 'row', gap: 4 },
  link:      { paddingHorizontal: 14, paddingVertical: 8 },
  linkText:  { color: C.muted, fontSize: 14 },
  signIn:    { backgroundColor: C.red, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  signInText: { color: C.white, fontWeight: 'bold', fontSize: 14 },
});

const hero = StyleSheet.create({
  outer: {
    backgroundColor: '#1a0510',
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 20,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  suitBg: { position: 'absolute', fontSize: 120, color: C.white },
  content: { maxWidth: MAX, alignSelf: 'center', width: '100%', alignItems: 'center' },
  contentWide: { alignItems: 'flex-start', paddingHorizontal: 20 },
  badge: { backgroundColor: 'rgba(233,69,96,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(233,69,96,0.3)', marginBottom: 20 },
  badgeText: { color: C.red, fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  h1:       { color: C.white, fontSize: 34, fontWeight: 'bold', textAlign: 'center', lineHeight: 44, marginBottom: 18 },
  h1Wide:   { fontSize: 52, lineHeight: 64, textAlign: 'left' },
  sub:      { color: C.silver, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 32, maxWidth: 560 },
  subWide:  { fontSize: 18, textAlign: 'left' },
  ctaRow:   { gap: 12, alignItems: 'center', marginBottom: 20 },
  ctaPrimary: { backgroundColor: C.red, borderRadius: 8, paddingVertical: 16, paddingHorizontal: 36 },
  ctaPrimaryText:   { color: C.white, fontWeight: 'bold', fontSize: 17 },
  ctaSecondary:     { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 32, borderWidth: 1, borderColor: C.faint },
  ctaSecondaryText: { color: C.silver, fontWeight: 'bold', fontSize: 16 },
  noDownload: { color: C.faint, fontSize: 13 },
});

const sec = StyleSheet.create({
  outer:      { paddingVertical: 64, paddingHorizontal: 20 },
  inner:      { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  heading:    { color: C.white, fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subheading: { color: C.muted, fontSize: 15, marginBottom: 28, textAlign: 'center', lineHeight: 22 },
});

const vc = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: C.border },
  icon:  { fontSize: 32, marginBottom: 12 },
  title: { color: C.white, fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  body:  { color: C.muted, fontSize: 14, lineHeight: 22 },
});

const feat = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 10, padding: 18, borderWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  icon: { fontSize: 28, marginTop: 2 },
  title: { color: C.white, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  body:  { color: C.muted, fontSize: 13, lineHeight: 20 },
});

const hiw = StyleSheet.create({
  step:       { paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', flex: 1 },
  num:        { color: C.red, fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
  title:      { color: C.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  body:       { color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  connector:  { position: 'absolute', top: 30, left: 0, right: 0, height: 1, backgroundColor: C.border },
  connectorV: { height: 1, backgroundColor: C.border, alignSelf: 'stretch', marginVertical: 8 },
});

const tool = StyleSheet.create({
  card:    { backgroundColor: C.card, borderRadius: 12, padding: 22, borderWidth: 1, borderColor: C.border, alignItems: 'flex-start' },
  icon:    { fontSize: 30, marginBottom: 12 },
  title:   { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  body:    { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 16 },
  cta:     { backgroundColor: 'rgba(233,69,96,0.12)', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(233,69,96,0.3)' },
  ctaText: { color: C.red, fontSize: 13, fontWeight: 'bold' },
  allLink: { alignSelf: 'center', marginTop: 24 },
  allLinkText: { color: C.blue, fontSize: 15, fontWeight: 'bold' },
});

const tb = StyleSheet.create({
  half:      { paddingVertical: 8 },
  tag:       { color: C.red, fontSize: 10, fontWeight: 'bold', letterSpacing: 3, marginBottom: 10 },
  title:     { color: C.white, fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  body:      { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  btn:       { backgroundColor: C.red, borderRadius: 8, paddingVertical: 13, paddingHorizontal: 24, alignSelf: 'flex-start' },
  btnText:   { color: C.white, fontWeight: 'bold', fontSize: 15 },
  dividerH:  { height: 1, backgroundColor: C.border, marginVertical: 8 },
  dividerV:  { width: 1, backgroundColor: C.border, marginHorizontal: 4 },
});

const gear = StyleSheet.create({
  banner:    { backgroundColor: C.card, borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#2a1a3a' },
  supertitle: { color: '#aa77dd', fontSize: 10, fontWeight: 'bold', letterSpacing: 3, marginBottom: 10 },
  heading:   { color: C.white, fontSize: 26, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  body:      { color: C.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  btn:       { backgroundColor: '#6b3fa0', borderRadius: 8, paddingVertical: 13, paddingHorizontal: 24, alignSelf: 'center', marginTop: 0 },
  btnText:   { color: C.white, fontWeight: 'bold', fontSize: 15 },
});

const trust = StyleSheet.create({
  outer: { paddingVertical: 48, paddingHorizontal: 20 },
  inner: { maxWidth: MAX, alignSelf: 'center', width: '100%', alignItems: 'center' },
  text:  { color: C.silver, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  sub:   { color: C.faint, fontSize: 14, textAlign: 'center', marginBottom: 24 },
  chips: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  chip:  { backgroundColor: '#161616', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  chipText: { color: C.muted, fontSize: 13 },
});

const cta = StyleSheet.create({
  outer:  { backgroundColor: C.red, paddingVertical: 72, paddingHorizontal: 20 },
  inner:  { maxWidth: 700, alignSelf: 'center', width: '100%', alignItems: 'center' },
  heading: { color: C.white, fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub:     { color: 'rgba(255,255,255,0.75)', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  btnRow:  { gap: 12, alignItems: 'center' },
  btnPrimary:      { backgroundColor: C.white, borderRadius: 8, paddingVertical: 16, paddingHorizontal: 40 },
  btnPrimaryText:  { color: C.red, fontWeight: 'bold', fontSize: 17 },
  btnSecondary:    { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 36, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  btnSecondaryText: { color: C.white, fontWeight: 'bold', fontSize: 16 },
});

const foot = StyleSheet.create({
  outer:   { backgroundColor: '#060606', paddingVertical: 48, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  inner:   { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  brand:   { color: C.white, fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  tagline: { color: C.faint, fontSize: 13, marginBottom: 0 },
  colHead: { color: C.white, fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  link:    { color: C.faint, fontSize: 13, marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#1a1a1a', marginBottom: 20 },
  copy:    { color: '#333333', fontSize: 12, textAlign: 'center' },
});

