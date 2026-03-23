TC086 — Build Grinder Tier (Tier 3) and wire it into progression
Objective

Add Tier 3: Grinder to the poker challenge so that:

it unlocks after Apprentice is completed,
levels 11–15 run correctly,
the question source follows your carryover rule,
state persists and restores cleanly,
the tier-complete flow continues without regression.
Scope
1) Register Grinder in tier config

Update the central tier definition so the engine recognizes Tier 3.

File
app/(tabs)/poker-challenge/lib/challengeConfig.ts

Implement

export const CHALLENGE_TIERS = [
  { key: 'Beginner', label: 'Beginner', startLevel: 1, endLevel: 5 },
  { key: 'Apprentice', label: 'Apprentice', startLevel: 6, endLevel: 10 },
  { key: 'Grinder', label: 'Grinder', startLevel: 11, endLevel: 15 },
  { key: 'Chip Leader', label: 'Chip Leader', startLevel: 16, endLevel: 20 },
  { key: 'Master', label: 'Master', startLevel: 21, endLevel: 25 },
];

Also verify helper utilities:

export function getTierByLevel(level: number) {
  return CHALLENGE_TIERS.find(
    (tier) => level >= tier.startLevel && level <= tier.endLevel
  ) ?? CHALLENGE_TIERS[0];
}
2) Add Grinder question bank

Create or wire the Tier 3 dataset.

File
app/(tabs)/poker-challenge/data/grinderQuestions.ts

Requirement

Export a valid array matching the exact shape already used by Beginner and Apprentice.
Use the same answer model already implemented in the challenge engine.
Tier 3 should be harder than Apprentice.
Include a mix of:
preflop action spots,
pot odds / EV spots,
outs / equity spots,
positional discipline,
punishment for loose calls and bad raises.

Do not rewrite engine types. Match existing schema exactly.

3) Wire Tier 3 into question selection

Apply your carryover rule correctly:

Tier 2 = 80% Tier 2 + 20% Tier 1
Tier 3 = 80% Tier 3 + 20% Tier 2
No Tier 1 carryover into Tier 3

File
app/(tabs)/poker-challenge/lib/questionBank.ts

Implement pattern

import beginnerQuestions from '../data/beginnerQuestions';
import apprenticeQuestions from '../data/apprenticeQuestions';
import grinderQuestions from '../data/grinderQuestions';

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

  return shuffle(beginnerQuestions);
}

Do not add Tier 4 logic yet unless already scaffolded.

4) Unlock Grinder after Apprentice completion

When the player completes Level 10, unlock Grinder.

File
app/(tabs)/poker-challenge/index.tsx

Update progression logic

finishing level 10 should mark Apprentice complete,
add Grinder to unlockedTiers,
show Tier Complete modal,
continuing should move to level 11.

Target behavior

if (level === 10 && currentTier === 'Apprentice') {
  // mark Apprentice complete
  // unlock Grinder
  // open tier complete modal
}

And on continue:

if (level === 10) {
  setLevel(11);
  setCurrentTier('Grinder');
}

Use the project’s existing helpers instead of inventing a new flow if the current modal logic already supports this.

5) Restore Tier 3 correctly from saved progress

If the app reloads while the user is in levels 11–15, the session must restore into Grinder automatically.

Verify

currentTier
currentLevel
completedTiers
unlockedTiers
current question session / round index as applicable

Rule
Derived state should come from saved level if needed:

const derivedTier = getTierByLevel(savedLevel)?.key ?? 'Beginner';

Avoid stale state where level=11 but header still says Apprentice.

6) Update visible tier labels

Anywhere the challenge shows the tier or level summary, Grinder must display correctly.

Examples

Header
Continue modal
Session summary
Tier complete modal copy if it references next tier

Expected display

Grinder • Level 11
next tier preview should not incorrectly show Apprentice after Level 10
7) Verify replay behavior at the Apprentice boundary

Replaying Level 10 after completion must not:

remove the Grinder unlock,
duplicate completion state,
break saved progress,
regress current unlocked tiers.

The replay path should preserve:

completedTiers includes Apprentice
unlockedTiers includes Grinder
Acceptance criteria
Grinder exists in config and maps to levels 11–15.
Completing Level 10 unlocks Grinder.
Continuing after Apprentice completion starts Level 11.
Levels 11–15 load Grinder questions.
Tier 3 question pool uses 80% Grinder + 20% Apprentice only.
Refreshing during Level 11–15 restores the Grinder tier correctly.
Header and modals show Grinder where expected.
Replaying Level 10 does not remove Grinder unlock.
No regression to Beginner/Apprentice flow.
Existing scoring model remains unchanged.
Non-goals
Do not build Tier 4 question data yet.
Do not change scoring.
Do not redesign the UI.
Do not refactor the whole progression engine unless required to satisfy this card.
Do not alter question schema.
Deliverables
challengeConfig.ts updated
grinderQuestions.ts created or wired
questionBank.ts updated
progression logic in index.tsx updated
restore logic verified
UI tier labels verified
QA checklist

Run these manually:

Complete Level 10 normally → Tier Complete modal appears.
Tap Continue → Level 11 loads.
Header says Grinder • Level 11.
Refresh app on Level 11 → still in Grinder.
Replay Level 10 after completion → Grinder remains unlocked.
Play several Tier 3 questions → content reflects higher difficulty.
Confirm no Tier 1 carryover appears in Grinder pool.
Verify Level 1–10 still behave exactly as before.
Suggested commit message

feat(challenge): add Grinder tier and wire levels 11-15 into progression

If you want, I can give you TC087 next in the same format for Chip Leader (Tier 4).