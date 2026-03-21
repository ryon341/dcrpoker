// ─── DCR Poker Challenge — Animation Timing Constants (ms) ───────────────────

export const TIMING = {
  answerLock:      150,   // buttons lock immediately
  correctness:     300,   // correct/incorrect banner appears
  explanation:     550,   // explanation text fades in
  villainReveal:   800,   // villain cards flip face-up
  flop:           1050,   // flop (3 board cards) appear
  turn:           1250,   // turn card appears
  river:          1450,   // river card appears
  handOutcome:    1650,   // win/lose overlay
  scoreDelta:     1850,   // score delta popup floats
  continueEnable: 2050,   // Continue button activates
  wheelSpinMin:   2400,   // minimum wheel spin duration
} as const;
