1. Product Goal

Build a new section in the app called Poker Arcade with these 7 games:

Outs Calculator

Spot the Nuts

Chip Stack Builder

Card Memory

Swipe Poker Solitaire

Mini Blackjack

Reaction Timer

The experience must feel:

fast

polished

mobile-first

poker themed

simple enough to play instantly

Do not introduce real-money play, wagering, casino cash balances, or anything that could look like regulated gambling.

2. User Stories
As a player

I want quick games to play while waiting for a table or between hands so the app stays entertaining.

As a poker learner

I want some of the games to sharpen poker instincts without feeling like formal training.

As a returning user

I want scores, streaks, and best results saved so I have reasons to come back.

3. Scope for TC045

This taskcard includes:

new Arcade Hub screen

route + nav entry for Arcade

7 game screens/components

shared lightweight score/session system

backend persistence for high scores / best streaks / last played

seed/sample content for poker-adjacent quiz games

clean on-brand DCR styling

This taskcard does not include:

multiplayer

money wagering

cash prizes

global public leaderboards

push notifications

advanced physics engine beyond simple chip stack interaction

polished sound effects

achievements marketplace / rewards economy

4. UX Requirements
Core UX rules

Every game must:

launch in under 2 taps from Arcade Hub

work well on mobile portrait

be playable in short bursts (15 seconds to 2 minutes)

avoid long instructions

support fast replay

have a visible “Play Again” action at end of round

Theme

Use existing DCR Poker styling:

dark background

subtle gold/bronze highlights

felt / card-room tone

restrained visuals, not neon arcade

rounded panels and modern mobile card UI

5. Frontend Architecture

Create a new feature module:

src/features/arcade/

Recommended structure:

src/features/arcade/
  components/
    ArcadeGameCard.jsx
    ArcadeHeader.jsx
    ScorePanel.jsx
    GameResultModal.jsx
    InstructionSheet.jsx
  data/
    outsQuestions.js
    nutsQuestions.js
    memoryDecks.js
    blackjackUtils.js
    solitaireUtils.js
  hooks/
    useArcadeStats.js
    useGameSession.js
  pages/
    ArcadeHubPage.jsx
    OutsCalculatorPage.jsx
    SpotTheNutsPage.jsx
    ChipStackBuilderPage.jsx
    CardMemoryPage.jsx
    SwipePokerSolitairePage.jsx
    MiniBlackjackPage.jsx
    ReactionTimerPage.jsx
  utils/
    arcadeApi.js
    scoring.js
    cards.js
    deck.js
6. Routing

Add routes for:

/arcade
/arcade/outs
/arcade/nuts
/arcade/chip-stack
/arcade/memory
/arcade/solitaire
/arcade/blackjack
/arcade/reaction

Add Arcade to the main app navigation in a location that makes sense beside tools/training/utility sections.

7. Arcade Hub Page

Create ArcadeHubPage.jsx.

Purpose

This is the landing page for all mini games.

Layout

title: Poker Arcade

short subtitle like:
“Quick games for waiting time, warmups, and poker instincts.”

responsive mobile-first card grid

each card shows:

game icon

title

short description

best score / best streak if available

play button

Suggested descriptions

Outs Calculator — Count your draws fast.

Spot the Nuts — Find the unbeatable hand.

Chip Stack Builder — Stack as many chips as you can.

Card Memory — Match the deck pairs quickly.

Swipe Poker Solitaire — Arrange cards into stronger hands.

Mini Blackjack — Fast blackjack, no betting.

Reaction Timer — Test your dealer reflexes.

8. Shared Frontend Session Logic

Create a shared hook:

src/features/arcade/hooks/useGameSession.js

It should manage:

score

streak

bestLocalScore (optional local state before server sync)

round

status (idle | playing | ended)

startGame()

endGame()

resetGame()

incrementScore()

incrementStreak()

resetStreak()

This hook should be generic enough to reuse across all 7 games.

9. Backend Persistence

Add a backend table for per-user arcade stats.

New table: arcade_stats

Suggested columns:

id
user_id
game_id
high_score
best_streak
total_plays
last_score
last_played_at
created_at
updated_at
Constraints

unique composite key on (user_id, game_id)

Supported game_id values

outs

nuts

chip_stack

memory

solitaire

blackjack

reaction

10. Backend API Endpoints

Add backend routes under something like:

/api/arcade
Required endpoints
GET /api/arcade/stats

Returns all current user arcade stats.

GET /api/arcade/stats/:gameId

Returns stats for one game.

POST /api/arcade/submit

Payload:

{
  "gameId": "outs",
  "score": 8,
  "streak": 5
}

Behavior:

increments total_plays

updates last_score

updates last_played_at

updates high_score if current score is higher

