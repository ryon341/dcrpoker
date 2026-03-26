✅ TC091 — Authoring Sprint 2: Expand Grinder + Chip Leader to 250 Questions Each
🎯 Objective

Scale the mid/high tiers to full production volume:

Grinder (Tier 3) → 250 questions
Chip Leader (Tier 4) → 250 questions

This is where the app transitions from:
👉 “training tool” → “serious skill progression system”

⚠️ Important Context Shift

Beginner/Apprentice = fundamentals
Grinder/Chip Leader = decision pressure + EV discipline

If these tiers are weak, the entire app feels shallow.

📦 Target Distribution
Grinder (Tier 3)
Category	Target
action	90
EV	70
outs	40
pressure/discipline	50
TOTAL	250
Chip Leader (Tier 4)
Category	Target
action	80
EV	80
outs	30
pressure/discipline	60
TOTAL	250
🧠 Category Evolution (IMPORTANT)

You already added position.

Now introduce:

New category (if not already added):
'pressure' | 'discipline'

You can either:

keep them separate, OR
combine into one category: "pressure"

👉 Recommendation: use one category: "pressure"
(simpler, cleaner analytics)

📁 File Structure
/data/grinder/
  grinderActionQuestions.ts
  grinderEvQuestions.ts
  grinderOutsQuestions.ts
  grinderPressureQuestions.ts
  index.ts

/data/chipLeader/
  chipLeaderActionQuestions.ts
  chipLeaderEvQuestions.ts
  chipLeaderOutsQuestions.ts
  chipLeaderPressureQuestions.ts
  index.ts
🔧 Authoring Rules (THIS MATTERS NOW)
1. No “easy mode” questions

If it feels obvious → it doesn’t belong here

2. Action questions must include:
facing raises
3-bet decisions
stack depth relevance
position conflicts
3. EV questions must step up

Introduce:

thin value decisions
marginal calls
borderline folds
4. Outs questions (reduced volume, higher quality)
combo draws
overlapping outs
disguised strength
5. Pressure questions (CORE OF THIS TIER)

Examples:

“You want to call… but should you?”
big pot decisions
dominated hand traps
reverse implied odds spots

This is where players fail → this is your edge.

🔁 Carryover Rule (VERIFY)
Must be preserved:
Tier	Mix
3	80% Grinder + 20% Apprentice
4	80% Chip Leader + 20% Grinder

🚫 NO:

Beginner leakage into Tier 3+
Apprentice leakage into Tier 4 except via Tier 3
🧪 Validation (MANDATORY)

Run:

validateAllTierQuestionBanks.ts

Ensure:

all tiers = 250
all categories valid
no missing metadata
no duplicate IDs
🔬 Sampling Audit

Run:

auditTierSampling.ts

Verify:

Level 12
~80% Grinder
~20% Apprentice
Level 17
~80% Chip Leader
~20% Grinder

🚫 No Beginner presence

📊 Update Status Dashboard

Update:

questionBankStatus.ts

With REAL counts:

Grinder: {
  target: 250,
  current: 250,
  byCategory: {
    action: 90,
    ev: 70,
    outs: 40,
    pressure: 50,
  }
}

Same for Chip Leader.

🎮 Manual Gameplay QA

Play:

Level 11
Level 13
Level 15
Level 17
Level 20

Check:

noticeable jump from Apprentice → Grinder
decisions feel uncomfortable (good)
fewer obvious answers
no repeated patterns
no broken UI
🚫 Non-Goals
Do not touch Master tier yet
Do not change scoring
Do not alter progression logic
Do not refactor engine
Do not add UI features
✅ Acceptance Criteria
Grinder = 250 questions
Chip Leader = 250 questions
Category distribution matches targets
All questions include metadata
No duplicate IDs
Validation passes clean
Sampling audit shows correct 80/20
No lower-tier leakage
Gameplay works without regression
Difficulty jump is clearly felt
📦 Deliverables
500 new questions (Tier 3 + 4)
new category (pressure)
updated validators (if needed)
updated status dashboard
verified progression integrity
💬 Suggested Commit Message
content(challenge): expand Grinder and Chip Leader tiers to 250 questions each