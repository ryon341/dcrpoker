TC093 — Master Tier Generator + Runtime Integration

Objective
Extend the generator-driven system to the 4th tier by creating a full Master question bank and wiring it into the challenge runtime as the source of truth for Tier 4.

Why this is next
TC092 completed runtime integration for Beginner, Apprentice, and Grinder. The next clean step is to eliminate manual authoring for Master and keep the progression pipeline consistent across advanced tiers.

Scope
This taskcard covers:

generating the Master tier bank
exporting it as a generated TypeScript file
wiring it into runtime
validating counts, level distribution, and category behavior

This taskcard does not yet do Grand Champion/endgame work, major UI redesign, or large scoring changes.

Target Design
Master should feel meaningfully harder than Grinder:

more pressure and EV density
thinner margins
tougher action spots
stronger distractors
less obvious position knowledge
higher-quality postflop decision pressure

Recommended Master mix:

action: 80
ev: 80
pressure: 60
outs: 30

Total: 250 questions, 50 per level

That gives Master a clearly more advanced profile than Grinder without introducing a brand-new category yet.

Acceptance Criteria

Generator produces generatedMasterQuestions.ts.
Master bank contains exactly 250 questions.
Distribution is:
action: 80
ev: 80
pressure: 60
outs: 30
Each of the 5 Master levels contains exactly 50 questions.
Prompts are unique within Master after dedupe.
Question IDs are unique within Master and do not collide with existing generated tiers.
Difficulty settings are tighter than Grinder:
more marginal EV spots
tougher pressure decisions
stronger wrong answers
harder action distinctions
Runtime Tier 4 uses the generated Master bank instead of any manual bank.
Existing progression, scoring, resume, and tier completion flow continue to work.
No new TypeScript errors.

Deliverables

generator config extended for Master
any required hand/scenario pools expanded for Master difficulty
generated output file for Master
runtime registry wired to generated Master bank
dev validation passes for Tier 4
short QA report with counts and level distribution

Implementation Plan

Extend generator types/config for Master
Update generator definitions so Master is first-class everywhere:
TierKey
tier order definitions
target count config
allowed category config
difficulty envelope config
hand strength / pressure profile config

Master target:

250 total
50 per level
categories: action, ev, pressure, outs
Create Master difficulty envelope
Adjust config so Master is not just “more of Grinder.”

Recommended behavior:

Action:
more borderline opens/calls/raises
more positional nuance
more stack-depth sensitivity
more prior-action sensitivity
EV:
closer pot-odds decisions
tighter margins
cleaner but more tempting distractors
Pressure:
stronger made hands vs draw/board-pressure ambiguity
more spots where call/fold is close
more textured board logic
Outs:
fewer easy combo-draw giveaways
more disguised or overcount-trap distractors
Expand pools only where necessary
If current pools cannot support Master cleanly, extend:
hand pools
pressure hand sets
board textures
draw families
stack pools
action templates

Do not bloat randomly. Add only enough variety to avoid repetitive prompts and weak duplicates.

Generate Master bank
Produce:
generatedMasterQuestions.ts

Keep deterministic generation behavior aligned with existing pipeline:

same seed → same output
stable IDs
dedupe retained
formatter/export path consistent with other generated tiers
Wire runtime Tier 4 to generated Master
Replace Tier 4 runtime source with generated Master bank.

Likely target:

tier4Questions.ts or equivalent
challengeQuestionBankRegistry.ts

Goal:

Beginner → generated
Apprentice → generated
Grinder → generated
Master → generated
Validate bank integrity
Use or extend validateTierBank() to confirm:
total = 250
each level = 50
category totals correct
IDs unique
prompts unique enough after dedupe

Return validation output in the completion report.

QA runtime flow
Verify:
Tier 4 loads
Master questions render correctly
pressure questions still score correctly
EV questions still score correctly
summary modal works
level completion works
reload/resume mid-level does not crash
tier completion still works

Suggested Config for Master
Use this as the intended tuning target unless the existing generator architecture suggests a cleaner equivalent:

Master: {
  total: 250,
  perLevel: 50,
  categoryTargets: {
    action: 80,
    ev: 80,
    pressure: 60,
    outs: 30,
  },
  difficulty: {
    actionAmbiguity: 'high',
    evMargin: 'tight',
    pressureComplexity: 'high',
    outsTrapRate: 'medium-high',
  },
}

Requested File Strategy
Prefer minimal edits.
If generator config is centralized, keep the changes concentrated there.
If one file becomes messy, provide full-file replacement rather than fragmented patches.

What VS Code Should Return

files changed
exact Master category totals
per-level totals
whether any new pool content was added
whether Tier 4 runtime now uses generated content
whether any resume/progression issue appeared in QA

Definition of Done
TC093 is complete when Tier 4 Master is generated, validated, exported, and live in the runtime with no gameplay regressions.