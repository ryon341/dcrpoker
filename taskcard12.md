Taskcard 012 — Level 1 Messaging UI: Manual Batch Messaging (Max 10), Templates, Copy / Export / Open Native SMS-Email Workflow
Goal

Build the Level 1 free host messaging system:

host can compose a message for a game or selected players

app can split recipients into batches of max 10

host can use:

copy numbers

copy emails

copy message

open native SMS

open native email

host can save and reuse message templates

This is manual messaging assistance only.
The app does not send SMS or email itself in this task.

This task gives Level 1 real value while preserving the paid upgrade path.

Scope
Build now

frontend messaging composer UI

recipient selection UI

batch splitting logic (max 10 for Level 1)

message template support

copy/export helpers

open native SMS workflow

open native email workflow

basic backend template storage if needed

Do not build yet

provider-based SMS sending

inbound SMS

RSVP parsing

waitlist

seat assignment

billing enforcement

PayPal

Level 2 / Level 3 automation

Product Rules to Enforce
Level 1 constraints

host sends messages manually using their own device/apps

max 10 recipients per batch

no backend sending

no automated tracking of replies

no seat assignment

no delivery logs

Supported channels

SMS/manual text help

email/manual email help

Templates

Hosts can save reusable templates such as:

game tonight

seat open

last call

tournament reminder

Templates are host-owned and private.

Product Behavior
Messaging sources

Host should be able to message from:

A. Game context

Use invited players for a specific game

B. Host roster context

Use selected players from host’s private player list

C. Optional ad hoc selection

Use selected contacts or players if already available in UI

For this task, game context + host list context are sufficient.

Recommended Build Approach

Because this is Level 1 manual messaging, most of the logic is frontend-first.

You may keep template storage:

frontend-only first, or

backend-persisted if clean

Recommendation

Persist templates in backend now so they are reusable across devices.

Backend Requirements

Add a small schema/table for templates.

Create SQL file, for example:

src/db/schema/004_message_templates.sql
Table: message_templates

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

name varchar(120) not null

channel varchar(20) not null default 'sms'

subject varchar(255) null

body text not null

is_active tinyint(1) not null default 1

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

Indexes:

index on host_user_id

index on channel

index on is_active

Notes:

subject is mainly for email templates

body required

host-owned only

Backend Endpoints for Templates

All require auth.

GET /api/my/message-templates

Return templates belonging only to authenticated host.

Optional filters if easy:

channel

is_active

POST /api/my/message-templates

Create template.

Input example:

{
  "name": "Friday Game Invite",
  "channel": "sms",
  "subject": null,
  "body": "DCR Poker: 1/2 NL tonight at 7pm. Let me know if you're in."
}

Rules:

authenticated user becomes host_user_id

name required

channel required (sms or email)

body required

PATCH /api/my/message-templates/:id

Update host-owned template.

Editable:

name

channel

subject

body

is_active

Ownership required.

GET /api/my/message-templates/:id

Return one host-owned template.

Optional:

DELETE or soft-disable

If easy, use PATCH is_active = 0 instead of true delete.

Frontend Requirements

Recommended new routes:

app/
  app/
    (protected)/
      messages/
        index.tsx
        compose.tsx
        templates/
          index.tsx
          create.tsx
          [id].tsx

Recommended API/helper files:

src/
  api/
    messageTemplates.ts
  utils/
    messaging.ts
    copy.ts
Core Frontend Features
1. Messaging Home / Entry Screen

Route example:

(protected)/messages/index.tsx

Purpose:
Give host quick entry points:

Message a game

Message my players

Templates

This can be simple.

2. Compose Message Screen

Route example:

(protected)/messages/compose.tsx

This is the main Level 1 messaging screen.

Inputs

channel: SMS or Email

context:

selected game

selected players

subject (email only)

message body

optional template picker

Data sources

For recipient source, allow either:

Game mode

choose a host-owned game

load invited players from that game

My players mode

load host’s private player list

multi-select players

You can support one mode first and add the other if easy, but both are preferred.

Recipient filtering

Only include recipients with usable destination:

SMS mode → players/contacts with phone

Email mode → players/contacts with email

3. Batch Splitting Logic

This is the heart of Level 1.

Implement utility logic to:

take selected recipients

split into groups of max 10

Example:

23 recipients → 3 batches

batch 1 = 10

batch 2 = 10

batch 3 = 3

Display each batch clearly:

Batch 1

Batch 2

Batch 3

For each batch show:

recipient count

recipients list if helpful

actions

4. Per-Batch Actions

For each batch provide:

SMS mode

Copy Numbers

Copy Message

Open SMS App

Email mode

Copy Emails

Copy Subject

Copy Message

Open Email App

Important:
The native-open behavior may vary by platform. That is fine.
A best-effort implementation is acceptable.

5. Open Native SMS

For SMS, use URL/deep link pattern appropriate for Expo/React Native.

Behavior:

open device SMS app

ideally prefill body

recipients may be joined as allowed by platform behavior

If some platforms do not support multi-recipient + body reliably:

still provide copy actions

treat native-open as best effort

Document any platform limitations.

6. Open Native Email

For email, use mailto: best effort.

Behavior:

fill recipients for the batch

include subject

include body if possible

Again, if platform limitations exist:

copy actions remain the fallback

7. Template Picker / Template Save

Inside compose flow:

load available templates

selecting a template fills:

channel

subject

body

Allow:

save current message as new template

edit templates via Templates screens

8. Templates List Screen

Route example:

(protected)/messages/templates/index.tsx

Requirements:

fetch host-owned templates

display:

name

channel

active/inactive

open template detail/edit

create new template

9. Create/Edit Template Screens

Routes:

(protected)/messages/templates/create.tsx

(protected)/messages/templates/[id].tsx

Fields:

name

channel

subject (email only)

body

active toggle

Recipient Selection Requirements
Preferred game-based flow

From a game detail screen, add button:

Message Players

This should route into compose screen with:

gameId

preloaded invited players

Preferred host-list flow

From My Players screen, add:

multi-select

Message Selected

If multi-select is too much for this task, allow:

simple selection list inside compose screen

UX Requirements

This feature should feel practical, not polished.

Must have

clear “Level 1 manual messaging” wording

note that messages are sent via user’s own apps

clear batch labels

visible max 10 rule

disabled actions if no valid recipients

copy success feedback

empty states

Recommended copy

“Level 1 sends through your device — no messages are sent by DCR Poker.”

“Recipients are split into batches of 10.”

“Upgrade for automated SMS sending.”

This subtly supports future conversion.

Utility Requirements

Create helper utilities for:

splitRecipientsIntoBatches(recipients, size=10)

Returns array of batches.

extractPhones(...)

Collect phone recipients.

extractEmails(...)

Collect email recipients.

buildSmsLink(...)

Best-effort SMS link.

buildMailtoLink(...)

Best-effort email link.

copyToClipboard(...)

Use Expo-compatible clipboard approach if needed.

Validation Criteria

Task is complete only if all of the following are true:

Backend

message_templates table exists

host can create/read/update own templates

ownership enforced

Frontend

host can open messaging compose screen

host can select recipients from game or host list

recipients are split into batches of max 10

copy actions work

native SMS/email open actions work on a best-effort basis

host can create and reuse templates

templates list and edit screens work

Product behavior

no actual messages are sent by backend

Level 1 remains manual

upgrade path messaging text is visible somewhere in UI

Constraints

do not integrate Twilio yet

do not create SMS logs yet

do not process replies yet

do not implement billing yet

do not implement Level 2 or Level 3 behavior yet

keep this strictly Level 1

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

SQL file contents

template route/controller contents

compose screen contents

template screen contents

utility/helper contents

any changes to game detail or my players screens to enter messaging flow

exact test steps for:

create template

compose from game

compose from host list

copy batch data

open native SMS/email

note platform limitations, if any

Notes

This task creates the first practical host communication tool and establishes the UX for later paid messaging upgrades.