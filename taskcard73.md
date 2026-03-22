TC073 — Update Poker Challenge Scoring Model
Objective

Update challenge scoring so answer correctness and hand result are scored separately under the new rules.

New scoring rules
Answer score
correct answer = +10
wrong answer = -10
Hand-result score

Only for action questions where the selected action is not FOLD:

win hand = +3
lose hand = -3
Fold rule

If the selected answer is FOLD:

do not award hand-result points
do not subtract hand-result points
fold only gets the answer score
Outs / EV

For outs and ev questions:

correct = +10
wrong = -10
no hand-result scoring
Required changes
1. Find scoring logic

Locate the function(s) that compute score delta for:

standard challenge mode
daily challenge mode if separate
any helper like getScoreDelta, applyScore, or equivalent
2. Implement new scoring model

Use logic equivalent to:

const normalizedAnswer = normalizeAnswer(selectedAnswer);
const isFold = normalizedAnswer === 'FOLD';

let scoreDelta = isCorrect ? 10 : -10;

if (question.category === 'action' && !isFold) {
  scoreDelta += heroWins ? 3 : -3;
}
3. Preserve correctness logic

Do not change correctness rules:

action → compare against correctAction
outs → compare against correctAnswer
ev → compare against correctAnswer
4. Preserve existing UI flow

Do not redesign screens.
Only update:

score calculation
any result text that displays awarded points if needed
5. Check stats behavior

If stats currently track hand wins/losses:

keep existing behavior for action questions
outs/ev should still not be treated as real hand wins/losses unless already required for compatibility
Acceptance criteria
correct action + hand win = +13
correct action + hand loss = +7
wrong action + hand win = -7
wrong action + hand loss = -13
correct fold = +10
wrong fold = -10
correct outs = +10
wrong outs = -10
correct ev = +10
wrong ev = -10
Deliverables

Return:

files changed
updated scoring function
test cases or QA notes confirming each of the 8 scenarios above