updates best_streak if current streak is higher

Use authenticated user id from existing auth middleware/session pattern already in the app.

11. Frontend API Client

Create:

src/features/arcade/utils/arcadeApi.js

Functions:

getArcadeStats()

getArcadeGameStats(gameId)

submitArcadeResult(payload)

Use the app’s existing API wrapper/auth conventions.

12. Game Specs
Game 1 — Outs Calculator
Goal

Show a poker hand + board and ask the player how many outs they have.

MVP Flow

show hero hand

show board

ask: How many outs?

4 multiple-choice buttons

immediate feedback after selection

auto-advance or next button

Data source

Create outsQuestions.js with at least 30 sample questions.

Suggested shape:

[
  {
    id: "outs_001",
    hero: ["Ah", "Qh"],
    board: ["2h", "7h", "Ks"],
    prompt: "How many outs does Hero have?",
    options: [6, 9, 12, 15],
    correctAnswer: 9,
    explanation: "Hero has a flush draw with 9 hearts remaining."
  }
]
Scoring

+1 correct

streak increments on correct

streak resets on wrong

10-question session default

End of round

Show:

score

best streak

replay

return to Arcade

Game 2 — Spot the Nuts
Goal

Show a board and ask which option is the nuts.

MVP Flow

show board cards

show 4 hand/combo options

player taps best answer

Data source

Create nutsQuestions.js with at least 30 board spots.

Shape:

[
  {
    id: "nuts_001",
    board: ["Ah", "Kh", "Qd", "Jc", "2s"],
    prompt: "Which hand is the nuts?",
    options: ["Td9d", "Tc9c", "AsAc", "KcKd"],
    correctAnswer: "Tc9c",
    explanation: "Any T9 makes Broadway; suit is irrelevant here."
  }
]
Scoring

Same pattern as Outs.

Game 3 — Chip Stack Builder
Goal

A simple addictive dexterity game: stack chips vertically without letting the stack topple.

MVP Approach

Do not use a heavy physics engine initially.

Implement simple logic:

a chip moves horizontally over the stack area

user taps to drop chip

if chip lands within acceptable horizontal tolerance of previous chip, it stacks

if too far off, game ends

each successful stack = +1 score

movement speed gradually increases

UX

clean felt table background

chip drop area center screen

visible stack height count

“Tap to Drop” prompt before start

End condition

Chip misaligns beyond tolerance.

Score

Total successfully stacked chips.

Game 4 — Card Memory
Goal

Classic memory flip game with poker-themed cards.

MVP Flow

4x4 grid on mobile-friendly layout

tap card to flip

match pairs to clear board

timer starts on first move

Deck options

Use rank/suit-based pairs or poker-chip/card-icon pairs.

Score model

Use:

completion time

optionally track move count

For backend score, store a normalized score, for example:

inverse time score
or

just store number of matched pairs completed if you want simplicity

Recommended:

submit score = max(1, 1000 - elapsedSeconds * 10) for ranking

save real elapsed time separately later only if desired

For this taskcard, simple is fine.

Game 5 — Swipe Poker Solitaire
Goal

User rearranges or places cards to form the strongest 5-card poker hand possible.

MVP Simplification

Do not build full solitaire rules yet.

Instead:

deal 5 cards

allow drag-and-drop reordering or swipe placement into slots

after final arrangement, evaluate resulting hand

optionally let user discard/redraw once in later version, but not in this taskcard

Alternative even simpler MVP:

deal 7 cards

user chooses best 5

score based on resulting hand rank

This second option is recommended for TC045 because it is simpler and still addictive.

Recommended build for TC045

Use “Choose Best 5 from 7” format under the Swipe Poker Solitaire name for now.

Scoring

Assign hand rank points:

high card = 1

pair = 2

two pair = 3

trips = 4

straight = 5

flush = 6

full house = 7

quads = 8

straight flush = 9

royal flush = 10

Add small bonus for speed if desired.

Game 6 — Mini Blackjack
Goal

Fast no-money blackjack game.

Rules

single player vs dealer

player chooses only:

Hit

Stand

dealer auto-plays to 17

no splits

no doubling

no betting

no bankroll

Round flow

initial two cards each

one dealer upcard visible

player acts

result shown immediately

quick replay

Score

Use session score:

+1 win

0 push

loss ends streak

Session

Run as endless rounds until user exits, or use 5-round session.
For TC045, use 5-round session.

Game 7 — Reaction Timer
Goal

Fast reflex mini game.

Flow

user presses Start

random delay of 1–4 seconds

visual state changes (“TAP!”)

user taps as fast as possible

Guardrail

If user taps too early:

show “Too early”

round resets

Session

5 attempts

average reaction time shown at end

Score

