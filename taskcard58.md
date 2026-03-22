TC058 — Backend Persistence + Cross-Device Resume
Goal

Replace AsyncStorage with a real backend-backed persistence layer so:

users don’t lose progress
progress syncs across devices
guest → account upgrade keeps progress
you’re ready for scale
Architecture Decision (important)

We keep your current system intact and layer backend on top.

👉 Strategy: Hybrid persistence

Load from backend if logged in
Fallback to local storage if offline
Sync local → backend when possible
Tech Stack (recommended for your setup)

Given your current projects:

Backend: Node.js (SharpNote-style)
DB: MariaDB / PostgreSQL
Auth: existing auth system (reuse if possible)
Backend API
1. Save Progress

POST /api/poker/progress

{
  "userId": "123",
  "progress": {
    "level": 8,
    "score": 420,
    "handsCompleted": 37,
    "challengeHistory": ["b01","b07"],
    "stats": { ... },
    "updatedAt": "2026-03-21T12:00:00Z"
  }
}
2. Load Progress

GET /api/poker/progress/:userId

Response:

{
  "progress": { ... }
}
3. Daily Progress

POST /api/poker/daily
GET /api/poker/daily/:userId

Database Schema
Table: poker_progress
CREATE TABLE poker_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  progress JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id)
);
Table: poker_daily_progress
CREATE TABLE poker_daily_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  daily_id VARCHAR(16) NOT NULL,
  progress JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id, daily_id)
);
Frontend Changes
1. Update usePokerProgress.ts

Add:

const isLoggedIn = !!user?.id;
2. Load Logic

Replace:

loadGuestProgress()

With:

if (isLoggedIn) {
  try {
    const res = await fetch(`/api/poker/progress/${user.id}`);
    const data = await res.json();
    return data.progress;
  } catch {
    return loadUserProgress(user.id); // fallback
  }
} else {
  return loadGuestProgress();
}
3. Save Logic
if (isLoggedIn) {
  fetch('/api/poker/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      progress
    })
  });

  saveUserProgress(user.id, progress); // local backup
} else {
  saveGuestProgress(progress);
}
Guest → User Migration (CRITICAL)

When user logs in:

const guest = loadGuestProgress();

if (guest) {
  await fetch('/api/poker/progress', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.id,
      progress: guest
    })
  });

  clearGuestProgress();
}
Sync Strategy
When to sync:
after each hand (debounced)
after level up
after wheel spin
after daily completion
Conflict Handling

Simple rule:

👉 Latest updatedAt wins

Backend:

IF incoming.updatedAt > existing.updatedAt THEN overwrite
Daily Mode Integration

Mirror same pattern:

load from /api/poker/daily/:userId
save to /api/poker/daily

Keep it separate from main progress.

Acceptance Criteria
Logged-in users load progress from backend
Progress persists across devices
Guest progress upgrades to account correctly
Offline fallback still works
No crashes if backend fails
Daily progress also syncs
No change to game behavior
Deliverable Back
backend routes created
DB tables created
frontend integration points updated
guest → user migration tested
test:
play on device A → continue on device B