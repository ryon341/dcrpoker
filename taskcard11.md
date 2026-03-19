Taskcard 011 — Existing Player Search + Add to Host List + Add Directly to Game Invited List
Goal

Build the workflow that lets a host find existing registered users on the platform and:

add them to the host’s private player list

invite them directly to a specific game

optionally do both in one action

This closes the gap between:

imported prospects

already-registered players

and makes the app much more usable early on.

Scope
Build now

backend search endpoint for registered users

backend endpoint to add an existing user to authenticated host’s player list

frontend player search screen

frontend add-to-host-list flow

frontend add-directly-to-game flow

optional combined action: add to host list + invite to game

Do not build yet

public player directory

fuzzy search at large scale

advanced privacy settings

messaging

seat assignment

waitlist

bankroll/charts/blog/training

Product Rules to Enforce
Existing player search

host can search for registered users

search should be limited and privacy-conscious

results should show only minimum fields needed to identify a player

Privacy

search results should not expose the full user base in an unrestricted way

use simple search by:

display_name

username

phone

email if present

Host list behavior

host may add an existing user to their private player list

a player may be on multiple hosts’ lists

host cannot add the same player twice

Game invite behavior

host may directly invite an existing user to a specific game

if host-player relationship does not exist, it should be created automatically or explicitly depending on endpoint

Recommendation

For clean UX:

direct game invite should also ensure host_players exists

Backend Requirements

Add organized files as needed, such as:

src/
  controllers/
    playerSearchController.js
    hostPlayersController.js
  routes/
    playerSearch.js
    myPlayers.js

You may merge into existing controllers if cleaner, but keep the code organized.

Backend Endpoint Requirements

All write endpoints require authMiddleware.

A. Search Existing Registered Players
GET /api/player-search

Authenticated route.

Query params:

q required search string

Example:

GET /api/player-search?q=mike

Behavior:

search registered users

match against:

display_name

username

phone

email

exclude the authenticated user from results

limit result count to something reasonable, e.g. 20

only return active users

Response should include minimal identifying info:

id

display_name

username

phone (mask partially if you want, but not required yet)

email (optional, can be null)

roles if easy

Suggested response:

{
  "ok": true,
  "data": [
    {
      "id": 7,
      "display_name": "Mike Carter",
      "username": "mikec",
      "phone": "5552223333",
      "email": "mike@example.com"
    }
  ]
}

Important:

use parameterized queries

require minimum query length, e.g. 2 characters

return empty list for short queries if desired

B. Add Existing User to Host List
POST /api/my/players

Authenticated route.

Input:

{
  "player_user_id": 7,
  "notes": "plays Fridays"
}

Behavior:

authenticated user becomes host_user_id

verify target user exists

prevent adding self

insert into host_players

status should be active

prevent duplicates cleanly

Response:

{
  "ok": true,
  "data": {
    "host_player_created": true,
    "host_player": { ... }
  }
}

If duplicate:

return 409 cleanly

C. List Authenticated Host’s Private Player List (Self Route)

You likely already have a host-player list read endpoint by host id.
Add a self-owned convenience route for frontend use.

GET /api/my/players

Authenticated route.

Behavior:

return only authenticated user’s host player list

include:

host_players.id

player_user_id

display_name

username

phone

email

status

notes

added_at

Optional filters if easy:

status

This will make frontend roster selection much cleaner.

D. Optional: Add Existing User to Host List and Invite to Game in One Call

If clean and small, add:

POST /api/my/games/:id/add-player

Authenticated route.

Input:

{
  "player_user_id": 7,
  "notes": "new local player"
}

Behavior:

verify authenticated user owns the game

ensure user exists

ensure host_players exists (create if missing)

ensure game_invites exists (create if missing)

return structured result

Suggested response:

{
  "ok": true,
  "data": {
    "host_player_created": true,
    "game_invite_created": true
  }
}
Recommendation

Add this endpoint if it reduces frontend duplication.
Otherwise frontend can call:

POST /api/my/players

POST /api/my/games/:id/invites

Either approach is acceptable, but the combined endpoint is cleaner UX.

Frontend Requirements

Recommended route additions:

app/
  app/
    (protected)/
      players/
        search.tsx
        index.tsx

Or place the search flow under games if preferred.

Recommended API files:

src/
  api/
    players.ts
1. Existing Player Search Screen

Route example:

(protected)/players/search.tsx

Requirements:

input for search text

search calls GET /api/player-search?q=...

show results list

each result should show:

display_name

username

phone/email if returned

each result should provide actions:

Add to My Players

Invite to Game (if game context exists)

optionally Add + Invite

This screen may be used in two modes:

Mode A — general search

User opens search screen from navigation

can add to private player list

Mode B — game invite context

User opens search screen from a specific game

can invite directly to that game

can also add to player list

You can pass gameId in route params.

2. My Players List Screen

Route example:

(protected)/players/index.tsx

Requirements:

fetch GET /api/my/players

display authenticated host’s private player list

show:

display_name

username

phone

status

notes

include link/button to:

Search Existing Players

This becomes the real host roster screen.

3. Add to Host List Flow

From search results:

tap Add to My Players

call POST /api/my/players

show success/error feedback

if duplicate, show clean “Already on your list”

4. Invite Existing User to Game Flow

From search results in game context:

tap Invite to Game

either:

call combined endpoint if built

or call game invite endpoint and let backend ensure host-player link

show success/error feedback

Route integration idea:

from game detail or invite screen, add button:

Find Existing Player

5. Add + Invite Flow (Preferred UX)

If game context exists, best button set is:

Add to My Players

Invite to This Game

Add + Invite

If you build combined endpoint, use that for Add + Invite.

If not, chain two calls with clean error handling.

UX Requirements

Keep it simple and practical.

Minimum:

search box

search button or debounced search

results list

clear action buttons

loading state

empty state

duplicate message

error message

Recommended copy:

“Search registered players”

“Add to My Players”

“Invite to Game”

“Already on your list”

Query / Validation Rules
Search

minimum 2 characters

max 20 results

active users only

exclude self

Add to host list

prevent self-add

prevent duplicate relationship

Invite to game

enforce game ownership

prevent duplicate invite

Validation Criteria

Task is complete only if all of the following are true:

Backend

authenticated user can search existing registered players

authenticated user can add existing player to own host list

authenticated user can fetch own host player list through self route

authenticated user can invite searched player to owned game

duplicates are handled cleanly

Frontend

host can open player search screen

host can search and see results

host can add a result to private player list

host can invite a result to a game

my players list screen works

game-context invite flow works

Constraints

do not build global player discovery beyond basic search

do not expose a public directory

do not build messaging yet

do not build seat assignment yet

do not over-polish UI

keep privacy tight

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

route/controller contents

frontend screen contents

any API helper contents

exact test steps for:

search player

add to host list

list my players

invite searched player to game

sample JSON responses

Notes

This task fills one of the biggest practical gaps in the app:
hosts can now recruit from both:

existing platform users

imported prospects