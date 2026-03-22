TC050 — Wheel Spin Animation + Hand Reveal Polish + Score Pop Effects
Goal

Take the current playable game and add the first real layer of polish so it feels like a game instead of a prototype.

This taskcard focuses on:

real wheel spin presentation
better hand result reveal flow
score delta pop animations
smoother visual transitions
level-up / wheel / result states feeling rewarding

Do not change core scoring rules or guest/login gating in this task.

Scope

Enhance the existing /poker-challenge flow with polished frontend animation and state sequencing.

Implement:

animated bonus wheel spin
score delta popups
staged hand reveal flow
improved result transitions
better level-complete celebration
button press / disabled-state polish
visual emphasis on board center and winning hand state

Still frontend only.

Core Rule Reminder

Do not modify these:

Correct + Win = +13
Correct + Lose = +7
Incorrect + Win = -5
Incorrect + Lose = -10

Wheel slots remain:

+50 × 1
+20 × 2
+15 × 10
+10 × 12
+5 × 5
0 × 1
-10 × 1
New Visual Assets To Wire In

Assume these exist in the game assets folder:

wheel.png
wheel-pointer.png
spin-button.png
win-overlay.png
lose-overlay.png
table-center-glow.png
button-glow.png
panel-glow-overlay.png
small-chip.png
highlight-ring.png
sparkle-particles.png
dim-overlay.png
card-glow.png

If any are not yet present, build component logic so missing assets fail gracefully.

Files To Create
1. components/poker-challenge/animations.ts

Centralize animation timing constants.

Example:

export const ANIMATION_TIMINGS = {
  answerLock: 150,
  correctnessBanner: 300,
  villainReveal: 500,
  boardReveal: 850,
  outcomeReveal: 1200,
  scorePop: 1450,
  continueEnable: 1700,
  wheelSpinMin: 2400,
};
2. components/poker-challenge/ScoreDeltaPop.tsx

Floating score popup component.

Behavior:

appears after resolved hand
shows:
+13
+7
-5
-10
color by sign:
positive = green/gold
zero = neutral
negative = red/orange
should animate upward and fade out

Also use for wheel result popup:

+15
+50
0
-10
3. components/poker-challenge/WheelModal.tsx

Replace basic wheel section behavior with modal/panel experience.

Show:

dimmed background
centered wheel
fixed pointer
spin button
result text after spin
continue button after resolved
Files To Modify
BonusWheelPanel.tsx
ResultBanner.tsx
HandDisplay.tsx
DecisionButtons.tsx
ContinuePanel.tsx
LevelCompleteModal.tsx
poker-challenge/index.tsx
relevant CSS/style files
Wheel Spin Requirements
Visual behavior

When wheel is triggered:

open WheelModal
show wheel centered with pointer fixed
spin button active
on click:
disable spin button
rotate wheel several full turns
land on predetermined random result
after stop:
show result value prominently
apply score
show score delta popup
enable Continue button
Implementation notes

You do not need perfect physics.
A clean deterministic spin is enough.

Suggested approach:

precompute chosen wheel slot index
calculate final rotation:
multiple full turns + landing angle
animate with CSS transform + ease-out
Slot mapping

Create a fixed slot array matching current wheel weights.
Render slot labels logically if already displayed, otherwise just use the existing wheel art and internal slot mapping.

Hand Reveal Flow Upgrade
Current flow

User answers → everything appears too quickly.

New staged sequence

After user clicks YES/NO:

buttons disable immediately
short pause
correctness banner appears
explanation panel fades/slides in
villain cards reveal
board/runout reveals
flop first
then turn
then river
can be quick, not slow
outcome overlay appears:
win or lose
score delta popup appears
Continue button activates

This does not need complex animation libraries unless already in project.

Simple CSS transitions or React Native Animated is fine.

HandDisplay Upgrades
Add support for staged reveal flags:
showVillainCards
showFlop
showTurn
showRiver
showOutcome
Center emphasis

Use:

table-center-glow.png
optional highlight-ring.png

Under the board area to make the runout feel important.

Winning emphasis

If hero wins:

subtle glow on hero area or board center

If hero loses:

optional dim overlay on hero area or darker tone

Keep it tasteful, not gaudy.

Score Delta Popups
Requirements

After each resolved hand:

popup shows exact delta
floats upward near score area or center result area
fades out automatically

After wheel result:

popup also appears
Multiple uses

This component should be reusable in:

hand scoring
wheel reward
level bonus later if needed
ResultBanner Upgrade

Current banner likely just swaps images.

Improve so:

banner fades/scales in
supports correctness first
outcome overlay follows
if both are shown, do not visually clash

Recommended:

correctness banner in panel area
win/lose overlay centered above board

Use:

result-correct.png
result-incorrect.png
win-overlay.png
lose-overlay.png
DecisionButtons Polish

Enhance:

press animation on tap
disabled dim state after selection
optional button-glow.png under hovered/active selected state if easy

No gameplay changes.

ContinuePanel Upgrade

Make Continue feel unlocked only after full reveal sequence.

Behavior:

hidden until reveal finishes
fades/slides in
shows final score delta summary
LevelCompleteModal Upgrade

Current modal works functionally.

Enhance:

add celebratory graphic treatment
use level-badge.png
optional sparkle layer with sparkle-particles.png
text:
Level X Complete
Score: current / next threshold
Advance button with stronger polish

No rule changes.

Optional Dim/Focus Layer

When these states are active:

wheel modal
level complete modal
login gate modal

Use dim-overlay.png behind modal stack so background feels intentional.

State Changes To Add

In main page state, add staged animation flags:

showCorrectness
showExplanation
showVillainCards
showFlop
showTurn
showRiver
showHandOutcome
showScoreDelta
wheelSpinning
wheelResultResolved
wheelRotationDeg

You can manage with a small sequence runner in index.tsx.

Suggested Sequence Helper

Create a function like:

async function runRevealSequence(resolution) {
  setShowCorrectness(true);
  await wait(250);
  setShowExplanation(true);
  await wait(250);
  setShowVillainCards(true);
  await wait(250);
  setShowFlop(true);
  await wait(250);
  setShowTurn(true);
  await wait(200);
  setShowRiver(true);
  await wait(250);
  setShowHandOutcome(true);
  await wait(200);
  setShowScoreDelta(true);
  await wait(150);
  setCanContinue(true);
}

Use your app’s preferred async/timer pattern.

Acceptance Criteria
Wheel opens in a proper modal when triggered
Wheel visibly spins and lands on chosen result
Spin result is shown clearly before continue
Score delta popup appears after wheel result
After answering a hand, reveal sequence is staged
Villain cards reveal after correctness
Board reveals in steps
Win/lose overlay appears after board reveal
Score delta popup appears after hand resolution
Continue button appears only after reveal sequence
Level complete modal feels visually upgraded
No scoring or progression rules are changed
Guest Level 6 gate still works
No backend changes required
Deliverable Back

When complete, report:

files created
files modified
whether wheel spin lands visually on result
whether staged reveal flow works
whether score delta popup works for both hand + wheel
screenshots or clips of:
hand answer reveal sequence
spinning wheel modal
wheel result state
level complete modal

After TC050, next taskcard should be: