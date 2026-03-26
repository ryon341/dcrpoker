TC087 — Build Chip Leader Tier (Tier 4) and wire levels 16–20 into progression
Objective

Add Tier 4: Chip Leader to the poker challenge so that:

it unlocks after Grinder is completed,
levels 16–20 run correctly,
question selection follows your carryover rule,
saved progress restores into the correct tier,
the tier-complete pipeline remains clean and ready for Tier 5.
Scope
1) Register Chip Leader in tier config

Add Tier 4 to the central tier map and verify helper functions still derive the correct tier from level.

File
app/(tabs)/poker-challenge/lib/challengeConfig.ts

Implement / verify

export const CHALLENGE_TIERS = [
  { key: 'Beginner', label: 'Beginner', startLevel: 1, endLevel: 5 },
  { key: 'Apprentice', label: 'Apprentice', startLevel: 6, endLevel: 10 },
  { key: 'Grinder', label: 'Grinder', startLevel: 11, endLevel: 15 },
  { key: 'Chip Leader', label: 'Chip Leader', startLevel: 16, endLevel: 20 },
  { key: 'Master', label: 'Master', startLevel: 21, endLevel: 25 },
];

Helper

export function getTierByLevel(level: number) {
  return CHALLENGE_TIERS.find(
    (tier) => level >= tier.startLevel && level <= tier.endLevel
  ) ?? CHALLENGE_TIERS[0];
}

Do not rename existing tier keys unless the codebase already uses different canonical names.

2) Create / wire the Chip Leader question bank

Add Tier 4 data using the same schema already used by the existing challenge engine.

File
app/(tabs)/poker-challenge/data/chipLeaderQuestions.ts

Requirements

Export an array matching the exact existing question type.
Keep schema compatibility exact. No engine type rewrite.
Difficulty should step up from Grinder.
Focus more on:
stronger positional punishments,
tighter preflop construction,
larger-pot EV decisions,
pressure spots,
better fold discipline,
clearer distinction between marginal calls and profitable aggression.

Question types can include:

action spots,
EV spots,
outs / equity,
spot-the-best-line situations,
punishment for passive leaks.
3) Wire Tier 4 into question selection

Apply your progression carryover rule correctly:

Tier 2 = 80% Tier 2 + 20% Tier 1
Tier 3 = 80% Tier 3 + 20% Tier 2
Tier 4 = 80% Tier 4 + 20% Tier 3
No Tier 2 or Tier 1 carryover directly into Tier 4

File
app/(tabs)/poker-challenge/lib/questionBank.ts

Implement / extend

import beginnerQuestions from '../data/beginnerQuestions';
import apprenticeQuestions from '../data/apprenticeQuestions';
import grinderQuestions from '../data/grinderQuestions';
import chipLeaderQuestions from '../data/chipLeaderQuestions';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildTierPool<T>(primary: T[], carryover: T[], carryPct = 0.2): T[] {
  const primaryCount = primary.length;
  const carryCount = Math.max(1, Math.floor(primaryCount * carryPct));
  const carry = shuffle(carryover).slice(0, carryCount);
  return shuffle([...primary, ...carry]);
}

export function getQuestionPoolForLevel(level: number) {
  if (level >= 1 && level <= 5) return shuffle(beginnerQuestions);
  if (level >= 6 && level <= 10) {
    return buildTierPool(apprenticeQuestions, beginnerQuestions, 0.2);
  }
  if (level >= 11 && level <= 15) {
    return buildTierPool(grinderQuestions, apprenticeQuestions, 0.2);
  }
  if (level >= 16 && level <= 20) {
    return buildTierPool(chipLeaderQuestions, grinderQuestions, 0.2);
  }

  return shuffle(beginnerQuestions);
}

Do not add Tier 5 logic in this card unless already scaffolded and trivial.

4) Unlock Chip Leader after Grinder completion

When the player completes Level 15, unlock Tier 4.

File
app/(tabs)/poker-challenge/index.tsx

Required behavior

Completing Level 15 marks Grinder complete.
unlockedTiers gains Chip Leader.
Tier Complete modal appears.
Continue advances to Level 16.
Current tier updates to Chip Leader.

Target logic

if (level === 15 && currentTier === 'Grinder') {
  // mark Grinder complete
  // unlock Chip Leader
  // show tier complete modal
}

And on continue:

if (level === 15) {
  setLevel(16);
  setCurrentTier('Chip Leader');
}

Reuse the existing progression helpers and modal flow where possible.

5) Restore Tier 4 correctly from saved progress

If the app refreshes on levels 16–20, the restored state must show the correct tier.

Verify

currentLevel
currentTier
completedTiers
unlockedTiers
current session index / question pointer if applicable

Rule
Derived tier should always be defensively computed from level:

const derivedTier = getTierByLevel(savedLevel)?.key ?? 'Beginner';

Avoid stale state where Level 16 restores but the header still says Grinder.

6) Update visible labels and modal copy

Any area showing the current tier or next tier must correctly display Chip Leader.

Verify

challenge header
summary modal
tier complete modal
any “next tier” preview text
any progress rail or badge component

Expected examples

Chip Leader • Level 16
Grinder completion modal points to Chip Leader as next tier
7) Verify replay behavior at the Grinder boundary

Replaying Level 15 after completion must not:

remove Chip Leader from unlocked tiers,
duplicate Grinder completion records,
corrupt save state,
regress current unlocked tier list.

Replay should preserve:

completedTiers includes Grinder
unlockedTiers includes Chip Leader
Acceptance criteria
Chip Leader exists in config and maps to levels 16–20.
Completing Level 15 unlocks Chip Leader.
Continuing after Grinder completion starts Level 16.
Levels 16–20 load Tier 4 question data.
Tier 4 pool uses 80% Chip Leader + 20% Grinder only.
Refreshing during levels 16–20 restores into Chip Leader.
Header and modal labels show Chip Leader correctly.
Replaying Level 15 does not remove Chip Leader unlock.
Beginner, Apprentice, and Grinder flow remain unchanged.
Scoring model remains unchanged.
Non-goals
Do not build Master question data yet.
Do not change scoring or point rules.
Do not redesign UI.
Do not refactor the whole challenge engine unless necessary.
Do not alter the question schema.
Deliverables
challengeConfig.ts updated or verified
chipLeaderQuestions.ts created or wired
questionBank.ts updated
progression logic in index.tsx updated
restore logic verified
visible tier labels verified
QA checklist

Run these manually:

Complete Level 15 normally.
Confirm Tier Complete modal appears.
Tap Continue.
Confirm Level 16 loads.
Confirm header shows Chip Leader • Level 16.
Refresh app on Level 16.
Confirm it restores in Chip Leader.
Replay Level 15 after completion.
Confirm Chip Leader stays unlocked.
Confirm Tier 4 questions feel harder than Grinder.
Confirm no Tier 1 or Tier 2 carryover is appearing directly in Tier 4.
Suggested commit message

feat(challenge): add Chip Leader tier and wire levels 16-20 into progression