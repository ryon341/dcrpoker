TC055 — Build Levels 19–25 Expert Challenge Pack
Goal

Complete the first full content ladder by building the expert pool for Levels 19–25.

This pool should feel like the endgame:

tighter edges
more blocker-driven logic
more deceptive spots
more close calls
more hands that punish autopilot decisions

At this point, the player should feel they are being tested, not just trained.

Scope

Expand the expert pool so Levels 19–25 have enough depth to feel meaningfully different from advanced.

Target:

add at least 25 new expert challenges
bring expert pool total to 28 minimum

Current expert pool:

x01
x02
x03

Recommended final IDs:

x01–x28
Files To Modify
1. challengePools.ts

Expand the expert pool substantially.

2. challengeTypes.ts

Only if you want to add refined tags, but keep it light.

Expert Pool Design Rules
This pool should be the hardest in the game

Not by being confusing or unfair, but by making the right answer less obvious.

Focus on:

very marginal opens
close 3-bet bluff spots
tricky blind defense decisions
reverse-implied-odds traps
blockers mattering more
hands that look strong but are folds
hands that look weak but can be profitable in the right spot
Expert Content Themes

Build a strong mix of these categories:

1. Thin opens

Examples:

K9s from HJ or CO
Q9s from LJ/CO depending on formation
A7o from late/mid spots
JTo from tighter opens
2. Thin 3-bet bluffs

Examples:

A2s–A5s in selective formations
K9s/KTs/QTs/J9s depending on opener/position
suited connectors with blocker/coverage logic
3. Tight folds with pretty hands

Examples:

KJo in spots players love overplay
ATo in dominated configurations
QJo from early position
weak suited kings from bad positions
4. Advanced blind defense spots

Examples:

BB defend with borderline suited hands
SB decisions where rake/position logic matters
hands that are calls in one formation and folds in another
5. Pair complexity

Examples:

tiny pairs in poor open spots
medium pairs in squeeze/3-bet opportunities
pairs that feel playable but become leaks in the wrong formation
6. Late-position aggression

Examples:

wider profitable steals
selective light 3-bets
mixed-feel but decisive yes/no simplification
Difficulty Standard
Expert should feel:
close
positional
sometimes unintuitive
more “study-driven” than instinctive

A decent casual player should get a noticeable percentage wrong here.

Important Constraint

Even though real poker can be mixed-frequency, this game still requires a yes/no answer.

So each expert challenge should still resolve clearly:

choose the cleaner side of the decision
avoid true 50/50 solver noise unless one side is still the better simplified game answer

Do not write explanations like:

“Sometimes yes, sometimes no.”

Instead choose the best simplified playable answer.

Balance Targets

Across the full expert pool, aim for:

~50/50 yes/no
stronger spread across positions:
LJ / HJ / CO / BTN / SB / BB especially
some UTG/LJ folds that punish over-opening
more blind-vs-late dynamics
fewer “obvious premiums”
Explanation Standards

Explanations can be a touch more advanced than earlier pools, but still concise.

Length:

1–3 sentences
clear
mention domination, blocker value, position, realization, or fold equity where relevant
Good examples

KJo looks playable, but in this formation it is too often dominated and does not realize equity well enough out of position.

A4s makes a good light 3-bet because it blocks premium ace hands and retains strong wheel and flush potential when called.

Q9s is too loose from this seat because it suffers from reverse implied odds and lacks enough raw strength against tighter ranges.

Tags

Continue using existing tags and add these when appropriate:

thin-open
thin-3bet
reverse-implied-odds
equity-realization
late-steal
squeeze
out-of-position
blocker
dominated
blind-defense
borderline

Keep tags useful, not excessive.

Villain / Runout Quality

Villain hands should now feel like credible stronger-range opponents.

Examples:

AQo
KQs
AJs
TT
88
99
QJs
A5s
JTs
KQo

Runouts should continue to mix:

correct and win
correct and lose
incorrect and win
incorrect and lose

Avoid giving the impression that expert spots always punish the player on the board.

ID Convention

Use:

x01–x28

If existing IDs already use x01–x03, continue from there.

Be consistent.

Acceptance Criteria
Expert pool contains at least 28 total challenges
New expert entries are clearly harder than advanced
Yes/no split is reasonably balanced
Position and formation variety are strong
Tags are present and meaningful
Explanations are concise and sharp
Existing selector works without logic changes
Levels 19–25 now feel like a real endgame pool
Deliverable Back

When complete, report:

total expert challenge count
expert IDs added
5 sample expert challenges
answer split (yes/no)
any especially close or notable spots included

After this, the next card should be:

TC056 — Stats + title system + streak tracking HUD