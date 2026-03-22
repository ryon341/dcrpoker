import type { ChallengeQuestion } from './challengeQuestionTypes';

export type RuntimeChallenge = {
  id: string;
  category: ChallengeQuestion['category'];
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
  tags: string[];
};

const ACTION_OPTIONS = ['FOLD', 'CALL', 'RAISE'];

function normalize(text: string): string {
  return text.trim().toUpperCase();
}

export function adaptQuestionToRuntime(question: ChallengeQuestion): RuntimeChallenge {
  if (question.category === 'action') {
    return {
      id: question.id,
      category: question.category,
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

  return {
    id: question.id,
    category: question.category,
    scenario: question.prompt,
    explanation: question.explanation,
    answerOptions: question.choices ?? [],
    correctAnswer: normalize(question.correctAnswer ?? ''),
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
