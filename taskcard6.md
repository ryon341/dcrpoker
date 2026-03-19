Taskcard 006 — Host Contacts + External Invites + Accept Invite Flow
Goal

Build the first write-side core workflow for DCR Poker:

host imports or creates prospect contacts

host can view prospect contacts

host can generate external invites for prospects

invited person can accept invite and become linked to the host

if invite is tied to a game, they are also added to that game’s invite list

This task establishes the real onboarding pipeline:

prospect contact → external invite → registration/login → accept invite → active host/player link

Do not build CSV upload UI, phone contacts UI, or SMS/email sending yet. This task is backend-first.

Scope
Build now

schema additions for host_contacts and external_invites

seed/test data updates if needed

backend write/read endpoints for host contacts

backend write/read endpoints for external invites

invite acceptance flow

Do not build yet

CSV parser

phone contacts integration

frontend screens

actual email sending

actual SMS sending

PayPal

seat assignment

waitlist

public games

Product Rules to Enforce
Host contacts

A host may store imported/manual prospect contacts

These are not active players yet

Contacts may come from csv, phone contacts, or manual entry

Host can select specific contacts; not all contacts must be imported

Host contacts are private to that host

External invites

An external invite may be tied to:

host only

host + specific game

Invite is sent outside the system later

Invite must have a secure code/token

Invite tracks status

Accept flow

When a recipient accepts:

they must be an authenticated platform user

system links them to the host in host_players

if the invite was tied to a game, system inserts into game_invites

host_contact and external_invite should be updated accordingly

Database Changes

Create a new SQL file, for example:

src/db/schema/003_host_contacts_and_external_invites.sql
1. host_contacts

Purpose: imported or manually entered prospect contacts owned by a host

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

display_name varchar(120) not null

phone varchar(30) null

email varchar(255) null

source varchar(30) not null default 'manual'

status varchar(30) not null default 'imported'

notes varchar(255) null

registered_user_id bigint unsigned null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

foreign key registered_user_id → users(id) nullable

Recommended status values:

imported

invited

registered

declined

unsubscribed

Recommended source values:

manual

csv

phone_contacts

Indexes:

index on host_user_id

index on status

index on phone

index on email

index on registered_user_id

Important:

Do not require phone or email both; at least one should be required at API level

Do not force global uniqueness here; a contact can appear under different hosts

2. external_invites

Purpose: invitation records for people not yet fully onboarded, or for pending link flow

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

host_contact_id bigint unsigned null

game_id bigint unsigned null

invite_code varchar(100) not null

invite_url varchar(500) not null

channel varchar(20) not null default 'manual'

status varchar(30) not null default 'generated'

recipient_phone varchar(30) null

recipient_email varchar(255) null

registered_user_id bigint unsigned null

accepted_at datetime null

expires_at datetime null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

foreign key host_contact_id → host_contacts(id) nullable

foreign key game_id → games(id) nullable

foreign key registered_user_id → users(id) nullable

unique index on invite_code

Recommended status values:

generated

sent

accepted

expired

cancelled

Indexes:

index on host_user_id

index on host_contact_id

index on game_id

index on status

index on recipient_phone

index on recipient_email

unique on invite_code

Backend Structure

Add organized files such as:

src/
  controllers/
    hostContactsController.js
    externalInvitesController.js
  routes/
    hostContacts.js
    externalInvites.js
  utils/
    inviteCode.js

If there is already a helpers/utils folder, reuse it.

Endpoint Requirements
Auth requirement

All host contact and invite management endpoints must require authMiddleware.

For now, use req.user.userId from JWT.

Do not build role/host authorization beyond basic ownership checks yet, but ensure a user can only manage their own contacts/invites.

A. Host Contacts
POST /api/host-contacts

Create a host contact.

Input:

{
  "display_name": "John Smith",
  "phone": "5551234567",
  "email": "john@example.com",
  "source": "manual",
  "notes": "regular at Friday game"
}

Rules:

authenticated user becomes host_user_id

require display_name

require at least one of phone or email

normalize phone/email if practical

default source to manual

default status to imported

Response:

{
  "ok": true,
  "data": { ...created contact... }
}
GET /api/host-contacts

