✅ TC085 — Integrate Apprentice Tier (Tier 2) into Progression Engine
🎯 Objective

Activate Tier 2 (Apprentice) so it is:

Fully playable after Beginner completion
Properly fed by the question bank
Persisted + restored correctly
Seamlessly integrated into the existing progression + UI system
🧠 Context (Current State)
Tier 1 (Beginner): ✅ Complete
Tier system: ✅ Built (TC082–TC084)
Unlock logic: ✅ Exists (unlockedTiers, completedTiers)
Missing piece: ❌ Tier 2 is not actively wired into gameplay loop
⚙️ Scope of Work
1. Register Tier 2 in Tier Config

Ensure Apprentice is formally recognized by the engine.

File:
/lib/challengeConfig.ts
Add / verify:
export const TIERS = [
  {
    id: 'Beginner',
    levels: [1, 2, 3, 4, 5],
  },
  {
    id: 'Apprentice',
    levels: [6, 7, 8, 9, 10],
  },
  // future tiers already scaffolded
];
2. Hook Tier → Question Bank Mapping
File:
/lib/questionBank.ts
Requirement:

Tier 2 must pull ONLY from Apprentice pool

export function getQuestionsForLevel(level: number) {
  if (level >= 1 && level <= 5) return beginnerQuestions;
  if (level >= 6 && level <= 10) return apprenticeQuestions;
}
3. Inject 20% Carryover Logic (CRITICAL RULE)

This is your progression rule:

Tier 2 = 80% Tier 2 + 20% Tier 1

Update:
function mixQuestions(base, carryover) {
  const carryCount = Math.floor(base.length * 0.2);
  const shuffledCarry = shuffle(carryover).slice(0, carryCount);
  return shuffle([...base, ...shuffledCarry]);
}
Apply:
if (level >= 6 && level <= 10) {
  return mixQuestions(apprenticeQuestions, beginnerQuestions);
}
4. Progression Advancement Logic
File:
/app/poker-challenge/index.tsx
Verify / Update:
if (level === 5 && tier === 'Beginner') {
  unlockTier('Apprentice');
}

AND

if (level === 6 && !unlockedTiers.includes('Apprentice')) {
  setCurrentTier('Apprentice');
}
5. Session Initialization Fix

Ensure correct tier loads on resume.

Update restore logic:
const tier = getTierFromLevel(savedLevel);
setCurrentTier(tier);
6. UI Indicator Update (IMPORTANT FOR UX)
Add:
Tier label in header
Progress indicator: Apprentice • Level 6
<Text>{currentTier} • Level {level}</Text>
7. Tier Transition Validation

Ensure flow:

Action	Expected
Finish Level 5	Tier Complete Modal
Continue	Level 6 loads
Header	Shows Apprentice
Questions	Mixed pool (20% Beginner)
🧪 QA Checklist (Must Pass)
Scenario	Expected
Complete Beginner	Apprentice unlocks
Enter Level 6	Tier = Apprentice
Question mix	~80/20 split
Refresh app	Returns to Apprentice
Replay Level 5	Does NOT break unlock
Score system	Unchanged
🚫 Non-Goals
No UI redesign
No new scoring changes
No Tier 3 yet
No new question creation (uses existing TC084 set)
📦 Deliverables
Updated challengeConfig.ts
Updated questionBank.ts
Updated progression logic
Tier-aware UI label
Verified persistence behavior
🔥 Definition of Done
Player completes Level 5 → unlocks Apprentice
Level 6 loads correctly with proper question mix
Tier persists across refresh
UI reflects correct tier
No regression in scoring or flow
📌 What Comes Next (Preview)

After TC085, the roadmap continues cleanly:

TC086 — Build Tier 3 (Grinder)
TC087 — Question Bank Expansion Engine (scale to 250/tier)
TC088 — Difficulty Curve Tuning (EV + multi-variable spots)
TC089 — Grand Champion Endgame Screen