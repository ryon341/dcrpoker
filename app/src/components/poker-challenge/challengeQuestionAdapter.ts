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
  action:   'GTO SCENARIO',
  outs:     'OUTS',
  ev:       'POT ODDS',
  position: 'POSITION',
  pressure: 'PRESSURE SPOT',
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

/** Extract all suit-specific card tokens (e.g. 'Ac', '6h') found in a text string. */
function extractCardTokens(text: string): string[] {
  const matches = text.match(/\b[2-9TJQKA][cdhs]\b/g);
  return matches ?? [];
}

/**
 * Convert a hand name like 'AA', 'AKs', 'AKo', 'QJ' into a concrete two-card tuple.
 * Pairs use hearts + spades; suited hands use matching hearts; offsuit use h+d.
 */
function handNameToCards(hand: string): [string, string] | null {
  const m = hand.toUpperCase().match(/^([2-9TJQKA])([2-9TJQKA])([SO]?)$/);
  if (!m) return null;
  const [, r1, r2, qual] = m;
  if (r1 === r2) return [`${r1}h`, `${r2}s`];
  const suit2 = qual === 'O' ? 'd' : 'h';
  return [`${r1}h`, `${r2}${suit2}`];
}

/**
 * Extract hero hand from prompts like "...with AKs..." or "...holding QQ...".
 * Returns a two-card tuple or undefined.
 */
function parseHeroHandFromPrompt(prompt: string): [string, string] | undefined {
  const m = prompt.match(/\b(?:with|holding)\s+([2-9TJQKA]{2,3}[so]?)\b/i);
  if (!m) return undefined;
  return handNameToCards(m[1]) ?? undefined;
}

/**
 * Parse cards for action questions, trying three strategies in order:
 * 1. "You hold X Y on Z A B" notation (explicit suit tokens)
 * 2. "with [HAND]" / "holding [HAND]" generic hand names
 * 3. Raw suit-specific card tokens scattered in the prompt
 */
function parseActionCards(prompt: string): { heroCards?: string[]; boardCards?: string[] } {
  // Strategy 1: explicit "you hold" pattern with suit tokens
  const outsResult = parseOutsCards(prompt);
  if (outsResult.heroCards) return outsResult;

  // Strategy 2: generic hand name like "with AA" or "with AKs"
  const heroHandTuple = parseHeroHandFromPrompt(prompt);
  if (heroHandTuple) return { heroCards: [...heroHandTuple] };

  // Strategy 3: raw card tokens in order
  const tokens = extractCardTokens(prompt);
  if (tokens.length >= 2) {
    return {
      heroCards:  tokens.slice(0, 2),
      boardCards: tokens.length > 2 ? tokens.slice(2) : undefined,
    };
  }

  return {};
}

/**
 * Strip the "You hold X Y on Z A B" clause and lingering card tokens
 * from the scenario so raw notation is not duplicated when cards are
 * shown visually.
 */
function stripCardNotation(text: string, cards: string[]): string {
  if (cards.length === 0) return text;
  // Remove the full "you hold ... on ..." clause first
  let result = text
    .replace(
      /you\s+hold\s+(?:[2-9TJQKA][cdhs]\s+){1,2}on\s+(?:[2-9TJQKA][cdhs]\s*){2,5}/gi,
      '',
    )
    .trim();
  // Also strip generic hand-name references like "with AKs" or "holding QQ"
  result = result
    .replace(/\b(?:with|holding)\s+[2-9TJQKA]{2,3}[so]?\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./, '.')
    .trim();
  // Strip any remaining suit-specific card tokens
  for (const card of cards) {
    if (/[cdhs]$/.test(card)) {
      result = result.replace(new RegExp(`\\b${card}\\b`, 'g'), '');
    }
  }
  result = result.replace(/\s{2,}/g, ' ').trim();
  return result || text;
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
    // Parse cards from the prompt using hand-name or token strategies
    const { heroCards, boardCards } = parseActionCards(question.prompt);
    const allParsedCards = [...(heroCards ?? []), ...(boardCards ?? [])];
    const displayScenario = heroCards
      ? stripCardNotation(question.prompt, allParsedCards)
      : question.prompt;
    return {
      id: question.id,
      category: question.category,
      panelTitle: PANEL_TITLES.action,
      scenario: displayScenario,
      explanation: question.explanation,
      answerOptions: ACTION_OPTIONS,
      correctAnswer: normalize(question.correctAction ?? ''),
      heroWins: question.correctAction !== 'fold',
      heroPosition: question.heroPosition,
      effectiveStackBb: question.effectiveStackBb,
      heroCards,
      boardCards,
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

  // position — explicit branch so it gets the correct panelTitle
  if (question.category === 'position') {
    const formattedChoices = (question.choices ?? []).map(c => formatAnswerLabel(c, 'position'));
    return {
      id: question.id,
      category: question.category,
      panelTitle: PANEL_TITLES.position,
      scenario: cleanPrompt,
      explanation: question.explanation,
      answerOptions: formattedChoices,
      correctAnswer: normalize(formatAnswerLabel(question.correctAnswer ?? '', 'position')),
      heroWins: false,
      tags: question.tags,
    };
  }

  // pressure — explicit branch so it gets the correct panelTitle
  if (question.category === 'pressure') {
    const formattedChoices = (question.choices ?? []).map(c => formatAnswerLabel(c, 'pressure'));
    return {
      id: question.id,
      category: question.category,
      panelTitle: PANEL_TITLES.pressure,
      scenario: cleanPrompt,
      explanation: question.explanation,
      answerOptions: formattedChoices,
      correctAnswer: normalize(formatAnswerLabel(question.correctAnswer ?? '', 'pressure')),
      heroWins: false,
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
