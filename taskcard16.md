Taskcard 016 — PayPal Billing Foundation + Host Tier Storage + Feature Gating for Levels 1 / 2 / 3
Goal

Build the billing foundation for DCR Poker so the app can:

store host subscription tier

integrate PayPal subscription checkout

receive PayPal webhook updates

update host plan status in the database

enforce feature access for:

Level 1 (free)

Level 2 ($10 / month, 500 SMS)

Level 3 ($20 / month, 1000 SMS + inbound RSVP + waitlist + seat features)

This task is about billing foundation and gating, not full accounting automation.

Scope
Build now

billing schema

host plan/tier storage

PayPal config/env wiring

create subscription checkout endpoints

webhook endpoint for PayPal subscription events

middleware/helpers for feature gating

frontend billing/account screen

frontend plan selection / upgrade flow

enforce Level 1 / 2 / 3 feature visibility and backend access

Do not build yet

referral credits

automatic overage charging

invoices/receipts UI

downgrade proration logic

tax logic

full billing analytics dashboard

Locked Plan Rules
Players

always free

Hosts
Level 1 — Free

manual messaging assistance only

max 10 recipients per batch

no DCR outbound SMS

no inbound SMS processing

no seat assignment / waitlist tools

Level 2 — $10 / month

max 500 SMS per month

outbound SMS only

no inbound SMS processing

no seat assignment / waitlist tools

Level 3 — $20 / month

max 1000 SMS per month

outbound SMS

inbound SMS processing

RSVP tracking

waitlist

seat preference handling

seat assignment tools

Overage

2 cents per message overage

For this task: track overage only

Do not auto-charge overage yet

PayPal Account / Config

Use PayPal account/login:

ryon@usanotary.net

Do not hardcode this email in logic unless useful for documentation.
Use PayPal API credentials via env vars.

Backend Architecture

Add structure such as:

src/
  controllers/
    billingController.js
    paypalWebhookController.js
  routes/
    billing.js
    paypalWebhook.js
  services/
    billingService.js
    paypalService.js
  middleware/
    featureGate.js
Environment Variables

Add to .env and .env.example:

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
PAYPAL_WEBHOOK_ID=

PAYPAL_PLAN_LEVEL2_ID=
PAYPAL_PLAN_LEVEL3_ID=

APP_BASE_URL=http://localhost:8081
WEB_BASE_URL=http://localhost:8081

Notes:

PAYPAL_ENV should support sandbox and live

plan IDs will come from PayPal subscription plans you create

use APP_BASE_URL / WEB_BASE_URL for return/cancel URLs

Install Dependencies

If needed, install:

npm install @paypal/paypal-server-sdk

If you prefer direct PayPal REST calls with fetch/axios instead of SDK, that is acceptable.
Keep implementation clean and documented.

Database Changes

Create a new SQL file, for example:

src/db/schema/007_billing_and_host_plans.sql
1. host_subscriptions

Purpose: current and historical subscription records for hosts

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

provider varchar(30) not null default 'paypal'

provider_subscription_id varchar(255) null

provider_plan_id varchar(255) null

plan_level varchar(20) not null default 'level1'

status varchar(30) not null default 'inactive'

started_at datetime null

renews_at datetime null

cancelled_at datetime null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

Indexes:

index on host_user_id

index on provider_subscription_id

index on plan_level

index on status

Recommended status values:

inactive

pending

active

cancelled

suspended

expired

Notes:

You may keep one current active row per host and preserve old rows if plan changes later

For this task, simple “latest active/current row wins” is acceptable

2. Optional: billing_events

Purpose: webhook/event audit trail

Highly recommended.

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned null

provider varchar(30) not null default 'paypal'

event_type varchar(100) not null

provider_event_id varchar(255) null

payload_json longtext null

processed_status varchar(30) not null default 'received'

error_message varchar(255) null

created_at datetime not null default current_timestamp

Indexes:

index on host_user_id

index on event_type

index on provider_event_id

3. Optional shortcut on users

If you want easier reads, optionally add:

host_plan_level varchar(20) default 'level1'

Recommendation

Do not duplicate yet unless it materially simplifies gating.
Prefer deriving current plan from host_subscriptions.

Billing / Plan Logic

Create a helper/service that determines a host’s effective plan.

Function example
async function getHostPlan(hostUserId)

Return shape:

{
  planLevel: 'level1' | 'level2' | 'level3',
  status: 'active' | 'inactive' | 'pending' | ...,
  smsMonthlyLimit: 0 | 500 | 1000,
  canSendSms: boolean,
  canReceiveSms: boolean,
  canUseSeatTools: boolean,
  batchLimit: 10
}
Rules
Level 1

batchLimit = 10

canSendSms = false

canReceiveSms = false

canUseSeatTools = false

smsMonthlyLimit = 0

Level 2

batchLimit = null / unlimited for backend sending

canSendSms = true

canReceiveSms = false

canUseSeatTools = false

smsMonthlyLimit = 500

Level 3

canSendSms = true

canReceiveSms = true

canUseSeatTools = true

smsMonthlyLimit = 1000

PayPal Service Requirements

Create paypalService.js.

Responsibilities:

authenticate to PayPal API

create subscription signup link or subscription object

verify webhook signature if practical

normalize webhook event data

Backend Endpoint Requirements
A. Get Current Billing Status
GET /api/my/billing

Authenticated route.

Return:

effective plan

