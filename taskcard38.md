TC038 — Full App QA & Critical Path Verification
🎯 Objective

Systematically validate that the entire DCR Poker app works end-to-end before release.

This taskcard ensures:

no broken flows

no dead screens

no logic bugs in core gameplay loop

confidence to deploy

🔥 Scope (what we are testing)

We are validating the full user lifecycle:

Signup → Create Game → Invite → RSVP → Manage → Monetization

🧪 PART 1 — AUTH FLOW
Test Cases
1. Login

 user can log in

 invalid login shows error

 session persists on refresh

2. Logout

 logout works

 user redirected correctly

 protected routes blocked after logout

3. Route Protection

 cannot access app pages without login

 no redirect loops

🎮 PART 2 — GAME CREATION FLOW (CRITICAL PATH)
Test Cases
4. Create Game

 create game form loads

 all required fields validated

 game saves successfully

 game appears in list

5. Edit Game

 edit works

 changes persist

 no duplicate entries

👥 PART 3 — INVITES + RSVP SYSTEM
Test Cases
6. Invite Players

 can add players

 invites created

 no duplicate invites

7. RSVP Flow (CRITICAL)

Test via SMS or manual:

 YES → added to game

 NO → removed

 WAIT → added to waitlist

8. Seat Limits

 max players enforced

 overflow goes to waitlist

 waitlist order maintained

9. Host View Updates

 host sees RSVP updates live or on refresh

 counts update correctly

📩 PART 4 — MESSAGING SYSTEM
Test Cases
10. SMS Send

 outbound SMS works

 correct message format

11. SMS Response Handling

 inbound messages parsed

 YES/NO/WAIT handled correctly

 unknown responses handled safely

💰 PART 5 — MONETIZATION
Test Cases
12. PayPal Flow

 user can subscribe

 payment completes

 account upgraded

13. Feature Gating

 free vs paid features enforced

 no access leaks

📚 PART 6 — TRAINING + AUDIOBOOKS
Test Cases
14. Training Page

 loads correctly

 no blank sections

15. Audiobook Grid

 all 10 books display

 images load

 no broken assets

16. Affiliate Links

 all buttons open Amazon

 correct tag present

🧮 PART 7 — TOOLS
Test Cases
17. Poker Tools Page

 loads clean

 tools accessible

18. Chip Calculator (if implemented)

 inputs work

 outputs make sense

 no crashes

🧭 PART 8 — NAVIGATION
Test Cases
19. Top Navigation

 all links work

 active state visible

 no dead routes

20. Internal Links

 pages link correctly

 no broken flows

📱 PART 9 — MOBILE PASS
Test Cases
21. Layout

 no overflow

 grids stack correctly

22. Usability

 buttons tappable

 text readable

 modals usable

⚠️ PART 10 — ERROR + EDGE CASES
Test Cases
23. Empty States

 no games → shows message

 no invites → shows message

24. Bad Input

 invalid forms handled

 no crashes

🛠 PART 11 — DEV CHECKS
25. Console

 no major errors

 warnings minimal

26. Network

 no failing API calls

 correct responses

📊 OUTPUT REQUIRED FROM VSCODE

After running this taskcard, return:

1. PASS / FAIL LIST

Example:

Auth: PASS
Game Creation: PASS
RSVP: FAIL (waitlist bug)
Payments: PASS
2. BUG LIST (CRITICAL ONLY)

Each bug must include:

description

steps to reproduce

severity (HIGH / MED / LOW)

3. FIXES APPLIED (if any)
🚨 ACCEPTANCE CRITERIA

This taskcard is complete when:

all critical flows PASS

no HIGH severity bugs remain

app can be used end-to-end without breaking

🔒 OUT OF SCOPE

Do NOT:

add features

redesign UI

optimize performance heavily

refactor architecture

This is strictly validation.

🔥 WHY THIS IS THE RIGHT NEXT STEP

You are past build phase.

If you skip this:

bugs will hit users

trust drops immediately

monetization suffers

If you do this:

you launch clean

you control first impressions

you avoid chaos

🚀 AFTER TC038

Next cards will be:

👉 TC039 — Bug Fix Sweep (from QA results)
👉 TC040 — Production Deploy (Vultr)