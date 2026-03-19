Taskcard 014 — Inbound SMS + RSVP Engine (YES / NO / WAIT parsing, webhook, response handling)
Goal

Implement Level 3 inbound SMS processing so the system can:

receive SMS replies from players through Twilio

identify the responding player by phone number

identify the relevant game invite

parse simple RSVP responses

update invite status

support waitlist behavior foundation

send automatic confirmation / status replies back by SMS

This is the first step that turns DCR Poker into a real game operations platform instead of just a notification tool.

Scope
Build now

Twilio inbound webhook endpoint

player lookup by phone

active invite lookup

RSVP parser for:

YES

NO

WAIT

YES 1

YES 2

YES ANY

update invite / RSVP fields

waitlist placement logic foundation

automatic outbound response SMS

host-facing read endpoint(s) for RSVP state if needed

Do not build yet

host seat assignment UI

advanced seat map

PayPal enforcement

referral credits

full waitlist promotion automation

multi-table logic

natural language parsing beyond simple commands

Product Rules
Level 3 behavior

player replies by SMS

system processes reply automatically

supported commands:

YES

NO

WAIT

YES 1

YES 2

YES ANY

Interpretation

YES = wants to play, no specific seat preference

NO = declines invite

WAIT = wants waitlist

YES 1 = wants seat preference 1

YES 2 = wants seat preference 2

YES ANY = any available seat

Seat assignment for this task

Do not assign actual seats yet.

Instead:

store seat preference

store RSVP status

determine whether confirmed or waitlisted based on capacity

Capacity behavior

If game has open seats:

YES, YES 1, YES 2, YES ANY → confirmed

If game is full:

YES... responses → waitlisted

WAIT → waitlisted regardless

Simplicity rule

Only process very simple commands for now.
Anything else gets a help-style reply.

Database Changes

Create a new SQL file, for example:

src/db/schema/006_rsvp_and_waitlist_fields.sql
1. Extend games

Add fields:

max_players int not null default 9

seat_assignment_enabled tinyint(1) not null default 0

Notes:

max_players will be used to determine when a game is full

seat_assignment_enabled is groundwork for later

2. Extend game_invites

Add fields:

rsvp_status varchar(30) not null default 'invited'

seat_preference varchar(20) null

assigned_seat_number int null

waitlist_position int null

Recommended meanings:

rsvp_status

invited

confirmed

declined

waitlisted

seat_preference

1

2

any

null

Indexes:

index on rsvp_status

index on waitlist_position

Keep existing:

responded_at

3. Optional: add sms_direction info later

Do not overcomplicate schema now.
Reuse sms_messages table from Taskcard 013 for outbound logs only unless you want to add inbound logging now.

Optional inbound log table

If clean and helpful, add:

sms_inbound_logs

id

from_phone

to_phone

message_body

parsed_command

parsed_value

user_id nullable

game_id nullable

game_invite_id nullable

status

error_message nullable

created_at

This is optional but recommended for debugging.

Backend Architecture

Add structure such as:

src/
  controllers/
    smsWebhookController.js
  routes/
    smsWebhook.js
  services/
    rsvpService.js
    smsParser.js
Environment / Twilio Notes

You already have Twilio credentials from Task 013.

For inbound webhook:

configure your Twilio number webhook URL to point to:

POST /api/twilio/webhook/sms

You may need:

public URL / tunnel during local testing

Keep this documented in deliverable.

Backend Requirements
1. Twilio Webhook Endpoint
POST /api/twilio/webhook/sms

Public endpoint. No JWT auth.

Twilio will send form-encoded data, not JSON.

Handle at minimum:

From

To

Body

MessageSid

Requirements:

parse Twilio request body correctly

normalize incoming phone number

normalize message text to uppercase trimmed command

process reply

return TwiML or plain success response as needed

Recommendation

Return TwiML if you want Twilio to send direct reply from the response, but since you already have outbound SMS service, it is fine to:

process webhook

send SMS via Twilio API separately

return 200 quickly

Simplest acceptable approach:

process synchronously

return basic XML/200

2. SMS Parser Service

Create a parser utility:

smsParser.js

Input:

raw message body

Output example:

{
  command: 'YES',
  seatPreference: '1'
}

Supported cases:

YES

YES 1

YES 2

YES ANY

NO

WAIT

Rules:

ignore case

trim whitespace

collapse multiple spaces

Unrecognized input should return:

{
  command: 'UNKNOWN'
}
3. Player Lookup by Phone

When webhook arrives:

normalize From

find active user in users.phone

If not found:

send SMS back:

