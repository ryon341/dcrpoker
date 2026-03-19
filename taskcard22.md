Taskcard 022 — Odds & Outs Calculator (Fast + Practical)
Objective

Add a second high-utility tool to the Tools section: an Odds & Outs Calculator that lets players quickly estimate:

number of outs

chance to hit on turn / river

approximate equity %

This should be:

fast to use mid-game

mobile-friendly

simple (no solver, no heavy math UI)

Why this card now

You now have:

planning tools (chip calculator)

strategy reference (preflop charts)

Next step:
→ in-hand decision support

This tool is:

one of the most commonly used poker utilities

easy to build

highly sticky (players come back repeatedly)

Product approach (IMPORTANT)

Do NOT build a full hand evaluator.

We are building:

A guided calculator + quick math engine

Two modes:

Quick Mode (primary)

Manual Outs Mode (fallback)

User flow

User opens:
→ Tools → Odds Calculator

User selects:

draw type OR enters outs manually

App displays instantly:

outs

% to hit on turn

% to hit by river

quick recommendation guidance

Mode 1 — Quick Select (Primary UX)

User selects a draw type:

Options:

Flush draw (9 outs)

Open-ended straight (8 outs)

Gutshot straight (4 outs)

Two overcards (6 outs)

Set to full house/quads (7–10 outs depending)

Combo draw (12–15 outs typical)

Output (instant)

Example:

Outs: 9

Turn hit: ~19%

River hit: ~35%

Mode 2 — Manual Outs

User inputs:

number of outs (1–20)

App calculates:

turn probability

river probability

Calculation logic (keep simple + correct enough)
Rule of 2 and 4

Turn: outs × 2

Turn + River: outs × 4

Example:

9 outs → ~36% by river

Slight refinement (optional but recommended)

Use more accurate formulas:

Turn:

outs / 47

River (two cards):

1 - ((47 - outs) / 47) * ((46 - outs) / 46)

Return percentages.

Output display
Required sections:
1) Core results

Outs

% Turn

% River

2) Quick interpretation

Examples:

“Strong draw — aggressive play viable”

“Marginal draw — consider pot odds”

“Weak draw — proceed cautiously”

Use simple thresholds:

30% → strong

15–30% → medium

<15% → weak

UI Requirements

large tap buttons for draw types

slider or input for manual outs

instant update (no submit button required)

clean results card

Suggested components

OddsCalculatorPage.jsx

DrawSelector.jsx

OutsInput.jsx

OddsResults.jsx

Route

/tools/odds-calculator

Tools page update

Add:

Odds Calculator card (now active)

Move it near top (high value tool)

Backend

NOT required.

All logic runs frontend.

Acceptance criteria

Taskcard complete when:

User can open Tools → Odds Calculator

User can:

select predefined draw OR

input custom outs

App instantly displays:

outs

% to hit on turn

% to hit by river

Results update dynamically

UI works cleanly on mobile

No backend required

No gating (free for all users)

Nice-to-have (only if easy)

toggle: “Quick math” vs “Exact math”

add pot odds comparison (defer if complex)

highlight “call vs fold threshold”

Do NOT delay core delivery.

Out of scope

full hand equity engine

opponent ranges

simulation / Monte Carlo

board input (flop cards)

hand input parsing

Those come much later if ever.

Suggested file structure
client/src/pages/tools/OddsCalculatorPage.jsx
client/src/components/tools/DrawSelector.jsx
client/src/components/tools/OutsInput.jsx
client/src/components/tools/OddsResults.jsx
client/src/lib/oddsCalculator.js
Core utility example
export function calculateOdds(outs) {
  const turn = (outs / 47) * 100;

  const river =
    (1 - ((47 - outs) / 47) * ((46 - outs) / 46)) * 100;

  return {
    turn: Math.round(turn),
    river: Math.round(river),
  };
}
Handoff prompt for your coder
TASKCARD 022 — Odds & Outs Calculator

Objective:
Build a fast, mobile-friendly poker odds calculator that estimates probability of hitting a draw.

Features:

Modes:
1) Quick Select (draw types)
2) Manual outs input

Quick Select options:
- Flush draw (9 outs)
- Open-ended straight (8 outs)
- Gutshot (4 outs)
- Two overcards (6 outs)
- Combo draw (12–15 outs typical)

Inputs:
- selected draw OR manual outs (1–20)

Outputs:
- outs
- % to hit on turn
- % to hit by river

Use formulas:
Turn:
outs / 47

River:
1 - ((47 - outs) / 47) * ((46 - outs) / 46)

UI:
- mobile-first
- instant updates
- no submit button required
- clear results display

Add route:
/tools/odds-calculator

Add to Tools page:
- active tool card

Acceptance criteria:
- tool works instantly
- results are correct
- UI works on mobile
- no backend required
- no paid gating

Out of scope:
- full equity engine
- board input
- opponent modeling
- simulation

Return:
1. files created
2. files modified
3. formulas used
4. any assumptions
Where this puts you

After TC022, your app now has:

Real utility (tools)

Skill development (charts)

In-game math support (odds)

Next step becomes very powerful:

👉 TC023 = Training Mode (quiz engine using your charts + odds)
→ This is where engagement and retention jump significantly.

If you want, I’ll map TC023 next — that’s where this starts turning into a serious product.