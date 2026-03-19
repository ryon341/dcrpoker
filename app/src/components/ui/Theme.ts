// ─── DCR Poker — Design Tokens ────────────────────────────────────────────────

export const T = {
  // Background
  bg:      '#0a0a0a',
  bgAlt:   '#111111',
  bgDeep:  '#060606',

  // Surface
  card:    '#161616',
  cardAlt: '#1c1c1c',

  // Borders
  border:     '#222222',
  borderAlt:  '#2a2a2a',

  // Brand
  red:     '#e94560',
  redDark: '#c23050',

  // Accents
  gold:    '#f5a623',
  blue:    '#4a9eff',
  green:   '#4caf50',
  purple:  '#9b59b6',

  // Text
  white:   '#ffffff',
  silver:  '#cccccc',
  muted:   '#888888',
  faint:   '#444444',

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
