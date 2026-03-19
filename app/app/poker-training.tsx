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
  green:  '#4caf50',
  gold:   '#f5a623',
  white:  '#ffffff',
  silver: '#cccccc',
  muted:  '#888888',
  faint:  '#444444',
};
const MAX = 1160;

// ─── NavBar ───────────────────────────────────────────────────────────────────
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
            {([
              ['Home', '/'],
              ['Tools', '/poker-tools'],
              ['Training', '/poker-training'],
              ['Gear', '/poker-chips'],
              ['Pricing', '/pricing'],
            ] as [string, string][]).map(([label, href]) => (
              <TouchableOpacity key={label} onPress={() => router.push(href as any)} style={nav.link}>
                <Text style={[nav.linkText, label === 'Training' ? nav.linkActive : null]}>{label}</Text>
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

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
function Hero({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const trainingHref: any = user ? '/(protected)/tools/training' : '/(auth)/login';
  return (
    <View style={hero.outer}>
      <View style={[hero.content, wide ? hero.contentWide : null]}>
        <View style={hero.badge}>
          <Text style={hero.badgeText}>🧠 POKER TRAINING</Text>
        </View>
        <Text style={[hero.h1, wide ? hero.h1Wide : null]}>
          Learn Poker Faster.{'\n'}
          <Text style={{ color: C.green }}>Play Smarter.</Text>
        </Text>
        <Text style={[hero.sub, wide ? hero.subWide : null]}>
          Train with real scenarios, learn proven strategies, and build your edge — without risking money.
        </Text>
        <View style={[hero.ctaRow, wide ? { flexDirection: 'row' } : null]}>
          <TouchableOpacity style={hero.ctaPrimary} onPress={() => router.push(trainingHref)}>
            <Text style={hero.ctaPrimaryText}>Start Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={hero.ctaSecondary} onPress={() => router.push('/poker-tools')}>
            <Text style={hero.ctaSecondaryText}>Open Training Tools</Text>
          </TouchableOpacity>
        </View>
        <Text style={hero.support}>Built for real players — from beginners to serious grinders.</Text>
      </View>
    </View>
  );
}

// ─── Section 2 — Training Paths ───────────────────────────────────────────────
const PATHS = [
  {
    level: 'BEGINNER',
    icon: '🃏',
    title: 'Start Here',
    body: 'Learn the fundamentals — hand strength, basic strategy, and how to avoid common mistakes.',
    bullets: ['Hand selection', 'Basic odds', 'Simple decision-making'],
    cta: 'Start Beginner Training',
    color: C.green,
  },
  {
    level: 'INTERMEDIATE',
    icon: '📊',
    title: 'Level Up Your Game',
    body: 'Understand position, ranges, and how to think ahead of your opponents.',
    bullets: ['Preflop ranges', 'Position strategy', 'Pot control'],
    cta: 'Train Intermediate',
    color: C.blue,
  },
  {
    level: 'ADVANCED',
    icon: '🎯',
    title: 'Play Like a Pro',
    body: 'Sharpen your edge with deeper strategy, mental discipline, and advanced concepts.',
    bullets: ['GTO concepts', 'Exploitative play', 'Mental game'],
    cta: 'Advanced Training',
    color: C.gold,
  },
];

function TrainingPaths({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const href: any = user ? '/(protected)/tools/training' : '/(auth)/login';
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Choose Your Path</Text>
        <View style={wide ? { flexDirection: 'row', gap: 16 } : { gap: 14 }}>
          {PATHS.map(p => (
            <View key={p.level} style={[path.card, wide ? { flex: 1 } : null]}>
              <View style={[path.levelBadge, { borderColor: p.color }]}>
                <Text style={[path.levelText, { color: p.color }]}>{p.icon}  {p.level}</Text>
              </View>
              <Text style={path.title}>{p.title}</Text>
              <Text style={path.body}>{p.body}</Text>
              <View style={path.bullets}>
                {p.bullets.map(b => (
                  <View key={b} style={path.bulletRow}>
                    <Text style={[path.bulletDot, { color: p.color }]}>▸</Text>
                    <Text style={path.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={[path.cta, { borderColor: p.color }]} onPress={() => router.push(href)}>
                <Text style={[path.ctaText, { color: p.color }]}>{p.cta}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Section 3 — App Training Mode ────────────────────────────────────────────
function AppTraining({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const href: any = user ? '/(protected)/tools/training' : '/(auth)/login';
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <View style={wide ? { flexDirection: 'row', alignItems: 'center', gap: 40 } : null}>
          <View style={wide ? { flex: 1 } : { marginBottom: 20 }}>
            <Text style={[sec.heading, wide ? { textAlign: 'left' } : null]}>Train with Real Scenarios</Text>
            <Text style={app2.body}>
              Use interactive training inside the DCR Poker app to practice decisions and build instincts quickly.
            </Text>
            <View style={app2.bullets}>
              {['Preflop decision training', 'Odds and equity practice', 'Fast, repeatable scenarios'].map(b => (
                <View key={b} style={app2.bulletRow}>
                  <Text style={app2.check}>✓</Text>
                  <Text style={app2.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={app2.cta} onPress={() => router.push(href)}>
              <Text style={app2.ctaText}>Start Training in the App</Text>
            </TouchableOpacity>
          </View>
          <View style={wide ? { flex: 1 } : null}>
            <View style={app2.mockCard}>
              <Text style={app2.mockTitle}>🎮 Training Mode</Text>
              <Text style={app2.mockSub}>Interactive decision practice</Text>
              <View style={app2.mockStat}>
                <View style={app2.statItem}>
                  <Text style={app2.statVal}>3</Text>
                  <Text style={app2.statLabel}>Modes</Text>
                </View>
                <View style={app2.statItem}>
                  <Text style={app2.statVal}>∞</Text>
                  <Text style={app2.statLabel}>Scenarios</Text>
                </View>
                <View style={app2.statItem}>
                  <Text style={app2.statVal}>Free</Text>
                  <Text style={app2.statLabel}>to Start</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Section 4 — Core Skills ─────────────────────────────────────────────────
const SKILLS = [
  { icon: '🃏', title: 'Preflop Strategy', body: 'Know what hands to play and when.' },
  { icon: '📐', title: 'Odds & Equity', body: 'Understand your chances and make better calls.' },
  { icon: '📍', title: 'Position Play', body: 'Use position to control the hand.' },
  { icon: '🧠', title: 'Mental Game', body: 'Avoid tilt and stay disciplined.' },
];

function CoreSkills({ wide }: { wide: boolean }) {
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>What You'll Learn</Text>
        <View style={wide ? { flexDirection: 'row', flexWrap: 'wrap', gap: 14 } : { gap: 12 }}>
          {SKILLS.map(sk => (
            <View key={sk.title} style={[skill.card, wide ? { width: '47%' } : null]}>
              <Text style={skill.icon}>{sk.icon}</Text>
              <Text style={skill.title}>{sk.title}</Text>
              <Text style={skill.body}>{sk.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Section 5 — Audiobooks ───────────────────────────────────────────────────
const BOOKS = [
  {
    icon: '📘',
    title: 'The Mental Game of Poker',
    author: 'Jared Tendler',
    desc: 'Stop tilting. Fix leaks. Build a process that holds under pressure.',
  },
  {
    icon: '♠️',
    title: 'Thinking in Bets',
    author: 'Annie Duke',
    desc: 'A framework for making better decisions when the outcome is uncertain.',
  },
  {
    icon: '🎯',
    title: 'Every Hand Revealed',
    author: 'Gus Hansen',
    desc: 'Walk through every hand of a World Poker Tour win, decision by decision.',
  },
  {
    icon: '📗',
    title: 'The Theory of Poker',
    author: 'David Sklansky',
    desc: 'The foundational principles every serious poker player must understand.',
  },
];

function Audiobooks({ wide }: { wide: boolean }) {
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Learn from the Best</Text>
        <Text style={bk.intro}>
          We've curated the most effective poker books and audiobooks used by serious players.
        </Text>
        <View style={wide ? { flexDirection: 'row', flexWrap: 'wrap', gap: 14 } : { gap: 12 }}>
          {BOOKS.map(b => (
            <View key={b.title} style={[bk.card, wide ? { width: '47%' } : null]}>
              <Text style={bk.icon}>{b.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={bk.title}>{b.title}</Text>
                <Text style={bk.author}>{b.author}</Text>
                <Text style={bk.desc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={bk.allBtn}>
          <Text style={bk.allBtnText}>Browse All Poker Audiobooks →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Section 6 — Build Your Plan ─────────────────────────────────────────────
const PLAN_OPTIONS = [
  { label: "I'm new to poker",         emoji: '👋', desc: 'Start with beginner fundamentals' },
  { label: 'I know the basics',        emoji: '📘', desc: 'Level up with strategy and ranges' },
  { label: 'I want to get serious',    emoji: '🎯', desc: 'Deep strategy and mental game' },
];

function BuildPlan({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const href: any = user ? '/(protected)/tools/training' : '/(auth)/login';
  return (
    <View style={[sec.outer, { backgroundColor: C.bgAlt }]}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Build Your Training Plan</Text>
        <Text style={plan.sub}>Answer a few quick questions and start improving immediately.</Text>
        <View style={wide ? { flexDirection: 'row', gap: 14 } : { gap: 12 }}>
          {PLAN_OPTIONS.map(o => (
            <TouchableOpacity key={o.label} style={[plan.card, wide ? { flex: 1 } : null]} onPress={() => router.push(href)}>
              <Text style={plan.emoji}>{o.emoji}</Text>
              <Text style={plan.label}>{o.label}</Text>
              <Text style={plan.desc}>{o.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Section 7 — Internal Links ───────────────────────────────────────────────
const INTERNAL = [
  { icon: '🔧', title: 'Tools', body: 'Use calculators and charts', href: '/poker-tools' },
  { icon: '🛒', title: 'Gear', body: 'Upgrade your setup', href: '/poker-chips' },
  { icon: '💳', title: 'Pricing', body: 'Unlock full training features', href: '/pricing' },
];

function InternalLinks({ wide }: { wide: boolean }) {
  const router = useRouter();
  return (
    <View style={sec.outer}>
      <View style={sec.inner}>
        <Text style={sec.heading}>Keep Improving</Text>
        <View style={wide ? { flexDirection: 'row', gap: 14 } : { gap: 12 }}>
          {INTERNAL.map(l => (
            <TouchableOpacity key={l.title} style={[ilink.card, wide ? { flex: 1 } : null]} onPress={() => router.push(l.href as any)}>
              <Text style={ilink.icon}>{l.icon}</Text>
              <Text style={ilink.title}>{l.title}</Text>
              <Text style={ilink.body}>{l.body}</Text>
              <Text style={ilink.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Section 8 — Final CTA ────────────────────────────────────────────────────
function FinalCTA({ wide }: { wide: boolean }) {
  const router = useRouter();
  const { user } = useAuth();
  const href: any = user ? '/(protected)/tools/training' : '/(auth)/login';
  return (
    <View style={cta.outer}>
      <View style={cta.inner}>
        <Text style={[cta.heading, wide ? { fontSize: 36 } : null]}>Start Training Today</Text>
        <Text style={cta.sub}>It takes less than a minute to begin improving your game.</Text>
        <View style={[cta.btns, wide ? { flexDirection: 'row', justifyContent: 'center' } : null]}>
          <TouchableOpacity style={cta.btnPrimary} onPress={() => router.push(href)}>
            <Text style={cta.btnPrimaryText}>Start Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cta.btnSecondary} onPress={() => router.push(href)}>
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
    { heading: 'Training', links: [['Start Training', '/poker-training'], ['Tools', '/poker-tools'], ['Pricing', '/pricing']] },
    { heading: 'Resources', links: [['Poker Tools', '/poker-tools'], ['Gear', '/poker-chips'], ['Sign In', '/(auth)/login']] },
    { heading: 'App', links: [['My Games', '/(protected)/games'], ['Bankroll', '/(protected)/bankroll'], ['Account', '/(protected)/account/billing']] },
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
export default function PokerTrainingPage() {
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavBar wide={wide} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 60 }}>
        <Hero wide={wide} />
        <TrainingPaths wide={wide} />
        <AppTraining wide={wide} />
        <CoreSkills wide={wide} />
        <Audiobooks wide={wide} />
        <BuildPlan wide={wide} />
        <InternalLinks wide={wide} />
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
  outer:           { backgroundColor: '#07100a', paddingTop: 80, paddingBottom: 72, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  content:         { maxWidth: MAX, alignSelf: 'center', width: '100%', alignItems: 'center' },
  contentWide:     { alignItems: 'flex-start' },
  badge:           { backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(76,175,80,0.3)' },
  badgeText:       { color: C.green, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  h1:              { color: C.white, fontSize: 32, fontWeight: 'bold', textAlign: 'center', lineHeight: 42, marginBottom: 16 },
  h1Wide:          { fontSize: 48, lineHeight: 60, textAlign: 'left' },
  sub:             { color: C.silver, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 32, maxWidth: 540 },
  subWide:         { fontSize: 18, textAlign: 'left' },
  ctaRow:          { gap: 12, alignItems: 'center', marginBottom: 18 },
  ctaPrimary:      { backgroundColor: C.green, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 34 },
  ctaPrimaryText:  { color: C.white, fontWeight: 'bold', fontSize: 16 },
  ctaSecondary:    { backgroundColor: 'transparent', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, borderWidth: 1, borderColor: C.faint },
  ctaSecondaryText: { color: C.silver, fontWeight: 'bold', fontSize: 15 },
  support:         { color: C.faint, fontSize: 13, textAlign: 'center' },
});

const sec = StyleSheet.create({
  outer:   { paddingVertical: 56, paddingHorizontal: 20 },
  inner:   { maxWidth: MAX, alignSelf: 'center', width: '100%' },
  heading: { color: C.white, fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});

const path = StyleSheet.create({
  card:       { backgroundColor: C.card, borderRadius: 14, padding: 22, borderWidth: 1, borderColor: C.border },
  levelBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', borderWidth: 1, marginBottom: 12, backgroundColor: 'transparent' },
  levelText:  { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  title:      { color: C.white, fontSize: 19, fontWeight: 'bold', marginBottom: 8 },
  body:       { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 14 },
  bullets:    { gap: 6, marginBottom: 18 },
  bulletRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bulletDot:  { fontSize: 12, width: 14 },
  bulletText: { color: C.silver, fontSize: 14 },
  cta:        { borderRadius: 8, paddingVertical: 11, alignItems: 'center', borderWidth: 1, backgroundColor: 'transparent' },
  ctaText:    { fontWeight: 'bold', fontSize: 14 },
});

const app2 = StyleSheet.create({
  body:       { color: C.silver, fontSize: 15, lineHeight: 24, marginBottom: 18 },
  bullets:    { gap: 10, marginBottom: 22 },
  bulletRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check:      { color: C.green, fontWeight: 'bold', fontSize: 15 },
  bulletText: { color: C.silver, fontSize: 15 },
  cta:        { backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, alignSelf: 'flex-start' },
  ctaText:    { color: C.white, fontWeight: 'bold', fontSize: 15 },
  mockCard:   { backgroundColor: C.card, borderRadius: 14, padding: 24, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  mockTitle:  { color: C.white, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  mockSub:    { color: C.muted, fontSize: 13, marginBottom: 20 },
  mockStat:   { flexDirection: 'row', gap: 20 },
  statItem:   { alignItems: 'center' },
  statVal:    { color: C.green, fontSize: 26, fontWeight: 'bold' },
  statLabel:  { color: C.faint, fontSize: 12, marginTop: 2 },
});

const skill = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 18, borderWidth: 1, borderColor: C.border },
  icon:  { fontSize: 26, marginBottom: 8 },
  title: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  body:  { color: C.muted, fontSize: 14, lineHeight: 20 },
});

const bk = StyleSheet.create({
  intro:   { color: C.muted, fontSize: 15, lineHeight: 24, marginBottom: 22, textAlign: 'center' },
  card:    { backgroundColor: C.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  icon:    { fontSize: 28, paddingTop: 2 },
  title:   { color: C.white, fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  author:  { color: C.muted, fontSize: 12, marginBottom: 6 },
  desc:    { color: C.silver, fontSize: 13, lineHeight: 20 },
  allBtn:  { marginTop: 22, alignSelf: 'center', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 28, borderWidth: 1, borderColor: C.faint },
  allBtnText: { color: C.silver, fontWeight: 'bold', fontSize: 14 },
});

const plan = StyleSheet.create({
  sub:   { color: C.muted, fontSize: 15, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  emoji: { fontSize: 28, marginBottom: 10 },
  label: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  desc:  { color: C.muted, fontSize: 13, textAlign: 'center' },
});

const ilink = StyleSheet.create({
  card:  { backgroundColor: C.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: C.border },
  icon:  { fontSize: 24, marginBottom: 8 },
  title: { color: C.white, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  body:  { color: C.muted, fontSize: 13, marginBottom: 10 },
  arrow: { color: C.red, fontSize: 16, fontWeight: 'bold' },
});

const cta = StyleSheet.create({
  outer:           { backgroundColor: C.green, paddingVertical: 68, paddingHorizontal: 20 },
  inner:           { maxWidth: 740, alignSelf: 'center', width: '100%', alignItems: 'center' },
  heading:         { color: C.white, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub:             { color: 'rgba(255,255,255,0.75)', fontSize: 15, textAlign: 'center', marginBottom: 28 },
  btns:            { gap: 12, alignItems: 'center' },
  btnPrimary:      { backgroundColor: C.white, borderRadius: 8, paddingVertical: 15, paddingHorizontal: 36 },
  btnPrimaryText:  { color: C.green, fontWeight: 'bold', fontSize: 16 },
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
