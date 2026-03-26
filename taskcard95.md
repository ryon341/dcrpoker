TC095 — Grand Champion + Endgame Experience

Objective
Convert Tier 5 completion into a high-impact endgame moment and introduce a post-completion loop that drives retention (replay, gauntlet, or infinite mode). This turns the system from “complete” into “compelling.”

🎯 WHY THIS MATTERS

You now have:

5 fully generated tiers (1–25 levels)
stable progression + scoring

What’s missing:

a meaningful finish
a reason to keep playing after Level 25

This task delivers:

emotional payoff (reward moment)
brand reinforcement (DCR identity)
replayability loop (keeps users in app)
🧱 FEATURE BREAKDOWN
1) Grand Champion Trigger (Level 25 Completion)

Trigger condition:

User completes Level 25 (Master Tier, Level 5)

Hook already exists → now fully implement.

2) Grand Champion Screen (Primary Deliverable)
Required Elements
Title: “GRAND CHAMPION”
Subtext: “You have completed all 25 levels”
Visual: DCR bracelet / trophy (Deer Creek Road branding)
Score summary:
Final score
Accuracy %
Best streak (if available)
CTA Buttons
Play Again (Fresh Run)
Elite Gauntlet
Exit to Menu
3) Elite Gauntlet Mode (Core Replay Loop)
Concept

A mixed-tier challenge mode using all generated banks.

Rules
Infinite or fixed-length (recommend: 25 questions per run)
Pull from all tiers with weighted difficulty:
10% Beginner
15% Apprentice
20% Grinder
25% Chip Leader
30% Master
Behavior
No levels — continuous session
Same scoring system
Ends on:
fixed question count OR
optional “3 strikes” mode (future)
4) Completion Persistence

Track:

hasCompletedChallenge: boolean
grandChampionAchievedAt: timestamp

Used for:

unlocking gauntlet without replay
UI badges
future monetization/features
5) Post-Completion Entry Points

After first completion:

Show “Grand Champion” badge on challenge menu
Allow:
resume gauntlet directly
replay tiers optionally
✅ ACCEPTANCE CRITERIA
Completion Trigger
Level 25 completion launches Grand Champion screen
UI
Screen renders cleanly
No crashes
Buttons functional
Gauntlet Mode
Pulls from all generated banks
Distribution roughly matches weights
Questions render correctly across all categories
Persistence
Completion flag saved
Reload preserves status
Replay
“Play Again” resets progress cleanly
Does NOT break saved data model
TypeScript
No new errors
🔧 IMPLEMENTATION PLAN
1. Build GrandChampionModal.tsx

New component:

components/GrandChampionModal.tsx

Props:

visible: boolean
finalScore: number
accuracy: number
onReplay: () => void
onGauntlet: () => void
onExit: () => void
2. Wire Trigger in index.tsx

In progression logic:

Replace existing hook:

if (level >= MAX_CHALLENGE_LEVEL)

With:

setShowGrandChampion(true)
3. Add Gauntlet Mode
New mode flag
mode: 'challenge' | 'gauntlet'
Question source logic

Create helper:

getGauntletQuestion()
randomly selects tier based on weights
pulls random question from that tier bank
4. Add Gauntlet Session Logic
fixed length (25 questions recommended)
track score
reuse scoring system
5. Persistence Update

Update storage model:

{
  completedTiers: string[]
  unlockedTiers: string[]
  hasCompletedChallenge: boolean
}
6. Menu Integration

On challenge home:

if hasCompletedChallenge === true
show:
“Grand Champion” badge
“Play Gauntlet” button
7. QA PASS

Verify:

complete Level 25 → screen appears
replay works
gauntlet works
reload keeps completion status
no crashes across modes
📦 EXPECTED VS CODE OUTPUT
Files added
Files modified
Confirmation Grand Champion triggers correctly
Gauntlet distribution check
Persistence behavior confirmation
Any UI/layout notes
🧾 DEFINITION OF DONE

TC095 is complete when:

Level 25 completion produces a polished Grand Champion experience
Gauntlet mode is playable and stable
Completion persists
Replay works cleanly