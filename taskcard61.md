TC061 — Full Stats Page + Lifetime Performance Dashboard
Goal

Turn your existing stats into a real player dashboard that:

makes the app feel serious (not just a game)
shows improvement over time
reinforces retention (“I want to improve my stats”)

You already track everything — this taskcard is presentation + structure + insight layer.

🧠 Product Intent (Important)

This page should feel like:

Poker training report + performance tracker

Not just numbers.

📁 Files To Create
1. statsPage.tsx

Route:
👉 /poker-challenge/stats

This is the main screen.

2. StatsCard.tsx

Reusable card component.

Used for:

accuracy
win rate
streaks
totals
3. StatsBar.tsx

Horizontal stat bar (visual meter)

Used for:

accuracy %
win %
optional future metrics
4. StatsSection.tsx

Wrapper for grouped sections.

📁 Files To Modify
usePokerProgress.ts (ensure stats exposed cleanly)
ChallengeHeader.tsx (add button → Stats page)
routing config (register /poker-challenge/stats)
📊 Data Source

Use existing:

stats: PokerStats

From your current model:

{
  totalHandsPlayed,
  totalCorrect,
  totalIncorrect,
  totalWins,
  totalLosses,
  currentStreak,
  bestStreak,
  wheelSpins,
  totalWheelPoints,
  highestLevelReached
}

Plus derived:

accuracy = totalCorrect / totalHandsPlayed
winRate = totalWins / (totalWins + totalLosses)
🧱 Page Layout
🔷 SECTION 1 — Player Identity

Top of page:

Title (from titleSystem)
Level
Optional subtitle:
“Performance Dashboard”
🔷 SECTION 2 — Core Performance

Use large stat cards

Show:
Accuracy %
Win Rate %
Hands Played
Highest Level
🔷 SECTION 3 — Streaks

Show:

Current Streak 🔥
Best Streak

Optional:

Daily streak (if easy to include)
🔷 SECTION 4 — Totals

Show:

Total Correct
Total Incorrect
Total Wins
Total Losses
🔷 SECTION 5 — Wheel / Rewards

Show:

Wheel Spins
Total Wheel Points
🔷 SECTION 6 — Progress Insight (IMPORTANT)

Add 2–3 simple insights:

Examples:

“You answer correctly 62% of the time”
“Your best streak is 9 hands”
“You perform best in mid levels” (optional later)

Start simple.

🎨 UI Requirements
Style
match your current neon / poker aesthetic
use:
glow accents
dark background
gold highlights for key stats
Cards

Each stat card:

label (small)
value (large, bold)
optional icon
🧩 Example Stat Card
<StatsCard
  label="Accuracy"
  value="68%"
  subtext="Correct decisions"
/>
📊 StatsBar (visual)

For accuracy:

fill bar to %
color:
red < 50
yellow 50–70
green > 70
🔗 Navigation

Add entry point:

Option A (recommended)

Button in header:
👉 “Stats”

Option B

Button under main game:
👉 “View Performance”

🧠 Derived Logic
Accuracy
accuracy = totalHandsPlayed > 0
  ? Math.round((totalCorrect / totalHandsPlayed) * 100)
  : 0
Win Rate
winRate = totalWins + totalLosses > 0
  ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
  : 0
🧠 Empty State

If no hands played:

Show:

“Play your first hands to see stats”

Do NOT show zeros everywhere with no context.

⚠️ Edge Cases

Handle:

divide by zero
missing stats (old users)
partial data
🎯 Acceptance Criteria
Stats page loads correctly
Displays all core metrics
Accuracy and win rate calculated correctly
Title + level shown at top
Streaks displayed correctly
Works for both guest + logged-in users
No crashes with empty stats
Navigation to/from stats works cleanly
UI consistent with app design
Page loads fast (no heavy computation)
📦 Deliverable Back

When complete, report:

files created
files modified
route path
screenshot of stats page
sample stats output (real or mock)
confirm accuracy + win rate calculations