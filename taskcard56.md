TC056 — Stats + Title System + Streak Tracking HUD
Goal

Add the first real meta-progression layer on top of the game loop so users feel ongoing momentum beyond raw points.

This taskcard adds:

persistent player stats
earned title system
current streak tracking
best streak tracking
HUD display for stats/title/streak
basic post-hand stat updates

This should make progression feel more “game-like” and give users another reason to keep playing.

Scope

Implement:

player stats model
title unlock system
streak system
stat persistence
HUD updates
simple profile/stats panel in-game

Do not add leaderboards yet.
Do not change scoring rules.
Do not change challenge selection logic.

Core Systems To Add
1. Stats Tracking

Track at minimum:

totalHandsPlayed
totalCorrect
totalIncorrect
totalWins
totalLosses
currentStreak
bestStreak
wheelSpins
totalWheelPoints
highestLevelReached
2. Derived Stats

Compute:

accuracyPercent
winPercent
correctRateThisRun (optional if easy)

These can be computed on the fly and do not need separate storage unless convenient.

Title Ladder

Implement this exact title ladder:

Title	Levels
Rookie	1–3
Novice	4–5
Apprentice	6–7
Regular	8–10
Skilled Player	11–13
Advanced Player	14–16
Expert	17–19
Pro	20–22
Elite	23–24
High Roller	25

Create a utility that maps level → title.

Files To Create
1. titleSystem.ts

Functions:

getTitleForLevel(level: number): string
getTitleTier(level: number): string

Optional:

getNextTitle(level: number): { title: string; unlockLevel: number } | null
2. stats.ts

Central stat update utilities.

Functions:

export type PokerStats = {
  totalHandsPlayed: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  bestStreak: number;
  wheelSpins: number;
  totalWheelPoints: number;
  highestLevelReached: number;
};

getInitialStats(): PokerStats

applyHandStats(stats, {
  isCorrect,
  heroWins,
}): PokerStats

applyWheelStats(stats, wheelDelta): PokerStats

applyLevelProgress(stats, level): PokerStats

getAccuracyPercent(stats): number
getWinPercent(stats): number
3. StatsPanel.tsx

A compact in-game stats panel.

Show:

title
accuracy %
current streak
best streak
hands played
highest level

Can be collapsible if needed for mobile.

4. StreakBadge.tsx

Small HUD widget showing:

current streak count
optional streak fire asset if available

Use:

streak-fire.png
streak-counter-bg.png
streak-number-glow.png if practical

Gracefully degrade if assets are awkward.

Files To Modify
progressStorage.ts
usePokerProgress.ts
poker-challenge/index.tsx
ChallengeHeader.tsx
ContinuePanel.tsx
possibly LevelCompleteModal.tsx
Persistence Changes

Extend saved progress shape to include stats.

Update progress model
export type PokerChallengeProgress = {
  level: number;
  score: number;
  handsCompleted: number;
  currentChallengeId?: string | null;
  challengeHistory: string[];
  wheelPending: boolean;
  lastWheelResult: number | null;
  updatedAt: string;
  stats: PokerStats;
};

If restoring older saved progress without stats:

migrate safely
default to getInitialStats()
Streak Rules
Current streak
increments by 1 on every correct answer
resets to 0 on incorrect answer
Best streak
update whenever current streak exceeds best streak

This is based on correctness, not showdown win/loss.

That keeps the streak skill-based.

Hand Stat Update Rules

After each resolved hand:

totalHandsPlayed += 1
if correct:
totalCorrect += 1
currentStreak += 1
else:
totalIncorrect += 1
currentStreak = 0
if heroWins:
totalWins += 1
else:
totalLosses += 1
bestStreak updates if needed
Wheel updates

After each wheel spin:

wheelSpins += 1
totalWheelPoints += delta
Level updates

When level advances:

highestLevelReached = max(highestLevelReached, newLevel)
UI Requirements
ChallengeHeader

Add:

current title
compact streak display
maybe one compact line:
Title: Novice
Streak: 3

Keep header readable on mobile.

StatsPanel

Add a small expandable or below-header panel with:

Accuracy
Hands Played
Best Streak
Highest Level

Do not overcrowd the main game board.

ContinuePanel

Optionally include:

Streak: +1 or Streak broken
Only if it fits cleanly.
LevelCompleteModal

Add:

current title
next title unlock hint if available

Example:

Current Title: Apprentice
Next Title: Regular at Level 8
Title Unlock Behavior

When a new level changes title tier:

show a small title unlock treatment

Simple version:

inline banner or modal text:
New Title Unlocked: Regular

No huge animation required yet unless easy.

You may show this in LevelCompleteModal.

Reset Progress Behavior

When resetting progress:

also reset stats
title returns to Rookie

Make sure both guest and user reset flows handle stats reset.

Acceptance Criteria
Stats object exists and updates after each hand
Current streak increments only on correct answers
Incorrect answer resets current streak
Best streak is tracked correctly
Wheel stats update correctly
Highest level reached persists
Title is derived correctly from level
Title displays in HUD
Stats persist across reload/app reopen
Old saves without stats do not crash
Reset progress also resets stats
UI remains clean on mobile
Deliverable Back

When complete, report:

files created
files modified
final saved progress shape
1 sample stat update after a correct/win hand
1 sample stat update after an incorrect/lose hand
screenshot of:
HUD with title + streak
stats panel
level complete modal showing title info

After this, the next card should be: