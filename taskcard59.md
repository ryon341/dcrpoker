TC059 — Login Gate Polish + Return-to-State After Auth + Guest-to-User UX Cleanup
Goal

Polish the guest-to-auth flow so Level 5 → Level 6 conversion feels smooth, intentional, and safe.

This taskcard should make sure:

guest users hit a clean login/signup wall at Level 6
after logging in, they return to the right game state
guest progress migrates cleanly to the account
there is no confusing dead-end UX
auth feels like part of the game, not a break in it

This is mostly UX/state-routing polish on top of the backend persistence you already built.

Scope

Implement:

return-to-game after login/signup
preserve pending game state through auth
better Level 5 completion gate UX
cleaner guest → user migration UX
post-auth resume messaging
guard against duplicate or conflicting progress restores

Do not change scoring.
Do not change level thresholds.
Do not change ad logic except where needed for auth flow smoothness.

Primary User Flow
Current desired flow
Guest plays through Level 5
Completes Level 5
Sees login gate modal
Taps Log In / Sign Up
Goes through auth
Returns directly to poker challenge
Progress is restored/migrated
User advances into Level 6 cleanly

That entire chain should now feel seamless.

Files To Create
1. authReturn.ts

Utility for storing/restoring intended return destination and lightweight game context.

Functions:

setAuthReturnTarget(payload)
getAuthReturnTarget()
clearAuthReturnTarget()

Suggested payload:

type AuthReturnTarget = {
  route: string; // "/poker-challenge"
  source: 'level6-gate' | 'manual-login';
  pendingAdvanceLevel?: boolean;
  savedAt: string;
};

Use AsyncStorage or existing app-safe local persistence.

2. PostAuthResumeBanner.tsx

Small banner or toast shown after returning from auth.

Examples:

Progress saved. Welcome back.
Your guest run has been moved to your account.
Level 6 unlocked.

Keep it short and dismissible/temporary.

Files To Modify
LoginGateModal.tsx
usePokerProgress.ts
poker-challenge/index.tsx
auth/login screen or auth callback handling file
route/navigation handling files as needed
possibly progressStorage.ts if you need explicit migration helpers
Auth Return Behavior
On guest Level 6 gate

When guest taps Log In / Sign Up:

save auth return target:
{
  route: '/poker-challenge',
  source: 'level6-gate',
  pendingAdvanceLevel: true,
  savedAt: now
}
navigate to login/signup flow
After successful auth

On login success:

read auth return target
if target exists, navigate there
clear target after use
Pending Advance Behavior

This is the important part.

When the guest hit the wall, they had effectively earned the right to move from Level 5 to Level 6.

After returning authenticated, do not make them re-earn or re-click through confusing steps.

Required behavior

If:

auth return target source = level6-gate
and the loaded saved progress is at Level 5 completed gate state

Then:

either auto-open the level-complete modal with Level 6 now available
or auto-advance them cleanly to Level 6

Preferred:

show a very short post-auth resume banner
then advance into Level 6 without extra friction
Guest → User Migration UX

Your backend migration exists already. Now polish the experience.

On first authenticated load after guest play

If guest progress was migrated:

show:
Guest progress moved to your account
do not show scary or technical wording
If backend already has newer progress

If migration does not occur because backend has fresher data:

load backend state normally
optionally show:
Loaded your saved progress

Do not confuse the user with conflict details.

Conflict Rules

Keep existing backend rule:

latest updatedAt wins

Frontend polish requirement:

avoid jarring state flicker between local and backend
once resolved, commit to one state for that session load
Practical approach

In usePokerProgress.ts:

finish backend/local resolution first
only then set progressLoaded = true

Avoid:

render local Level 5
then snap to backend Level 7 a second later
Login Gate Modal Upgrade

Improve LoginGateModal.tsx copy.

Suggested content

Title:

Save Your Progress

Body:

You’ve completed the free levels. Log in or create an account to save your run and unlock Level 6+.

Buttons:

Log In / Sign Up
Start Over at Level 1
Close

Optional small note:

Your current guest run will be moved to your account.
Return Banner Behavior

After successful auth return, show one of:

If migrated from guest:
Progress transferred. Level 6 unlocked.
If just resumed saved progress:
Welcome back. Progress restored.

Banner duration:

~2.5 to 4 seconds
dismiss automatically or on tap
Ad Flow Interaction

Since you now have entry ads, make auth return feel clean.

Rule

When returning immediately from login to resume gated progression:

do not show the main entry ad again during that same resume flow

Otherwise auth return will feel punitive.

Suggested approach

Set a temporary in-memory or short-lived flag:

skipNextMainAd = true

Clear it after first use.

Route / Navigation Requirements
Must support:
guest in game → login → back to /poker-challenge
daily route should remain unaffected unless user manually logs in there
no broken loops to auth screen
Edge case

If auth return target is stale or invalid:

fall back to normal post-login destination
State Additions

Add lightweight flags as needed:

postAuthResumeMessage
pendingAdvanceAfterAuth
skipNextMainAd
didMigrateGuestProgress

These may live in page state, hook state, or a small helper store.

Reset / Start Over Behavior

If guest clicks Start Over at Level 1 in the login gate modal:

clear guest progress
reset state
remain guest
do not navigate to auth

No changes needed for logged-in reset behavior.

Acceptance Criteria
Guest hitting Level 6 gate can tap Log In / Sign Up
Auth flow returns user to poker challenge automatically
Guest progress migrates to user account cleanly
Returning authenticated user does not lose their run
Level 6 becomes available without awkward rework
Post-auth resume banner appears
Main entry ad does not immediately replay on auth return
No state flicker between local and backend restore
Existing guest reset/start-over flow still works
Daily mode remains unaffected
Deliverable Back

When complete, report:

files created
files modified
where auth return target is stored
how post-auth resume is detected
whether main ad is skipped on auth return
screenshots/video of:
guest Level 6 gate
tap to login
return to game after auth
Level 6 unlocked / resumed state

After this, the next card should be: