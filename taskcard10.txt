Taskcard 010 — Host Contacts Bulk Import Foundation (CSV on Web + Contact Selection Model + Mobile Contacts Placeholder)
Goal

Build the first bulk contact import foundation for host prospect onboarding:

web CSV upload flow for host contacts

preview imported rows before saving

allow host to select which contacts to import

save selected contacts into host_contacts

add a mobile placeholder entry point for future phone contact import

This task is about the import pipeline foundation, not full device contacts integration yet.

Scope
Build now

web-only CSV upload UI

CSV parsing in frontend

import preview table/list

selectable rows

bulk save selected contacts to backend

optional duplicate detection hints

mobile placeholder screen/button for future contact import

Do not build yet

true device contacts access

automatic invite sending

bulk invite generation from imported contacts

SMS/email sending

PayPal

seat assignment

bankroll/charts/blog/training

Product Rules to Enforce
Import model

imported people are prospects, not active players

imported contacts go into host_contacts

host chooses which contacts to save

do not auto-import all rows

host contacts remain private to that host

CSV columns

Support a simple schema:

name

phone

email

Also accept reasonable alternates if easy:

display_name

full_name

Normalize where practical:

trim whitespace

lowercase emails

strip simple phone formatting characters

A row is valid only if:

it has a display name

and at least one of phone or email

Backend Requirements
Preferred approach

Do not add a new bulk-import backend endpoint unless needed.
If easy and clean, add one. Otherwise, frontend may call existing:

POST /api/host-contacts

for each selected contact.

Better option if clean:

Add bulk create endpoint:

POST /api/host-contacts/bulk

Input:

{
  "contacts": [
    {
      "display_name": "John Smith",
      "phone": "5551234567",
      "email": "john@example.com",
      "source": "csv",
      "notes": ""
    }
  ]
}

Behavior:

authenticated user becomes host_user_id

validate each row

insert valid rows

return summary:

inserted

skipped_invalid

skipped_duplicates if implemented

Recommendation

Add this endpoint if it keeps the frontend cleaner.

Frontend Routes / Structure

Recommended routes:

app/
  app/
    (protected)/
      contacts/
        import.tsx

Recommended supporting files:

src/
  api/
    hostContacts.ts
  utils/
    csvContacts.ts
Core Requirements
1. Import Contacts Screen

Route example:

(protected)/contacts/import.tsx

This should be accessible from the Contacts section.

Requirements:

clearly show two import choices:

Upload CSV (web)

Import from phone contacts (mobile — coming soon placeholder)

On web:

show CSV upload area/input

after file selection, parse CSV in browser

show preview results

On mobile:

show placeholder text:

“Phone contact import coming soon”

do not attempt real device contact integration yet

2. CSV Parsing

Frontend should parse CSV client-side.

Accept:

header row required

comma-separated values

ignore blank rows

Map supported columns:

name → display_name

display_name → display_name

full_name → display_name

phone → phone

email → email

Normalize:

trim all values

lowercase email

remove spaces, parentheses, and dashes from phone if easy

Flag row validation status:

valid

invalid

Invalid reasons examples:

missing display name

missing both phone and email

3. Import Preview UI

After parsing, display preview list/table.

For each row show:

checkbox/select toggle

display name

phone

email

validity status

invalid reason if any

Requirements:

valid rows selected by default

invalid rows not selected by default

host can deselect valid rows

show counts:

total rows

valid rows

selected rows

invalid rows

Optional but useful:

“Select all valid”

“Clear selection”

4. Duplicate Hinting (Lightweight)

If practical, before final import:

fetch existing host contacts

compare by phone/email

mark likely duplicates in preview

Do not block import unless you already have duplicate handling logic.

Examples:

duplicate by same phone

duplicate by same email

UI labels can be:

possible duplicate

This is a hint only for now.

5. Save Selected Contacts

When user confirms import:

Option A

Call POST /api/host-contacts/bulk once

Option B

Call existing POST /api/host-contacts for each selected row

Preferred:

bulk endpoint if added

For imported rows:

set source = csv

default status should remain imported

On success:

show summary:

imported count

invalid skipped count

duplicates skipped if applicable

offer button:

back to contacts list

6. Mobile Placeholder Entry

On mobile/native:

show same Import screen

include button/card:

Import from phone contacts

tapping it shows placeholder:

“Phone contact import will be added in a later taskcard.”

This is important so the route exists and the architecture is ready.

7. Navigation

Add a button/link from Contacts list to:

Import Contacts

Keep it simple.

API Requirements
If adding bulk endpoint

Add backend files/update as needed:

Possible route:

POST /api/host-contacts/bulk

Requirements:

auth required

accept array of contacts

validate each row

insert valid rows

source defaults to csv if omitted

return summary

Suggested response:

{
  "ok": true,
  "data": {
    "inserted_count": 12,
    "invalid_count": 2,
    "duplicate_count": 1,
    "inserted": [ ... ],
    "invalid": [
      { "row": 4, "reason": "display_name is required" }
    ],
    "duplicates": [
      { "row": 7, "reason": "phone already exists in this host's contacts" }
    ]
  }
}
Duplicate handling recommendation

At minimum, prevent exact duplicates for same host if:

same host_user_id + same phone

or same host_user_id + same email

If you do not add DB constraints yet, app-level checks are acceptable here.

Validation Criteria

Task is complete only if all of the following are true:

Frontend

Contacts Import screen exists

CSV file can be selected on web

CSV rows are parsed client-side

preview shows valid/invalid rows

host can select which rows to import

selected rows can be saved to backend

success summary is shown

mobile shows placeholder for phone contacts import

Backend

If bulk endpoint added:

endpoint works with auth

inserts selected contacts correctly

returns structured summary

If bulk endpoint not added:

frontend still successfully imports selected contacts using existing create endpoint

Constraints

do not implement real phone contacts access yet

do not implement CSV upload storage on server

do not implement file persistence

do not generate invites automatically after import

do not build messaging yet

do not over-polish the UI

Deliverable

Return:

updated frontend folder tree

any backend changes

contents of:

import screen

CSV parsing utility

bulk endpoint if added

supported CSV format example

exact steps to test import on web

note how duplicates are handled

Suggested CSV Example

Support this sample:

name,phone,email
John Smith,5551234567,john@example.com
Sarah Jones,5552223333,
Mike Carter,,mike@example.com
Bad Row,,

Expected behavior:

first 3 rows valid

last row invalid

Notes

This task builds the bridge between a host’s outside contact list and your in-app prospect system.

After this, Taskcard 011 should be:
Existing player search UI + add to host list + add directly to game invited list.