Return contacts belonging only to authenticated host.

Support simple optional filters if easy:

status

source

GET /api/host-contacts/:id

Return one contact only if owned by authenticated host.

404 if not found or not owned.

PATCH /api/host-contacts/:id

Allow limited updates:

display_name

phone

email

notes

status

Do not allow changing host_user_id.

B. External Invites
POST /api/external-invites

Generate an invite for an existing host contact or direct recipient data.

Input options:

Option 1: by existing host contact
{
  "host_contact_id": 12,
  "game_id": 3,
  "channel": "sms"
}
Option 2: direct recipient
{
  "display_name": "New Prospect",
  "phone": "5552223333",
  "email": null,
  "game_id": 3,
  "channel": "manual"
}

Behavior:

authenticated user becomes host_user_id

if host_contact_id supplied, verify ownership

if direct recipient and no host_contact_id, optionally create a host_contact automatically, then create invite

generate invite_code

generate invite_url

Use a placeholder base URL for now, from env if practical:

APP_BASE_URL=http://localhost:8081

Generated URL example:
http://localhost:8081/invite/<invite_code>

Status defaults to generated

If linked to a host_contact, update that contact status to invited

Response should include:

invite record

invite_url

invite_code

GET /api/external-invites

Return invites belonging only to authenticated host.

Support simple filters if easy:

status

game_id

GET /api/external-invites/:id

Return one invite only if owned by authenticated host.

GET /api/invites/:inviteCode

Public endpoint. No auth required.

Purpose:
Return minimal invite preview so frontend can show acceptance page later.

Response should include:

invite id

status

host basic info

optional game basic info

recipient info if stored

whether invite is still valid

Do not expose unnecessary private fields.

If invite is cancelled/expired/not found, return appropriate status.

C. Accept Invite Flow
POST /api/invites/:inviteCode/accept

Protected route. Auth required.

Purpose:
Authenticated user accepts invite.

Behavior:

Find invite by invite_code

Validate:

exists

not expired

not cancelled

not already accepted by another user in a conflicting way

Link invite to current authenticated user:

set registered_user_id

set status = accepted

set accepted_at = NOW()

If invite has host_contact_id, update that contact:

registered_user_id = current user

status = registered

Create or ensure host_players record exists:

host_user_id = invite.host_user_id

player_user_id = current user

status = active

If invite has game_id, create or ensure game_invites record exists:

game_id = invite.game_id

host_user_id = invite.host_user_id

player_user_id = current user

status = invited

Return success payload describing what links were created

Important:
Use idempotent logic where reasonable:

do not create duplicate host_players

do not create duplicate game_invites

Utility Requirement

Create a small helper for invite code generation.

Example:

use uuid

strip dashes or keep simple readable token

must be unique enough for practical use

No need for fancy crypto beyond reasonable uniqueness for now.

Error Handling

Return consistent JSON.

Examples:

Validation failure
{
  "ok": false,
  "error": "display_name is required"
}
Ownership violation / not found
{
  "ok": false,
  "error": "Not found"
}
Invite invalid
{
  "ok": false,
  "error": "Invite is expired"
}

Use proper status codes:

400

401

403 where appropriate

404

409 if needed

500

Validation Criteria

Task is complete only if all of the following are true:

Schema

host_contacts table created successfully

external_invites table created successfully

Host contacts API

authenticated host can create contact

authenticated host can list only their own contacts

authenticated host can update only their own contacts

External invites API

authenticated host can create invite

invite code/url generated

authenticated host can list only their own invites

public invite preview endpoint works

Accept flow

authenticated user can accept a valid invite

accepting invite creates/ensures host_players record

accepting invite tied to game creates/ensures game_invites record

host contact status updates appropriately

duplicates are prevented

Constraints

do not build CSV upload parsing yet

do not build phone contacts import yet

do not build actual email sending yet

do not build actual SMS sending yet

do not build frontend screens yet

do not build PayPal yet

do not build seat assignment yet

Deliverable

Return:

updated folder tree

SQL file contents

controller contents

route contents

helper contents

any env changes

exact test requests for:

create host contact

list host contacts

create external invite

get invite preview

accept invite

sample JSON responses