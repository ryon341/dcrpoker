# TC082 — Beginner Tier Completion + Apprentice Unlock Flow

## Objective
Add a proper Tier 1 completion flow so that passing Beginner Level 5 marks the Beginner tier complete, shows a dedicated completion modal, and unlocks Apprentice for future progression.

---

## Scope

### 1) Detect Beginner completion
When the player passes Level 5 in the Beginner tier:

- mark Beginner as completed
- persist that state
- do not repeatedly re-award completion on every replay

---

### 2) Add tier-aware progress fields
Extend saved progress to support tier progression.

Add fields such as:
- `currentTier`
- `unlockedTiers`
- `completedTiers`
- `unlockedLevelsByTier`

Keep existing Beginner level progress working.

---

### 3) Unlock Apprentice
On first successful Beginner completion:

- add `apprentice` to `unlockedTiers`
- persist it
- keep `beginner` unlocked by default

If tier-selection UI does not exist yet, store the unlock state anyway.

---

### 4) Add Beginner completion modal
After passing Beginner Level 5, show a dedicated tier-complete modal instead of only the normal session summary.

Modal should include:
- clear success headline
- message that Beginner is complete
- button to continue
- button to replay Level 5
- optional button to return to level select

Keep it simpler than the final Grand Champion reward screen.

---

### 5) Preserve current flow for other levels
Do not break existing behavior for:
- Retry Level
- Next Level
- Level Select
- session summary
- refresh/restore

The tier-complete modal should only trigger when Beginner Level 5 is passed.

---

### 6) Add current tier display
Show the current tier cleanly in the live challenge UI.

Examples:
- `Beginner`
- `Apprentice`

Keep it subtle and separate from the question prompt.

---

### 7) Prepare future final reward hook
Structure the completion logic so that later:
- if final tier + final level is completed,
- the app can route to the Grand Champion reward flow instead of standard tier completion

Do not implement the full Level 25 reward yet.
Just make the logic easy to extend.

---

### 8) Validate replay behavior after completion
After Beginner is completed:

- replaying Level 5 should still work
- the Beginner completion modal should not endlessly re-fire unless intentionally triggered by a fresh completion event
- refresh/reopen should preserve completed/unlocked tier state

---

## Files to inspect/update
Use actual filenames if different, but likely:

- `index.tsx`
- `progressStorage.ts`
- `SessionSummaryModal.tsx`
- new `TierCompleteModal.tsx`
- any progress/session types

---

## Acceptance Criteria

- [ ] Passing Beginner Level 5 marks Beginner as completed
- [ ] Beginner completion is persisted
- [ ] Apprentice unlock is persisted
- [ ] Beginner completion modal appears correctly
- [ ] Existing level/session flow still works for Levels 1–4
- [ ] Replay of Level 5 still works after completion
- [ ] Refresh/reopen preserves tier completion state
- [ ] Code is structured for future final reward flow

---

## Deliverable
Reply with:
1. files changed
2. updated saved progress shape
3. how Beginner completion is detected
4. how Apprentice unlock is stored
5. replay behavior after Beginner completion