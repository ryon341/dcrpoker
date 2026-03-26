TC088 — Build Master Tier (Tier 5) and Grand Champion completion flow
Objective

Add the final challenge tier, Master, and complete the end-of-game progression so that:

Tier 5 unlocks after Chip Leader is completed,
levels 21–25 run correctly,
question sourcing follows your carryover rule,
the app persists and restores final-tier progress cleanly,
completing Level 25 triggers the Grand Champion end-state and reward screen.

This card closes the full 5-tier progression backbone.

Scope
1) Register Master in tier config

Verify the final tier is fully present in the canonical tier map and that helper functions derive it correctly from level.

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

Do not rename tier keys unless the codebase already uses different canonical identifiers.

2) Create / wire the Master question bank

Add the Tier 5 data source using the exact existing question schema.

File
app/(tabs)/poker-challenge/data/masterQuestions.ts

Requirements

Export an array matching the current challenge question type exactly.
No schema changes.
Difficulty should be the highest in the challenge.
Focus more heavily on:
disciplined preflop decisions in marginal spots,
EV-driven calls/folds,
tougher raise vs call distinctions,
more punishing trap answers,
sharper equity / outs logic,
stronger pressure and commitment decisions.

Tier 5 should feel like the culmination of the challenge, not just “more of the same.”

3) Wire Tier 5 into question selection

Apply your progression carryover rule correctly:

Tier 2 = 80% Tier 2 + 20% Tier 1
Tier 3 = 80% Tier 3 + 20% Tier 2
Tier 4 = 80% Tier 4 + 20% Tier 3
Tier 5 = 80% Tier 5 + 20% Tier 4
No direct Tier 1–3 carryover into Tier 5

File
app/(tabs)/poker-challenge/lib/questionBank.ts

Implement / extend

import beginnerQuestions from '../data/beginnerQuestions';
import apprenticeQuestions from '../data/apprenticeQuestions';
import grinderQuestions from '../data/grinderQuestions';
import chipLeaderQuestions from '../data/chipLeaderQuestions';
import masterQuestions from '../data/masterQuestions';

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
  if (level >= 21 && level <= 25) {
    return buildTierPool(masterQuestions, chipLeaderQuestions, 0.2);
  }

  return shuffle(beginnerQuestions);
}
4) Unlock Master after Chip Leader completion

When the player completes Level 20, unlock Master.

File
app/(tabs)/poker-challenge/index.tsx

Required behavior

Completing Level 20 marks Chip Leader complete.
unlockedTiers gains Master.
Tier Complete modal appears.
Continue advances to Level 21.
Current tier updates to Master.

Target logic

if (level === 20 && currentTier === 'Chip Leader') {
  // mark Chip Leader complete
  // unlock Master
  // show tier complete modal
}

And on continue:

if (level === 20) {
  setLevel(21);
  setCurrentTier('Master');
}

Reuse the existing tier-complete machinery where possible.

5) Add final completion state for Level 25

This is the most important part of the card.

When the player completes Level 25, the app must:

mark Master as completed,
mark the overall challenge as completed,
trigger the Grand Champion reward flow,
prevent broken progression past level 25,
preserve replay options without losing completed state.

Files

app/(tabs)/poker-challenge/index.tsx
any existing progress storage helper
any modal/reward component files

Required final behavior

if (level === 25 && currentTier === 'Master') {
  // mark Master complete
  // mark full challenge complete
  // show Grand Champion modal/screen
  // do not advance to level 26
}

There must be no attempt to advance beyond the defined max level.

6) Add / wire the Grand Champion reward modal or screen

Use the existing project direction you already defined:

completion of Level 25 should show a Grand Champion reward image
include the DCR bracelet reward concept
this should feel like a real culmination screen, not a generic alert

Suggested file
app/(tabs)/poker-challenge/components/GrandChampionModal.tsx

UI content requirements

Title: Grand Champion
celebratory copy
DCR bracelet reward image or placeholder asset hook
action buttons:
Replay Final Level
Replay Tier
Restart Challenge
Close

Keep it visually consistent with the challenge modals already in the app.

7) Persist final completion cleanly

Save enough state so that after app refresh, the game still knows the user has completed the full challenge.

Verify / store

currentLevel
currentTier
completedTiers
unlockedTiers
challengeCompleted boolean
optional grandChampionUnlocked boolean if separate
any modal suppression flags needed so the reward modal does not spam unexpectedly on every reload

Rule
If challengeCompleted === true, the UI should restore gracefully and not behave as if Level 25 is unfinished.

8) Restore final-tier and completed state correctly

If the app reloads while:

on levels 21–25, it should restore into Master
after full completion, it should restore with completion state intact
it should not regress to Chip Leader
it should not re-unlock tiers incorrectly
it should not attempt to auto-advance again

Use level-derived tier as the defensive fallback:

const derivedTier = getTierByLevel(savedLevel)?.key ?? 'Beginner';
9) Update visible labels and completion copy

Any place showing current tier, next tier, or final completion copy must be updated for the endgame.

Verify

header shows Master • Level 21 etc.
tier complete modal for Level 20 points to Master
Level 25 completion uses Grand Champion copy, not standard tier-complete copy
summary and progress rails do not imply there is another tier after Master
10) Verify replay behavior for the final boundary

Replaying Level 25 or replaying the Master tier after completion must not:

erase challengeCompleted,
remove Master from completed tiers,
remove unlocked state,
corrupt the final reward state.

Replay should preserve the accomplishment while allowing repeat play.

Acceptance criteria
Master exists in config and maps to levels 21–25.
Completing Level 20 unlocks Master.
Continuing after Level 20 starts Level 21.
Levels 21–25 load Tier 5 question data.
Tier 5 pool uses 80% Master + 20% Chip Leader only.
Completing Level 25 does not advance to level 26.
Completing Level 25 triggers the Grand Champion reward flow.
Master is marked complete at final completion.
Overall challenge completion is persisted.
Refreshing after full completion preserves final completion state.
Replaying final content does not remove completion status.
Prior tiers continue to behave exactly as before.
Non-goals
Do not redesign the whole challenge UI.
Do not change scoring.
Do not change question schema.
Do not add online leaderboard logic.
Do not add server persistence unless already present and trivial.
Do not build trophy-sharing/social features in this card.
Deliverables
challengeConfig.ts updated or verified
masterQuestions.ts created or wired
questionBank.ts updated
progression logic in index.tsx updated for Level 20 and Level 25 boundaries
GrandChampionModal.tsx created or wired
storage / restore logic updated for full completion
final labels and copy verified
QA checklist

Run these manually:

Complete Level 20 normally.
Confirm Master unlocks.
Tap Continue.
Confirm Level 21 loads and header shows Master • Level 21.
Refresh during Level 21–25 and confirm restore remains in Master.
Complete Level 25.
Confirm Grand Champion reward screen appears.
Confirm no level 26 is created.
Refresh app after completion.
Confirm full challenge still shows as completed.
Replay Level 25 and replay Master tier.
Confirm completion state remains intact.
Confirm no regression in earlier tiers.
Suggested commit message

feat(challenge): add Master tier and grand champion completion flow

After this, the next logical card is not another tier card. The next one should be a stabilization / content-scale card, likely: