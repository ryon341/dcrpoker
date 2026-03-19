Taskcard 019 — Bankroll Analytics Polish: Trends, Basic Charts, Filters, Session Detail/Edit UI
Goal

Upgrade the bankroll module from a simple logger into a more useful player dashboard by adding:

session detail view

session edit flow

date/game-type filters

recent trend summaries

basic charts

cleaner bankroll analytics UX

This task is about making the bankroll module sticky and useful, not introducing advanced accounting complexity.

Scope
Build now

backend support for filtered summaries if needed

frontend session detail screen

frontend session edit screen

frontend filters on session history/dashboard

basic bankroll/profit trend charts

recent performance summaries

Do not build yet

CSV export

tax reports

staking/backing

advanced variance analytics

opponent/location deep analytics

spreadsheet imports

Product Rules
Session ownership

user can only view/edit their own sessions

Analytics scope

Focus on simple, actionable analytics:

total profit/loss

hourly rate

session count

recent 7/30 day trends

bankroll trend over time

Filters

At minimum support:

date range

game type

Optional:

stakes label

location

Backend Requirements

You already have:

session CRUD

adjustments

summary endpoint

Enhance as needed without overcomplicating.

Recommended structure:

src/
  controllers/
    bankrollController.js
  services/
    bankrollService.js
  routes/
    bankroll.js
Backend Endpoint Enhancements
A. Filtered Summary

Enhance:

GET /api/my/bankroll/summary

Support optional query params:

from

to

game_type

Example:

GET /api/my/bankroll/summary?from=2026-03-01&to=2026-03-31&game_type=cash

Behavior:

calculate summary using only matching sessions

adjustments should continue to count toward current bankroll only if you decide they are global; recommendation:

filtered summary applies to sessions only

current bankroll remains overall/global

return the filtered summary and indicate filters used

Response example:

{
  "ok": true,
  "data": {
    "filters": {
      "from": "2026-03-01",
      "to": "2026-03-31",
      "game_type": "cash"
    },
    "session_count": 8,
    "total_profit_loss_cents": 42000,
    "total_hours_played_decimal": 26.5,
    "average_profit_per_session_cents": 5250,
    "average_profit_per_hour_cents": 1585,
    "current_bankroll_cents": 134500,
    "biggest_win_cents": 18000,
    "biggest_loss_cents": -9000
  }
}
B. Session Detail Endpoint

You may already have GET /api/my/bankroll/sessions/:id.

Ensure it returns all fields needed for detail/edit:

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

created_at

updated_at

If already complete, no backend change needed.

C. Trend / Chart Data Endpoint

Add a lightweight endpoint for chart-ready data.

GET /api/my/bankroll/trends

Optional query params:

from

to

game_type

Return:

session-by-session trend data ordered by played_at

cumulative bankroll/profit trend

optional recent window summaries

Example response:

{
  "ok": true,
  "data": {
    "points": [
      {
        "session_id": 1,
        "played_at": "2026-03-01T20:00:00",
        "profit_loss_cents": 12000,
        "cumulative_profit_cents": 12000
      },
      {
        "session_id": 2,
        "played_at": "2026-03-05T20:00:00",
        "profit_loss_cents": -5000,
        "cumulative_profit_cents": 7000
      }
    ],
    "recent": {
      "last7DaysProfitCents": 9000,
      "last30DaysProfitCents": 42000,
      "last7DaysHours": 8.5,
      "last30DaysHours": 26.5
    }
  }
}

Keep this simple and efficient.

D. Optional Delete Session Endpoint

If you want edit UX to feel complete, add:

DELETE /api/my/bankroll/sessions/:id

Behavior:

ownership required

delete only authenticated user’s session

If you omit delete, note clearly in deliverable.

Recommendation

Add delete now if it is small. It will make the UI more complete.

Frontend Requirements

Add/update routes such as:

app/
  app/
    (protected)/
      bankroll/
        index.tsx
        sessions.tsx
        sessions/
          [id].tsx
          [id]/edit.tsx

Adjust route structure if needed.

Recommended API updates:

src/api/
  bankroll.ts
Core Frontend Features
1. Dashboard Filter Controls

Enhance bankroll dashboard with simple filters:

date from

date to

game type

Requirements:

filters apply to summary and trend data

current bankroll can remain overall/global if you choose

clear/reset filters button

Simple text/date inputs are acceptable for this task.

2. Basic Charts

Add basic charts to bankroll dashboard.

Recommended charts:

Profit trend over time (cumulative)

Session results over time (per session)

Keep it simple:

one or two charts max

no advanced styling needed

Use a React Native / Expo-compatible chart library already available or easy to install.

Important:

keep charts readable

do not overdesign

no multiple subplots in one canvas if avoidable; one chart per block is fine

3. Recent Performance Summary

Display:

last 7 days profit/loss

last 30 days profit/loss

last 7 days hours

last 30 days hours

This can be shown above or below charts.

4. Sessions History Filters

Enhance sessions history screen:

filter by game type

optional date range

keep list readable

At minimum:

user can apply simple filters and reload list

5. Session Detail Screen

Route example:

(protected)/bankroll/sessions/[id].tsx

Show:

date

game type

stakes

location

buy-in

cash-out

profit/loss

hours

notes

created/updated timestamps if helpful

Actions:

Edit session

Delete session (if delete endpoint added)

6. Session Edit Screen

Route example:

(protected)/bankroll/sessions/[id]/edit.tsx

Load existing session and allow editing:

played_at

game_type

stakes_label

location_name

buy_in

cash_out

hours_played

notes

Behavior:

submit to PATCH endpoint

backend recalculates profit/loss

on success navigate back to detail or sessions list

7. Delete Session Flow (Optional but Recommended)

If delete endpoint added:

provide delete button on session detail screen

confirmation prompt required

after delete, navigate back to sessions list and refresh

UX Requirements

This section needs to feel useful, fast, and clean.

Minimum

charts readable

filters understandable

money formatting clear

green/red profit indications if easy

detail/edit navigation obvious

loading/error/empty states

Suggested copy

“Track your results over time.”

“See where your game is heading.”

“Run your poker like a business.”

Charting Requirements

Use a simple, Expo-compatible chart library.

Keep charts to:

cumulative profit line chart

per-session profit chart (bar or line)

If chart library becomes painful:

fallback to a clean summary + trend list, but charts are preferred for this card

Validation Criteria

Task is complete only if all of the following are true:

Backend

/api/my/bankroll/summary supports filters

/api/my/bankroll/trends returns chart-ready data

session detail endpoint supports full detail/edit needs

optional delete endpoint works if implemented

Frontend

bankroll dashboard shows filtered analytics

bankroll dashboard shows at least one useful chart

recent 7/30 day summaries visible

sessions list supports filters

session detail screen works

session edit screen works

delete flow works if endpoint implemented

Constraints

do not build export features yet

do not build tax features yet

do not build advanced EV/variance models

keep analytics practical and lightweight

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

any new package installs

updated bankroll controller/service/routes

dashboard screen contents

session detail/edit screen contents

trend endpoint output example

exact test steps for:

filtered summary

trend chart rendering

session detail

session edit

delete session (if added)

note any chart library limitationsta