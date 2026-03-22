TC049 — Guest Levels 1–5 + Login Gate + Saved Progress
Goal

Add real progression rules for guests vs logged-in users:

Guests can play Levels 1–5
Guest progress is not permanently saved
Logged-in users can save progress
Level 6 and above requires login
When a guest reaches Level 5 completion, show a strong account/signup prompt before Level 6

This taskcard should still work even if backend persistence is not fully finished. Build it so local/mock persistence can be swapped for API later.

Core Rules
Guest users
Can access /poker-challenge
Can play Levels 1–5
Can gain points and level up during current session
Progress is only session/local-device based for now
Cannot enter Level 6 gameplay unless authenticated
Logged-in users
Can play all levels
Progress persists
Resume from saved score/level/hands completed state
Build Scope

Implement:

guest vs authenticated game mode detection
local persistence layer abstraction
level-6 gate modal
resume saved progress on load
save progress after every resolved hand
save progress after wheel result
save progress after level-up
guest reset/continue behavior
optional “start over” action
New State Requirements

Add these values to game state:

isGuest
hasSavedProgress
maxGuestLevel = 5
loginRequiredForNextLevel
sessionLockedAtLevel6
progressLoaded
lastSavedAt
Persistence Model

Create a normalized progress object.

Shape
export type PokerChallengeProgress = {
  level: number;
  score: number;
  handsCompleted: number;
  currentChallengeIndex: number;
  wheelPending: boolean;
  lastWheelResult: number | null;
  updatedAt: string;
};
Files To Create
1. components/poker-challenge/progressStorage.ts

Utility layer for loading/saving progress.

Functions:

loadGuestProgress()
saveGuestProgress(progress)
clearGuestProgress()
loadUserProgress(userId)
saveUserProgress(userId, progress)
clearUserProgress(userId)

For now:

guest progress can use localStorage / AsyncStorage
user progress can also use localStorage / AsyncStorage under a user-scoped key if backend is not ready

Design this file so backend API can replace internals later.

2. components/poker-challenge/usePokerProgress.ts

Custom hook to:

initialize progress
detect auth mode
load correct saved state
expose save/reset helpers
3. components/poker-challenge/LoginGateModal.tsx

Shown when:

guest completes Level 5 and tries to advance
guest somehow loads state above allowed level

Content:

title: Save Your Progress
body: explain Levels 1–5 are free, Level 6+ requires account/login
buttons:
Log In / Sign Up
Start Over at Level 1
Close
Files To Modify
poker-challenge/index.tsx
any auth/session hook file already used in project
router only if needed for auth redirect
Auth Detection

Use the app’s existing auth/session method.

Need one boolean:

const isAuthenticated = ...

If no clean hook exists yet, use current app auth utility.

Do not invent a second auth system.

Load Behavior
On page open:
detect auth
if authenticated:
load user-scoped progress
else:
load guest progress
if no saved progress:
start fresh at level 1, score 0, hands 0
Guard:

If guest progress loads with level > 5, clamp behavior:

do not allow play above 5
show login gate modal
Save Behavior

Save progress automatically:

after each completed hand
after wheel resolution
after level-up
after reset/start over

Do not wait for page exit.

Level Gate Logic
When guest completes Level 5:

Do not advance directly to Level 6.

Instead:

set loginRequiredForNextLevel = true
show LoginGateModal
If guest dismisses modal:
keep them on completed Level 5 state
allow replaying earlier content if desired
do not unlock Level 6
If authenticated:
allow normal advance to Level 6+
UI Additions
Header / top HUD

Add small label:

Guest Mode for guest users
Saved Progress for authenticated users
Add small reset action

Maybe near header or settings area:

Reset Progress

Behavior:

guest: clears guest save
logged-in: clears user-scoped save
resets game to level 1 / score 0
Guest Messaging

Somewhere tasteful on page:

“Play free through Level 5”
after guest reaches late Level 4 or Level 5, show subtle encouragement:
“Create an account to save your run and unlock Level 6+”

Keep it small. Do not clutter gameplay.

Continue / Advance Changes

Modify level-complete flow:

Existing behavior
level complete modal
advance button increments level
New behavior

If isGuest && nextLevel > 5:

block advance
open login gate modal
do not modify level beyond 5

Else:

continue normal advance
save progress immediately
Challenge Replay Rule

If guest is blocked at Level 6:

they may still replay Level 5 or prior content
they may not accumulate “unlocked” state above Level 5

Simple implementation:

keep current level at 5
optionally let them continue replaying Level 5 challenge stream
Acceptance Criteria
Guest can play from Level 1 through Level 5
Guest progress restores on refresh/app reopen
Logged-in user progress restores on refresh/app reopen
Completing Level 5 as guest does not enter Level 6
Level 6 trigger opens login gate modal
Logged-in user can advance past Level 5 normally
Progress saves after each hand
Progress saves after wheel result
Reset progress works
Guest state and logged-in state are stored separately
No backend required yet if auth persistence is not ready
Structure is ready for later API replacement
Deliverable Back

When complete, report:

files created
files modified
where progress is stored for guest
where progress is stored for logged-in user
whether Level 6 gate works
screenshot of:
guest mode HUD
level 5 completion gate
resumed saved progress state

After this, next taskcard should be: