TC098 — Question Review / Quarantine System

Objective
Add a lightweight quality-control layer that lets you flag, suppress, replace, or override bad questions by ID without having to rewrite the generator or manually edit generated banks.

Why this is next
You now have:

full generated pipeline
validation
analytics
first calibration pass

The next practical need is operational control. When a question is ambiguous, too easy, too hard, or just badly worded, you need a way to remove it from live play immediately and optionally substitute a corrected version.

This task makes the system maintainable.

CORE IDEA

Introduce a review layer between generated banks and runtime selection.

That layer should support:

quarantine by question ID
optional replacement question by original ID
notes/reason metadata
scope by tier and category
dev report so you can see what is suppressed

Generated content remains the source of truth, but the review layer can filter or patch bad items at runtime.

ACCEPTANCE CRITERIA
A question can be marked as quarantined by ID.
Quarantined questions are excluded from:
challenge mode
gauntlet mode
A quarantined question may optionally be replaced by an override question.
Override questions preserve the original category/tier contract so gameplay does not break.
The review layer is applied centrally, not scattered through the app.
A simple typed registry exists for:
quarantined question IDs
optional replacements
reason/status metadata
A dev-only report shows:
total quarantined
total overridden
affected tiers/categories
Validation still passes after the review layer is applied.
No new TypeScript errors.
No progression, scoring, or rendering regressions.
WHAT THIS ENABLES

After TC098 you can:

kill a bad question instantly
patch wording for one question without regenerating a whole tier
keep a controlled quarantine list while continuing calibration
later add a review workflow from analytics output
IMPLEMENTATION PLAN
Part A — Add Review Registry

Create a new file, for example:

challengeQuestionReviewRegistry.ts

Suggested structure:

export type QuestionReviewStatus =
  | 'active'
  | 'quarantined'
  | 'overridden';

export type ReviewedQuestionEntry = {
  questionId: string;
  status: QuestionReviewStatus;
  tier: string;
  category: string;
  reason: string;
  notes?: string;
  replacementQuestion?: ChallengeQuestion;
};

Then export a registry like:

export const QUESTION_REVIEW_REGISTRY: Record<string, ReviewedQuestionEntry> = { ... };

Keyed by original questionId.

Part B — Add Review Layer Helper

Create helper(s) such as:

applyQuestionReviewLayer(bank)
applyReviewToAllBanks()
getReviewedQuestionById(id)

Rules:

active → unchanged
quarantined → excluded
overridden with replacement → replacement used in place of original
overridden without replacement → treated as quarantined, but warn in dev

Important: this should happen once, centrally, near the bank registry.

Part C — Centralize Runtime Usage

Update the runtime registry so all gameplay reads from the reviewed bank set, not raw generated banks.

For example:

raw banks remain exported for validation/debug
reviewed banks become the runtime source for:
challenge selection
gauntlet selection

This avoids sprinkling quarantine logic through selectors and components.

Part D — Add Compatibility Guards

When applying a replacement:

ensure replacement has valid:
id
tier
level
category
prompt
answer structure required by that category

If replacement violates the expected contract:

skip it
log a dev warning
quarantine original instead
Part E — Add Review Report

Create a small dev-only report helper, for example:

challengeQuestionReviewReport.ts

Output:

total entries in registry
quarantined count
overridden count
tier breakdown
category breakdown
any invalid replacement warnings

This should be console-only for now.

Part F — Validation Integration

Extend validation flow or add a separate helper to check the reviewed runtime banks.

Need to confirm:

reviewed bank is still playable
no tier is missing too many questions
no level falls below safe minimum after quarantine

Recommended rule:

warning if a level drops below 45
error if a level drops below 40

At this stage, do not overbuild auto-refill. Just detect dangerous depletion.

SUGGESTED FILES
New
challengeQuestionReviewRegistry.ts
challengeQuestionReviewReport.ts
Modified
challengeQuestionBankRegistry.ts
challengeSelector.ts if necessary, but prefer not
data/index.ts
QA CHECKLIST
Add one fake quarantined question ID and confirm it never appears.
Add one override question and confirm it appears correctly.
Verify challenge mode still loads.
Verify gauntlet still loads.
Run validation on reviewed banks.
Confirm no level/tier is dangerously depleted.
Confirm no new TypeScript errors.
WHAT VS CODE SHOULD RETURN
Files added
Files modified
How the review layer is applied
Example quarantined question ID tested
Example overridden question ID tested
Reviewed-bank validation summary
Any depletion warnings found
DEFINITION OF DONE

TC098 is complete when:

bad questions can be quarantined or replaced by ID
runtime uses reviewed banks centrally
reviewed banks still validate
gameplay remains stable