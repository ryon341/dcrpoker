TC074 — Final Cleanup and Release Hardening for Poker Challenge
Objective

Perform the final cleanup pass on Poker Challenge now that the 25-level challenge system is operational.

This task is a cleanup / hardening pass only. Do not add new features. Do not regenerate content. Do not redesign the UI.

Goals

Clean up remaining technical debt and prepare the challenge feature for stable ongoing use by:

removing vestigial legacy scoring/adapter assumptions where safe
cleaning duplicate / stray generated files outside the canonical source tree
tightening tier-bank metadata warnings where practical
running one final in-browser smoke pass
documenting any remaining non-blocking limitations
Scope

This task must focus only on:

challenge cleanup
challenge code hygiene
repo hygiene for generated tier files
final QA

This task must not:

redesign screens
change scoring rules again
rebuild the question banks from scratch
refactor unrelated app areas
change core ladder behavior unless a cleanup reveals a real bug
Part 1 — Remove or isolate vestigial legacy compatibility
Objective

Reduce leftover legacy assumptions from the old hand-based challenge model, but only where safe.

Audit targets

Inspect:

src/components/poker-challenge/challengeQuestionAdapter.ts
app/(protected)/poker-challenge/index.tsx
app/(protected)/poker-challenge/daily.tsx
any helper functions still depending on:
heroWins
old hand-result-only assumptions
hardcoded action-only behavior for non-action questions
Required cleanup

For non-action questions (outs, ev):

remove fake or misleading compatibility values if no longer required
ensure correctness and score display are driven by actual answer correctness
keep compatibility only where required to prevent crashes
Rule

Do not break the current UI flow just to remove a field.
Prefer:

isolating legacy fields
renaming local variables for clarity
adding comments documenting compatibility behavior

If heroWins must still exist in adapted objects for certain UI paths, leave it, but document it clearly and ensure it is never the source of truth for non-action correctness.

Part 2 — Clean stray generated files outside canonical source tree
Objective

Remove duplicate / scratch generated tier files that are outside the real challenge source folder.

Required work

Find any root-level or duplicate generated files such as:

tier1Questions.ts
tier2Questions.ts
tier3Questions.ts
tier4Questions.ts
tier5Questions.ts
any matching .json scratch outputs

If duplicates exist outside the canonical source folder:

delete them from the workspace, or
move them to a clearly non-runtime archive location if they must be retained
Rule

Keep only the canonical source-of-truth copies used by the app.

Do not remove the real app source copies.

Part 3 — Tighten tier-bank metadata warnings where practical
Objective

Reduce validator noise without destabilizing the system.

Known warnings
Tier 2–5 category distribution differs from the cleaner ideal
carryover lineage warnings remain
Required work

Do a light cleanup only:

fix obviously bad carryover tags if easy and low-risk
remove incorrect from_tier_* references when clearly wrong
keep tier-bank content unchanged unless a metadata fix is trivial and safe
Important

Do not rewrite large portions of the bank content in this task.

This is metadata cleanup, not content redesign.

If category distribution imbalance is structural to the generated banks, leave it alone and document it as a known non-blocking limitation.

Part 4 — Final in-browser smoke pass
Objective

Do one human-style app QA pass in the running app.

Required checks
Standard challenge
load challenge page successfully
answer one action question
answer one outs question
answer one ev question
confirm score updates correctly
confirm continue flow works
Daily challenge
load daily page successfully
answer at least one daily question
confirm answer storage/result behavior still works
Progression / completion
verify a tier-boundary progression case still works
verify champion-complete state still displays correctly after reload if already unlocked
Rule

If a real bug is found during smoke test, fix it only if:

it is directly related to challenge cleanup/hardening
the fix is small and localized

Do not open new broad workstreams from smoke-test findings.

Part 5 — Document remaining non-blocking limitations

At the end, report any remaining issues that are not worth fixing in this cleanup pass, for example:

outs/ev questions intentionally do not use hand-reveal animations
category distribution imbalance in Tiers 2–5
legacy compatibility fields retained in adapter for safety

This should be concise and practical.

Acceptance criteria
Cleanup
no duplicate scratch/generated tier files remain outside canonical source tree
vestigial legacy compatibility is reduced or documented
no misleading non-action scoring logic remains
Metadata
obviously bad carryover tag references are fixed if low-risk
validator warnings are reduced where practical, or clearly documented if left as-is
QA
challenge page works in browser
daily page works in browser
scoring still matches current rules
champion-complete state still works
Safety
no TypeScript/runtime errors introduced
no challenge regression
no unrelated refactors
Deliverables

Return:

files changed
files deleted or moved during cleanup
notes on adapter/legacy cleanup
validator warning status after cleanup
browser smoke-test summary
remaining non-blocking limitations, if any
Stop condition

Stop when:

challenge cleanup is complete
duplicate/generated workspace clutter is removed
final smoke pass is done
remaining limitations are documented

Do not continue into new feature work after this task.