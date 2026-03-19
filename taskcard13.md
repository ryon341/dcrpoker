Taskcard 013 — Level 2 Messaging Backend: Paid Outbound SMS (Twilio) + Usage Tracking + Monthly Quota Enforcement
Goal

Implement Level 2 paid messaging:

backend can send SMS via provider (Twilio)

hosts can send outbound SMS from the app

track usage per host (monthly)

enforce limits:

500 messages/month for Level 2

overage tracking (no charging yet, just tracking)

integrate with existing messaging UI (from Taskcard 012)

This upgrades from:
👉 manual messaging → real SMS sending

Scope
Build now

Twilio integration (or pluggable SMS provider abstraction)

backend SMS send service

message logging

monthly usage tracking

quota enforcement middleware/service

send SMS endpoint

frontend integration to trigger send

Do not build yet

inbound SMS (Taskcard 014)

RSVP parsing

waitlist

seat assignment

PayPal billing enforcement (we will prepare for it)

retry queues / background jobs (keep synchronous for now)

Product Rules
Level 2 behavior

host can send SMS via app

outbound only (no replies processed yet)

monthly limit:

500 messages

overage:

tracked but not charged yet

messages sent per recipient (1 message = 1 SMS send)

Level detection

For now, assume:

all users default to Level 1

manually set Level 2 in DB for testing

We will formalize billing later.

Backend Architecture

Add structure:

src/
  services/
    smsService.js
  controllers/
    smsController.js
  routes/
    sms.js
  middleware/
    usageLimit.js
Environment Variables

Add to .env:

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
Install Dependencies
npm install twilio
Database Changes

Create new SQL file:

src/db/schema/005_sms_usage_and_logs.sql
1. sms_messages (log every SMS)

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

to_phone varchar(30) not null

message_body text not null

provider varchar(50) default 'twilio'

provider_message_id varchar(255) null

status varchar(30) not null default 'queued'

error_message varchar(255) null

created_at datetime default current_timestamp

Indexes:

host_user_id

status

created_at

2. sms_usage (monthly tracking)

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

year int not null

month int not null

messages_sent int not null default 0

created_at datetime default current_timestamp

updated_at datetime on update current_timestamp

Unique index:

(host_user_id, year, month)

SMS Service
File: smsService.js

Responsibilities:

send SMS via Twilio

return provider message ID

handle errors cleanly

Function:

async function sendSms({ to, body }) {}

Behavior:

call Twilio API

return:

success

message id

error if failed

Usage Tracking Logic

Create helper:

async function checkAndIncrementUsage(hostUserId, messageCount)

Steps:

get current year/month

fetch or create row in sms_usage

check limit:

Level 2 limit = 500

if over limit:

allow but mark overage

OR optionally block (recommend allow + flag)

increment usage

Return:

{
  allowed: true,
  currentUsage: 320,
  limit: 500,
  overage: false
}
Middleware (Optional but Recommended)

Create:

usageLimit.js

Checks before sending:

host level (stubbed for now)

current usage

returns:

allowed

or error

Backend Endpoint
POST /api/sms/send

Authenticated route.

Input:

{
  "recipients": ["5551112222", "5553334444"],
  "message": "Game tonight at 7pm"
}
Behavior

validate input

normalize phone numbers

enforce:

non-empty recipients

message required

check usage:

total recipients = message count

loop through recipients:

send SMS via service

log each message in sms_messages

update usage counter

Response
{
  "ok": true,
  "data": {
    "sent_count": 5,
    "failed_count": 1,
    "usage": {
      "current": 320,
      "limit": 500,
      "overage": false
    }
  }
}
Frontend Integration

Update existing compose screen (Taskcard 012).

Add new option:

Send via DCR Poker (Level 2)

Only visible if:

host is Level 2 (stub for now)

Behavior

When clicked:

send request to /api/sms/send

show:

sending state

success count

failure count

usage remaining

UI Messaging

Show:

“Messages will be sent from DCR Poker”

“Usage: 320 / 500 this month”

Temporary Level Handling

For now, hardcode or store in DB:

Option A:

add plan_level column to users (optional)

Option B (simplest):

treat all users as Level 2 for testing

Better:

manually flag specific user IDs as Level 2 in code

Error Handling

Handle:

Twilio failure

log error

continue sending to other recipients

Invalid phone

skip and record failure

Usage exceeded

either:

allow + flag overage (recommended)

or block (less flexible)

Validation Criteria

Task is complete only if:

Backend

SMS service sends messages via Twilio

messages logged in sms_messages

usage tracked in sms_usage

/api/sms/send works

failures handled cleanly

Frontend

compose screen can trigger SMS send

success/failure feedback shown

usage displayed

Constraints

no inbound SMS yet

no RSVP parsing yet

no retry queue

no background jobs

no billing enforcement yet

keep synchronous and simple

Deliverable

Return:

updated backend folder tree

SQL schema file

smsService.js contents

smsController.js contents

route setup

usage tracking logic

frontend changes to compose screen

test steps:

send SMS

verify DB logs

verify usage increments

example responses

Notes

This is the first paid-value feature.

After this, Taskcard 014 will be:

👉 Inbound SMS + RSVP Engine (YES/NO/WAIT parsing, webhook, response handling)

This is where the app becomes significantly more powerful than competitors.