Taskcard 025 — Host Game Management Dashboard (RSVP + Seats + Waitlist Control)
Objective

Build a host control panel that allows hosts to:

see who is coming

manage seats

manage waitlist

take action quickly

This upgrades your current RSVP system (TC014) into something usable in real life.

Why this card now

You already built:

RSVP via SMS (YES / NO / WAIT)

invite system

game creation

But right now:
→ hosts don’t have a strong control interface

This card fixes that.

Product concept

A live game control dashboard for hosts

Think:

lightweight

fast

mobile-first

action-oriented

Core features
1) Game RSVP Dashboard

Route:

/games/:gameId/manage

Host can see:

Confirmed Players

name

status: ✅ confirmed

optional:

seat number (future)

Waitlist

ordered list

position #1, #2, etc.

Declined / No Response

separate section

2) Host Actions (CRITICAL)

Each player row should allow:

Confirmed list:

❌ Remove player

🔄 Move to waitlist

Waitlist:

⬆ Move up

⬇ Move down

✅ Promote to confirmed (if seat available)

Declined:

🔁 Re-invite (future)

3) Seat Management

Game has:

max_players

System should:

prevent confirming beyond capacity

auto-place extra into waitlist

4) Auto logic (important)

When:

a confirmed player is removed

Then:
→ first waitlist player is auto-promoted

5) Live status summary (top of page)

Display:

Total seats: 9 / 9 filled

Waitlist: 3 players

Pending: 5 players

6) RSVP status mapping

Use existing values from TC014:

YES → confirmed

WAIT → waitlist

NO → declined

Backend requirements

You already have:

game_invites table

RSVP statuses

Now add:

New endpoint
GET
GET /api/games/:gameId/rsvps

Returns:

{
  "confirmed": [],
  "waitlist": [],
  "declined": [],
  "pending": []
}
Update endpoint
PATCH
PATCH /api/games/:gameId/rsvps/:inviteId

Body:

{
  "status": "confirmed" | "waitlist" | "declined",
  "position": 1
}
Auto-promotion logic

Backend should:

enforce seat limits

auto-promote from waitlist when seat opens

Frontend components

Suggested:

GameManagePage.jsx

RsvpSection.jsx

PlayerRow.jsx

SeatSummary.jsx

UI requirements

mobile-first (hosts will use phone)

fast taps (no heavy modals)

clear grouping:

Confirmed

Waitlist

Others

Navigation update

From:

Games list

Add button:
→ “Manage Game”

Permissions (IMPORTANT)

Only:
→ game host can access /manage

Add guard:

if not host → block access

Acceptance criteria

Taskcard complete when:

Host can open:
→ Game → Manage

Page displays:

confirmed players

waitlist

declined/pending

Host can:

move players between lists

promote waitlist

remove players

Seat limits enforced correctly

Auto-promotion works

Mobile UI works smoothly

Backend endpoints functional

Nice-to-have (only if easy)

drag-and-drop waitlist reorder

color indicators

quick “fill seat” button

Out of scope

notifications to players on move

payments / deposits

seat map UI (comes later)

analytics

Suggested file structure
client/src/pages/games/GameManagePage.jsx
client/src/components/games/RsvpSection.jsx
client/src/components/games/PlayerRow.jsx
client/src/components/games/SeatSummary.jsx

server/src/controllers/gameRsvpController.js
server/src/routes/gameRsvps.js
Handoff prompt for your coder
TASKCARD 025 — Host Game Management Dashboard

Objective:
Build a host dashboard to manage RSVPs, seats, and waitlist.

Frontend:
- route: /games/:gameId/manage
- sections:
  - Confirmed players
  - Waitlist
  - Declined / Pending

Features:
- move players between lists
- promote waitlist
- remove players
- enforce max_players

Backend:

GET /api/games/:gameId/rsvps
Return grouped lists:
- confirmed
- waitlist
- declined
- pending

PATCH /api/games/:gameId/rsvps/:inviteId
Update:
- status
- position

Logic:
- enforce seat capacity
- auto-promote waitlist when seat opens

UI:
- mobile-first
- fast interactions
- clear grouping

Permissions:
- only host can access

Acceptance:
- dashboard loads correctly
- actions update state
- seat limits enforced
- waitlist auto-promotion works

Return:
1. files created
2. files modified
3. endpoint structure
4. assumptions
What this unlocks (important)

After TC025:

hosts can actually run games

RSVP system becomes usable

you improve supply-side retention