Taskcard 020 — Poker Tools Hub + Chip Calculator (MVP)
Objective

Add the first general-purpose player utility area to the DCR Poker app by creating a Tools section and shipping the first tool: a Poker Chip Calculator. This gives the app immediate practical value even when a user is not actively managing a game invite.

The calculator should help a host estimate how many chips of each denomination are needed to run either:

a cash game, or

a tournament.

This is an MVP. Keep the UI mobile-first, practical, and fast.

Why this card now

Core platform features are already in place:

auth

contacts / prospects

invite-only games

messaging tiers

PayPal billing / gating

bankroll analytics

The next logical layer is sticky utility: features users return to frequently. The chip calculator is one of the most useful and simplest poker tools to ship first.

Product requirements
1) Add a new “Tools” area

Create a new section in the app navigation called Tools.

Initial tools list:

Chip Calculator

Placeholder cards for future tools:

Preflop Charts

Odds / Outs Calculator

Tournament Clock

Deal Split / Chop Calculator

Only Chip Calculator needs to function in this taskcard. The others can display “Coming soon”.

2) Chip Calculator modes

The calculator must support two modes:

A. Cash Game

Inputs:

number of players

average buy-in

expected number of rebuys

chip denominations available

preferred chips per player target

optional buffer / reserve percentage

Outputs:

estimated total bank needed

recommended quantity of each chip denomination

estimated total chip count

suggested starting stack composition per player

reserve chips recommended for rebuys

B. Tournament

Inputs:

number of players

starting stack per player

optional re-entry count

chip denominations available

preferred total chips per player target

Outputs:

total chips needed

recommended breakdown by denomination

recommended starting stack per player

estimated grand total chip count across set

3) Sensible presets

Provide quick presets so users do not have to build everything manually.

For example:

Cash Game — Low Stakes

Cash Game — Standard Home Game

Tournament — Small Home Tournament

Tournament — Deep Stack

Each preset should prefill denominations and reasonable defaults.

Do not over-engineer the preset logic. Use static preset objects.

4) Results philosophy

The calculator is an estimator, not a gaming authority. Results should be:

practical

readable

easy to buy against

Prioritize outputs that help a host answer:

“How many chips do I need?”

“How many of each denomination should I buy?”

“Will this comfortably cover rebuys?”

Add a small disclaimer:

“Estimates are intended for home-game planning and may be adjusted based on your blind structure, rebuy habits, and preferred stack depth.”

5) Access / billing

Chip Calculator should be available to all logged-in users, including free tier users.

Do not gate this tool behind paid plans.

Technical scope
Frontend

Add:

Tools page / route

Tool cards

Chip Calculator form

Results panel

preset selector

mode toggle (cash / tournament)

Use existing app design system and mobile-first layout.

Recommended route:

/tools

/tools/chip-calculator

If your current app structure prefers a single page, /tools with embedded calculator is acceptable.

Backend

For this taskcard, backend is optional unless your current app architecture strongly prefers calculation endpoints.

Preferred MVP:

calculator runs entirely in frontend using deterministic utility functions

If you do use backend:

keep it minimal

no database persistence required for MVP

Calculation guidance
Cash game baseline approach

Use:

total_bank = players * average_buy_in * (1 + expected_rebuys)

if rebuys input is an absolute count rather than multiplier, adjust accordingly

apply optional reserve buffer percentage

Then recommend denomination quantities using available denominations, prioritizing:

enough small chips for blinds / betting flexibility

fewer high denomination chips

not an excessive total chip count

A good practical heuristic:

reserve roughly 35–45% of chips in low denominations

mid denominations for common betting

fewer large denominations for bank efficiency

Do not attempt perfect optimization. Use understandable rules.

Tournament baseline approach

Use:

total_tournament_value = players * starting_stack

plus re-entries if provided

distribute stack so players usually receive a manageable number of chips, not an unwieldy mountain

Heuristic target:

roughly 25 to 40 chips per player by default unless user overrides

Avoid bad stack compositions like too many single-unit chips.

