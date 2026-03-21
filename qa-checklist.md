# DCR Poker — Pre-Launch QA Checklist

Run through every section below before submitting a release build. Check off each item. If any item fails, file it before shipping.

---

## 1. Gameplay

### Answer Flow
- [ ] Tap "Yes" — answer registers, buttons lock immediately
- [ ] Tap "No" — answer registers, buttons lock immediately
- [ ] Double-tapping a button does not double-score
- [ ] After answering, correctness banner appears at the right phase
- [ ] Explanation text appears after correctness banner
- [ ] Villain hand reveals after explanation
- [ ] Flop → Turn → River reveal in correct staged sequence
- [ ] Score delta pop appears with correct +/− value
- [ ] Continue button appears only after all reveal phases complete
- [ ] Tapping Continue before it's enabled does nothing

### Scoring
- [ ] Correct + Win: +13 points
- [ ] Correct + Lose: +7 points
- [ ] Incorrect + Win: −5 points
- [ ] Incorrect + Lose: −10 points
- [ ] Score displayed in header updates correctly after each hand
- [ ] Score delta pop shows the same value as the actual score change

### Wheel
- [ ] Wheel triggers after every 15th completed hand
- [ ] Wheel does not trigger during an active level-complete
- [ ] Spinning the wheel awards correct points
- [ ] Score delta pop appears for wheel result
- [ ] Wheel dismisses and gameplay resumes normally

### Level Progression
- [ ] Progress bar fills as score increases
- [ ] Level Complete modal appears when score ≥ required threshold
- [ ] Advancing level resets score, resets challenge history, increments level counter
- [ ] New title badge appears at unlock levels
- [ ] Correct `pointsRequired` value displayed for each level
- [ ] Level 5 → 6 triggers login gate for guests (not for logged-in users)

### Level 6 Login Gate
- [ ] Attempting Level 6 as guest shows Login Gate modal
- [ ] "Log In" button routes to auth flow with return target set
- [ ] After login, user lands back at challenge screen at Level 6
- [ ] Progress carried over from guest session after login
- [ ] If already at Level 5 as guest, gate fires on "Advance Level" — not before

---

## 2. Auth

### Guest Play
- [ ] App loads in guest mode (no login) and is playable through Level 5
- [ ] Guest progress saves to local storage between sessions
- [ ] Refreshing the page restores guest progress (level, score, history)

### Login / Register
- [ ] Login flow completes and redirects to challenge screen
- [ ] Register flow completes and redirects to challenge screen
- [ ] Invalid credentials show appropriate error
- [ ] Post-auth return message ("Progress transferred. Level 6 unlocked.") appears when guest migrates

### Guest → Auth Migration
- [ ] Logging in after guest play migrates guest progress to user account
- [ ] Backend saves the migrated progress
- [ ] Guest local storage is cleared after migration
- [ ] Progress visible in stats after migration

### Backend Progress Restore
- [ ] Logging in on a new device/browser restores saved backend progress
- [ ] Level, score, stats, and challenge history all restore correctly
- [ ] If backend is unreachable, local fallback is used

### Offline Fallback
- [ ] With no internet: guest play works (local only)
- [ ] With no internet: logged-in user falls back to local progress load

---

## 3. Daily Challenge

### Challenge Generation
- [ ] Daily challenge is generated from today's calendar date (seeded)
- [ ] Same challenge on same calendar date across sessions/devices
- [ ] Challenge contains exactly 5 hands
- [ ] Hands are valid poker scenarios (no null cards, no errors)

### Resume
- [ ] Closing mid-daily and reopening resumes at the correct hand index
- [ ] Completion state preserved across page reloads
- [ ] HandIndex does not reset to 0 on return visit same day

### Completion
- [ ] After hand 5: Results modal appears
- [ ] Results modal shows correct score and outcome per hand
- [ ] Daily streak increments by 1 on completion
- [ ] Badge label updates if a streak milestone is hit

