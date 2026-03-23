# TC078 — Wire Tier 1 Into Live Progression (Levels 1–5 Playable)

## Objective
Connect the completed Tier 1 (Beginner) question bank to the live game so users can play Levels 1–5 end-to-end with proper progression, scoring, and no repetition issues.

---

## Scope

### 1) Connect Tier 1 to challenge engine
Ensure the game pulls questions using:

- `tier: 'beginner'`
- `level: 1–5`

From:
- `tier1BeginnerQuestions.ts`

No fallback to legacy question sources.

---

### 2) Level-based question selection
When a user selects or starts a level:

- Load only questions where:
  - `tier === 'beginner'`
  - `level === selectedLevel`

Each level should use its own pool of **50 questions**.

---

### 3) Anti-repeat system (critical)
Implement or confirm:

- shuffle questions on session start
- no immediate repeats
- no duplicate question IDs in a session
- use full 50-question pool before reshuffle

Suggested:
- shuffled array per session
- pointer index progression

---

### 4) Session flow (per level)
Each level should behave as:

- start at question 1
- progress sequentially
- show result after each answer
- continue to next question

Define:
- total questions per session (recommend 10–15 per play session, not all 50)

Example:
- randomly sample 12 from 50 per run

---

### 5) Scoring system
Implement basic scoring:

- +1 per correct answer
- track:
  - current score
  - total answered

At end of session:
- show score summary
- example:
  - "9 / 12 correct"

---

### 6) Level completion logic
Define completion rule:

Minimum requirement (recommended):
- complete a session (e.g., 10–15 questions)

Optional (better):
- require ≥70% correct to pass

If passed:
- unlock next level

If failed:
- allow retry

---

### 7) Level progression tracking
Persist user progress:

Store:
- highest unlocked level
- current level progress

Use:
- localStorage (for now)

Example key:
- `dcr_challenge_progress`

---

### 8) UI updates for progression
Add or confirm:

- level select screen shows:
  - Level 1–5
  - locked/unlocked state

- current level indicator during play:
  - "Level 3"
  - or progress bar

---

### 9) End-of-level screen
After session ends:

Display:
- score
- pass/fail (if rule applied)
- buttons:
  - Retry Level
  - Next Level (if unlocked)

---

### 10) Stability checks
Ensure:

- no crashes on empty pools
- no malformed question breaks session
- adapter always returns valid runtime object
- mobile + desktop both work

---

## Files to inspect/update

- challenge engine / controller (index.tsx)
- level selection UI
- session state logic
- localStorage progress handler
- question selection utilities

---

## Acceptance Criteria

- [ ] Tier 1 Levels 1–5 are playable
- [ ] Each level pulls correct 50-question pool
- [ ] No repeated questions within a session
- [ ] Score is tracked and displayed
- [ ] Level progression unlocks correctly
- [ ] Progress persists across reload
- [ ] Mobile and desktop both work cleanly

---

## Deliverable

Reply with:
1. files changed
2. how question selection works (shuffle/sample logic)
3. session length per level
4. progression rule (pass threshold or not)
5. confirmation no repeats in session
6. confirmation progress persistence works