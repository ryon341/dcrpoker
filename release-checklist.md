# DCR Poker — Release-Day Checklist

Work through this list top to bottom on launch day. Each section has a hard-stop check — do not proceed until it passes.

---

## Pre-Build Verification

- [ ] All QA checklist items checked off (`qa-checklist.md`)
- [ ] No open P0/P1 bugs in the issue tracker
- [ ] `app.json` version is correct (`1.0.0` for initial release; increment for updates)
- [ ] `app.json` name is `DCR Poker`
- [ ] `app.json` slug is `dcrpoker`
- [ ] Icon asset (`assets/icon.png`) is the finalized version, not a placeholder
- [ ] Splash asset is the finalized version
- [ ] `ad-brand-placeholder.png` replaced with actual DCR brand asset if available

---

## Build Verification

- [ ] Run `npm run build` locally — build completes with 0 errors
- [ ] Review bundle output size (expect ~1.8MB JS bundle for web)
- [ ] Open `dist/index.html` locally and confirm the app loads
- [ ] No TypeScript errors — check `tsc --noEmit` output
- [ ] No console errors on first load in browser dev tools
- [ ] No 404s for any asset (images, fonts) in network tab

---

## Environment Checks

- [ ] Server is running (`root@216.155.139.162`)
- [ ] `/var/www/dcrpoker` is serving the correct `dist/` output
- [ ] HTTPS/TLS certificate is valid and not expiring within 30 days
- [ ] Custom domain (if applicable) resolves correctly
- [ ] Environment variables / API URLs point to production, not staging
- [ ] Database connection is live (test a backend call manually)
- [ ] DB migrations are fully applied — no pending migrations

---

## Backend Verification

- [ ] Auth register endpoint responds (`POST /auth/register` — expect 200/201)
- [ ] Auth login endpoint responds (`POST /auth/login` — expect 200 + token)
- [ ] Progress load endpoint responds for authenticated user
- [ ] Progress save endpoint accepts and persists a payload
- [ ] Backend error responses return clean JSON (not raw stack traces)
- [ ] CORS configured to allow the production app domain

---

## Auth Smoke Test

- [ ] Register a fresh account — succeeds, lands on challenge screen
- [ ] Log out, log in again — progress restored correctly
- [ ] Guest play to Level 3, then register — progress migrated, Level 6 path works

---

## Gameplay Smoke Test

- [ ] Answer 3 hands as guest — score updates correctly
- [ ] Complete daily challenge — streak increments
- [ ] Trigger wheel (15 hands) — wheel fires and dismisses correctly
- [ ] Reach Level Complete — modal appears, advance to next level
- [ ] Ad fires at correct session threshold — confirmation it opens, CTA links work

---

## Stats Smoke Test

- [ ] Navigate to stats page — dashboard renders without errors
- [ ] Accuracy and win rate values are non-zero after smoke test hands
- [ ] Ad performance section shows impressions from smoke test ad

---

## Analytics Verification

- [ ] Ad impression event fires and appears in ad analytics storage
- [ ] Ad click event fires on CTA tap
- [ ] Ad completion event fires on Continue

---

## Store / Listing Assets Verification

- [ ] App name copy: `DCR Poker` — finalized
- [ ] Tagline: `Train smarter. Play better.` — confirmed
- [ ] Short description (1 sentence) — written and approved
- [ ] Long description — written and approved (see `launch-package.md`)
- [ ] Feature bullets (6–10) — written and approved
- [ ] Screenshots 1–5 reviewed — no dev artifacts, no placeholder UI visible
- [ ] At least 3 screenshots are strong quality; weak ones flagged for regeneration
- [ ] App icon is final, correct dimensions for each target platform

---

## Final Go / No-Go

| Check | Status |
|---|---|
| Build is clean | ☐ |
| Server is live | ☐ |
| Auth works end-to-end | ☐ |
| Progress save/restore works | ☐ |
| Daily challenge works | ☐ |
| Ad triggers and CTA opens | ☐ |
| Stats page renders correctly | ☐ |
| Store copy is finalized | ☐ |
| Screenshots are finalized | ☐ |

**All rows must be checked before release.**

---

*Release checklist version: 1.0*
