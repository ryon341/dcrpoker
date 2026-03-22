TC054 — Build Levels 11–18 Advanced Challenge Pack
Goal

Expand the real playable content so Levels 11–18 feel meaningfully harder than Levels 1–10.

This taskcard adds a robust advanced pool that introduces:

closer preflop spots
tougher position awareness
more blocker logic
more marginal opens/defends/3-bets
realistic “common leak” decisions
Scope

Create a high-quality advanced challenge pack for:

Levels 11–12 → upper intermediate use of i pool is already covered
Levels 13–18 → advanced pool

Target:

add at least 24 new advanced challenges
bring advanced pool total to 28 minimum

Recommended IDs:

a03–a26

Current advanced pool already has:

c19
c20
a01
a02

You may either:

keep those 4 and add around them
or rename/normalize everything into a01+

Preferred result:

one clean advanced set with consistent IDs
Files To Modify
1. challengePools.ts

Expand advanced pool substantially.

2. challengeTypes.ts

Only if you need to refine tags or metadata.

Content Design Rules
Advanced pool should feel different from early game

Not just “slightly harder.”

It should include:

more marginal broadways
more suited wheel aces
more 3-bet bluff spots
more defend/fold decisions from blinds
more position-sensitive opens
more dominated-hand traps
more “looks playable but should fold” spots
Advanced Content Themes

Build a balanced mix of these categories:

1. Marginal open spots

Examples:

KTo from HJ
QJo from MP
A8o from LJ
J9s from early/mid spots
2. Blind defense / blind mistakes

Examples:

BB defend vs BTN with hands that barely qualify
SB complete/fold spots
OOP trash hands that should still fold
3. 3-bet bluff candidates

Examples:

A5s
A4s
KTs
QTs
76s in certain late-position dynamics
4. Dominated hand traps

Examples:

ATo flat in bad formation
KJo vs tighter ranges
QTo from poor position
weak offsuit aces that look tempting
5. Suited connector overplay / underplay

Examples:

65s, 76s, 87s
some are opens, some are folds, some are 3-bets depending on spot
6. Small pair handling

Examples:

22–66 in different positions
some opens from late position
some folds in tighter positions
some calls/defends depending on setup
Balance Targets

Across the advanced pool, aim for:

~50/50 yes vs no
broad mix of positions:
UTG / LJ / HJ / CO / BTN / SB / BB
not too many premium hands
more close calls than beginner/easy pools

The player should start missing more often unless they’re paying attention.

Explanation Standards

Explanations should now be a bit sharper, but still readable.

Length:

1–3 sentences
concise
position-aware
mention blockers / domination / playability when relevant
Good examples

A5s works well as a light 3-bet because it blocks strong ace hands and still has decent equity when called.

QJo is too loose from this position because it is often dominated and performs poorly against tighter continuing ranges.

Tags

Continue using tags, but add more advanced ones when relevant:

3bet-bluff
blind-defense
dominated
blocker
marginal-open
late-position
out-of-position
steal-defense
suited-connector
wheel-ace
small-pair
Villain / Runout Quality

Villain hands should feel credible for stronger play.

Use more realistic hands like:

AQo
KQs
88
99
AJs
QTs
A5s
KJs
T9s

Runouts should continue to support emotional variety:

correct but lose
correct and win
incorrect and win
incorrect and lose

Do not let outcomes become too predictable.

Advanced Pool Difficulty Standard

A player who breezes through beginner/easy should now start feeling:

“this is closer”
“I need to think”
“position matters a lot now”

That’s the threshold.

Acceptance Criteria
Advanced pool contains at least 28 total challenges
New advanced entries are clearly harder than easy/intermediate
Yes/no answers are reasonably balanced
Position variety is strong
Tags are present and useful
Explanations are concise and stronger than beginner explanations
No obvious repetition of the same hand pattern
Existing selector works without logic changes
Deliverable Back

When complete, report:

total advanced challenge count
advanced IDs added
5 sample advanced challenges
answer split (yes/no)
whether you normalized old advanced IDs or kept them

After this, the next card should be: