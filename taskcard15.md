Taskcard 015 — Level 3 Host Game Operations UI: RSVP Dashboard, Seat Preference Review, Manual Seat Assignment, Waitlist Management
Goal

Build the host-side game operations dashboard for Level 3 so a host can:

see all RSVP responses for a game

review seat preferences

manually assign seats

manually move players to confirmed / waitlist / declined

manage the waitlist

promote waitlisted players when spots open

This task turns the existing RSVP engine into a usable host control panel.

Scope
Build now

backend support for seat assignment and RSVP updates by host

frontend RSVP dashboard for a game

manual seat assignment UI

waitlist management UI

promote-from-waitlist action

host override controls

Do not build yet

auto seat optimization

multi-table support

billing enforcement

referral credits

advanced analytics

polished design system

push notifications

Product Rules
Host control

host can manually override RSVP-related state for their own games

host can assign seats regardless of player preference

host can honor or ignore seat preference

host decides who gets in once table is full

Seat model

seats are simple numeric positions:

1 through max_players

only one player can occupy a seat at a time

only confirmed players may hold an assigned seat

Waitlist model

waitlisted players have ordered waitlist_position

when a confirmed player is removed/declines, host can promote a waitlisted player

promotion should remove their waitlist position and move them to confirmed

RSVP statuses in this task

Use:

invited

confirmed

declined

waitlisted

Backend Requirements

Add/update backend files as needed, for example:

src/
  controllers/
    myGamesController.js
  routes/
    myGames.js
  services/
    seatAssignmentService.js

You can keep this inside myGamesController if cleaner, but service extraction is preferred for seat logic.

Database Assumptions

You already added in Task 14:

games.max_players

games.seat_assignment_enabled

game_invites.rsvp_status

game_invites.seat_preference

game_invites.assigned_seat_number

game_invites.waitlist_position

No new schema required unless you discover a missing index.
If you add indexes, keep it minimal.

Backend Endpoint Requirements

All endpoints below require authMiddleware.

All /api/my/games/... endpoints must enforce:

authenticated user owns the game

A. Update RSVP Status / Host Override
PATCH /api/my/games/:id/rsvps/:inviteId

Allow host to manually update RSVP-related fields for an invite on their own game.

Input may include:

{
  "rsvp_status": "confirmed",
  "seat_preference": "1",
  "assigned_seat_number": 3,
  "waitlist_position": null
}

Allowed updates:

rsvp_status

seat_preference

assigned_seat_number

waitlist_position

Rules:

host must own the game

invite must belong to the game

if assigned_seat_number is set:

rsvp_status must be confirmed

seat must be within 1..max_players

seat must not already be assigned to another confirmed invite for same game

if rsvp_status = waitlisted:

assigned_seat_number should be cleared

if rsvp_status = declined:

assigned_seat_number should be cleared

waitlist_position should usually be cleared unless explicitly set later

if rsvp_status = confirmed and no seat assignment provided:

allowed; seat can remain null for now

Response:

{
  "ok": true,
  "data": { ...updated invite row... }
}
B. Assign Seat Directly
POST /api/my/games/:id/assign-seat

Dedicated endpoint for easier frontend usage.

Input:

{
  "invite_id": 42,
  "seat_number": 5
}

Behavior:

validate ownership

validate seat number within range

validate seat is free

set:

rsvp_status = confirmed

assigned_seat_number = seat_number

waitlist_position = null

keep seat preference unchanged

Response:

{
  "ok": true,
  "data": {
    "invite_id": 42,
    "assigned_seat_number": 5,
    "rsvp_status": "confirmed"
  }
}
C. Clear Seat Assignment
POST /api/my/games/:id/clear-seat

Input:

{
  "invite_id": 42
}

Behavior:

validate ownership

clear assigned_seat_number

do not necessarily change rsvp_status unless your implementation chooses to; recommendation:

leave rsvp_status as confirmed

D. Promote Waitlisted Player
POST /api/my/games/:id/promote-waitlist

Input:

{
  "invite_id": 55,
  "seat_number": 7
}

Behavior:

validate ownership

invite must belong to this game

invite must currently be waitlisted

if seat_number provided:

validate seat is free

assign it

set:

rsvp_status = confirmed

waitlist_position = null

assigned_seat_number = seat_number || null

Optional enhancement:

after promotion, re-number remaining waitlist positions so they are contiguous

Recommendation

Do re-number remaining waitlist positions in this task. It makes the dashboard cleaner.

Response:

{
  "ok": true,
  "data": {
    "promoted_invite_id": 55,
    "assigned_seat_number": 7,
    "rsvp_status": "confirmed"
  }
}
E. Reorder Waitlist (Optional but Strongly Recommended)
POST /api/my/games/:id/reorder-waitlist

Input:

