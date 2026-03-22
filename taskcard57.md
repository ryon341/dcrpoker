TC057 — Daily Challenge Mode + Seeded Run + Daily Reset Logic
Goal

Add a Daily Challenge mode that gives every player the same short run of hands each day, resets automatically each new day, and tracks whether the user has already completed that day’s run.

This adds:

repeatable daily engagement
a fair, shared daily sequence
a lightweight “come back tomorrow” loop

Do not add leaderboards yet.
Do not change the main progression mode rules.

Scope

Implement:

daily challenge mode entry
deterministic seeded daily hand selection
fixed-length daily run
daily reset detection
daily result persistence
clean UI separation from main progression mode
Daily Mode Rules
Daily Challenge format
5 hands per day
same 5 hands for everyone on the same day
no bonus wheel in daily mode
no level progression in daily mode
no main-score progression changes
stats may optionally track daily separately, not mixed into main progression stats
Scoring in daily mode

Use the same hand scoring rules:

Correct + Win = +13
Correct + Lose = +7
Incorrect + Win = -5
Incorrect + Lose = -10
score floor = 0

But this score is daily-run local score, not the player’s main progression score.

Files To Create
1. dailyChallenge.ts

Core daily logic.

Functions:

getDailySeed(dateString: string): string
seededShuffle<T>(items: T[], seed: string): T[]
getDailyChallengeSet(dateString: string, allPools): Challenge[]
getDailyChallengeId(dateString: string): string
Rules
Use current date as seed source
Pick 5 challenges deterministically from the full challenge pool
Favor variety across difficulty if practical:
recommended: 1 beginner, 1 easy, 1 intermediate, 1 advanced, 1 expert
If that complicates things, acceptable fallback:
deterministic selection from all challenges

Preferred approach:

1 hand from each tier so daily mode feels varied
2. dailyStorage.ts

Persistence for daily completion state.

Types:

export type DailyChallengeProgress = {
  dailyId: string;           // e.g. "2026-03-21"
  completed: boolean;
  currentIndex: number;
  score: number;
  answers: Array<{
    challengeId: string;
    selectedAnswer: 'yes' | 'no';
    isCorrect: boolean;
    heroWins: boolean;
    delta: number;
  }>;
  completedAt?: string | null;
};

Functions:

loadDailyProgress(userId?: string | null)
saveDailyProgress(progress, userId?: string | null)
clearDailyProgress(userId?: string | null)

Guest and user storage keys should remain separate, just like main progress.

3. DailyChallengeCard.tsx

Home/entry card or panel for daily mode.

Show:

Daily Challenge
status:
Not Started
In Progress
Completed
today’s date or label like Today’s Run
CTA button:
Start
Resume
View Results
4. DailyChallengeResultsModal.tsx

Shown at the end of the run.

Show:

final daily score
correct count out of 5
optional win/loss count
simple completion message:
Come back tomorrow for a new challenge
Files To Modify
poker-challenge/index.tsx
challengeSelector.ts only if needed for utilities
progressStorage.ts only if you choose to colocate types, but prefer not to
route / navigation files if adding a dedicated daily screen
optionally the page that launches Poker Challenge mode
Route / Mode Design

You have two acceptable options.

Option A — Single page, mode param

Use the same page with a route param or internal mode switch:

/poker-challenge?mode=daily
Option B — Separate route
/poker-challenge/daily

Preferred:

separate route if routing is easy
otherwise mode param is fine
Daily Challenge Flow
On open
determine today’s daily ID using current local date
load saved daily progress for that daily ID
if none exists, create new daily state using seeded challenge set
if completed, show results state / replay-disabled summary
During run

For each of the 5 hands:

same reveal flow as main game
same hand scoring
no wheel
no level modal
no main progression save updates
On completion
save completed state
show results modal
lock further play for that date unless you choose to allow “view only”

Recommended:

do not allow replay for score once completed
allow viewing results only
Daily Reset Logic

Use the local date string in a stable format, e.g.:

YYYY-MM-DD
Behavior

If saved daily progress belongs to an older date:

ignore it for active play
start a new daily run for the new date

Do not delete old progress unless convenient. It’s okay to overwrite the stored daily object with the new day’s object.

Seed Logic

Need deterministic ordering.

Suggested implementation:

create seeded PRNG from date string
shuffle a copy of the selected pool arrays
take first item from each tier

Example desired composition:

1 beginner
1 easy
1 intermediate
1 advanced
1 expert

This makes the daily run feel curated and gives all users the same set.

State Model for Daily Mode

Add a separate daily state, do not mix with main progression state.

Possible local state:

mode: 'main' | 'daily'
dailyProgress
dailyChallenges
dailyCurrentChallenge
dailyResolved
dailyCompleted

Or route it as a separate screen state if cleaner.

UI Requirements
Entry card

Place somewhere sensible:

on poker challenge landing area
or at top of the main challenge page as a secondary mode card
Daily HUD

When in daily mode, header should clearly say:

Daily Challenge
Hand 3 of 5
Daily Score: 21

Do not show:

level
wheel status
next title
guest level lock messaging

Daily mode is standalone.

Stats Handling

For this taskcard, do not merge daily results into main progression stats unless it is trivially easy.

Preferred:

keep daily progress separate
only track daily completion result inside daily storage

Later, if desired, we can add:

daily streak days completed
best daily score

Not required now.

Acceptance Criteria
Daily Challenge mode exists and can be launched
Same 5 challenges are produced for the same calendar day
Challenge order/content changes on the next day
Daily run is limited to 5 hands
No wheel appears in daily mode
No level progression occurs in daily mode
Daily score is tracked separately from main progression
Daily progress can be resumed if partially completed
Completed daily run cannot be replayed for new score the same day
Results modal appears at the end
Guest and logged-in daily storage remain separate
Main mode continues working unchanged
Deliverable Back

When complete, report:

files created
files modified
daily route or mode entry path
how the seed is generated
sample daily set for one date
whether partial daily progress resumes correctly
screenshot of:
daily entry card
daily hand screen
completed daily results modal

After this, the next card should be: