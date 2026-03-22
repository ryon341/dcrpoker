TC070 — Install All 5 Tier Banks + Create Canonical Registry + Cross-Tier Validator
Objective

Move the generated Tier 1–5 question banks into the app’s real source tree, make them importable from one canonical registry, and add a validator that checks the full 1,250-question system before runtime wiring begins.

This task is still data-layer only. Do not wire the UI or replace live selector logic yet.

Problem this task solves

Right now, the question content exists, but the app does not yet have:

one canonical place to import all banks
one consistent level-to-tier mapping utility
one full-system validator across all tiers
confidence that IDs, levels, tier labels, counts, and schema are correct across the whole 5-tier set

We need that foundation before touching runtime selection.

Scope

This task must:

place all 5 tier-bank files into the correct challenge source folder
create a canonical registry file for all tier banks
create shared helpers for tier/global-level mapping
create a full cross-tier validator
export these utilities cleanly for downstream tasks

This task must not:

update challenge UI
replace selector runtime
modify old challengePools.ts
refactor unrelated app code
Files to add
1. Add tier bank files to challenge source folder

Move or recreate these files in the same source folder as challengeQuestionTypes.ts:

tier1Questions.ts
tier2Questions.ts
tier3Questions.ts
tier4Questions.ts
tier5Questions.ts
Requirements

Each file must export its bank cleanly, for example:

export const tier1Questions: ChallengeQuestion[] = [...]

Do not leave them as root-level scratch files outside the app source tree.

If the generated files currently use as const, convert them to the import shape that works cleanly with ChallengeQuestion[].

2. Add canonical registry file

Create:

tierQuestionBanks.ts

This file must:

import all 5 tier bank files
import relevant tier/question types
expose one canonical map of tier → questions
Required exports

Include:

export const tierQuestionBanks: Record<ChallengeTier, ChallengeQuestion[]>

and helper exports:

export function getQuestionsForTier(tier: ChallengeTier): ChallengeQuestion[]
export function getTierForGlobalLevel(globalLevel: number): ChallengeTier
export function getTierIndexForGlobalLevel(globalLevel: number): 1 | 2 | 3 | 4 | 5
export function getLocalLevelWithinTier(globalLevel: number): 1 | 2 | 3 | 4 | 5
export function getQuestionsForGlobalLevel(globalLevel: number): ChallengeQuestion[]
Tier mapping rules

Use these exact mappings:

Global levels 1–5 → beginner
Global levels 6–10 → apprentice
Global levels 11–15 → grinder
Global levels 16–20 → chip_leader
Global levels 21–25 → master

Local tier level mapping:

1,6,11,16,21 → local level 1
2,7,12,17,22 → local level 2
3,8,13,18,23 → local level 3
4,9,14,19,24 → local level 4
5,10,15,20,25 → local level 5
Guardrails

Clamp invalid global levels safely:

values < 1 should behave as 1
values > 25 should behave as 25
3. Add cross-tier validator

Create:

validateAllTierQuestionBanks.ts

This validator must check the full 5-tier system.

Required validations
Global totals
total questions = 1250
Per-tier totals

Each tier must contain exactly:

250 questions
Per-tier level distribution

Each tier must contain:

50 questions per level
levels 1–5 only
Tier/category totals

Per tier, confirm expected totals:

action = 150
outs = 50
ev = 50

If a tier differs slightly because of carryover implementation, report exact counts clearly and fail unless explicitly intended by the current content design.

Schema correctness

For every question:

id exists and is non-empty
tier exists and is valid
tierIndex exists and matches tier
level is 1–5
category is one of:
action
outs
ev
prompt exists and is non-empty
explanation exists and is non-empty
difficultyScore exists and is numeric
tags exists and is an array
Conditional field rules

For action questions:

correctAction must exist
heroPosition should exist when relevant
choices / correctAnswer are optional but should not be required

For outs and ev questions:

choices must exist and be a non-empty array
correctAnswer must exist and be non-empty
ID uniqueness
all 1250 question IDs must be unique globally
Prompt duplication audit
detect duplicate prompts across the full set
output duplicate groups clearly
fail if duplicates are found
Tier consistency
Tier 1 questions must all have:
tier = 'beginner'
tierIndex = 1

Likewise for all other tiers.

Carryover tag sanity

Do not fail only because carryover tags exist, but verify:

Tier 2 carryover tags reference Tier 1 only
Tier 3 carryover tags reference Tier 2 only
Tier 4 carryover tags reference Tier 3 only
Tier 5 carryover tags reference Tier 4 only

At minimum, report suspicious tag inconsistencies.

4. Add summary reporting

Validator output must clearly print:

total question count
per-tier totals
per-tier level distribution
per-tier category distribution
duplicate ID result
duplicate prompt result
pass/fail summary

Example style is fine:

✅ Tier 1 total: 250
✅ Tier 1 levels: 50/50/50/50/50
✅ Tier 1 categories: action 150, outs 50, ev 50
...
✅ Global IDs unique
✅ Global prompts unique
✅ Validation passed

If failed, exit non-zero.

5. Add exports / index wiring

If this challenge folder uses a barrel/index export, update it so downstream tasks can import:

tier banks
tier registry
validator helpers if appropriate

Do not over-refactor; keep it minimal.

6. Add an npm script if appropriate

If the project has a sensible scripts location for data validation, add something like:

"validate:challenge-banks": "ts-node <path>/validateAllTierQuestionBanks.ts"

or the repo’s existing preferred equivalent.

Use the project’s existing tooling style. Do not introduce a new toolchain just for this.

Acceptance criteria
File placement
all 5 tier files exist in the actual challenge source directory
all 5 import cleanly
Registry
tierQuestionBanks.ts exists
exposes canonical bank map and helper functions
level → tier mapping works for 1–25
invalid values clamp safely
Validation
full validator runs successfully
validates all 1250 records
catches duplicate IDs/prompts if present
confirms tier/level/category distributions
exits non-zero on failure
Safety
no TypeScript errors in newly added files
no broken imports
no runtime wiring changes yet
no UI changes yet
Deliverables

Return:

list of files added/modified
validator output summary
confirmation that all 5 banks are now in the app source tree
confirmation that canonical registry/helpers are ready for selector wiring
any anomalies found in cross-tier validation
Stop condition

Stop after:

all banks are installed
registry exists
validator passes

Do not continue into selector wiring or UI rendering in this task.