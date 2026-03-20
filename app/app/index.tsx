import { useWindowDimensions, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { T } from '../src/components/ui/Theme';

// ─── NavBar ───────────────────────────────────────────────────────────────────
const NAV_LINKS: [string, string, string][] = [
  ['🎮', 'Arcade',   '/(protected)/arcade'],
  ['🔧', 'Tools',    '/(protected)/tools'],
  ['📊', 'Training', '/(protected)/tools/training'],
  ['🛒', 'Gear',     '/(protected)/gear'],
];

function NavBar({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <View style={[nav.outer, wide && nav.outerWide]}>
      {/* ── main row: logo + links (wide) + CTA ── */}
      <View style={nav.inner}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image source={require('../assets/logo.png')} style={nav.logo} resizeMode="contain" />
        </TouchableOpacity>
        {wide && (
          <View style={nav.links}>
            {NAV_LINKS.map(([, label, href]) => (
              <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={nav.link}>
                <Text style={nav.linkText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {user ? (
          <TouchableOpacity style={nav.signIn} onPress={() => router.push('/(protected)')}>
            <Text style={nav.signInText}>My Account</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={nav.signIn} onPress={() => router.push('/(auth)/login')}>
            <Text style={nav.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── mobile guest quicklinks row ── */}
      {!wide && (
        <View style={nav.mobileRow}>
          {NAV_LINKS.map(([icon, label, href]) => (
            <TouchableOpacity
              key={label}
              style={nav.mobilePill}
              onPress={() => router.push(href as any)}
              activeOpacity={0.75}
            >
              <Text style={nav.mobilePillIcon}>{icon}</Text>
              <Text style={nav.mobilePillText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={hero.outer}>
      <View style={hero.glowTop} pointerEvents="none" />
      <View style={hero.glowBottom} pointerEvents="none" />
      <View style={[hero.content, wide && hero.contentWide]}>
        <Image
          source={require('../assets/logo.png')}
          style={[hero.logo, wide && hero.logoWide]}
          resizeMode="contain"
        />
        <View style={hero.badge}>
          <Text style={hero.badgeText}>🃏  HOME GAME MANAGEMENT</Text>
        </View>
        <Text style={[hero.h1, wide && hero.h1Wide]}>
          Run Your Home Poker Game{'\n'}
          <Text style={{ color: T.gold }}>Like a Pro</Text>
        </Text>
        <Text style={[hero.sub, wide && hero.subWide]}>
          Manage players, track bankroll, and sharpen your edge —{'\n'}all in one app built for real games.
        </Text>
        <View style={[hero.ctaRow, wide && { flexDirection: 'row' }]}>
          <TouchableOpacity style={hero.ctaPrimary} onPress={() => router.push('/(auth)/register')}>
            <Text style={hero.ctaPrimaryText}>Start Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={hero.ctaSecondary} onPress={() => router.push('/(protected)/tools')}>
            <Text style={hero.ctaSecondaryText}>Explore Tools →</Text>
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
    <View style={[sec.outer, { backgroundColor: T.bgAlt }]}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 20 } : { gap: 16 }}>
          {VALUE_CARDS.map(c => (
            <View key={c.title} style={[vc.card, wide && { flex: 1 }]}>
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
            <View key={f.title} style={[feat.card, wide && { width: '47%' }]}>
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
    <View style={[sec.outer, { backgroundColor: T.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>How It Works</Text>
        <View style={wide ? { flexDirection: 'row', gap: 0 } : { gap: 0 }}>
          {STEPS.map((step, i) => (
            <View key={step.num} style={[hiw.step, wide && { flex: 1 }]}>
              {i > 0 && wide ? <View style={hiw.connector} /> : null}
              <View style={hiw.numBadge}>
                <Text style={hiw.num}>{step.num}</Text>
              </View>
              <Text style={hiw.title}>{step.title}</Text>
              <Text style={hiw.body}>{step.body}</Text>
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
            <View key={t.title} style={[tool.card, wide && { flex: 1 }]}>
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
          <Text style={tool.allLinkText}>View All Free Tools →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Training + Books ─────────────────────────────────────────────────────────
function TrainingBooks({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: T.bgAlt }]}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', gap: 24 } : { gap: 20 }}>
          <View style={[tb.half, wide && { flex: 1 }]}>
            <Text style={tb.tag}>TRAINING</Text>
            <Text style={tb.title}>Improve Your Game Faster</Text>
            <Text style={tb.body}>Train with real scenarios and build better instincts without risking money.</Text>
            <TouchableOpacity style={tb.btn} onPress={() => router.push('/(protected)/tools/training')}>
              <Text style={tb.btnText}>Start Training</Text>
            </TouchableOpacity>
          </View>
          <View style={wide ? tb.dividerV : tb.dividerH} />
          <View style={[tb.half, wide && { flex: 1 }]}>
            <Text style={tb.tag}>RESOURCES</Text>
            <Text style={tb.title}>Learn from the Best</Text>
            <Text style={tb.body}>Explore our recommended poker books and audiobooks used by serious players.</Text>
            <TouchableOpacity style={[tb.btn, tb.btnGhost]} onPress={() => router.push('/(protected)/tools')}>
              <Text style={[tb.btnText, { color: T.gold }]}>Browse Books</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Arcade Preview ───────────────────────────────────────────────────────────
const ARCADE_GAMES = [
  { icon: '🧮', title: 'Outs Counter', body: 'Quiz yourself on counting outs fast.' },
  { icon: '♠️', title: 'Nuts Finder', body: 'Identify the best possible hand on any board.' },
  { icon: '🃏', title: 'Blackjack', body: 'Practice basic strategy decisions.' },
  { icon: '⚡', title: 'Reaction Timer', body: 'Sharpen response with focused training.' },
];

function ArcadePreview({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={[sec.outer, { backgroundColor: T.bgDeep }]}>
      <View style={sec.inner}>
        <View style={arc.header}>
          <View style={arc.pill}><Text style={arc.pillText}>FREE TO PLAY</Text></View>
          <Text style={sec.heading}>Poker Arcade</Text>
          <Text style={sec.subheading}>8 mini-games to sharpen your instincts — no account needed.</Text>
        </View>
        <View style={wide ? { flexDirection: 'row', gap: 12 } : { gap: 10 }}>
          {ARCADE_GAMES.map(g => (
            <TouchableOpacity
              key={g.title}
              style={[arc.card, wide && { flex: 1 }]}
              onPress={() => router.push('/(protected)/arcade')}
              activeOpacity={0.75}
            >
              <Text style={arc.gicon}>{g.icon}</Text>
              <Text style={arc.gtitle}>{g.title}</Text>
              <Text style={arc.gbody}>{g.body}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={arc.cta} onPress={() => router.push('/(protected)/arcade')}>
          <Text style={arc.ctaText}>Play the Arcade →</Text>
        </TouchableOpacity>
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
        <View style={[gear.banner, wide && { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={wide && { flex: 1 }}>
            <Text style={gear.supertitle}>GEAR</Text>
            <Text style={[gear.heading, wide && { textAlign: 'left' }]}>Build the Perfect Game Setup</Text>
            <Text style={[gear.body, wide && { textAlign: 'left' }]}>From casual home games to serious tables — get the right chips and gear.</Text>
          </View>
          <TouchableOpacity style={[gear.btn, wide && { marginTop: 0, marginLeft: 32 }]} onPress={() => router.push('/(protected)/gear')}>
            <Text style={gear.btnText}>View Poker Chips & Gear →</Text>
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
      <View style={cta.glow} pointerEvents="none" />
      <View style={cta.inner}>
        <Text style={[cta.heading, wide && { fontSize: 40 }]}>Start Running Better Games Today</Text>
        <Text style={cta.sub}>It takes less than a minute to get started.</Text>
        <View style={[cta.btnRow, wide && { flexDirection: 'row', justifyContent: 'center' }]}>
          <TouchableOpacity style={cta.btnPrimary} onPress={() => router.push('/(auth)/register')}>
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
    { heading: 'Explore', links: [['Arcade', '/(protected)/arcade'], ['Gear', '/(protected)/gear'], ['Tools', '/(protected)/tools']] },
  ];
  return (
    <View style={foot.outer}>
      <View style={foot.inner}>
        <View style={[foot.top, wide && { flexDirection: 'row', gap: 40 }]}>
          <View style={[foot.brand, wide && { flex: 1.5 }]}>
            <Image source={require('../assets/logo.png')} style={foot.logo} resizeMode="contain" />
            <Text style={foot.brandSub}>Private games · Tools · Training · Bankroll</Text>
          </View>
          {wide && (
            <View style={{ flexDirection: 'row', gap: 40, flex: 3 }}>
              {cols.map(col => (
                <View key={col.heading} style={{ flex: 1 }}>
                  <Text style={foot.colHead}>{col.heading}</Text>
                  {col.links.map(([label, href]) => (
                    <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={{ marginBottom: 8 }}>
                      <Text style={foot.link}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={foot.divider} />
        <Text style={foot.copy}>© {new Date().getFullYear()} Deer Creek Road Poker · All rights reserved</Text>
      </View>
    </View>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} showsVerticalScrollIndicator={false}>
      <NavBar wide={wide} />
      <Hero wide={wide} />
      <ValueCards wide={wide} />
      <Features wide={wide} />
      <HowItWorks wide={wide} />
      <ToolsPreview wide={wide} />
      <ArcadePreview wide={wide} />
      <TrainingBooks wide={wide} />
      <Gear wide={wide} />
      <Trust />
      <FinalCTA wide={wide} />
      <Footer wide={wide} />
    </ScrollView>
  );
}

// ─── StyleSheets ──────────────────────────────────────────────────────────────

const nav = StyleSheet.create({
  outer:      { backgroundColor: 'rgba(11,11,12,0.94)', borderBottomWidth: 1, borderBottomColor: T.border, paddingTop: 12, paddingBottom: 8, paddingHorizontal: 20 },
  outerWide:  { paddingHorizontal: 40 },
  inner:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: T.MAX, alignSelf: 'center', width: '100%' },
  logo:       { height: 36, width: 110 },
  links:      { flexDirection: 'row', gap: 4 },
  link:       { paddingHorizontal: 14, paddingVertical: 8 },
  linkText:   { color: T.silver, fontSize: 14, fontWeight: '500' },
  signIn:     { backgroundColor: T.gold, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
  signInText: { color: '#0c0a09', fontWeight: '700', fontSize: 14 },
  // mobile guest quicklinks
  mobileRow:     { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 4 },
  mobilePill:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: T.border },
  mobilePillIcon:{ fontSize: 13 },
  mobilePillText:{ color: T.silver, fontSize: 13, fontWeight: '600' },
});

const hero = StyleSheet.create({
  outer:       { backgroundColor: T.bg, overflow: 'hidden', position: 'relative' },
  glowTop:     { position: 'absolute', top: 0, left: 0, right: 0, height: 360, backgroundColor: 'rgba(180,138,58,0.1)', borderBottomLeftRadius: 360, borderBottomRightRadius: 360 },
  glowBottom:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, backgroundColor: 'rgba(120,72,28,0.06)', borderTopLeftRadius: 180, borderTopRightRadius: 180 },
  content:     { alignItems: 'center', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 72 },
  contentWide: { paddingTop: 80, paddingBottom: 96, maxWidth: T.MAX, alignSelf: 'center', width: '100%' },
  logo:        { height: 80, width: 220, marginBottom: 32 },
  logoWide:    { height: 100, width: 280, marginBottom: 40 },
  badge:       { flexDirection: 'row', alignItems: 'center', backgroundColor: T.goldFaint, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 24 },
  badgeText:   { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  h1:          { color: T.white, fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 50, marginBottom: 16 },
  h1Wide:      { fontSize: 54, lineHeight: 68 },
  sub:         { color: T.muted, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 36, maxWidth: 520 },
  subWide:     { fontSize: 18, lineHeight: 28 },
  ctaRow:      { flexDirection: 'column', alignItems: 'center', gap: 12 },
  ctaPrimary:  { backgroundColor: T.gold, paddingHorizontal: 36, paddingVertical: 16, borderRadius: 24, minWidth: 180, alignItems: 'center' },
  ctaPrimaryText:   { color: '#0c0a09', fontWeight: 'bold', fontSize: 17 },
  ctaSecondary:     { borderWidth: 1, borderColor: T.borderAlt, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 24, minWidth: 180, alignItems: 'center' },
  ctaSecondaryText: { color: T.silver, fontWeight: '600', fontSize: 16 },
  noDownload:  { color: T.faint, fontSize: 12, marginTop: 20 },
});

const sec = StyleSheet.create({
  outer:      { paddingVertical: 64, paddingHorizontal: 24 },
  inner:      { maxWidth: T.MAX, alignSelf: 'center', width: '100%' },
  heading:    { color: T.white, fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subheading: { color: T.muted, fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
});

const vc = StyleSheet.create({
  card:  { borderRadius: 24, borderWidth: 1, borderColor: T.border, backgroundColor: T.cardGlass, padding: 24 },
  icon:  { fontSize: 28, marginBottom: 12 },
  title: { color: T.white, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  body:  { color: T.muted, fontSize: 14, lineHeight: 21 },
});

const feat = StyleSheet.create({
  card:  { flexDirection: 'row', gap: 14, borderRadius: 20, borderWidth: 1, borderColor: T.border, backgroundColor: T.cardGlass, padding: 20 },
  icon:  { fontSize: 24 },
  title: { color: T.white, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  body:  { color: T.muted, fontSize: 13, lineHeight: 19 },
});

const hiw = StyleSheet.create({
  step:       { position: 'relative', paddingHorizontal: 16, paddingVertical: 8 },
  numBadge:   { width: 48, height: 48, borderRadius: 24, backgroundColor: T.goldFaint, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  num:        { color: T.gold, fontSize: 18, fontWeight: 'bold' },
  title:      { color: T.white, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  body:       { color: T.muted, fontSize: 14, lineHeight: 20 },
  connector:  { position: 'absolute', left: 0, top: 32, right: '50%', height: 1, backgroundColor: T.border },
  connectorV: { height: 32, width: 1, backgroundColor: T.border, marginLeft: 24, marginVertical: 4 },
});

const tool = StyleSheet.create({
  card:        { borderRadius: 24, borderWidth: 1, borderColor: T.border, backgroundColor: T.cardGlass, padding: 24, gap: 10 },
  icon:        { fontSize: 28 },
  title:       { color: T.white, fontSize: 16, fontWeight: '700' },
  body:        { color: T.muted, fontSize: 14, lineHeight: 20, flex: 1 },
  cta:         { marginTop: 4 },
  ctaText:     { color: T.gold, fontSize: 14, fontWeight: '600' },
  allLink:     { marginTop: 28, alignItems: 'center' },
  allLinkText: { color: T.gold, fontSize: 15, fontWeight: '600' },
});

const tb = StyleSheet.create({
  half:     { gap: 12 },
  tag:      { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: 8 },
  title:    { color: T.white, fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  body:     { color: T.muted, fontSize: 14, lineHeight: 21 },
  btn:      { backgroundColor: T.gold, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 22, alignSelf: 'flex-start', marginTop: 16 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(251,191,36,0.35)' },
  btnText:  { color: '#0c0a09', fontWeight: '700', fontSize: 14 },
  dividerV: { width: 1, backgroundColor: T.border, marginHorizontal: 4 },
  dividerH: { height: 1, backgroundColor: T.border, marginVertical: 8 },
});

const arc = StyleSheet.create({
  header:   { alignItems: 'center', marginBottom: 28 },
  pill:     { backgroundColor: T.goldFaint, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
  pillText: { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  card:     { borderRadius: 20, borderWidth: 1, borderColor: T.border, backgroundColor: T.cardGlass, padding: 20, gap: 8 },
  gicon:    { fontSize: 26 },
  gtitle:   { color: T.white, fontSize: 14, fontWeight: '700' },
  gbody:    { color: T.muted, fontSize: 13, lineHeight: 18 },
  cta:      { marginTop: 24, alignSelf: 'center', borderWidth: 1, borderColor: T.borderAlt, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 28 },
  ctaText:  { color: T.silver, fontWeight: '600', fontSize: 14 },
});

const gear = StyleSheet.create({
  banner:     { borderRadius: 28, borderWidth: 1, borderColor: T.border, backgroundColor: T.cardGlass, padding: 32 },
  supertitle: { color: T.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: 10 },
  heading:    { color: T.white, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  body:       { color: T.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  btn:        { backgroundColor: T.gold, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, alignSelf: 'center', marginTop: 20 },
  btnText:    { color: '#0c0a09', fontWeight: '700', fontSize: 14 },
});

const trust = StyleSheet.create({
  outer:    { paddingVertical: 48, paddingHorizontal: 24, backgroundColor: T.bgAlt },
  inner:    { alignItems: 'center', maxWidth: T.MAX, alignSelf: 'center', width: '100%' },
  text:     { color: T.white, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  sub:      { color: T.muted, fontSize: 14, textAlign: 'center', marginBottom: 24 },
  chips:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  chip:     { borderRadius: 20, borderWidth: 1, borderColor: T.border, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { color: T.silver, fontSize: 13, fontWeight: '500' },
});

const cta = StyleSheet.create({
  outer:           { backgroundColor: T.bg, overflow: 'hidden', paddingVertical: 80, paddingHorizontal: 24, position: 'relative' },
  glow:            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(180,138,58,0.05)' },
  inner:           { alignItems: 'center', maxWidth: 700, alignSelf: 'center', width: '100%' },
  heading:         { color: T.white, fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 12, lineHeight: 42 },
  sub:             { color: T.muted, fontSize: 15, textAlign: 'center', marginBottom: 36 },
  btnRow:          { flexDirection: 'column', alignItems: 'center', gap: 12 },
  btnPrimary:      { backgroundColor: T.gold, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 24, minWidth: 200, alignItems: 'center' },
  btnPrimaryText:  { color: '#0c0a09', fontWeight: 'bold', fontSize: 17 },
  btnSecondary:    { borderWidth: 1, borderColor: T.borderAlt, paddingHorizontal: 34, paddingVertical: 15, borderRadius: 24, minWidth: 200, alignItems: 'center' },
  btnSecondaryText:{ color: T.silver, fontWeight: '600', fontSize: 16 },
});

const foot = StyleSheet.create({
  outer:    { backgroundColor: T.bgDeep, paddingTop: 56, paddingBottom: 32, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: T.border },
  inner:    { maxWidth: T.MAX, alignSelf: 'center', width: '100%' },
  top:      { gap: 32, marginBottom: 40 },
  brand:    { gap: 10 },
  logo:     { height: 40, width: 130 },
  brandSub: { color: T.faint, fontSize: 13 },
  colHead:  { color: T.silver, fontSize: 13, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
  link:     { color: T.muted, fontSize: 13 },
  divider:  { height: 1, backgroundColor: T.border, marginBottom: 24 },
  copy:     { color: T.faint, fontSize: 12, textAlign: 'center' },
});


