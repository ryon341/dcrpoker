TC071 — Wire Selector + Daily Challenge to Tier Banks
Objective

Connect the live challenge selection system to the new tier-bank registry so the app actually serves questions from:

tier1Questions.ts
tier2Questions.ts
tier3Questions.ts
tier4Questions.ts
tier5Questions.ts

This task is runtime wiring only. Keep UI changes minimal and focused on compatibility.

Current state

Completed already:

all 5 tier banks are in the app source tree
canonical registry exists
global validator passes
legacy challenge flow still likely points at old pool-based sources
daily challenge likely still points at old pools too

So the data layer is ready. The next step is to make the app use it.

Goal behavior
Standard challenge mode

Map global levels to tiers as follows:

levels 1–5 → Tier 1 beginner
levels 6–10 → Tier 2 apprentice
levels 11–15 → Tier 3 grinder
levels 16–20 → Tier 4 chip_leader
levels 21–25 → Tier 5 master

For the current global level:

resolve tier
resolve local tier level 1–5
pull questions from that exact tier + local level
avoid immediate repeats
maintain session queue behavior
Daily challenge mode

Return a deterministic 5-question daily set:

1 question from Tier 1
1 question from Tier 2
1 question from Tier 3
1 question from Tier 4
1 question from Tier 5

Use the existing seeded deterministic selection pattern.

Scope

This task must:

refactor selector runtime to use tier-bank registry
refactor daily challenge to use tier-bank registry
preserve anti-repeat and seeded behavior
add the minimum adapter/compatibility layer needed so current challenge screens can consume the new question objects

This task must not:

redesign challenge UI
restyle anything
rewrite unrelated app areas
delete legacy files
Files to modify
1. challengeSelector.ts

Refactor the live selector to use the canonical registry instead of legacy pools.

Required behavior

Use the helper(s) from tierQuestionBanks.ts to:

resolve current tier from global level
resolve local level inside tier
get candidate questions only for that tier/local level
Selection requirements

Preserve the existing session model as much as possible:

queue of remaining question IDs
recent history buffer
reshuffle/refill when exhausted
avoid immediate repeat where possible
Required output type

The selector should now return ChallengeQuestion, not the old legacy challenge type.

If the file currently exports something like:

initSession
getNextFromSession
getNextChallenge

keep those exports if possible so call sites stay stable.

2. dailyChallenge.ts

Refactor daily challenge generation to read from the new registry.

Required behavior

Build the daily set from:

1 seeded selection from Tier 1
1 seeded selection from Tier 2
1 seeded selection from Tier 3
1 seeded selection from Tier 4
1 seeded selection from Tier 5
Requirements

Keep the existing:

date seed approach
deterministic shuffle/RNG behavior

Only replace the data source, not the seed logic style.

Return ChallengeQuestion[].

Files to add
3. Add adapter utility

Create a small compatibility adapter, for example:

challengeQuestionAdapter.ts

Purpose:
bridge ChallengeQuestion into the shape the current challenge UI/runtime expects, with minimal disruption.

Required behavior

Support all three categories:

action
use prompt
answer options should be FOLD, CALL, RAISE
correctness comes from correctAction
outs
use prompt
use choices
correctness comes from correctAnswer
ev
use prompt
use choices
correctness comes from correctAnswer
Important

Do not invent fake hole-card / board / runout data.

If legacy fields are optional in the destination shape, leave them undefined or provide safe placeholders only where absolutely required to prevent crashes.

Required audit before editing call sites

Search for usages of:

getNextChallenge
getNextFromSession
getDailyChallengeSet
Challenge
any rendering logic assuming old challenge fields like:
heroHand
villainHand
runout
heroWins
scenario

Determine the smallest safe compatibility path.

UI compatibility requirement

This task is allowed to make small targeted UI/runtime compatibility edits only if needed to prevent crashes.

Examples of allowed changes:

make legacy card-display section conditional
render generic prompt when no old scenario fields exist
handle either correctAction or correctAnswer

Examples of not-allowed changes:

redesigning the challenge page
major component rewrites
new styling passes
Legacy fallback

Do not delete:

challengePools.ts
old legacy types

Leave them in place for rollback/reference, but live selection should stop depending on them.

Acceptance criteria
Selector
challenge selector now uses tier banks, not legacy pools
current global level maps correctly into tier + local level
only questions from that tier/local level are selected
anti-repeat session behavior still works
Daily challenge
daily challenge now uses tier banks
returns 5 deterministic questions, one per tier
same date returns same set
Compatibility
challenge mode does not crash when loading bank questions
action questions work
outs questions work
ev questions work
no fake card data invented
Safety
no broken imports
no TypeScript errors in modified files
legacy files retained
validator still passes
Deliverables

Return:

files changed
explanation of selector strategy
explanation of adapter strategy
confirmation that live challenge now reads from tier banks
confirmation that daily challenge now reads from tier banks
any remaining UI limitations found
Stop condition

Stop when:

selector is wired
daily challenge is wired
challenge mode loads bank-driven questions without crashing

Do not do a broader UI cleanup pass in this task.