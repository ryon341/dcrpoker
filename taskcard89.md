TC089 — Expand Question Bank Volume and Audit Tier Distribution to Target 250 Questions per Tier
Objective

Scale the poker challenge content from the current functional tier sets into a production-ready question bank with the target volume you defined:

5 tiers
250 questions per tier target
1,250 total questions target
carryover rule preserved exactly:
Tier 2 includes 20% Tier 1
Tier 3 includes 20% Tier 2 only
Tier 4 includes 20% Tier 3 only
Tier 5 includes 20% Tier 4 only

This card is about content scale, structure, validation, and distribution integrity. It is not a UI card.

Goal state

After this card:

each tier has a dedicated, structured question source,
the app can reliably sample from a large content pool,
tier difficulty progression is measurable,
carryover contamination is controlled,
duplicates and malformed questions are caught automatically,
future question authoring becomes much easier.
Scope
1) Standardize tier question bank structure

Move all tier question files into a clean, consistent content organization so large-scale authoring is manageable.

Target structure

app/(tabs)/poker-challenge/data/
  beginner/
    index.ts
    beginnerActionQuestions.ts
    beginnerEvQuestions.ts
    beginnerOutsQuestions.ts
    beginnerPositionQuestions.ts
  apprentice/
    index.ts
    apprenticeActionQuestions.ts
    apprenticeEvQuestions.ts
    apprenticeOutsQuestions.ts
    apprenticePositionQuestions.ts
  grinder/
    index.ts
    grinderActionQuestions.ts
    grinderEvQuestions.ts
    grinderOutsQuestions.ts
    grinderPressureQuestions.ts
  chipLeader/
    index.ts
    chipLeaderActionQuestions.ts
    chipLeaderEvQuestions.ts
    chipLeaderPressureQuestions.ts
    chipLeaderDisciplineQuestions.ts
  master/
    index.ts
    masterActionQuestions.ts
    masterEvQuestions.ts
    masterPressureQuestions.ts
    masterDisciplineQuestions.ts

Each tier index.ts should export a flattened tier array:

import action from './beginnerActionQuestions';
import ev from './beginnerEvQuestions';
import outs from './beginnerOutsQuestions';
import position from './beginnerPositionQuestions';

const beginnerQuestions = [
  ...action,
  ...ev,
  ...outs,
  ...position,
];

export default beginnerQuestions;

Do not change the public engine interface if current imports already expect a single tier array.

2) Define category quotas per tier

To prevent random content imbalance, enforce rough quotas inside each tier.

Target per tier: 250 questions

Recommended split for early implementation:

Beginner
100 action
60 outs
50 EV / pot odds
40 position / discipline
Apprentice
100 action
60 EV
50 outs
40 position / discipline
Grinder
90 action
70 EV
40 outs
50 pressure / discipline
Chip Leader
80 action
80 EV
30 outs
60 pressure / discipline
Master
70 action
90 EV
20 outs
70 pressure / discipline

These do not have to be mathematically perfect, but the file structure and validation should support this target.

3) Add authoring metadata to each question

Without changing the live answer schema in a breaking way, extend questions with lightweight metadata to support auditing.

Add fields where safe

type ChallengeQuestion = {
  id: string;
  tier: 'Beginner' | 'Apprentice' | 'Grinder' | 'Chip Leader' | 'Master';
  category: 'action' | 'ev' | 'outs' | 'position' | 'pressure' | 'discipline';
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  // existing fields unchanged
};

If the engine already uses a strict type, extend that type rather than inventing a separate format.

Requirements

every question has a unique id
every question has correct tier
every question has one category
every question has a difficulty score appropriate to the tier

Suggested difficulty ranges:

Beginner: mostly 1–2
Apprentice: mostly 2–3
Grinder: mostly 3
Chip Leader: mostly 3–4
Master: mostly 4–5
4) Create a validation utility for duplicates and malformed content

Build a small content-audit utility that runs locally and reports problems before content ships.

New file
app/(tabs)/poker-challenge/lib/validateQuestionBank.ts

Checks

duplicate id
duplicate prompt text
missing required fields
mismatched tier vs file/tier bucket
invalid category
invalid difficulty range
empty answer sets
invalid action options
malformed numeric EV/outs payloads if applicable
question count per tier
question count per category per tier

Output
A console report like:

Question Bank Audit
-------------------
Beginner: 248 questions
  action: 101
  ev: 48
  outs: 60
  position: 39

Apprentice: 250 questions
...

Errors:
- Duplicate id: beg-action-014
- Missing category: app-ev-022
- Tier mismatch: grinder question found in chipLeader bucket

This can be a dev-only utility. It does not need to run in production.

5) Add a sampling audit utility for carryover verification

You want to ensure the progression pool actually respects the carryover rule in practice.

New file
app/(tabs)/poker-challenge/lib/auditTierSampling.ts

Purpose
Simulate repeated calls to getQuestionPoolForLevel(level) and report the approximate source composition.

Checks

