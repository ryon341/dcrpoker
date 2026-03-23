# TC076 — Prompt Cleanup + Answer Mode Hardening for Poker Game Challenge

## Objective
Clean up the challenge UI and harden the runtime so each question type renders correctly and cleanly on mobile and desktop.

---

## Scope

### 1) Remove prompt clutter from player-facing UI
Do not show tier/level/category/debug prefixes inside the visible question text.

Examples to remove:
- `Beginner L3 OUTS:`
- `EV`
- `ACTION`
- internal debug metadata

Only show the actual player-facing prompt.

---

### 2) Standardize panel titles by category
Use fixed titles only at the panel/header level:

- Action → `GTO SCENARIO`
- Outs → `OUTS`
- EV → `POT ODDS`

Do not duplicate the category in the prompt body.

---

### 3) Improve question text fit on mobile
Update the question panel styling so prompts fit cleanly on smaller screens.

Requirements:
- allow multi-line wrapping
- no clipping
- no overflow outside the panel
- responsive font sizing for long prompts
- readable line-height
- balanced padding
- panel height can grow if needed

---

### 4) Normalize multiple-choice answer labels
For outs / EV questions, make answer labels more readable.

Examples:
- `4` → `4 outs`
- `8` → `8 outs`
- `20` → `20%`
- `0.25` → `25%` when appropriate

Apply formatting only where it improves readability and matches the question type.

---

### 5) Enforce answer-mode rendering rules
Harden the runtime so question rendering never falls back to the wrong button type.

Rules:
- `action` questions must render only `DecisionButtons`
- `outs` questions must render only `MultiChoiceButtons`
- `ev` questions must render only `MultiChoiceButtons`

Do not allow any yes/no fallback.

---

### 6) Add runtime validation for malformed questions
Before rendering a question, validate required fields by category.

Required:
- Action:
  - prompt
  - correctAction
- Outs:
  - prompt
  - choices
  - correctAnswer
  - parsed heroCards and boardCards when available
- EV:
  - prompt
  - choices
  - correctAnswer

If malformed:
- log a clear dev warning with question id
- skip the bad question instead of breaking the screen

---

### 7) Clean up adapter output
In `challengeQuestionAdapter.ts`, ensure the runtime question shape is stable and explicit.

Suggested runtime fields:
- `category`
- `panelTitle`
- `prompt`
- `heroCards`
- `boardCards`
- `choices`
- `correctAnswer`
- `correctAction`

Do not rely on prompt text prefixes for UI behavior.

---

## Files to inspect/update
Use actual paths if different, but likely:

- `index.tsx`
- `daily.tsx`
- `QuestionPanel.tsx`
- `MultiChoiceButtons.tsx`
- `challengeQuestionAdapter.ts`
- any challenge runtime types/interfaces
- any shared answer-rendering helpers

---

## Acceptance Criteria

- [ ] Visible prompt text no longer shows tier/level/category/debug prefixes
- [ ] Panel titles are fixed by category (`GTO SCENARIO`, `OUTS`, `POT ODDS`)
- [ ] Long prompts fit cleanly on mobile
- [ ] Multiple-choice labels are easier to read
- [ ] No yes/no fallback exists anywhere in the challenge flow
- [ ] Malformed questions are skipped safely with dev logs
- [ ] Desktop and mobile both render correctly

---

## Deliverable
Reply with:
1. files changed
2. root cause(s) fixed
3. before/after examples of cleaned prompt text
4. sample outs answer labels after normalization
5. confirmation that malformed questions are skipped safely