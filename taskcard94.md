TC094 — Master Tier Generator (Final Content Layer)

Objective
Eliminate the last hand-authored tier by generating the Master question bank with a difficulty profile that represents true endgame play. This completes the full generator pipeline across all tiers.

🎯 WHY THIS MATTERS

Right now:

System is structurally complete
But difficulty ceiling is artificial (hand-authored Master)

This task:

Makes difficulty systematic, scalable, and tunable
Enables future content expansion without manual work
Finalizes the core architecture of the challenge system
🧠 TARGET DESIGN — MASTER TIER

Master must feel qualitatively different, not just “more difficult.”

Required Characteristics
Marginal decisions (not obvious)
Frequent close EV spots
Heavy pressure ambiguity
Strong distractor answers
More context-dependent logic
Less pattern repetition
📊 MASTER DISTRIBUTION
Total: 250 questions
Per level: 50

action:    70
ev:        90
pressure:  70
outs:      20
Why this mix:
EV becomes dominant at highest level
Pressure decisions increase
Outs reduced (less beginner-style math)
Action still important but more nuanced
✅ ACCEPTANCE CRITERIA
Generator produces:
generatedMasterQuestions.ts
Bank totals:
250 questions
50 per level
Category distribution:
action: 70
ev: 90
pressure: 70
outs: 20
No duplicate prompts (post-dedupe)
Unique IDs across ALL tiers
Difficulty clearly exceeds Chip Leader:
tighter EV margins
more ambiguous pressure spots
more deceptive wrong answers
Runtime uses generated Master bank (no manual bank)
No TypeScript errors
Resume/progression still works
🔧 IMPLEMENTATION PLAN
1. Extend Generator Config

Update:

generatorConfig.ts

Add Master:

Master: {
  total: 250,
  perLevel: 50,
  categoryTargets: {
    action: 70,
    ev: 90,
    pressure: 70,
    outs: 20,
  },
  difficulty: {
    actionAmbiguity: 'very_high',
    evMargin: 'ultra_tight',
    pressureComplexity: 'very_high',
    outsTrapRate: 'high',
  },
}
2. Upgrade Difficulty Engine
ACTION generator

Increase:

multi-variable spots:
position + stack + prior action
borderline opens vs folds
squeeze / 3-bet ambiguity
reduce obvious folds
EV generator

This is the most important upgrade.

Add:

tighter pot odds (within ~2–5%)
near-equal choices
misleading distractors

Example shift:

Beginner: obvious +EV vs -EV
Master: razor thin decisions
PRESSURE generator

Increase:

board texture complexity
disguised hand strength
multi-street logic implication
“feels like a call, but isn’t” scenarios
OUTS generator

Reduce volume but increase trickiness:

combo draw miscounts
blocker confusion
overcount traps
3. Expand Pools (ONLY if needed)

Add selectively:

more pressure scenarios
more tricky EV spots
more ambiguous hands

Avoid:

bloating pools unnecessarily
4. Generate Master Bank

Output:

generated/generatedMasterQuestions.ts

Requirements:

deterministic (seed-based)
deduped
clean formatting
consistent IDs
5. Runtime Integration

Update:

tier5Questions.ts

Replace:

manual Master bank

With:

export { generatedMasterQuestions as tier5Questions };
challengeQuestionBankRegistry.ts

Ensure:

Master: generatedMasterQuestions
6. Validation

Run:

validateTierBank('Master', generatedMasterQuestions, ...)

Confirm:

250 total
50 per level
correct category counts
unique IDs
no duplicate prompts
7. QA PASS

Verify:

Gameplay
Master loads correctly
questions render properly
all categories function
scoring behaves correctly
Edge Cases
resume mid-level
level completion
tier completion
no crashes
📦 EXPECTED VS CODE OUTPUT

Ask VS Code to return:

Files changed
Final category totals
Per-level distribution
Whether pools were expanded
Whether runtime fully replaced manual Master
Any QA issues found
🧾 DEFINITION OF DONE

TC094 is complete when:

Master tier is fully generated
Integrated into runtime
Validated
No regressions
No manual content dependency remains