“We couldn’t match this number to a DCR Poker account.”

log failure

stop processing

4. Find Relevant Invite

This is important and must be deterministic enough for MVP.

Recommended lookup rule

Find the most recent active invite for this player where:

rsvp_status = invited
OR

rsvp_status = waitlisted
OR

status = invited

related game:

status = published

is_active = 1

starts_at in a reasonable upcoming window if possible

Order by:

soonest upcoming game first

or newest invite if simpler

MVP rule

Use the most relevant upcoming invite for that player.

If no qualifying invite found:

send SMS:

“No active invitation was found for this number.”

stop processing

5. RSVP Processing Logic

Create rsvpService.js with logic like:

A. If command = NO

set rsvp_status = declined

set responded_at = NOW()

clear waitlist_position if needed

send confirmation SMS:

“You’ve been marked as not attending.”

B. If command = WAIT

set rsvp_status = waitlisted

set responded_at = NOW()

assign next waitlist position

send reply:

“You’ve been added to the waitlist. Position: X.”

C. If command = YES / YES 1 / YES 2 / YES ANY

store seat_preference

count current confirmed invites for that game

compare against games.max_players

If confirmed count < max_players:

set rsvp_status = confirmed

set responded_at = NOW()

send reply:

“You’re in for the game.”

include seat preference acknowledgment if useful

If game is full:

set rsvp_status = waitlisted

assign next waitlist position

send reply:

“The game is currently full. You’ve been added to the waitlist. Position: X.”

D. If command = UNKNOWN

send help reply:

“Reply YES, NO, WAIT, YES 1, YES 2, or YES ANY.”

6. Waitlist Position Assignment

When assigning waitlist:

find current max waitlist position for the game

next position = max + 1

if none, start at 1

Do not implement auto-promotion yet.

7. Duplicate / repeat response handling

Need sane rules.

Recommended MVP behavior

latest response wins

Examples:

player replies YES, then later NO → status becomes declined

player replies NO, then later YES and seats remain available → confirmed

player replies WAIT, then later YES and game is still full → remain waitlisted, possibly update seat preference

This is acceptable for MVP and easier than freezing responses.

8. Outbound Confirmation SMS

Reuse Twilio send service from Task 013.

Every processed inbound response should trigger one outbound reply unless message is truly invalid/unmatched.

Keep messages short.

Examples:

Confirmed:
“DCR Poker: You’re confirmed for the game.”

Declined:
“DCR Poker: You’ve been marked as not attending.”

Waitlist:
“DCR Poker: You’re on the waitlist at position #3.”

Unknown:
“DCR Poker: Reply YES, NO, WAIT, YES 1, YES 2, or YES ANY.”

9. Optional Host-Facing Read Endpoint

If useful for frontend prep, add:

GET /api/my/games/:id/rsvps

Authenticated route.

Return:

player name

phone

invite status

rsvp_status

seat_preference

waitlist_position

responded_at

This will make Task 015 easier.

If this duplicates existing invites endpoint, you may instead enhance:

GET /api/my/games/:id/invites

to include new RSVP fields.

Frontend Requirements

Keep frontend changes minimal in this task unless needed for testing.

Recommended small changes

update game detail invite list to display:

rsvp_status

seat_preference

waitlist_position

if RSVP endpoint added, wire it into game detail screen

Do not build full seat management UI yet.

Validation Criteria

Task is complete only if all of the following are true:

Backend

Twilio webhook endpoint receives inbound SMS

parser correctly handles:

YES

NO

WAIT

YES 1

YES 2

YES ANY

player is looked up by phone

relevant invite is found

game_invites updated correctly

responded_at updates

seat_preference updates

waitlist_position assigned when applicable

outbound confirmation SMS sent

Functional behavior

player replying YES gets confirmed if seats available

player replying YES when full gets waitlisted

player replying WAIT gets waitlisted

player replying NO gets declined

invalid reply gets help message

Frontend

game detail/invite view can show RSVP-related fields if wired

Constraints

do not build seat assignment UI yet

do not build auto-promotion from waitlist yet

do not build billing enforcement yet

do not add NLP/free-form parsing

keep reply parsing strict and simple

Deliverable

Return:

updated backend folder tree

SQL migration contents

webhook route/controller contents

parser service contents

RSVP service contents

any frontend screen updates

Twilio webhook setup notes

exact test steps for:

YES

NO

WAIT

YES 1

YES 2

YES ANY

unknown command

sample DB row changes

sample outbound confirmation messages

Notes

This task is the real turning point for the product. After this, the app can actively run RSVP flow by text