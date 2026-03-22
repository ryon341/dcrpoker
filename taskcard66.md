TC066 — Performance + Optimization Pass
Goal

Do a focused optimization pass so the app feels smooth, loads faster, and is safer to launch.

This taskcard is about:

reducing unnecessary renders
tightening timers/animations
improving image handling
preventing memory leaks
making ad/game/stats screens more stable

Do not add features in this card.
This is a cleanup and performance hardening pass.

Scope

Implement:

render optimization
timer/interval cleanup
image/asset optimization pass
route/screen load improvements
animation efficiency improvements
lightweight diagnostic logging in dev only
Files To Audit / Modify

At minimum review and optimize:

poker-challenge/index.tsx
daily.tsx/poker-challenge/daily.tsx
AdBreakModal.tsx
WheelModal.tsx
DailyChallengeCard.tsx
DailyChallengeResultsModal.tsx
StatsPanel.tsx
GameFeedbackSettings.tsx
ChallengeHeader.tsx
HandDisplay.tsx
ResultBanner.tsx
ContinuePanel.tsx
usePokerProgress.ts
adAnalytics.ts
dailyMetaStorage.ts
dailyStorage.ts
progressStorage.ts
1. Render Optimization
Memoize stable presentation components

Wrap low-churn components with React.memo where useful:

Candidates:

StatsCard
StatsBar
StatsSection
SettingsToggleRow
StreakBadge
DailyStreakBadge
PlayingCard
ResultBanner
ScoreRulesPanel

Only do this where props are stable and it actually reduces noise.

Stabilize callback props

Use useCallback for handlers frequently passed down:

answer handlers
continue handlers
modal dismiss handlers
ad completion handlers
stats/settings toggle handlers

Avoid wrapping everything blindly. Focus on heavily reused handlers.

Memoize derived values

Use useMemo for:

accuracy %
win rate %
title labels
next title hint
ad metrics calculations
daily streak badge label
large mapped stat arrays / section configs
2. Timer / Interval Cleanup

This is important because your app now has:

reveal phase timers
ad modal ticker
daily resume logic
wheel timing
toast/banner timing
Requirements

Every setTimeout, setInterval, animation listener, or timer must:

be cleaned up on unmount
be cleared before restarting
not continue firing after navigation
Specific targets
AdBreakModal.tsx
confirm 100ms interval is fully cleared
no duplicate complete firing
no stale closure issues
index.tsx / daily.tsx
reveal-phase timers cleaned on:
route change
answer interruption
restart/reset
unmount
PostAuthResumeBanner.tsx
auto-dismiss timeout cleanup
3. Asset / Image Optimization
Goal

Reduce large-image overhead without redesigning assets.

Tasks
check all large PNG/JPG assets currently used in gameplay and ad screens
ensure images use sensible sizing in UI:
no full-resolution render for tiny display areas
avoid repeatedly mounting oversized decorative overlays unnecessarily
Practical steps
use fixed max dimensions where reasonable
avoid rendering hidden decorative assets until needed
do not keep multiple heavy overlays mounted invisibly if conditional rendering is cleaner
Review especially
background board image
wheel
ad backgrounds/end cards
overlays like glows/particles
4. Animation Efficiency
Goal

Keep the feel while reducing unnecessary work.

Tasks
confirm animations use native driver where supported
avoid running overlapping animations on off-screen elements
reduce unnecessary repeated animated value creation
Review
WheelModal.tsx
wheel rotation animation lifecycle
ensure animated values reset cleanly
HandDisplay.tsx
villain reveal animation shouldn’t restart unnecessarily on unrelated re-renders
ResultBanner.tsx
ensure animation only triggers when result changes
ContinuePanel.tsx
only animate on actual mount/show
5. Data Persistence Hardening

You now have several AsyncStorage-backed systems:

main progress
daily progress
daily meta
ad state
sound/haptics settings
auth return target
Tasks
make storage access resilient to malformed JSON
centralize try/catch behavior if useful
add safe defaults
ensure failed read does not break screen render
Add migration safety

If shape changes or partial corruption occurs:

log dev warning
fall back gracefully
6. Dev Diagnostics (Lightweight)

Add small dev-only timing/debug logs for:

progress load time
daily load time
ad modal lifecycle
backend progress fetch fallback to local

Example:

if (__DEV__) {
  console.log('[PokerChallenge] Loaded progress from backend in 142ms');
}

Do not spam logs every render.

Only log meaningful lifecycle events.

7. Startup / Screen Load Improvements
Main challenge page

Avoid rendering full content before progress is loaded.

show a clean loading state/skeleton if needed
prevent flicker between empty/default state and restored state
Daily page

Same:

do not briefly show wrong hand/state before restore completes

This may already be partly solved; tighten it.

8. Ad Modal Specific Optimization

Ad modal is now visually rich.

Tasks
ensure phase switching is state-minimal
avoid rerendering the whole tree every 100ms if possible
Preferred improvement

Use a single countdown state update cadence that is as light as practical.
If current 100ms interval is overkill, move to:

progress derived by animation
displayed seconds updated at lower frequency where possible

If you keep 100ms, justify it and ensure it’s cheap.

9. Stats Page Optimization

Stats page now has multiple sections and ad analytics.

Tasks
memoize ad analytics calculations
avoid repeated storage reads on re-render
load stats once on mount/focus
keep toggles snappy
10. Acceptance Criteria
No leaked timers/intervals after screen change
Main challenge page restores without visible flicker
Daily page restores without visible flicker
Ad modal timers do not double-fire
Major presentation components are memoized where appropriate
Derived stats/labels are memoized where appropriate
AsyncStorage parsing failures fail safely
Animations do not retrigger unnecessarily
App feels at least as smooth as before, preferably smoother
No gameplay behavior changes
No scoring/progression changes
Dev logs are lightweight and useful
Deliverable Back

When complete, report:

files modified
which components were memoized
which timers/intervals were cleaned up
any storage guards added
whether ad modal timing was adjusted
any measurable improvements noticed
any issues found but deferred