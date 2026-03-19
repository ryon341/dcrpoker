Taskcard 037 — UI System + Layout Foundation Pass
Objective

Create the first real visual system for the DCR Poker app so the product stops looking like a plain functional prototype and starts feeling like a polished, modern poker app.

This taskcard should establish:

a reusable app shell

consistent navigation

card-based page structure

button system

spacing / typography rules

a visual treatment applied to the highest-traffic pages first

This is the turning-point card for the UI.

Why this card now

Current state:

core functionality exists

routes/pages exist

tools/training/pricing/homepage content structure exists

Problem:

screens are still plain

little or no visual hierarchy

pages feel linear and unfinished

mockups exist, but product UI foundation does not

This card solves the structural UI layer first so future pages do not need redesign from scratch.

Primary outcome

After TC037, the app should visibly change from:

black/plain screens

linear menus

unstyled blocks

to:

branded top navigation

centered content container

reusable cards

styled CTAs

consistent spacing and headings

a coherent dark-theme poker product feel

Design direction

Visual tone:

dark, modern, slightly rugged

premium but not flashy

built for poker players, not corporate SaaS

Base palette guidance:

background: near-black / charcoal

cards: slightly elevated dark panels

text: white / near-white

secondary text: muted gray

accent: poker green or rich gold used sparingly

borders: subtle dark gray

danger/error: muted red, not neon

Do not overuse gradients, glow, or animation.

Scope

This taskcard is both:

a design system setup

a first-page application pass

PART A — GLOBAL APP SHELL
1) Build a reusable app shell / layout

Create a reusable layout component used by app pages.

Requirements

top navigation bar

consistent page container

consistent page padding

optional mobile nav handling

route content rendered inside layout

Top nav must include

logo / DCR Poker brand on left

primary nav:

Games

Tools

Training

Gear

Pricing

right side:

profile/account/menu area

notification bell if already available

active state styling for current route

Layout behavior

desktop: horizontal nav

mobile: compact nav or menu button

sticky top nav preferred if easy

Container rules

centered content

max width around 1100–1200px

horizontal padding

vertical padding below nav

2) Create page section wrapper conventions

Pages should use a consistent section wrapper pattern.

Each major page section should have:

clear heading

supporting text where needed

spacing above and below

grid or card layout where appropriate

No more loose text stacked down the screen.

PART B — REUSABLE UI COMPONENT SYSTEM
3) Create reusable button system

Build a shared button component or shared button styles.

Required variants

Primary

main action

filled style

used for Start Free, Create Game, Upgrade, Open Tool

Secondary

outlined or toned-down fill

used for Explore, View, Learn More

Ghost

minimal text-style action

used for lower-priority actions

Button requirements

consistent heights

rounded corners

hover states

disabled state

focus state visible

mobile-friendly tap size

4) Create reusable card system

Build a shared card component or shared card patterns.

Required card uses

homepage value cards

tool cards

pricing cards

game cards

feature cards

Card style requirements

dark elevated panel

subtle border

rounded corners

consistent padding

consistent heading/body/button spacing

hover lift/shadow if easy

5) Create typography scale

Establish consistent heading and text styles.

Requirements

page hero heading

section heading

card heading

body text

muted secondary text

labels / badges

Goals

visual hierarchy is obvious

pages scan quickly

avoid oversized text everywhere

avoid flat same-size text

6) Create spacing system

Establish consistent spacing conventions.

Requirements

page top spacing

section spacing

card padding

grid gaps

button spacing

header-to-body spacing

Goal

Make pages feel intentionally designed rather than randomly spaced.

PART C — PAGE APPLICATION PASS

Apply the new UI system to the highest-priority pages immediately.

7) Apply new UI to Homepage

Use the existing TC035 homepage content/structure, but implement it with the new UI system.

Requirements

hero section looks real

CTA buttons styled

3-card value section

feature cards/grid

tools preview cards

final CTA section

dark overlay/background treatment if a hero image is used

Goal

Homepage should become the first page that feels close to the mockup level.

8) Apply new UI to Poker Tools page

Use existing TC032 content structure.

Requirements

hero section

3 tool cards

deeper feature sections

internal link cards

clear CTA hierarchy

Goal

No plain linear blocks; tools should feel clickable and productized.

9) Apply new UI to Pricing page

Use existing TC031 content structure.

Requirements

pricing cards visually distinct

Host Pro highlighted

comparison section readable

FAQ clean and compact

strong final CTA

Goal

Pricing should look conversion-ready, not like plain text in columns.

10) Apply new UI to Games list page

Upgrade the current games list or dashboard page.

Requirements

games displayed as cards or strong list rows

each item includes:

title

date/time

stakes or summary

RSVP/player info if available

primary action button

empty state styled if no games exist

Goal

Core app screen starts to look like a product dashboard.

11) Apply new UI to Game Manage page

Upgrade the host management page from TC025.

