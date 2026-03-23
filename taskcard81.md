# TC081 — Progress Persistence + Resume Hardening for Poker Game Challenge

## Objective
Harden saved progress and session resume behavior so the challenge survives refreshes, mobile reopen, and level switching without corrupting state or confusing the player.

---

## Scope

### 1) Define the saved state contract
Audit the current saved structure and make it explicit/stable.

Saved fields should include only what is needed:
- unlockedLevels
- currentLevel
- sessionCorrect
- sessionTotal
- currentQuestionId or currentQuestionIndex
- sessionQuestionIds (current 12-question session pool)
- any timestamp/version field if helpful

Do not save unnecessary UI-only transient state.

---

### 2) Add versioned localStorage schema
Wrap saved progress in a versioned object.

Example:
- `version`
- `data`

If storage is missing, invalid, or old:
- safely reset to defaults
- do not white-screen
- do not preserve malformed state

---

### 3) Persist active session pool
Right now progression may persist counters, but the current session also needs a stable question set.

Required:
- save the exact current session question IDs
- save current question position
- on reload, restore the same in-progress session

This prevents:
- question reshuffle after refresh
- score mismatch
- duplicate/repeated questions after reopen

---

### 4) Restore safely on app load
On load:
- validate saved data
- rebuild runtime questions from saved IDs
- if any question ID is missing/invalid, discard only the bad session and start a clean one
- keep unlockedLevels if valid

Do not let one bad saved field corrupt the entire challenge.

---

### 5) Handle refresh/reopen edge cases
Test and fix:
- refresh during question 1
- refresh after answering but before continue
- refresh halfway through session
- refresh on summary modal
- reopen on mobile after app/browser suspension
- switch level, then refresh

Behavior should be predictable and clean.

---

### 6) Add "Reset Progress" control
Add a small user-facing reset option somewhere appropriate.

Requirements:
- clears saved challenge progress
- resets unlocked levels back to Level 1 only
- clears in-progress session state
- returns player to clean starting state

Use a confirm step to avoid accidental reset.

---

### 7) Protect against stale or impossible session state
If saved state says things like:
- sessionTotal > 12
- sessionCorrect > sessionTotal
- current question index out of bounds
- unlockedLevels contains invalid values
- currentLevel is locked

then normalize/fix automatically.

---

### 8) Keep summary modal behavior stable after restore
If the user refreshes while the session summary is open:
- restore to a valid summary state, or
- cleanly finish/reset the session

Do not resume into a broken modal or hidden blocked state.

---

### 9) Dev logging for restore failures
In development only, log restore problems clearly:
- invalid schema
- missing question IDs
- normalized bad values
- session reset fallback

No noisy logs in production.

---

## Files to inspect/update
Use actual filenames if different, but likely:

- `progressStorage.ts`
- `index.tsx`
- any session/question selection utility
- `SessionSummaryModal.tsx`
- level-select / reset control component if needed

---

## Acceptance Criteria

- [ ] Refreshing mid-session restores the same session cleanly
- [ ] Mobile reopen does not corrupt the session
- [ ] Saved state is versioned and validated
- [ ] Bad saved state falls back safely
- [ ] Reset Progress works correctly
- [ ] No white-screen or broken modal state after restore
- [ ] Desktop and mobile both tested

---

## Deliverable
Reply with:
1. files changed
2. saved-state shape
3. restore edge cases tested
4. fallback/reset behaviors added
5. confirmation that the same session question set survives refresh