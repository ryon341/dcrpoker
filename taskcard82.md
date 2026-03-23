# TC082 — Tier Completion + Beginner Reward Flow

## Objective
Add a clean Tier 1 completion flow so finishing Beginner Level 5 feels like a milestone and sets up the broader 25-level challenge path.

---

## Scope

### 1) Detect Beginner tier completion
When the player passes Level 5 in the Beginner tier:

- mark Beginner tier as completed
- persist that completion state
- do not re-trigger completion every time Level 5 is replayed

Suggested saved field:
- `completedTiers: string[]`
or similar

---

### 2) Add Beginner completion modal/screen
After passing Beginner Level 5, show a dedicated completion experience instead of only the normal session summary.

Display:
- clear success message
- Beginner tier completed
- encouragement to continue
- button(s):
  - Continue
  - Replay Level 5
  - optionally return to level select

Keep it cleaner and simpler than the final Grand Champion screen.

---

### 3) Unlock next tier path
Prepare progression so Beginner completion unlocks the next tier:

- Apprentice becomes unlocked
- persist that unlocked state
- if tier selection UI does not exist yet, store the state anyway for future use

Suggested saved fields:
- `unlockedTiers`
- `currentTier`

Do not fully build all later tiers yet unless already scaffolded.

---

### 4) Add tier-aware progress storage
Extend saved progress so it is no longer Beginner-only.

Recommended shape:
- `currentTier`
- `unlockedTiers`
- `completedTiers`
- `unlockedLevelsByTier`
- current session state

At minimum, store enough to support:
- current tier
- unlocked tiers
- completed tiers
- unlocked levels for Beginner

---

### 5) Keep existing Level 1–5 flow intact
Do not break current behavior for:
- Retry Level
- Next Level
- Level Select
- refresh/restore
- session summary

The new tier-complete flow should happen only when Beginner Level 5 is passed.

---

### 6) Add simple tier header support
Update the challenge UI so it can show the current tier cleanly.

Examples:
- `Beginner`
- `Apprentice`

Do not clutter the question panel.
A small header/subheader near level/progress is enough.

---

### 7) Prepare final reward hook
Add a clean placeholder integration point for the future Level 25 / Grand Champion reward flow.

Example:
- if final tier + final level completed later, route to final reward instead of normal tier completion modal

Do not implement the full Grand Champion flow yet unless trivial.
Just structure the logic so it will be easy to add.

---

### 8) Validate replay behavior after tier completion
After Beginner is completed:
- replaying Level 5 should still work
- completion modal should not endlessly re-fire unless intended
- saved progress should remain stable after refresh

---

## Files to inspect/update
Use actual filenames if different, but likely:

- `index.tsx`
- `progressStorage.ts`
- `SessionSummaryModal.tsx`
- new `TierCompleteModal.tsx` or similar
- any progress/session types

---

## Acceptance Criteria

- [ ] Passing Beginner Level 5 marks Beginner as completed
- [ ] Beginner completion state is persisted
- [ ] Apprentice unlock state is persisted/prepared
- [ ] Tier completion modal/screen appears cleanly
- [ ] Existing level/session flow still works
- [ ] Refresh after completion does not break progress
- [ ] Replay after completion behaves correctly
- [ ] Code is structured for future Level 25 Grand Champion flow

---

## Deliverable
Reply with:
1. files changed
2. saved progress shape after update
3. how Beginner completion is detected
4. how next-tier unlock is stored
5. how replay behaves after Beginner is completed