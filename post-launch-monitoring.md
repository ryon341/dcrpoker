# DCR Poker — Post-Launch Monitoring (First 7 Days)

Check these every day for the first week after launch. Most issues that kill early retention happen in the first 48 hours — catching them fast is the priority.

---

## Daily Monitoring Routine

### Tier 1 — Check Every Day (Critical)

#### Crashes / Errors
- [ ] Check server logs for 5xx errors — any spike vs. baseline?
- [ ] Check client-side error tracking (browser console errors from real users if monitoring is set up)
- [ ] Any "Cannot read property of undefined" patterns suggesting a null state edge case was missed?
- [ ] Any repeated 401/403 errors suggesting auth is failing for real users?

#### Progress Save Failures
- [ ] Check backend logs for failed save calls (`POST /progress` failures)
- [ ] Any pattern of saves succeeding on login but failing on subsequent hands?
- [ ] Monitor for users losing progress on refresh — if users report this, prioritize immediately

#### Auth / Login Gate
- [ ] How many users are attempting Level 6 (triggering the login gate)?
- [ ] What % of those users complete the login flow vs. abandon?
- [ ] Any reports of post-login landing on wrong screen or losing progress?

---

### Tier 2 — Check Every Day (Health)

#### Daily Challenge Usage
- [ ] How many unique daily completions today?
- [ ] Any reports of the daily challenge not loading or showing stale content?
- [ ] Daily streak data persisting correctly? Any reports of streaks resetting unexpectedly?

#### Ad Performance
- [ ] Ad impressions count today
- [ ] Ad click-through rate (CTR%) — target > 2%, excellent > 5%
- [ ] Any reports of the CTA link not opening?
- [ ] Completion rate — are users watching through to the end or skipping?

#### Load / Performance
- [ ] Any user complaints about slow load times?
- [ ] Any reports of blank screens on initial load (progress restore failure)?
- [ ] Mobile responsiveness complaints (anything cut off, unclickable, etc.)?

---

### Tier 3 — Check Every 2–3 Days (Trends)

#### User Funnel Observations
- [ ] How far are most users getting? (Level 1 vs. Level 5 vs. Level 6+)
- [ ] Are users getting stuck at any specific level?
- [ ] What's the most common exit point — after hand 1, after first level, after login gate?

#### Content Quality
- [ ] Any feedback that a specific challenge prompt is confusing or wrong?
- [ ] Any hand scenarios being reported as clearly incorrect?
- [ ] Any scoring results that feel wrong to users?

---

## First-Week Thresholds — When to Act

| Signal | Action |
|---|---|
| > 3 save failure reports | Investigate backend immediately |
| > 1 report of lost progress | Treat as P0 — deploy a fix |
| CTR < 1% after 50+ impressions | Review ad creative / timing |
| Login gate abandonment > 80% | Consider extending guest access to Level 6 |
| Daily completions near zero after day 3 | Check seed logic and lockout behavior |
| Any 5xx spike > 1% of requests | Check server, DB, and API surface |
| Reports of wrong scoring | Audit `scoring.ts` logic against score table |

---

## Metrics to Track (Establish Baseline in Week 1)

Even without a formal analytics platform, track these manually from storage logs or server logs:

| Metric | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 | Day 6 | Day 7 |
|---|---|---|---|---|---|---|---|
| New sessions |  |  |  |  |  |  |  |
| Daily challenge completions |  |  |  |  |  |  |  |
| Ad impressions |  |  |  |  |  |  |  |
| Ad clicks |  |  |  |  |  |  |  |
| CTR % |  |  |  |  |  |  |  |
| Login gate triggers |  |  |  |  |  |  |  |
| Login gate conversions |  |  |  |  |  |  |  |
| Progress save failures |  |  |  |  |  |  |  |
| Crash / error reports |  |  |  |  |  |  |  |

---

## Top User Complaints to Watch For

Based on the app's design, these are the most likely early complaints:

1. **"I lost my progress"** — Check: local storage cleared? Guest migrated to the wrong account?
2. **"The daily challenge is the same as yesterday"** — Check: seed function using today's UTC date correctly
3. **"It said I was wrong but I was right"** — Check: scoring logic for specific hand scenario
4. **"The ad didn't go away"** — Check: auto-complete trigger; `completeFiredRef` guard
5. **"I can't get past Level 5 without logging in"** — This is expected — confirm messaging is clear
6. **"The app is slow on mobile"** — Check: bundle size, image asset sizes, any unoptimized re-renders

---

## End of Week 1 Review

At the end of day 7, do a brief retrospective:

- [ ] What was the most common user-reported issue?
- [ ] Did the login gate conversion rate meet expectations?
- [ ] Is the daily challenge driving return visits?
- [ ] Is ad CTR on track for DCR's campaign goals?
- [ ] Are there any V2 features that feel urgent based on user feedback?
- [ ] Update `launch-package.md` V2 ideas section based on what you learn.

---

*Monitoring plan version: 1.0*
