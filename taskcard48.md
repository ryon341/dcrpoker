TC048 — DCR Poker Challenge V1 Game State + Scoring Engine
Goal

Replace the temporary YES/NO mock behavior with a real local game loop for one challenge at a time. This taskcard should still be frontend-only with mocked challenge data. Build the scoring system, challenge progression, 15-hand wheel trigger state, and per-hand result flow.

Do not build backend persistence yet.

Core Rules To Implement
Scoring
Correct + Win = +13
Correct + Lose = +7
Incorrect + Win = -5
Incorrect + Lose = -10
Total score can never go below 0
Level thresholds
Level 1 = 100
Level 2 = 100
Level 3 = 130
Level 4 = 150
Level 5 = 200
Level 6 = 250
Level 7 = 300
Level 8 = 360
Level 9 = 430
Level 10 = 510
Level 11 = 600
Level 12 = 700
Level 13 = 820
Level 14 = 950
Level 15 = 1100
Level 16 = 1275
Level 17 = 1475
Level 18 = 1700
Level 19 = 1950
Level 20 = 2230
Level 21 = 2540
Level 22 = 2880
Level 23 = 3250
Level 24 = 3650
Level 25 = 4100
Wheel trigger
Trigger bonus wheel after every 15 completed hands
Do not spin automatically
Present wheel modal/panel after hand 15, 30, 45, etc.
Block next challenge until wheel is resolved
Wheel outcomes

Use this exact pool for now:

+50 × 1
+20 × 2
+15 × 10
+10 × 12
+5 × 5
0 × 1
-10 × 1

Represent as an array and randomly choose one slot for now.
Do not build physical spin animation logic yet beyond a simple “spin result” interaction.

Mock Challenge Data

Create a local mock data file:

components/poker-challenge/mockChallenges.ts

At minimum include 20 sample preflop challenges.

Each challenge should have:

id
question
heroHand
villainHand
correctAnswer (yes or no)
explanation
runout (5 board cards)
heroWins (true or false)
Example shape
export type Challenge = {
  id: string;
  question: string;
  heroHand: [string, string];
  villainHand: [string, string];
  correctAnswer: 'yes' | 'no';
  explanation: string;
  runout: [string, string, string, string, string];
  heroWins: boolean;
};

Do not worry yet about true poker solver accuracy beyond making the sample data plausible and structured.

State Model

Refactor main page to manage real local state:

level
score
handsCompleted
currentChallengeIndex
currentChallenge
selectedAnswer
answerResolved
showExplanation
showRunout
lastScoreDelta
lastResultType
wheelPending
wheelResolved
lastWheelResult
levelComplete
Required Game Flow
Hand flow
Load one challenge
Show question and player hand
Opponent cards hidden initially
User selects YES or NO
Lock buttons
Evaluate correctness
Reveal:
correct/incorrect banner
explanation text
villain hand
5-card runout
hand outcome (win/lose)
score delta
Apply score
Show Continue button
Advance to next challenge
Continue behavior
Increment handsCompleted
If hand count hits multiple of 15, open wheel
Else load next challenge
If score reaches threshold, trigger level complete state
Scoring Logic

Implement a single utility:

components/poker-challenge/scoring.ts

Functions:

getScoreDelta(isCorrect: boolean, heroWins: boolean): number
applyScore(current: number, delta: number): number
getPointsRequired(level: number): number
Wheel Logic

Create utility:

components/poker-challenge/wheel.ts

Functions:

getWheelSlots(): number[]
spinWheelResult(): number

For TC048:

clicking Spin chooses random result from weighted array
apply points immediately
clamp at zero
dismiss wheel
continue game
UI Changes Required
QuestionPanel

Add optional explanation area after answer resolves.

HandDisplay

Support:

before answer: villain hidden
after answer: villain revealed
after answer: board/runout displayed in center
ResultBanner

Should handle both:

correctness result
optional hand result text: "You Win" / "You Lose"
DecisionButtons

After selection, disable both buttons.

Add new component

ContinuePanel.tsx

appears after resolved hand
shows score delta
shows Continue button
Add new component

LevelCompleteModal.tsx

shows when score >= threshold
text: Level X Complete
button: Advance to Level X+1

When advancing:

increment level
keep cumulative score
load next challenge
dismiss modal

Do not reset score on level-up.

Route Behavior

Keep route public for now:

/(protected)/poker-challenge

No auth gating yet beyond what is already in place.

Mocked Card/Board Reveal

You already have PlayingCard.tsx.

Extend it so board cards and villain cards use same component.

Display order:

Villain hand at top
Board row in middle
Hero hand at bottom
Acceptance Criteria
Page loads and first challenge renders
YES/NO are evaluated against challenge data
Buttons disable after selection
Correctness banner appears
Explanation appears
Villain hand reveals after answer
Runout displays after answer
Score delta uses exact rules
Score never drops below zero
Continue loads next challenge
Every 15 hands triggers wheel state
Wheel result applies points and continues
Level complete modal appears when threshold is reached
Advancing level keeps cumulative score
No backend/API required
Deliverable Back

When complete, report:

files created
files modified
sample challenge data count
whether runout reveal works
whether wheel trigger works
screenshot of:
unanswered hand
answered hand with reveal
wheel state
level complete modal

After TC048, the next step will be TC049: login/save progression + guest Levels 1–5 vs registered Level 6+ gating.