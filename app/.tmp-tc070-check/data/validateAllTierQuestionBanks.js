"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAllTierQuestionBanks = validateAllTierQuestionBanks;
exports.formatAllTierValidationSummary = formatAllTierValidationSummary;
const tierQuestionBanks_1 = require("./tierQuestionBanks");
const TIERS = ['beginner', 'apprentice', 'grinder', 'chip_leader', 'master'];
const EXPECTED_TIER_INDEX = {
    beginner: 1,
    apprentice: 2,
    grinder: 3,
    chip_leader: 4,
    master: 5,
};
const CATEGORIES = ['action', 'outs', 'ev'];
const EXPECTED_CATEGORY_DISTRIBUTION = {
    beginner: { action: 150, outs: 50, ev: 50 },
    apprentice: { action: 150, outs: 62, ev: 38 },
    grinder: { action: 150, outs: 62, ev: 38 },
    chip_leader: { action: 150, outs: 62, ev: 38 },
    master: { action: 150, outs: 62, ev: 38 },
};
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
function countBy(items, selector) {
    return items.reduce((acc, question) => {
        const key = String(selector(question));
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
}
function getSuspiciousCarryoverTag(tier, tags) {
    if (!tags.includes('carryover'))
        return null;
    const expectedFromTier = EXPECTED_TIER_INDEX[tier] - 1;
    if (expectedFromTier < 1) {
        return tags.some((tag) => tag.startsWith('from_tier_'))
            ? 'beginner tier should not include from_tier_* tags'
            : null;
    }
    const expectedTag = `from_tier_${expectedFromTier}`;
    const fromTierTags = tags.filter((tag) => tag.startsWith('from_tier_'));
    if (!fromTierTags.includes(expectedTag)) {
        return `expected ${expectedTag} for carryover question`;
    }
    const invalid = fromTierTags.filter((tag) => tag !== expectedTag);
    if (invalid.length > 0) {
        return `contains unexpected carryover references: ${invalid.join(', ')}`;
    }
    return null;
}
function validateAllTierQuestionBanks() {
    const errors = [];
    const warnings = [];
    const summaryLines = [];
    const allQuestions = TIERS.flatMap((tier) => tierQuestionBanks_1.tierQuestionBanks[tier]);
    if (allQuestions.length !== 1250) {
        errors.push(`Expected global total 1250 questions, found ${allQuestions.length}.`);
    }
    summaryLines.push(`Global total questions: ${allQuestions.length}`);
    for (const tier of TIERS) {
        const questions = tierQuestionBanks_1.tierQuestionBanks[tier];
        const expectedTierIndex = EXPECTED_TIER_INDEX[tier];
        if (questions.length !== 250) {
            errors.push(`Tier ${tier}: expected 250 questions, found ${questions.length}.`);
        }
        const byLevel = countBy(questions, (question) => question.level);
        const byCategory = countBy(questions, (question) => question.category);
        for (const level of [1, 2, 3, 4, 5]) {
            if ((byLevel[String(level)] ?? 0) !== 50) {
                errors.push(`Tier ${tier}: level ${level} expected 50 questions, found ${byLevel[String(level)] ?? 0}.`);
            }
        }
        const expectedCategoryDistribution = EXPECTED_CATEGORY_DISTRIBUTION[tier];
        for (const category of CATEGORIES) {
            const expected = expectedCategoryDistribution[category];
            const actual = byCategory[category] ?? 0;
            if (actual !== expected) {
                errors.push(`Tier ${tier}: category ${category} expected ${expected}, found ${actual}.`);
            }
        }
        summaryLines.push(`Tier ${expectedTierIndex} (${tier}) total: ${questions.length}`, `Tier ${expectedTierIndex} levels: ${(byLevel['1'] ?? 0)}/${(byLevel['2'] ?? 0)}/${(byLevel['3'] ?? 0)}/${(byLevel['4'] ?? 0)}/${(byLevel['5'] ?? 0)}`, `Tier ${expectedTierIndex} categories: action ${byCategory.action ?? 0}, outs ${byCategory.outs ?? 0}, ev ${byCategory.ev ?? 0}`);
        for (const question of questions) {
            if (!isNonEmptyString(question.id)) {
                errors.push(`Tier ${tier}: question has missing/empty id.`);
            }
            if (!isNonEmptyString(question.prompt)) {
                errors.push(`Tier ${tier}: question ${question.id} has missing/empty prompt.`);
            }
            if (!isNonEmptyString(question.explanation)) {
                errors.push(`Tier ${tier}: question ${question.id} has missing/empty explanation.`);
            }
            if (!Array.isArray(question.tags)) {
                errors.push(`Tier ${tier}: question ${question.id} tags must be an array.`);
            }
            if (typeof question.difficultyScore !== 'number' || Number.isNaN(question.difficultyScore)) {
                errors.push(`Tier ${tier}: question ${question.id} has invalid difficultyScore.`);
            }
            if (question.tier !== tier) {
                errors.push(`Tier ${tier}: question ${question.id} has tier=${question.tier}.`);
            }
            if (question.tierIndex !== expectedTierIndex) {
                errors.push(`Tier ${tier}: question ${question.id} tierIndex=${question.tierIndex} expected ${expectedTierIndex}.`);
            }
            if (![1, 2, 3, 4, 5].includes(question.level)) {
                errors.push(`Tier ${tier}: question ${question.id} has invalid level=${String(question.level)}.`);
            }
            if (!CATEGORIES.includes(question.category)) {
                errors.push(`Tier ${tier}: question ${question.id} has invalid category=${String(question.category)}.`);
            }
            if (question.category === 'action') {
                if (!isNonEmptyString(question.correctAction)) {
                    errors.push(`Action question ${question.id} is missing correctAction.`);
                }
            }
            else {
                if (!Array.isArray(question.choices) || question.choices.length === 0) {
                    errors.push(`${question.category} question ${question.id} is missing choices.`);
                }
                if (!isNonEmptyString(question.correctAnswer)) {
                    errors.push(`${question.category} question ${question.id} is missing correctAnswer.`);
                }
            }
            const carryoverIssue = getSuspiciousCarryoverTag(tier, question.tags);
            if (carryoverIssue) {
                warnings.push(`Tier ${tier}: ${question.id} ${carryoverIssue}.`);
            }
        }
    }
    const duplicateIds = allQuestions
        .reduce((acc, question) => {
        acc[question.id] = (acc[question.id] ?? 0) + 1;
        return acc;
    }, {});
    const duplicateIdGroups = Object.entries(duplicateIds).filter(([, count]) => count > 1);
    if (duplicateIdGroups.length > 0) {
        errors.push(`Duplicate IDs found (${duplicateIdGroups.length} groups): ${duplicateIdGroups
            .slice(0, 20)
            .map(([id, count]) => `${id} x${count}`)
            .join('; ')}`);
    }
    const duplicatePrompts = allQuestions
        .reduce((acc, question) => {
        acc[question.prompt] = (acc[question.prompt] ?? 0) + 1;
        return acc;
    }, {});
    const duplicatePromptGroups = Object.entries(duplicatePrompts).filter(([, count]) => count > 1);
    if (duplicatePromptGroups.length > 0) {
        errors.push(`Duplicate prompts found (${duplicatePromptGroups.length} groups): ${duplicatePromptGroups
            .slice(0, 20)
            .map(([prompt, count]) => `${prompt} x${count}`)
            .join('; ')}`);
    }
    summaryLines.push(`Global duplicate IDs: ${duplicateIdGroups.length}`, `Global duplicate prompts: ${duplicatePromptGroups.length}`, `Validation status: ${errors.length === 0 ? 'PASSED' : 'FAILED'}`);
    return {
        ok: errors.length === 0,
        errors,
        warnings,
        summaryLines,
    };
}
function formatAllTierValidationSummary(result) {
    const parts = [];
    parts.push(...result.summaryLines);
    if (result.warnings.length > 0) {
        parts.push('Warnings:');
        parts.push(...result.warnings.map((warning) => `- ${warning}`));
    }
    if (result.errors.length > 0) {
        parts.push('Errors:');
        parts.push(...result.errors.map((error) => `- ${error}`));
    }
    return parts.join('\n');
}
