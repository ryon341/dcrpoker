TC090 — Authoring Sprint 1: Expand Beginner + Apprentice to 250 Questions Each
Objective

Execute the first content production sprint to bring the two foundational tiers to full scale:

Beginner → 250 questions
Apprentice → 250 questions

This card establishes:

sufficient gameplay depth,
repeatability without obvious duplication,
a stable base for higher-tier carryover,
validated category distribution.

This is a high-volume content + validation card, not an engine rewrite.

Scope
1) Expand Beginner tier to 250 questions

Target file structure (already created in TC089):

/data/beginner/
  beginnerActionQuestions.ts
  beginnerEvQuestions.ts
  beginnerOutsQuestions.ts
  beginnerPositionQuestions.ts
  index.ts
Target distribution
Category	Target Count
action	100
outs	60
EV	50
position	40
TOTAL	250
2) Expand Apprentice tier to 250 questions

Structure

/data/apprentice/
  apprenticeActionQuestions.ts
  apprenticeEvQuestions.ts
  apprenticeOutsQuestions.ts
  apprenticePositionQuestions.ts
  index.ts
Target distribution
Category	Target Count
action	100
EV	60
outs	50
position	40
TOTAL	250
3) Enforce strict question quality rules

Every question MUST:

Structural requirements
have a unique id
include:
tier
category
difficulty
match existing engine schema exactly
Difficulty rules
Tier	Difficulty Range
Beginner	1–2 (90%), small amount of 3
Apprentice	2–3
4) Authoring patterns (CRITICAL — avoid junk content)

Do NOT create repetitive variations like:

“You have AK. What do you do?” × 100

Instead, vary:

Dimensions to rotate
position (UTG, MP, CO, BTN, SB, BB)
stack depth (short / medium / deep)
opponent action (limp, raise, 3-bet)
pot size
number of players
board texture (for postflop/outs)
tournament vs cash dynamics (light use)
5) Action question patterns

Each action question should map cleanly to:

Fold
Call
Raise

No ambiguity.

Beginner examples
obvious folds (trash hands early position)
clear raises (premium hands)
basic calls (suited connectors in position)
Apprentice upgrades
borderline hands
isolation raises
facing raises
weak vs strong ranges
6) Outs questions (must be clean math)

Rules:

count only clean outs
avoid dirty outs unless clearly explained
no trick ambiguity at this level
Examples
flush draws
open-ended straight draws
gutshots (clearly labeled)
7) EV / Pot Odds questions

Keep simple but correct:

round numbers where possible
clean ratios
no solver-level math yet
Example structure
pot: $100
call: $25
odds: 4:1 → decision
8) Position / discipline questions

Focus on:

“don’t overplay trash”
“position matters”
“tight early, wider late”
9) Apprentice differentiation (IMPORTANT)

Apprentice must feel different from Beginner

Add:

more marginal spots
more punishable mistakes
more “tempting but wrong” answers
more EV-based reasoning
10) Run validation utility

Run:

validateQuestionBank.ts

Fix ALL:

duplicate IDs
missing metadata
incorrect tier tags
invalid categories
empty answer sets
11) Run sampling audit

Run:

auditTierSampling.ts

Verify:

Level 6–10 distribution
~80% Apprentice
~20% Beginner

NO:

excessive Beginner leakage (>25%)
missing Apprentice dominance
12) Update status dashboard

File

questionBankStatus.ts

Update with REAL counts:

Beginner: {
  target: 250,
  current: 250,
  byCategory: {
    action: 100,
    ev: 50,
    outs: 60,
    position: 40,
  }
}

Same for Apprentice.

No fake numbers.

13) Manual gameplay QA (IMPORTANT)

Play:

Level 1
Level 3
Level 5
Level 7
Level 10

Verify:

no obvious duplicate questions
difficulty progression feels real
Beginner feels easy
Apprentice feels noticeably harder
no broken question rendering
Acceptance criteria
Beginner has 250 questions
Apprentice has 250 questions
Category distribution is approximately correct
All questions have valid metadata
No duplicate IDs exist
Validation utility passes clean
Sampling audit shows correct 80/20 mix
Gameplay works with expanded pools
No regression in scoring or UI
Apprentice difficulty is clearly above Beginner
Non-goals
Do not touch Grinder/Chip Leader/Master yet
Do not change scoring system
Do not redesign UI
Do not refactor engine logic
Do not introduce solver-level complexity
Deliverables
500 total questions (250 + 250)
fully populated Beginner + Apprentice folders
validated question bank
updated status dashboard
confirmed carryover behavior
QA checklist
run validation → zero errors
run sampling audit → correct percentages
play multiple levels → no repetition patterns
verify tier difficulty separation
verify no schema break
Suggested commit message

content(challenge): expand Beginner and Apprentice tiers to 250 questions each