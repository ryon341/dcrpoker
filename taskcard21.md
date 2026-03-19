Taskcard 021 — Preflop Chart System (Configurable + Viewable)
Objective

Introduce a Preflop Decision Chart system that allows users to:

configure a scenario (players, position, stack, etc.)

view a corresponding recommended action chart

This becomes one of the core “daily-use” tools in the app and aligns directly with your earlier requirement.

Why this card now

You now have:

bankroll tracking (TC019)

tools foundation (TC020)

Next step:
→ add skill improvement + decision support

Preflop charts are:

high engagement

easy to revisit

strong differentiator vs generic poker apps

Product concept (keep it simple for MVP)

We are NOT building a full GTO solver.

We are building:

A structured, configurable chart viewer using predefined ranges

User flow

User opens:
→ Tools → Preflop Charts

User selects configuration:

number of players

position

stack depth

game type

App displays:

a visual hand matrix (grid)

each hand labeled:

fold

call

raise

3-bet (optional if included)

Configuration inputs (MVP)

Keep this tight — do NOT overbuild.

Required inputs:

Game Type

Cash

Tournament

Number of Players

6-max

9-max (default)

Position

UTG

MP

CO

BTN

SB

BB (optional for MVP, can defer)

Stack Depth

20bb

40bb

100bb (default)

Output
1) Hand Matrix (Core UI)

Standard 13x13 grid:

pairs (AA → 22)

suited

offsuit

Each cell color-coded:

Fold (gray)

Call (blue)

Raise (green)

Optional:

3-bet (red)

Mix (striped or dual color)

2) Summary strip (above chart)

Show:

position

players

stack depth

game type

3) Optional text guidance (light)

Example:

“From CO at 100bb, play a moderately wide opening range focusing on suited connectors and broadways.”

Keep short — do not over-explain.

Data strategy (IMPORTANT)

Do NOT attempt dynamic solving.

Use static chart datasets

Create structured chart definitions like:

{
  gameType: 'cash',
  players: '9max',
  position: 'CO',
  stack: '100bb',
  ranges: {
    'AA': 'raise',
    'AKs': 'raise',
    'AJo': 'fold',
    ...
  }
}
Storage location

Frontend is acceptable for MVP:

client/src/lib/preflopCharts.js

Or JSON:

client/src/data/preflopCharts.json

Coverage (MVP scope)

Do NOT try to cover everything.

Start with:

9-max

100bb

positions:

UTG

MP

CO

BTN

If time allows:

add 6-max variant

You can expand later.

UI Components

Suggested structure:

PreflopChartsPage.jsx

ChartConfigurator.jsx

HandMatrix.jsx

ChartLegend.jsx

Hand matrix rendering

Grid structure:

rows = A → 2

columns = A → 2

Cell labeling:

AA

AKs

AKo

Color system

Define constants:

const ACTION_COLORS = {
  fold: 'gray',
  call: 'blue',
  raise: 'green',
  threebet: 'red'
}

Keep consistent across app.

Mobile-first requirement

This is critical.

Solutions:

horizontal scroll grid OR

slightly compressed grid with tap-to-zoom

Must be usable on phone.

Presets

Add quick-select buttons:

“Standard Cash 100bb”

“Tournament 40bb”

“Short Stack 20bb”

These just prefill configuration.

Access / billing

Two options (choose now):

Option A (recommended)

Basic charts → FREE

Advanced charts (later) → paid

For TC021:

→ Keep everything FREE

We will gate expanded ranges later.

Backend

Not required for MVP.

Everything can be:

static data

frontend rendering

Acceptance criteria

Taskcard is complete when:

User can open:
→ Tools → Preflop Charts

User can:

select position

select players (6-max / 9-max)

select stack depth

select game type

App renders:

correct 13x13 hand matrix

correct action per hand

Chart updates dynamically on config change

UI works on mobile

No backend required

Nice-to-have (only if easy)

tap a hand → show explanation

toggle “simplified vs advanced”

highlight “top % of hands”

Do NOT delay card for this.

Out of scope

Do NOT include:

solver integration

real-time EV calculations

opponent modeling

saving custom ranges

sharing charts

training quizzes (comes later)

Suggested file structure
client/src/pages/tools/PreflopChartsPage.jsx
client/src/components/tools/ChartConfigurator.jsx
client/src/components/tools/HandMatrix.jsx
client/src/components/tools/ChartLegend.jsx
client/src/lib/preflopCharts.js
Implementation guidance

build matrix renderer first

then hook to static dataset

then add configurator controls

then polish UI

Handoff prompt for your coder
TASKCARD 021 — Preflop Chart System (Configurable + Viewable)

Objective:
Build a preflop poker chart tool that allows users to configure a scenario and view a hand matrix showing recommended actions.

Requirements:

Inputs:
- Game Type: Cash / Tournament
- Players: 6-max / 9-max
- Position: UTG, MP, CO, BTN
- Stack Depth: 20bb, 40bb, 100bb

Output:
- 13x13 hand matrix (AA → 22, suited, offsuit)
- Each hand labeled:
  - fold
  - call
  - raise
  - (optional) 3-bet

UI:
- mobile-first
- grid must be readable on phone
- include legend for colors
- include summary header of current config

Data:
- use static dataset (no solver)
- store in frontend (lib or JSON)
- only support:
  - 9-max
  - 100bb
  - positions UTG, MP, CO, BTN (expand later if time allows)

Behavior:
- updating config updates chart instantly
- no backend required

Acceptance criteria:
- charts render correctly
- config controls work
- mobile layout works
- no paid gating

Out of scope:
- solver
- EV math
- saving user ranges
- training mode
- sharing

Return:
1. files created
2. files modified
3. structure of chart dataset
4. assumptions made