### Same-Day Lockout
- [ ] After completing daily: DailyChallengeCard shows "Come back tomorrow"
- [ ] Attempting to replay same day does not allow re-entry
- [ ] Lockout resets at midnight (next calendar day restores the card)

### Streak Counting
- [ ] First completion starts streak at 1
- [ ] Consecutive days increment streak
- [ ] Missing a day resets streak to 0 (or to 1 if completed again)
- [ ] Best streak persists and does not decrease

---

## 4. Ads

### Trigger Timing (Main Mode)
- [ ] First ad triggers on correct session count (every 3rd new session)
- [ ] Does not fire on the very first session ever
- [ ] Cooldown respected — no double-showing within same session

### Trigger Timing (Daily Mode)
- [ ] Daily ad fires when appropriate (same-calendar-day logic)
- [ ] Does not fire on every daily interaction — only once per calendar day

### Ad Display
- [ ] Loading phase shows for ~2s before promo phase
- [ ] Promo phase transitions at correct time
- [ ] Ending phase transitions at correct time
- [ ] Countdown timer shows correct decreasing integer seconds
- [ ] Progress bar animates smoothly across full ad duration
- [ ] Continue button appears only after full duration

### CTA
- [ ] Tapping CTA (BuildYourCustomTable card) opens browser to DeerCreekRoad.com
- [ ] URL opens in new tab / external browser, does not replace app
- [ ] CTA works in both promo phase and ending phase

### Tracking
- [ ] Impression logged on ad open
- [ ] Click logged when CTA is tapped
- [ ] Completion logged when "Continue" is tapped or auto-completes
- [ ] Skip logged when skip path is triggered
- [ ] Ad Stats panel in Stats page reflects accumulated values
- [ ] CTR % calculated correctly

---

## 5. Stats

### Dashboard Accuracy
- [ ] Hands Played count matches actual sessions
- [ ] Correct count matches known answers during testing
- [ ] Incorrect count is consistent
- [ ] Accuracy % = (correct / hands played) × 100, rounded
- [ ] Win Rate % = (wins / (wins + losses)) × 100, rounded
- [ ] Highest Level Reached updates when a new level is reached
- [ ] Best Streak persists and matches streak log

### Title Display
- [ ] Current title on stats page matches title shown in challenge header
- [ ] Level chip shows correct level number
- [ ] "Performance Dashboard" subtitle appears

### Insight Lines
- [ ] At least 1 insight line appears when hasData is true
- [ ] Insights reflect actual stat values (no placeholder copy)
- [ ] Correct: 0 hands → no-data card shown, not broken layout

### Settings Toggles (Sound + Haptics)
- [ ] Sound toggle persists across sessions
- [ ] Haptics toggle persists across sessions
- [ ] Toggling sound off silences all in-game audio
- [ ] Toggling haptics off removes vibration feedback

### Ad Performance Section
- [ ] Impressions, Clicks, Completions, CTR displayed
- [ ] All values match what trackAdEvent has stored
- [ ] Section is hidden if no analytics yet (or shows zeros)

---

## 6. Performance

### Timer Cleanup
- [ ] Navigating away from challenge mid-reveal does not leave orphaned timers
- [ ] Returning to challenge screen after back navigation works cleanly
- [ ] No "state update on unmounted component" errors in console

### Render Performance
- [ ] No visible flash or white frame during page load
- [ ] Challenge screen does not re-render visually during stable state
- [ ] Ad countdown does not cause obvious UI jank

### Mobile Responsiveness
- [ ] All screens usable at 375px wide (iPhone SE / small Android)
- [ ] Cards and hand displays are not clipped at 390px (iPhone 14)
- [ ] Stats dashboard scrolls correctly on mobile
- [ ] All buttons have adequate tap targets (44 × 44px minimum)
- [ ] No horizontal overflow on any screen

### Load States
- [ ] Challenge screen shows nothing (not broken) while progress restores
- [ ] Stats page shows "Loading…" while progress loads
- [ ] Daily card shows loading state before meta resolves

---

*QA version: 1.0 — pre-launch build.*