current subscription info if any

SMS usage this month

monthly limit

tracked overage count if any

Example response:

{
  "ok": true,
  "data": {
    "planLevel": "level2",
    "subscriptionStatus": "active",
    "smsUsage": 120,
    "smsLimit": 500,
    "smsOverage": 0,
    "features": {
      "canSendSms": true,
      "canReceiveSms": false,
      "canUseSeatTools": false,
      "batchLimit": 10
    }
  }
}
B. Create PayPal Subscription for Selected Plan
POST /api/my/billing/subscribe

Authenticated route.

Input:

{
  "planLevel": "level2"
}

or

{
  "planLevel": "level3"
}

Behavior:

validate planLevel

map to correct PayPal plan ID from env

create PayPal subscription checkout

tie current user in custom metadata if supported

return approval URL

Response:

{
  "ok": true,
  "data": {
    "planLevel": "level2",
    "approvalUrl": "https://www.paypal.com/checkoutnow?..."
  }
}

Important:

do not support subscribing to level1

level1 is default/free

C. Cancel Subscription (Foundation Only)

If clean and small, add:

POST /api/my/billing/cancel

Authenticated route.

Behavior:

locate active PayPal subscription for host

call provider cancel if supported

mark local row cancelled/pending-cancel

This is optional in this task but recommended.

D. PayPal Webhook Endpoint
POST /api/paypal/webhook

Public endpoint.

Requirements:

receive PayPal webhook events

verify if practical using webhook ID and provider rules

log event into billing_events

process at least these subscription lifecycle events if they exist in PayPal payloads:

subscription activated

subscription approved

subscription updated

subscription cancelled

payment completed / sale completed if relevant

subscription suspended / expired

Behavior:

determine host user from provider subscription data / custom metadata / stored lookup

create or update host_subscriptions

set plan_level

set status

set relevant timestamps

Important:

idempotent processing where practical

do not crash on unknown events; log and return 200

Feature Gating Requirements

Create middleware/helper(s) such as:

requirePlanFeature(featureName)

Example features:

sms_send

sms_receive

seat_tools

Behavior:

resolve host plan

block access if plan does not include feature

Example error:

{
  "ok": false,
  "error": "This feature requires Level 2 or higher."
}
Apply gating to existing endpoints
Level 2+ required

POST /api/sms/send

Level 3 required

POST /api/twilio/webhook/sms processing should only enable RSVP updates for invites owned by Level 3 hosts

seat management endpoints from Task 015 should require Level 3

or if Task 015 not yet applied, prepare middleware for those routes

Level 1 behavior

UI only for manual batch messaging

no backend send access

SMS Usage / Overage Integration

Extend current billing response and/or helper logic to compute:

monthly SMS usage

monthly included limit

overage count:

max(messages_sent - limit, 0)

For this task:

do not auto-bill overage

just expose it in status

Frontend Requirements

Add billing/account UI.

Recommended routes:

app/
  app/
    (protected)/
      account/
        billing.tsx

Or place under settings/profile if that is your current structure.

Recommended API file:

src/api/billing.ts
1. Billing Screen

Route example:

(protected)/account/billing.tsx

Requirements:

fetch GET /api/my/billing

display:

current plan

subscription status

SMS usage this month

included monthly limit

overage tracked

show feature comparison:

Level 1

Level 2

Level 3

Buttons:

Upgrade to Level 2

Upgrade to Level 3

Cancel subscription (if endpoint implemented)

Manage current plan (optional text only)

2. Upgrade Flow

When user taps upgrade:

call POST /api/my/billing/subscribe

open returned PayPal approval URL in browser

Use Expo linking/browser best effort.

After user returns:

allow manual refresh of billing status

do not overcomplicate automatic return state in this task

3. Feature Visibility / Gating in Frontend

Update frontend so feature UI respects plan:

Level 1

show manual messaging tools

hide/disable “Send via DCR Poker”

hide/disable seat operations UI

show upgrade prompts

Level 2

show SMS send

hide/disable inbound/seat tools

show upgrade prompt for Level 3 features

Level 3

show full operations features

Implement this at least in:

messaging compose screen

game detail / operations UI

billing screen

If exact plan data is not globally available yet, add it to auth/app context or fetch as needed.

Validation Criteria

Task is complete only if all of the following are true:

Backend

billing schema created

host current plan can be resolved

/api/my/billing works

/api/my/billing/subscribe returns PayPal approval URL

PayPal webhook endpoint logs and processes subscription events

feature gating blocks unauthorized access to Level 2 / 3 endpoints

Frontend

billing screen loads current plan/usage

upgrade buttons work

PayPal approval URL opens

UI reflects plan-based access at least in messaging and game operations

Product behavior

Level 1 cannot use backend SMS send

Level 2 can use outbound SMS only

Level 3 can access Level 3 operations tools

overage is visible/tracked, not billed yet

Constraints

do not build referral credits yet

do not auto-charge overage yet

do not build full invoice history yet

do not overengineer billing state machines

keep this foundation-focused and practical

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

SQL migration contents

PayPal service contents

billing controller/routes contents

feature gate middleware contents

frontend billing screen contents

exact env vars required

exact test steps for:

get current billing

create Level 2 subscription

create Level 3 subscription

simulate/process webhook

verify gating for Level 1 vs Level 2 vs Level 3

sample JSON responses

Notes

This task completes the first true monetization layer and ties together the messaging tiers you defined.