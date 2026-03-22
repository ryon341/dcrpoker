"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tierQuestionBanks = void 0;
exports.getQuestionsForTier = getQuestionsForTier;
exports.getTierIndexForGlobalLevel = getTierIndexForGlobalLevel;
exports.getTierForGlobalLevel = getTierForGlobalLevel;
exports.getLocalLevelWithinTier = getLocalLevelWithinTier;
exports.getQuestionsForGlobalLevel = getQuestionsForGlobalLevel;
const tier1Questions_1 = require("./tier1Questions");
const tier2Questions_1 = require("./tier2Questions");
const tier3Questions_1 = require("./tier3Questions");
const tier4Questions_1 = require("./tier4Questions");
const tier5Questions_1 = require("./tier5Questions");
exports.tierQuestionBanks = {
    beginner: tier1Questions_1.tier1Questions,
    apprentice: tier2Questions_1.tier2Questions,
    grinder: tier3Questions_1.tier3Questions,
    chip_leader: tier4Questions_1.tier4Questions,
    master: tier5Questions_1.tier5Questions,
};
function clampGlobalLevel(globalLevel) {
    if (!Number.isFinite(globalLevel))
        return 1;
    return Math.max(1, Math.min(25, Math.trunc(globalLevel)));
}
function getQuestionsForTier(tier) {
    return exports.tierQuestionBanks[tier];
}
function getTierIndexForGlobalLevel(globalLevel) {
    const clamped = clampGlobalLevel(globalLevel);
    if (clamped <= 5)
        return 1;
    if (clamped <= 10)
        return 2;
    if (clamped <= 15)
        return 3;
    if (clamped <= 20)
        return 4;
    return 5;
}
function getTierForGlobalLevel(globalLevel) {
    const tierIndex = getTierIndexForGlobalLevel(globalLevel);
    switch (tierIndex) {
        case 1:
            return 'beginner';
        case 2:
            return 'apprentice';
        case 3:
            return 'grinder';
        case 4:
            return 'chip_leader';
        case 5:
        default:
            return 'master';
    }
}
function getLocalLevelWithinTier(globalLevel) {
    const clamped = clampGlobalLevel(globalLevel);
    const localLevel = ((clamped - 1) % 5) + 1;
    return localLevel;
}
function getQuestionsForGlobalLevel(globalLevel) {
    const tier = getTierForGlobalLevel(globalLevel);
    const localLevel = getLocalLevelWithinTier(globalLevel);
    return exports.tierQuestionBanks[tier].filter((question) => question.level === localLevel);
}
