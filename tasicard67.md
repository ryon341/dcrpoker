TC067 — Launch Package + Store/Listing Copy + Release Checklist
Goal

Prepare the app for launch with a complete marketing and release package so you can publish without scrambling for copy, screenshots, or QA steps.

This taskcard is not about core gameplay. It is about:

store-ready copy
screenshot ordering
app metadata
launch checklist
pre-release QA checklist
post-launch monitoring checklist
Scope

Create a complete launch package for the DCR Poker app, including:

app store listing copy
short and long marketing descriptions
feature bullets
screenshot plan using your preview assets
app icon / branding checklist
pre-launch QA checklist
release-day checklist
post-launch monitoring checklist

Do not change gameplay in this task.
Do not add backend features.
Do not redesign screens.

Files To Create
1. launch-package.md

Main launch document.

Include:

app title options
subtitle/tagline options
short description
long description
feature bullets
screenshot captions
keyword ideas
CTA copy
release checklist
2. qa-checklist.md

Practical pre-launch QA steps.

Organize by:

gameplay
progression
auth
ads
daily mode
stats
settings
performance
mobile responsiveness
3. release-checklist.md

Launch-day operational checklist.

Include:

final build verification
environment checks
analytics verification
backend verification
store asset verification
smoke test steps
4. post-launch-monitoring.md

What to watch in the first 7 days.

Include:

crashes
failed progress saves
ad impressions/clicks
daily challenge completion
login gate conversion
basic user funnel observations
Files To Modify
1. stats.tsx/poker-challenge/stats.tsx

Optional: add a hidden dev/build version label if easy.

2. Any app config / metadata file used for title, description, icon, splash, etc.

Only if the project already stores listing-facing metadata there.

If not, keep everything in docs for now.

Launch Copy Requirements
App Name Options

Provide 3–5 options, with one recommended.

Examples:

DCR Poker
DCR Poker Challenge
DCR Poker Trainer
Deer Creek Road Poker
DCR Poker IQ

Pick one recommended primary.

Tagline / Subtitle Options

Provide 5 concise options.

Examples:

Master poker decisions fast
Train smarter. Play better.
Level up your poker IQ
Build winning instincts daily
Make better decisions at every table
Short Description

Target:

one sentence
high conversion
clear benefit

Example structure:

“Train your poker instincts with fast preflop decisions, streaks, levels, and daily challenges.”
Long Description

Write store-ready copy with these sections:

1. Hook

What the app helps the user do.

2. Core features

Must mention:

level-based poker challenge mode
yes/no GTO-style preflop decisions
random runouts and scoring
daily challenge mode
titles, streaks, stats
no-login early access / guest play
3. Why it helps

Focus on:

speed
repetition
pattern recognition
confidence at real tables
4. CTA

Encourage download/play.

Feature Bullet Requirements

Provide 6–10 polished bullets such as:

Fast preflop decision training
25 progressive levels
Daily 5-hand challenge
Stats, streaks, and titles
Bonus wheel rewards
Guest play through Level 5
Track long-term improvement
Built for quick sessions

Keep them concise and store-friendly.

Screenshot / Preview Plan

Use your preview images and assign final order/captions.

Create a section in launch-package.md:

Screenshot Order
app-preview-01.png
Caption: “Master Poker Decisions Fast”
app-preview-02.png
Caption: “Level Up Your Poker IQ”
app-preview-03.png
Caption: “Play Smarter. Win More.”
app-preview-04.png
Caption: short caption
app-preview-05.png
Caption: short caption

If some previews are weaker, call that out and recommend which 3–5 to actually use first.

Release Checklist Requirements
Pre-Launch QA

Must include checks for:

Gameplay
answer flow
scoring
wheel timing
level progression
level 6 gate
Auth
guest to login migration
post-auth resume
backend restore
offline fallback
Daily
seeded challenge generation
resume
completion
streak counting
same-day lockout
Ads
trigger timing
cooldown logic
CTA open
tracking:
impression
click
completion
Stats
dashboard accuracy
title display
settings toggles
ad performance metrics
Performance
no timer leaks
no obvious flicker
responsive layout on mobile
Release-Day Checklist

Include:

backend up
DB migrations applied
auth working
progress save tested
daily mode tested
ad click tested
stats page tested
build number/version confirmed
screenshots and listing copy finalized
Post-Launch Monitoring

Include what to check daily for first week:

failed saves
login gate abandonment
daily challenge usage
ad CTR
crash reports
top user complaints
which screens users reach most
Optional But Recommended

Add a section:

“Known V2 ideas”

Keep it short, include:

advanced modes
leaderboards
richer study tools
more challenge packs

This helps separate launch scope from future scope.

Acceptance Criteria
launch-package.md exists with complete launch copy
qa-checklist.md exists with practical test list
release-checklist.md exists with launch-day steps
post-launch-monitoring.md exists with first-week monitoring plan
screenshot order and captions are defined
app name/tagline recommendations are included
copy is polished and user-facing, not placeholder text
documents are concise enough to use immediately
Deliverable Back

When complete, report:

files created
recommended app name
recommended tagline
final short description
screenshot order chosen
any weak screenshots that should be regenerated before launch

After this, you are essentially at release readiness.