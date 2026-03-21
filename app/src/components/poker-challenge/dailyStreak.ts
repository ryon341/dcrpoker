export type DailyMeta = {
  currentDailyStreak:    number;
  bestDailyStreak:       number;
  lastCompletedDailyId:  string | null;
  totalDailiesCompleted: number;
  badgesUnlocked:        string[];
};

export function getInitialDailyMeta(): DailyMeta {
  return {
    currentDailyStreak:    0,
    bestDailyStreak:       0,
    lastCompletedDailyId:  null,
    totalDailiesCompleted: 0,
    badgesUnlocked:        [],
  };
}

export function isSameDay(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  return a === b;
}

/**
 * Returns true if `nextDay` is exactly the calendar day after `lastDay`.
 * Both are YYYY-MM-DD strings.
 */
export function isNextCalendarDay(lastDay: string | null, nextDay: string): boolean {
  if (!lastDay) return false;
  const last = new Date(lastDay + 'T00:00:00');
  const next = new Date(nextDay  + 'T00:00:00');
  const diffMs = next.getTime() - last.getTime();
  return diffMs === 24 * 60 * 60 * 1000;
}

// ── Badge ladder ───────────────────────────────────────────────────────────────
type Badge = { id: string; label: string };

const BADGE_LADDER: { streak: number; badge: Badge }[] = [
  { streak:  1, badge: { id: 'first_step',    label: 'First Step' } },
  { streak:  3, badge: { id: 'on_a_roll',     label: 'On a Roll'  } },
  { streak:  5, badge: { id: 'daily_grinder', label: 'Daily Grinder' } },
  { streak:  7, badge: { id: 'weekly_heater', label: 'Weekly Heater' } },
  { streak: 14, badge: { id: 'two_week_tank', label: 'Two-Week Tank' } },
  { streak: 30, badge: { id: 'iron_will',     label: 'Iron Will'  } },
];

export function getDailyBadgeForStreak(streak: number): Badge | null {
  const entry = BADGE_LADDER.find(b => b.streak === streak);
  return entry ? entry.badge : null;
}

// ── Application logic ──────────────────────────────────────────────────────────
/**
 * Returns updated meta after a daily run completion for `dailyId`.
 * The `newBadge` attached to the returned meta is the badge just unlocked, if any.
 */
export function applyDailyCompletion(
  meta: DailyMeta,
  dailyId: string,
): DailyMeta & { newBadge: Badge | null } {
  // Guard: same day already counted
  if (isSameDay(meta.lastCompletedDailyId, dailyId)) {
    return { ...meta, newBadge: null };
  }

  let newStreak: number;
  if (isNextCalendarDay(meta.lastCompletedDailyId, dailyId)) {
    newStreak = meta.currentDailyStreak + 1;
  } else {
    newStreak = 1;
  }

  const bestStreak  = Math.max(newStreak, meta.bestDailyStreak);
  const total       = meta.totalDailiesCompleted + 1;
  const candidate   = getDailyBadgeForStreak(newStreak);
  const newBadge    = candidate && !meta.badgesUnlocked.includes(candidate.id) ? candidate : null;
  const badges      = newBadge
    ? [...meta.badgesUnlocked, newBadge.id]
    : meta.badgesUnlocked;

  return {
    currentDailyStreak:    newStreak,
    bestDailyStreak:       bestStreak,
    lastCompletedDailyId:  dailyId,
    totalDailiesCompleted: total,
    badgesUnlocked:        badges,
    newBadge,
  };
}
