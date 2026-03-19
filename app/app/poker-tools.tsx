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
  blue:   '#4a9eff',
  white:  '#ffffff',
  silver: '#cccccc',
  muted:  '#888888',
  faint:  '#444444',
};
const MAX = 1160;

// ─── Nav (shared with homepage) ───────────────────────────────────────────────
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
            {([['Tools', '/poker-tools'], ['Training', '/poker-training'], ['Gear', '/poker-chips'], ['Pricing', '/pricing']] as [string, string][]).map(([label, href]) => (
              <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={nav.link}>
                <Text style={[nav.linkText, label === 'Tools' ? { color: C.white } : null]}>{label}</Text>
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
  const { user } = useAuth();
  const appHref = user ? '/(protected)/tools' : '/(auth)/login';
  return (
    <View style={hero.outer}>
      <View style={[hero.content, wide ? hero.contentWide : null]}>
        <View style={hero.badge}>
          <Text style={hero.badgeText}>🔧 FREE POKER TOOLS</Text>
        </View>
        <Text style={[hero.h1, wide ? hero.h1Wide : null]}>
          Free Poker Tools to{'\n'}
          <Text style={{ color: C.red }}>Run and Win Your Game</Text>
        </Text>
        <Text style={[hero.sub, wide ? hero.subWide : null]}>
          Calculate chips, learn preflop strategy, and make better decisions — instantly.
        </Text>
        <View style={[hero.ctaRow, wide ? { flexDirection: 'row' } : null]}>
          <TouchableOpacity style={hero.ctaPrimary} onPress={() => router.push('/(protected)/tools')}>
            <Text style={hero.ctaPrimaryText}>Use Free Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity style={hero.ctaSecondary} onPress={() => router.push(appHref as any)}>
            <Text style={hero.ctaSecondaryText}>Open App</Text>
          </TouchableOpacity>
        </View>
        <Text style={hero.noSetup}>No downloads. No spreadsheets. No guesswork.</Text>
      </View>
    </View>
  );
}

// ─── Tool Overview Cards ───────────────────────────────────────────────────────
const TOOL_CARDS = [
  {
    icon: '🪙',
    title: 'Poker Chip Calculator',
    body: 'Know exactly how many chips you need for cash games or tournaments — including rebuys and stack sizes.',
    cta: 'Use Calculator',
    href: '/(protected)/tools/chip-calculator',
  },
  {
    icon: '🃏',
    title: 'Preflop Strategy Charts',
    body: 'See exactly what hands to play from every position with simple, visual charts.',
    cta: 'View Charts',
    href: '/(protected)/tools/preflop-charts',
  },
  {
    icon: '🎲',
    title: 'Poker Odds Calculator',
    body: 'Quickly calculate your chances of hitting draws and make better decisions at the table.',
    cta: 'Calculate Odds',
    href: '/(protected)/tools/odds-calculator',
  },
];

function ToolCards({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 16 }}>
          {TOOL_CARDS.map(t => (
            <View key={t.title} style={[tc.card, wide ? { flex: 1 } : null]}>
              <Text style={tc.icon}>{t.icon}</Text>
              <Text style={tc.title}>{t.title}</Text>
              <Text style={tc.body}>{t.body}</Text>
              <TouchableOpacity style={tc.btn} onPress={() => router.push(t.href as any)}>
                <Text style={tc.btnText}>{t.cta} →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Why These Tools Matter ───────────────────────────────────────────────────
const WHY = [
  { icon: '🧠', title: 'Better Decisions', body: 'Know when to call, fold, or push — based on real math.' },
  { icon: '⚡', title: 'Smoother Games', body: 'Run games without confusion or delays.' },
  { icon: '🎯', title: 'Real Edge', body: 'Gain an advantage over players who are guessing.' },
];

function WhyMatters({ wide }: { wide: boolean }) {
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Stop Guessing. Start Playing Better.</Text>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 14 }}>
          {WHY.map(w => (
            <View key={w.title} style={[why.card, wide ? { flex: 1 } : null]}>
              <Text style={why.icon}>{w.icon}</Text>
              <Text style={why.title}>{w.title}</Text>
              <Text style={why.body}>{w.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Deep Tool Sections ───────────────────────────────────────────────────────
const DEEP = [
  {
    icon: '🪙',
    tag: 'CHIP CALCULATOR',
    title: 'Plan Your Game Like a Pro',
    body: 'Whether you\'re running a cash game or tournament, get the exact number of chips you need — including reserves for rebuys.',
    bullets: ['Cash + tournament modes', 'Rebuy estimation', 'Chip breakdown by denomination'],
    cta: 'Open Chip Calculator',
    href: '/(protected)/tools/chip-calculator',
    accent: '#4a9eff',
  },
  {
    icon: '🃏',
    tag: 'PREFLOP CHARTS',
    title: 'Know What to Play — Every Time',
    body: 'Stop second-guessing your decisions. Use proven ranges for every position and stack depth.',
    bullets: ['Position-based charts', 'Easy-to-read hand matrix', 'Fast decision reference'],
    cta: 'View Preflop Charts',
    href: '/(protected)/tools/preflop-charts',
    accent: '#e94560',
  },
  {
    icon: '🎲',
    tag: 'ODDS CALCULATOR',
    title: 'Know Your Chances Instantly',
    body: 'Turn outs into real probabilities so you can make smarter calls and folds.',
    bullets: ['Quick draw selection', 'Accurate percentages', 'Simple, fast interface'],
    cta: 'Calculate Odds',
    href: '/(protected)/tools/odds-calculator',
    accent: '#44cc88',
  },
];

function DeepSections({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={{ backgroundColor: C.bgAlt }}>
      {DEEP.map((d, i) => (
        <View key={d.tag} style={[sec.outer, i % 2 === 1 ? { backgroundColor: C.bg } : { backgroundColor: C.bgAlt }]}>
          <View style={sec.inner}>
            <View style={wide ? { flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: 48, alignItems: 'center' } : null}>
              {/* Icon panel */}
              <View style={[deep.iconPanel, wide ? { width: 200 } : null, { borderColor: d.accent + '33' }]}>
                <Text style={deep.bigIcon}>{d.icon}</Text>
                <View style={[deep.dot, { backgroundColor: d.accent }]} />
              </View>
              {/* Text */}
              <View style={wide ? { flex: 1 } : { marginTop: 20 }}>
                <Text style={[deep.tag, { color: d.accent }]}>{d.tag}</Text>
                <Text style={deep.title}>{d.title}</Text>
                <Text style={deep.body}>{d.body}</Text>
                {d.bullets.map(b => (
                  <View key={b} style={deep.bulletRow}>
                    <Text style={[deep.bulletDot, { color: d.accent }]}>▸</Text>
                    <Text style={deep.bulletText}>{b}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[deep.btn, { backgroundColor: d.accent + '18', borderColor: d.accent + '55' }]} onPress={() => router.push(d.href as any)}>
                  <Text style={[deep.btnText, { color: d.accent }]}>{d.cta} →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── App Integration ──────────────────────────────────────────────────────────
function AppIntegration({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <View style={app.banner}>
          <Text style={app.tag}>THE APP</Text>
          <Text style={app.title}>All Tools Built Into the DCR Poker App</Text>
          <Text style={app.body}>No switching between apps. Everything you need is in one place — built for real home games.</Text>
          <View style={[app.btnRow, wide ? { flexDirection: 'row', justifyContent: 'center' } : null]}>
            <TouchableOpacity style={app.btnPrimary} onPress={() => router.push(user ? '/(protected)/tools' : '/(auth)/login' as any)}>
              <Text style={app.btnPrimaryText}>Open App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={app.btnSecondary} onPress={() => router.push('/(auth)/login')}>
              <Text style={app.btnSecondaryText}>Start Free</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Internal Links ───────────────────────────────────────────────────────────
const LINKS = [
  { icon: '🏋️', title: 'Training', body: 'Sharpen your skills with interactive drills', cta: '→ Poker Training', href: '/poker-training' },
  { icon: '🛒', title: 'Gear', body: 'Build the perfect game setup', cta: '→ Poker Chips & Gear', href: '/poker-chips' },
  { icon: '💳', title: 'Pricing', body: 'Upgrade your game management tools', cta: '→ View Pricing', href: '/pricing' },
];

function InternalLinks({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Keep Improving Your Game</Text>
        <View style={wide ? { flexDirection: 'row', gap: 16 } : { gap: 14 }}>
          {LINKS.map(l => (
            <TouchableOpacity key={l.title} style={[il.card, wide ? { flex: 1 } : null]} onPress={() => router.push(l.href as any)}>
              <Text style={il.icon}>{l.icon}</Text>
              <Text style={il.title}>{l.title}</Text>
              <Text style={il.body}>{l.body}</Text>
              <Text style={il.cta}>{l.cta}</Text>
            </TouchableOpacity>
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
        <Text style={[cta.heading, wide ? { fontSize: 36 } : null]}>
          Start Using Better Poker Tools Today
        </Text>
        <Text style={cta.sub}>It takes less than a minute to get started.</Text>
        <View style={[cta.btnRow, wide ? { flexDirection: 'row', justifyContent: 'center' } : null]}>
          <TouchableOpacity style={cta.btnPrimary} onPress={() => router.push('/(auth)/login')}>
            <Text style={cta.btnPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cta.btnSecondary} onPress={() => router.push('/(protected)/tools')}>
            <Text style={cta.btnSecondaryText}>Open App</Text>
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
    { heading: 'Tools', links: [['Chip Calculator', '/(protected)/tools/chip-calculator'], ['Preflop Charts', '/(protected)/tools/preflop-charts'], ['Odds Calculator', '/(protected)/tools/odds-calculator'], ['Training', '/(protected)/tools/training']] },
    { heading: 'App', links: [['Sign In', '/(auth)/login'], ['My Games', '/(protected)/games'], ['Bankroll', '/(protected)/bankroll']] },
    { heading: 'More', links: [['Poker Tools', '/poker-tools'], ['Gear', '/poker-chips'], ['Pricing', '/pricing']] },
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
        <Text style={foot.copy}>© {new Date().getFullYear()} DCR Poker — Free poker chip calculator, preflop charts, and odds calculator.</Text>
      </View>
    </View>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PokerToolsPage() {
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavBar wide={wide} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 60 }}>
        <Hero wide={wide} />
        <ToolCards wide={wide} />
        <WhyMatters wide={wide} />
        <DeepSections wide={wide} />
        <AppIntegration wide={wide} />
        <InternalLinks wide={wide} />
        <FinalCTA wide={wide} />
        <Footer wide={wide} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const nav = StyleSheet.create({
  outer:    { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(10,10,10,0.95)', borderBottomWidth: 1, borderBottomColor: C.border, height: 60 },
  inner:    { maxWidth: MAX, alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  logo:     { color: C.white, fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  links:    { flexDirection: 'row', gap: 4 },
  link:     { paddingHorizontal: 14, paddingVertical: 8 },
  linkText: { color: C.muted, fontSize: 14 },
  signIn:   { backgroundColor: C.red, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  signInText: { color: C.white, fontWeight: 'bold', fontSize: 14 },
});

const hero = StyleSheet.create({
  outer:        { backgroundColor: '#0d0816', paddingTop: 80, paddingBottom: 72, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  content:      { maxWidth: MAX, alignSelf: 'center', width: '100%', alignItems: 'center' },
  contentWide:  { alignItems: 'flex-start' },
  badge:        { backgroundColor: 'rgba(74,158,255,0.12)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(74,158,255,0.3)', marginBottom: 20 },
  badgeText:    { color: C.blue, fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  h1:           { color: C.white, fontSize: 32, fontWeight: 'bold', textAlign: 'center', lineHeight: 42, marginBottom: 16 },
  h1Wide:       { fontSize: 50, lineHeight: 62, textAlign: 'left' },
  sub:          { color: C.silver, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 32, maxWidth: 540 },
  subWide:      { fontSize: 18, textAlign: 'left' },
  ctaRow:       { gap: 12, alignItems: 'center', marginBottom: 18 },
  ctaPrimary:   { backgroundColor: C.red, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 34 },
  ctaPrimaryText:   { color: C.white, fontWeight: 'bold', fontSize: 16 },
  ctaSecondary:     { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, borderWidth: 1, borderColor: C.faint },
  ctaSecondaryText: { color: C.silver, fontWeight: 'bold', fontSize: 15 },
  noSetup: { color: C.faint, fontSize: 13 },
});

const sec = StyleSheet.create({
  outer:      { paddingVertical: 60, paddingHorizontal: 20 },
  inner:      { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  heading:    { color: C.white, fontSize: 26, fontWeight: 'bold', marginBottom: 28, textAlign: 'center' },
});

const tc = StyleSheet.create({
  card:    { backgroundColor: C.card, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: C.border },
  icon:    { fontSize: 32, marginBottom: 12 },
  title:   { color: C.white, fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  body:    { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 18, flex: 1 },
  btn:     { backgroundColor: 'rgba(233,69,96,0.12)', borderRadius: 6, paddingVertical: 9, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(233,69,96,0.35)', alignSelf: 'flex-start' },
  btnText: { color: C.red, fontSize: 14, fontWeight: 'bold' },
});

const why = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 10, padding: 20, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  icon:  { fontSize: 30, marginBottom: 10 },
  title: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  body:  { color: C.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});

const deep = StyleSheet.create({
  iconPanel: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  bigIcon:   { fontSize: 56 },
  dot:       { width: 8, height: 8, borderRadius: 4, marginTop: 18 },
  tag:       { fontSize: 10, fontWeight: 'bold', letterSpacing: 3, marginBottom: 10 },
  title:     { color: C.white, fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  body:      { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { fontSize: 14, lineHeight: 22 },
  bulletText: { color: C.silver, fontSize: 14, lineHeight: 22, flex: 1 },
  btn:       { borderRadius: 8, paddingVertical: 11, paddingHorizontal: 20, borderWidth: 1, alignSelf: 'flex-start', marginTop: 12 },
  btnText:   { fontWeight: 'bold', fontSize: 14 },
});

const app = StyleSheet.create({
  banner:       { backgroundColor: '#0d1a2e', borderRadius: 16, borderWidth: 1, borderColor: '#1a3060', padding: 32, alignItems: 'center' },
  tag:          { color: C.blue, fontSize: 10, fontWeight: 'bold', letterSpacing: 3, marginBottom: 10 },
  title:        { color: C.white, fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  body:         { color: C.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24, maxWidth: 520 },
  btnRow:       { gap: 12, alignItems: 'center' },
  btnPrimary:   { backgroundColor: C.blue, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32 },
  btnPrimaryText: { color: C.white, fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 13, paddingHorizontal: 28, borderWidth: 1, borderColor: '#1a3060' },
  btnSecondaryText: { color: C.blue, fontWeight: 'bold', fontSize: 15 },
});

const il = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 22, borderWidth: 1, borderColor: C.border },
  icon:  { fontSize: 28, marginBottom: 10 },
  title: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  body:  { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  cta:   { color: C.blue, fontSize: 13, fontWeight: 'bold' },
});

const cta = StyleSheet.create({
  outer:           { backgroundColor: C.red, paddingVertical: 68, paddingHorizontal: 20 },
  inner:           { maxWidth: 700, alignSelf: 'center', width: '100%', alignItems: 'center' },
  heading:         { color: C.white, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub:             { color: 'rgba(255,255,255,0.75)', fontSize: 15, textAlign: 'center', marginBottom: 28 },
  btnRow:          { gap: 12, alignItems: 'center' },
  btnPrimary:      { backgroundColor: C.white, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 36 },
  btnPrimaryText:  { color: C.red, fontWeight: 'bold', fontSize: 16 },
  btnSecondary:    { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
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
