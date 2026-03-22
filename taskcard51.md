TC051 — Challenge Pool System + Level-Based Difficulty Engine
Goal

Replace the current linear/mock challenge flow with a scalable, non-repeating, level-based challenge system that:

pulls from structured pools
increases difficulty by level
avoids repetition
supports future expansion easily

This is the backbone of the entire game.

🧠 Core Concept

Instead of:

currentChallengeIndex++

You move to:

getNextChallenge(level, history)
📁 Files To Create
1. challengePools.ts

Defines structured pools by level tier.

export const challengePools = {
  beginner: [],   // Levels 1–3
  easy: [],       // Levels 4–6
  intermediate: [], // Levels 7–12
  advanced: [],   // Levels 13–18
  expert: [],     // Levels 19–25
};
2. challengeSelector.ts

Core engine for selecting next challenge.

Functions:

getPoolForLevel(level: number): PoolType

getNextChallenge({
  level,
  history,
}: {
  level: number;
  history: string[];
}): Challenge
3. challengeTypes.ts

Formalize challenge structure (if not already clean):

export type Challenge = {
  id: string;
  question: string;
  heroHand: [string, string];
  villainHand: [string, string];
  correctAnswer: 'yes' | 'no';
  explanation: string;
  runout: [string, string, string, string, string];
  heroWins: boolean;

  // NEW:
  difficulty: 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';
  tags: string[]; // ["BTN vs BB", "suited connectors", etc.]
};
🎯 Difficulty Mapping
Level → Pool
function getPoolForLevel(level: number) {
  if (level <= 3) return 'beginner';
  if (level <= 6) return 'easy';
  if (level <= 12) return 'intermediate';
  if (level <= 18) return 'advanced';
  return 'expert';
}
🔁 Anti-Repetition System

Maintain:

recentHistory: string[] // last ~10–20 challenge IDs
Selection rules:
filter pool to exclude recentHistory
if pool exhausted → allow reuse but shuffle
randomize selection
🧩 Selection Logic
export function getNextChallenge({ level, history }) {
  const poolType = getPoolForLevel(level);
  const pool = challengePools[poolType];

  let available = pool.filter(c => !history.includes(c.id));

  if (available.length === 0) {
    available = pool; // fallback
  }

  return available[Math.floor(Math.random() * available.length)];
}
🔄 State Changes

Add to main game state:

challengeHistory: string[]

Update after each hand:

setHistory(prev => [...prev.slice(-15), currentChallenge.id]);
🔌 Integration Changes
Replace this:
currentChallengeIndex++
With:
const next = getNextChallenge({
  level,
  history: challengeHistory,
});
setCurrentChallenge(next);
📊 Difficulty Design (Important)
Beginner (Levels 1–3)
obvious folds/calls
strong hands vs weak hands
no tricky spots
Easy (4–6)
basic position awareness
suited vs offsuit differences
simple traps
Intermediate (7–12)
marginal hands
mixed decisions
common leaks
Advanced (13–18)
close GTO spots
blocker effects
wider ranges
Expert (19–25)
very thin decisions
exploit vs GTO conflicts
high-level spots
🧠 Future-Proofing (Important)

This structure allows:

adding 1,000+ challenges later
rotating daily content
A/B testing difficulty
tagging by scenario
🎮 Optional Enhancement (Low Effort / High Value)

Weight difficulty within pools:

Example:

intermediate: [
  { difficultyWeight: 1 },
  { difficultyWeight: 2 },
]

Then bias toward harder questions as level increases.

(Not required for this taskcard)

✅ Acceptance Criteria
Game no longer uses linear challenge index
Challenges are selected based on level
No immediate repeats within ~15 hands
Difficulty increases as level increases
Game continues working with existing UI
Challenge selection is stable and random
No crashes when pool is exhausted
Easy to add more challenges later
📦 Deliverable Back

When done, report:

files created
files modified
how many challenges exist per pool (even if small for now)
whether repetition prevention is working
example of 3 different challenges pulled at same level
🚨 Important Note

This taskcard is foundation, not content.

👉 Keep pools small for now (5–10 per tier)

We will mass-generate content next.