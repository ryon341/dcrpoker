Taskcard 044 — Hand Study Flow (Hand Recorder → EV Analyzer → Spot Trainer)
Objective

Connect the new training and review tools into a single study workflow so users can:

record a hand

analyze the EV of a decision

generate a related training spot

mark the hand for later review

This turns separate tools into a real learning loop.

Why this card now

You now have:

Spot Trainer

Hand Recorder

EV Analyzer

Individually, they are useful.

Together, they become:

record → review → train

That is much stronger for retention and perceived value.

Product Definition

From a recorded hand, the user should be able to:

A. Analyze EV

Open the EV Analyzer with some fields prefilled from the hand.

B. Train the spot

Open Spot Trainer with a related spot or at least preselected category/context.

C. Save for review

Mark the hand as:

review later

studied

leak candidate

MVP Scope
Must have

“Analyze EV” action on recorded hands

“Train This Spot” action on recorded hands

review status/tag support

basic prefill between tools

simple study-oriented hand detail UI improvements

Not required yet

automatic solver breakdown

fully auto-generated spot from full hand text

persistent study queue algorithm

AI coaching comments

Core Workflow
1) Hand Recorder

User records a hand.

Example stored fields:

stakes

game type

position

hero hand

stack depth

preflop action

postflop action

result

notes

tags

2) Hand Detail Page

On hand detail, add action buttons:

Analyze EV

Train This Spot

Mark for Review

Optional:

Mark Studied

3) EV Analyzer Prefill

When user taps Analyze EV:

navigate to EV Analyzer

prefill whatever is available from the hand

Likely prefillable fields:

pot size (if you have it, otherwise blank)

amount to call (if available, otherwise blank)

notes/context

hero hand

stack depth

stakes

At minimum for MVP:

pass the hand ID and context

display “Analyzing hand: [hero hand] [stakes]”

If numeric fields are not present in the hand record yet, user can fill them manually.

4) Spot Trainer Prefill

When user taps Train This Spot:

navigate to Spot Trainer

pass prefill hints such as:

category

game type

position

stack depth

hero hand

For MVP:

if the hand is clearly preflop and unopened, route to relevant spot type

if it includes preflop raise/call info, map to vs_open category

if stack depth is short, map to short_stack

This can be heuristic, not perfect.

Hand Review State

Add hand review status so users can organize study.

Add one or more of these fields

Recommended:

review_status: 'none' | 'review_later' | 'studied'

Optional:

study_priority: 'low' | 'medium' | 'high'

For MVP, review_status is enough.

Backend Changes
Table update

Extend hand_history with:

review_status VARCHAR(20) DEFAULT 'none'

Optional later:

study_priority VARCHAR(20)
last_reviewed_at DATETIME NULL
API changes

Update hand endpoints so they:

return review_status

accept review_status on create/update

You do not need a new endpoint if existing PUT /hands/:id can update it.

Optional convenience endpoint:

PATCH /hands/:id/review-status

But not required if existing update route is easy.

Frontend Changes
1) Hand List UI

Show a visible review badge for each hand:

Review Later

Studied

Allow filtering by:

all

review later

studied

2) Hand Detail UI

Add action section:

Buttons

Analyze EV

Train This Spot

Mark for Review / Remove Review Mark

Mark Studied

Layout should fit your existing card/button system.

3) EV Analyzer route support

Allow EV Analyzer to accept route/query/navigation params such as:

handId

heroHand

position

stackDepthBb

gameType

optional notes/context

Show a small context card at top:

Studying hand: BTN, A♠K♠, 100bb, 1/2 cash

4) Spot Trainer route support

Allow Spot Trainer to accept params such as:

prefillCategory

heroHand

position

stackDepthBb

gameType

For MVP:

use params to bias first spot selection

do not require exact one-to-one hand reconstruction

Heuristic Mapping Rules for Spot Trainer

Create a helper like:

getSpotPrefillFromHand(hand)

Suggested rules:

If stackDepthBb <= 15

→ category = short_stack

Else if preflop_action contains words like:

open

raises

calls

3bet

and hero is responding to another opener
→ category = vs_open

Else

→ category = unopened

This only needs to be “good enough” for MVP.

Suggested File Changes

Likely additions/updates:

src/lib/handStudyHelpers.ts
src/pages/tools/HandDetailPage.tsx
src/pages/tools/EvAnalyzerPage.tsx
src/pages/tools/SpotTrainerPage.tsx
src/components/hands/HandStudyActions.tsx

And backend updates to hand schema/controller/service.

Adapt to your actual structure.

UX Requirements
The flow should feel smooth

From a recorded hand, the user should be able to get to study actions in one tap.

Don’t block on missing data

If the hand record doesn’t contain enough numeric detail for full EV analysis:

still open EV Analyzer

prefill what you can

let user finish the rest

Keep explanations simple

Add a small note where useful:

We’ve prefilled what we can from your recorded hand. Add pot and call sizes if needed.

Optional Nice-to-Have

Only if easy:

1) Study Queue View

A filtered list of:

all hands marked review_later

2) “Continue Studying” card

On training/tools home:

show recent hands marked for review

Do not delay MVP for this.

Acceptance Criteria

Taskcard is complete when:

Recorded hands display study-related actions.

User can open EV Analyzer from a hand.

EV Analyzer receives and shows hand context.

User can open Spot Trainer from a hand.

Spot Trainer receives and uses prefill hints.

Hands can be marked as review_later or studied.

Hand list can display/filter review status.

UI remains consistent with current app design.

Out of scope

Do not include:

full automatic hand parsing into solver inputs

advanced postflop scenario reconstruction

persistent study recommendations engine

AI coaching summaries

This card is about wiring the loop together, not perfect analysis.

Handoff prompt for VS Code
TASKCARD 044 — Hand Study Flow (Hand Recorder → EV Analyzer → Spot Trainer)

Objective:
Connect Hand Recorder, EV Analyzer, and Spot Trainer into a study workflow.

Requirements:

1) Add study actions to recorded hands
On hand detail page, add:
- Analyze EV
- Train This Spot
- Mark for Review
- Mark Studied

2) Add hand review state
Extend hand model with:
- review_status: 'none' | 'review_later' | 'studied'

Update backend CRUD so review_status is stored and returned.

3) EV Analyzer integration
Allow EV Analyzer to receive hand context via navigation params:
- handId
- heroHand
- position
- stackDepthBb
- gameType
- stakes
- notes/context

Show a context card at the top of EV Analyzer when launched from a hand.

4) Spot Trainer integration
Allow Spot Trainer to receive prefill hints:
- prefillCategory
- heroHand
- position
- stackDepthBb
- gameType

Use simple heuristics to map recorded hands to spot categories:
- stackDepth <= 15bb => short_stack
- response to open/raise => vs_open
- otherwise => unopened

5) Hand list / filtering
Show review status badges in hand list.
Allow filtering by:
- all
- review later
- studied

Behavior:
- do not block if hand lacks full numeric EV data
- prefill what is available
- allow user to complete the rest manually

Acceptance:
- hand detail shows study actions
- EV Analyzer opens with hand context
- Spot Trainer opens with prefill hints
- review status persists
- hand list filtering works

Return:
1. files created
2. files modified
3. schema changes
4. heuristic rules used
5. assumptions