Level 6–10 pools are primarily Apprentice with ~20% Beginner carryover
Level 11–15 pools are primarily Grinder with ~20% Apprentice carryover only
Level 16–20 pools are primarily Chip Leader with ~20% Grinder carryover only
Level 21–25 pools are primarily Master with ~20% Chip Leader carryover only

To make this possible, source questions must carry tier metadata.

Sample output

Sampling Audit (1000 runs)
Level 7 pool:
- Apprentice: 79.8%
- Beginner: 20.2%

Level 12 pool:
- Grinder: 80.4%
- Apprentice: 19.6%

Flag any forbidden leakage, for example Beginner showing up in Level 12.

6) Refactor question-bank imports to use tier index files

Once the tier content is split into category files, the main question bank loader should import only the tier index files.

File
app/(tabs)/poker-challenge/lib/questionBank.ts

Target

import beginnerQuestions from '../data/beginner';
import apprenticeQuestions from '../data/apprentice';
import grinderQuestions from '../data/grinder';
import chipLeaderQuestions from '../data/chipLeader';
import masterQuestions from '../data/master';

This keeps the runtime loader clean while allowing large content sets underneath.

7) Backfill question IDs and naming conventions

Adopt a predictable ID convention for maintenance.

Format examples

beg-action-001
beg-outs-043
app-ev-017
grd-pressure-092
chl-discipline-055
mst-ev-104

Tier prefixes:

beg
app
grd
chl
mst

IDs must never be reused.

8) Add a content status dashboard file for development

Create a simple file that exposes current authoring coverage.

New file
app/(tabs)/poker-challenge/data/questionBankStatus.ts

Example

export const QUESTION_BANK_TARGET = 250;

export const questionBankStatus = {
  Beginner: {
    target: 250,
    current: 112,
    byCategory: {
      action: 50,
      ev: 20,
      outs: 25,
      position: 17,
    },
  },
  Apprentice: {
    target: 250,
    current: 86,
    byCategory: {
      action: 32,
      ev: 24,
      outs: 18,
      position: 12,
    },
  },
  // ...
};

This does not need to be user-visible. It is for developer visibility and future taskcards.

9) Preserve engine compatibility

This is critical.

Do not break:

current question rendering,
answer buttons,
scoring,
tier progression,
session summaries,
replay logic.

The engine should continue consuming a flat array of questions for the active pool. This card is primarily a content-system upgrade, not a gameplay rewrite.

10) Seed at least an initial expansion pass across all tiers

Do not stop at just scaffolding.

Minimum expected outcome for this card:

all 5 tiers reorganized into category-based files,
validation utility exists and runs,
metadata exists,
IDs standardized,
each tier materially expanded from its current state,
status file reflects honest counts.

You do not need to hit all 250 questions per tier in this single card unless the implementer can do it safely, but the structure must support finishing the march to 250 cleanly.

Minimum acceptable expansion target for this card

Beginner: at least 100+
Apprentice: at least 100+
Grinder: at least 80+
Chip Leader: at least 80+
Master: at least 80+

Use real counts in the status file, not aspirational ones.

Acceptance criteria
Tier question content is reorganized into per-tier folders with category files.
Each tier exports a flat combined array through an index.ts.
Every question has a unique id.
Every question includes tier/category/difficulty metadata.
Validation utility reports duplicate IDs, malformed entries, and counts.
Sampling audit utility verifies the 80/20 carryover rule.
questionBank.ts imports tier index files, not giant monolith files.
Existing gameplay flow remains functional.
A status file exists showing actual counts by tier and category.
Each tier is materially expanded beyond the current minimal set.
No forbidden carryover leakage is found in higher tiers.
No regression to scoring, progression, or replay logic.
Non-goals
Do not redesign UI.
Do not change score rules.
Do not add backend persistence.
Do not add multiplayer or leaderboard features.
Do not rewrite the gameplay engine.
Do not fabricate completion counts in the status file.
Deliverables
category-based tier question structure
tier index exports
validateQuestionBank.ts
auditTierSampling.ts
questionBankStatus.ts
updated questionBank.ts
expanded question data with metadata + unique IDs
QA checklist

Run these manually:

Run validation utility and confirm no duplicate IDs.
Run validation utility and confirm counts print per tier/category.
Run sampling audit and confirm:
Level 7 ≈ 80% Apprentice / 20% Beginner
Level 12 ≈ 80% Grinder / 20% Apprentice
Level 17 ≈ 80% Chip Leader / 20% Grinder
Level 22 ≈ 80% Master / 20% Chip Leader
Confirm no Beginner leakage in Level 12+ pools.
Confirm no Apprentice leakage in Level 17+ except where allowed.
Play at least one level in each tier and verify the engine still renders questions normally.
Confirm scoring unchanged.
Confirm replays unchanged.
Confirm final challenge completion flow still works after content refactor.
Suggested commit message

refactor(challenge): scale question bank structure and add validation/audit utilities

The next logical card after this is: