Taskcard 043 — EV Analyzer
Objective

Build an EV Analyzer that helps users evaluate whether a poker decision was profitable based on pot odds, equity, and call size.

This should be:

practical

fast

understandable

useful with recorded hands

This is not a solver and not full GTO. It is a decision-support tool.

Product Definition

The EV Analyzer should answer questions like:

Was this call profitable?

What equity did I need?

If I had 30% equity here, should I call?

If I have a flush draw and X outs, what does the math say?

MVP Scope
Must have

pot odds calculator

required equity calculation

EV of call calculation

quick recommendation

optional outs-to-equity helper

simple villain range presets (optional lightweight version)

Not included yet

full solver

full board evaluator

Monte Carlo simulation

hand-vs-range engine

street-by-street GTO advice

Core Calculations
1) Required Equity

Formula:

requiredEquity = callAmount / (potSize + callAmount)

Example:

pot = 100

call = 50

required equity = 50 / 150 = 33.3%

2) EV of Call

Formula:

evCall = (equity * totalPotAfterCall) - ((1 - equity) * callAmount)

Where:

equity = decimal (e.g. 0.35)

totalPotAfterCall = potSize + callAmount

3) Pot Odds Display

Show as:

percentage

optional ratio

4) Outs Helper (optional MVP-plus)

If user enters number of outs:

turn approximation = outs × 2

turn+river approximation = outs × 4

Optional exact formulas:

turn only: outs / 47

river by next two cards: 1 - ((47 - outs)/47)*((46 - outs)/46)

User Inputs
Mode A — Direct Equity Mode (primary)

User enters:

pot size

amount to call

estimated equity %

Output:

required equity

EV of call

recommendation

Mode B — Outs Mode

User enters:

pot size

amount to call

outs

one-card or two-card draw

Output:

estimated equity

required equity

EV of call

recommendation

Mode C — Quick Draw Presets (nice-to-have)

Buttons for:

flush draw

open-ended straight draw

gutshot

combo draw

two overs

Selecting one pre-fills outs.

Recommendation Logic

Provide a simple recommendation:

If EV > 0

Profitable call

If EV near 0

Marginal call

If EV < 0

Fold unless exploitative reasons justify continuing

Keep language practical, not absolute.

UI
New route
/tools/ev-analyzer
Page layout
1) Header

title: EV Analyzer

short description

2) Mode switch

Direct Equity

Outs Mode

3) Input card

Fields:

pot size

call amount

equity % OR outs

4) Results card

Show:

pot odds

required equity

estimated equity

EV of call

recommendation

5) Quick helper card

Optional:

quick draw buttons

formula explainer

Integration with Hand Recorder

This is important.

From Hand Recorder later, user should be able to:

open a recorded hand

tap “Analyze EV”

prefill pot/call/equity fields where available

For this taskcard, prepare the component/API shape so this is easy later, even if not fully wired yet.

Backend vs Frontend
Preferred MVP

All calculation logic can live in the frontend.

Suggested utility file:

src/lib/evAnalyzer.ts

No backend required unless your architecture strongly prefers shared logic.

Suggested utility functions
calculateRequiredEquity(potSize: number, callAmount: number): number
calculateEvCall(potSize: number, callAmount: number, equityPct: number): number
estimateEquityFromOuts(outs: number, mode: 'turn' | 'turn_river'): number
getEvRecommendation(ev: number): string
Example calculations
Example 1

pot = 100

call = 50

equity = 40%

Outputs:

required equity = 33.3%

EV positive

recommendation = profitable call

Example 2

pot = 80

call = 60

equity = 25%

Outputs:

required equity = 42.9%

EV negative

recommendation = fold unless exploitative reason

Validation rules

pot size > 0

call amount > 0

equity between 0 and 100

outs between 1 and 20 (or allow broader if you prefer)

Nice-to-have

Only if easy:

show break-even line visually

color result:

green positive

yellow marginal

red negative

copy analysis summary

“common draw” quick buttons

Out of scope

Do not include:

full board parsing

combo counting

villain exact ranges

solver-level analysis

AI explanation engine

persistent analysis history

Suggested file structure
src/pages/tools/EvAnalyzerPage.tsx
src/components/ev/EvInputCard.tsx
src/components/ev/EvResultsCard.tsx
src/components/ev/EvModeToggle.tsx
src/lib/evAnalyzer.ts

Adapt to your app structure if needed.

Acceptance Criteria

Taskcard is complete when:

EV Analyzer page exists and is reachable.

User can calculate using direct equity mode.

User can calculate using outs mode.

Required equity is displayed correctly.

EV of call is displayed correctly.

Recommendation text updates based on result.

UI is mobile-friendly and fast.

Tool is visually consistent with current tools/training UI.

Handoff prompt for VS Code
TASKCARD 043 — EV Analyzer

Objective:
Build an EV Analyzer tool that helps users determine whether a call is profitable based on pot size, call size, and equity.

MVP modes:
1) Direct Equity Mode
2) Outs Mode

Inputs:
- pot size
- amount to call
- equity % OR outs
- one-card or two-card draw mode in outs mode

Outputs:
- pot odds
- required equity
- estimated equity
- EV of call
- recommendation

Core formulas:
- requiredEquity = callAmount / (potSize + callAmount)
- evCall = (equity * (potSize + callAmount)) - ((1 - equity) * callAmount)

Optional outs helper:
- turn = outs * 2
- turn+river = outs * 4
or exact formulas if easy

Requirements:
- page route /tools/ev-analyzer
- clean input card
- results card
- mode toggle
- mobile-friendly

No backend required unless strongly preferred.

Acceptance:
- calculations correct
- recommendation updates correctly
- works quickly on mobile
- consistent with existing app UI

Return:
1. files created
2. files modified
3. utility functions added
4. assumptions
Recommended next step after TC043

After this, the strongest follow-up is: