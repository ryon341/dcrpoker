Taskcard 017 — Referral / Credit System Foundation + Overage Ledger (No Auto-Charge Yet)
Goal

Build the financial tracking layer that sits behind host messaging plans:

track SMS overages

track host credits

track referral-earned credits

apply credits against overages in reporting

prepare the system for future rebate / credit logic

This task is accounting foundation only.
Do not auto-charge overages yet and do not build payout logic.

Scope
Build now

database tables for credits and overage ledger

backend logic to calculate monthly overage

backend logic to store credit balances and transactions

referral code foundation

billing API enhancements to show:

overage units

overage dollar amount

available credits

net amount after credits (informational only)

simple frontend billing screen enhancement to display these values

Do not build yet

automatic charging of overages

actual referral payouts

affiliate payouts

promo engine

coupon system

tax handling

full accounting exports

Product Rules
Overage

Level 2: 500 included SMS/month

Level 3: 1000 included SMS/month

Overage rate: $0.02 per message

For this task:

calculate it

store it

display it

do not charge it yet

Credits

Credits are internal balances that can later offset costs.

Credits may come from:

referral signups

manual admin adjustments

promotional credits

future rebate logic

Referral foundation

Each host should have a referral code.
When a referred host signs up later, the system should be able to connect:

referrer host

referred host

For this task, only build the foundation.
No automatic award logic is required beyond a simple manual or testable path.

Backend Architecture

Add structure such as:

src/
  controllers/
    creditsController.js
    referralsController.js
  routes/
    credits.js
    referrals.js
  services/
    creditsService.js
    referralService.js
    overageService.js

You may fold some logic into billingService.js if cleaner, but keep responsibilities understandable.

Database Changes

Create a new SQL file, for example:

src/db/schema/008_referrals_credits_and_overage.sql
1. host_referral_codes

Purpose: one or more referral codes owned by hosts

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

referral_code varchar(50) not null

is_active tinyint(1) not null default 1

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

unique index on referral_code

Indexes:

index on host_user_id

index on is_active

Notes:

One active code per host is enough for now

You may seed/generate automatically on first access

2. host_referrals

Purpose: record that one host referred another host

Fields:

id bigint unsigned primary key auto_increment

referrer_host_user_id bigint unsigned not null

referred_host_user_id bigint unsigned not null

referral_code varchar(50) not null

status varchar(30) not null default 'pending'

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key referrer_host_user_id → users(id)

foreign key referred_host_user_id → users(id)

unique index on referred_host_user_id

Indexes:

index on referrer_host_user_id

index on status

Recommended statuses:

pending

qualified

credited

cancelled

Notes:

One referred host should only map to one referrer for now

3. host_credit_transactions

Purpose: ledger of all credit changes

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

type varchar(30) not null

amount_cents int not null

description varchar(255) null

reference_type varchar(50) null

reference_id bigint unsigned null

created_at datetime not null default current_timestamp

Constraints:

foreign key host_user_id → users(id)

Indexes:

index on host_user_id

index on type

index on reference_type

Recommended type values:

referral_credit

manual_credit

promo_credit

credit_applied

credit_reversal

Notes:

positive values add credit

negative values consume/reverse credit

4. host_overage_ledger

Purpose: monthly overage snapshots / ledger entries

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

year int not null

month int not null

included_messages int not null default 0

messages_sent int not null default 0

overage_messages int not null default 0

overage_amount_cents int not null default 0

credits_applied_cents int not null default 0

net_amount_cents int not null default 0

status varchar(30) not null default 'open'

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key host_user_id → users(id)

unique index on (host_user_id, year, month)

Indexes:

index on status

Recommended statuses:

open

reviewed

closed

waived

Notes:

this is not a payment table yet

this is a computed/store-and-display ledger

Service Requirements
1. Credit Balance Service

Create helper:

async function getHostCreditBalanceCents(hostUserId)

Behavior:

sum host_credit_transactions.amount_cents

return integer cents balance

2. Referral Code Service

Create helper:

async function getOrCreateReferralCode(hostUserId)

Behavior:

return existing active code if present

otherwise generate one and insert

Code format can be simple, for example:

DCR + short random suffix

or slug based on username + random suffix

Must be unique.

3. Overage Calculation Service

Create helper:

async function calculateMonthlyOverage(hostUserId, year, month)

Behavior:

get host plan

get included message limit

get sms_usage.messages_sent

compute:

included_messages

overage_messages = max(messages_sent - included_messages, 0)

overage_amount_cents = overage_messages * 2

get credit balance

compute:

credits_applied_cents = min(credit_balance, overage_amount_cents)

net_amount_cents = max(overage_amount_cents - credits_applied_cents, 0)

Return:

{
  includedMessages,
  messagesSent,
  overageMessages,
  overageAmountCents,
  creditBalanceCents,
  creditsAppliedCents,
  netAmountCents
}
4. Overage Ledger Upsert

Create helper:

async function upsertMonthlyOverageLedger(hostUserId, year, month)

Behavior:

call overage calculation

insert/update host_overage_ledger

keep status = open unless already changed manually later

Backend Endpoint Requirements
A. Get Referral Info
GET /api/my/referrals

Authenticated route.

Return:

host’s referral code

referral summary counts

referred hosts list if easy

Example response:

{
  "ok": true,
  "data": {
    "referralCode": "DCRABC123",
    "summary": {
      "totalReferred": 3,
      "qualified": 1,
      "credited": 1
    },
    "referredHosts": [
      {
        "id": 22,
        "display_name": "Mike Host",
        "status": "qualified",
        "created_at": "..."
      }
    ]
  }
}
B. Apply Referral Code to Current Host (Foundation)
POST /api/my/referrals/apply

Authenticated route.

Input:

{
  "referralCode": "DCRABC123"
}

Behavior:

lookup referral code

ensure current user is not applying own code

ensure current user not already linked as referred host

create host_referrals row with status pending

This endpoint is mainly for future signup/upgrade use, but building it now makes the system testable.

C. Get Credit Balance / Transactions
GET /api/my/credits

Authenticated route.

Return:

current credit balance

recent transactions

Example response:

{
  "ok": true,
  "data": {
    "balanceCents": 1200,
    "transactions": [
      {
        "id": 10,
        "type": "referral_credit",
        "amount_cents": 1000,
        "description": "Referral bonus",
        "created_at": "..."
      }
    ]
  }
}
D. Manual Credit Grant Endpoint (Admin/Test Foundation)

If you do not have admin UI yet, add a testable protected endpoint with clear note.

POST /api/my/credits/test-grant

Authenticated route.

Input:

{
  "amount_cents": 500,
  "description": "Test credit"
}

Behavior:

adds a manual_credit transaction for current host

Recommendation

Name it clearly as temporary or test-only.

If you prefer not to expose this as a normal route, create a dev/test-only path or note manual SQL alternative.

E. Get Overage Ledger / Current Month Overage
GET /api/my/billing/overage

Authenticated route.

Behavior:

resolve current month/year

calculate and upsert ledger

return ledger plus credit application preview

Example response:

{
  "ok": true,
  "data": {
    "year": 2026,
    "month": 3,
    "includedMessages": 500,
    "messagesSent": 620,
    "overageMessages": 120,
    "overageAmountCents": 240,
    "creditBalanceCents": 100,
    "creditsAppliedCents": 100,
    "netAmountCents": 140,
    "status": "open"
  }
}
F. Enhance Existing Billing Endpoint

Update:

GET /api/my/billing

So it also returns:

creditBalanceCents

overageMessages

overageAmountCents

creditsAppliedCents

netAmountCents

This keeps billing screen simpler.

Frontend Requirements

Enhance the billing/account screen from Taskcard 016.

Recommended API additions:

src/api/
  referrals.ts
  credits.ts
1. Billing Screen Enhancements

Update billing screen to display:

current plan

current month SMS usage

included monthly limit

overage messages

overage amount

available credits

credits applied

net amount after credits

note that charges are tracked only, not billed yet

Suggested copy:

“Overages are currently tracked for review and are not automatically charged.”

2. Referral Section

On billing/account screen or a separate referrals page, show:

your referral code

copy referral code button if easy

referred host count

basic referral status list if available

Optional:

apply referral code field for testing/foundation

3. Credits Section

Show:

current credit balance

recent credit transactions

Formatting:

convert cents to dollars for display

Feature / Gating Notes

Do not yet consume credits automatically in a destructive accounting sense.
For this task:

treat credits_applied_cents as a computed preview/application in ledger reporting

do not write a negative credit_applied transaction automatically unless you intentionally want ledger consumption now

Recommendation

Do not consume credits yet.
Just compute how much would apply.

This avoids accounting confusion before you have true monthly closing.

Validation Criteria

Task is complete only if all of the following are true:

Backend

referral code can be generated/retrieved

referral code can be applied by another host

credit balance can be calculated from transactions

overage can be calculated from sms usage and plan limit

overage ledger upserts correctly

billing endpoint includes overage/credit info

Frontend

billing screen shows credits and overage values

referral code is visible

recent credit/ledger info is visible

informational wording makes it clear no auto-charge happens yet

Constraints

do not auto-charge overages

do not build payout workflow

do not implement final referral qualification rules beyond simple foundation

do not build tax/accounting exports

keep this as ledger + display foundation

Deliverable

Return:

updated backend folder tree

updated frontend folder tree

SQL migration contents

referral/credit/overage service contents

route/controller contents

billing screen updates

exact test steps for:

generate/get referral code

apply referral code

grant test credit

compute overage

verify billing response includes credits/overage

sample JSON responses