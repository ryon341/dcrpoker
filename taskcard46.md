TC046 — Convert DCR Poker to Public-First Access Model

Objective
Refactor DCR Poker so that free utility and engagement features are accessible without login, while game search and hosting features remain protected behind authentication.

This is a product and architecture correction, not just a UI tweak.

The new model should be:

Public / no login required

Poker Arcade

training tools

charts

calculators

shopping / affiliate / recommendation pages

educational content

public landing/dashboard

Login required

game search / seat-finding participation

hosting tools

host player lists

invites / RSVP

messaging

saved user-specific data that must sync across devices

billing/subscription-gated areas

This taskcard is specifically about changing routing, shell behavior, auth guards, guest handling, and protected API usage so the app becomes public-first instead of login-first.

1. Product Goal

Let new users open the app and immediately use free value-driving features without creating an account.

Only ask for login/signup when a user attempts an action that genuinely requires identity, ownership, communication, or saved account data.

This should reduce friction and improve:

first-session engagement

trust

repeat usage

conversion after value is demonstrated

2. New Access Model
Public sections

These should load and function for anonymous users:

Home / dashboard

Poker Arcade

Training Hub

Preflop charts

Spot Trainer

EV Analyzer

Hand Recorder if used in guest/local mode

chip calculators / bankroll calculators that do not require sync

shopping and recommendations

static content pages

Protected sections

These must require login:

game search

join-request / contact-host flow

host dashboard

host-created games

player list management

prospect management

invite sending

RSVP dashboard

messaging center

subscription account pages

cross-device saved account data

3. Scope for TC046

This taskcard includes:

remove global forced-login behavior

create public route model

apply auth guard only to protected routes

make app shell work for guests

add guest-safe nav behavior

add login/signup intercept only when protected features are accessed

prevent public pages from crashing when no user exists

create local persistence strategy for public/free tools

preserve existing protected backend authorization

This taskcard does not include:

redesigning auth provider from scratch

social auth

passwordless auth overhaul

advanced guest-to-account sync migration

changes to billing logic other than keeping paid/account routes protected

4. High-Level Refactor Strategy

The current model likely behaves like this:

App boots → auth required → login page → authenticated app

Convert it to:

App boots → public app shell renders
    ↳ public routes open immediately
    ↳ protected routes use RequireAuth

This is the key principle for the entire refactor.

5. Frontend Routing Changes
Target behavior

The main router should support two route classes:

Public routes

Render without auth:

/

/arcade

/training

/charts

/tools

