TC100 — Challenge Screen Repair Pass (Layout + Button Logic + Card Rendering)
Objective

Fix the live DCR Poker challenge screen so that:

question text fits cleanly inside the framed panel,
action buttons never appear with yes/no buttons,
hand-based questions show visual cards, not raw text like Ac / 6h.
This is a bug-fix card, not a feature card.

Do not add new systems.
Do not change progression, scoring, analytics, or generator logic unless strictly required for display correctness.

Acceptance Criteria
A. Question panel layout
Long question text no longer overlaps the decorative panel border.
Text wraps cleanly on narrow mobile widths.
Explanation text also respects the safe inset.
No clipping at iPhone-width layouts.
B. Button logic
When the question uses action controls (Raise / Call / Fold), yes/no buttons are not rendered at all.
Only one answer-control group is ever visible at a time.
No overlapping answer buttons.
C. Card rendering
Any question that references hole cards and/or board cards must render visual playing cards.
Do not force the player to read raw inline card notation when a card visual can be shown.
Existing PlayingCard, HandDisplay, and OutsCardDisplay components must be reused rather than reinvented.
D. No regressions
Challenge mode still works.
Daily challenge still works.
No new TypeScript errors.
Files that must be checked first

Audit which route is actually used by the live challenge screen before changing anything.

Search for the active route/screen that renders:

QuestionPanel
DecisionButtons
MultiChoiceButtons
ContinuePanel

Do not patch duplicate or unused screens.

Required implementation
1. Fix QuestionPanel.tsx

Increase the safe inset so the decorative frame does not crowd the text.

Change styling to something in this range:

const s = StyleSheet.create({
  outer: {
    width: '100%',
    minHeight: 100,
    marginVertical: 8,
    overflow: 'hidden',
  },
  bgImage: {
    borderRadius: 12,
  },
  content: {
    paddingHorizontal: 30,
    paddingVertical: 18,
    width: '100%',
  },
  tag: {
    color: T.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 8,
    textAlign: 'center',
  },
  question: {
    color: T.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    flexShrink: 1,
  },
  expWrap: {
    width: '100%',
    marginTop: 14,
    gap: 6,
  },
  expDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'stretch',
  },
  expLabel: {
    color: T.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  expText: {
    color: T.silver,
    fontSize: 13,
    lineHeight: 20,
    flexShrink: 1,
  },
});

If the frame art needs even more inset, increase horizontal padding to 32.

2. Fix the answer-control render logic in the live challenge screen

There must be a single answer-control branch.

Use logic like this:

const isDecisionQuestion =
  challenge.category === 'action' || challenge.category === 'pressure';

const shouldShowDecisionButtons =
  !canContinue && isDecisionQuestion;

const shouldShowMultiChoiceButtons =
  !canContinue && !isDecisionQuestion;

Then render:

{shouldShowDecisionButtons ? (
  <DecisionButtons
    options={challenge.answerOptions}
    onSelect={handleAnswer}
    disabled={buttonsLocked}
    selected={selectedAnswer}
  />
) : shouldShowMultiChoiceButtons ? (
  <MultiChoiceButtons
    options={challenge.answerOptions}
    onSelect={handleAnswer}
    disabled={buttonsLocked}
    selected={selectedAnswer}
  />
) : (
  <ContinuePanel ... />
)}

Important:

remove any legacy Yes / No control block from the live screen
do not leave it mounted conditionally off-screen
there should be one answer-control renderer only
3. Fix challengeQuestionAdapter.ts

This file is one of the real problems.

Right now it does not provide structured card data for action questions. That is why the UI falls back to plain text.

At minimum, add parsing helpers so the runtime can extract cards from prompts and display them visually where possible.

Add a generic card extractor

Example helper:

function extractCardTokens(text: string): string[] {
  const matches = text.match(/\b[2-9TJQKA][cdhs]\b/g);
  return matches ?? [];
}
Improve outs parsing

Keep existing outs parsing, but also strip the inline card text from the displayed scenario once cards are shown separately.

Add support for hand-based prompts

If a prompt contains two hero cards plus 3 to 5 board cards:

parse them
pass them to the runtime object
render with OutsCardDisplay or a similar card row
Also add explicit category handling for pressure

Do not let pressure fall through the generic EV branch invisibly.

4. Update the live challenge screen to prefer card visuals

For any runtime question with parsed cards:

show the card component
remove redundant raw card notation from the visible prompt if it duplicates the same information

Example:
Instead of showing
You hold Ac 6h on Kd 8c 2h
show:

cards visually
a shorter prompt like
How many outs improve you by the river?
5. Verify the live route is the one being changed

This is mandatory.

Return the exact file path of the live challenge screen that was fixed.
Do not say “updated challenge screen” without naming the file.

VS Code must return
Exact live screen file changed
Files changed
Whether any duplicate/unused screen was found
Confirmation that only one answer-control group renders at a time
Confirmation that card visuals now appear for hand-based prompts
Screenshots or at least emulator notes for:
question panel text fit
action question
outs/hand-based question
Definition of done

This card is complete only when:

text no longer overlaps the panel border,
yes/no is gone whenever raise/call/fold is shown,
card-based prompts are displayed as actual cards in the live challenge screen.