For backend ranking:

convert reaction time into score, e.g.
score = max(0, 1000 - avgReactionMs)

Also show raw average ms to user.

13. Shared UI Components

Create reusable components:

ScorePanel.jsx

Show:

current score

streak

round count

timer if applicable

GameResultModal.jsx

Show:

game over / session complete

score

best streak

high score

buttons:

play again

back to arcade

InstructionSheet.jsx

Simple dismissible instructions panel on first open of each game.

Use localStorage to avoid showing instructions every time unless user taps Help.

14. Card / Deck Utilities

Create generic card helpers in:

src/features/arcade/utils/cards.js
src/features/arcade/utils/deck.js

Include:

deck generation

shuffling

rank parsing

suit parsing

hand display formatting

poker hand evaluator helper for solitaire and nuts data checks if needed

If you already have card helpers elsewhere in the app, reuse them instead of duplicating.

15. Stats Fetching Behavior

On Arcade Hub load:

fetch /api/arcade/stats

display best scores on all game cards

On game completion:

submit score to backend

refresh local displayed stats

no need to fully reload hub if staying on game page

16. Suggested Database / Backend File Additions

Adjust to current backend structure, but likely something like:

server/src/routes/arcadeRoutes.js
server/src/controllers/arcadeController.js
server/src/services/arcadeService.js
server/src/models/ArcadeStat.js

If project uses raw SQL instead of model definitions, stay consistent with current architecture.

17. Acceptance Criteria

TC045 is complete when:

User can navigate to Arcade from app nav.

Arcade Hub displays all 7 games.

Each game opens and is playable on mobile layout.

Each game has:

instructions

scoring

end-state modal

replay option

Backend persists stats per user per game.

Hub shows best score / streak data from backend.

No game includes real-money mechanics.

Styling matches DCR Poker theme and feels integrated with the app.

No game requires audio or landscape orientation.

No crashes when user leaves/re-enters a game.

18. Recommended Build Order

Implement in this order:

Phase A

Arcade Hub

shared score/session hook

backend stats table + submit API

Outs Calculator

Spot the Nuts

Phase B

Reaction Timer

Mini Blackjack

Card Memory

Phase C

Chip Stack Builder

Swipe Poker Solitaire

This order gets the easiest useful games in first, then the more tactile games.

19. Notes for Developer

Keep all game state local to each page/component.

Persist only end-of-session aggregate results, not every tap.

Favor simple polished loops over complex rule completeness.

Mobile responsiveness matters more than desktop complexity.

Avoid adding large dependencies unless necessary.

For Chip Stack Builder, prefer CSS transforms + lightweight JS motion before considering physics libs.

For Solitaire naming, it is acceptable in TC045 to ship an MVP variant under that label and refine later.

20. Deliverable Summary

At the end of TC045, the app should have a new Poker Arcade feature with:

hub page

7 playable mini games

saved stats

replayable sessions

on-brand DCR integration

enough variety to be habit-forming without distracting from core poker utility

21. Handoff Prompt for VS Code / Implementer

Use this exact handoff:

TC045 — Build a new Poker Arcade module in the DCR Poker app.

Add a new Arcade section with routes for:
- /arcade
- /arcade/outs
- /arcade/nuts
- /arcade/chip-stack
- /arcade/memory
- /arcade/solitaire
- /arcade/blackjack
- /arcade/reaction

Create a mobile-first Arcade hub page showing 7 game cards:
Outs Calculator, Spot the Nuts, Chip Stack Builder, Card Memory, Swipe Poker Solitaire, Mini Blackjack, Reaction Timer.

Implement a shared frontend game-session hook for score, streak, round/session state, and replay handling.

Create backend persistence for arcade stats with a table keyed by user_id + game_id including:
high_score, best_streak, total_plays, last_score, last_played_at.

Add API endpoints:
- GET /api/arcade/stats
- GET /api/arcade/stats/:gameId
- POST /api/arcade/submit

Implement the 7 games as simple polished MVP versions:
1. Outs Calculator — 10-question multiple choice session from sample question data
2. Spot the Nuts — 10-question multiple choice session from sample board/answer data
3. Chip Stack Builder — tap-to-drop chip stacking with tolerance-based collision/end state
4. Card Memory — mobile-friendly flip-and-match game
5. Swipe Poker Solitaire — MVP version using choose-best-5-from-7 scoring
6. Mini Blackjack — no betting, 5-round session, hit/stand only
7. Reaction Timer — 5-attempt average reaction score game

Add reusable UI components for score panel, instructions, and end-of-game modal.

Keep styling consistent with the DCR Poker theme: dark, card-room feel, subtle gold accents, no flashy arcade visuals.

Do not add real-money mechanics, wagering, or multiplayer.