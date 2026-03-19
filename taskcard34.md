
TASKCARD — Audiobook Section (VS Code Implementation)
Title

TC033-A — Audiobook UI + Training Page Integration

Objective

Build a reusable Audiobook Card Grid component and integrate it into:

Training Page (/tools/training or equivalent)

Future Gear / Monetization surfaces

This component should:

display all 10 books

use local images

open Amazon links

match the UI system created in TC037

Requirements
1) Create Audiobook Component
File:
app/components/AudiobookGrid.jsx
Component behavior

render all books from audiobookData

display as responsive grid

each item is a card:

cover image

title

short description

CTA button

Layout
Grid:

mobile: 1 column

tablet: 2 columns

desktop: 3 columns

Card structure

Each card must include:

Image (top)

full width

maintain aspect ratio

rounded corners

Title

bold

slightly larger font

Description

short (2–3 lines max)

muted color

CTA button

Text:

View on Amazon

Behavior:

opens external link

use Linking.openURL()

2) Import Data

Use:

import { audiobookData } from "../lib/audiobooks";
3) Example Implementation
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { audiobookData } from "../lib/audiobooks";

export default function AudiobookGrid() {
  return (
    <View style={{ gap: 16 }}>
      {audiobookData.map((book, index) => (
        <View key={index} style={styles.card}>
          
          <Image source={book.image} style={styles.image} />

          <Text style={styles.title}>{book.title}</Text>

          <Text style={styles.description}>
            {book.description}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(book.link)}
          >
            <Text style={styles.buttonText}>View on Amazon</Text>
          </TouchableOpacity>

        </View>
      ))}
    </View>
  );
}
4) Basic Styles (match TC037)
const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a"
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6
  },
  description: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#000",
    fontWeight: "600"
  }
};
5) Integrate Into Training Page
File:
app/app/tools/training.jsx
Add section:
import AudiobookGrid from "../../components/AudiobookGrid";
Insert near bottom:
<View style={{ marginTop: 40 }}>
  <Text style={styles.sectionTitle}>
    Learn from the Best
  </Text>

  <AudiobookGrid />
</View>
6) Add Section Title Style
sectionTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#fff",
  marginBottom: 16
}
7) Fix Final Book Link

Replace this:

link: "#"

With:

link: "https://www.amazon.com/dp/B071Y3CLQS?tag=deercreek097-20"

📌 That link corresponds to:
“How to Study Poker”

8) Optional (Nice-to-have)

If easy:

add horizontal scroll version for mobile

add category label badge

add “Why we recommend” expandable text

9) Acceptance Criteria

Taskcard is complete when:

Audiobook grid renders all 10 books

Images load correctly from local assets

Clicking button opens Amazon link

Layout looks clean (card-based, not plain text)

Works on mobile (no overflow)

Integrated into Training page

Matches TC037 visual system

10) Out of Scope

Do NOT:

fetch from API

add user accounts

track clicks (later feature)

over-style or animate

🔥 What this unlocks

After this:

TC033 (Training Page) becomes real + valuable

you now have:

content ✅

UI ✅

monetization ✅

🚀 NEXT STEP

After this taskcard:

👉 TC034 — Poker Chips Page (affiliate conversion)

If you want next, I can:

build chip recommendation UI tied to your calculator

or wire “show books after training quiz results” (very powerful conversion move)

give me tc034
Taskcard 034 — Poker Chips & Gear Page (Landingsite Build)
Objective

Create a high-conversion Poker Chips & Gear page that:

helps users choose the right chip set and accessories

ties directly into the chip calculator value proposition

drives affiliate clicks without feeling spammy

matches the UI/design system established in TC035 and TC037

This page should feel like a curated buyer’s guide for home game hosts.

Page URL
/poker-chips
Strategic purpose

This page is the affiliate conversion page for users who are:

building a home game

upgrading a setup

using your chip calculator

shopping for practical poker gear

It should connect naturally to:

homepage

poker tools page

training page

pricing page

chip calculator inside the app

Global design rules

same visual system as homepage / pricing / tools

dark theme

tight spacing

card-based layout

strong CTA buttons

mobile-first

max width ~1100–1200px

avoid clutter and “storefront chaos”

Tone:

confident

practical

slightly rugged

recommendation-driven, not salesy

SECTION 1 — HERO
Headline (H1)

Find the Right Poker Chips for Your Game

Subtext

Whether you’re hosting a casual home game or building a serious setup, we’ll help you choose the right chips, accessories, and gear.

CTA Buttons

Find My Setup

Use Chip Calculator

Supporting line

No guesswork. No junk recommendations. Just gear that fits real games.

SECTION 2 — CHIP BUYING GUIDE INTRO
Header

Start with the Right Chip Count

Text

Most people buy the wrong set because they guess. The right chip set depends on how many players you host, your average buy-in, your rebuy habits, and whether you run cash games or tournaments.

CTA Card

Create a highlighted callout card:

