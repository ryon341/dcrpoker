// ─── DCR Poker — Design Tokens (DeerCreekRoad Theme) ─────────────────────────

export const T = {
  // Background — near-black with warm undertone
  bg:      '#0b0b0c',
  bgAlt:   '#111113',
  bgDeep:  '#060607',

  // Surface
  card:    '#18181b',
  cardAlt: '#1e1e22',

  // Borders — warm dark
  border:     'rgba(255,255,255,0.09)',
  borderAlt:  'rgba(255,255,255,0.14)',

  // Primary accent — amber/gold (replaces red as main brand color)
  gold:      '#FBBF24',   // amber-400
  goldLight: '#FCD34D',   // amber-300
  goldFaint: 'rgba(251,191,36,0.15)',
  goldGlow:  'rgba(251,191,36,0.07)',

  // Legacy red — retained for danger/error states only
  red:     '#e94560',
  redDark: '#c23050',

  // Accents
  blue:    '#4a9eff',
  green:   '#4caf50',
  purple:  '#9b59b6',

  // Text — stone scale
  white:   '#FAFAF9',   // stone-50
  silver:  '#D6D3D1',   // stone-300
  muted:   '#78716C',   // stone-500
  faint:   '#57534E',   // stone-600

  // Input / overlay
  inputBg:  'rgba(0,0,0,0.28)',
  cardGlass: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.09)',

  // Status surfaces
  statusConfirmed:  '#1a5a2a',
  statusWaitlisted: '#5a3a00',
  statusDeclined:   '#5a1a1a',
  statusInvited:    '#0f3060',
  statusDraft:      '#5a4a00',
  statusPublished:  '#1a5a2a',

  // Max content width
  MAX: 1160,
} as const;

export const SPACE = {
  xs:  4,
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  xxl: 44,
} as const;

export function statusBg(status: string): string {
  switch (status) {
    case 'confirmed':  return T.statusConfirmed;
    case 'waitlisted': return T.statusWaitlisted;
    case 'declined':   return T.statusDeclined;
    case 'invited':    return T.statusInvited;
    case 'published':  return T.statusPublished;
    case 'draft':      return T.statusDraft;
    default:           return T.faint;
  }
}
