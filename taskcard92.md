TC091 — Wire Generated Question Banks Into the Challenge Engine

Objective
Replace the hand-authored tier banks with the generated banks from TC090.5 so the game runs entirely from the generator output, while preserving current progression, scoring, summaries, and level behavior.

Why this is next
TC090.5 completed the content generation layer and produced clean per-tier outputs. The next logical step is to make the app consume those generated files as the source of truth. Until that happens, the generator is done but not actually powering gameplay.

Scope
This taskcard only connects the generated banks into the live challenge game. It does not change scoring, progression rules, UI design, or generator logic unless required to make the integration safe.

Acceptance Criteria

Beginner, Apprentice, and Grinder tiers load questions from:
generatedBeginnerQuestions.ts
generatedApprenticeQuestions.ts
generatedGrinderQuestions.ts
No legacy/manual bank is used by the runtime for those three tiers.
Each level still serves exactly 50 questions.
Tier/category distribution remains as generated:
Beginner: 100 action / 50 ev / 60 outs / 40 position
Apprentice: 100 action / 60 ev / 50 outs / 40 position
Grinder: 90 action / 70 ev / 40 outs / 50 pressure
Existing challenge flow remains intact:
level start
question render
answer submit
hand result display
score calculation
session summary
level completion
tier completion
persistence/restore
No TypeScript errors.
No duplicate IDs after integration.
Existing saved progress does not crash the app if a user resumes mid-tier.

Deliverables

Challenge runtime updated to import generated banks
Bank selection logic cleaned up
Legacy bank references removed or clearly deprecated
Small validation helper added if needed
Brief QA note from VS Code confirming tier counts and per-level counts

Implementation Plan

Identify the current runtime entry points
Find the files that currently:
import tier question banks
map current tier → bank
split/filter questions by level
determine category behavior for answer scoring/rendering

Likely files are around:

app/.../poker-challenge/index.tsx
challenge data registry files
any tier1BeginnerQuestions.ts, tier2ApprenticeQuestions.ts, etc.
Replace runtime imports
Swap the old imports for:
generatedBeginnerQuestions
generatedApprenticeQuestions
generatedGrinderQuestions

Create one normalized registry, for example:

challengeQuestionBankRegistry.ts

Example target shape:

export const CHALLENGE_BANKS = {
  Beginner: generatedBeginnerQuestions,
  Apprentice: generatedApprenticeQuestions,
  Grinder: generatedGrinderQuestions,
} as const;
Normalize the runtime contract
Confirm the generated question shape exactly matches what the challenge engine expects.

If the app currently expects fields like:

id
level
category
prompt
choices
correctAnswer
meta
hand
villainAction
result

and the generator uses slightly different names, add a thin adapter layer instead of editing the generator output manually.

Preferred pattern:

keep generated files untouched
add normalizeGeneratedQuestion() in runtime if needed
Remove legacy source-of-truth usage
For Beginner / Apprentice / Grinder:
stop importing manual banks into runtime
stop concatenating manual and generated banks
stop fallback behavior unless absolutely necessary

You may leave old files in the repo temporarily, but they must not be used by gameplay.

Add safe validation on startup
Add a dev-only validation helper that checks:
bank exists for tier
total count is 250
each level has 50
IDs are unique
categories are expected for that tier

Example:

validateTierBank('Beginner', generatedBeginnerQuestions, {
  total: 250,
  perLevel: 50,
  categories: ['action', 'ev', 'outs', 'position'],
});

This should log useful errors in development and fail fast if malformed.

Confirm category handling
Make sure the runtime still handles all live categories correctly:
action
ev
outs
position
pressure

Important check:
Grinder now uses pressure instead of position.
Ensure UI/render/scoring logic does not assume position questions exist in every tier.

Preserve progression behavior
Do not alter:
tier unlock logic
completed tier logic
level replay logic
restore from AsyncStorage
score rules

But confirm resumed sessions still work if question ordering/source changes.

If saved session state depends on array index instead of question ID, stabilize behavior so resume does not break.

QA pass
Run and verify:
Beginner Level 1 loads
Apprentice loads after unlock
Grinder loads after unlock
each level completes normally
a pressure question renders correctly
a position question renders correctly
summary modal still shows expected category data
restore after app reload works

Requested File Strategy
Prefer minimal, surgical changes.
If a file needs significant cleanup, provide a full-file replacement.
Otherwise provide exact patch blocks.

Suggested Deliverables Back From VS Code
Ask VS Code to return:

files changed
short summary of integration approach
count validation results for each tier
whether any adapter/normalizer was required
whether any saved-progress compatibility issue was found

Definition of Done
TC091 is complete when the live challenge game is reading generated content for Beginner, Apprentice, and Grinder with no runtime regressions and validated per-tier/per-level counts.

Stretch goal, only if trivial
Add one developer utility script or console output that prints:

tier totals
per-level totals
category totals
so future authoring passes can be checked in seconds