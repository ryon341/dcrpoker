Taskcard 008 — Frontend Auth Wiring + Host Game Creation + My Games List + Invite Players
Goal

Wire the Expo frontend to the backend for the first real host workflow:

user can register/login by phone

authenticated session is stored on frontend

host can create a game

host can view their own games

host can open a game and invite players

This task is the first end-to-end UI workflow.

Do not build polish, deep navigation complexity, or messaging flows yet. Keep it functional and clean.

Scope
Build now

frontend API client setup

auth state management

login/register screens

protected app flow

create game screen

my games list screen

game detail screen

invite existing player screen

invite-from-host-list screen

Do not build yet

OTP

CSV import UI

phone contacts import

bankroll

charts

blog

training

SMS/email sending

public games

seat assignment

waitlist

Existing Backend Endpoints to Use
Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

Host contacts / invites

Already built but not main focus of this task.

My games

POST /api/games

GET /api/my/games

GET /api/my/games/:id

PATCH /api/my/games/:id

POST /api/my/games/:id/invites

POST /api/my/games/:id/invites/from-host-list

GET /api/my/games/:id/invites

Frontend Architecture Requirements

Use the existing Expo TypeScript app.

Recommended structure:

app/
  app/
    (auth)/
      login.tsx
      register.tsx
    (protected)/
      index.tsx
      games/
        index.tsx
        create.tsx
        [id].tsx
        [id]/invite.tsx
  src/
    api/
      client.ts
      auth.ts
      games.ts
      hostPlayers.ts
    components/
    context/
      AuthContext.tsx
    hooks/
    utils/

Adjust to your current Expo Router structure if needed, but keep auth and protected areas separated.

Core Requirements
1. API client

Create a reusable API client.

File

src/api/client.ts

Requirements:

base URL from Expo env/config

JSON request helper

automatically attach JWT if present

handle 401 cleanly

Use a single place for:

GET

POST

PATCH

Keep it simple.

2. Environment / config

Set frontend API base URL for local development.

For example:

web may hit http://localhost:4000

mobile emulator/device may need LAN IP

Use one config location and document where to change it.

Example:

export const API_BASE_URL = 'http://localhost:4000';

If you already have Expo env support, use that.

3. Auth state

Create AuthContext or equivalent.

Must support:

login(phone)

register({ phone, display_name, email? })

logout()

loadCurrentUser()

State should include:

token

user

loading state

Persist token locally using:

@react-native-async-storage/async-storage

If not installed yet, install it.

Requirements:

on app load, restore token

call /api/auth/me

if valid, keep user logged in

if invalid, clear token

4. Auth screens
Register screen

Fields:

display name

phone

email (optional)

Behavior:

submit to POST /api/auth/register

save token

load user

redirect into protected app

Login screen

Fields:

phone

Behavior:

submit to POST /api/auth/login

save token

load user

redirect into protected app

Keep the UI minimal and functional.

5. Protected app shell

Create a simple protected landing screen.

Show:

app name

logged in user display name / phone

buttons or links to:

My Games

Create Game

Logout

This can be the protected home screen.

6. My Games list screen

Route example:

(protected)/games/index.tsx

Requirements:

fetch GET /api/my/games

display list of games owned by current user

show at least:

title

stakes_label

status

starts_at

tap a game to open detail screen

include button/link to create game

Handle:

loading

empty state

error state

7. Create Game screen

Route example:

(protected)/games/create.tsx

Fields:

title (required)

description

location_name

city

state

game_type

stakes_label

starts_at

ends_at

status (draft/published)

Behavior:

submit to POST /api/games

on success:

navigate to created game detail screen

or back to My Games list

Keep date/time inputs simple:

plain text inputs are acceptable for now if native date pickers are too much for this task

8. Game detail screen

Route example:

(protected)/games/[id].tsx

Requirements:

fetch:

GET /api/my/games/:id

GET /api/my/games/:id/invites

show:

game details

current invites list

include button/link to:

Invite Players

Show invite list with:

player name

username

phone

invite status

9. Invite Players screen

Route example:

(protected)/games/[id]/invite.tsx

This screen should support two invite methods.

A. Invite by existing registered player ID

Minimal version acceptable:

input player_user_id

submit to POST /api/my/games/:id/invites

This is ugly but acceptable as a temporary scaffold.

B. Invite from host list

Fetch host roster if endpoint exists:

GET /api/hosts/:hostUserId/players
or add/use a self route if already available

Preferred behavior:

show host’s active player list

allow selecting multiple players

submit selected IDs to:

POST /api/my/games/:id/invites/from-host-list

If no self-roster endpoint exists, temporarily use numeric IDs input with clear note, but better to add a self-owned roster endpoint if trivial.

10. UX requirements

Keep the UI dark/simple if easy, but function matters more than styling.

Minimum usability requirements:

forms have labels

submit buttons disabled during submit

errors displayed clearly

success feedback shown

navigation between screens works

Packages to Install

If not already present, install:

@react-native-async-storage/async-storage

Optional if helpful:

a lightweight form helper already in project

no need to overbuild with React Hook Form yet unless already wired

Routing / Access Rules
Unauthenticated users

Can access:

login

register

Authenticated users

Can access:

protected routes only

If no token/user:

redirect to login

If token exists:

do not show auth screens by default

Validation Criteria

Task is complete only if all of the following are true:

Auth

user can register from frontend

user can login from frontend

token persists across refresh/app reload

/api/auth/me restores session

logout clears session

Games

authenticated user can create game from frontend

authenticated user can see My Games list

authenticated user can open game detail

authenticated user can see current invites

Invites

authenticated user can invite a registered player to a game from frontend

authenticated user can bulk invite from host list if roster endpoint is available

success/error states display correctly

Constraints

do not add OTP yet

do not redesign auth flow

do not build polished UI system

do not build CSV import yet

do not build contact import yet

do not build messaging yet

keep this focused on frontend wiring to existing backend

Deliverable

Return:

updated frontend folder tree

package installs

contents of:

API client

AuthContext

login/register screens

my games list screen

create game screen

game detail screen

invite players screen

note any backend endpoint adjustments needed

exact steps to run frontend against local backend

screenshots or sample screen output if available

Notes

This task is about proving the first real full-stack loop works:

register/login → create game → list games → invite player

After this, Taskcard 009 should be:
Host contacts UI + external invite generation UI + accept invite frontend flow.