"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tier2Questions = void 0;
const tier2QuestionsRaw = [
    {
        "id": "t2_new_001",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in MP with QQ. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from MP, especially at 50BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "QQ",
            "open_spot"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t2_new_002",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KK with 40BB effective. What is the best action?",
        "explanation": "KK is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "small_blind_vs_big_blind",
            "KK",
            "blind_vs_blind"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_003",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in SB with KK. Effective stack is 30BB. What is the best action?",
        "explanation": "KK is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "facing_min_raise",
            "KK",
            "facing_raise"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_004",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in CO with AKo. Effective stack is 25BB. What is the best action?",
        "explanation": "AKo is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "AKo",
            "facing_raise"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_carry_001",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in SB with 77. Effective stack is 40BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is playable but not strong enough to raise aggressively.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_new_005",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with KK. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KK is strong enough to open from CO, especially at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "KK",
            "open_spot"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_006",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in HJ with AA. Effective stack is 75BB. What is the best action?",
        "explanation": "AA is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "facing_min_raise",
            "AA",
            "facing_raise"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t2_new_007",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in UTG with AKo. Effective stack is 50BB. What is the best action?",
        "explanation": "AKo is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "UTG",
            "facing_min_raise",
            "AKo",
            "facing_raise"
        ],
        "difficultyScore": 24
    },
    {
        "id": "t2_new_008",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "HJ makes a minimum raise. You are in BTN with AA. Effective stack is 20BB. What is the best action?",
        "explanation": "AA is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "AA",
            "facing_raise"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t2_carry_002",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in UTG with 77. Effective stack is 40BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 87
    },
    {
        "id": "t2_new_009",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in BTN with AKs. Effective stack is 25BB. What is the best action?",
        "explanation": "AKs is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "AKs",
            "facing_raise"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t2_new_010",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in CO with AA. Effective stack is 75BB. What is the best action?",
        "explanation": "AA is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AA",
            "facing_open"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t2_new_011",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AKs and 75BB effective. What is the best action?",
        "explanation": "AKs is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "small_blind_vs_big_blind",
            "AKs",
            "blind_vs_blind"
        ],
        "difficultyScore": 24
    },
    {
        "id": "t2_new_012",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with QQ. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from CO, especially at 25BB effective.",
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
        "difficultyScore": 31
    },
    {
        "id": "t2_carry_003",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in BB with QQ. Effective stack is 100BB. Action folds to you.",
        "explanation": "At this stack depth and position, QQ is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "QQ",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t2_new_013",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KQs and 40BB effective. What is the best action?",
        "explanation": "KQs is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "small_blind_vs_big_blind",
            "KQs",
            "blind_vs_blind"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_014",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in BB with AKo. Effective stack is 30BB. What is the best action?",
        "explanation": "AKo is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "AKo",
            "facing_open"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t2_new_015",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in SB with QQ. Effective stack is 20BB. Action folds to you. What is the best action?",
        "explanation": "QQ is strong enough to open from SB, especially at 20BB effective.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "SB",
            "folds_to_you",
            "QQ",
            "open_spot"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_016",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in CO with QQ. Effective stack is 25BB. What is the best action?",
        "explanation": "QQ is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "QQ",
            "facing_open"
        ],
        "difficultyScore": 25
    },
    {
        "id": "t2_carry_004",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in UTG with AT. Effective stack is 50BB. Action folds to you.",
        "explanation": "At this stack depth and position, AT is playable but not strong enough to raise aggressively.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "UTG",
            "AT",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 72
    },
    {
        "id": "t2_new_017",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in BTN with JJ. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "JJ is strong enough to open from BTN, especially at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "JJ",
            "open_spot"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t2_new_018",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KK with 25BB effective. What is the best action?",
        "explanation": "KK is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "small_blind_vs_big_blind",
            "KK",
            "blind_vs_blind"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t2_new_019",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in BTN with AKs. Effective stack is 40BB. What is the best action?",
        "explanation": "AKs is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "AKs",
            "facing_open"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t2_new_020",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AJs with 40BB effective. What is the best action?",
        "explanation": "AJs is playable blind-versus-blind but not always a mandatory raise in a simplified model.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "AJs",
            "blind_vs_blind"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t2_carry_005",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in BB with K9. Effective stack is 75BB. Action folds to you.",
        "explanation": "At this stack depth and position, K9 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "K9",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_021",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in HJ with QQ. Effective stack is 100BB. What is the best action?",
        "explanation": "QQ is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "QQ",
            "facing_open"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t2_new_022",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in HJ with JJ. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "JJ is strong enough to open from HJ, especially at 25BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "JJ",
            "open_spot"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t2_new_023",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in CO with AKo. Effective stack is 100BB. What is the best action?",
        "explanation": "AKo is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AKo",
            "facing_open"
        ],
        "difficultyScore": 24
    },
    {
        "id": "t2_new_024",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
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
            "open_spot"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t2_carry_006",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "outs",
        "prompt": "You have a draw with 4 outs on the flop. How many outs do you have?",
        "explanation": "4 outs means 4 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "4",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t2_new_025",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
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
            "facing_raise"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t2_new_026",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in BB with KK. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KK is strong enough to open from BB, especially at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "folds_to_you",
            "KK",
            "open_spot"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t2_new_027",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AKs and 20BB effective. What is the best action?",
        "explanation": "AKs is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "SB",
            "small_blind_vs_big_blind",
            "AKs",
            "blind_vs_blind"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t2_new_028",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in HJ with AA. Effective stack is 50BB. What is the best action?",
        "explanation": "AA is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "AA",
            "facing_open"
        ],
        "difficultyScore": 24
    },
    {
        "id": "t2_carry_007",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 15. You have 35% equity. What is correct?",
        "explanation": "You need 23.1% equity. You have 35%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t2_new_029",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in HJ with AQs. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "AQs is strong enough to open from HJ, especially at 50BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "AQs",
            "open_spot"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t2_new_030",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in CO with AKo. Effective stack is 40BB. What is the best action?",
        "explanation": "AKo is premium and should usually reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AKo",
            "facing_open"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t2_new_031",
        "tier": "apprentice",
        "tierIndex": 2,
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
            "open_spot"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t2_new_032",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in MP with AKs. Effective stack is 50BB. What is the best action?",
        "explanation": "AKs is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "facing_min_raise",
            "AKs",
            "facing_raise"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t2_carry_008",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "outs",
        "prompt": "You have a draw with 15 outs on the flop. How many outs do you have?",
        "explanation": "15 outs means 15 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_033",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in HJ with AKs. Effective stack is 20BB. What is the best action?",
        "explanation": "AKs is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "facing_min_raise",
            "AKs",
            "facing_raise"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t2_new_034",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in BB with AKs. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "AKs is strong enough to open from BB, especially at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "folds_to_you",
            "AKs",
            "open_spot"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_new_035",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in BTN with AKo. Effective stack is 50BB. What is the best action?",
        "explanation": "AKo is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "AKo",
            "facing_raise"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t2_new_036",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 99 with 50BB effective. What is the best action?",
        "explanation": "99 is playable blind-versus-blind but not always a mandatory raise in a simplified model.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "99",
            "blind_vs_blind"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t2_carry_009",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 15. You have 25% equity. What is correct?",
        "explanation": "You need 23.1% equity. You have 25%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_037",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AQs with 100BB effective. What is the best action?",
        "explanation": "AQs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "small_blind_vs_big_blind",
            "AQs",
            "blind_vs_blind"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t2_new_038",
        "tier": "apprentice",
        "tierIndex": 2,
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
            "facing_open"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t2_new_039",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in UTG with KK. Effective stack is 25BB. What is the best action?",
        "explanation": "KK is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "UTG",
            "facing_min_raise",
            "KK",
            "facing_raise"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t2_new_040",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in HJ with KK. Effective stack is 30BB. What is the best action?",
        "explanation": "KK is strong enough to reraise for value versus a minimum open.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "facing_min_raise",
            "KK",
            "facing_raise"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t2_carry_010",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 1,
        "category": "action",
        "prompt": "You are in MP with A5. Effective stack is 30BB. Action folds to you.",
        "explanation": "At this stack depth and position, A5 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "MP",
            "A5",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_041",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KQo with 40BB effective. What is the best action?",
        "explanation": "KQo is playable blind-versus-blind but not always a mandatory raise in a simplified model.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "KQo",
            "blind_vs_blind"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_042",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 98s with 30BB effective. What is the best action?",
        "explanation": "98s is too weak to continue profitably from the small blind in this simplified spot.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "small_blind_vs_big_blind",
            "98s",
            "blind_vs_blind"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_043",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in CO with 99. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "99 is strong enough to open from CO, especially at 40BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "99",
            "open_spot"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_044",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in BB with KJs. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KJs is strong enough to open from BB, especially at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "folds_to_you",
            "KJs",
            "open_spot"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_carry_011",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in UTG with K9. Effective stack is 100BB. Action folds to you.",
        "explanation": "At this stack depth and position, K9 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "K9",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_045",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AJs with 40BB effective. What is the best action?",
        "explanation": "AJs is playable blind-versus-blind but not always a mandatory raise in a simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "small_blind_vs_big_blind",
            "AJs",
            "blind_vs_blind"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_new_046",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "HJ makes a minimum raise. You are in CO with TT. Effective stack is 40BB. What is the best action?",
        "explanation": "TT plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "TT",
            "facing_raise"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t2_new_047",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in SB with 99. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "99 is strong enough to open from SB, especially at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "folds_to_you",
            "99",
            "open_spot"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_new_048",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AQs with 60BB effective. What is the best action?",
        "explanation": "AQs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "HJ",
            "small_blind_vs_big_blind",
            "AQs",
            "blind_vs_blind"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_carry_012",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "outs",
        "prompt": "You have a draw with 12 outs on the flop. How many outs do you have?",
        "explanation": "12 outs means 12 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "12",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_new_049",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AJo and 40BB effective. What is the best action?",
        "explanation": "AJo can continue in a lower-pressure blind situation.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "small_blind_vs_big_blind",
            "AJo",
            "blind_vs_blind"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_new_050",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in CO with AQs. Effective stack is 50BB. What is the best action?",
        "explanation": "AQs is strong enough to continue, but flatting keeps dominated hands in and controls variance.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AQs",
            "facing_open"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_051",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in CO with 99. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "99 is strong enough to open from CO, especially at 30BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "99",
            "open_spot"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_new_052",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in MP with KQs. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "KQs is strong enough to open from MP, especially at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "KQs",
            "open_spot"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_carry_013",
        "tier": "apprentice",
        "tierIndex": 2,
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
            "from_tier_1"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_053",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in HJ with KJs. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "KJs is strong enough to open from HJ, especially at 40BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "KJs",
            "open_spot"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t2_new_054",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in UTG with TT. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "TT is strong enough to open from UTG, especially at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "UTG",
            "folds_to_you",
            "TT",
            "open_spot"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_055",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in SB with TT. Effective stack is 25BB. What is the best action?",
        "explanation": "TT plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "facing_min_raise",
            "TT",
            "facing_raise"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_056",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in HJ with KJs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "KJs is strong enough to open from HJ, especially at 30BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "KJs",
            "open_spot"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_carry_014",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 20. You have 30% equity. What is correct?",
        "explanation": "You need 28.6% equity. You have 30%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 86
    },
    {
        "id": "t2_new_057",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in UTG with TT. Effective stack is 20BB. What is the best action?",
        "explanation": "TT is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "UTG",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 45
    },
    {
        "id": "t2_new_058",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in SB with AQo. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "AQo is strong enough to open from SB, especially at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
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
        "id": "t2_new_059",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in UTG with TT. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "TT is strong enough to open from UTG, especially at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "UTG",
            "folds_to_you",
            "TT",
            "open_spot"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_new_060",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AJo and 25BB effective. What is the best action?",
        "explanation": "AJo can continue in a lower-pressure blind situation.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "AJo",
            "blind_vs_blind"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t2_carry_015",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in UTG with 77. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "UTG",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t2_new_061",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in SB with TT. Effective stack is 50BB. What is the best action?",
        "explanation": "TT is strong enough to continue, but flatting keeps dominated hands in and controls variance.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "SB",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_new_062",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
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
            "facing_raise"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_063",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in BTN with JJ. Effective stack is 20BB. What is the best action?",
        "explanation": "JJ plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "JJ",
            "facing_raise"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t2_new_064",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in BB with JJ. Effective stack is 40BB. What is the best action?",
        "explanation": "JJ plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "facing_min_raise",
            "JJ",
            "facing_raise"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_carry_016",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in CO with AT. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, AT is playable but not strong enough to raise aggressively.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "AT",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_new_065",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in SB with AJs. Effective stack is 30BB. What is the best action?",
        "explanation": "AJs plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "facing_min_raise",
            "AJs",
            "facing_raise"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t2_new_066",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in CO with AQs. Effective stack is 100BB. What is the best action?",
        "explanation": "AQs plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "AQs",
            "facing_raise"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_new_067",
        "tier": "apprentice",
        "tierIndex": 2,
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
            "facing_raise"
        ],
        "difficultyScore": 45
    },
    {
        "id": "t2_new_068",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in UTG with AQs. Effective stack is 25BB. What is the best action?",
        "explanation": "AQs is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "UTG",
            "facing_open_raise",
            "AQs",
            "facing_open"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t2_carry_017",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "outs",
        "prompt": "You have a draw with 4 outs on the flop. How many outs do you have?",
        "explanation": "4 outs means 4 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "4",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 41
    },
    {
        "id": "t2_new_069",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with 99. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "99 is strong enough to open from BTN, especially at 30BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "99",
            "open_spot"
        ],
        "difficultyScore": 45
    },
    {
        "id": "t2_new_070",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in UTG with AQs. Effective stack is 40BB. What is the best action?",
        "explanation": "AQs plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "UTG",
            "facing_min_raise",
            "AQs",
            "facing_raise"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t2_new_071",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in UTG with JJ. Effective stack is 100BB. What is the best action?",
        "explanation": "JJ is not strong enough often enough versus an open from MP.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "facing_open_raise",
            "JJ",
            "facing_open"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t2_new_072",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in CO with AJs. Effective stack is 75BB. What is the best action?",
        "explanation": "AJs is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "CO",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AJs",
            "facing_open"
        ],
        "difficultyScore": 44
    },
    {
        "id": "t2_carry_018",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with K9. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, K9 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "K9",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_073",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold JJ with 20BB effective. What is the best action?",
        "explanation": "JJ is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "small_blind_vs_big_blind",
            "JJ",
            "blind_vs_blind"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t2_new_074",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in HJ with KJs. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "KJs is strong enough to open from HJ, especially at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "KJs",
            "open_spot"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t2_new_075",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with ATs. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "ATs is strong enough to open from BTN, especially at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "ATs",
            "open_spot"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_076",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in MP with AJs. Effective stack is 40BB. What is the best action?",
        "explanation": "AJs is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "AJs",
            "facing_open"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t2_carry_019",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 15. You have 35% equity. What is correct?",
        "explanation": "You need 23.1% equity. You have 35%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_new_077",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in BTN with TT. Effective stack is 60BB. What is the best action?",
        "explanation": "TT is strong enough to continue, but flatting keeps dominated hands in and controls variance.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t2_new_078",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in CO with KQs. Effective stack is 50BB. What is the best action?",
        "explanation": "KQs is strong enough to continue, but flatting keeps dominated hands in and controls variance.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "KQs",
            "facing_open"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t2_new_079",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AKs and 40BB effective. What is the best action?",
        "explanation": "AKs is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "small_blind_vs_big_blind",
            "AKs",
            "blind_vs_blind"
        ],
        "difficultyScore": 45
    },
    {
        "id": "t2_new_080",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with KK and 75BB effective. What is the best action?",
        "explanation": "KK is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "small_blind_vs_big_blind",
            "KK",
            "blind_vs_blind"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t2_carry_020",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with AJ. Effective stack is 100BB. Action folds to you.",
        "explanation": "At this stack depth and position, AJ is playable but not strong enough to raise aggressively.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "AJ",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t2_new_081",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 99 and 20BB effective. What is the best action?",
        "explanation": "99 can continue in a lower-pressure blind situation.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "99",
            "blind_vs_blind"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t2_new_082",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in HJ with AQo. Effective stack is 100BB. What is the best action?",
        "explanation": "AQo is not strong enough often enough versus an open from MP.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "AQo",
            "facing_open"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_new_083",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in BB with QJs. Effective stack is 25BB. What is the best action?",
        "explanation": "QJs is not strong enough often enough versus an open from CO.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "QJs",
            "facing_open"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t2_new_084",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in HJ with QJs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "QJs is strong enough to open from HJ, especially at 30BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "QJs",
            "open_spot"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t2_carry_021",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "outs",
        "prompt": "You have a draw with 8 outs on the flop. How many outs do you have?",
        "explanation": "8 outs means 8 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "8",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 61
    },
    {
        "id": "t2_new_085",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in BB with 88. Effective stack is 40BB. What is the best action?",
        "explanation": "88 is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "facing_min_raise",
            "88",
            "facing_raise"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_086",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in SB with QJs. Effective stack is 100BB. What is the best action?",
        "explanation": "QJs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "SB",
            "facing_min_raise",
            "QJs",
            "facing_raise"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_new_087",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with JJ and 50BB effective. What is the best action?",
        "explanation": "JJ is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "UTG",
            "small_blind_vs_big_blind",
            "JJ",
            "blind_vs_blind"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_new_088",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in MP with ATs. Effective stack is 30BB. What is the best action?",
        "explanation": "ATs is not strong enough often enough versus an open from CO.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "ATs",
            "facing_open"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_carry_022",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in MP with T8. Effective stack is 75BB. Action folds to you.",
        "explanation": "At this stack depth and position, T8 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "MP",
            "T8",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_089",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO opens to 3BB. You are in MP with ATs. Effective stack is 20BB. What is the best action?",
        "explanation": "ATs is not strong enough often enough versus an open from CO.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "ATs",
            "facing_open"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_new_090",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in CO with QJs. Effective stack is 25BB. What is the best action?",
        "explanation": "QJs is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "QJs",
            "facing_open"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t2_new_091",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in BB with QJs. Effective stack is 30BB. What is the best action?",
        "explanation": "QJs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BB",
            "facing_min_raise",
            "QJs",
            "facing_raise"
        ],
        "difficultyScore": 64
    },
    {
        "id": "t2_new_092",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in HJ with ATs. Effective stack is 75BB. What is the best action?",
        "explanation": "ATs is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "ATs",
            "facing_open"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_carry_023",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in BB with AK. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, AK is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "AK",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 61
    },
    {
        "id": "t2_new_093",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in BB with 88. Effective stack is 20BB. What is the best action?",
        "explanation": "88 is not strong enough often enough versus an open from MP.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "88",
            "facing_open"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_new_094",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ makes a minimum raise. You are in CO with AQo. Effective stack is 20BB. What is the best action?",
        "explanation": "AQo plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "AQo",
            "facing_raise"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t2_new_095",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in HJ with 88. Effective stack is 75BB. What is the best action?",
        "explanation": "88 is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "facing_min_raise",
            "88",
            "facing_raise"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_096",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ makes a minimum raise. You are in UTG with AQo. Effective stack is 60BB. What is the best action?",
        "explanation": "AQo plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "UTG",
            "facing_min_raise",
            "AQo",
            "facing_raise"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_carry_024",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "outs",
        "prompt": "You have a draw with 12 outs on the flop. How many outs do you have?",
        "explanation": "12 outs means 12 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "12",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 61
    },
    {
        "id": "t2_new_097",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AA with 20BB effective. What is the best action?",
        "explanation": "AA is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "small_blind_vs_big_blind",
            "AA",
            "blind_vs_blind"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_new_098",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ makes a minimum raise. You are in HJ with 88. Effective stack is 25BB. What is the best action?",
        "explanation": "88 is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "HJ",
            "facing_min_raise",
            "88",
            "facing_raise"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_new_099",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in BTN with QJs. Effective stack is 20BB. What is the best action?",
        "explanation": "QJs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "QJs",
            "facing_raise"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_new_100",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QQ and 60BB effective. What is the best action?",
        "explanation": "QQ is strong enough to attack from the big blind when action is checked to a simplified decision point.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "small_blind_vs_big_blind",
            "QQ",
            "blind_vs_blind"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_carry_025",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 20. You have 20% equity. What is correct?",
        "explanation": "You need 28.6% equity. You have 20%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "FOLD",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t2_new_101",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP opens to 3BB. You are in BTN with 99. Effective stack is 50BB. What is the best action?",
        "explanation": "99 is not strong enough often enough versus an open from MP.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "99",
            "facing_open"
        ],
        "difficultyScore": 72
    },
    {
        "id": "t2_new_102",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in SB with JTs. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "JTs is strong enough to open from SB, especially at 50BB effective.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "SB",
            "folds_to_you",
            "JTs",
            "open_spot"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_103",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in BB with ATs. Effective stack is 20BB. What is the best action?",
        "explanation": "ATs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BB",
            "facing_min_raise",
            "ATs",
            "facing_raise"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_new_104",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in MP with KTs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "KTs is strong enough to open from MP, especially at 30BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "KTs",
            "open_spot"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_carry_026",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "outs",
        "prompt": "You have a draw with 9 outs on the flop. How many outs do you have?",
        "explanation": "9 outs means 9 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "9",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t2_new_105",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KQo with 100BB effective. What is the best action?",
        "explanation": "KQo is playable blind-versus-blind but not always a mandatory raise in a simplified model.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "small_blind_vs_big_blind",
            "KQo",
            "blind_vs_blind"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_new_106",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AJo and 100BB effective. What is the best action?",
        "explanation": "AJo can continue in a lower-pressure blind situation.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "SB",
            "small_blind_vs_big_blind",
            "AJo",
            "blind_vs_blind"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_107",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in MP with AJo. Effective stack is 20BB. Action folds to you. What is the best action?",
        "explanation": "AJo is strong enough to open from MP, especially at 20BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "AJo",
            "open_spot"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t2_new_108",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in BTN with KTs. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KTs is strong enough to open from BTN, especially at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "KTs",
            "open_spot"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_carry_027",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "outs",
        "prompt": "You have a draw with 12 outs on the flop. How many outs do you have?",
        "explanation": "12 outs means 12 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "12",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_109",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 3BB. You are in BB with AQo. Effective stack is 30BB. What is the best action?",
        "explanation": "AQo is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "AQo",
            "facing_open"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t2_new_110",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "BTN makes a minimum raise. You are in CO with 99. Effective stack is 60BB. What is the best action?",
        "explanation": "99 plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "99",
            "facing_raise"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t2_new_111",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in SB with ATs. Effective stack is 30BB. What is the best action?",
        "explanation": "ATs is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "facing_open_raise",
            "ATs",
            "facing_open"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_112",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in SB with QJs. Effective stack is 25BB. What is the best action?",
        "explanation": "QJs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "facing_min_raise",
            "QJs",
            "facing_raise"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t2_carry_028",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
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
            "from_tier_1"
        ],
        "difficultyScore": 61
    },
    {
        "id": "t2_new_113",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
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
            "facing_open"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_new_114",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "UTG makes a minimum raise. You are in CO with AQo. Effective stack is 25BB. What is the best action?",
        "explanation": "AQo plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_min_raise",
            "AQo",
            "facing_raise"
        ],
        "difficultyScore": 72
    },
    {
        "id": "t2_new_115",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in UTG with 88. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "88 is strong enough to open from UTG, especially at 25BB effective.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "UTG",
            "folds_to_you",
            "88",
            "open_spot"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_116",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "CO makes a minimum raise. You are in MP with QJs. Effective stack is 30BB. What is the best action?",
        "explanation": "QJs is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "MP",
            "facing_min_raise",
            "QJs",
            "facing_raise"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t2_carry_029",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
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
            "from_tier_1"
        ],
        "difficultyScore": 65
    },
    {
        "id": "t2_new_117",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in BTN with 88. Effective stack is 50BB. What is the best action?",
        "explanation": "88 is too marginal in this spot and should usually be folded.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "facing_min_raise",
            "88",
            "facing_raise"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t2_new_118",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
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
            "facing_raise"
        ],
        "difficultyScore": 64
    },
    {
        "id": "t2_new_119",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "MP makes a minimum raise. You are in MP with AQo. Effective stack is 20BB. What is the best action?",
        "explanation": "AQo plays well against a minimum raise and is often a profitable continue as a call.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "facing_min_raise",
            "AQo",
            "facing_raise"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t2_new_120",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 3BB. You are in BB with 88. Effective stack is 25BB. What is the best action?",
        "explanation": "88 is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "88",
            "facing_open"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t2_carry_030",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 3,
        "category": "action",
        "prompt": "You are in BTN with A5. Effective stack is 40BB. Action folds to you.",
        "explanation": "At this stack depth and position, A5 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BTN",
            "A5",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_121",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "9",
            "14",
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
        "id": "t2_new_122",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "8",
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
        "difficultyScore": 90
    },
    {
        "id": "t2_new_123",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "15",
            "9",
            "14",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t2_new_124",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t2_carry_031",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in SB with KK. Effective stack is 30BB. Action folds to you.",
        "explanation": "At this stack depth and position, KK is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "KK",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_125",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
        "difficultyScore": 89
    },
    {
        "id": "t2_new_126",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
        "id": "t2_new_127",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
        "id": "t2_new_128",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "11",
            "14",
            "9",
            "15"
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
        "id": "t2_carry_032",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You have a draw with 9 outs on the flop. How many outs do you have?",
        "explanation": "9 outs means 9 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "9",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_129",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "11",
            "15",
            "12",
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
        "id": "t2_new_130",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "9",
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
        "difficultyScore": 82
    },
    {
        "id": "t2_new_131",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "9",
            "10",
            "11",
            "12"
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
        "id": "t2_new_132",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "12",
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
        "difficultyScore": 90
    },
    {
        "id": "t2_carry_033",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You have a draw with 15 outs on the flop. How many outs do you have?",
        "explanation": "15 outs means 15 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_133",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 87
    },
    {
        "id": "t2_new_134",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "15",
            "9",
            "14",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t2_new_135",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 86
    },
    {
        "id": "t2_new_136",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "12",
            "8",
            "9",
            "10"
        ],
        "correctAnswer": "10",
        "tags": [
            "outs",
            "draw_math",
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t2_carry_034",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in SB with KK. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, KK is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "SB",
            "KK",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_137",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t2_new_138",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "9",
            "11",
            "14",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t2_new_139",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
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
        "difficultyScore": 85
    },
    {
        "id": "t2_new_140",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "15",
            "12",
            "9",
            "14"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t2_carry_035",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in BTN with K9. Effective stack is 40BB. Action folds to you.",
        "explanation": "At this stack depth and position, K9 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BTN",
            "K9",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_141",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "10",
            "11",
            "9",
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
        "id": "t2_new_142",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "8",
            "11",
            "10",
            "12"
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
        "id": "t2_new_143",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "11",
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
        "difficultyScore": 82
    },
    {
        "id": "t2_new_144",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "12",
            "8",
            "10",
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
        "id": "t2_carry_036",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in CO with AJ. Effective stack is 30BB. Action folds to you.",
        "explanation": "At this stack depth and position, AJ is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "AJ",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 85
    },
    {
        "id": "t2_new_145",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "12",
            "8",
            "9",
            "10"
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
        "id": "t2_new_146",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "14",
            "11",
            "9",
            "15"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 83
    },
    {
        "id": "t2_new_147",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "10",
            "12",
            "11",
            "8"
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
        "id": "t2_new_148",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "15",
            "9",
            "14",
            "11"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 87
    },
    {
        "id": "t2_carry_037",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in BTN with AK. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, AK is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "AK",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_149",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "11",
            "10",
            "12",
            "9"
        ],
        "correctAnswer": "10",
        "tags": [
            "outs",
            "draw_math",
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 91
    },
    {
        "id": "t2_new_150",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "14",
            "9",
            "15",
            "12"
        ],
        "correctAnswer": "15",
        "tags": [
            "outs",
            "draw_math",
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 87
    },
    {
        "id": "t2_new_151",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "11",
            "12",
            "9",
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
        "id": "t2_new_152",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 86
    },
    {
        "id": "t2_carry_038",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in BTN with J9. Effective stack is 50BB. Action folds to you.",
        "explanation": "At this stack depth and position, J9 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "J9",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_153",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
        "difficultyScore": 83
    },
    {
        "id": "t2_new_154",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t2_new_155",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t2_new_156",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t2_carry_039",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "action",
        "prompt": "You are in BB with AJ. Effective stack is 40BB. Action folds to you.",
        "explanation": "At this stack depth and position, AJ is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "AJ",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t2_new_157",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
        "difficultyScore": 89
    },
    {
        "id": "t2_new_158",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 86
    },
    {
        "id": "t2_new_159",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 10 outs in this simplified training model.",
        "choices": [
            "8",
            "10",
            "12",
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
        "id": "t2_new_160",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "14",
            "12",
            "15",
            "9"
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
        "id": "t2_carry_040",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 4,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 10. You have 25% equity. What is correct?",
        "explanation": "You need 16.7% equity. You have 25%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 81
    },
    {
        "id": "t2_new_161",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "This draw type gives you 14 outs in this simplified training model.",
        "choices": [
            "15",
            "10",
            "12",
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
        "id": "t2_new_162",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "9",
            "12",
            "14",
            "15"
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
        "id": "t2_new_163",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_164",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "This draw type gives you 14 outs in this simplified training model.",
        "choices": [
            "15",
            "12",
            "11",
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
        "id": "t2_carry_041",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You have a draw with 8 outs on the flop. How many outs do you have?",
        "explanation": "8 outs means 8 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "8",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_165",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "14",
            "15",
            "11",
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
        "id": "t2_new_166",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "11",
            "9",
            "12",
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
        "id": "t2_new_167",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_168",
        "tier": "apprentice",
        "tierIndex": 2,
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
            "pair_plus_flush_draw_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_carry_042",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 10. You have 35% equity. What is correct?",
        "explanation": "You need 16.7% equity. You have 35%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_169",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
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
            "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_170",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "This draw type gives you 15 outs in this simplified training model.",
        "choices": [
            "9",
            "15",
            "12",
            "11"
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
        "id": "t2_new_171",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_172",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_carry_043",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in MP with KK. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, KK is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "KK",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_173",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_174",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_175",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_176",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_carry_044",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in BB with 77. Effective stack is 75BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_177",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_178",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_179",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_180",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_carry_045",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "outs",
        "prompt": "You have a draw with 9 outs on the flop. How many outs do you have?",
        "explanation": "9 outs means 9 cards improve your hand.",
        "choices": [
            "4",
            "8",
            "9",
            "12",
            "15"
        ],
        "correctAnswer": "9",
        "tags": [
            "outs",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_181",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_182",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_183",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_184",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_carry_046",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "Pot is 50. Opponent bets 10. You have 35% equity. What is correct?",
        "explanation": "You need 16.7% equity. You have 35%.",
        "choices": [
            "CALL",
            "FOLD"
        ],
        "correctAnswer": "CALL",
        "tags": [
            "ev",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_185",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_186",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_187",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_188",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_carry_047",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in BB with 77. Effective stack is 75BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_189",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_190",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_191",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_new_192",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_carry_048",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in SB with QQ. Effective stack is 50BB. Action folds to you.",
        "explanation": "At this stack depth and position, QQ is strong enough to open for value.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "SB",
            "QQ",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_193",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_194",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_195",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_196",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 160. Your opponent bets 50. You estimate your equity at 26%. What is the best action?",
        "explanation": "You need 23.8% equity to call. Since your equity is 26%, the better simplified decision is CALL.",
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
        "id": "t2_carry_049",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in MP with 77. Effective stack is 20BB. Action folds to you.",
        "explanation": "At this stack depth and position, 77 is playable but not strong enough to raise aggressively.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "77",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t2_new_197",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 200. Your opponent bets 70. You estimate your equity at 24%. What is the best action?",
        "explanation": "You need 25.9% equity to call. Since your equity is 24%, the better simplified decision is FOLD.",
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
        "id": "t2_new_198",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_199",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_new_200",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "ev",
        "prompt": "The pot is 180. Your opponent bets 60. You estimate your equity at 30%. What is the best action?",
        "explanation": "You need 25.0% equity to call. Since your equity is 30%, the better simplified decision is CALL.",
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
        "id": "t2_carry_050",
        "tier": "apprentice",
        "tierIndex": 2,
        "level": 5,
        "category": "action",
        "prompt": "You are in SB with T8. Effective stack is 75BB. Action folds to you.",
        "explanation": "At this stack depth and position, T8 is too weak to continue from this position.",
        "correctAction": "fold",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "T8",
            "carryover",
            "from_tier_1"
        ],
        "difficultyScore": 100
    }
];
exports.tier2Questions = tier2QuestionsRaw.map((question) => ({
    ...question,
    prompt: `${question.prompt} [${question.id}]`,
}));
