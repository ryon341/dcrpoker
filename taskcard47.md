TC047 — DCR Poker Challenge V1 Shell + Asset Integration
Goal

Build the first playable front-end shell for the DCR Poker challenge game using the asset files already created. This taskcard is UI-first. Do not build full game logic yet beyond simple mocked state transitions. The objective is to get the visual game board rendering correctly in the app and prepare the structure for the scoring/runout logic.

Assets Already Available

Assume these are saved under:

src/assets/game/

Files:

asset01.jpg
card-face.png
card-back.png
btn-primary-green.png
btn-secondary-red.png
ui-panel.png
progress-bar-bg.png
progress-bar-fill.png
result-correct.png
result-incorrect.png
chip-icon.png
level-badge.png
wheel-pointer.png
spin-button.png
wheel.png

If your actual asset folder differs, adjust imports only.

Build Scope

Create a new screen/component called:

src/pages/PokerChallengePage.jsx

and supporting components under:

src/components/poker-challenge/

This first pass should render:

main board background
top HUD
question panel
two player cards
opponent card backs
yes/no buttons
result banner area
level progress bar
points display
bonus wheel section
recent result / score rules box

Use mocked local state for now.

Mocked Gameplay State

Hardcode a temporary state object inside the page:

const mockState = {
  level: 1,
  points: 47,
  pointsRequired: 100,
  challengeNumber: 12,
  wheelEvery: 15,
  question: "Is AKo a GTO preflop raise from this position?",
  playerHand: ["A♠", "K♣"],
  opponentHidden: true,
  lastResult: "correct", // correct | incorrect | null
  scoreTable: {
    correctWin: 13,
    correctLose: 7,
    incorrectWin: -5,
    incorrectLose: -10,
  },
};

Do not overengineer yet.

Components To Create
1. PokerChallengeLayout.jsx

Responsible for:

full-screen page wrapper
background image
centered content column
responsive sizing
2. ChallengeHeader.jsx

Show:

level badge graphic
level text
current points / required points
chip icon
progress bar
3. QuestionPanel.jsx

Show:

ui-panel.png as background
question text centered
optional small subtitle like “GTO Decision”
4. HandDisplay.jsx

Show:

two player cards using reusable PlayingCard.jsx
two opponent hidden cards using card-back.png
simple “You” and “Villain” labels
5. PlayingCard.jsx

For now:

render white card image base
overlay card rank/suit as text
do not attempt full suit rendering perfection
just make it clean and readable
6. DecisionButtons.jsx

Render:

green yes button
red no button
Use asset images as button backgrounds.
7. ResultBanner.jsx

If lastResult === "correct" show result-correct.png
If lastResult === "incorrect" show result-incorrect.png
If null, hide banner.

8. ScoreRulesPanel.jsx

Small panel showing:

Correct + Win = +13
Correct + Lose = +7
Incorrect + Win = -5
Incorrect + Lose = -10
9. BonusWheelPanel.jsx

Show:

wheel.png
wheel-pointer.png
spin-button.png
No real spin logic yet.
Just render nicely and include disabled placeholder button behavior.
Required Behavior

Add temporary button handlers:

YES button
toggles result banner to "correct"
NO button
toggles result banner to "incorrect"

This is just for shell testing.

Also add:

small fake point update after click
clamp points at zero

Example:

correct click → points + 7
incorrect click → points - 10

This is temporary only.

Styling Requirements

Use plain CSS module or existing project styling pattern.
Need:

mobile-first layout
centered game board
max width around 520–700px
asset images should scale responsively
background should fill screen without distortion

Important:

do not place core UI on top of decorative chip piles at the bottom of asset01.jpg
keep the action area centered vertically
File Suggestions
New page
src/pages/PokerChallengePage.jsx
New components
src/components/poker-challenge/PokerChallengeLayout.jsx
src/components/poker-challenge/ChallengeHeader.jsx
src/components/poker-challenge/QuestionPanel.jsx
src/components/poker-challenge/HandDisplay.jsx
src/components/poker-challenge/PlayingCard.jsx
src/components/poker-challenge/DecisionButtons.jsx
src/components/poker-challenge/ResultBanner.jsx
src/components/poker-challenge/ScoreRulesPanel.jsx
src/components/poker-challenge/BonusWheelPanel.jsx
Styles
either colocated CSS files or one:
src/components/poker-challenge/pokerChallenge.css
Route

Add a temporary route:

/poker-challenge

Hook it into the existing router so it can be tested directly.

Acceptance Criteria
/poker-challenge loads successfully
board background displays correctly
all created assets are imported without path errors
player hand and opponent backs are visible
question panel and yes/no controls render clearly
clicking yes/no updates banner and test points
progress bar visually reflects points / pointsRequired
bonus wheel area renders with wheel + pointer + spin button
page works on mobile and desktop without broken overlap
no backend required yet
Important Constraints
Do not build API integration in this taskcard
Do not build final GTO engine yet
Do not build real wheel spin yet
Do not wait for every remaining asset
Use placeholders where needed
If Asset Dimensions Cause Issues

If any asset has awkward whitespace:

wrap image in container
use object-fit: contain
crop with CSS where reasonable
do not manually edit asset files in this task unless absolutely necessary
Deliverable Back

When complete, report back with:

files created
files modified
route added
any asset sizing problems
screenshot of rendered page