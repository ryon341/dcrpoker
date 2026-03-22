TC063 — Ad Optimization + Click Tracking + Conversion Layer
Goal

Turn your current ad system into a measurable, optimized revenue engine by adding:

click tracking
impression tracking
smarter ad frequency
real CTA behavior (open DeerCreekRoad)
basic analytics foundation
🧠 Big Picture

Right now:

ads show ✅
branding exists ✅

But:

you don’t know if they work ❌
users can’t actually click through ❌

👉 This taskcard fixes both.

📁 Files To Create
1. adAnalytics.ts

Core tracking system.

type AdEvent = {
  type: 'impression' | 'click' | 'complete' | 'skip';
  mode: 'main' | 'daily';
  timestamp: string;
};

trackAdEvent(event: AdEvent)
getAdAnalytics()

Store locally (AsyncStorage for now).

2. adClick.ts

Handles outbound behavior.

openDeerCreekRoad()

Use:

Linking.openURL("https://www.deercreekroad.com")

Fallback:

log error if cannot open
3. AdStatsPanel.tsx (optional but recommended)

Small debug panel (can hide later)

Shows:

impressions
clicks
CTR %
📁 Files To Modify
AdBreakModal.tsx
adBreak.ts
adBreakStorage.ts
optionally statsPage.tsx (to display ad metrics)
📊 Tracking Requirements
Track these events:
1. Impression

When ad modal opens:

trackAdEvent({ type: 'impression', mode })
2. Click

When user taps CTA:

trackAdEvent({ type: 'click', mode })
3. Complete

When ad runs full 15 seconds:

trackAdEvent({ type: 'complete', mode })
4. Skip (if applicable)

If user skips early:

trackAdEvent({ type: 'skip', mode })
🔗 CTA Behavior (CRITICAL)

Update CTA button in AdBreakModal:

On tap:
trackAdEvent({ type: 'click', mode });
openDeerCreekRoad();
📊 Metrics to Calculate

Inside adAnalytics.ts:

impressions = count(type === 'impression')
clicks = count(type === 'click')

CTR = clicks / impressions
🧠 Frequency Optimization

Update canShowAd() logic.

Current:
10-minute cooldown
Improve to:
Rules:
Main mode
show on first entry
then every 2–3 sessions
Daily mode
show once per day (already working)
Add session counter:
type AdBreakState = {
  mainLastShownAt?: string;
  mainSessionCount?: number;
}
Logic:
if (mainSessionCount % 3 === 0) show ad
🎯 Conversion Improvements
1. Stronger CTA interaction

Add visual feedback:

button glow pulse
slight scale on press
2. Click overlay usage

Use:
👉 ad-click-overlay.png

Animate:

subtle “tap here” cue after ~5 seconds
3. End screen emphasis

Last 2 seconds:

zoom CTA slightly
increase glow
📊 Optional (HIGH VALUE)
Add to Stats Page

New section:

“Ad Performance” (optional)

Show:

impressions
clicks
CTR %

This helps you:
👉 validate monetization performance

⚠️ UX Guardrails

Do NOT:

interrupt gameplay mid-hand
show ads repeatedly on navigation loops
block user unnecessarily

Ads should feel:
👉 intentional, not spammy

🎯 Acceptance Criteria
Ad impressions are tracked
Ad clicks are tracked
CTA opens DeerCreekRoad website
CTR can be calculated
Ad completion is tracked
Ad skip (if used) is tracked
Main mode ad frequency reduced (not every entry)
Daily mode remains once per day
No impact on gameplay stability
Optional stats panel shows ad metrics
📦 Deliverable Back

When complete, report:

files created
files modified
CTR calculation method
whether CTA opens correctly
ad frequency logic used
sample analytics output (impressions/clicks)
optional screenshot of ad stats panel
🚀 What This Unlocks

After this:

👉 You will know:

if users click your ads
how effective your funnel is
