Taskcard 041 — Spot Trainer
Objective

Build a Spot Trainer that presents realistic poker situations and asks the user to choose the best action. This should go beyond the existing preflop trainer by adding context: stack depth, prior action, and spot type.

This is a training feature, not a solver. Start with a rule-based system and a structured spot library.

Why this card now

You already have:

preflop charts

a basic preflop trainer

tools/training surfaces

The next useful training layer is:

context-based decision practice

This makes the app feel more like a coach and less like a chart viewer.

Product definition

A Spot Trainer question should include:

game type

table format

stack depth

position

prior action

hero hand

answer choices

correct action

brief explanation

Example:

9-max cash, 100bb
CO opens to 2.5bb
You are BTN with AJs
What is the best action?

Choices:

Fold

Call

3-bet

Scope — MVP
Supported spot types for MVP

Start with preflop only, but richer than the current trainer.

1) Unopened pot spots

Examples:

UTG first in

CO first in

BTN first in

SB first in

2) Versus open spots

Examples:

BTN vs CO open

BB vs BTN open

SB vs BTN open

BB vs SB open

3) Short-stack shove/fold spots

Examples:

10bb BTN unopened

12bb SB vs folded-to-you

8bb CO unopened

Do not do postflop for MVP.

Key difference from current preflop trainer

The current preflop trainer is likely:

chart practice

simple hand/action validation

little scenario framing

This Spot Trainer must add:

prior action context

richer scenario text

spot categories

explanation tied to the scenario

support for different answer sets depending on spot

Data model approach
Use a structured spot library

Do not hardcode UI questions inline.

Create a reusable dataset, for example:

type Spot = {
  id: string;
  category: 'unopened' | 'vs_open' | 'short_stack';
  gameType: 'cash' | 'tournament';
  tableFormat: '6max' | '9max';
  stackDepthBb: number;
  heroPosition: string;
  villainPosition?: string;
  priorAction: string;
  heroHand: string;
  choices: string[];
  correctAction: string;
  explanation: string;
};
File suggestion

Create:

src/lib/spotTrainerData.ts

and optionally:

src/lib/spotTrainerEngine.ts
Question generation
MVP generation rules

Randomly choose a spot from the dataset, optionally filtered by:

category

game type

table format

difficulty

Initial filter options

User should be able to select:

All Spots

Unopened

Vs Open

Short Stack

Optional:

Cash / Tournament

UI requirements
New route / page

Suggested route:

/tools/training/spot-trainer

or within your current training section equivalent.

Page layout

The page should include:

1) Header

title: Spot Trainer

short description

2) Filter bar

category selector

optional game type selector

3) Scenario card

Show:

game type / format

stack depth

prior action

hero position

hero hand

4) Answer buttons

Choices depend on the spot:

unopened: Fold / Raise

vs open: Fold / Call / 3-bet

short stack: Fold / Shove

5) Feedback card

After answering:

Correct / Incorrect

correct action

explanation

6) Session stats

Show:

current score

streak

questions answered

7) Next spot button
Explanation behavior

Each question must include a short explanation.

Examples:

Unopened

Raising is correct because AJo is inside a standard CO opening range at 100bb.

Vs open

3-betting is preferred because AQs performs strongly as a value/semi-value re-raise versus a late-position open.

Short stack

Shoving is correct because stack depth is too shallow for a standard raise/fold line.

Keep explanations short and practical.

Difficulty system (light MVP)

Add basic difficulty tags to spots:

easy

medium

hard

Use this for filtering later, but keep UI optional for MVP.

Suggested field:

difficulty: 'easy' | 'medium' | 'hard'
Session behavior

Track in component/local state:

total answered

total correct

current streak

best streak (optional)

recent missed spots (optional if easy)

For MVP, session-only state is enough. No backend persistence required.

Optional missed-spot review

Nice-to-have only if easy:

keep a local list of missed spots

allow “Retry Missed Spots”

Do not delay MVP for this.

Relationship to existing preflop trainer

Do not build a duplicate standalone chart quiz.

This feature should:

reuse any existing hand/label generation utilities if helpful

coexist with the current trainer

provide a distinct, more contextual experience

Suggested file additions

Adjust to your repo, but likely:

src/lib/spotTrainerData.ts
src/lib/spotTrainerEngine.ts
src/components/training/SpotScenarioCard.tsx
src/components/training/SpotAnswerButtons.tsx
src/components/training/SpotFeedbackCard.tsx
app/(protected)/tools/training/spot-trainer.tsx

If your project structure differs, adapt accordingly.

Engine behavior

Create helpers to:

1) getRandomSpot(filters)

Returns a filtered random spot

2) validateSpotAnswer(spot, answer)

Returns:

correct boolean

correct action

explanation

3) getChoicesForSpot(spot)

Ensures UI shows only relevant answers

Content seeding requirement

Seed the MVP with a useful starter library.

Minimum recommended seed size

At least:

20 unopened spots

20 vs-open spots

15 short-stack spots

Total target:
55+ spots minimum

This is enough to feel real without overbuilding.

Acceptance criteria

Taskcard is complete when:

Spot Trainer page exists and is reachable from training.

Trainer presents contextual scenarios, not just bare hand/action prompts.

User can answer with context-appropriate choices.

Answer is checked against the structured spot dataset.

Feedback includes the correct action and explanation.

Session score and streak are tracked locally.

User can load the next spot repeatedly.

Filters work for at least category.

Feature is visually consistent with the current training UI.

Out of scope

Do not include in MVP:

postflop spots

solver integration

backend persistence

user account history

advanced range visualizations

AI-generated explanations

This is a curated, rule-based trainer.

Handoff prompt for VS Code
TASKCARD 041 — Spot Trainer

Objective:
Build a Spot Trainer that presents realistic preflop poker scenarios with context and asks the user to choose the best action.

This should go beyond the current preflop trainer by adding:
- prior action
- stack depth
- spot category
- richer scenario text
- short explanation

MVP spot categories:
1) unopened pot
2) versus open
3) short-stack shove/fold

Requirements:
- create a structured spot dataset (do not hardcode questions inline)
- each spot should include:
  - id
  - category
  - gameType
  - tableFormat
  - stackDepthBb
  - heroPosition
  - villainPosition (if needed)
  - priorAction
  - heroHand
  - choices
  - correctAction
  - explanation
  - optional difficulty

UI:
- training page or subpage route for Spot Trainer
- filter by category at minimum
- scenario card
- answer buttons
- feedback card
- score / streak / questions answered
- next spot button

Behavior:
- randomly select a spot from filtered dataset
- validate answer
- show correct/incorrect and explanation
- local session state only

Seed content:
- at least 55 total spots:
  - 20 unopened
  - 20 vs-open
  - 15 short-stack

Acceptance:
- trainer works repeatedly
- contextual scenarios are shown
- answers validate correctly
- score and streak update
- UI matches existing training system

Return:
1. files created
2. files modified
3. dataset structure used
4. assumptions