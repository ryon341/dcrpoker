# TC084 — Build Tier 2 (Apprentice) 250-Question Bank

## Objective
Create the full **Tier 2 / Apprentice** question bank for the Poker Game Challenge with **250 total questions**, distributed across **Levels 6–10**, with the required carryover mix from Beginner.

---

## Required Outcome

Tier 2 must end this task with:

- exactly **250 total questions**
- exactly **50 questions per level** across Levels **6, 7, 8, 9, 10**
- per level mix:
  - **30 action**
  - **10 outs**
  - **10 EV**

---

## Carryover Rule

Tier 2 must follow this rule:

- **80% Apprentice-native content**
- **20% carryover from Tier 1 / Beginner**

Apply this at the **level pool** level.

### Per level target
Each Level 6–10 should contain:

- **40 Apprentice-native questions**
- **10 Beginner carryover questions**

Carryover questions should be selected from Tier 1 in a way that still feels appropriate for the difficulty band.

Do not just copy random beginner questions blindly.

---

## Scope

### 1) Create Tier 2 bank file
Add a new Apprentice question bank file.

Suggested filename:
- `tier2ApprenticeQuestions.ts`

Export format should match the Tier 1 bank and existing runtime expectations.

---

### 2) Build Levels 6–10
Create these five Apprentice levels:

- Level 6
- Level 7
- Level 8
- Level 9
- Level 10

Each level must contain exactly **50 questions**.

---

### 3) Maintain category mix
Per level:

- **30 action**
- **10 outs**
- **10 EV**

Across Tier 2 total:

- **150 action**
- **50 outs**
- **50 EV**

---

### 4) Apprentice difficulty profile
Tier 2 should be clearly harder than Beginner but still accessible.

#### Action questions
Add more of:
- facing opens by position
- button vs cutoff / blind defense spots
- 3-bet or call decisions in clean spots
- more stack-depth awareness
- more realistic preflop pressure

Do not overload with solver-only trick spots.

#### Outs questions
Add more of:
- open-enders
- gutshots
- flush draws
- combo-draw basics
- overcards + draws
- slightly trickier board textures

#### EV questions
Add more of:
- simple pot odds comparisons
- break-even percentages
- direct call/fold EV decisions
- slightly more realistic pot sizes

---

### 5) Keep prompts player-facing only
Do not include prefixes like:
- `Apprentice L7 ACTION:`
- `EV:`
- `OUTS:`

Prompt text must remain clean and player-facing.

---

### 6) Make outs questions visual-ready
For all outs questions, ensure data supports card rendering:

- `heroCards`
- `boardCards`

If the adapter currently derives these from prompt text, ensure the prompts are parseable.
If explicit fields are supported, prefer explicit fields.

---

### 7) Apply carryover cleanly
Carryover questions must come only from the immediately previous tier:

- Tier 2 may include Tier 1 carryover
- no invented cross-tier shortcuts

Mark or organize the data clearly so we can tell:
- which questions are Apprentice-native
- which are Beginner carryover

Suggested:
- `sourceTier: 'apprentice' | 'beginner'`

---

### 8) Validate the completed Tier 2 bank
Add or extend validation so Tier 2 checks:

- total = 250
- each level = 50
- category mix = 30/10/10
- carryover mix = 40 native / 10 prior-tier carryover per level
- unique IDs
- unique prompts
- valid answer fields
- parseable outs-card data

---

## ID Convention

Use stable IDs such as:

- `apprentice-l6-action-001`
- `apprentice-l6-outs-001`
- `apprentice-l6-ev-001`

If carryover questions are copied into Tier 2, ensure their Tier 2 IDs are still unique and deterministic.

---

## Files to inspect/update
Use actual filenames if different, but likely:

- new `tier2ApprenticeQuestions.ts`
- challenge bank registry/index
- validation utility/script
- any shared challenge question types if `sourceTier` is added

---

## Acceptance Criteria

- [ ] Tier 2 contains exactly 250 questions
- [ ] Levels 6–10 each contain exactly 50 questions
- [ ] Each level contains exactly 30 action, 10 outs, 10 EV
- [ ] Each level contains exactly 40 Apprentice-native and 10 Beginner carryover questions
- [ ] Tier 2 prompts are player-facing only
- [ ] Outs questions are visual-ready
- [ ] IDs are unique
- [ ] Prompts are unique
- [ ] Validation passes cleanly

---

## Deliverable
Reply with:
1. files changed
2. counts by level
3. counts by category
4. counts by native vs carryover
5. number of new Apprentice-native questions created
6. number of Beginner carryover questions included
7. 3 sample Level 6 questions
8. 3 sample Level 10 questions
9. confirmation Tier 2 validates cleanly