Suggested implementation structure
Frontend files

Example structure only; adapt to actual repo:

client/src/pages/tools/ToolsPage.jsx

client/src/pages/tools/ChipCalculatorPage.jsx

client/src/components/tools/ToolCard.jsx

client/src/components/tools/ChipCalculatorForm.jsx

client/src/components/tools/ChipCalculatorResults.jsx

client/src/lib/chipCalculator.js

client/src/lib/chipPresets.js

If using TypeScript in frontend, mirror with .ts / .tsx.

UI requirements

mobile-first

large tap targets

clean sections

preset buttons easy to use

results grouped into:

summary

per-player stack

total chips to buy

reserve recommendation

Use cards, spacing, and labels that read more like a utility app than a dashboard.

Acceptance criteria

Taskcard is complete when:

User can open Tools from app navigation.

User can access Chip Calculator.

User can switch between Cash Game and Tournament modes.

User can load at least 3–4 presets.

User can enter custom values and calculate results.

Results include:

total bank / total stack value

per-denomination recommendations

total estimated chip count

starting stack suggestion

Tool works well on mobile.

No paid gating is applied.

Future tools appear as non-functional placeholders only.

Nice-to-have, only if easy

copy/share result summary

print-friendly summary block

“Amazon purchase planning” style wording for future affiliate pages

save last-used inputs locally in browser storage

These are optional. Do not delay the card for them.

Out of scope

Do not include in TC020:

preflop chart engine

odds trainer

affiliate product integration

saved calculator history in database

admin management

advanced tournament blind structure modeling

Those belong in later cards.

Implementation note for VS Code agent

Build this as a clean MVP, not a mathematically perfect solver. Prefer:

simple deterministic formulas

readable code

modular calculator helpers

mobile-friendly UI

minimal dependencies

Return:

files created

files modified

brief explanation of calculation logic

any assumptions made

Handoff prompt for your coder

You can paste this directly to your VS Code AI coder:

TASKCARD 020 — Poker Tools Hub + Chip Calculator (MVP)

Objective:
Add a new Tools area to the DCR Poker app and ship the first working utility: a Poker Chip Calculator. This tool should help users estimate how many chips of each denomination they need for either a cash game or a tournament.

Requirements:
- Add a Tools section to app navigation
- Add a Chip Calculator tool
- Add placeholder cards for future tools:
  - Preflop Charts
  - Odds / Outs Calculator
  - Tournament Clock
  - Deal Split / Chop Calculator
- Only Chip Calculator needs to function now

Chip Calculator modes:
1) Cash Game
Inputs:
- number of players
- average buy-in
- expected number of rebuys
- chip denominations available
- preferred chips per player target
- optional reserve percentage

Outputs:
- estimated total bank needed
- recommended quantity of each chip denomination
- total chip count
- suggested starting stack per player
- reserve chips for rebuys

2) Tournament
Inputs:
- number of players
- starting stack per player
- optional re-entry count
- chip denominations available
- preferred total chips per player target

Outputs:
- total chips needed
- recommended denomination breakdown
- starting stack per player
- total chip count across set

Presets:
Provide static presets for:
- Cash Game — Low Stakes
- Cash Game — Standard Home Game
- Tournament — Small Home Tournament
- Tournament — Deep Stack

Implementation preference:
- frontend-only logic unless backend is absolutely necessary
- no DB persistence required
- mobile-first UI
- clean calculator helpers in separate utility file

Acceptance criteria:
- Tools visible in nav
- Chip Calculator accessible
- cash / tournament mode toggle works
- presets load values
- custom values calculate correctly
- results show summary + denomination recommendations + chip totals
- mobile layout is good
- no paid gating

Out of scope:
- preflop charts logic
- odds engine
- affiliate integrations
- saved history
- advanced blind-structure simulation

When done, return:
1. files created
2. files modified
3. summary of formulas / assumptions
4. any follow-up recommendations

If you want, I can also draft Taskcard 021 now so you have the next one queued up too.