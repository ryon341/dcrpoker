# TC080 — Tier 1 QA Sweep + Question/Answer Validation Pass

## Objective
Run a full QA pass across Beginner Levels 1–5 and fix any remaining gameplay/content defects in the Tier 1 challenge.

---

## Scope

### 1) Play-test all 5 Beginner levels
Run multiple sessions across Levels 1–5 on both desktop and mobile.

Check for:
- broken prompts
- awkward wording
- wrong answer keys
- malformed answer choices
- bad card rendering
- duplicate-feeling questions
- progression/unlock issues
- session summary issues

---

### 2) Validate answer correctness
Audit Tier 1 questions for correctness.

#### Action questions
Verify:
- prompt scenario matches `correctAction`
- no obviously wrong poker decisions
- no mislabeled fold/call/raise answers

#### Outs questions
Verify:
- heroCards and boardCards match the prompt intent
- choice set includes the correct answer
- correctAnswer is mathematically correct

#### EV questions
Verify:
- numeric wording is clear
- answers are mathematically correct
- formatted labels still map to the correct stored answer

---

### 3) Catch duplicate-feeling content
Review for questions that are not exact duplicates but feel too similar in live play.

Examples:
- same hand class + same position + same prior action with only tiny wording changes
- several outs questions that feel effectively identical in a row

Reduce or replace where needed.

---

### 4) Verify card parsing/rendering coverage
Specifically inspect all outs questions and confirm:

- hero cards render correctly
- board cards render correctly
- no parse failures
- no missing-card layouts
- no text/card mismatch

If regex parsing is too brittle for any question, convert those entries to explicit structured card fields.

---

### 5) Validate session flow edge cases
Check:
- retry level
- next level unlock
- switching unlocked levels
- refreshing mid-progress
- summary modal after pass/fail
- session count staying at 12
- no extra question after session completion

---

### 6) Clean up weak prompts/explanations
Rewrite any Tier 1 prompts or explanations that are:

- too verbose
- awkwardly phrased
- redundant with the card display
- unclear for beginners

Keep explanations concise and instructional.

---

### 7) Add/extend validation utility
If not already present, add a validation script/helper for Tier 1 that checks:

- total counts
- per-level counts
- per-category counts
- unique IDs
- unique prompts
- required fields by category
- parseable outs-card data
- valid answer keys

Use it to catch future regressions.

---

## Files to inspect/update
Use actual filenames if different, but likely:

- `tier1BeginnerQuestions.ts`
- `challengeQuestionAdapter.ts`
- validation helper/script
- `index.tsx`
- `SessionSummaryModal.tsx`
- any question utilities

---

## Acceptance Criteria

- [ ] All 5 Beginner levels play cleanly
- [ ] No obvious wrong answers remain
- [ ] Outs questions render cards correctly
- [ ] EV and outs answers are mathematically correct
- [ ] Duplicate-feeling questions reduced
- [ ] Retry / next level / unlock flow works
- [ ] Refresh/resume does not break progress
- [ ] Validation utility passes cleanly

---

## Deliverable
Reply with:
1. files changed
2. bugs/issues found
3. fixes applied
4. number of questions corrected/reworded/replaced
5. confirmation that all 5 Beginner levels were QA tested