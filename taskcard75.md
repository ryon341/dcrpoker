# TC069 — Game Challenge UI Refactor: Category-Based Layouts + Outs Card Display + Clean Answer Modes

## Objective
Refactor the Poker Game Challenge question screen so it uses **category-based layouts** instead of forcing all question types into one shared UI.

This task should:
1. clean up the prompt area
2. remove visible tier/level/category clutter from player-facing question text
3. fix answer rendering so multiple-choice questions no longer use Yes/No-style visuals
4. add a dedicated **card-display layout for OUTS questions** using existing card assets
5. preserve the current global game background/theme without creating new background graphics

This is a **UI/UX architecture pass** for the challenge engine.

---

## Product Decisions Locked In

### Global visual rule
- Keep the existing overall game background/theme
- Do **not** create separate background images for each question type

### Layout rule by question type
- **Action questions** → text scenario layout + Fold / Call / Raise buttons
- **Outs questions** → short prompt + rendered hero/board cards + multiple-choice buttons
- **EV / odds questions** → short math prompt + multiple-choice buttons

### Prompt rule
- Player-facing prompt should show **only the actual question**
- Do **not** show tier / level / category metadata inside the visible question prompt

### Answer-mode rule
- **Action questions** use action buttons only
- **Outs / EV / odds questions** use multiple-choice buttons only
- No fallback to Yes/No visuals for challenge questions unless a future question type explicitly requires boolean mode

---

## Problems Being Solved

### Problem 1 — Prompt clutter
The UI is displaying things like:
- Beginner
- L3
- OUTS
inside the visible question prompt

This wastes space and looks like debug output.

### Problem 2 — Wrong answer button styling
Multiple-choice questions are still using button visuals derived from old Yes/No buttons, which makes answer text hard to read.

### Problem 3 — Outs questions are too text-heavy
The prompt currently includes card information in text, even though card assets already exist and should be shown visually.

### Problem 4 — One-layout-fits-all is failing
The screen currently tries to present action, outs, and EV questions with the same layout, resulting in crowding and poor mobile readability.

---

## Required Changes

## 1) Create category-based question layouts
Refactor the challenge question screen so layout is selected by question category / answer mode.

### Required render paths
- `ActionQuestionLayout`
- `OutsQuestionLayout`
- `EvQuestionLayout` (or `MultipleChoiceQuestionLayout` if EV and odds share one generic layout)

Use actual file naming consistent with the project if needed.

### Routing logic
At render time:
- if question is action → render action layout
- if question is outs → render outs layout
- if question is ev/odds → render math layout

Do not use one single shared prompt/answer block for all categories.

---

## 2) Remove visible metadata from question prompt
The user-facing question prompt must not include:
- tier name
- level label
- category label
- internal debug prefixes

### Example
From:
`Beginner L3 OUTS: You hold Ac Kc on 9d 4s 2h. How many outs pair one of your overcards?`

To:
`How many outs pair one of your overcards?`

If metadata is still useful:
- keep it in dev-only logs
- or a hidden debug/dev label outside production gameplay UI

Do not show it in the prompt card.

---

## 3) Add structured card rendering for OUTS questions
For OUTS questions, use existing card assets instead of describing all cards only in text.

### Update data model as needed
Ensure outs questions can provide structured card info:

```ts
heroCards?: string[];   // e.g. ['Ac', 'Kc']
boardCards?: string[];  // e.g. ['9d', '4s', '2h']