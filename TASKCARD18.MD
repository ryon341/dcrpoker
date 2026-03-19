Taskcard 018 — Bankroll + Session Tracking Foundation (Schema, Backend Endpoints, First Frontend Logging + Dashboard)
Goal

Build the first player-retention module:

log poker sessions

track profit/loss

track hours played

track bankroll changes over time

show a simple dashboard with totals and recent sessions

This module should work for all users, including players who are not yet connected to private games.

This is a major value feature and should be built cleanly.

Scope
Build now

bankroll/session schema

backend CRUD/read endpoints for sessions

backend summary endpoint

frontend session log screen

frontend session history screen

frontend bankroll dashboard screen

Do not build yet

advanced charts/graphs

CSV export

tax reports

staking/backing

advanced filters

imports from other apps

deep analytics

Product Rules
Session tracking

A user can log a poker session with:

date

game type

stakes

location

buy-in

cash-out

profit/loss

hours played

notes

Profit/Loss

if buy_in and cash_out are provided:

profit_loss = cash_out - buy_in

store profit_loss explicitly for reporting simplicity

allow manual override only if you think it is necessary; recommendation:

calculate automatically in backend

Bankroll

For MVP, bankroll is derived:

total bankroll change = sum of session profit_loss

plus manual adjustments

So this task should include:

session records

manual bankroll adjustments

dashboard summary

Database Changes

Create a new SQL file, for example:

src/db/schema/009_bankroll_and_sessions.sql
1. poker_sessions

Purpose: user-entered session log

Fields:

id bigint unsigned primary key auto_increment

user_id bigint unsigned not null

played_at datetime not null

game_type varchar(30) not null default 'cash'

stakes_label varchar(50) null

location_name varchar(150) null

buy_in_amount_cents int not null default 0

cash_out_amount_cents int not null default 0

profit_loss_cents int not null default 0

hours_played_decimal decimal(6,2) not null default 0.00

notes text null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key user_id → users(id)

Indexes:

index on user_id

index on played_at

index on game_type

index on stakes_label

Recommended game_type values:

cash

tournament

online

private

public

You can allow flexible strings if easier.

2. bankroll_adjustments

Purpose: manual bankroll adds/removes not tied to a specific session

Fields:

id bigint unsigned primary key auto_increment

user_id bigint unsigned not null

amount_cents int not null

adjustment_type varchar(30) not null default 'manual'

description varchar(255) null

created_at datetime not null default current_timestamp

Constraints:

foreign key user_id → users(id)

Indexes:

index on user_id

index on adjustment_type

index on created_at

Examples:

positive = bankroll added

negative = bankroll removed

Recommended adjustment_type values:

manual

deposit

withdrawal

correction

Backend Architecture

Add structure such as:

src/
  controllers/
    bankrollController.js
  routes/
    bankroll.js
  services/
    bankrollService.js

You can split sessions and adjustments into separate files if you prefer, but one controller is fine for this stage.

Backend Endpoint Requirements

All endpoints below require authMiddleware.

Use req.user.userId.

A. Create Session
POST /api/my/bankroll/sessions

Input example:

{
  "played_at": "2026-03-20T20:00:00",
  "game_type": "cash",
  "stakes_label": "1/2 NL",
  "location_name": "Friday Home Game",
  "buy_in_amount_cents": 20000,
  "cash_out_amount_cents": 28500,
  "hours_played_decimal": 4.5,
  "notes": "Good game, soft table"
}

Behavior:

validate required fields:

played_at

buy_in_amount_cents

cash_out_amount_cents

hours_played_decimal

calculate:

profit_loss_cents = cash_out_amount_cents - buy_in_amount_cents

insert row for authenticated user

Response:

{
  "ok": true,
  "data": { ...created session... }
}
B. List Sessions
GET /api/my/bankroll/sessions

Return authenticated user’s sessions.

Include:

id

played_at

game_type

stakes_label

location_name

buy_in_amount_cents

cash_out_amount_cents

profit_loss_cents

hours_played_decimal

notes

Support simple filters if easy:

game_type

from

to

Sort newest first by played_at.

C. Get One Session
GET /api/my/bankroll/sessions/:id

Return one session only if owned by authenticated user.

D. Update Session
PATCH /api/my/bankroll/sessions/:id

Allow updates to:

