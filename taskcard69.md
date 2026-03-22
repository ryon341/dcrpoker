TC069 — Wire Tiered Question Banks Into Challenge Mode
Objective

Replace the old fixed challenge-pool selection path with the new tiered question-bank system built around:

challengeQuestionTypes.ts
tier1Questions.ts
tier2Questions.ts
tier3Questions.ts
tier4Questions.ts
tier5Questions.ts

Do this without breaking the current challenge UI. The goal is to make the app pull from the new 5-tier / 25-level bank structure while preserving the existing gameplay flow as much as possible.

Current state

The repo currently has:

challengeQuestionTypes.ts → new schema for question-bank records
challengeSelector.ts → still wired to old Challenge pools
challengePools.ts → old source of challenge content
dailyChallenge.ts → still pulls from old pools
Tier question files have now been generated separately

So the content exists, but the app is still reading the legacy challenge pools.

Goal behavior

We want challenge mode to work like this:

Levels 1–5 = Tier 1 (beginner)
Levels 6–10 = Tier 2 (apprentice)
Levels 11–15 = Tier 3 (grinder)
Levels 16–20 = Tier 4 (chip_leader)
Levels 21–25 = Tier 5 (master)

Within each tier:

use the question-bank entries for that tier
continue to support anti-repeat behavior
continue to support per-session sequential challenge progression
return one question at a time
Files to add
1) Add the generated tier banks to the same folder as the challenge logic

Place these files beside the existing challenge source files:

tier1Questions.ts
tier2Questions.ts
tier3Questions.ts
tier4Questions.ts
tier5Questions.ts

If they currently export const tierXQuestions = [...] as const, keep that shape.

Files to modify
2) challengeSelector.ts

Refactor this file so it supports the new bank system using ChallengeQuestion instead of the old Challenge pool objects.

Required changes

Create a new tier-bank map:

Record<ChallengeTier, ChallengeQuestion[]>

using:

tier1Questions
tier2Questions
tier3Questions
tier4Questions
tier5Questions
Add / update helper logic

Implement a new level-to-tier mapper:

1–5   => 'beginner'
6–10  => 'apprentice'
11–15 => 'grinder'
16–20 => 'chip_leader'
21–25 => 'master'
Keep session behavior

Preserve the same anti-repeat session model already used in challengeSelector.ts:

shuffled queue
refill when exhausted
prevent immediate repeats
prefer items outside recent history
Expected exported APIs

Keep the same public shape if possible so calling code does not need major rewrites:

initSession(...)
getNextFromSession(...)
getNextChallenge(...)

But update them to return ChallengeQuestion instead of legacy Challenge.

If needed, add a new type:

export type ChallengeQuestionSessionState = {
  remainingIds: string[];
  recentIds: string[];
};
3) dailyChallenge.ts

Refactor daily challenge selection to use the new tier banks instead of the old legacy pools.

Required behavior

Return exactly 5 daily questions, one from each bank:

Tier 1
Tier 2
Tier 3
Tier 4
Tier 5

Use the same seeded deterministic approach already present:

same date = same daily result set
Update types

Return ChallengeQuestion[] instead of Challenge[].

Keep existing seeded shuffle logic

Do not change:

hash logic
RNG logic
seeded shuffle logic

Only change the pools being used.

Integration compatibility requirement
4) Preserve current UI flow as much as possible

The current challenge screens may still expect legacy fields from Challenge, while the new bank uses ChallengeQuestion.

You must choose one of these approaches:

Preferred approach: adapter layer

Create a small adapter utility, for example:

challengeQuestionAdapter.ts

that converts a ChallengeQuestion into whatever shape the current UI needs.

This is safer than rewriting the whole UI right now.

Adapter requirements

If the current UI still expects old challenge fields, map them in a reasonable way.

For example:

scenario or prompt display text can come from prompt
correctAction passes through directly for action questions
for outs / ev questions, use choices and correctAnswer
where legacy hand/runout fields are required but unavailable, either:
make them optional in the UI, or
provide safe fallbacks
Important

Do not invent fake card-runout data just to satisfy legacy types.

If the UI depends on old reveal animation fields that no longer exist, the safer move is:

make those fields optional in the relevant UI components
render the question-bank prompt/explanation flow without requiring showdown cards
Required audit before editing UI

Search for all imports/usages of:

Challenge
getNextChallenge
getNextFromSession
getDailyChallengeSet
correctAction
any code that assumes legacy fields like:
heroHand
villainHand
runout
heroWins
scenario

Determine the minimum change needed to keep challenge mode functional with the new bank.

Implementation rules
5) Keep legacy files for rollback

Do not delete:

challengePools.ts

Leave it in place for fallback/reference, but the live selector path should stop depending on it.

6) Keep changes scoped

This task is about wiring the new question banks, not redesigning challenge mode.

Do not:

redesign the challenge screens
restyle the app
add new animations
refactor unrelated training tools
Acceptance criteria
Data source
App challenge selection no longer depends on BEGINNER_POOL / EASY_POOL / ...
App challenge selection now uses tier1Questions.ts through tier5Questions.ts
Level mapping
Level 1–25 correctly maps into the 5 tiers
Each tier spans 5 levels
Session behavior
anti-repeat behavior still works
challenge queue still refills correctly
no immediate repeat after reshuffle
Daily behavior
daily challenge uses seeded deterministic selection
daily set returns 5 items, one per tier
result is stable for the same date
UI compatibility
challenge mode renders without crashing
prompt/explanation/answer flow works with ChallengeQuestion
action questions support action answer buttons
outs / ev questions support multiple-choice answers
Safety
no TypeScript errors
no runtime crashes from missing legacy fields
no broken imports
Deliverables

Return:

list of files changed
short explanation of adapter strategy used
confirmation that challenge mode now reads from tier banks
confirmation that daily challenge now reads from tier banks
note any remaining UI limitations discovered during wiring
Suggested implementation order
Move tier files into the challenge logic folder
Update challengeSelector.ts
Update dailyChallenge.ts
Add adapter or optional-field handling
Fix UI call sites
Run typecheck
Run app and verify challenge flow