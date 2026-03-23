import type { ChallengeQuestion } from './challengeQuestionTypes';

export type RuntimeChallenge = {
  id: string;
  category: ChallengeQuestion['category'];
  /** Fixed panel title derived from category: "GTO SCENARIO" | "OUTS" | "POT ODDS" */
  panelTitle: string;
  scenario: string;
  explanation: string;
  answerOptions: string[];
  correctAnswer: string;
  heroWins: boolean;
  heroPosition?: string;
  effectiveStackBb?: number;
  heroHand?: [string, string];
  villainHand?: [string, string];
  runout?: [string, string, string, string, string];
  /** Parsed hero hole cards for outs questions (e.g. ['Ac', 'Kc']) */
  heroCards?: string[];
  /** Parsed board cards for outs questions (e.g. ['9d', '4s', '2h']) */
  boardCards?: string[];
  tags: string[];
};

const ACTION_OPTIONS = ['FOLD', 'CALL', 'RAISE'];

const PANEL_TITLES: Record<ChallengeQuestion['category'], string> = {
  action: 'GTO SCENARIO',
  outs:   'OUTS',
  ev:     'POT ODDS',
};

function normalize(text: string): string {
  return text.trim().toUpperCase();
}

/** Strip any accidentally-included metadata prefix like "Beginner L3 OUTS: " */
function stripPrefix(prompt: string): string {
  return prompt.replace(/^[A-Za-z_][\w\s]*?L\d+\s+[A-Z]+:\s*/, '');
}

/** Parse hero and board cards from outs question prompts.
 *  Matches: "You hold Ac Kc on 9d 4s 2h" */
function parseOutsCards(prompt: string): { heroCards?: string[]; boardCards?: string[] } {
  const m = prompt.match(
    /you\s+hold\s+([2-9TJQKA][cdhs])\s+([2-9TJQKA][cdhs])\s+on\s+((?:[2-9TJQKA][cdhs]\s*){2,5})/i,
  );
  if (!m) return {};
  return {
    heroCards:  [m[1], m[2]],
    boardCards: m[3].trim().split(/\s+/),
  };
}

/** Format choice labels for readability.
 *  - Pure integers with outs context → "N outs"
 *  - Decimal/percentage strings ending in % → keep
 *  - Raw decimal ≤ 1 that look like fractions → convert to percent
 *  - Otherwise return as-is */
export function formatAnswerLabel(label: string, category: ChallengeQuestion['category']): string {
  const trimmed = label.trim();
  if (category === 'outs') {
    // Pure integer → "N outs"
    if (/^\d+$/.test(trimmed)) return `${trimmed} outs`;
  }
  if (category === 'ev') {
    // Already a percentage string
    if (trimmed.endsWith('%')) return trimmed;
    // Raw decimal ≤ 1 → percent
    const n = parseFloat(trimmed);
    if (!isNaN(n) && n > 0 && n <= 1) return `${Math.round(n * 100)}%`;
  }
  return trimmed;
}

/** Validate a question has the required fields for its category.
 *  Returns null if valid, or an error string if malformed. */
function validateQuestion(question: ChallengeQuestion): string | null {
  if (!question.prompt?.trim()) return 'missing prompt';
  if (question.category === 'action') {
    if (!question.correctAction) return 'missing correctAction';
  } else {
    if (!question.choices || question.choices.length === 0) return 'missing choices';
    if (!question.correctAnswer?.trim()) return 'missing correctAnswer';
  }
  return null;
}

export function adaptQuestionToRuntime(question: ChallengeQuestion): RuntimeChallenge | null {
  const validationError = validateQuestion(question);
  if (validationError) {
    if (__DEV__) console.warn(`[challenge] Skipping malformed question id="${question.id}": ${validationError}`);
    return null;
  }

  if (question.category === 'action') {
    return {
      id: question.id,
      category: question.category,
      panelTitle: PANEL_TITLES.action,
      scenario: question.prompt,
      explanation: question.explanation,
      answerOptions: ACTION_OPTIONS,
      correctAnswer: normalize(question.correctAction ?? ''),
      heroWins: question.correctAction !== 'fold',
      heroPosition: question.heroPosition,
      effectiveStackBb: question.effectiveStackBb,
      tags: question.tags,
    };
  }

  const cleanPrompt = stripPrefix(question.prompt);

  if (question.category === 'outs') {
    const { heroCards, boardCards } = parseOutsCards(cleanPrompt);
    const formattedChoices = (question.choices ?? []).map(c => formatAnswerLabel(c, 'outs'));
    return {
      id: question.id,
      category: question.category,
      panelTitle: PANEL_TITLES.outs,
      scenario: cleanPrompt,
      explanation: question.explanation,
      answerOptions: formattedChoices,
      correctAnswer: normalize(formatAnswerLabel(question.correctAnswer ?? '', 'outs')),
      heroWins: false,
      heroCards,
      boardCards,
      tags: question.tags,
    };
  }

  // EV / pot-odds
  const formattedChoices = (question.choices ?? []).map(c => formatAnswerLabel(c, 'ev'));
  return {
    id: question.id,
    category: question.category,
    panelTitle: PANEL_TITLES.ev,
    scenario: cleanPrompt,
    explanation: question.explanation,
    answerOptions: formattedChoices,
    correctAnswer: normalize(formatAnswerLabel(question.correctAnswer ?? '', 'ev')),
    // heroWins is a legacy compatibility field retained so UI components that
    // receive RuntimeChallenge don't need a type change. For outs/ev questions
    // it is NOT used for scoring or correctness — always derive outcome from
    // isRuntimeAnswerCorrect(). Callers must override with actual isCorrect
    // when passing to display components (e.g. ContinuePanel).
    heroWins: false,
    tags: question.tags,
  };
}

export function isRuntimeAnswerCorrect(challenge: RuntimeChallenge, selectedAnswer: string): boolean {
  return normalize(selectedAnswer) === challenge.correctAnswer;
}
