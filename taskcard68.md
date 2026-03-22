TC068 — Replace Fake Card Overlay With Real Deck SVG Mapping
Goal

Remove the current “Ace template + overlaid rank text” card rendering and replace it with true card faces from the deck in app/assets/deck so every card displays correctly and legibly.

This is a hotfix-priority UI correction.

Problem

Current behavior appears to:

render a generic Ace-based card image
overlay rank text on top
produce unreadable or misleading cards

This causes:

confusing hand display
trust loss in gameplay
incorrect visual communication
Desired Result

When game state says:

AS → show Ace of Spades
10D → show Ten of Diamonds
KC → show King of Clubs

No text overlay hacks.

Deck Source

Use the existing SVG files already saved in:

app/assets/deck/

Examples present in the deck:

ace_of_spades.svg
10_of_clubs.svg
jack_of_hearts.svg
queen_of_diamonds.svg
king_of_clubs.svg

Important:

Prefer the base files like king_of_clubs.svg
Do not use the large alternate *2.svg face-card files unless there is a specific rendering reason
Ignore jokers
Implementation Strategy

Use a single card asset map and update the card component to resolve rank/suit into the correct SVG file.

Files To Create
1. app/src/components/poker-challenge/cardAssetMap.ts

Create a single exported map from poker notation to SVG require/import.

Target keys:

AS, AH, AD, AC
KS, KH, KD, KC
QS, QH, QD, QC
JS, JH, JD, JC
TS, TH, TD, TC
9S ... 2C

Example structure:

export const CARD_ASSET_MAP = {
  AS: require('@/assets/deck/ace_of_spades.svg'),
  AH: require('@/assets/deck/ace_of_hearts.svg'),
  AD: require('@/assets/deck/ace_of_diamonds.svg'),
  AC: require('@/assets/deck/ace_of_clubs.svg'),
  KS: require('@/assets/deck/king_of_spades.svg'),
  KH: require('@/assets/deck/king_of_hearts.svg'),
  KD: require('@/assets/deck/king_of_diamonds.svg'),
  KC: require('@/assets/deck/king_of_clubs.svg'),
  // ...
  TC: require('@/assets/deck/10_of_clubs.svg'),
  // ...
  2C: require('@/assets/deck/2_of_clubs.svg'),
} as const;

If your bundler requires static imports instead of dynamic require, use explicit imports.

Files To Modify
1. app/src/components/poker-challenge/PlayingCard.tsx

This is the main fix.

Replace the current rendering logic so it:

accepts rank + suit or a compact card code
resolves the correct SVG asset from CARD_ASSET_MAP
renders the actual card face
no longer overlays rank text onto an Ace image
2. app/src/components/poker-challenge/HandDisplay.tsx

Ensure all hand and board cards pass valid card codes into PlayingCard.

3. Any helper that parses card strings

If challenge data uses strings like:

A♠
K♣
10♦

Add or update a parser utility so those are converted consistently into:

AS
KC
TD
Parsing Utility

If needed, create:

2. app/src/components/poker-challenge/cardCode.ts

Functions:

export function normalizeCardCode(input: string): string
export function rankSuitToCode(rank: string, suit: string): string

Support these inputs:

A♠
K♣
10♦
J♥
already-normalized forms like AS, TD, QC

Suit mapping:

♠ → S
♥ → H
♦ → D
♣ → C

Rank mapping:

10 → T
A, K, Q, J, 9...2 unchanged
Rendering Requirements
Face-up cards

Use the real deck asset.

Face-down cards

Keep using existing card-back.png behavior for hidden villain cards.

Unknown / invalid cards

If an invalid card code is passed:

do not crash
show a fallback placeholder or card back
log a dev warning only

Example:

if (__DEV__ && !CARD_ASSET_MAP[code]) {
  console.warn(`[PlayingCard] Missing card asset for code: ${code}`);
}
SVG Rendering Note

Since the deck is SVG-based, use the project’s existing SVG image support.

If the project already supports importing SVGs as React components:

render them directly

If the project supports SVGs as image sources:

use that

If SVG support is not already wired for this usage, install/configure the standard SVG support already appropriate for your stack.

Do not convert the whole deck to PNG unless absolutely necessary.

Remove Old Overlay Logic

Delete or disable:

rank text overlays
suit text overlays
Ace-template face card behavior

The new card face should come entirely from the deck asset.

Sizing / Style

Keep card sizing consistent with current UI.

Suggested behavior:

preserve current width/height props if they exist
use resizeMode="contain" or equivalent
ensure cards stay crisp and centered

Do not stretch cards.

Testing Checklist

Verify these exact examples render correctly:

AS
AH
AD
AC
TD
7C
QS
KH

Verify in:

hero hand
villain reveal
flop / turn / river
daily mode
stats or preview screens only if they use live cards
Acceptance Criteria
Real card faces render from the deck instead of Ace overlays
All 52 standard cards are supported
Hero hand cards display correctly
Villain revealed cards display correctly
Board cards display correctly
Hidden cards still use card back
Invalid card codes fail gracefully
No text overlay remains on face-up cards
Card readability is clearly improved on mobile
No gameplay logic changes
Deliverable Back

When complete, report:

files created
files modified
how SVGs are being rendered
8 sample card codes tested
whether any deck files were excluded
screenshot of hero hand + villain hand + board showing mixed ranks correctly