Requirements

seat summary card at top

RSVP sections visually grouped

player rows styled clearly

buttons/actions aligned and readable

mobile stacking works properly

Goal

Host control page should feel operational and clean.

PART D — POLISH / UX FOUNDATION
12) Add simple badge / label styles

Needed for:

Most Popular

Free

Coming Soon

Confirmed

Waitlist

Pending

Keep consistent and reusable.

13) Add empty states

For pages with no content yet, create styled empty states.

Required examples

no games yet

no notifications yet

no tools history/saved items

no public games nearby if applicable

Empty state should include

headline

short helpful text

CTA button where appropriate

14) Add basic loading / error UI

Where feasible, replace raw loading text with simple styled states.

Requirements

loading spinner or pulse skeleton if easy

inline error card or message

retry button where appropriate

15) Ensure mobile usability

This is critical.

Verify and adjust

nav works on small screens

cards stack cleanly

buttons stay tappable

pricing cards readable

tool cards readable

no text overflow

no horizontally broken layouts except where intentionally scrollable

TECHNICAL GUIDANCE
Preferred implementation approach

If the frontend already uses Tailwind:

standardize on Tailwind utility classes

extract shared components where repetition is high

If not Tailwind:

create a small shared stylesheet / component theme

still follow same structure and reuse patterns

Suggested files

Adapt to current repo structure, but likely additions/updates include:

Shared/layout

client/src/components/layout/AppShell.jsx

client/src/components/layout/TopNav.jsx

client/src/components/ui/Button.jsx

client/src/components/ui/Card.jsx

client/src/components/ui/Badge.jsx

client/src/components/ui/EmptyState.jsx

Page updates

homepage page/component

tools page/component

pricing page/component

games page/component

manage game page/component

Design implementation notes

Do not introduce a heavy design library unless already present

Do not over-engineer theming

Keep component API simple

Favor consistency over cleverness

ACCEPTANCE CRITERIA

Taskcard is complete when:

App has a reusable top navigation shell.

Content renders inside a centered, padded container.

Shared button styles/components exist and are used.

Shared card styles/components exist and are used.

Shared badge styles/components exist and are used.

Homepage is visually transformed using the new system.

Tools page is visually transformed using the new system.

Pricing page is visually transformed using the new system.

Games list/dashboard looks card-based and structured.

Game Manage page looks grouped and operational.

At least basic empty states exist for major pages.

Mobile layout is substantially improved.

App no longer feels like plain text and linear menus.

OUT OF SCOPE

Do not include in TC037:

complex animations

custom illustrations

advanced charts redesign

brand video backgrounds

full design token architecture

dark/light theme toggle

pixel-perfect marketing art

This is a foundation pass, not final visual perfection.

IMPLEMENTATION PRIORITY ORDER

The coder should execute in this exact order:

App shell / top nav / container

Button + Card + Badge primitives

Typography + spacing cleanup

Homepage pass

Tools page pass

Pricing page pass

Games page pass

Game Manage page pass

Empty/loading/error states

Mobile cleanup

HANDOFF PROMPT FOR YOUR CODER
TASKCARD 037 — UI System + Layout Foundation Pass

Objective:
Build the first real visual system for the DCR Poker app so it stops looking like a plain functional prototype and starts feeling like a polished product.

Primary goals:
- reusable app shell with top navigation
- centered content container
- shared button system
- shared card system
- shared badge styles
- typography and spacing consistency
- apply the system to key pages immediately

Global UI requirements:
- dark theme
- modern poker product feel
- mobile-first
- no over-design
- consistent spacing and hierarchy

Build/Update:
1) App shell / layout
- top nav with:
  - Games
  - Tools
  - Training
  - Gear
  - Pricing
- profile area on right
- active nav state
- centered max-width container

2) Shared UI primitives
- Button: primary / secondary / ghost
- Card
- Badge
- EmptyState

3) Apply to these pages first:
- Homepage
- Poker Tools page
- Pricing page
- Games list/dashboard
- Game Manage page

Homepage requirements:
- real hero section
- styled CTA buttons
- value cards
- feature grid
- tools preview cards
- final CTA

Tools page requirements:
- hero
- tool cards
- deeper feature sections
- internal link cards

Pricing page requirements:
- proper pricing cards
- Host Pro highlighted
- readable comparison section
- clean FAQ
- strong CTA

Games page requirements:
- game cards or structured list rows
- actions visible
- styled empty state

Game Manage requirements:
- seat summary card
- grouped RSVP sections
- styled player rows
- mobile-friendly actions

Polish:
- basic loading/error states
- empty states
- mobile usability cleanup

Important:
- do not add heavy animation
- do not redesign everything from scratch
- use existing routes/content/taskcard structures
- focus on reusable styling and visible product quality

When done, return:
1. files created
2. files modified
3. shared UI components introduced
4. key pages updated
5. assumptions or follow-up recommendations