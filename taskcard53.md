TC053 — Build Level 1–10 Real Challenge Pack
Goal

Replace the thin placeholder content in the beginner/easy/intermediate pools with a real playable challenge pack for Levels 1–10 so the game starts feeling like an actual product.

This taskcard is content-heavy, not systems-heavy.

Scope

Create a high-quality preflop challenge pack covering:

Levels 1–3 → beginner
Levels 4–6 → easy
Levels 7–10 → intermediate

Target:

60 total challenges minimum
distributed across the first 3 tiers
enough variety to avoid obvious repetition

Recommended split:

beginner: 20
easy: 20
intermediate: 20
Files To Modify
1. challengePools.ts

Expand the existing pools substantially.

2. challengeTypes.ts

Only if needed for cleaner metadata.

Challenge Requirements

Each challenge must include:

{
  id: string,
  question: string,
  heroHand: [string, string],
  villainHand: [string, string],
  correctAnswer: 'yes' | 'no',
  explanation: string,
  runout: [string, string, string, string, string],
  heroWins: boolean,
  difficulty: 'beginner' | 'easy' | 'intermediate',
  tags: string[],
}
Content Design Rules
Beginner pool (Levels 1–3)

Use very clear spots:

premium hands
very weak trash hands
obvious opens
obvious folds
simple BTN / CO / SB / BB framing
avoid weird mixed-strategy spots

Examples:

AA, KK, AKs, AQs → obvious yes
72o, 83o, T2o UTG → obvious no
Easy pool (Levels 4–6)

Introduce:

suited vs offsuit
small pairs
broadways
position sensitivity
more realistic opens/calls/folds

Examples:

KJo BTN vs UTG action
55 in late position
A5s opens vs weak offsuit aces
Intermediate pool (Levels 7–10)

Introduce:

closer decisions
more marginal offsuit broadways
suited connectors
wheel aces
position-specific logic
some traps where players commonly overplay

Examples:

QJo from early position
A4s vs middle position
76s from cutoff vs tighter positions
KTo in marginal open spots
Tagging Rules

Use useful tags such as:

UTG
MP
CO
BTN
SB
BB
premium
broadway
offsuit
suited
small-pair
suited-connector
wheel-ace
marginal

These will help later with analytics and filtering.

Explanation Standards

Explanations should be:

1–3 sentences
direct
beginner-readable
position-aware
not solver-jargon-heavy
Good example

AKo is a standard raise here because it is far ahead of typical continuing ranges and plays well when called.

Avoid
overly technical language
long paragraphs
vague wording like “just because”
Runout Standards

Runouts do not need to be solver-driven.
They do need to:

look realistic
vary between wins and losses
support the emotional payoff of the reveal

Make sure heroWins aligns with villainHand + runout.

Hero/Villain Quality Rules

Do not make villain hands feel fake or random junk every time.

Use plausible hands:

broadways
suited aces
pocket pairs
connector-type hands
occasional dominated hands
Beginner/Easy/Intermediate Balance

Across the 60 challenges, aim for:

~50% correctAnswer yes
~50% correctAnswer no

And for outcomes:

mix heroWins true/false
do not bias too heavily toward hero always winning when correct
ID Naming Convention

Use clean IDs like:

b01–b20
e01–e20
i01–i20

If old challenge IDs already exist, either:

keep them and expand consistently
or replace with this clearer convention

Be consistent.

Important Constraint

Do not change challenge selection logic in this taskcard.
Do not change scoring.
Do not change wheel behavior.

This is a content pack only.

Acceptance Criteria
At least 60 total challenges added for Levels 1–10
Beginner pool has at least 20
Easy pool has at least 20
Intermediate pool has at least 20
Every challenge has difficulty + tags
Explanations are clean and readable
Runouts and heroWins are internally consistent
Game plays through Levels 1–10 without feeling repetitive
Existing selector works without code changes beyond import/data updates
Deliverable Back

When complete, report:

total challenge count
count by pool
3 sample beginner challenges
3 sample easy challenges
3 sample intermediate challenges
whether any old placeholder challenges were removed or kept

After this, the next card should be: