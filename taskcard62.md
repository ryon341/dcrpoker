TC062 — 15-Second Ad Break System + Mode-Based Triggers
Goal

Wire in your ad system so the game can show a short branded interstitial before selected sections, using the assets you created.

This taskcard should implement:

15-second ad break screen
countdown + progress bar
skip unlock timing
mode-based triggers
DeerCreekRoad branded end card
clean return back into the game flow

Do not integrate third-party ad networks yet.
This is your house ad / internal promo system first.

Scope

Implement a reusable ad break system that can be triggered before:

main challenge start
daily challenge start
selected major sections later

For now, minimum triggers:

before entering /poker-challenge/daily
before starting/resuming main challenge from the entry area
Ad Rules
Duration
total ad duration: 15 seconds
Skip
skip button unlocks after 15 seconds
until then, show countdown
End state
after countdown completes:
show skip/continue
or auto-continue after 1 second

Recommended:

auto-continue, but still allow a visible Continue button
Files To Create
1. AdBreakModal.tsx

Reusable full-screen ad experience.

Props:

type AdBreakModalProps = {
  visible: boolean;
  durationSeconds?: number; // default 15
  onComplete: () => void;
  onSkip?: () => void;
  variant?: 'main' | 'daily' | 'generic';
};
Responsibilities
display loading/ad screen
animate progress bar
animate countdown
unlock skip/continue at end
show DeerCreekRoad end card in final moments or as final state
2. adBreak.ts

Utility helpers.

Functions:

getAdDuration(): number
getAdTriggerKey(mode: string): string
shouldShowAdBreak(args): boolean

Suggested args:

{
  mode: 'main' | 'daily',
  lastShownAt?: string | null,
}
3. adBreakStorage.ts

Persist ad timing so ads don’t fire too aggressively.

Functions:

loadAdBreakState()
saveAdBreakState(state)
markAdShown(mode)
canShowAd(mode)

Suggested stored shape:

type AdBreakState = {
  mainLastShownAt?: string | null;
  dailyLastShownAt?: string | null;
};
Files To Modify
index.tsx/poker-challenge/index.tsx
daily.tsx/poker-challenge/daily.tsx
possibly DailyChallengeCard.tsx
possibly main challenge entry/start button area
shared styling files if needed
Asset Usage

Use these assets where appropriate:

Main ad flow
ad-loading-screen.png
ad-skip-button.png
ad-timer-circle.png
ad-progress-bar.png
ad-close-icon.png
ad-overlay-bg.png
ad-brand-placeholder.png
ad-end-screen.png
ad-click-overlay.png
ad-transition-flash.png
ad-frame-border.png
ad-logo-slot.png
ad-pulse-glow.png
ad-glow-ring.png
ad-cta-highlight.png
ad-background-loop.png
DeerCreekRoad branded version

Prefer the branded DeerCreekRoad end-card assets you generated for the CTA.

Recommended Visual Flow
Phase 1 — Ad loading screen (0s–2s)

Show:

ad-loading-screen.png
progress bar beginning
countdown
Phase 2 — Main promo screen (2s–13s)

Show:

DeerCreekRoad branded promo
CTA:
BUILD YOUR CUSTOM TABLE
website:
www.DeerCreekRoad.com
phone:
804-767-7500

Optional subtle pulse animation:

CTA button glow
logo glow ring
Phase 3 — End card / continue (13s–15s)

Show:

stronger CTA emphasis
countdown reaches zero
Continue / Skip becomes available
optional brief flash transition
Trigger Logic
Main challenge

Show ad:

when user taps Start/Resume from the main challenge entry area
not on every hand
only before entering the gameplay session
Daily challenge

Show ad:

before entering the daily 5-hand run
Cooldown

Prevent spam.

Suggested rule:

do not show the same mode ad again if shown within the last 10 minutes

Example:

user exits and re-enters daily immediately → no ad
later session after cooldown → show again
Behavior Requirements
On trigger

Instead of navigating immediately:

open AdBreakModal
run ad countdown
on complete:
continue to intended action
For daily route

If route-based navigation is awkward:

show ad first on tap from card/button
then navigate to /poker-challenge/daily
For main challenge

If user is already inside main challenge screen, use ad only when starting from the outer entry action, not every resume from internal game state.

Countdown / Timer

Need:

visible seconds remaining
animated progress bar fill or drain

Recommended:

use one timer source of truth
derive:
remaining seconds
progress percent
CTA Interaction

For this taskcard:

CTA can be visual only
optional tap opens DeerCreekRoad site if linking is easy

If opening links is easy in your stack:

tap on CTA opens https://www.deercreekroad.com

If not, defer actual outbound click handling to a later card.

Accessibility / UX

Keep this from feeling broken or deceptive.

Need:

clear “Ad Break” label
visible countdown
visible continue/skip state
smooth return to game
no loss of progress if ad interrupted
Suggested State

Inside modal:

phase: 'loading' | 'promo' | 'ending'
remainingSeconds
progress
canSkip
isComplete
Acceptance Criteria
15-second ad break displays before daily challenge start
15-second ad break displays before main challenge start/resume entry
Countdown visibly decreases
Progress bar visibly updates
Skip/continue only becomes available at the end
DeerCreekRoad branding is shown during the promo phase
Returning from ad resumes intended destination cleanly
Ad does not show again inside cooldown window
No gameplay progress is lost due to ad flow
Main and daily modes still work normally after ad completes
Deliverable Back

When complete, report:

files created
files modified
trigger points implemented
cooldown rule used
whether CTA opens DeerCreekRoad or is visual-only
screenshots/video of:
ad start
countdown in progress
end/continue state
return into main challenge
return into daily challenge