{
  "ordered_invite_ids": [55, 61, 70]
}

Behavior:

validate all belong to this game and are waitlisted

set waitlist positions in that order: 1, 2, 3

This is optional.
If omitted, note clearly in deliverable.

F. Enhanced RSVP Read Endpoint

You already added:

GET /api/my/games/:id/rsvps

Enhance response if needed to include:

invite id

player display_name

player username

phone

rsvp_status

seat_preference

assigned_seat_number

waitlist_position

responded_at

Also include helpful summary counts if easy:

{
  "ok": true,
  "data": {
    "game": {
      "id": 3,
      "title": "Friday Night 1/2 NL",
      "max_players": 9
    },
    "summary": {
      "confirmed_count": 7,
      "waitlisted_count": 2,
      "declined_count": 3,
      "open_seats": 2
    },
    "rsvps": [...]
  }
}

This is strongly recommended because it will simplify the UI.

Frontend Requirements

Main screen to add/update:

app/app/(protected)/games/[id]/index.tsx

Optional extract component(s):

app/src/components/
  RsvpDashboard.tsx
  SeatAssignmentPanel.tsx
  WaitlistPanel.tsx

You may keep everything in the page file if that is easier for now.

Core Frontend Features
1. RSVP Dashboard on Game Detail Screen

Enhance the existing game detail page so it becomes an operations dashboard.

Show clear sections:

Summary

max players

confirmed count

open seats

waitlisted count

declined count

Confirmed

List confirmed players with:

name

phone

seat preference

assigned seat number

responded at

Actions:

assign/change seat

clear seat

move to waitlist

decline/remove

Waitlist

List waitlisted players with:

waitlist position

name

phone

seat preference

responded at

Actions:

promote

assign seat during promotion

move up/down if reorder implemented

decline/remove

Invited / No Response

List invited players with:

name

phone

seat preference if any

current status

Actions:

confirm manually

waitlist manually

decline manually

Declined

Optional collapsible section.

2. Seat Assignment UI

For confirmed players:

dropdown or numeric selector for seat number

assign button

Requirements:

show seats 1..max_players

ideally indicate occupied seats

prevent submitting occupied seats

show backend error if collision occurs anyway

A simple select is acceptable.

3. Promote Waitlisted Player UI

For each waitlisted player:

button: Promote

optional seat picker before promote

Behavior:

if seat picked, call promote endpoint with seat

if no seat picked, confirm player without seat assignment

4. Host Override Status Controls

Provide compact controls to manually change status:

Confirm

Waitlist

Decline

This should call the RSVP patch endpoint.

Keep it simple:

button group or dropdown

5. Waitlist Reorder UI

If you implement reorder:

simple up/down buttons are enough

no drag-and-drop required

If reorder is omitted:

note that it will come later

6. Live Refresh / Reload

At minimum:

refresh data after every action

If easy:

add pull-to-refresh or refresh button

No need for websockets.

UX Requirements

This is an operations screen, not a marketing screen.
Prioritize clarity and speed.

Minimum requirements

clear status grouping

open seats visible at top

action buttons obvious

seat collisions surfaced clearly

loading/error states

success feedback after update

Suggested visual cues

confirmed = green

waitlisted = amber

declined = red

invited = blue/gray

You already started this in Task 14.

Logic / Validation Requirements
Confirmed seats

number of assigned seats cannot exceed max_players

same seat cannot be assigned twice

Promotion behavior

when promoting from waitlist:

remove waitlist position

optionally re-number remaining waitlist

promotion should not silently fail if game is full; host override is allowed in this task, but seat assignment still cannot collide

Recommendation

Allow host override to confirm even if confirmed_count exceeds max_players, but show warning in UI:

“Confirmed players exceed table capacity”

That keeps host in control.

Validation Criteria

Task is complete only if all of the following are true:

Backend

host can patch RSVP fields for own game invites

host can assign seat

host can clear seat

host can promote waitlisted player

seat conflicts are prevented

game ownership enforced

enhanced RSVP endpoint returns summary counts if implemented

Frontend

game detail page shows RSVP dashboard sections

host can assign/change seats

host can clear seats

host can promote waitlisted players

host can manually change RSVP status

data refreshes after actions

errors and success states are visible

Constraints

do not build auto-promotion yet

do not build advanced seat map

do not build messaging analytics

do not build billing yet

keep this operational and functional

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

controller/service/route contents for RSVP management

game detail screen contents

any new component contents

exact test steps for:

assign seat

clear seat

promote waitlisted player

manually change RSVP status

attempt seat collision

sample JSON responses

Notes

This task completes the first full host-run game operations loop:

invite

receive SMS replies

manage confirmed players

manage waitlist

assign seats

After this, Taskcard 016 should be:
PayPal billing foundation + host tier storage + usage/feature gating for Levels 1/2/3