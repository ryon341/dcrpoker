# TC077 — Tier 1 (Beginner) Question Bank Cleanup + Completion Pass

## Objective
Clean up, normalize, and complete the Tier 1 / Beginner question bank so it is production-ready for the Poker Game Challenge.

---

## Required Outcome
Tier 1 must end this task with:

- exactly **250 total questions**
- exactly **50 questions per level** across Levels 1–5
- per level mix:
  - **30 action**
  - **10 outs**
  - **10 EV**

---

## Scope

### 1) Audit the existing Tier 1 bank
Review all current Tier 1 questions and identify:

- duplicate IDs
- duplicate prompts
- near-duplicate scenarios
- malformed questions
- leftover yes/no or boolean-style questions
- action questions missing `correctAction`
- outs/EV questions missing `choices` or `correctAnswer`
- outs questions missing parsed card data where applicable

Remove or fix bad entries.

---

### 2) Normalize all Tier 1 questions
Ensure every Tier 1 question has the correct structure for its category.

#### Action questions
Must include:
- `category: 'action'`
- player-facing `prompt`
- `correctAction`
- any scenario/hand metadata already used by the runtime

Must not include:
- yes/no answer fields
- malformed choice arrays pretending to be action questions

#### Outs questions
Must include:
- `category: 'outs'`
- player-facing `prompt`
- `choices`
- `correctAnswer`
- card data that can render in `OutsCardDisplay`
  - `heroCards`
  - `boardCards`

Shorten prompts so the card visuals carry the board/hand details where possible.

#### EV questions
Must include:
- `category: 'ev'`
- player-facing `prompt`
- `choices`
- `correctAnswer`

---

### 3) Complete the missing Tier 1 volume
Add enough new Tier 1 questions to reach the full required count:

- Level 1: 50 total
- Level 2: 50 total
- Level 3: 50 total
- Level 4: 50 total
- Level 5: 50 total

Target mix per level:
- 30 action
- 10 outs
- 10 EV

Do not overfill one level and leave another thin.

---

### 4) Maintain difficulty slope across Level 1–5
Tier 1 should become gradually harder across the five Beginner levels.

#### Level 1
Very obvious beginner spots:
- premium opens
- obvious folds
- simple flush draw/open-ended outs
- basic pot-odds questions

#### Level 2
Still easy, slightly more variety:
- decent late-position opens
- basic facing-open spots
- straightforward outs counting
- simple break-even math

#### Level 3
Standard beginner:
- more position-sensitive opens
- suited ace / broadway / pair spots
- mixed draw counting
- realistic but simple EV spots

#### Level 4
Upper beginner:
- some blind defense
- some call vs fold spots
- slightly trickier overcard/draw counting
- a few more nuanced pot-odds scenarios

#### Level 5
Hardest Beginner:
- still teachable and clear
- no solver-style trick spots
- closer action decisions
- layered outs / EV questions
- still easier than Apprentice

---

### 5) Remove prompt clutter from the data
Do not bake tier/level/category prefixes into the prompt text.

Examples to remove from prompt strings:
- `Beginner L2 OUTS:`
- `EV:`
- `ACTION:`

Prompt must contain only player-facing question text.

---

### 6) Improve outs-question visual readiness
For outs questions, favor prompts like:

- `How many outs improve you to a flush by the river?`
- `How many outs pair one of your overcards?`

Do not repeat full hand/board text in the prompt if card assets are already being rendered.

Ensure the adapter/runtime can still render:
- hero hand cards
- board cards

---

### 7) Run validation on the completed Tier 1 bank
Add or use a validation helper to verify:

- total count = 250
- each level count = 50
- each level category mix = 30/10/10
- unique IDs
- unique prompts
- action questions have `correctAction`
- outs/EV questions have `choices` and `correctAnswer`
- outs questions have usable card data
- no yes/no fallback data remains

Fail loudly in development if the bank is off-spec.

---

## Files to inspect/update
Use actual filenames if different, but likely:

- Tier 1 question bank file
- any challenge bank registry/index
- `challengeQuestionAdapter.ts`
- validation helper for challenge banks
- any runtime types if required

---

## Acceptance Criteria

- [ ] Tier 1 contains exactly 250 questions
- [ ] Each Beginner level contains exactly 50 questions
- [ ] Each level contains exactly 30 action, 10 outs, 10 EV
- [ ] Duplicate IDs removed
- [ ] Duplicate/near-duplicate prompts cleaned up
- [ ] No yes/no style questions remain in Tier 1
- [ ] All action questions use `correctAction`
- [ ] All outs/EV questions use valid `choices` and `correctAnswer`
- [ ] Outs questions render correctly with card visuals
- [ ] Prompt text is player-facing only
- [ ] Difficulty rises from Level 1 to Level 5

---

## Deliverable
Reply with:
1. files changed
2. final counts by level
3. final counts by category
4. number of duplicates removed
5. number of new questions added
6. 3 sample Level 1 questions
7. 3 sample Level 5 questions
8. confirmation that Tier 1 validates cleanly