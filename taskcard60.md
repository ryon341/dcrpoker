TC060 — Daily Streak Days + Return Rewards + Completion Badge System
Goal

Add a meta-retention layer to Daily Challenge so users are rewarded for coming back on consecutive days.

This taskcard adds:

daily completion streak by calendar day
comeback/re-engagement reward feel
daily completion badges
simple streak-loss handling
daily HUD/status updates

This should strengthen the “come back tomorrow” loop without changing the core 5-hand daily run.

Scope

Implement:

daily streak tracking by day
last-completed-day logic
badge/reward messaging on completion
daily streak display on entry card + results modal
lightweight streak recovery/reset rules
persistent daily meta storage

Do not add leaderboards yet.
Do not change daily hand scoring.
Do not mix daily streak with main hand streak.

Core Rules
Daily streak definition

A daily streak increments when the user completes the Daily Challenge on consecutive calendar days.

Examples:

completed Mar 20 and Mar 21 → streak = 2
completed Mar 20 and next completion is Mar 22 → streak resets to 1
multiple opens on the same day do not increment more than once
Daily completion requirement

Only a completed 5-hand daily run counts.

Partial progress does not affect daily streak.

Files To Create
1. dailyStreak.ts

Utility for date-based daily streak logic.

Functions:

type DailyMeta = {
  currentDailyStreak: number;
  bestDailyStreak: number;
  lastCompletedDailyId: string | null; // YYYY-MM-DD
  totalDailiesCompleted: number;
  badgesUnlocked: string[];
};

getInitialDailyMeta(): DailyMeta

isSameDay(a: string | null, b: string | null): boolean
isNextCalendarDay(lastDay: string | null, nextDay: string): boolean

applyDailyCompletion(meta: DailyMeta, dailyId: string): DailyMeta

getDailyBadgeForStreak(streak: number): {
  id: string;
  label: string;
} | null
2. dailyMetaStorage.ts

Persistence for daily meta.

Functions:

loadDailyMeta(userId?: string | null)
saveDailyMeta(meta, userId?: string | null)
clearDailyMeta(userId?: string | null)

Use same guest/user split pattern:

guest key
user key with userId
3. DailyStreakBadge.tsx

Compact display for:

current daily streak
optional badge label/icon
optional “best” indicator

Keep it small and mobile-safe.

Files To Modify
daily.tsx/poker-challenge/daily.tsx
DailyChallengeCard.tsx
DailyChallengeResultsModal.tsx

Optionally:

add a small reusable badge chip component if helpful
Daily Meta Model

Use this persisted shape:

type DailyMeta = {
  currentDailyStreak: number;
  bestDailyStreak: number;
  lastCompletedDailyId: string | null;
  totalDailiesCompleted: number;
  badgesUnlocked: string[];
};

This is separate from:

main progress
daily run progress
Completion Logic

When a daily run completes:

load current daily meta
apply completion using today’s dailyId
save updated meta
show results modal with:
current daily streak
best daily streak
any newly unlocked badge
Important guard

If the same dailyId is already completed:

do not increment streak again
do not increment total completions again
Streak Rules
If same day completed again

No change.

If completion is the next calendar day
currentDailyStreak += 1
If a day was missed
currentDailyStreak = 1
Best streak
update if current exceeds best
Total dailies
increment only on first completion for a given day
Badge System

Implement a lightweight badge ladder tied to daily streaks.

Use this badge ladder:

Streak	Badge
1	First Step
3	On a Roll
5	Daily Grinder
7	Weekly Heater
14	Two-Week Tank
30	Iron Will
Badge logic

When a streak reaches one of these values:

unlock badge if not already in badgesUnlocked
show badge unlock moment in results modal

Do not overbuild visuals. A clean text badge chip is enough for this taskcard.

UI Requirements
DailyChallengeCard

Add compact daily meta section:

Daily Streak: X
optional badge label
optional best streak small text

Example:

🔥 Daily Streak: 4
Badge: On a Roll
DailyChallengeResultsModal

Add:

Daily Streak: X
Best Daily Streak: Y
if new badge unlocked:
New Badge Unlocked: Weekly Heater
Daily screen header

Optional but recommended:

show current daily streak in small text near top
Return Reward Messaging

When the user opens the daily card and has an existing streak:

show encouraging copy such as:
Keep your streak alive
Finish today’s run to make it 5 days

Do this on DailyChallengeCard.

When the streak was broken:

do not shame the user
simply show:
Start a new streak today

This can be derived by comparing lastCompletedDailyId to current date.

Date Handling

Keep using local date IDs in YYYY-MM-DD.

Use the same day boundary logic already used for Daily Challenge generation.

Do not introduce timezone complexity beyond local device date for now.

Reset Behavior

If user resets app or clears daily storage:

daily meta may reset
keep reset function internal for now, not necessarily exposed in UI unless easy

If you already have reset utilities, add daily meta clear there if appropriate.

Acceptance Criteria
Completing Daily Challenge increments streak only once per day
Consecutive day completion increments current daily streak
Missed-day completion resets streak to 1
Best daily streak persists correctly
Total dailies completed persists correctly
Badge unlocks trigger at correct streak values
Daily entry card shows streak info
Daily results modal shows streak + best streak
Same-day reopen/completed state does not double count
Guest and logged-in daily meta remain separate
Main mode remains unaffected
Deliverable Back

When complete, report:

files created
files modified
final daily meta shape
example:
completing 3 consecutive days
missing one day and resetting to 1
screenshot of:
daily card with streak info
results modal with badge unlock
daily HUD/header if added

After this, the next card should be: