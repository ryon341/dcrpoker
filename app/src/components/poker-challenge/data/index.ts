export { tier1BeginnerQuestions, getTier1ByLevel, getTier1ByCategory } from './tier1BeginnerQuestions';
export { validateTier1BeginnerBank, validateTier2ApprenticeBank } from './validateChallengeQuestionBank';
export { tier1Questions } from './tier1Questions';
export { tier2Questions } from './tier2Questions';
export { tier2ApprenticeQuestions, getTier2ByLevel, getTier2ByCategory } from './tier2ApprenticeQuestions';
export { tier3Questions } from './tier3Questions';
export { tier4Questions } from './tier4Questions';
export { tier5Questions } from './tier5Questions';
// ─── TC092/TC093/TC094: generated banks + normalized registry ─────────────────
export {
	CHALLENGE_BANKS,
	validateTierBank,
	validateAllChallengeBanks,
	validateReviewedBanks,
	generatedBeginnerQuestions,
	generatedApprenticeQuestions,
	generatedGrinderQuestions,
	generatedChipLeaderQuestions,
	generatedMasterQuestions,
	type TierBankValidationResult,
	type AllChallengeBanksValidationResult,
	type ReviewedBanksValidationResult,
} from './challengeQuestionBankRegistry';
export {
	rawTierQuestionBanks,
	tierQuestionBanks,
	getQuestionsForTier,
	getTierForGlobalLevel,
	getTierIndexForGlobalLevel,
	getLocalLevelWithinTier,
	getQuestionsForGlobalLevel,
	getPreviousTierForGlobalLevel,
} from './tierQuestionBanks';
export {
	validateAllTierQuestionBanks,
	formatAllTierValidationSummary,
} from './validateAllTierQuestionBanks';
// ─── TC089: dev-only audit + status utilities ──────────────────────────────────
export {
	runQuestionBankAudit,
	formatAuditReport,
	type QuestionBankAuditReport,
	type AuditError,
	type TierAuditResult,
} from './validateQuestionBank';
export {
	runSamplingAudit,
	formatSamplingReport,
	type SamplingAuditReport,
	type LevelSamplingResult,
} from './auditTierSampling';
export {
	questionBankStatus,
	formatBankStatus,
	QUESTION_BANK_TARGET,
	QUESTION_BANK_TOTAL_TARGET,
	TIER_CATEGORY_TARGETS,
	type QuestionBankStatus,
	type TierStatusEntry,
} from './questionBankStatus';
