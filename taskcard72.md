TC072 — Finish Progression, Final Completion, and Mixed-Question Scoring
Objective

Complete the remaining operational work for Poker Challenge so the full 25-level ladder works correctly end to end.

This task is narrowly scoped to:

progression across all 25 levels
Level 25 final completion / champion unlock
correct scoring for action, outs, and ev
persistence / reload verification

Do not redesign UI or refactor unrelated files.

Current known state

Already completed:

Tier 1–5 banks exist
tier registry exists
selector reads tier banks
daily challenge reads tier banks
adapter exists for mixed question types
grandChampionUnlocked exists in storage shape
champion modal/image support exists

Still unfinished / not fully verified:

full ladder progression 1 → 25
tier boundary transitions
Level 25 final stop condition
non-action correctness still relies too much on legacy heroWins
persistence/reload QA not fully hardened
Scope

This task must:

verify and fix challenge progression from Level 1 through Level 25
prevent invalid advancement past Level 25
correctly unlock and persist champion completion
separate answer correctness from legacy heroWins semantics
preserve existing UI with minimal targeted edits only
verify reload/persistence behavior

This task must not:

regenerate question banks
modify challenge content
redesign layouts
add fake card/runout data
refactor unrelated app areas
Required work
1) Audit the main challenge progression flow

Inspect the main challenge route and any related storage/progression helpers.

Find and verify:

where current level is read
where a correct answer marks a level complete
where next level is calculated
where completion is persisted
where final modal is triggered

Likely files include:

app/(protected)/poker-challenge/index.tsx
challenge progress storage/helper files
any modal/completion helper
any route/state helpers used by challenge mode
2) Fix global level progression

Ensure the standard challenge route behaves exactly as follows:

completing Level 1 unlocks/advances to 2
completing Level 5 advances to 6
completing Level 10 advances to 11
completing Level 15 advances to 16
completing Level 20 advances to 21
completing Level 25 does not advance to 26

Use existing tier registry helpers; do not duplicate mapping logic if helpers already exist.

3) Implement / verify Level 25 final completion

When the user correctly completes Level 25:

do not set current level to 26
persist final completion state
set grandChampionUnlocked = true (or existing equivalent final-complete flag)
show the final champion completion modal/state
ensure reload still recognizes the user as completed / champion unlocked

Use the existing reward image/modal infrastructure already in the repo.

If there is already a completion modal component, reuse it rather than creating a new one.

4) Fix mixed-question correctness handling

Current legacy flow still uses heroWins in places. That must be cleaned up.

Required rule

Correctness must be computed from the actual question type:

action
correct iff selected answer === correctAction
outs
correct iff selected answer === correctAnswer
ev
correct iff selected answer === correctAnswer
Important

For non-action questions:

do not use heroWins as the source of truth for correctness
if heroWins must remain present temporarily for compatibility, isolate it so it does not control scoring logic
5) Fix result/stat recording for non-action questions

Audit any place where results are stored or summarized.

Examples:

wins/losses
correct/incorrect counts
daily answer summaries
challenge history entries
outcome text

For outs and ev questions:

store correctness as correctness
do not incorrectly treat them as poker-hand “wins”

If legacy stats shape forces a field to exist, keep compatibility minimal, but ensure real correctness logic is independent.

6) Verify persistence / reload behavior

Confirm and fix:

current challenge level survives reload
progress survives reload
champion unlock survives reload
no invalid or stale state after finishing a level and refreshing
no invalid next-level state after Level 25 completion

Do not overengineer. Use the existing storage approach already in the app.

7) Keep UI changes minimal

Only make targeted edits needed to support:

correct result handling
final completion modal
safe mixed-question behavior

Do not redesign components.

Acceptance criteria
Progression
Level 1 → 2 works
Level 5 → 6 works
Level 10 → 11 works
Level 15 → 16 works
Level 20 → 21 works
Level 25 completes without creating Level 26
Final completion
completing Level 25 sets champion/final completion state
champion modal/reward displays
reload preserves champion-complete state
Correctness
action uses correctAction
outs uses correctAnswer
ev uses correctAnswer
non-action questions no longer depend on heroWins for scoring
Persistence
current challenge progress persists across reload
final completion persists across reload
Safety
no TypeScript/runtime errors in modified files
no fake card data introduced
no unrelated refactors
Deliverables

Return:

files changed
short explanation of progression fix
short explanation of Level 25 completion fix
short explanation of non-action scoring fix
QA results for:
Level 5 → 6
Level 10 → 11
Level 15 → 16
Level 20 → 21
Level 25 completion
one outs question
one ev question
reload persistence
Stop condition

Stop after:

progression is verified/fixed
Level 25 final completion works
mixed-question scoring is correct
reload persistence is stable

Do not start broader cleanup or content edits in this task