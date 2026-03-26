TC097 — Difficulty Calibration Pass (Data-Driven Tuning)

Objective
Use the new validation and analytics layer to tune question quality, difficulty progression, and gauntlet balance so the Challenge Game feels consistently sharp from Beginner through Master.

Why this is next
TC096 gave you the two missing control systems:

bank validation
real performance analytics

Now you can stop guessing and start tuning based on evidence. This card is where the game goes from “working” to “well-balanced.”

Core Goal
Identify and correct:

questions that are too easy
questions that are too hard
weak distractors
muddy wording
uneven category difficulty
tier jumps that feel unnatural
gauntlet weighting that over- or under-emphasizes certain difficulty bands

Scope
This is a calibration pass, not a rewrite.
Do not redesign the engine.
Do not add new categories.
Do not expand content volume unless needed to fix weak areas.

TARGET OUTCOMES

By the end of TC097, you should have:

A clear difficulty profile by:
tier
level
category
A flagged list of weak questions:
most-missed
least-missed
suspiciously noisy
probably ambiguous
A first-pass tuning update to:
generator config
distractor quality
EV margin difficulty
pressure ambiguity
action ambiguity
gauntlet weights if justified
A reproducible calibration workflow you can reuse later.
ACCEPTANCE CRITERIA
Analytics Review
Produce a readable calibration report from current analytics data.
Report includes:
accuracy by category
accuracy by tier
accuracy by level
top 10 most-missed questions
top 10 least-missed questions, if easy to compute
Flag suspicious patterns, for example:
Beginner accuracy too low
Master accuracy too high
outs far easier than EV
pressure much harder than intended
large jumps between adjacent tiers
Tuning Pass
Adjust generator/config/runtime only where data supports it.
Make at least one concrete improvement in each of these areas if needed:
wording clarity
distractor quality
difficulty slope
gauntlet balance
Validation
All 5 banks still pass validation after any regen.
No duplicate prompt or ID regressions.
No new TypeScript errors.
QA
Challenge mode still works.
Gauntlet still works.
No progression or scoring regressions.
IMPLEMENTATION PLAN
Part A — Build Calibration Report

Create a lightweight calibration utility that consumes the analytics summary and produces a developer-readable report.

Suggested file:

challengeCalibrationReport.ts

It should summarize:

total answers logged
category accuracy
tier accuracy
level accuracy
most-missed questions
easiest questions
possible outliers

Suggested output shape:

type CalibrationInsight = {
  severity: 'info' | 'warning' | 'critical';
  area: 'tier' | 'level' | 'category' | 'question' | 'gauntlet';
  message: string;
};

And a report like:

type ChallengeCalibrationReport = {
  totalEvents: number;
  categoryAccuracy: Record<string, number>;
  tierAccuracy: Record<string, number>;
  levelAccuracy: Record<string, number>;
  hardestQuestions: Array<{ questionId: string; missRate: number; attempts: number }>;
  easiestQuestions: Array<{ questionId: string; hitRate: number; attempts: number }>;
  insights: CalibrationInsight[];
};
Part B — Set Tuning Thresholds

Define simple thresholds so tuning is not subjective.

Recommended first-pass thresholds:

By category
Beginner target accuracy: 75–90%
Apprentice: 65–85%
Grinder: 55–75%
Chip Leader: 45–70%
Master: 35–60%
Question-level flags

Flag a question if:

attempts >= 5 and accuracy <= 20% → likely too hard or unclear
attempts >= 5 and accuracy >= 95% → likely too easy
attempts >= 5 and performance is wildly off compared to its tier/category neighbors

These thresholds do not need to be perfect. They just need to be explicit.

Part C — Tune Generator Inputs

Use the report to make targeted adjustments.

Likely knobs:

actionGenerator

Adjust:

borderline hand frequency
prior-action ambiguity
positional sensitivity
distractor plausibility
evGenerator

Adjust:

decision margin bands
pot odds closeness
wrong answer spacing
wording clarity
pressureGenerator

Adjust:

board texture complexity
trap frequency
hand-strength ambiguity
call/fold closeness
outsGenerator

Adjust:

draw complexity
overcount traps
choice spacing
scenarioPools / handPools

Adjust only if data suggests repetitive or weak patterns.

Do not broadly randomize. Tight, surgical changes only.

Part D — Gauntlet Calibration

Review whether gauntlet feels correct with current weights:

Beginner 10%
Apprentice 15%
Grinder 20%
Chip Leader 25%
Master 30%

Potential action:

leave unchanged if performance curve looks good
reduce Master slightly if gauntlet is overly punishing
reduce Beginner slightly if gauntlet feels too soft early

This should be evidence-based, not instinct-based.

Part E — Regen + Revalidate

If config changes affect generated output:

regenerate affected banks
rerun validation
confirm:
all totals correct
all category distributions unchanged unless intentionally changed
no duplicate regressions
FILE STRATEGY

Suggested new file:

challengeCalibrationReport.ts

Likely modified files:

challengeAnalyticsStorage.ts only if summary needs extension
generatorConfig.ts
one or more generator modules:
actionGenerator.ts
evGenerator.ts
pressureGenerator.ts
outsGenerator.ts
generated tier outputs, only if regen occurs

Keep UI changes minimal. This is primarily a systems-tuning card.

QA CHECKLIST
Generate calibration report from existing analytics.
Confirm at least 3 actionable insights were found.
Apply targeted tuning changes.
Regenerate affected banks if needed.
Validate all 5 banks.
Smoke test:
Beginner challenge
Master challenge
Gauntlet mode
Confirm no new TypeScript errors.
WHAT VS CODE SHOULD RETURN
Files added
Files modified
Calibration report summary
Top 5 hardest questions
Top 5 easiest questions
Which generator knobs were changed
Whether any banks were regenerated
Post-change validation summary
Any gauntlet weight changes made
DEFINITION OF DONE

TC097 is complete when:

you have a real calibration report
at least one evidence-based tuning pass has been made
all affected banks still validate
gameplay remains stable
NOTE ON DATA VOLUME

If analytics volume is currently too low for strong conclusions, do not stall.
Still build the calibration report and apply only low-risk fixes:

wording cleanup
obvious distractor tightening
minor EV margin smoothing

In that case, TC097 still succeeds as a “framework + first-pass calibration” card.