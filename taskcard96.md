TC096 — Validation + Analytics Layer

Objective
Add a production-grade safety and telemetry layer around the challenge system so you can 1) prevent broken/generated banks from shipping, and 2) measure real question performance for future tuning.

Why this is next
The gameplay loop is now complete:

all 5 tiers generated
runtime integrated
Grand Champion + Gauntlet implemented

The next highest-value step is to harden the system so content quality can improve over time without guesswork.

This taskcard has two parts:

Validation — catch bad banks automatically
Analytics — capture how users actually perform on questions/categories/tiers

Scope
This taskcard does not require a backend service yet. Start with local/app-side instrumentation and validation hooks that can later be shipped to an API.

PART A — VALIDATION
Goals

Automatically verify bank integrity for:

totals
per-level counts
category counts
duplicate IDs
duplicate prompts
invalid category/tier mappings
malformed question payloads
Acceptance Criteria — Validation
Every generated bank is validated through one shared validator.
Validation runs in dev automatically.
Validation can be run manually for all banks in one pass.
Validation result clearly reports:
tier name
total count
per-level counts
category counts
duplicate IDs count
duplicate prompt count
malformed question count
Validation fails loudly in dev for critical errors.
No runtime behavior changes for production users unless a bank is invalid.
No new TypeScript errors.
Deliverables — Validation
shared validator expanded or formalized
validateAllChallengeBanks() helper
optional dev script to print/report all bank health
clear typed validation result object
Implementation Plan — Validation
1. Add typed validation model

Create or expand a type like:

export type TierBankValidationResult = {
  tier: string;
  total: number;
  expectedTotal: number;
  perLevelCounts: Record<number, number>;
  expectedPerLevel: number;
  categoryCounts: Record<string, number>;
  expectedCategoryCounts: Record<string, number>;
  duplicateIds: string[];
  duplicatePrompts: string[];
  malformedQuestionIds: string[];
  passed: boolean;
  errors: string[];
  warnings: string[];
};
2. Expand validateTierBank()

Checks should include:

exact total
exact 50 per level
expected categories only
expected category distribution
unique IDs
normalized duplicate prompt check
required fields present
no invalid levels outside 1–5 for a tier slice
3. Add validateAllChallengeBanks()

Run against:

Beginner
Apprentice
Grinder
Chip Leader
Master

Return an array of results plus summary:

{
  passed: boolean,
  totalBanks: 5,
  passedBanks: 5,
  failedBanks: 0,
  results: [...]
}
4. Add dev-only report utility

Example file:

challengeBankValidationReport.ts

This should print a compact readable report in dev/console, something like:

tier
passed/failed
totals
per-level check
category check
duplicates
5. Optional script

If clean/easy:

scripts/validateChallengeBanks.ts

Purpose:

run validation outside the UI
useful after generator runs
PART B — ANALYTICS
Goals

Track how hard each question actually is and where users struggle:

by tier
by level
by category
by question ID

This gives you a real basis for:

tuning difficulty
retiring weak questions
spotting unclear prompts
balancing the generator later
Acceptance Criteria — Analytics
Each answered question logs an analytics event in local persistence.
Logged fields include:
questionId
tier
level
category
correct/incorrect
selected answer
correct answer
score delta
mode (challenge or gauntlet)
timestamp
Aggregate stats can be computed locally.
Add helpers to summarize:
category accuracy
tier accuracy
level accuracy
most-missed questions
Analytics storage is bounded so it does not grow forever.
No gameplay regressions.
Deliverables — Analytics
analytics event type
persistence store for challenge analytics
logging on answer submit
local aggregation helpers
optional developer summary view/console print
Implementation Plan — Analytics
1. Create analytics types

Example:

export type ChallengeQuestionEvent = {
  questionId: string;
  tier: string;
  level: number;
  category: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  scoreDelta: number;
  mode: 'challenge' | 'gauntlet';
  timestamp: string;
};
2. Add analytics storage module

Example file:

challengeAnalyticsStorage.ts

Functions:

recordChallengeQuestionEvent(event)
getChallengeQuestionEvents()
clearChallengeQuestionEvents()
getChallengeAnalyticsSummary()
3. Cap storage size

Keep the newest N events only.
Recommended:

max 2,000 to 5,000 events

Suggested rule:

append new event
if over limit, trim oldest
4. Log on answer submission

Hook into the existing submit/score path.
Every answered question should record:

identity
metadata
correctness
score delta
mode
5. Add summary helpers

Need functions for:

accuracy by category
accuracy by tier
accuracy by level
top 10 most-missed question IDs
total questions answered
challenge vs gauntlet breakdown
6. Add lightweight dev surfacing

At minimum:

console report helper

Nice if trivial:

small hidden dev panel or debug section

Do not overbuild UI here. The important part is the data layer.

FILE STRATEGY

Prefer adding a few focused files instead of bloating index.tsx.

Suggested new files:

challengeAnalyticsStorage.ts
challengeAnalyticsTypes.ts
challengeBankValidation.ts or expand existing registry helper cleanly
optional scripts/validateChallengeBanks.ts

Possible modified files:

challengeQuestionBankRegistry.ts
data/index.ts
index.tsx/poker-challenge/index.tsx
progressStorage.ts only if needed
QA CHECKLIST
Validation QA
run all-bank validation
confirm all 5 generated tiers pass
intentionally test one bad case if easy:
duplicate ID
wrong count
malformed category
ensure validator catches it
Analytics QA
answer several questions across categories
confirm events persist
reload app
confirm data still exists
verify summary output
verify cap trimming works if limit exceeded
EXPECTED VS CODE RETURN
Files added
Files modified
Validation summary for all 5 banks
Example analytics summary output
Storage cap used
Any issues found
DEFINITION OF DONE

TC096 is complete when:

all generated banks can be validated automatically
answered questions produce persistent analytics events
local summaries can identify weak categories/questions
no gameplay regressions occur