/calculator/*

/shop

/content/*

Protected routes

Wrapped in RequireAuth:

/games

/games/search

/host

/host/*

/invites

/messages

/account

/billing

6. Required Frontend Components / Utilities

Create or update these concepts as needed:

src/
  auth/
    RequireAuth.jsx
    GuestOnly.jsx (optional)
    authContext.js / useAuth.js
  components/
    ProtectedActionModal.jsx
    GuestBanner.jsx
    LoginPromptSheet.jsx
  utils/
    guestStorage.js

If the app already has equivalents, refactor instead of duplicating.

7. Route Guard Rules
RequireAuth

Protected routes must:

check current auth state

if authenticated, render target page

if unauthenticated:

redirect to login/signup route

preserve intended destination for post-login return

or show auth sheet/modal if that is your current app pattern

Recommended behavior:

preserve returnTo route

after successful login, return user to attempted protected page

Example protected flow:

guest taps “Game Search”

app prompts login/signup

after login, app lands on /games/search

8. Public App Shell Refactor

A likely current problem is that the top-level app shell assumes an authenticated user exists.

Refactor shell/header/sidebar so it can render in both states:

Guest state

logo / nav works

public sections visible

protected items either:

visible with lock icon, or

shown in a separate “Account Features” section

header CTA:

“Log In”

“Sign Up”

Authenticated state

existing account-aware nav can remain

user menu/profile/billing can display normally

The key rule:
No top-level layout should crash just because user is null.

9. Navigation Rules
Public navigation should prominently include:

Arcade

Training

Tools

Charts

Shop

Protected navigation should include:

Game Search

Hosting

Invites

Messages

Account

For protected items:

keep them visible if helpful

add lock indicator or subtle “Login required” text

clicking them should trigger auth gate flow

This is better than hiding them completely because it advertises the app’s value.

10. Auth Context Hardening

Audit auth usage across the app.

Anywhere that currently assumes:

const { user } = useAuth();

or

if (!user) return null;

must be reviewed.

Public pages should:

render without user

avoid requesting protected user data at mount

use optional/null-safe handling

Examples:

do not fetch account profile on every page load unless authenticated

do not block public render waiting for auth bootstrap unless necessary

do not redirect guests away from public routes

11. Public vs Protected Data Strategy

This is critical.

Public/free features should use one of these patterns:
Pattern A — no persistence

Use for:

simple calculators

shopping pages

static content

Pattern B — guest local persistence

Use for:

arcade scores

training streaks

chart preferences

recent calculator inputs

hand recorder drafts if guest mode is allowed

Pattern C — account persistence

Use for:

host operations

invites

player lists

messages

billing

cross-device saved user data

12. Guest Local Persistence

Create a lightweight utility:

src/utils/guestStorage.js

Functions could include:

getGuestArcadeStats()

saveGuestArcadeStats()

getGuestToolPrefs()

saveGuestToolPrefs()

getGuestTrainingProgress()

saveGuestTrainingProgress()

Use localStorage first. Keep schemas simple and versionable.

Example storage keys:

dcr_guest_arcade_stats

dcr_guest_training_progress

dcr_guest_tool_prefs

Important:

guest local storage is a convenience, not a guaranteed permanent record

do not tie important protected features to guest storage

13. Feature-by-Feature Access Rules
Poker Arcade

Make fully public.

Behavior:

guests can play all games

scores saved locally if not logged in

if logged in, scores may save to backend

no forced login

Tools / calculators

Make public.

Behavior:

usable immediately

save recent settings locally if useful

no forced login

Training

Make public.

Behavior:

charts, quizzes, study tools available without login

local progress/streak tracking for guests

optional server save only for logged-in users

Shopping / recommendations

Make public.

Behavior:

no auth required

affiliate flows remain normal outbound links

Game Search

Protected.

Behavior:

browsing entry page can optionally be visible

actual search participation, host contact, requests to join, and invite-related actions require login

Hosting

Protected.

Behavior:

all create/edit/manage host workflows require login

14. Recommended Protected Action UX

Create a reusable auth intercept component for protected actions.

ProtectedActionModal.jsx or LoginPromptSheet.jsx

When guest attempts:

Game Search

Join Game

Host a Game

Send Invite

View Messages

Show:

clear reason login is required

short benefits list

buttons:

Log In

Sign Up

Cancel

Suggested copy:

“Create a free account to search games, contact hosts, and manage invitations.”

Do not use a generic dead-end error like “Unauthorized.”

15. Backend Rules
Important

Do not weaken protection on protected APIs.

Protected APIs should remain authenticated.

Examples:

host routes

game search routes if identity is required

invite routes

messaging routes

billing routes

Public APIs

Only expose public endpoints where actually needed:

training question sets

arcade content or seed data if served from backend

static metadata for public tools

If current frontend already bundles most public data locally, backend changes may be minimal.

16. Arcade Refactor Requirement

TC045 assumed authenticated persistence for arcade stats.
Under this new model, arcade must support both guest and logged-in play.

New rule for Arcade

When user is not logged in:

game loads normally

score saves to local storage only

When user is logged in:

game loads normally

score submits to backend arcade stats API

Implementation note

In arcade result submission flow:

branch on user

if user exists → submit to /api/arcade/submit

else → update guest local stats

Arcade Hub should display:

guest local high scores for guests

backend stats for logged-in users

17. Training Refactor Requirement

Training tools must also tolerate guest mode.

For each training feature:

if it currently pulls server-side user progress on mount, guard that behind login state

for guests, initialize with local/default state

optionally save streak or last-used settings to localStorage

Do not block training pages behind auth.

18. Hand Recorder Decision

Decide this explicitly during implementation.

Recommended approach

Allow Hand Recorder in guest mode with local draft persistence.

Guest behavior:

can record hands locally

no cloud sync

no account history

Logged-in behavior:

can optionally save to account later if that feature exists

This keeps the utility side open.

19. Login / Signup Entry Points

Under the new model, login/signup should be reachable from:

header nav

protected route redirects

protected action modals

optional CTA banners in public areas

This means login becomes available, not mandatory at app boot.

20. Landing / Home Page Behavior

Public home/dashboard should become the primary first screen.

Recommended sections:

Poker Arcade

Training Tools

Calculators

Shop / Gear

Callout cards for:

Find a Game

Host a Game

Those callouts can remain visible and lead into login-gated flows.

This helps explain the full product without forcing account creation immediately.

21. State and Loading Behavior

Refactor auth bootstrap so public pages are not held hostage by auth loading unless absolutely necessary.

Recommended pattern:

app can render public shell immediately

auth state resolves in background

protected routes wait for auth resolution before deciding redirect

public routes do not block on full user bootstrap

This usually improves perceived performance.

22. Suggested File-Level Work

Adjust names to your codebase, but likely areas include:

client/src/App.jsx
client/src/router/index.jsx
client/src/auth/RequireAuth.jsx
client/src/context/AuthContext.jsx
client/src/layouts/AppShell.jsx
client/src/components/navigation/MainNav.jsx
client/src/features/arcade/*
client/src/features/training/*
client/src/features/tools/*
client/src/utils/guestStorage.js

Backend likely minimal changes, but review:

server/src/routes/*
server/src/middleware/auth.js
server/src/controllers/*

Main backend task is verifying protected endpoints stay protected and public pages don’t accidentally call them without guards.

23. Acceptance Criteria

TC046 is complete when:

App no longer forces login at initial load.

Guest can access Arcade without logging in.

Guest can access Training without logging in.

Guest can access Tools/Calculators without logging in.

Guest can access Shopping/Recommendations without logging in.

Protected routes for Game Search and Hosting still require login.

Attempting protected features as guest triggers login/signup flow.

Public app shell renders correctly with user = null.

Public pages do not crash due to missing authenticated user state.

Arcade stats save locally for guests.

Logged-in arcade stats continue saving to backend.

Existing protected backend routes remain authenticated.

After login, user can return to intended protected page.

Navigation clearly distinguishes open vs protected sections.

24. Recommended Build Order

Implement in this order:

Phase A — Shell and Routing

Remove global auth redirect

Create/update RequireAuth

Classify routes into public/protected

Make app shell guest-safe

Update nav

Phase B — Guest Mode Support

Add guest local storage utility

Refactor Arcade for guest/local persistence

Refactor Training pages for guest-safe access

Refactor Tools/Calculators for guest-safe access

Phase C — Auth Intercepts

Add protected action modal/sheet

Preserve intended destination after login

QA deep links to protected routes

Phase D — QA / Cleanup

Remove leftover hardcoded auth assumptions

Verify no protected API is called by public pages on mount

Verify guest and authenticated states both behave correctly

25. Risks to Watch
Shared user bootstrap

If app shell fetches user profile eagerly and blocks render, that must be relaxed.

Null-user crashes

Any component assuming user.id exists must be guarded.

Mixed persistence confusion

Be explicit about what guest data is local only.

Post-login return flow

Make sure protected-route redirects preserve destination cleanly.

Subscription gating

Do not accidentally expose paid/account-only features under guest mode.

26. Deliverable Summary

At the end of TC046, DCR Poker should behave like a public utility app with protected community/account modules.

That means:

free value first

account required only when justified

much lower friction

better conversion path

This is the correct product model for the app you’re building.

27. Handoff Prompt for VS Code / Implementer

Use this exact handoff:

TC046 — Convert DCR Poker from login-first to public-first access.

Refactor the app so Poker Arcade, Training, Tools/Calculators, Charts, Shopping, and public content are accessible without login, while Game Search, Hosting, Invites, Messages, Account, and Billing remain protected behind authentication.

Make these changes:

1. Remove any global forced-login behavior from app boot.
2. Classify routes into public vs protected.
3. Use a RequireAuth wrapper only for protected routes such as:
   - /games
   - /games/search
   - /host
   - /host/*
   - /invites
   - /messages
   - /account
   - /billing
4. Make the top-level app shell, header, sidebar, and navigation render safely when no authenticated user exists.
5. Add guest-friendly nav for public sections:
   - Arcade
   - Training
   - Tools
   - Charts
   - Shop
6. Keep protected items visible if appropriate, but clicking them as a guest should trigger login/signup flow instead of crashing or hard-redirecting without context.
7. Add a reusable protected action modal or auth prompt sheet explaining why login is required for Game Search and Hosting features.
8. Preserve intended route destination so that after login the user returns to the protected page they originally tried to open.
9. Add a guest localStorage utility for public feature persistence.
10. Refactor Arcade so:
    - guests can play without login
    - guest scores save locally
    - logged-in users continue saving scores to backend
11. Refactor Training and Tools pages so they do not assume a logged-in user exists and do not crash in guest mode.
12. Ensure public pages do not call protected APIs on mount unless the user is authenticated.
13. Do not weaken backend auth on protected APIs.
14. Verify that Game Search and Hosting still require login.

Acceptance criteria:
- app opens without forcing login
- guest can use Arcade, Training, Tools, Charts, and Shop
- guest cannot access Game Search or Hosting without auth prompt
- public shell works with no user
- protected routes still require auth
- guest arcade stats persist locally
- logged-in arcade stats persist to backend
- post-login return-to behavior works