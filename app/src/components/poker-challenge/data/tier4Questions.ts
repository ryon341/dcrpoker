import type { ChallengeQuestion } from '../challengeQuestionTypes';

const tier4QuestionsRaw: ChallengeQuestion[] = [
  {
    "id": "t4_new_001",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in UTG holding JJ with 60BB effective. What is the best action?",
    "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "UTG",
      "squeeze_spot",
      "JJ"
    ],
    "difficultyScore": 32
  },
  {
    "id": "t4_new_002",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "One player limps before you. You are in UTG with KK and 100BB effective. What is the best action?",
    "explanation": "KK is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "UTG",
      "iso_raise_spot",
      "KK"
    ],
    "difficultyScore": 29
  },
  {
    "id": "t4_new_003",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from HJ. BB 3-bets. You hold AQo with 100BB effective. What is the best action?",
    "explanation": "AQo is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "facing_3bet",
      "AQo"
    ],
    "difficultyScore": 33
  },
  {
    "id": "t4_new_004",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in HJ holding TT with 40BB effective. What is the best action?",
    "explanation": "TT can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "TT"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_carry_001",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from HJ. BTN 3-bets. You hold KQs with 40BB effective. What is the best action?",
    "explanation": "KQs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
    "correctAction": "call",
    "heroPosition": "UTG",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "UTG",
      "facing_3bet",
      "KQs",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 60
  },
  {
    "id": "t4_new_005",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. SB 3-bets. You hold QQ with 30BB effective. What is the best action?",
    "explanation": "QQ is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "QQ"
    ],
    "difficultyScore": 35
  },
  {
    "id": "t4_new_006",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, CO calls, and action is on you in MP holding JJ with 20BB effective. What is the best action?",
    "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "JJ"
    ],
    "difficultyScore": 30
  },
  {
    "id": "t4_new_007",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, CO calls, and action is on you in MP holding QQ with 100BB effective. What is the best action?",
    "explanation": "QQ is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "QQ"
    ],
    "difficultyScore": 28
  },
  {
    "id": "t4_new_008",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. BB 3-bets. You hold TT with 60BB effective. What is the best action?",
    "explanation": "TT is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "CO",
      "facing_3bet",
      "TT"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_carry_002",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "ev",
    "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_009",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 87s and 40BB effective. What is the best action?",
    "explanation": "87s can continue in this simplified blind-versus-blind spot due to playability.",
    "correctAction": "call",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "blind_vs_blind",
      "87s"
    ],
    "difficultyScore": 33
  },
  {
    "id": "t4_new_010",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "UTG opens, BTN calls, and action is on you in MP holding AKs with 60BB effective. What is the best action?",
    "explanation": "AKs is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "AKs"
    ],
    "difficultyScore": 29
  },
  {
    "id": "t4_new_011",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AQo with 100BB effective. What is the best action?",
    "explanation": "AQo is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "UTG",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "UTG",
      "facing_3bet",
      "AQo"
    ],
    "difficultyScore": 28
  },
  {
    "id": "t4_new_012",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "One player limps before you. You are in MP with AA and 100BB effective. What is the best action?",
    "explanation": "AA is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "AA"
    ],
    "difficultyScore": 32
  },
  {
    "id": "t4_carry_003",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in BTN holding AA with 60BB effective. What is the best action?",
    "explanation": "AA is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "AA",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 81
  },
  {
    "id": "t4_new_013",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You are in BB with JJ. Effective stack is 60BB. Action folds to you. What is the best action?",
    "explanation": "JJ is strong enough to open from BB at 60BB effective.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BB",
      "folds_to_you",
      "JJ",
      "open_spot"
    ],
    "difficultyScore": 29
  },
  {
    "id": "t4_new_014",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You are in HJ with QQ. Effective stack is 25BB. Action folds to you. What is the best action?",
    "explanation": "QQ is strong enough to open from HJ at 25BB effective.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "HJ",
      "folds_to_you",
      "QQ",
      "open_spot"
    ],
    "difficultyScore": 31
  },
  {
    "id": "t4_new_015",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold TT with 60BB effective. What is the best action?",
    "explanation": "TT is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "TT"
    ],
    "difficultyScore": 28
  },
  {
    "id": "t4_new_016",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in BB holding AQs with 50BB effective. What is the best action?",
    "explanation": "AQs is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BB",
      "squeeze_spot",
      "AQs"
    ],
    "difficultyScore": 37
  },
  {
    "id": "t4_carry_004",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "10",
      "8",
      "11",
      "12"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_new_017",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in HJ with AA. Effective stack is 40BB. What is the best action?",
    "explanation": "AA is strong enough to reraise for value against an open.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "HJ",
      "facing_open_raise",
      "AA",
      "facing_open"
    ],
    "difficultyScore": 35
  },
  {
    "id": "t4_new_018",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You are in SB with KK. Effective stack is 25BB. Action folds to you. What is the best action?",
    "explanation": "KK is strong enough to open from SB at 25BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "KK",
      "open_spot"
    ],
    "difficultyScore": 33
  },
  {
    "id": "t4_new_019",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, CO calls, and action is on you in UTG holding AQo with 100BB effective. What is the best action?",
    "explanation": "AQo is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "UTG",
      "squeeze_spot",
      "AQo"
    ],
    "difficultyScore": 31
  },
  {
    "id": "t4_new_020",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "Two players limp before you. You are in MP with 77 and 30BB effective. What is the best action?",
    "explanation": "77 is too weak or too marginal to continue profitably from MP in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "77"
    ],
    "difficultyScore": 28
  },
  {
    "id": "t4_carry_005",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You are in BB with QQ. Effective stack is 60BB. Action folds to you. What is the best action?",
    "explanation": "QQ is strong enough to open from BB, especially at 60BB effective.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BB",
      "folds_to_you",
      "QQ",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_021",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "MP opens, BTN calls, and action is on you in MP holding AJs with 75BB effective. What is the best action?",
    "explanation": "AJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "MP",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "AJs"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_new_022",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in BTN holding AJs with 60BB effective. What is the best action?",
    "explanation": "AJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "AJs"
    ],
    "difficultyScore": 35
  },
  {
    "id": "t4_new_023",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "Action folds to you in the small blind. You hold AJs with 100BB effective. What is the best action?",
    "explanation": "AJs is strong enough to pressure the big blind from the small blind.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BTN",
      "blind_vs_blind",
      "AJs"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_new_024",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in SB holding AQo with 25BB effective. What is the best action?",
    "explanation": "AQo is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "AQo"
    ],
    "difficultyScore": 31
  },
  {
    "id": "t4_carry_006",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "15",
      "14",
      "12",
      "9"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 97
  },
  {
    "id": "t4_new_025",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold TT with 60BB effective. What is the best action?",
    "explanation": "TT is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "facing_3bet",
      "TT"
    ],
    "difficultyScore": 32
  },
  {
    "id": "t4_new_026",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "Two players limp before you. You are in UTG with JJ and 25BB effective. What is the best action?",
    "explanation": "JJ is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "UTG",
      "iso_raise_spot",
      "JJ"
    ],
    "difficultyScore": 34
  },
  {
    "id": "t4_new_027",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from CO. SB 3-bets. You hold TT with 100BB effective. What is the best action?",
    "explanation": "TT is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "SB",
      "facing_3bet",
      "TT"
    ],
    "difficultyScore": 32
  },
  {
    "id": "t4_new_028",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in HJ holding AJs with 20BB effective. What is the best action?",
    "explanation": "AJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "AJs"
    ],
    "difficultyScore": 37
  },
  {
    "id": "t4_carry_007",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QQ and 20BB effective. What is the best action?",
    "explanation": "QQ is strong enough to attack or continue aggressively in a blind battle.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "MP",
      "blind_vs_blind",
      "QQ",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 80
  },
  {
    "id": "t4_new_029",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AA and 75BB effective. What is the best action?",
    "explanation": "AA is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BTN",
      "blind_vs_blind",
      "AA"
    ],
    "difficultyScore": 31
  },
  {
    "id": "t4_new_030",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in SB holding AJs with 60BB effective. What is the best action?",
    "explanation": "AJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "AJs"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_new_031",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KK and 20BB effective. What is the best action?",
    "explanation": "KK is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "SB",
      "blind_vs_blind",
      "KK"
    ],
    "difficultyScore": 37
  },
  {
    "id": "t4_new_032",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "One player limps before you. You are in MP with QJs and 40BB effective. What is the best action?",
    "explanation": "QJs is too weak or too marginal to continue profitably from MP in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "QJs"
    ],
    "difficultyScore": 34
  },
  {
    "id": "t4_carry_008",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from HJ. BTN 3-bets. You hold KK with 50BB effective. What is the best action?",
    "explanation": "KK is strong enough to continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "KK",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 33
  },
  {
    "id": "t4_new_033",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "CO opens to 2.5BB. You are in CO with JJ. Effective stack is 25BB. What is the best action?",
    "explanation": "JJ is strong enough to reraise for value against an open.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "CO",
      "facing_open_raise",
      "JJ",
      "facing_open"
    ],
    "difficultyScore": 34
  },
  {
    "id": "t4_new_034",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from CO. BTN 3-bets. You hold KK with 30BB effective. What is the best action?",
    "explanation": "KK is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "KK"
    ],
    "difficultyScore": 35
  },
  {
    "id": "t4_new_035",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from BTN. BB 3-bets. You hold AJs with 50BB effective. What is the best action?",
    "explanation": "AJs is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "SB",
      "facing_3bet",
      "AJs"
    ],
    "difficultyScore": 36
  },
  {
    "id": "t4_new_036",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You open from HJ. SB 3-bets. You hold 99 with 60BB effective. What is the best action?",
    "explanation": "99 is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "facing_3bet",
      "99"
    ],
    "difficultyScore": 34
  },
  {
    "id": "t4_carry_009",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "HJ opens to 3BB. You are in HJ with QQ. Effective stack is 20BB. What is the best action?",
    "explanation": "QQ is premium and should usually reraise for value against an open.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "HJ",
      "facing_open_raise",
      "QQ",
      "facing_open",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_037",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "One player limps before you. You are in BTN with KJs and 60BB effective. What is the best action?",
    "explanation": "KJs is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BTN",
      "iso_raise_spot",
      "KJs"
    ],
    "difficultyScore": 32
  },
  {
    "id": "t4_new_038",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "You are in BTN with AA. Effective stack is 50BB. Action folds to you. What is the best action?",
    "explanation": "AA is strong enough to open from BTN at 50BB effective.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BTN",
      "folds_to_you",
      "AA",
      "open_spot"
    ],
    "difficultyScore": 34
  },
  {
    "id": "t4_new_039",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "One player limps before you. You are in CO with 99 and 40BB effective. What is the best action?",
    "explanation": "99 is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "CO",
      "iso_raise_spot",
      "99"
    ],
    "difficultyScore": 30
  },
  {
    "id": "t4_new_040",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "MP opens, HJ calls, and action is on you in CO holding KQs with 100BB effective. What is the best action?",
    "explanation": "KQs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "CO",
      "squeeze_spot",
      "KQs"
    ],
    "difficultyScore": 37
  },
  {
    "id": "t4_carry_010",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 1,
    "category": "action",
    "prompt": "MP makes a minimum raise. You are in BB with 88. Effective stack is 100BB. What is the best action?",
    "explanation": "88 is too marginal in this spot and should usually be folded.",
    "correctAction": "fold",
    "heroPosition": "BB",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BB",
      "facing_min_raise",
      "88",
      "facing_raise",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_041",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, BTN calls, and action is on you in SB holding QJs with 30BB effective. What is the best action?",
    "explanation": "QJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "QJs"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_042",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "One player limps before you. You are in CO with JTs and 20BB effective. What is the best action?",
    "explanation": "JTs is playable, but over-isolating too wide can be a mistake in this simplified model.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "CO",
      "iso_raise_spot",
      "JTs"
    ],
    "difficultyScore": 50
  },
  {
    "id": "t4_new_043",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in SB holding AQs with 25BB effective. What is the best action?",
    "explanation": "AQs is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "AQs"
    ],
    "difficultyScore": 49
  },
  {
    "id": "t4_new_044",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "One player limps before you. You are in MP with QJs and 100BB effective. What is the best action?",
    "explanation": "QJs is too weak or too marginal to continue profitably from MP in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "QJs"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_carry_011",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, BTN calls, and action is on you in MP holding KQs with 40BB effective. What is the best action?",
    "explanation": "KQs can continue profitably, but a call is the simpler recommended option here.",
    "correctAction": "call",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "KQs",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_045",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, BTN calls, and action is on you in SB holding KQs with 60BB effective. What is the best action?",
    "explanation": "KQs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "KQs"
    ],
    "difficultyScore": 51
  },
  {
    "id": "t4_new_046",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with TT and 75BB effective. What is the best action?",
    "explanation": "TT is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BB",
      "blind_vs_blind",
      "TT"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_047",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in CO with KQs. Effective stack is 40BB. Action folds to you. What is the best action?",
    "explanation": "KQs is strong enough to open from CO at 40BB effective.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "CO",
      "folds_to_you",
      "KQs",
      "open_spot"
    ],
    "difficultyScore": 50
  },
  {
    "id": "t4_new_048",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in MP with 77. Effective stack is 25BB. Action folds to you. What is the best action?",
    "explanation": "77 is strong enough to open from MP at 25BB effective.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "MP",
      "folds_to_you",
      "77",
      "open_spot"
    ],
    "difficultyScore": 48
  },
  {
    "id": "t4_carry_012",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens to 2.5BB. You are in BTN with AKs. Effective stack is 30BB. What is the best action?",
    "explanation": "AKs is strong enough to reraise for value against an open.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BTN",
      "facing_open_raise",
      "AKs",
      "facing_open",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 43
  },
  {
    "id": "t4_new_049",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in CO holding JTs with 75BB effective. What is the best action?",
    "explanation": "JTs is too marginal for this squeeze configuration in a simplified model.",
    "correctAction": "fold",
    "heroPosition": "CO",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "CO",
      "squeeze_spot",
      "JTs"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_new_050",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You open from CO. BTN 3-bets. You hold 88 with 60BB effective. What is the best action?",
    "explanation": "88 is too weak to continue profitably against a 3-bet here.",
    "correctAction": "fold",
    "heroPosition": "BB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BB",
      "facing_3bet",
      "88"
    ],
    "difficultyScore": 52
  },
  {
    "id": "t4_new_051",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in CO with 99. Effective stack is 75BB. What is the best action?",
    "explanation": "99 is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "CO",
      "facing_open_raise",
      "99",
      "facing_open"
    ],
    "difficultyScore": 54
  },
  {
    "id": "t4_new_052",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in HJ holding KK with 40BB effective. What is the best action?",
    "explanation": "KK is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "KK"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_carry_013",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ makes a minimum raise. You are in BTN with JJ. Effective stack is 100BB. What is the best action?",
    "explanation": "JJ plays well against a minimum raise and is often a profitable continue as a call.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BTN",
      "facing_min_raise",
      "JJ",
      "facing_raise",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_053",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in SB with AQo. Effective stack is 60BB. Action folds to you. What is the best action?",
    "explanation": "AQo is strong enough to open from SB at 60BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "AQo",
      "open_spot"
    ],
    "difficultyScore": 52
  },
  {
    "id": "t4_new_054",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in CO holding 88 with 60BB effective. What is the best action?",
    "explanation": "88 can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "CO",
      "squeeze_spot",
      "88"
    ],
    "difficultyScore": 51
  },
  {
    "id": "t4_new_055",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, CO calls, and action is on you in BTN holding JJ with 100BB effective. What is the best action?",
    "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "JJ"
    ],
    "difficultyScore": 54
  },
  {
    "id": "t4_new_056",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in MP holding AA with 100BB effective. What is the best action?",
    "explanation": "AA is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "AA"
    ],
    "difficultyScore": 49
  },
  {
    "id": "t4_carry_014",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "ev",
    "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_057",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in BB with 88. Effective stack is 50BB. What is the best action?",
    "explanation": "88 is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "BB",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BB",
      "facing_open_raise",
      "88",
      "facing_open"
    ],
    "difficultyScore": 51
  },
  {
    "id": "t4_new_058",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with JJ and 60BB effective. What is the best action?",
    "explanation": "JJ is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "blind_vs_blind",
      "JJ"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_059",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in HJ holding 99 with 50BB effective. What is the best action?",
    "explanation": "99 can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "99"
    ],
    "difficultyScore": 52
  },
  {
    "id": "t4_new_060",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You open from CO. BB 3-bets. You hold AKo with 100BB effective. What is the best action?",
    "explanation": "AKo is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "MP",
      "facing_3bet",
      "AKo"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_carry_015",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in BB with ATs. Effective stack is 75BB. Action folds to you. What is the best action?",
    "explanation": "ATs is a profitable open from BB at 75BB effective.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BB",
      "folds_to_you",
      "ATs",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_new_061",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens, CO calls, and action is on you in HJ holding 88 with 50BB effective. What is the best action?",
    "explanation": "88 can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "88"
    ],
    "difficultyScore": 56
  },
  {
    "id": "t4_new_062",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in SB with AJs. Effective stack is 75BB. What is the best action?",
    "explanation": "AJs is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "AJs",
      "facing_open"
    ],
    "difficultyScore": 49
  },
  {
    "id": "t4_new_063",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in SB holding TT with 20BB effective. What is the best action?",
    "explanation": "TT can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "TT"
    ],
    "difficultyScore": 52
  },
  {
    "id": "t4_new_064",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "One player limps before you. You are in BB with JTs and 100BB effective. What is the best action?",
    "explanation": "JTs is too weak or too marginal to continue profitably from BB in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "BB",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BB",
      "iso_raise_spot",
      "JTs"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_carry_016",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in HJ with 99. Effective stack is 60BB. Action folds to you. What is the best action?",
    "explanation": "99 is a profitable open from HJ at 60BB effective.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "folds_to_you",
      "99",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_065",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "CO opens to 2.5BB. You are in MP with AQo. Effective stack is 40BB. What is the best action?",
    "explanation": "AQo is too marginal against an open from CO in this configuration.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "facing_open_raise",
      "AQo",
      "facing_open"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_066",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in UTG with 99. Effective stack is 25BB. What is the best action?",
    "explanation": "99 is too marginal against an open from UTG in this configuration.",
    "correctAction": "fold",
    "heroPosition": "UTG",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "UTG",
      "facing_open_raise",
      "99",
      "facing_open"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_067",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens to 2.5BB. You are in SB with 99. Effective stack is 75BB. What is the best action?",
    "explanation": "99 is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "99",
      "facing_open"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_068",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You open from CO. BB 3-bets. You hold JJ with 60BB effective. What is the best action?",
    "explanation": "JJ is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "CO",
      "facing_3bet",
      "JJ"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_carry_017",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "This draw type gives you 15 outs in this simplified training model.",
    "choices": [
      "14",
      "15",
      "12",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 99
  },
  {
    "id": "t4_new_069",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QJs and 60BB effective. What is the best action?",
    "explanation": "QJs is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "MP",
      "blind_vs_blind",
      "QJs"
    ],
    "difficultyScore": 49
  },
  {
    "id": "t4_new_070",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in SB with 77. Effective stack is 40BB. Action folds to you. What is the best action?",
    "explanation": "77 is strong enough to open from SB at 40BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "77",
      "open_spot"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_071",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens, BTN calls, and action is on you in HJ holding AQs with 60BB effective. What is the best action?",
    "explanation": "AQs is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "AQs"
    ],
    "difficultyScore": 48
  },
  {
    "id": "t4_new_072",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in BTN with 88. Effective stack is 20BB. What is the best action?",
    "explanation": "88 is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "BTN",
      "facing_open_raise",
      "88",
      "facing_open"
    ],
    "difficultyScore": 53
  },
  {
    "id": "t4_carry_018",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "15",
      "9",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_new_073",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AKo with 25BB effective. What is the best action?",
    "explanation": "AKo is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "UTG",
      "facing_3bet",
      "AKo"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_074",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens, BTN calls, and action is on you in MP holding JTs with 20BB effective. What is the best action?",
    "explanation": "JTs is too marginal for this squeeze configuration in a simplified model.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "JTs"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_075",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You open from BTN. SB 3-bets. You hold KK with 50BB effective. What is the best action?",
    "explanation": "KK is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "KK"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_076",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "You are in BTN with KJs. Effective stack is 30BB. Action folds to you. What is the best action?",
    "explanation": "KJs is strong enough to open from BTN at 30BB effective.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BTN",
      "folds_to_you",
      "KJs",
      "open_spot"
    ],
    "difficultyScore": 52
  },
  {
    "id": "t4_carry_019",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "12",
      "9",
      "10",
      "8"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_new_077",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens, HJ calls, and action is on you in CO holding KQs with 75BB effective. What is the best action?",
    "explanation": "KQs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "CO",
      "squeeze_spot",
      "KQs"
    ],
    "difficultyScore": 56
  },
  {
    "id": "t4_new_078",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in BTN with AQo. Effective stack is 40BB. What is the best action?",
    "explanation": "AQo is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "BTN",
      "facing_open_raise",
      "AQo",
      "facing_open"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_new_079",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "Two players limp before you. You are in MP with 77 and 25BB effective. What is the best action?",
    "explanation": "77 is too weak or too marginal to continue profitably from MP in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "77"
    ],
    "difficultyScore": 55
  },
  {
    "id": "t4_new_080",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "HJ opens to 2.5BB. You are in SB with KQs. Effective stack is 50BB. What is the best action?",
    "explanation": "KQs is good enough to continue, but not always strong enough to reraise in this simplified model.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "KQs",
      "facing_open"
    ],
    "difficultyScore": 57
  },
  {
    "id": "t4_carry_020",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 2,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in SB with KJs. Effective stack is 40BB. What is the best action?",
    "explanation": "KJs is not strong enough often enough versus an open from MP.",
    "correctAction": "fold",
    "heroPosition": "SB",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "KJs",
      "facing_open",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 77
  },
  {
    "id": "t4_new_081",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AQs with 60BB effective. What is the best action?",
    "explanation": "AQs is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "AQs"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_new_082",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in CO with KJs. Effective stack is 30BB. What is the best action?",
    "explanation": "KJs is too marginal against an open from UTG in this configuration.",
    "correctAction": "fold",
    "heroPosition": "CO",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "CO",
      "facing_open_raise",
      "KJs",
      "facing_open"
    ],
    "difficultyScore": 70
  },
  {
    "id": "t4_new_083",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "CO opens to 2.5BB. You are in SB with 77. Effective stack is 25BB. What is the best action?",
    "explanation": "77 is too marginal against an open from CO in this configuration.",
    "correctAction": "fold",
    "heroPosition": "SB",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "77",
      "facing_open"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_new_084",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from HJ. BTN 3-bets. You hold KK with 20BB effective. What is the best action?",
    "explanation": "KK is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "CO",
      "facing_3bet",
      "KK"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_carry_021",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "9",
      "14",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_085",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in CO with A9s. Effective stack is 100BB. Action folds to you. What is the best action?",
    "explanation": "A9s is strong enough to open from CO at 100BB effective.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "CO",
      "folds_to_you",
      "A9s",
      "open_spot"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_new_086",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "Action folds to you in the small blind. You hold 98s with 20BB effective. What is the best action?",
    "explanation": "98s is playable in this simplified blind-versus-blind model, but not always a mandatory raise.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "SB",
      "blind_vs_blind",
      "98s"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_new_087",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in UTG with KQo. Effective stack is 75BB. Action folds to you. What is the best action?",
    "explanation": "KQo is strong enough to open from UTG at 75BB effective.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "UTG",
      "folds_to_you",
      "KQo",
      "open_spot"
    ],
    "difficultyScore": 73
  },
  {
    "id": "t4_new_088",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "HJ opens, CO calls, and action is on you in MP holding AQo with 40BB effective. What is the best action?",
    "explanation": "AQo is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "AQo"
    ],
    "difficultyScore": 77
  },
  {
    "id": "t4_carry_022",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "HJ makes a minimum raise. You are in CO with AA. Effective stack is 40BB. What is the best action?",
    "explanation": "AA is strong enough to reraise for value versus a minimum open.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "CO",
      "facing_min_raise",
      "AA",
      "facing_raise",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_new_089",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens, BTN calls, and action is on you in SB holding AA with 40BB effective. What is the best action?",
    "explanation": "AA is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "SB",
      "squeeze_spot",
      "AA"
    ],
    "difficultyScore": 76
  },
  {
    "id": "t4_new_090",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 88 and 75BB effective. What is the best action?",
    "explanation": "88 is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "SB",
      "blind_vs_blind",
      "88"
    ],
    "difficultyScore": 77
  },
  {
    "id": "t4_new_091",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in UTG holding KK with 30BB effective. What is the best action?",
    "explanation": "KK is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "UTG",
      "squeeze_spot",
      "KK"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_new_092",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QJs and 100BB effective. What is the best action?",
    "explanation": "QJs is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "CO",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "CO",
      "blind_vs_blind",
      "QJs"
    ],
    "difficultyScore": 70
  },
  {
    "id": "t4_carry_023",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "12",
      "8",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 98
  },
  {
    "id": "t4_new_093",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from HJ. SB 3-bets. You hold AQs with 20BB effective. What is the best action?",
    "explanation": "AQs is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "CO",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "CO",
      "facing_3bet",
      "AQs"
    ],
    "difficultyScore": 71
  },
  {
    "id": "t4_new_094",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from CO. BB 3-bets. You hold KQs with 50BB effective. What is the best action?",
    "explanation": "KQs is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "BB",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BB",
      "facing_3bet",
      "KQs"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_new_095",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in BTN with A9s. Effective stack is 50BB. What is the best action?",
    "explanation": "A9s is too marginal against an open from UTG in this configuration.",
    "correctAction": "fold",
    "heroPosition": "BTN",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BTN",
      "facing_open_raise",
      "A9s",
      "facing_open"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_new_096",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in HJ holding KQs with 60BB effective. What is the best action?",
    "explanation": "KQs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "HJ",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "HJ",
      "squeeze_spot",
      "KQs"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_carry_024",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "BTN makes a minimum raise. You are in UTG with KQs. Effective stack is 30BB. What is the best action?",
    "explanation": "KQs plays well against a minimum raise and is often a profitable continue as a call.",
    "correctAction": "call",
    "heroPosition": "UTG",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "UTG",
      "facing_min_raise",
      "KQs",
      "facing_raise",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 63
  },
  {
    "id": "t4_new_097",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in BTN with KTs. Effective stack is 30BB. Action folds to you. What is the best action?",
    "explanation": "KTs is strong enough to open from BTN at 30BB effective.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BTN",
      "folds_to_you",
      "KTs",
      "open_spot"
    ],
    "difficultyScore": 72
  },
  {
    "id": "t4_new_098",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in BTN with AJo. Effective stack is 50BB. Action folds to you. What is the best action?",
    "explanation": "AJo is strong enough to open from BTN at 50BB effective.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 50,
    "tags": [
      "preflop",
      "BTN",
      "folds_to_you",
      "AJo",
      "open_spot"
    ],
    "difficultyScore": 72
  },
  {
    "id": "t4_new_099",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "MP opens to 2.5BB. You are in MP with KQo. Effective stack is 60BB. What is the best action?",
    "explanation": "KQo is too marginal against an open from MP in this configuration.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "MP",
      "facing_open_raise",
      "KQo",
      "facing_open"
    ],
    "difficultyScore": 71
  },
  {
    "id": "t4_new_100",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in SB with T9s. Effective stack is 100BB. Action folds to you. What is the best action?",
    "explanation": "T9s is strong enough to open from SB at 100BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "T9s",
      "open_spot"
    ],
    "difficultyScore": 76
  },
  {
    "id": "t4_carry_025",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "14",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_101",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from CO. BB 3-bets. You hold AA with 20BB effective. What is the best action?",
    "explanation": "AA is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "AA"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_new_102",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AA with 25BB effective. What is the best action?",
    "explanation": "AA is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "UTG",
      "facing_3bet",
      "AA"
    ],
    "difficultyScore": 77
  },
  {
    "id": "t4_new_103",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "Action folds to you in the small blind. You hold KK with 100BB effective. What is the best action?",
    "explanation": "KK is strong enough to pressure the big blind from the small blind.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "HJ",
      "blind_vs_blind",
      "KK"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_new_104",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "HJ opens to 2.5BB. You are in UTG with KJs. Effective stack is 100BB. What is the best action?",
    "explanation": "KJs is too marginal against an open from HJ in this configuration.",
    "correctAction": "fold",
    "heroPosition": "UTG",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "UTG",
      "facing_open_raise",
      "KJs",
      "facing_open"
    ],
    "difficultyScore": 76
  },
  {
    "id": "t4_carry_026",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "ev",
    "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.9% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_105",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "CO opens to 2.5BB. You are in SB with 77. Effective stack is 30BB. What is the best action?",
    "explanation": "77 is too marginal against an open from CO in this configuration.",
    "correctAction": "fold",
    "heroPosition": "SB",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "77",
      "facing_open"
    ],
    "difficultyScore": 68
  },
  {
    "id": "t4_new_106",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AQo with 60BB effective. What is the best action?",
    "explanation": "AQo is often strong enough to continue versus a 3-bet, but not always a mandatory 4-bet in this simplified system.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "facing_3bet",
      "AQo"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_new_107",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "MP opens, CO calls, and action is on you in UTG holding JJ with 20BB effective. What is the best action?",
    "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "UTG",
      "squeeze_spot",
      "JJ"
    ],
    "difficultyScore": 68
  },
  {
    "id": "t4_new_108",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "Two players limp before you. You are in MP with T9s and 30BB effective. What is the best action?",
    "explanation": "T9s is too weak or too marginal to continue profitably from MP in this iso-raise spot.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "T9s"
    ],
    "difficultyScore": 71
  },
  {
    "id": "t4_carry_027",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "ev",
    "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.9% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_109",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KQs and 75BB effective. What is the best action?",
    "explanation": "KQs is strong enough to continue aggressively in this blind battle.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BB",
      "blind_vs_blind",
      "KQs"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_new_110",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 98s and 40BB effective. What is the best action?",
    "explanation": "98s can continue in this simplified blind-versus-blind spot due to playability.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "SB",
      "blind_vs_blind",
      "98s"
    ],
    "difficultyScore": 74
  },
  {
    "id": "t4_new_111",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in CO with 77. Effective stack is 100BB. What is the best action?",
    "explanation": "77 is too marginal against an open from UTG in this configuration.",
    "correctAction": "fold",
    "heroPosition": "CO",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "CO",
      "facing_open_raise",
      "77",
      "facing_open"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_new_112",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "One player limps before you. You are in BTN with 88 and 25BB effective. What is the best action?",
    "explanation": "88 is playable, but over-isolating too wide can be a mistake in this simplified model.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "BTN",
      "iso_raise_spot",
      "88"
    ],
    "difficultyScore": 76
  },
  {
    "id": "t4_carry_028",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KQo and 30BB effective. What is the best action?",
    "explanation": "KQo is strong enough to attack or continue aggressively in a blind battle.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "MP",
      "blind_vs_blind",
      "KQo",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 63
  },
  {
    "id": "t4_new_113",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "One player limps before you. You are in MP with ATs and 25BB effective. What is the best action?",
    "explanation": "ATs is strong enough to isolate limpers and take the initiative.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "MP",
      "iso_raise_spot",
      "ATs"
    ],
    "difficultyScore": 76
  },
  {
    "id": "t4_new_114",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in BB with A9s. Effective stack is 25BB. Action folds to you. What is the best action?",
    "explanation": "A9s is strong enough to open from BB at 25BB effective.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "BB",
      "folds_to_you",
      "A9s",
      "open_spot"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_new_115",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "UTG opens to 2.5BB. You are in HJ with 77. Effective stack is 75BB. What is the best action?",
    "explanation": "77 is too marginal against an open from UTG in this configuration.",
    "correctAction": "fold",
    "heroPosition": "HJ",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "HJ",
      "facing_open_raise",
      "77",
      "facing_open"
    ],
    "difficultyScore": 71
  },
  {
    "id": "t4_new_116",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You open from CO. BTN 3-bets. You hold KK with 75BB effective. What is the best action?",
    "explanation": "KK is premium and should continue aggressively against a 3-bet.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "KK"
    ],
    "difficultyScore": 75
  },
  {
    "id": "t4_carry_029",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "12",
      "8",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 96
  },
  {
    "id": "t4_new_117",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in BTN holding AJs with 75BB effective. What is the best action?",
    "explanation": "AJs can continue profitably, but calling is the simpler recommended line here.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "AJs"
    ],
    "difficultyScore": 73
  },
  {
    "id": "t4_new_118",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in UTG with KQo. Effective stack is 30BB. Action folds to you. What is the best action?",
    "explanation": "KQo is strong enough to open from UTG at 30BB effective.",
    "correctAction": "raise",
    "heroPosition": "UTG",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "UTG",
      "folds_to_you",
      "KQo",
      "open_spot"
    ],
    "difficultyScore": 71
  },
  {
    "id": "t4_new_119",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "You are in SB with KQo. Effective stack is 75BB. Action folds to you. What is the best action?",
    "explanation": "KQo is strong enough to open from SB at 75BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "KQo",
      "open_spot"
    ],
    "difficultyScore": 77
  },
  {
    "id": "t4_new_120",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "MP opens, CO calls, and action is on you in BTN holding AQo with 75BB effective. What is the best action?",
    "explanation": "AQo is strong enough to squeeze for value after a raise and a call.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "AQo"
    ],
    "difficultyScore": 69
  },
  {
    "id": "t4_carry_030",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 3,
    "category": "action",
    "prompt": "Action folds to you in the small blind. You hold T9s with 30BB effective. What is the best action?",
    "explanation": "T9s is playable in this simplified blind-versus-blind structure.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "SB",
      "blind_vs_blind",
      "T9s",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 63
  },
  {
    "id": "t4_new_121",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "14",
      "15",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_new_122",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "12",
      "10",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_123",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "9",
      "8",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 88
  },
  {
    "id": "t4_new_124",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "14",
      "15",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_carry_031",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "You open from HJ. BB 3-bets. You hold 99 with 60BB effective. What is the best action?",
    "explanation": "99 is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
    "correctAction": "call",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "facing_3bet",
      "99",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_125",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "14",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_126",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "11",
      "15",
      "9"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_127",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "8",
      "12",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_new_128",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "15",
      "12",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_carry_032",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "ev",
    "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_129",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "12",
      "14",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 90
  },
  {
    "id": "t4_new_130",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "10",
      "8",
      "11"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_131",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "11",
      "15",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 90
  },
  {
    "id": "t4_new_132",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "10",
      "12",
      "8",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 90
  },
  {
    "id": "t4_carry_033",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "UTG opens, HJ calls, and action is on you in MP holding T9s with 25BB effective. What is the best action?",
    "explanation": "T9s is too marginal for this squeeze configuration in a simplified model.",
    "correctAction": "fold",
    "heroPosition": "MP",
    "effectiveStackBb": 25,
    "tags": [
      "preflop",
      "MP",
      "squeeze_spot",
      "T9s",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_133",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "8",
      "11",
      "10",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 95
  },
  {
    "id": "t4_new_134",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "8",
      "11",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 87
  },
  {
    "id": "t4_new_135",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "14",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_new_136",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "14",
      "15",
      "9"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 88
  },
  {
    "id": "t4_carry_034",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "You are in MP with AK. Effective stack is 40BB. Action folds to you.",
    "explanation": "At this stack depth and position, AK is strong enough to open for value.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "MP",
      "AK",
      "carryover",
      "from_tier_1",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_137",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "12",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_new_138",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "11",
      "15",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 94
  },
  {
    "id": "t4_new_139",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "15",
      "14",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_new_140",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "12",
      "9",
      "11",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_carry_035",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "HJ opens, HJ calls, and action is on you in BTN holding 88 with 100BB effective. What is the best action?",
    "explanation": "88 can continue profitably, but a call is the simpler recommended option here.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BTN",
      "squeeze_spot",
      "88",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_141",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "15",
      "9",
      "11",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 87
  },
  {
    "id": "t4_new_142",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "9",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_new_143",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "10",
      "11",
      "8"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_144",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "14",
      "15",
      "9"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 87
  },
  {
    "id": "t4_carry_036",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 75. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 25.4% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_145",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "15",
      "12",
      "14"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_146",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "11",
      "12",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_new_147",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "9",
      "12",
      "11",
      "10"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_148",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "15",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_carry_037",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "You are in UTG with AJ. Effective stack is 75BB. Action folds to you.",
    "explanation": "At this stack depth and position, AJ is playable but not strong enough to raise aggressively.",
    "correctAction": "call",
    "heroPosition": "UTG",
    "effectiveStackBb": 75,
    "tags": [
      "preflop",
      "UTG",
      "AJ",
      "carryover",
      "from_tier_1",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_149",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "12",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_new_150",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "9",
      "15",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 91
  },
  {
    "id": "t4_new_151",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "12",
      "10",
      "8"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 87
  },
  {
    "id": "t4_new_152",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "12",
      "8",
      "10",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_carry_038",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "You are in BTN with AA. Effective stack is 100BB. Action folds to you.",
    "explanation": "At this stack depth and position, AA is strong enough to open for value.",
    "correctAction": "raise",
    "heroPosition": "BTN",
    "effectiveStackBb": 100,
    "tags": [
      "preflop",
      "BTN",
      "AA",
      "carryover",
      "from_tier_1",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_153",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "12",
      "10",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_new_154",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "14",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 90
  },
  {
    "id": "t4_new_155",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "12",
      "15",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_new_156",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "12",
      "15",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "open-ended_straight_flush_draw"
    ],
    "difficultyScore": 94
  },
  {
    "id": "t4_carry_039",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with TT and 40BB effective. What is the best action?",
    "explanation": "TT is strong enough to attack or continue aggressively in a blind battle.",
    "correctAction": "raise",
    "heroPosition": "HJ",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "HJ",
      "blind_vs_blind",
      "TT",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_157",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 10 outs.",
    "choices": [
      "11",
      "12",
      "10",
      "9"
    ],
    "correctAnswer": "10",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 93
  },
  {
    "id": "t4_new_158",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "15",
      "14",
      "9",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 90
  },
  {
    "id": "t4_new_159",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "15",
      "12",
      "14",
      "11"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 86
  },
  {
    "id": "t4_new_160",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "outs",
    "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "9",
      "12",
      "15",
      "14"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_two_overcards"
    ],
    "difficultyScore": 89
  },
  {
    "id": "t4_carry_040",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 4,
    "category": "action",
    "prompt": "You are in SB with 66. Effective stack is 40BB. Action folds to you. What is the best action?",
    "explanation": "66 is a profitable open from SB at 40BB effective.",
    "correctAction": "raise",
    "heroPosition": "SB",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "SB",
      "folds_to_you",
      "66",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 83
  },
  {
    "id": "t4_new_161",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "9",
      "14",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_162",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "9",
      "14",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_163",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "11",
      "14",
      "15",
      "12"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_164",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "11",
      "14",
      "15",
      "12"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_041",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold TT with 20BB effective. What is the best action?",
    "explanation": "TT is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
    "correctAction": "call",
    "heroPosition": "UTG",
    "effectiveStackBb": 20,
    "tags": [
      "preflop",
      "UTG",
      "facing_3bet",
      "TT",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_165",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "10",
      "12",
      "14",
      "15"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_166",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "12",
      "9",
      "15",
      "14"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_167",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "10",
      "14",
      "15",
      "11"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_168",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "9",
      "11",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_042",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "14",
      "11",
      "15",
      "12"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "flush_draw_plus_gutshot_plus_overcard",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_169",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "12",
      "15",
      "10",
      "14"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_170",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 15 outs.",
    "choices": [
      "11",
      "9",
      "14",
      "15"
    ],
    "correctAnswer": "15",
    "tags": [
      "outs",
      "draw_math",
      "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_171",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_172",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_043",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "action",
    "prompt": "CO opens to 3BB. You are in SB with ATs. Effective stack is 60BB. What is the best action?",
    "explanation": "ATs is not strong enough often enough versus an open from CO.",
    "correctAction": "fold",
    "heroPosition": "SB",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "SB",
      "facing_open_raise",
      "ATs",
      "facing_open",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_173",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_174",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_175",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_176",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_044",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.9% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_177",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_178",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_179",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_180",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_045",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "action",
    "prompt": "You are in BB with QJs. Effective stack is 30BB. Action folds to you. What is the best action?",
    "explanation": "QJs is a profitable open from BB at 30BB effective.",
    "correctAction": "raise",
    "heroPosition": "BB",
    "effectiveStackBb": 30,
    "tags": [
      "preflop",
      "BB",
      "folds_to_you",
      "QJs",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_181",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_182",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_183",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_184",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_046",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "action",
    "prompt": "You open from BTN. BTN 3-bets. You hold AQs with 40BB effective. What is the best action?",
    "explanation": "AQs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
    "correctAction": "call",
    "heroPosition": "BTN",
    "effectiveStackBb": 40,
    "tags": [
      "preflop",
      "BTN",
      "facing_3bet",
      "AQs",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_185",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_186",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_187",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_188",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_047",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "In this simplified training model, that draw gives you 14 outs.",
    "choices": [
      "14",
      "11",
      "12",
      "10"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_189",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_190",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_191",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_192",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_048",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_193",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_194",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_195",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_196",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_049",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "action",
    "prompt": "You are in MP with AKs. Effective stack is 60BB. Action folds to you. What is the best action?",
    "explanation": "AKs is strong enough to open from MP, especially at 60BB effective.",
    "correctAction": "raise",
    "heroPosition": "MP",
    "effectiveStackBb": 60,
    "tags": [
      "preflop",
      "MP",
      "folds_to_you",
      "AKs",
      "open_spot",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_197",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_198",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 220. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
    "explanation": "You need 24.1% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "FOLD",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_199",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 240. Your opponent bets 80. You estimate your equity at 28%. What is the best action?",
    "explanation": "You need 25.0% equity to call. Since your equity is 28%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_new_200",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "ev",
    "prompt": "The pot is 260. Your opponent bets 90. You estimate your equity at 31%. What is the best action?",
    "explanation": "You need 25.7% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
    "choices": [
      "CALL",
      "FOLD"
    ],
    "correctAnswer": "CALL",
    "tags": [
      "ev",
      "pot_odds"
    ],
    "difficultyScore": 100
  },
  {
    "id": "t4_carry_050",
    "tier": "chip_leader",
    "tierIndex": 4,
    "level": 5,
    "category": "outs",
    "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
    "explanation": "This draw type gives you 14 outs in this simplified training model.",
    "choices": [
      "10",
      "11",
      "14",
      "12"
    ],
    "correctAnswer": "14",
    "tags": [
      "outs",
      "draw_math",
      "pair_plus_flush_draw_plus_overcard",
      "carryover",
      "from_tier_3"
    ],
    "difficultyScore": 100
  }
];


export const tier4Questions: ChallengeQuestion[] = tier4QuestionsRaw.map((question) => ({
  ...question,
  prompt: `${question.prompt} [${question.id}]`,
}));
