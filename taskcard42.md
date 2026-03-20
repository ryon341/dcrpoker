Taskcard 042 — Hand Recorder
Objective

Build a Hand Recorder that allows users to quickly log poker hands during or after play, tag them, and review them later.

This is a core retention feature. It feeds future tools (Spot Trainer, EV Analyzer, Leak Analyzer).

Product Definition

Users should be able to:

1) Record a hand in <30 seconds

stake

game type

position

hand

action summary

result

optional notes

2) Tag the hand

Examples:

punt

cooler

bluff

hero call

bad fold

tough spot

3) View and filter recorded hands

recent hands

by stake

by tag

by date

MVP Scope
Must have

create hand

edit hand

delete hand

list hands

filter hands

basic tagging

notes

Not included (yet)

full hand history parsing

solver analysis

EV calculation

sharing

AI commentary

Data Model
Table: hand_history
id (uuid or int)
user_id
created_at
updated_at

game_type        -- 'cash' | 'tournament'
stakes           -- '1/2', '2/5', etc.
table_format     -- '6max' | '9max'
position         -- 'UTG', 'CO', 'BTN', etc.

hero_hand        -- 'AsKs'
stack_depth_bb   -- number (optional but useful)

preflop_action   -- text
postflop_action  -- text (optional)

result_amount    -- numeric (+/-)
result_type      -- 'win' | 'loss' | 'chop'

tags             -- JSON array or separate table
notes            -- text
Tag options (MVP static list)
[
  'punt',
  'cooler',
  'bad beat',
  'hero call',
  'bluff',
  'bad fold',
  'tough spot',
  'misplayed',
  'standard',
  'review later'
]
Backend
Routes
POST /hands

Create a new hand

GET /hands

List hands (with filters)

Query params:

tag

stakes

game_type

limit

offset

GET /hands/:id

Get single hand

PUT /hands/:id

Update hand

DELETE /hands/:id

Delete hand

Example payload
{
  "game_type": "cash",
  "stakes": "1/2",
  "table_format": "9max",
  "position": "BTN",
  "hero_hand": "AsKs",
  "stack_depth_bb": 100,
  "preflop_action": "CO opens 3bb, I 3bet to 10bb, CO calls",
  "postflop_action": "Flop K72r, bet 12bb, call; turn 9, jam, call",
  "result_amount": 250,
  "result_type": "win",
  "tags": ["standard"],
  "notes": "Pretty standard value line"
}
Frontend
New route
/tools/hand-recorder
UI Structure
1) Hand List Page

Show:

date

stakes

position

hand

result (+/- color coded)

tags

Actions:

view

edit

delete

add new hand

2) Add / Edit Hand Form

Fields:

Basic

game type (dropdown)

stakes (input or dropdown)

table format

position

hero hand (text input)

Stack

stack depth (bb)

Action

preflop (textarea)

postflop (textarea)

Result

win/loss toggle

amount

Tags

multi-select checkboxes

Notes

textarea

3) Hand Detail View

Display:

full breakdown

formatted actions

tags

notes

UX Requirements
Fast entry (important)

minimal required fields

no complex validation blocking input

mobile-friendly

Defaults

last used stakes

last used game type

Visual cues

green = win

red = loss

Filtering UI

Allow filtering by:

tag

stakes

game type

Optional:

date range

Storage approach
MVP option

Store tags as JSON array in DB

Later upgrade

Separate hand_tags table for analytics

Integration opportunities (future)

feed hands into Spot Trainer

analyze leaks

EV review

“study your mistakes” mode

Suggested file structure

Backend:

server/src/routes/hands.js
server/src/controllers/handsController.js
server/src/services/handsService.js

Frontend:

src/pages/tools/HandRecorderPage.tsx
src/components/hands/HandForm.tsx
src/components/hands/HandList.tsx
src/components/hands/HandCard.tsx
src/components/hands/HandDetail.tsx
Validation rules (light)

hero_hand required

position required

game_type required

Everything else optional for MVP

Acceptance Criteria

Taskcard is complete when:

User can create a hand

Hand persists in database

User can view list of hands

User can edit and delete hands

Tags can be added and displayed

Filtering works (at least by tag or stakes)

UI works on mobile

Entry is fast and not overly strict

Handoff prompt for VS Code
TASKCARD 042 — Hand Recorder

Objective:
Build a Hand Recorder that allows users to log poker hands, tag them, and review them later.

Requirements:

Backend:
- create table hand_history
- fields:
  user_id, game_type, stakes, table_format, position, hero_hand,
  stack_depth_bb, preflop_action, postflop_action,
  result_amount, result_type, tags (JSON), notes
- endpoints:
  POST /hands
  GET /hands (with filters)
  GET /hands/:id
  PUT /hands/:id
  DELETE /hands/:id

Frontend:
- page /tools/hand-recorder
- hand list view
- add/edit form
- detail view

Features:
- tag selection (multi-select)
- filter by tag/stakes/game_type
- color-coded results (green/red)
- fast mobile-friendly input

Validation:
- require hero_hand, position, game_type
- everything else optional

Seed:
- static tag list

Acceptance:
- full CRUD works
- filtering works
- UI consistent with app
- fast entry experience

Return:
1. files created
2. files modified
3. DB schema
4. assumptions