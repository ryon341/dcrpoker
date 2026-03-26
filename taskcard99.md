TC099 — Admin / Dev Review Surface

Objective
Build a practical review surface for the Challenge Game so you can inspect weak questions, review analytics, and quarantine or override items without hunting through files manually.

Why this is next
TC098 created the underlying live-ops mechanism:

quarantine by ID
override by ID
central reviewed-bank runtime layer

The missing piece is usability. Right now the system is powerful but still developer-friction heavy. TC099 gives you a lightweight operational console inside the app for content review.

Scope
This is a dev/admin-only surface.
Do not build a full CMS.
Do not add backend auth/admin roles yet.
This should be local, internal, and fast to use during testing.

PRIMARY GOALS
View weak questions from analytics
Inspect a question by ID
See whether it is active, quarantined, or overridden
Quarantine a question quickly
Add a simple inline override payload for a question
Export a copy-pasteable registry patch for checked changes

That last item matters: because the actual source of truth is still code, the tool should help produce code-ready changes rather than invent a complex persistence system.

ACCEPTANCE CRITERIA
Review Surface
A dev-only Review screen/panel exists and can be opened from the Challenge area.
The screen can show:
most-missed questions
easiest questions
question lookup by ID
tier/category filters
Question Inspection
Selecting a question shows:
question ID
tier
level
category
prompt
answer data
current review status
analytics summary for that question if available
Review Actions
Reviewer can mark a question:
active
quarantined
overridden
Reviewer can enter:
reason
notes
For override mode, reviewer can enter a replacement payload in a simple structured editor or JSON textarea.
Safe Behavior
Changes are stored in a local draft layer only.
Live gameplay is not permanently changed until the reviewer explicitly exports or applies the draft locally for the session.
Invalid override payloads are rejected with a readable error.
Export
The tool can generate a copy-pasteable patch object for QUESTION_REVIEW_REGISTRY.
Export includes:
questionId
status
reason
notes
replacementQuestion if applicable
TypeScript / Stability
No new TypeScript errors.
Challenge mode and gauntlet still function.
Dev screen is hidden in production.
DESIGN APPROACH
Keep the source of truth in code

Do not write directly into the checked-in registry file at runtime.

Instead:

load current review registry
allow draft edits in local state / AsyncStorage
let the reviewer export the changes as code

This keeps the system safe and versionable.

IMPLEMENTATION PLAN
Part A — Build Dev Review Screen

Create a dev-only screen/component, for example:

ChallengeReviewScreen.tsx

This can be:

a dedicated route/screen in the poker challenge area
or a modal/panel opened from a hidden dev button

Recommended sections:

Filters/search
Question list
Question detail pane
Draft review editor
Export box
Part B — Data Sources

The review screen should combine these sources:

1. Reviewed/raw question banks

Use:

raw bank data
reviewed bank data
review registry entries
2. Analytics summaries

Use:

top missed questions
easiest questions
attempts / accuracy by question

If current analytics helpers do not expose per-question stats directly, extend them.

Needed minimum per-question metrics:

type QuestionPerformanceSummary = {
  questionId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  tier?: string;
  category?: string;
};
Part C — Review Editor Draft Model

Create a draft structure, e.g.:

type ReviewDraftEntry = {
  questionId: string;
  status: 'active' | 'quarantined' | 'overridden';
  tier: string;
  category: string;
  reason: string;
  notes?: string;
  replacementQuestionJson?: string;
};

Drafts should live in:

component state
optionally persisted in AsyncStorage so work is not lost

Suggested helper file:

challengeReviewDraftStorage.ts

Functions:

saveReviewDrafts()
loadReviewDrafts()
clearReviewDrafts()
Part D — Review Actions

For a selected question, support:

Action 1 — Mark Active

Removes quarantine/override for that ID in draft layer.

Action 2 — Quarantine

Sets:

status = quarantined
reason required
Action 3 — Override

Sets:

status = overridden
reason required
replacement payload required

Before accepting override draft:

parse payload
validate with isValidReplacementQuestion()
show error if invalid
Part E — Session Preview Mode

Allow the draft registry to be applied in-memory for the current dev session.

This gives immediate testing without touching checked-in code.

Suggested flow:

“Preview Draft Changes” button
builds merged registry = checked-in registry + local draft entries
applies review layer in memory
updates review screen stats
optional gameplay preview for session only

Keep this dev-only.

If this becomes too invasive for runtime wiring, keep preview limited to the review screen and export only. But preview is preferred if clean.

Part F — Export Code Generator

Add a helper that produces a copy-pasteable object snippet for the registry.

Example output:

{
  "master_ev_042": {
    questionId: "master_ev_042",
    status: "quarantined",
    tier: "Master",
    category: "ev",
    reason: "Too ambiguous; miss rate 92% across 13 attempts",
    notes: "Revisit after next EV wording pass"
  }
}

Or multiple entries:

export const QUESTION_REVIEW_REGISTRY_PATCH = {
  ...
};

The important thing is that the reviewer can paste it into the real registry file.

Also useful:

“copy all drafts”
“copy selected draft”
UI REQUIREMENTS

Keep it simple and usable:

searchable by question ID/prompt text
filters:
tier
category
review status
hardest/easiest only
monospaced display for IDs/JSON
readable prompt/answer detail

Suggested minimal layout:

left: filtered question list
right: selected question details + draft editor + export

No need for polished production visuals. Utility first.

FILES TO ADD

Suggested:

ChallengeReviewScreen.tsx
challengeReviewDraftStorage.ts
challengeReviewExport.ts

Optional:

challengeReviewSelectors.ts
FILES TO MODIFY

Likely:

challenge area navigation/screen entry
analytics storage/helpers if per-question summaries need exposure
data/index.ts exports
possibly review registry helpers for draft-merging support
QA CHECKLIST
Open review screen in dev build.
Search for a known question ID.
Inspect its prompt and answer structure.
View analytics data for that question.
Mark one question quarantined in draft.
Mark one question overridden in draft.
Try an invalid override and confirm readable validation error.
Export registry patch and confirm output is copy-pasteable.
Refresh and confirm drafts persist if AsyncStorage backing is implemented.
Confirm feature is hidden in production.
Confirm challenge/gauntlet still load normally.
WHAT VS CODE SHOULD RETURN
Files added
Files modified
Whether per-question analytics summary had to be added
Whether draft persistence was added
Example exported registry patch
Whether session preview mode was implemented
Any UI or validation caveats
DEFINITION OF DONE

TC099 is complete when:

there is a dev/admin review surface
weak questions can be inspected and drafted for quarantine/override
overrides are validated
code-ready patch output can be exported
no gameplay regressions occur
WHAT COMES AFTER TC099

After this, you have a real maintenance workflow.

Best next card:
TC100 — Promotion / Season System for Challenge Content

That could introduce:

rotating challenge sets
weekly gauntlets
featured categories
limited-time scoreboards

But TC099 is the right operational step first.