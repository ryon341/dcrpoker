Taskcard 004 — Seed/Test Data + Read-Only Core API Endpoints
Goal

Build the first usable backend layer for DCR Poker by adding:

seed/test data for the new core schema

read-only API endpoints for:

users

games

host player lists

game invites

This task is for backend read access only.
Do not add authentication, write endpoints, or frontend integration yet.

The purpose is to verify that the schema is correct and that the API shape is usable before moving into auth and mutations.

Scope

Use the existing schema created in Taskcard 003:

users

roles

user_roles

games

host_players

game_invites

If external_invites was created, ignore it for this task unless needed for test data.

Requirements
1. Create seed/test data SQL

Create a seed SQL file, for example:

src/db/schema/002_seed_core_test_data.sql

This file should insert enough realistic data to test the main relationships.

Minimum seed data requirements
Users

Create at least:

1 admin

2 hosts

5 players

A single user may have more than one role if useful, but keep the data easy to understand.

Suggested naming approach:

admin user

host one

host two

player one through player five

Each user should have:

phone

display_name

optional email for some users

username for at least some users

Roles

If roles are already seeded, do not duplicate them.
Use the existing player, host, and admin roles.

User roles

Assign roles so that:

admin user has admin

each host has host

all players have player

hosts may also have player if that fits your model

Games

Create at least:

3 games total

at least 2 games for host one

at least 1 game for host two

Set:

realistic titles

private visibility

mixed statuses such as published and draft

Host players

Create enough data to prove:

a host can have multiple players

the same player can belong to multiple hosts

host rosters are separate

Example:

host one has players 1, 2, 3

host two has players 3, 4, 5

Game invites

Create enough data to prove:

invited players differ by game

some players are invited to multiple games

some invited players are on host rosters

at least one invite is accepted

at least one invite is invited

optionally one invite is declined

2. Add organized route/controller structure

Inside server/src, create organized folders if not already present:

src/
  controllers/
  routes/
  db/
  utils/

You do not need a service layer yet unless it helps clarity.

3. Create read-only API endpoints
A. Users endpoints
GET /api/users

Return a list of users with a minimal useful shape.

Include fields like:

id

display_name

username

phone

email

is_active

created_at

Optional:

aggregate roles into an array or comma-separated field if easy

Support simple query params if easy:

role=host

role=player

role=admin

If role filtering is added, it must work correctly.

GET /api/users/:id

Return one user by id.

Include:

base user fields

assigned roles

Do not include password/auth fields even if any exist.

B. Games endpoints
GET /api/games

Return all games.

Include fields:

id

title

host_user_id

host display name

status

visibility

stakes_label

starts_at

created_at

Support simple filters if easy:

host_user_id

status

visibility

GET /api/games/:id

Return one game by id.

Include:

game fields

basic host info

C. Host player list endpoints
GET /api/hosts/:hostUserId/players

Return the private player list for a specific host.

Include for each row:

host_players.id

player_user_id

player display_name

player username

status

added_at

This endpoint is read-only for now and does not need auth yet.

D. Game invite endpoints
GET /api/games/:gameId/invites

Return invited players for a game.

Include:

invite id

player_user_id

player display_name

player username

invite status

invited_at

responded_at

GET /api/users/:userId/invites

Return games a user is invited to.

Include:

invite id

game id

game title

host display name

invite status

starts_at

This endpoint is important because it maps directly to the player profile concept.

4. Query behavior

Use direct MySQL queries through the existing mysql2/promise pool.

Do not add ORM yet.

Keep SQL readable and explicit.

Prefer parameterized queries everywhere.

5. Response format

Use consistent JSON response structure where practical.

Suggested format:

List responses
{
  "ok": true,
  "data": [...]
}
Single record responses
{
  "ok": true,
  "data": { ... }
}
Not found
{
  "ok": false,
  "error": "Not found"
}

Use proper HTTP status codes.

6. Validation / error handling

Add minimal but clean error handling:

invalid id → 400 if appropriate

not found → 404

query/server error → 500

Create a small reusable helper if helpful, but do not over-engineer it.

7. Keep server structure clean

Update route mounting in server.js so the API remains organized.

Suggested route files:

src/routes/users.js

src/routes/games.js

src/routes/hosts.js

Suggested controller files:

src/controllers/usersController.js

src/controllers/gamesController.js

src/controllers/hostsController.js

Validation Criteria

Task is complete only if all of the following are true:

Seed data

test data inserts successfully

data demonstrates:

multiple roles

multiple hosts

overlapping player rosters

multiple game invites

private game visibility structure

Endpoints

The following all work:

GET /api/users

GET /api/users/:id

GET /api/games

GET /api/games/:id

GET /api/hosts/:hostUserId/players

GET /api/games/:gameId/invites

GET /api/users/:userId/invites

Code quality

SQL queries are parameterized

route/controller separation exists

response format is consistent

no write endpoints added

Constraints

do not add authentication yet

do not add POST/PUT/DELETE endpoints yet

do not add bankroll routes yet

do not add chart routes yet

do not add blog/training routes yet

do not add frontend wiring yet

Deliverable

Return:

updated folder tree

seed SQL file contents

controller file contents

route file contents

exact commands used to run seed data

sample JSON responses for all endpoints

Notes

This task is meant to prove the relational model works through real API reads before moving into auth and write operations.