Title

Not sure what you need?

Text

Use the chip calculator to estimate the right number of chips before you buy.

Button

Open Chip Calculator

(link to app calculator or tools page)

SECTION 3 — CHIP SET CATEGORIES (CORE CONVERSION SECTION)
Header

Choose Your Chip Level

Layout

3 large cards, stacked on mobile

Card 1 — Budget Sets
Title

Budget Chip Sets

Subtext

Best for casual games, beginners, and lower-cost setups.

Recommended use text

Good for:

occasional home games

casual players

starter setups

Product slots

Space for 3–5 products

Each product card should include:

product image

product name

short “best for” line

short recommendation text

CTA button: View on Amazon

Section CTA

Shop Budget Sets

Card 2 — Mid-Tier Sets
Title

Mid-Tier Chip Sets

Subtext

Best balance of quality, feel, and price for regular home games.

Recommended use text

Good for:

frequent hosts

better chip feel

more polished setup

Product slots

3–5 products

Section CTA

Shop Mid-Tier Sets

Card 3 — Premium Sets
Title

Premium Chip Sets

Subtext

For hosts who want a serious table feel and a more professional setup.

Recommended use text

Good for:

serious hosts

premium feel

showcase game setups

Product slots

3–5 products

Section CTA

Shop Premium Sets

SECTION 4 — HOW MANY CHIPS DO YOU ACTUALLY NEED?
Header

How Many Chips Should You Buy?

Short intro text

The right answer depends on your game. Here’s a practical way to think about it.

3 info cards
Card 1

Small Casual Game
4–6 players, light rebuys
→ Usually 300–500 chips

Card 2

Standard Home Game
6–9 players, moderate rebuys
→ Usually 500–800 chips

Card 3

Larger / Tournament Setup
8+ players, deeper stacks or re-entries
→ Usually 800–1000+ chips

CTA

Use Our Chip Calculator

SECTION 5 — ACCESSORIES SECTION
Header

Complete the Setup

Subtext

The right accessories make your game smoother, faster, and more professional.

Layout

Accessory cards grid

Accessory categories

Playing Cards

Dealer Buttons

Cut Cards

Card Shufflers

Table Accessories

Each accessory card should include:

category title

short description

optional featured products

CTA: View Gear

Do not overcrowd this section. Keep it curated.

SECTION 6 — WHY WE RECOMMEND THIS GEAR
Header

What We Look For

4 short cards
Card 1 — Feel

Chips should handle well and feel right in play.

Card 2 — Durability

Cheap chips wear out fast. We prioritize gear that lasts.

Card 3 — Game Fit

The best setup depends on your players and game style.

Card 4 — Value

Not everyone needs premium gear. We recommend what actually fits the job.

SECTION 7 — APP CONNECTION SECTION
Header

Built to Work with the DCR Poker App

Text

Use the chip calculator to estimate what you need, then come back here to shop the right size set.

CTA Buttons

Use Chip Calculator

Explore Poker Tools

SECTION 8 — INTERNAL LINKING / FUNNEL
Header

Keep Building Your Game

Cards
Tools

Estimate chips, odds, and ranges
→ /poker-tools

Training

Improve your decisions away from the table
→ /poker-training

Pricing

Upgrade your game management system
→ /pricing

SECTION 9 — FINAL CTA
Headline

Build a Better Poker Setup

Subtext

Get the right chips, the right gear, and the right tools for your next game.

Buttons

Find My Setup

Use Chip Calculator

Navigation requirements

Ensure top nav includes:

Home

Tools

Training

Gear (active)

Pricing

Product card requirements

Where products are shown, each product card should include:

image

product title

“best for” line

short description

CTA button

Optional badge styles:

Best Value

Most Popular

Premium Pick

Starter Pick

Keep badges subtle and reusable.

Copy style

Use short, practical copy.

Examples:

“A solid starter set for casual games.”

“Best balance of value and feel.”

“A serious upgrade for hosts who run regular games.”

Avoid:

long paragraphs

generic marketing language

overpromising

Content population notes

Landingsite should build the page structure first so products can be populated section-by-section.

Use the existing affiliate strategy:

Amazon Associates links only

curated recommendations only

no giant catalog behavior

Acceptance criteria

Page is complete when:

Hero clearly explains purpose

Chip levels are clearly separated

Calculator is promoted in multiple places

Accessories section is curated and readable

Internal links work

CTA buttons are visible and repeated

Page is mobile-friendly

Page feels like a buyer’s guide, not a cluttered store

Handoff note for Landingsite

Use the same visual system as homepage and pricing

Keep spacing tight and sections scannable

Use product cards, not plain text lists

Maintain strong CTA hierarchy

Keep page practical and conversion-oriented

Relationship to previous taskcards

This page should connect directly to:

TC032 Poker Tools page

TC035 Homepage

TC031 Pricing page

chip calculator inside the app

future in-app gear recommendations from monetization work