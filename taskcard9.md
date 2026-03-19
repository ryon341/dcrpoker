Taskcard 009 — Host Contacts UI + External Invite Generation UI + Accept Invite Frontend Flow
Goal

Build the frontend workflow for:

managing host prospect contacts

generating external invites

viewing invite details

opening an invite link and accepting it from the frontend

This task completes the first real prospect-to-player onboarding UI flow:

host contact → generate external invite → recipient opens invite → logs in/registers → accepts invite

Do not build CSV parsing, phone contacts integration, or actual SMS/email sending yet. Keep this focused on the core UI flow against the existing backend.

Scope
Build now

host contacts list screen

create/edit host contact UI

external invite generation UI

external invites list screen

invite detail / preview screen

public invite landing screen

accept invite flow from frontend

Do not build yet

CSV upload parsing

phone contacts picker

email sending

SMS sending

seat assignment

waitlist

bankroll

charts

blog

training

Existing Backend Endpoints to Use
Host contacts

POST /api/host-contacts

GET /api/host-contacts

GET /api/host-contacts/:id

PATCH /api/host-contacts/:id

External invites

POST /api/external-invites

GET /api/external-invites

GET /api/external-invites/:id

GET /api/invites/:inviteCode

POST /api/invites/:inviteCode/accept

Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

Frontend Architecture Requirements

Use the existing Expo Router TypeScript structure.

Recommended routes:

app/
  app/
    (protected)/
      contacts/
        index.tsx
        create.tsx
        [id].tsx
      invites/
        index.tsx
        create.tsx
        [id].tsx
    invite/
      [code].tsx

Adjust to your current route structure if needed, but preserve:

protected host management screens

public invite acceptance route

Recommended API files:

src/
  api/
    hostContacts.ts
    externalInvites.ts
Core Requirements
1. Host Contacts List Screen

Route example:

(protected)/contacts/index.tsx

Requirements:

fetch GET /api/host-contacts

display only current host’s contacts from backend

show at least:

display_name

phone

email

source

status

include controls/links to:

create contact

open contact detail/edit

generate invite from contact

Support simple filters if easy:

status

source

Handle:

loading

empty state

error state

2. Create Host Contact Screen

Route example:

(protected)/contacts/create.tsx

Fields:

display_name (required)

phone

email

source (default manual)

notes

Rules:

require at least one of phone or email

submit to POST /api/host-contacts

Behavior:

on success:

navigate back to contacts list

or open created contact detail

Display validation errors clearly.

3. Contact Detail / Edit Screen

Route example:

(protected)/contacts/[id].tsx

Requirements:

fetch GET /api/host-contacts/:id

display current contact data

allow updates via PATCH /api/host-contacts/:id

Editable fields:

display_name

phone

email

notes

status

Show:

registered_user_id if present

created_at / updated_at if useful

Include button:

Generate Invite

4. External Invites List Screen

Route example:

(protected)/invites/index.tsx

Requirements:

fetch GET /api/external-invites

display:

id

invite_code

status

channel

recipient_phone

recipient_email

game_id if present

created_at

include link/button to:

create invite

open invite detail

Optional simple filters if easy:

status

game_id

5. Generate External Invite Screen

Route example:

(protected)/invites/create.tsx

This screen should support two flows.

Flow A — From an existing host contact

Fields:

host_contact_id

optional game_id

channel

Flow B — Direct prospect entry

Fields:

display_name

phone

email

optional game_id

channel

Channel options:

manual

sms

email

For this task, channel only affects stored value; it does not send anything.

Behavior:

submit to POST /api/external-invites

on success show:

invite_code

invite_url

include copy button if easy:

Copy invite link

include open detail button

Note:
If backend already auto-creates a host_contact on direct invite, display returned data clearly.

6. External Invite Detail Screen

Route example:

(protected)/invites/[id].tsx

Requirements:

fetch GET /api/external-invites/:id

display:

invite code

invite url

status

recipient info

host contact id

game id

accepted_at

registered_user_id

If easy, include buttons:

Copy invite URL

Open invite preview in browser/web route

No sending is required in this task.

7. Public Invite Landing Screen

Route example:

invite/[code].tsx

This route must be accessible without requiring auth.

Requirements:

call GET /api/invites/:inviteCode

display minimal invite preview:

inviter basic info

optional game info

invite status / validity

if invite is invalid/expired/cancelled, show clean error state

If user is not logged in:

show actions to:

Login

Register

If user is logged in:

show action:

Accept Invite

Important:
If unauthenticated user tries to accept, route them to login/register and then back to this invite route if practical.

A simple redirect memory mechanism is sufficient:

store pending invite code in local state or AsyncStorage

after login/register, return user to invite accept page

8. Accept Invite Flow

From the public invite landing screen:

If logged in

call POST /api/invites/:inviteCode/accept

On success:

display success message

show what happened if returned:

linked to host

added to game invite if applicable

After success:

navigate user to a reasonable protected screen, for example:

home

my games

or a simple success page

If not logged in

prompt login/register first

then continue back to invite page

Important:
Handle duplicate-accept or invalid-accept errors gracefully.

9. Navigation additions

Add protected navigation links/buttons for:

Contacts

Invites

Add public handling for:

/invite/[code]

Keep navigation simple and functional.

API Client / Utility Requirements

If not already present, add small helpers for:

copy-to-clipboard behavior if easy

pending invite redirect memory

Possible utilities:

src/utils/pendingInvite.ts

src/utils/clipboard.ts

Use Expo-compatible clipboard package only if needed; otherwise, omit copy functionality.

UX Requirements

Function over polish, but must be understandable.

Minimum:

clear labels

button states during submit

visible validation errors

visible success messages

empty states for lists

readable invite URL display

Recommended wording:

Contacts = prospects not yet fully onboarded

Invites = generated onboarding links

Accept Invite = confirms host/player link

Validation Criteria

Task is complete only if all of the following are true:

Host contacts

authenticated user can view contacts list

authenticated user can create contact

authenticated user can edit contact

External invites

authenticated user can generate invite from existing contact

authenticated user can generate direct invite

authenticated user can view invites list

authenticated user can view invite detail

invite URL is displayed correctly

Public invite flow

public invite route loads preview by code

unauthenticated user can reach login/register from invite route

authenticated user can accept invite

after accept, success state is shown

errors for invalid/expired/already accepted invites are handled cleanly

Constraints

do not build CSV parsing yet

do not build phone contacts import yet

do not build email sending yet

do not build SMS sending yet

do not build public game discovery yet

do not build seat assignment yet

do not over-polish UI

Deliverable

Return:

updated frontend folder tree

API files for host contacts and invites

screen file contents for:

contacts list

create contact

contact detail/edit

invites list

generate invite

invite detail

public invite landing

any utilities added

exact flow used for redirecting back to invite after login/register

sample run/test steps