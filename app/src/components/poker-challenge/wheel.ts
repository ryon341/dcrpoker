// ─── Bonus Wheel utility for DCR Poker Challenge ─────────────────────────────

// Weighted prize pool
const WHEEL_POOL: number[] = [
  50,                 // ×1
  20, 20,             // ×2
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, // ×10
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, // ×12
  5, 5, 5, 5, 5,     // ×5
  0,                  // ×1
  -10,                // ×1
];

export function getWheelSlots(): number[] {
  return [...WHEEL_POOL];
}

export function spinWheelResult(): number {
  const idx = Math.floor(Math.random() * WHEEL_POOL.length);
  return WHEEL_POOL[idx];
}