played_at

game_type

stakes_label

location_name

buy_in_amount_cents

cash_out_amount_cents

hours_played_decimal

notes

Behavior:

recalculate profit_loss_cents whenever buy-in or cash-out changes

ownership required

E. Create Bankroll Adjustment
POST /api/my/bankroll/adjustments

Input example:

{
  "amount_cents": 50000,
  "adjustment_type": "deposit",
  "description": "Added starting bankroll"
}

Behavior:

validate amount_cents

insert row for authenticated user

F. List Adjustments
GET /api/my/bankroll/adjustments

Return authenticated user’s adjustments, newest first.

G. Bankroll Summary Dashboard
GET /api/my/bankroll/summary

Return summary statistics for authenticated user.

Required values:

total_profit_loss_cents = sum of session profit_loss

total_hours_played_decimal

session_count

average_profit_per_session_cents

average_profit_per_hour_cents

current_bankroll_cents

calculated as:

sum(session profit_loss)

sum(bankroll adjustments)

Optional but recommended:

biggest_win_cents

biggest_loss_cents

Response example:

{
  "ok": true,
  "data": {
    "session_count": 12,
    "total_profit_loss_cents": 84500,
    "total_hours_played_decimal": 41.5,
    "average_profit_per_session_cents": 7042,
    "average_profit_per_hour_cents": 2036,
    "current_bankroll_cents": 134500,
    "biggest_win_cents": 32000,
    "biggest_loss_cents": -12000
  }
}
Backend Service Requirements

Create a service/helper that can compute bankroll summary cleanly.

Example:

async function getBankrollSummary(userId)

This should:

aggregate sessions

aggregate adjustments

compute rates safely

avoid divide-by-zero issues

Frontend Requirements

Add routes such as:

app/
  app/
    (protected)/
      bankroll/
        index.tsx
        log-session.tsx
        sessions.tsx
        adjustments.tsx

Recommended API files:

src/api/
  bankroll.ts
1. Bankroll Dashboard Screen

Route example:

(protected)/bankroll/index.tsx

Display:

current bankroll

total profit/loss

total hours

session count

average $/session

average $/hour

biggest win

biggest loss

Also show:

recent sessions (top 5 if easy)

buttons:

Log Session

View Sessions

Add Adjustment

Keep formatting readable:

dollars from cents

profit green / loss red if easy

2. Log Session Screen

Route example:

(protected)/bankroll/log-session.tsx

Fields:

played_at

game_type

stakes_label

location_name

buy_in

cash_out

hours_played

notes

Frontend note

It is acceptable to input money as dollars in the UI and convert to cents before sending.

Behavior:

submit to POST /api/my/bankroll/sessions

on success:

navigate back to dashboard or sessions list

refresh summary if needed

3. Sessions History Screen

Route example:

(protected)/bankroll/sessions.tsx

Display list of sessions:

date

game type

stakes

location

profit/loss

hours

Optional:

tap session to edit (nice to have, not required if this card gets too big)

At minimum:

list

loading

empty state

4. Add Adjustment Screen

Route example:

(protected)/bankroll/adjustments.tsx

For MVP, this can be a very simple screen with:

amount

adjustment_type

description

submit

Optional:

show recent adjustments below the form

UX Requirements

This is a player utility screen.
It should be simple and useful, not overdesigned.

Minimum

readable money formatting

loading / empty states

clear form labels

success / error messages

fast navigation between dashboard, log session, and history

Suggested wording

“Run your poker like a business.”

“Track your bankroll, sessions, and hourly rate.”

Validation Criteria

Task is complete only if all of the following are true:

Backend

user can create session

session profit/loss is calculated correctly

user can list own sessions

user can update own session

user can create bankroll adjustment

user can list own adjustments

summary endpoint returns correct totals and rates

Frontend

bankroll dashboard loads summary

user can log a session

sessions history screen works

adjustment screen works

money is displayed clearly

Constraints

do not build charts/graphs yet

do not build exports yet

do not build tax reports yet

do not overcomplicate filters yet

keep it focused on MVP usefulness

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

SQL migration contents

bankroll controller/service/route contents

frontend bankroll screen contents

exact test steps for:

create session

update session

create adjustment

view summary

sample JSON responses

Notes

This task is the first big player-retention feature not dependent on private games.