Taskcard 024 — Affiliate Monetization + Conversion Pages
Objective

Introduce revenue-generating pages and flows that:

recommend poker products (chips, books, accessories)

convert users into affiliate clicks

integrate naturally with your app + DeerCreekRoad site

This is not ads — this is intent-driven recommendations.

Strategy (important)

We are NOT building:

a generic “store”

a cluttered marketplace

We ARE building:

Curated, high-conversion recommendation pages tied to user intent

Monetization pillars
1) Poker Chips (highest intent)

Ties directly to:

Chip Calculator (TC020)

2) Poker Books / Audiobooks

Ties to:

Training Mode (TC023)

your existing audiobook page

3) Accessories (secondary)

cards

tables

accessories

Core feature set
1) “Recommended Gear” section inside app

Add to main nav:

Gear or Shop (recommend “Gear”)

Route:

/gear

Page structure — Gear Home
Sections:
A. Poker Chips (PRIMARY)

Budget

Mid-tier

Premium

Each:

3–5 curated products

short recommendation

“Best for…” label

B. Poker Books / Audiobooks

Pull from your existing work:

The Mental Game of Poker

Modern Poker Theory

etc.

Each:

cover image

short description

link to “Why we recommend”

C. Accessories

playing cards

dealer buttons

card shufflers (optional)

CRITICAL: Integration with Tools

This is where conversion happens.

2) Chip Calculator → Gear Integration

After calculation (TC020):

Add a new section:

“Recommended Chip Sets”

Example output:

“Based on your game, you should consider a 500–800 chip set.”

Then show:

2–3 recommended products

direct affiliate links

Logic (simple rules)

If:

total chips < 400 → recommend 300–500 sets

400–800 → recommend 500–1000 sets

800 → recommend 1000+ sets

3) Training Mode → Book Recommendations

After session:

Show:

“Improve your edge”

Recommend:

2–3 books based on training type

Example:

preflop → Modern Poker Theory

mental mistakes → Mental Game of Poker

4) Affiliate link handling

You will use:

Amazon Associates links (SiteStripe)

Implementation requirement

All product links must:

open in new tab

include your affiliate tag

be trackable (optional click logging)

Product data structure

Create:

client/src/lib/gearData.js

Example:

export const chipProducts = [
  {
    name: "Budget 500 Chip Set",
    category: "budget",
    chips: 500,
    bestFor: "casual home games",
    link: "AMAZON_LINK",
    image: "/images/chips/budget500.jpg"
  }
];
UI components

GearPage.jsx

ProductCard.jsx

GearSection.jsx

Design requirements

clean

not spammy

feels like recommendation, not ads

Use:

“Best for”

“Why we recommend”

“Our pick”

Image handling (IMPORTANT)

Only use:

publisher / official images

Amazon product images (allowed via affiliate usage)

Do NOT:

scrape random images

Copywriting tone

Match Deer Creek brand:

confident

slightly rugged / poker lifestyle

not corporate

Example:

“A solid mid-tier set that won’t fall apart after a few hard nights.”

Routes

/gear

optional:

/gear/chips

/gear/books

MVP can be single page.

Backend

Not required.

Optional:

click tracking endpoint (later)

Acceptance criteria

Taskcard complete when:

“Gear” appears in navigation

Gear page includes:

chips section (3 tiers)

books section

accessories section

Each product:

has image

has short description

has affiliate link

Chip Calculator includes:

recommendation section

links to chip products

Training Mode includes:

book recommendations after session

Mobile layout works cleanly

No broken links

Nice-to-have (only if easy)

“Top Pick” badge

“Best Value” tag

click tracking (future analytics)

Out of scope

cart / checkout

inventory system

user reviews

price comparison engine

scraping Amazon dynamically

Suggested file structure
client/src/pages/gear/GearPage.jsx
client/src/components/gear/ProductCard.jsx
client/src/components/gear/GearSection.jsx
client/src/lib/gearData.js
Handoff prompt for your coder
TASKCARD 024 — Affiliate Monetization + Gear Pages

Objective:
Add a monetization layer by creating a Gear section with curated poker product recommendations and integrating it into existing tools.

Requirements:

1) Add Gear page:
- route: /gear
- sections:
  - Poker Chips (budget, mid-tier, premium)
  - Poker Books / Audiobooks
  - Accessories

Each product must include:
- name
- image
- short description
- “best for” label
- affiliate link (Amazon)

2) Chip Calculator integration:
- after results, show:
  “Recommended Chip Sets”
- suggest products based on total chip count

3) Training Mode integration:
- after session, show:
  “Improve your edge”
- recommend 2–3 poker books

4) Data:
- static product dataset (gearData.js)

5) UI:
- mobile-first
- clean product cards
- no clutter

6) Links:
- open in new tab
- use affiliate links

Acceptance criteria:
- Gear page works
- products display correctly
- calculator shows chip recommendations
- training shows book recommendations
- mobile UI works

Out of scope:
- checkout system
- dynamic product fetching
- reviews

Return:
1. files created
2. files modified
3. product data structure
4. integration points added
What this unlocks

After TC024:

your app is now:

useful ✅

engaging ✅

monetized ✅