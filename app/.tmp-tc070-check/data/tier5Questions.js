"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tier5Questions = void 0;
const tier5QuestionsRaw = [
    {
        "id": "t5_new_001",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "One player limps before you. You are in CO with 77 and 30BB effective. What is the best action?",
        "explanation": "77 is playable but not always a mandatory isolation raise in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "iso_raise_spot",
            "77"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_002",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, HJ calls, and action is on you in UTG holding AKs with 75BB effective. What is the best action?",
        "explanation": "AKs is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "UTG",
            "squeeze_spot",
            "AKs"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_003",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in MP holding 77 with 50BB effective. What is the best action?",
        "explanation": "77 can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "squeeze_spot",
            "77"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t5_new_004",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in SB with AQs. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "AQs is strong enough to open from SB, especially with position or sufficient hand strength at 75BB.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "folds_to_you",
            "AQs",
            "open_spot"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t5_carry_001",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_005",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold TT with 30BB effective. What is the best action?",
        "explanation": "TT is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "blind_vs_blind",
            "TT"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_006",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold JTs with 60BB effective. What is the best action?",
        "explanation": "JTs is playable in this simplified blind-versus-blind model due to playability and realization.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "JTs"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_007",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "BTN opens wide. You are in SB with 77 and 75BB effective. What is the best action?",
        "explanation": "77 can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "late_position_pressure",
            "77"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t5_new_008",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in BB with TT. Effective stack is 25BB. What is the best action?",
        "explanation": "TT is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 37
    },
    {
        "id": "t5_carry_002",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 99
    },
    {
        "id": "t5_new_009",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "MP opens, CO calls, and action is on you in SB holding JJ with 60BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "SB",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_010",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold TT with 25BB effective. What is the best action?",
        "explanation": "TT is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "TT"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t5_new_011",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from BTN. BB 3-bets. You hold 88 with 30BB effective. What is the best action?",
        "explanation": "88 is too weak to continue profitably against a 3-bet here.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "88"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t5_new_012",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with A8s and 20BB effective. What is the best action?",
        "explanation": "A8s is too weak to continue profitably versus late-position pressure in this simplified model.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "late_position_pressure",
            "A8s"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_carry_003",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_013",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 87s with 20BB effective. What is the best action?",
        "explanation": "87s is playable in this simplified blind-versus-blind model due to playability and realization.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "87s"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_014",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in SB with AKo. Effective stack is 30BB. What is the best action?",
        "explanation": "AKo is premium and should usually continue aggressively against an open.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "facing_open_raise",
            "AKo",
            "facing_open"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t5_new_015",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KJs with 75BB effective. What is the best action?",
        "explanation": "KJs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "KJs"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t5_new_016",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in MP with QQ. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from MP, especially with position or sufficient hand strength at 75BB.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "QQ",
            "open_spot"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t5_carry_004",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "open_spot",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 80
    },
    {
        "id": "t5_new_017",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. SB 3-bets. You hold KQs with 40BB effective. What is the best action?",
        "explanation": "KQs is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "KQs"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t5_new_018",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in BB with AKs. Effective stack is 25BB. What is the best action?",
        "explanation": "AKs is premium and should usually continue aggressively against an open.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "AKs",
            "facing_open"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_019",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in HJ with AKs. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "AKs is strong enough to open from HJ, especially with position or sufficient hand strength at 60BB.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "AKs",
            "open_spot"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_020",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from BTN. BTN 3-bets. You hold AJs with 50BB effective. What is the best action?",
        "explanation": "AJs is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "AJs"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t5_carry_005",
        "tier": "master",
        "tierIndex": 5,
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
            "TT",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 40
    },
    {
        "id": "t5_new_021",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in BB with QQ. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from BB, especially with position or sufficient hand strength at 75BB.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "folds_to_you",
            "QQ",
            "open_spot"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_022",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with QQ. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from CO, especially with position or sufficient hand strength at 25BB.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "QQ",
            "open_spot"
        ],
        "difficultyScore": 37
    },
    {
        "id": "t5_new_023",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "BTN opens wide. You are in SB with 77 and 20BB effective. What is the best action?",
        "explanation": "77 can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "SB",
            "late_position_pressure",
            "77"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t5_new_024",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold 88 with 20BB effective. What is the best action?",
        "explanation": "88 is too weak to continue profitably against a 3-bet here.",
        "correctAction": "fold",
        "heroPosition": "CO",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "88"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t5_carry_006",
        "tier": "master",
        "tierIndex": 5,
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
            "open_spot",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 39
    },
    {
        "id": "t5_new_025",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with AJs and 60BB effective. What is the best action?",
        "explanation": "AJs is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "late_position_pressure",
            "AJs"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t5_new_026",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with JJ. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "JJ is strong enough to open from CO, especially with position or sufficient hand strength at 30BB.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "JJ",
            "open_spot"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_027",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with JTs and 60BB effective. What is the best action?",
        "explanation": "JTs can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "late_position_pressure",
            "JTs"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_028",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Two players limp before you. You are in BTN with TT and 100BB effective. What is the best action?",
        "explanation": "TT is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "iso_raise_spot",
            "TT"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_carry_007",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "open_spot",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t5_new_029",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in BTN with QQ. Effective stack is 30BB. What is the best action?",
        "explanation": "QQ is premium and should usually continue aggressively against an open.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "QQ",
            "facing_open"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t5_new_030",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. BTN 3-bets. You hold QQ with 100BB effective. What is the best action?",
        "explanation": "QQ is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "QQ"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t5_new_031",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You are in HJ with AA. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "AA is strong enough to open from HJ, especially with position or sufficient hand strength at 25BB.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "AA",
            "open_spot"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t5_new_032",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "One player limps before you. You are in UTG with 77 and 60BB effective. What is the best action?",
        "explanation": "77 is too weak or too marginal to continue profitably from UTG against multiple limpers.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "UTG",
            "iso_raise_spot",
            "77"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t5_carry_008",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "QJs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_033",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in CO with TT. Effective stack is 100BB. What is the best action?",
        "explanation": "TT is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t5_new_034",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold JJ with 25BB effective. What is the best action?",
        "explanation": "JJ is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "JJ"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t5_new_035",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "Two players limp before you. You are in BTN with JJ and 50BB effective. What is the best action?",
        "explanation": "JJ is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "iso_raise_spot",
            "JJ"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_new_036",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 99 and 100BB effective. What is the best action?",
        "explanation": "99 is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "99"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t5_carry_009",
        "tier": "master",
        "tierIndex": 5,
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
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 99
    },
    {
        "id": "t5_new_037",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with AA and 30BB effective. What is the best action?",
        "explanation": "AA is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "late_position_pressure",
            "AA"
        ],
        "difficultyScore": 37
    },
    {
        "id": "t5_new_038",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with JTs and 50BB effective. What is the best action?",
        "explanation": "JTs can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "late_position_pressure",
            "JTs"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t5_new_039",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 77 and 20BB effective. What is the best action?",
        "explanation": "77 is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "77"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t5_new_040",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
        "category": "action",
        "prompt": "MP opens to 2.5BB. You are in BB with TT. Effective stack is 100BB. What is the best action?",
        "explanation": "TT is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t5_carry_010",
        "tier": "master",
        "tierIndex": 5,
        "level": 1,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 94
    },
    {
        "id": "t5_new_041",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Two players limp before you. You are in BB with TT and 100BB effective. What is the best action?",
        "explanation": "TT is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "iso_raise_spot",
            "TT"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t5_new_042",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, HJ calls, and action is on you in CO holding 99 with 40BB effective. What is the best action?",
        "explanation": "99 can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "squeeze_spot",
            "99"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_043",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in CO with KQs. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KQs is strong enough to open from CO, especially with position or sufficient hand strength at 100BB.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "KQs",
            "open_spot"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_new_044",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in CO with 99. Effective stack is 20BB. What is the best action?",
        "explanation": "99 is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "99",
            "facing_open"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t5_carry_011",
        "tier": "master",
        "tierIndex": 5,
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
            "facing_open",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t5_new_045",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from HJ. BB 3-bets. You hold KQs with 30BB effective. What is the best action?",
        "explanation": "KQs is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "KQs"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t5_new_046",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from HJ. BTN 3-bets. You hold QQ with 40BB effective. What is the best action?",
        "explanation": "QQ is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "QQ"
        ],
        "difficultyScore": 57
    },
    {
        "id": "t5_new_047",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in UTG with AQo. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "AQo is strong enough to open from UTG, especially with position or sufficient hand strength at 30BB.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "UTG",
            "folds_to_you",
            "AQo",
            "open_spot"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_new_048",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in CO holding JJ with 60BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "CO",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t5_carry_012",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "AQo",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_049",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from HJ. BTN 3-bets. You hold AA with 40BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_050",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in SB with ATs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "ATs is strong enough to open from SB, especially with position or sufficient hand strength at 30BB.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "folds_to_you",
            "ATs",
            "open_spot"
        ],
        "difficultyScore": 57
    },
    {
        "id": "t5_new_051",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in MP with 77. Effective stack is 20BB. Action folds to you. What is the best action?",
        "explanation": "77 is strong enough to open from MP, especially with position or sufficient hand strength at 20BB.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "77",
            "open_spot"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t5_new_052",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in BTN holding TT with 75BB effective. What is the best action?",
        "explanation": "TT can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "TT"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t5_carry_013",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "KK",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t5_new_053",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Three players limp before you. You are in BTN with AJs and 20BB effective. What is the best action?",
        "explanation": "AJs is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "iso_raise_spot",
            "AJs"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t5_new_054",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with T9s and 25BB effective. What is the best action?",
        "explanation": "T9s can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "late_position_pressure",
            "T9s"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_new_055",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in MP holding 88 with 40BB effective. What is the best action?",
        "explanation": "88 can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "squeeze_spot",
            "88"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_056",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "One player limps before you. You are in CO with KK and 40BB effective. What is the best action?",
        "explanation": "KK is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "iso_raise_spot",
            "KK"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t5_carry_014",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 98
    },
    {
        "id": "t5_new_057",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Two players limp before you. You are in UTG with QQ and 75BB effective. What is the best action?",
        "explanation": "QQ is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "UTG",
            "iso_raise_spot",
            "QQ"
        ],
        "difficultyScore": 56
    },
    {
        "id": "t5_new_058",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with JTs and 40BB effective. What is the best action?",
        "explanation": "JTs can continue profitably, but calling is the more controlled simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "late_position_pressure",
            "JTs"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t5_new_059",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with QQ and 30BB effective. What is the best action?",
        "explanation": "QQ is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "late_position_pressure",
            "QQ"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t5_new_060",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with AJs. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "AJs is strong enough to open from BTN, especially with position or sufficient hand strength at 50BB.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "AJs",
            "open_spot"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t5_carry_015",
        "tier": "master",
        "tierIndex": 5,
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
            "AA",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 57
    },
    {
        "id": "t5_new_061",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "One player limps before you. You are in UTG with JTs and 40BB effective. What is the best action?",
        "explanation": "JTs is too weak or too marginal to continue profitably from UTG against multiple limpers.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "iso_raise_spot",
            "JTs"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t5_new_062",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "One player limps before you. You are in CO with JJ and 25BB effective. What is the best action?",
        "explanation": "JJ is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "iso_raise_spot",
            "JJ"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_063",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in MP with 99. Effective stack is 40BB. What is the best action?",
        "explanation": "99 is too marginal versus an open from UTG in this spot.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "99",
            "facing_open"
        ],
        "difficultyScore": 56
    },
    {
        "id": "t5_new_064",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with JJ and 40BB effective. What is the best action?",
        "explanation": "JJ is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "JJ"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t5_carry_016",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "pair_plus_flush_draw_plus_overcard",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_065",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. BTN 3-bets. You hold 99 with 25BB effective. What is the best action?",
        "explanation": "99 is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "99"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t5_new_066",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold ATs with 20BB effective. What is the best action?",
        "explanation": "ATs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "blind_vs_blind",
            "ATs"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t5_new_067",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, HJ calls, and action is on you in HJ holding 88 with 20BB effective. What is the best action?",
        "explanation": "88 can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "88"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t5_new_068",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AA with 100BB effective. What is the best action?",
        "explanation": "AA is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "blind_vs_blind",
            "AA"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_carry_017",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "AQo",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t5_new_069",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with 77. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "77 is strong enough to open from BTN, especially with position or sufficient hand strength at 25BB.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "77",
            "open_spot"
        ],
        "difficultyScore": 56
    },
    {
        "id": "t5_new_070",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with KQs and 40BB effective. What is the best action?",
        "explanation": "KQs is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "late_position_pressure",
            "KQs"
        ],
        "difficultyScore": 57
    },
    {
        "id": "t5_new_071",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "One player limps before you. You are in BB with KQs and 20BB effective. What is the best action?",
        "explanation": "KQs is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "iso_raise_spot",
            "KQs"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_new_072",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in BB with KQs. Effective stack is 25BB. What is the best action?",
        "explanation": "KQs is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "KQs",
            "facing_open"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t5_carry_018",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "from_tier_2",
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 91
    },
    {
        "id": "t5_new_073",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from CO. SB 3-bets. You hold AKs with 25BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t5_new_074",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 98s with 100BB effective. What is the best action?",
        "explanation": "98s is playable in this simplified blind-versus-blind model due to playability and realization.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "98s"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t5_new_075",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Three players limp before you. You are in CO with KJs and 75BB effective. What is the best action?",
        "explanation": "KJs is strong enough to isolate limpers and take initiative.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "CO",
            "iso_raise_spot",
            "KJs"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_076",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with 99 and 20BB effective. What is the best action?",
        "explanation": "99 is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "late_position_pressure",
            "99"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t5_carry_019",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_077",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. BB 3-bets. You hold AQo with 25BB effective. What is the best action?",
        "explanation": "AQo is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_3bet",
            "AQo"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t5_new_078",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in UTG holding TT with 100BB effective. What is the best action?",
        "explanation": "TT can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "squeeze_spot",
            "TT"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t5_new_079",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, CO calls, and action is on you in BTN holding AKs with 30BB effective. What is the best action?",
        "explanation": "AKs is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "AKs"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_new_080",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
        "category": "action",
        "prompt": "Two players limp before you. You are in SB with 88 and 25BB effective. What is the best action?",
        "explanation": "88 is too weak or too marginal to continue profitably from SB against multiple limpers.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "iso_raise_spot",
            "88"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t5_carry_020",
        "tier": "master",
        "tierIndex": 5,
        "level": 2,
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
            "ATs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_081",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in BTN with 77. Effective stack is 100BB. What is the best action?",
        "explanation": "77 is too marginal versus an open from UTG in this spot.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "77",
            "facing_open"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_082",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in MP with QJs. Effective stack is 60BB. What is the best action?",
        "explanation": "QJs is too marginal versus an open from UTG in this spot.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "QJs",
            "facing_open"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t5_new_083",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens, CO calls, and action is on you in BTN holding 99 with 100BB effective. What is the best action?",
        "explanation": "99 can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "99"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t5_new_084",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in BTN with JTs. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "JTs is strong enough to open from BTN, especially with position or sufficient hand strength at 100BB.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "JTs",
            "open_spot"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t5_carry_021",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "TT",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 64
    },
    {
        "id": "t5_new_085",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You open from BTN. SB 3-bets. You hold AA with 100BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t5_new_086",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in CO with JTs. Effective stack is 100BB. What is the best action?",
        "explanation": "JTs is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "JTs",
            "facing_open"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t5_new_087",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Three players limp before you. You are in SB with JTs and 30BB effective. What is the best action?",
        "explanation": "JTs is too weak or too marginal to continue profitably from SB against multiple limpers.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "iso_raise_spot",
            "JTs"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t5_new_088",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KK with 50BB effective. What is the best action?",
        "explanation": "KK is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "KK"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t5_carry_022",
        "tier": "master",
        "tierIndex": 5,
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
            "AQs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t5_new_089",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You open from CO. SB 3-bets. You hold AJs with 30BB effective. What is the best action?",
        "explanation": "AJs is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "UTG",
            "facing_3bet",
            "AJs"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_090",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in CO with 66. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "66 is strong enough to open from CO, especially with position or sufficient hand strength at 40BB.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "66",
            "open_spot"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_091",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 98s and 60BB effective. What is the best action?",
        "explanation": "98s can continue due to strong playability in this simplified blind battle.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "CO",
            "blind_vs_blind",
            "98s"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_092",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Three players limp before you. You are in HJ with T9s and 30BB effective. What is the best action?",
        "explanation": "T9s is too weak or too marginal to continue profitably from HJ against multiple limpers.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "iso_raise_spot",
            "T9s"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t5_carry_023",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 97
    },
    {
        "id": "t5_new_093",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with JJ and 25BB effective. What is the best action?",
        "explanation": "JJ is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "late_position_pressure",
            "JJ"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_094",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 76s with 20BB effective. What is the best action?",
        "explanation": "76s is too weak to continue from the small blind in this spot.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "blind_vs_blind",
            "76s"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_095",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QQ and 40BB effective. What is the best action?",
        "explanation": "QQ is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_096",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "BTN opens wide. You are in BB with KQs and 50BB effective. What is the best action?",
        "explanation": "KQs is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "late_position_pressure",
            "KQs"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t5_carry_024",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_097",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in HJ holding AKs with 75BB effective. What is the best action?",
        "explanation": "AKs is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "AKs"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t5_new_098",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in CO holding AA with 75BB effective. What is the best action?",
        "explanation": "AA is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "CO",
            "squeeze_spot",
            "AA"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t5_new_099",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with 87s and 75BB effective. What is the best action?",
        "explanation": "87s is too weak to continue profitably versus late-position pressure in this simplified model.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "late_position_pressure",
            "87s"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_100",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in HJ with JTs. Effective stack is 40BB. What is the best action?",
        "explanation": "JTs is too marginal versus an open from HJ in this spot.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "JTs",
            "facing_open"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t5_carry_025",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_101",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "MP opens, BTN calls, and action is on you in BB holding QJs with 25BB effective. What is the best action?",
        "explanation": "QJs can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "QJs"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_102",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in HJ with KTs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "KTs is strong enough to open from HJ, especially with position or sufficient hand strength at 30BB.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "KTs",
            "open_spot"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_103",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens, CO calls, and action is on you in UTG holding AJs with 60BB effective. What is the best action?",
        "explanation": "AJs can continue, but calling is the preferred simplified option in this spot.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "UTG",
            "squeeze_spot",
            "AJs"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_104",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with 99 and 25BB effective. What is the best action?",
        "explanation": "99 is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "late_position_pressure",
            "99"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t5_carry_026",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 97
    },
    {
        "id": "t5_new_105",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in BTN with KQo. Effective stack is 20BB. What is the best action?",
        "explanation": "KQo is strong enough to continue, but flatting is the preferred simplified option here.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "KQo",
            "facing_open"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_106",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "CO opens wide. You are in BTN with TT and 50BB effective. What is the best action?",
        "explanation": "TT is strong enough to apply late-position pressure against a wide opening range.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "UTG",
            "late_position_pressure",
            "TT"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_107",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KJs with 100BB effective. What is the best action?",
        "explanation": "KJs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "blind_vs_blind",
            "KJs"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t5_new_108",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AJs with 20BB effective. What is the best action?",
        "explanation": "AJs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "blind_vs_blind",
            "AJs"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t5_carry_027",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 98
    },
    {
        "id": "t5_new_109",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in CO with A9s. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "A9s is strong enough to open from CO, especially with position or sufficient hand strength at 30BB.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "A9s",
            "open_spot"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t5_new_110",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens, CO calls, and action is on you in SB holding JTs with 100BB effective. What is the best action?",
        "explanation": "JTs is too marginal for this squeeze configuration.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "SB",
            "squeeze_spot",
            "JTs"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_111",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in HJ with 77. Effective stack is 40BB. What is the best action?",
        "explanation": "77 is too marginal versus an open from CO in this spot.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "77",
            "facing_open"
        ],
        "difficultyScore": 72
    },
    {
        "id": "t5_new_112",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with JJ and 30BB effective. What is the best action?",
        "explanation": "JJ is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "JJ"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_carry_028",
        "tier": "master",
        "tierIndex": 5,
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
            "KK",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t5_new_113",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in BTN with 66. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "66 is strong enough to open from BTN, especially with position or sufficient hand strength at 25BB.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "66",
            "open_spot"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_new_114",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in HJ holding KK with 50BB effective. What is the best action?",
        "explanation": "KK is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "KK"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t5_new_115",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in BTN holding AQo with 30BB effective. What is the best action?",
        "explanation": "AQo is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "AQo"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_116",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You are in HJ with A9s. Effective stack is 20BB. Action folds to you. What is the best action?",
        "explanation": "A9s is strong enough to open from HJ, especially with position or sufficient hand strength at 20BB.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "A9s",
            "open_spot"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t5_carry_029",
        "tier": "master",
        "tierIndex": 5,
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
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_117",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with TT and 40BB effective. What is the best action?",
        "explanation": "TT is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "blind_vs_blind",
            "TT"
        ],
        "difficultyScore": 72
    },
    {
        "id": "t5_new_118",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KQs and 25BB effective. What is the best action?",
        "explanation": "KQs is strong enough to continue aggressively in a blind-versus-blind battle.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "blind_vs_blind",
            "KQs"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t5_new_119",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold KQs with 40BB effective. What is the best action?",
        "explanation": "KQs is often good enough to continue, but not always strong enough to escalate further in this simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "KQs"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t5_new_120",
        "tier": "master",
        "tierIndex": 5,
        "level": 3,
        "category": "action",
        "prompt": "You open from HJ. SB 3-bets. You hold AA with 20BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 78
    },
    {
        "id": "t5_carry_030",
        "tier": "master",
        "tierIndex": 5,
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
            "from_tier_2",
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 77
    },
    {
        "id": "t5_new_121",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "11",
            "15",
            "14"
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
        "id": "t5_new_122",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_123",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "12",
            "11",
            "10",
            "8"
        ],
        "correctAnswer": "10",
        "tags": [
            "outs",
            "draw_math",
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 94
    },
    {
        "id": "t5_new_124",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "14",
            "15",
            "11",
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
        "id": "t5_carry_031",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "QJs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_125",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "14",
            "11",
            "12",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 95
    },
    {
        "id": "t5_new_126",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "12",
            "10",
            "9",
            "8"
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
        "id": "t5_new_127",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "11",
            "12",
            "15"
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
        "id": "t5_new_128",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "15",
            "9",
            "12"
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
        "id": "t5_carry_032",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "pair_plus_flush_draw_plus_overcard",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_129",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "14",
            "11",
            "12"
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
        "id": "t5_new_130",
        "tier": "master",
        "tierIndex": 5,
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
        "id": "t5_new_131",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "14",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 95
    },
    {
        "id": "t5_new_132",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "12",
            "15",
            "14",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_carry_033",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "open_spot",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_133",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "12",
            "9",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 95
    },
    {
        "id": "t5_new_134",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "10",
            "12",
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
        "id": "t5_new_135",
        "tier": "master",
        "tierIndex": 5,
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
        "id": "t5_new_136",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "11",
            "9",
            "10",
            "12"
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
        "id": "t5_carry_034",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "AKo",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_137",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "15",
            "11",
            "12"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_138",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "9",
            "11",
            "14"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_139",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "15",
            "11",
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
        "id": "t5_new_140",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 95
    },
    {
        "id": "t5_carry_035",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "facing_open",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_141",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "9",
            "15",
            "12"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t5_new_142",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "11",
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
        "difficultyScore": 89
    },
    {
        "id": "t5_new_143",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "10",
            "12",
            "9",
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
        "id": "t5_new_144",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 94
    },
    {
        "id": "t5_carry_036",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "AA",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_145",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "14",
            "9",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t5_new_146",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t5_new_147",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "12",
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
        "difficultyScore": 95
    },
    {
        "id": "t5_new_148",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "11",
            "9",
            "14"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t5_carry_037",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "AQs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_149",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "14",
            "12",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_150",
        "tier": "master",
        "tierIndex": 5,
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
        "difficultyScore": 91
    },
    {
        "id": "t5_new_151",
        "tier": "master",
        "tierIndex": 5,
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
        "difficultyScore": 96
    },
    {
        "id": "t5_new_152",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "8",
            "9",
            "12",
            "10"
        ],
        "correctAnswer": "10",
        "tags": [
            "outs",
            "draw_math",
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 94
    },
    {
        "id": "t5_carry_038",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "AA",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_153",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t5_new_154",
        "tier": "master",
        "tierIndex": 5,
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
        "difficultyScore": 94
    },
    {
        "id": "t5_new_155",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_156",
        "tier": "master",
        "tierIndex": 5,
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
        "difficultyScore": 93
    },
    {
        "id": "t5_carry_039",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_157",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "11",
            "9",
            "14"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t5_new_158",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "10",
            "12",
            "9",
            "11"
        ],
        "correctAnswer": "10",
        "tags": [
            "outs",
            "draw_math",
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t5_new_159",
        "tier": "master",
        "tierIndex": 5,
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
        "difficultyScore": 93
    },
    {
        "id": "t5_new_160",
        "tier": "master",
        "tierIndex": 5,
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
        "id": "t5_carry_040",
        "tier": "master",
        "tierIndex": 5,
        "level": 4,
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
            "facing_open",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t5_new_161",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "14",
            "11",
            "12"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_162",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "15",
            "14",
            "12",
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
        "id": "t5_new_163",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "9",
            "12",
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
        "id": "t5_new_164",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "11",
            "14",
            "12"
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
        "id": "t5_carry_041",
        "tier": "master",
        "tierIndex": 5,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_165",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "10",
            "11",
            "15",
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
        "id": "t5_new_166",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_167",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "14",
            "12",
            "9",
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
        "id": "t5_new_168",
        "tier": "master",
        "tierIndex": 5,
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
        "id": "t5_carry_042",
        "tier": "master",
        "tierIndex": 5,
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
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_169",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "11",
            "14",
            "10",
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
        "id": "t5_new_170",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "15",
            "14",
            "11",
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
        "id": "t5_new_171",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_172",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_carry_043",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "KK",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_173",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_174",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_175",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_176",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_carry_044",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "AJs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_177",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_178",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_179",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_180",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_carry_045",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "AA",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_181",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_182",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_183",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_184",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_carry_046",
        "tier": "master",
        "tierIndex": 5,
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
            "pot_odds",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_185",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_186",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_187",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_188",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_carry_047",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "JTs",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_189",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_190",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_191",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_192",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_carry_048",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_193",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_194",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 300. Your opponent bets 100. You estimate your equity at 28%. What is the best action?",
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
        "id": "t5_new_195",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_196",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_carry_049",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "from_tier_3",
            "from_tier_4"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t5_new_197",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_198",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_new_199",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 280. Your opponent bets 95. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.3% equity to call. Since your equity is 24%, the correct simplified choice is FOLD.",
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
        "id": "t5_new_200",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 320. Your opponent bets 110. You estimate your equity at 31%. What is the best action?",
        "explanation": "You need 25.6% equity to call. Since your equity is 31%, the correct simplified choice is CALL.",
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
        "id": "t5_carry_050",
        "tier": "master",
        "tierIndex": 5,
        "level": 5,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_4"
        ],
        "difficultyScore": 100
    }
];
exports.tier5Questions = tier5QuestionsRaw.map((question) => ({
    ...question,
    prompt: `${question.prompt} [${question.id}]`,
}));
