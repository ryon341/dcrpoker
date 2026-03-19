Taskcard 023 — Training Mode (Quiz Engine: Preflop + Odds)
Objective

Introduce a Training Mode that converts your existing tools into an interactive learning system.

Users will:

answer poker scenarios

get immediate feedback

build skill over time

This is your first retention engine.

Why this card now

You already have the building blocks:

Preflop charts → correct answers

Odds calculator → probability logic

Now:
→ turn those into questions

Product concept

We are building:

A lightweight poker training system with:

scenario generation

multiple choice answers

instant feedback

NOT:

a full coaching platform

not gamified to death

not over-engineered

Training modes (MVP)
1) Preflop Trainer (PRIMARY)

User is given:

position

stack depth

number of players

hole cards

User must choose:

Fold

Call

Raise

Correct answer is pulled from:
→ your preflop chart dataset (TC021)

2) Odds Trainer (SECONDARY)

User is given:

draw scenario OR outs

User must estimate:

probability range

Example:

“You have a flush draw on the flop. What is your chance to hit by the river?”

Choices:

20%

35% ✅

50%

65%

User flow

Tools → Training Mode

Select:

Preflop Trainer

Odds Trainer

Answer question

See:

correct answer

explanation

Continue → next question

Preflop Trainer details
Scenario example:

9-max

100bb

CO

Hand: AJo

User chooses:

Fold / Call / Raise

System checks:
→ lookup in chart dataset

Odds Trainer details
Scenario types:

flush draw

straight draw

combo draw

manual outs

System:

randomly picks outs (4–15 range)

generates MC answers

Answer system
Preflop:

exact match from dataset

Odds:

correct % ± realistic distractors

Example:
Correct = 36%
Options:

24%

36% ✅

48%

60%

Feedback system

After answer:

Show:

Correct / Incorrect

Correct action

short explanation

Examples:

Preflop:

“Raise is correct. From CO at 100bb, AJo is part of a standard opening range.”

Odds:

“9 outs ≈ 36% by river (rule of 4).”

Session structure (MVP)

Keep simple:

infinite mode (no session end required)

or optional:

5-question session

10-question session

Track:

correct / incorrect count (in memory)

UI components

Suggested:

TrainingPage.jsx

TrainerSelector.jsx

QuestionCard.jsx

AnswerButtons.jsx

ResultFeedback.jsx

Routes

/tools/training

/tools/training/preflop

/tools/training/odds

Data reuse (IMPORTANT)

Use:

preflopCharts.js (TC021)

oddsCalculator.js (TC022)

Do NOT duplicate logic.

Question generation
Preflop

Randomly select:

position

hand

Then:

lookup correct action

Odds

Randomly select:

outs OR draw type

Then:

compute correct %

generate answer options

State management

MVP:

local component state only

No backend required.

Scoring (basic)

Track:

correct answers

total answers

Display:

simple running score

Example:

“Score: 7 / 10”

Engagement hooks (IMPORTANT)

Add:

“Next Question” button

quick feedback loop (<2 seconds per question)

Goal:
→ rapid repetition

Access / billing

For now:
→ FREE for all users

Later:

advanced training → paid

Acceptance criteria

Taskcard complete when:

User can open Training Mode

User can select:

Preflop Trainer

Odds Trainer

Preflop Trainer:

generates valid scenarios

checks against chart dataset

gives correct feedback

Odds Trainer:

generates outs/draw scenarios

calculates correct %

generates answer choices

UI:

mobile-friendly

fast interaction loop

Score tracking works (session-level)

No backend required

Nice-to-have (only if easy)

streak counter

difficulty toggle (easy / medium)

timer per question

Do NOT delay core delivery.

Out of scope

user accounts tracking stats

leaderboard

saving history

advanced GTO training trees

spaced repetition system

Suggested file structure
client/src/pages/tools/TrainingPage.jsx
client/src/pages/tools/PreflopTrainer.jsx
client/src/pages/tools/OddsTrainer.jsx
client/src/components/training/QuestionCard.jsx
client/src/components/training/AnswerButtons.jsx
client/src/components/training/ResultFeedback.jsx
client/src/lib/trainingEngine.js
Core engine example
export function generatePreflopQuestion(charts) {
  const positions = ['UTG', 'MP', 'CO', 'BTN'];
  const hands = Object.keys(charts[0].ranges);

  const position = positions[Math.floor(Math.random() * positions.length)];
  const hand = hands[Math.floor(Math.random() * hands.length)];

  const chart = charts.find(c => c.position === position);
  const correct = chart.ranges[hand];

  return { position, hand, correct };
}
Handoff prompt for your coder
TASKCARD 023 — Training Mode (Preflop + Odds)

Objective:
Build a training system that turns existing tools into interactive quizzes.

Modes:
1) Preflop Trainer
2) Odds Trainer

Preflop Trainer:
- generate scenario (position, hand)
- user selects: fold / call / raise
- validate using preflopCharts dataset

Odds Trainer:
- generate outs or draw type
- compute correct %
- present multiple choice answers

UI:
- fast interaction
- mobile-first
- question → answer → feedback → next

Features:
- score tracking (session only)
- instant feedback

Routes:
/tools/training
/tools/training/preflop
/tools/training/odds

No backend required.

Acceptance:
- both trainers functional
- answers validated correctly
- UI responsive and fast

Out of scope:
- saving progress
- leaderboards
- advanced training trees

Return:
1. files created
2. files modified
3. how questions are generated
4. assumptions
What this unlocks (important)

After TC023:

users have a reason to return daily

you now have:

tools

learning

engagement