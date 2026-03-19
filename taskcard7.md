Taskcard 007 — Game Creation + Host-Owned Game Write Endpoints + Invite Existing Players to Games
Goal

Build the first full host game management write flow:

host creates games

host updates their own games

host lists only their own games

host can invite existing registered players to a game

host can invite players from their own active host list to a game

duplicate invites are prevented

This task turns the current schema into a usable host-side game workflow.

Scope
Build now

create/update/list/get host-owned games

invite existing users to a game

invite players from host’s roster to a game

list invites for a host-owned game

optional remove/cancel game invite endpoint if clean

Do not build yet

public games

seat assignment

waitlist

SMS/email sending

RSVP replies

frontend screens

bankroll/blog/training features

Product Rules to Enforce
Games

a host can create their own games

a host can only manage games they own

games default to private

games are only visible to invited players

host may create draft or published games

Game invites

a host may invite:

an existing registered user directly

a player already on their active host list

a host cannot invite the same player to the same game twice

if player already invited and removed/declined exists, return clean status or update only if explicitly supported

keep logic simple and safe

Ownership

host can only modify:

their own games

invites belonging to their own games

Endpoint Requirements

All endpoints below require authMiddleware unless explicitly stated otherwise.

Use req.user.userId as the authenticated user id.

A. Host Game Write Endpoints
POST /api/games

Create a new game owned by the authenticated host.

Input example:

{
  "title": "Friday Night 1/2 NL",
  "description": "Cash game at the shop",
  "location_name": "Deer Creek Garage Room",
  "address_line_1": "123 Main St",
  "city": "Richmond",
  "state": "VA",
  "postal_code": "23220",
  "game_type": "cash",
  "stakes_label": "1/2 NL",
  "starts_at": "2026-03-25T19:00:00",
  "ends_at": "2026-03-26T01:00:00",
  "status": "draft"
}

Rules:

authenticated user becomes host_user_id

title required

default status to draft

default visibility to private

default is_active to 1

Response:

{
  "ok": true,
  "data": { ...created game... }
}
GET /api/my/games

Return only games owned by authenticated host.

Support simple optional filters if easy:

status

is_active

Sort newest first or by starts_at.

GET /api/my/games/:id

Return one game only if owned by authenticated host.

Include:

base game fields

invite count if easy

404 if not found or not owned.

PATCH /api/my/games/:id

Update a host-owned game.

Allow updates to:

title

description

location_name

address_line_1

address_line_2

city

state

postal_code

game_type

stakes_label

starts_at

ends_at

status

is_active

Do not allow changing:

host_user_id

visibility away from private yet unless already present and you want to allow only private for now

Validate ownership before update.

B. Invite Existing Registered Players to a Host-Owned Game
POST /api/my/games/:id/invites

Create a game invite for an existing registered user.

Input example:

{
  "player_user_id": 7
}

Rules:

authenticated user must own the game

player_user_id must exist

create game_invites row:

game_id

host_user_id = authenticated user

player_user_id

status = invited

prevent duplicates using existing unique constraint

if player is not already in host_players for this host:

either allow invite anyway

or auto-create active host_players

Recommendation

Auto-create host_players if missing, with:

host_user_id = authenticated user

player_user_id

status = active

That keeps the system consistent and saves steps.

Response should clearly indicate:

invite created

whether host-player link was newly created

Example:

{
  "ok": true,
  "data": {
    "invite_created": true,
    "host_player_created": false,
    "game_invite": { ... }
  }
}

If duplicate:

return 409 with clean error

C. Invite From Active Host List
POST /api/my/games/:id/invites/from-host-list

Bulk invite players from the authenticated host’s active roster.

Input example:

{
  "player_user_ids": [5, 6, 7]
}

Rules:

authenticated user must own the game

each player id must belong to authenticated user’s host_players with active status

insert game_invites for valid players

skip duplicates

return structured summary:

invited

skipped_duplicates

invalid_not_on_host_list

Example response:

{
  "ok": true,
  "data": {
    "invited_count": 2,
    "duplicate_count": 1,
    "invalid_count": 1,
    "invited_player_user_ids": [5, 6],
    "duplicate_player_user_ids": [7],
    "invalid_player_user_ids": [99]
  }
}

Important:

use parameterized queries

do not fail the whole request just because one id is invalid if partial processing is easy

D. List Invites for a Host-Owned Game
GET /api/my/games/:id/invites

Return invites for a game only if owned by authenticated host.

Include:

invite id

player_user_id

player display_name

player username

player phone

invite status

invited_at

responded_at

Optional filters if easy:

status

E. Optional: Remove / Cancel Invite

Add only if clean and small.

PATCH /api/my/games/:gameId/invites/:inviteId

Allow host to change invite status to:

removed

Rules:

host must own the game

invite must belong to that game

This is optional for this task. If omitted, note it clearly.

Backend Structure

Add files such as:

src/
  controllers/
    myGamesController.js
  routes/
    myGames.js

You may keep existing public read-only games routes intact.

Recommended separation:

existing /api/games = public or generic read routes

new /api/my/games = authenticated host-owned management routes

Query / Logic Requirements
Ownership checks

Every /api/my/games... endpoint must verify:

game exists

host_user_id = req.user.userId

Duplicate prevention

Use DB unique constraint on (game_id, player_user_id) and also handle gracefully in code.

Transactions

Use a transaction where useful, especially for:

create invite + maybe create host_players

Validation

Basic validation only:

ids must be numeric

title required for create

player ids required where applicable

Response Format

Use consistent JSON.

Success list
{
  "ok": true,
  "data": [...]
}
Success object
{
  "ok": true,
  "data": { ... }
}
Error
{
  "ok": false,
  "error": "Not found"
}

Use proper status codes:

200

201

400

401

403 if used

404

409

500

Validation Criteria

Task is complete only if all of the following are true:

Host games

authenticated host can create a game

authenticated host can list only their own games

authenticated host can get only their own game by id

authenticated host can update only their own game

Invites

authenticated host can invite existing registered player to owned game

duplicate invite is blocked cleanly

authenticated host can bulk invite from own active host list

invalid/non-owned host-list player ids are not invited

authenticated host can list invites for owned game

Safety

ownership enforced everywhere

parameterized queries used

no public access to host-owned write routes

Constraints

do not build public game listing logic yet

do not build seat assignment yet

do not build waitlist yet

do not build SMS/email yet

do not build frontend yet

keep this limited to host-owned game CRUD + invites

Deliverable

Return:

updated folder tree

controller contents

route contents

any SQL changes if needed

exact test requests for:

create game

list my games

get my game

update my game

invite registered player

bulk invite from host list

list game invites

sample JSON responses