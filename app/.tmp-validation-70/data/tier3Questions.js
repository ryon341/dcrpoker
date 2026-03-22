"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tier3Questions = void 0;
const tier3QuestionsRaw = [
    {
        "id": "t3_new_001",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "MP opens to 2.5BB. You are in MP with QQ. Effective stack is 75BB. What is the best action?",
        "explanation": "QQ is strong enough to reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "QQ",
            "facing_open"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t3_new_002",
        "tier": "grinder",
        "tierIndex": 3,
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
            "KK"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t3_new_003",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 98s with 100BB effective. What is the best action?",
        "explanation": "98s is playable in this simplified blind-versus-blind structure.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "98s"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_new_004",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "KQo"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t3_carry_001",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "facing_open",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t3_new_005",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "MP opens to 2.5BB. You are in CO with AKs. Effective stack is 25BB. What is the best action?",
        "explanation": "AKs is strong enough to reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AKs",
            "facing_open"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t3_new_006",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. SB 3-bets. You hold TT with 25BB effective. What is the best action?",
        "explanation": "TT is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "TT"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t3_new_007",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold 99 with 40BB effective. What is the best action?",
        "explanation": "99 is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "99"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t3_new_008",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in HJ holding JJ with 50BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t3_carry_002",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "from_tier_2"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t3_new_009",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from HJ. SB 3-bets. You hold TT with 50BB effective. What is the best action?",
        "explanation": "TT is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "TT"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t3_new_010",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with AKo. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "AKo is a profitable open from CO at 25BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "AKo",
            "open_spot"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t3_new_011",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KK with 25BB effective. What is the best action?",
        "explanation": "KK is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BB",
            "blind_vs_blind",
            "KK"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t3_new_012",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in CO with TT. Effective stack is 50BB. What is the best action?",
        "explanation": "TT is strong enough to continue, and flatting is reasonable in position or closing action.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "TT",
            "facing_open"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t3_carry_003",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_013",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "TT"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t3_new_014",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, CO calls, and action is on you in BB holding JJ with 50BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t3_new_015",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold TT with 40BB effective. What is the best action?",
        "explanation": "TT is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BTN",
            "blind_vs_blind",
            "TT"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t3_new_016",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You are in CO with KK. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "KK is a profitable open from CO at 40BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "KK",
            "open_spot"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_carry_004",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "facing_raise",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t3_new_017",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, BTN calls, and action is on you in SB holding 88 with 30BB effective. What is the best action?",
        "explanation": "88 can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "SB",
            "squeeze_spot",
            "88"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_new_018",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from BTN. BTN 3-bets. You hold AKo with 30BB effective. What is the best action?",
        "explanation": "AKo is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "facing_3bet",
            "AKo"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t3_new_019",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from BTN. SB 3-bets. You hold KK with 75BB effective. What is the best action?",
        "explanation": "KK is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "KK"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t3_new_020",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in BB with AA. Effective stack is 60BB. What is the best action?",
        "explanation": "AA is strong enough to reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "AA",
            "facing_open"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t3_carry_005",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 95
    },
    {
        "id": "t3_new_021",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "MP opens, BTN calls, and action is on you in BTN holding QJs with 100BB effective. What is the best action?",
        "explanation": "QJs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "QJs"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t3_new_022",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from HJ. BTN 3-bets. You hold AA with 40BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t3_new_023",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in BB holding JJ with 40BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_new_024",
        "tier": "grinder",
        "tierIndex": 3,
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
            "blind_vs_blind",
            "KK"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_carry_006",
        "tier": "grinder",
        "tierIndex": 3,
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
            "facing_raise",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 36
    },
    {
        "id": "t3_new_025",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, HJ calls, and action is on you in HJ holding KQs with 40BB effective. What is the best action?",
        "explanation": "KQs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "KQs"
        ],
        "difficultyScore": 30
    },
    {
        "id": "t3_new_026",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You are in MP with KK. Effective stack is 20BB. Action folds to you. What is the best action?",
        "explanation": "KK is a profitable open from MP at 20BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "KK",
            "open_spot"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t3_new_027",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, CO calls, and action is on you in SB holding AA with 40BB effective. What is the best action?",
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
        "difficultyScore": 27
    },
    {
        "id": "t3_new_028",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in BB holding T9s with 60BB effective. What is the best action?",
        "explanation": "T9s is too marginal for this squeeze configuration in a simplified model.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "T9s"
        ],
        "difficultyScore": 31
    },
    {
        "id": "t3_carry_007",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t3_new_029",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 87s and 20BB effective. What is the best action?",
        "explanation": "87s plays adequately in a blind-versus-blind spot in this simplified model.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "87s"
        ],
        "difficultyScore": 33
    },
    {
        "id": "t3_new_030",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, CO calls, and action is on you in BTN holding T9s with 20BB effective. What is the best action?",
        "explanation": "T9s is too marginal for this squeeze configuration in a simplified model.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "T9s"
        ],
        "difficultyScore": 35
    },
    {
        "id": "t3_new_031",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from CO. SB 3-bets. You hold AKs with 25BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t3_new_032",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in CO holding JJ with 25BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "CO",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 26
    },
    {
        "id": "t3_carry_008",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "open_spot",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 59
    },
    {
        "id": "t3_new_033",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You are in HJ with TT. Effective stack is 75BB. Action folds to you. What is the best action?",
        "explanation": "TT is a profitable open from HJ at 75BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "TT",
            "open_spot"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t3_new_034",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 99 with 60BB effective. What is the best action?",
        "explanation": "99 is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "99"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_new_035",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens, BTN calls, and action is on you in BTN holding AQs with 25BB effective. What is the best action?",
        "explanation": "AQs is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "AQs"
        ],
        "difficultyScore": 29
    },
    {
        "id": "t3_new_036",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You open from BTN. SB 3-bets. You hold AA with 40BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t3_carry_009",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "open_spot",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 56
    },
    {
        "id": "t3_new_037",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in UTG holding KQs with 30BB effective. What is the best action?",
        "explanation": "KQs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "UTG",
            "squeeze_spot",
            "KQs"
        ],
        "difficultyScore": 34
    },
    {
        "id": "t3_new_038",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in CO with AKs. Effective stack is 40BB. What is the best action?",
        "explanation": "AKs is strong enough to reraise for value against an open.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AKs",
            "facing_open"
        ],
        "difficultyScore": 27
    },
    {
        "id": "t3_new_039",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "facing_open"
        ],
        "difficultyScore": 32
    },
    {
        "id": "t3_new_040",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
        "category": "action",
        "prompt": "You are in BTN with AKo. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "AKo is a profitable open from BTN at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "AKo",
            "open_spot"
        ],
        "difficultyScore": 28
    },
    {
        "id": "t3_carry_010",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 1,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 91
    },
    {
        "id": "t3_new_041",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in CO holding AJs with 30BB effective. What is the best action?",
        "explanation": "AJs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "CO",
            "squeeze_spot",
            "AJs"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t3_new_042",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in SB with AQo. Effective stack is 60BB. What is the best action?",
        "explanation": "AQo is strong enough to continue, and flatting is reasonable in position or closing action.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "SB",
            "facing_open_raise",
            "AQo",
            "facing_open"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_new_043",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from CO. BTN 3-bets. You hold AKs with 50BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "UTG",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_new_044",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in HJ with AQo. Effective stack is 25BB. Action folds to you. What is the best action?",
        "explanation": "AQo is a profitable open from HJ at 25BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "AQo",
            "open_spot"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_carry_011",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "from_tier_2"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t3_new_045",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in BB with 99. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "99 is a profitable open from BB at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "folds_to_you",
            "99",
            "open_spot"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t3_new_046",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in CO with AJs. Effective stack is 50BB. What is the best action?",
        "explanation": "AJs is strong enough to continue, and flatting is reasonable in position or closing action.",
        "correctAction": "call",
        "heroPosition": "CO",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "AJs",
            "facing_open"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t3_new_047",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in MP with KQs. Effective stack is 60BB. Action folds to you. What is the best action?",
        "explanation": "KQs is a profitable open from MP at 60BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "KQs",
            "open_spot"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t3_new_048",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. BB 3-bets. You hold AJs with 100BB effective. What is the best action?",
        "explanation": "AJs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "AJs"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_carry_012",
        "tier": "grinder",
        "tierIndex": 3,
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
            "from_tier_2"
        ],
        "difficultyScore": 56
    },
    {
        "id": "t3_new_049",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "T9s"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_new_050",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in BB with 99. Effective stack is 30BB. What is the best action?",
        "explanation": "99 is strong enough to continue, and flatting is reasonable in position or closing action.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "99",
            "facing_open"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t3_new_051",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in BB with AQs. Effective stack is 60BB. What is the best action?",
        "explanation": "AQs is strong enough to continue, and flatting is reasonable in position or closing action.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "AQs",
            "facing_open"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t3_new_052",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens, HJ calls, and action is on you in BB holding JJ with 30BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_carry_013",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 98
    },
    {
        "id": "t3_new_053",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. SB 3-bets. You hold KQs with 30BB effective. What is the best action?",
        "explanation": "KQs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "UTG",
            "facing_3bet",
            "KQs"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_new_054",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from HJ. BB 3-bets. You hold AKs with 20BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t3_new_055",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold AA with 75BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_new_056",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold QQ with 75BB effective. What is the best action?",
        "explanation": "QQ is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t3_carry_014",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "pair_plus_open-ended_straight_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t3_new_057",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in HJ with AJs. Effective stack is 100BB. What is the best action?",
        "explanation": "AJs is not strong enough often enough versus an open from CO.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "HJ",
            "facing_open_raise",
            "AJs",
            "facing_open"
        ],
        "difficultyScore": 47
    },
    {
        "id": "t3_new_058",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from CO. BTN 3-bets. You hold KQs with 60BB effective. What is the best action?",
        "explanation": "KQs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "KQs"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t3_new_059",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "99"
        ],
        "difficultyScore": 47
    },
    {
        "id": "t3_new_060",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in BTN with KJs. Effective stack is 30BB. Action folds to you. What is the best action?",
        "explanation": "KJs is a profitable open from BTN at 30BB effective.",
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
        "difficultyScore": 50
    },
    {
        "id": "t3_carry_015",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 94
    },
    {
        "id": "t3_new_061",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "MP opens, BTN calls, and action is on you in HJ holding KQs with 40BB effective. What is the best action?",
        "explanation": "KQs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "KQs"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t3_new_062",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "MP opens, HJ calls, and action is on you in MP holding AA with 60BB effective. What is the best action?",
        "explanation": "AA is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "squeeze_spot",
            "AA"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t3_new_063",
        "tier": "grinder",
        "tierIndex": 3,
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
            "open_spot"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t3_new_064",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with T9s and 50BB effective. What is the best action?",
        "explanation": "T9s plays adequately in a blind-versus-blind spot in this simplified model.",
        "correctAction": "call",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "T9s"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_carry_016",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "pair_plus_open-ended_straight_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 97
    },
    {
        "id": "t3_new_065",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold QQ with 75BB effective. What is the best action?",
        "explanation": "QQ is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 55
    },
    {
        "id": "t3_new_066",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. BTN 3-bets. You hold AA with 40BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t3_new_067",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens, CO calls, and action is on you in HJ holding JJ with 75BB effective. What is the best action?",
        "explanation": "JJ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "HJ",
            "squeeze_spot",
            "JJ"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t3_new_068",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in UTG with 99. Effective stack is 100BB. What is the best action?",
        "explanation": "99 is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "facing_open_raise",
            "99",
            "facing_open"
        ],
        "difficultyScore": 48
    },
    {
        "id": "t3_carry_017",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "pair_plus_open-ended_straight_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 96
    },
    {
        "id": "t3_new_069",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AA with 50BB effective. What is the best action?",
        "explanation": "AA is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "AA"
        ],
        "difficultyScore": 54
    },
    {
        "id": "t3_new_070",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold QQ with 30BB effective. What is the best action?",
        "explanation": "QQ is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t3_new_071",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in UTG with 88. Effective stack is 75BB. What is the best action?",
        "explanation": "88 is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "UTG",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "UTG",
            "facing_open_raise",
            "88",
            "facing_open"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t3_new_072",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AA and 60BB effective. What is the best action?",
        "explanation": "AA is strong enough to attack or continue aggressively in a blind battle.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "AA"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_carry_018",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_073",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in MP with AJs. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "AJs is a profitable open from MP at 50BB effective.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "MP",
            "folds_to_you",
            "AJs",
            "open_spot"
        ],
        "difficultyScore": 51
    },
    {
        "id": "t3_new_074",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold AJs with 100BB effective. What is the best action?",
        "explanation": "AJs is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "blind_vs_blind",
            "AJs"
        ],
        "difficultyScore": 49
    },
    {
        "id": "t3_new_075",
        "tier": "grinder",
        "tierIndex": 3,
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
            "open_spot"
        ],
        "difficultyScore": 46
    },
    {
        "id": "t3_new_076",
        "tier": "grinder",
        "tierIndex": 3,
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
            "KQs"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t3_carry_019",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "from_tier_2"
        ],
        "difficultyScore": 76
    },
    {
        "id": "t3_new_077",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
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
            "KQs"
        ],
        "difficultyScore": 53
    },
    {
        "id": "t3_new_078",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You are in CO with AQo. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "AQo is a profitable open from CO at 40BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "AQo",
            "open_spot"
        ],
        "difficultyScore": 50
    },
    {
        "id": "t3_new_079",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with QQ and 40BB effective. What is the best action?",
        "explanation": "QQ is strong enough to attack or continue aggressively in a blind battle.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_new_080",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 2,
        "category": "action",
        "prompt": "You open from BTN. BB 3-bets. You hold AQs with 75BB effective. What is the best action?",
        "explanation": "AQs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "AQs"
        ],
        "difficultyScore": 52
    },
    {
        "id": "t3_carry_020",
        "tier": "grinder",
        "tierIndex": 3,
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
            "open_spot",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 58
    },
    {
        "id": "t3_new_081",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "open_spot"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_082",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from BTN. BB 3-bets. You hold AA with 40BB effective. What is the best action?",
        "explanation": "AA is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "facing_3bet",
            "AA"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_new_083",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with 99 and 30BB effective. What is the best action?",
        "explanation": "99 is strong enough to attack or continue aggressively in a blind battle.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "99"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t3_new_084",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens, BTN calls, and action is on you in BTN holding QJs with 50BB effective. What is the best action?",
        "explanation": "QJs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BTN",
            "squeeze_spot",
            "QJs"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t3_carry_021",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_085",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in MP with AJo. Effective stack is 20BB. What is the best action?",
        "explanation": "AJo is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "AJo",
            "facing_open"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_new_086",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You are in UTG with KQo. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "KQo is a profitable open from UTG at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
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
        "id": "t3_new_087",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in BB with 66. Effective stack is 50BB. What is the best action?",
        "explanation": "66 is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "66",
            "facing_open"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t3_new_088",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "In a simplified blind-versus-blind spot, you are in the big blind with AJo and 20BB effective. What is the best action?",
        "explanation": "AJo is strong enough to attack or continue aggressively in a blind battle.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "AJo"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t3_carry_022",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_089",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You are in CO with 77. Effective stack is 40BB. Action folds to you. What is the best action?",
        "explanation": "77 is a profitable open from CO at 40BB effective.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "folds_to_you",
            "77",
            "open_spot"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t3_new_090",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 98s with 75BB effective. What is the best action?",
        "explanation": "98s is playable in this simplified blind-versus-blind structure.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "blind_vs_blind",
            "98s"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t3_new_091",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens, BTN calls, and action is on you in SB holding QQ with 75BB effective. What is the best action?",
        "explanation": "QQ is strong enough to squeeze for value after a raise and a call.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "SB",
            "squeeze_spot",
            "QQ"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t3_new_092",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in CO with KJs. Effective stack is 100BB. What is the best action?",
        "explanation": "KJs is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "CO",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "CO",
            "facing_open_raise",
            "KJs",
            "facing_open"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_carry_023",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "facing_open",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 62
    },
    {
        "id": "t3_new_093",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "MP opens to 2.5BB. You are in HJ with ATs. Effective stack is 75BB. What is the best action?",
        "explanation": "ATs is not strong enough often enough versus an open from MP.",
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
        "difficultyScore": 72
    },
    {
        "id": "t3_new_094",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "AQs"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t3_new_095",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "CO opens to 2.5BB. You are in BTN with 66. Effective stack is 75BB. What is the best action?",
        "explanation": "66 is not strong enough often enough versus an open from CO.",
        "correctAction": "fold",
        "heroPosition": "BTN",
        "effectiveStackBb": 75,
        "tags": [
            "preflop",
            "BTN",
            "facing_open_raise",
            "66",
            "facing_open"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_096",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from CO. BB 3-bets. You hold 99 with 25BB effective. What is the best action?",
        "explanation": "99 is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "MP",
            "facing_3bet",
            "99"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t3_carry_024",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "facing_raise",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 62
    },
    {
        "id": "t3_new_097",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "88"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t3_new_098",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "facing_open"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_099",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens, HJ calls, and action is on you in MP holding KQs with 100BB effective. What is the best action?",
        "explanation": "KQs can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "MP",
            "squeeze_spot",
            "KQs"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t3_new_100",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "HJ opens to 2.5BB. You are in MP with 66. Effective stack is 20BB. What is the best action?",
        "explanation": "66 is not strong enough often enough versus an open from HJ.",
        "correctAction": "fold",
        "heroPosition": "MP",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "MP",
            "facing_open_raise",
            "66",
            "facing_open"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_carry_025",
        "tier": "grinder",
        "tierIndex": 3,
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
            "facing_open",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_new_101",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from HJ. SB 3-bets. You hold AJs with 30BB effective. What is the best action?",
        "explanation": "AJs is often strong enough to continue against a 3-bet, but not always a mandatory 4-bet in this simplified model.",
        "correctAction": "call",
        "heroPosition": "BTN",
        "effectiveStackBb": 30,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "AJs"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t3_new_102",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from BTN. SB 3-bets. You hold AKs with 60BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BTN",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_103",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "open_spot"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_104",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "MP opens, BTN calls, and action is on you in BB holding JTs with 60BB effective. What is the best action?",
        "explanation": "JTs is too marginal for this squeeze configuration in a simplified model.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "BB",
            "squeeze_spot",
            "JTs"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t3_carry_026",
        "tier": "grinder",
        "tierIndex": 3,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t3_new_105",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "QQ"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t3_new_106",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "AA"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t3_new_107",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from HJ. BTN 3-bets. You hold AKs with 40BB effective. What is the best action?",
        "explanation": "AKs is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "SB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "SB",
            "facing_3bet",
            "AKs"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t3_new_108",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 87s with 20BB effective. What is the best action?",
        "explanation": "87s is too weak to continue from the small blind here.",
        "correctAction": "fold",
        "heroPosition": "HJ",
        "effectiveStackBb": 20,
        "tags": [
            "preflop",
            "HJ",
            "blind_vs_blind",
            "87s"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_carry_027",
        "tier": "grinder",
        "tierIndex": 3,
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
            "from_tier_2"
        ],
        "difficultyScore": 62
    },
    {
        "id": "t3_new_109",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold 88 with 60BB effective. What is the best action?",
        "explanation": "88 is playable in this simplified blind-versus-blind structure.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 60,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "88"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_110",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You are in HJ with KTs. Effective stack is 50BB. Action folds to you. What is the best action?",
        "explanation": "KTs is a profitable open from HJ at 50BB effective.",
        "correctAction": "raise",
        "heroPosition": "HJ",
        "effectiveStackBb": 50,
        "tags": [
            "preflop",
            "HJ",
            "folds_to_you",
            "KTs",
            "open_spot"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_new_111",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens, BTN calls, and action is on you in MP holding 99 with 100BB effective. What is the best action?",
        "explanation": "99 can continue profitably, but a call is the simpler recommended option here.",
        "correctAction": "call",
        "heroPosition": "MP",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "MP",
            "squeeze_spot",
            "99"
        ],
        "difficultyScore": 70
    },
    {
        "id": "t3_new_112",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "UTG opens to 2.5BB. You are in BB with 66. Effective stack is 40BB. What is the best action?",
        "explanation": "66 is not strong enough often enough versus an open from UTG.",
        "correctAction": "fold",
        "heroPosition": "BB",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "BB",
            "facing_open_raise",
            "66",
            "facing_open"
        ],
        "difficultyScore": 68
    },
    {
        "id": "t3_carry_028",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "facing_open",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 62
    },
    {
        "id": "t3_new_113",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold T9s with 100BB effective. What is the best action?",
        "explanation": "T9s is playable in this simplified blind-versus-blind structure.",
        "correctAction": "call",
        "heroPosition": "SB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "SB",
            "blind_vs_blind",
            "T9s"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t3_new_114",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "TT"
        ],
        "difficultyScore": 67
    },
    {
        "id": "t3_new_115",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold TT with 25BB effective. What is the best action?",
        "explanation": "TT is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "MP",
        "effectiveStackBb": 25,
        "tags": [
            "preflop",
            "MP",
            "blind_vs_blind",
            "TT"
        ],
        "difficultyScore": 75
    },
    {
        "id": "t3_new_116",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold KQo with 100BB effective. What is the best action?",
        "explanation": "KQo is playable in this simplified blind-versus-blind structure.",
        "correctAction": "call",
        "heroPosition": "UTG",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "UTG",
            "blind_vs_blind",
            "KQo"
        ],
        "difficultyScore": 66
    },
    {
        "id": "t3_carry_029",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t3_new_117",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "T9s"
        ],
        "difficultyScore": 74
    },
    {
        "id": "t3_new_118",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You open from BTN. BTN 3-bets. You hold QQ with 100BB effective. What is the best action?",
        "explanation": "QQ is strong enough to continue aggressively against a 3-bet.",
        "correctAction": "raise",
        "heroPosition": "BB",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BB",
            "facing_3bet",
            "QQ"
        ],
        "difficultyScore": 69
    },
    {
        "id": "t3_new_119",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "You are in BTN with AJo. Effective stack is 100BB. Action folds to you. What is the best action?",
        "explanation": "AJo is a profitable open from BTN at 100BB effective.",
        "correctAction": "raise",
        "heroPosition": "BTN",
        "effectiveStackBb": 100,
        "tags": [
            "preflop",
            "BTN",
            "folds_to_you",
            "AJo",
            "open_spot"
        ],
        "difficultyScore": 73
    },
    {
        "id": "t3_new_120",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
        "category": "action",
        "prompt": "Action folds to you in the small blind. You hold QQ with 40BB effective. What is the best action?",
        "explanation": "QQ is strong enough to apply pressure from the small blind.",
        "correctAction": "raise",
        "heroPosition": "CO",
        "effectiveStackBb": 40,
        "tags": [
            "preflop",
            "CO",
            "blind_vs_blind",
            "QQ"
        ],
        "difficultyScore": 71
    },
    {
        "id": "t3_carry_030",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 3,
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
            "from_tier_2"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t3_new_121",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t3_new_122",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 85
    },
    {
        "id": "t3_new_123",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 85
    },
    {
        "id": "t3_new_124",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 86
    },
    {
        "id": "t3_carry_031",
        "tier": "grinder",
        "tierIndex": 3,
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
            "flush_draw_plus_two_overcards",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t3_new_125",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "9",
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
        "difficultyScore": 89
    },
    {
        "id": "t3_new_126",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t3_new_127",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "14",
            "12",
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
        "id": "t3_new_128",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t3_carry_032",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_129",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t3_new_130",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t3_new_131",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 93
    },
    {
        "id": "t3_new_132",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "9",
            "15",
            "14",
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
        "id": "t3_carry_033",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "blind_vs_blind",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_133",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 85
    },
    {
        "id": "t3_new_134",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "11",
            "10",
            "8",
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
        "id": "t3_new_135",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 89
    },
    {
        "id": "t3_new_136",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "14",
            "11",
            "9"
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
        "id": "t3_carry_034",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_137",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 91
    },
    {
        "id": "t3_new_138",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 84
    },
    {
        "id": "t3_new_139",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 91
    },
    {
        "id": "t3_new_140",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "15",
            "9",
            "14"
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
        "id": "t3_carry_035",
        "tier": "grinder",
        "tierIndex": 3,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t3_new_141",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 86
    },
    {
        "id": "t3_new_142",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "11",
            "14",
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
        "id": "t3_new_143",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 89
    },
    {
        "id": "t3_new_144",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "14",
            "12",
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
        "id": "t3_carry_036",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_145",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t3_new_146",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 93
    },
    {
        "id": "t3_new_147",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 84
    },
    {
        "id": "t3_new_148",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
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
        "difficultyScore": 87
    },
    {
        "id": "t3_carry_037",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "open_spot",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_149",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a flush draw plus two overcards. How many outs do you have?",
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
            "flush_draw_plus_two_overcards"
        ],
        "difficultyScore": 88
    },
    {
        "id": "t3_new_150",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a pair plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 10 outs.",
        "choices": [
            "10",
            "11",
            "8",
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
        "id": "t3_new_151",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 92
    },
    {
        "id": "t3_new_152",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "15",
            "12",
            "11",
            "14"
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
        "id": "t3_carry_038",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "facing_raise",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_153",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t3_new_154",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 91
    },
    {
        "id": "t3_new_155",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
        "category": "outs",
        "prompt": "You hold a open-ended straight flush draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
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
        "difficultyScore": 93
    },
    {
        "id": "t3_new_156",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "open-ended_straight_flush_draw"
        ],
        "difficultyScore": 90
    },
    {
        "id": "t3_carry_039",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "facing_raise",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_157",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 87
    },
    {
        "id": "t3_new_158",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 92
    },
    {
        "id": "t3_new_159",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "pair_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 89
    },
    {
        "id": "t3_new_160",
        "tier": "grinder",
        "tierIndex": 3,
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
        "difficultyScore": 85
    },
    {
        "id": "t3_carry_040",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 4,
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
            "from_tier_2"
        ],
        "difficultyScore": 82
    },
    {
        "id": "t3_new_161",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pair_plus_flush_draw_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_162",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "11",
            "15",
            "14",
            "9"
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
        "id": "t3_new_163",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
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
        "id": "t3_new_164",
        "tier": "grinder",
        "tierIndex": 3,
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_041",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "open-ended_straight_flush_draw",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_165",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_166",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "15",
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
        "id": "t3_new_167",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a monster combo draw: flush draw plus open-ended straight draw. How many outs do you have?",
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
            "monster_combo_draw:_flush_draw_plus_open-ended_straight_draw"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_168",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 15 outs.",
        "choices": [
            "12",
            "14",
            "15",
            "11"
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
        "id": "t3_carry_042",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "blind_vs_blind",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_169",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a pair plus flush draw plus overcard. How many outs do you have?",
        "explanation": "In this simplified training model, that draw gives you 14 outs.",
        "choices": [
            "11",
            "15",
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
        "id": "t3_new_170",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
        "category": "outs",
        "prompt": "You hold a flush draw plus gutshot plus overcard. How many outs do you have?",
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
            "flush_draw_plus_gutshot_plus_overcard"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_171",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_172",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_043",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_173",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_174",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_175",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_176",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_044",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_177",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_178",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_179",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_180",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_045",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_181",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_182",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_183",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_184",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_046",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds",
            "carryover",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_185",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_186",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_187",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_188",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_047",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_189",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_190",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_191",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_192",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_048",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "from_tier_1",
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_193",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_194",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_195",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_196",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_049",
        "tier": "grinder",
        "tierIndex": 3,
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
            "from_tier_2"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_197",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_198",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_199",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_new_200",
        "tier": "grinder",
        "tierIndex": 3,
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
            "pot_odds"
        ],
        "difficultyScore": 100
    },
    {
        "id": "t3_carry_050",
        "tier": "grinder",
        "tierIndex": 3,
        "level": 5,
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
            "from_tier_2"
        ],
        "difficultyScore": 100
    }
];
exports.tier3Questions = tier3QuestionsRaw.map((question) => ({
    ...question,
    prompt: `${question.prompt} [${question.id}]`,
}));
