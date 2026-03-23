# TC079 — Gameplay Polish + Mobile UX Pass for Poker Game Challenge

## Objective
Polish the live Tier 1 gameplay experience on mobile and desktop so the challenge feels clean, readable, and responsive during actual play.

---

## Scope

### 1) Tighten gameplay spacing and hierarchy
Review the live screen layout and improve spacing between:

- top progress / challenge number
- level selector
- stats panel
- question panel
- card display
- answer buttons
- result banner

Goal:
- reduce clutter
- make the active question area the visual focus
- avoid cramped stacking on mobile

---

### 2) Improve mobile readability
Review the challenge screen on a real/narrow mobile viewport and adjust:

- prompt font size
- line-height
- panel padding
- button height
- button text size
- spacing between answer choices
- card display scale

Requirements:
- no clipped text
- no crowded controls
- no oversized empty gaps
- no hard-to-tap buttons

---

### 3) Standardize answer-button sizing
Ensure both answer modes look intentional and consistent.

#### Action questions
- Fold / Call / Raise buttons should be large, readable, and evenly spaced

#### Outs / EV questions
- multiple-choice buttons should have consistent height/width
- labels must remain readable
- no awkward wrapping unless unavoidable

---

### 4) Improve result flow between questions
Review the sequence after answering:

- selected answer state
- correct / incorrect feedback
- explanation visibility
- continue button timing/placement

Goal:
- result should feel clear and fast
- no confusing pause
- no visual jumpiness
- explanation should be readable but not overwhelming

---

### 5) Polish SessionSummaryModal
Improve the end-of-session modal UX:

- make score and pass/fail state visually clear
- improve button hierarchy:
  - Retry
  - Next Level
- ensure layout fits cleanly on mobile
- ensure modal does not feel cramped or oversized

---

### 6) Improve level selector presentation
Review `LevelSelectPanel` in the live game screen.

Requirements:
- active level should be obvious
- locked levels should be visually distinct
- selector should not dominate the page
- spacing should feel clean above the stats/gameplay area

---

### 7) Reduce nonessential visual noise
Review the challenge screen for anything that still feels like debug/UI clutter.

Examples:
- over-labeled sections
- too many competing badges
- duplicated information
- unnecessary borders or ornament

Simplify where needed.

---

### 8) Verify animation/transition feel
If there are transitions, verify they are smooth and not distracting.

If none exist, lightly improve state transitions only if easy:
- answer selection
- result reveal
- modal open
- next question load

Do not overbuild animation.

---

### 9) Cross-check mobile + desktop together
After polish changes, verify both:

- desktop still looks good
- mobile is improved
- no regression in gameplay flow
- no layout break between action / outs / EV screens

---

## Files to inspect/update
Use actual filenames if different, but likely:

- `index.tsx` / main challenge screen
- `QuestionPanel.tsx`
- `OutsCardDisplay.tsx`
- `MultiChoiceButtons.tsx`
- `DecisionButtons.tsx`
- `SessionSummaryModal.tsx`
- `LevelSelectPanel.tsx`
- related CSS/module/style files

---

## Acceptance Criteria

- [ ] Gameplay screen is cleaner and less cluttered
- [ ] Prompt text is easy to read on mobile
- [ ] Answer buttons are consistently sized and readable
- [ ] Result flow feels clear and smooth
- [ ] Session summary modal is polished on mobile and desktop
- [ ] Level selector is clear but not visually heavy
- [ ] No regressions in action / outs / EV layouts
- [ ] Desktop and mobile both feel improved

---

## Deliverable
Reply with:
1. files changed
2. summary of visual/UX improvements made
3. mobile-specific improvements
4. any layout simplifications performed
5. before/after screenshots if available