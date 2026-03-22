import type { ChallengeQuestion } from '../challengeQuestionTypes';

export type BankValidationResult = {
  ok: boolean;
  errors: string[];
};

function countBy<T extends string | number>(items: ChallengeQuestion[], selector: (q: ChallengeQuestion) => T): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, q) => {
    const key = String(selector(q));
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function validateTier1BeginnerBank(questions: ChallengeQuestion[]): BankValidationResult {
  const errors: string[] = [];

  if (questions.length !== 250) {
    errors.push(`Expected 250 questions, found ${questions.length}.`);
  }

  const idSet = new Set<string>();
  const promptSet = new Set<string>();

  for (const q of questions) {
    if (idSet.has(q.id)) errors.push(`Duplicate id: ${q.id}`);
    idSet.add(q.id);

    if (promptSet.has(q.prompt)) errors.push(`Duplicate prompt: ${q.prompt}`);
    promptSet.add(q.prompt);

    if (q.category === 'action') {
      if (!q.correctAction) errors.push(`Action question missing correctAction: ${q.id}`);
      if (q.choices || q.correctAnswer) errors.push(`Action question should not contain choices/correctAnswer: ${q.id}`);
    } else {
      if (!q.choices || q.choices.length < 2) errors.push(`Math question missing choices: ${q.id}`);
      if (!q.correctAnswer) errors.push(`Math question missing correctAnswer: ${q.id}`);
    }
  }

  const byLevel = countBy(questions, (q) => q.level);
  for (const level of [1, 2, 3, 4, 5]) {
    const levelQuestions = questions.filter((q) => q.level === level);
    if ((byLevel[String(level)] ?? 0) !== 50) {
      errors.push(`Level ${level} should have 50 questions, found ${byLevel[String(level)] ?? 0}.`);
    }

    const levelByCategory = countBy(levelQuestions, (q) => q.category);
    if ((levelByCategory.action ?? 0) !== 30) {
      errors.push(`Level ${level} should have 30 action questions, found ${levelByCategory.action ?? 0}.`);
    }
    if ((levelByCategory.outs ?? 0) !== 10) {
      errors.push(`Level ${level} should have 10 outs questions, found ${levelByCategory.outs ?? 0}.`);
    }
    if ((levelByCategory.ev ?? 0) !== 10) {
      errors.push(`Level ${level} should have 10 ev questions, found ${levelByCategory.ev ?? 0}.`);
    }
  }

  const byCategory = countBy(questions, (q) => q.category);
  if ((byCategory.action ?? 0) !== 150) errors.push(`Tier should have 150 action questions, found ${byCategory.action ?? 0}.`);
  if ((byCategory.outs ?? 0) !== 50) errors.push(`Tier should have 50 outs questions, found ${byCategory.outs ?? 0}.`);
  if ((byCategory.ev ?? 0) !== 50) errors.push(`Tier should have 50 ev questions, found ${byCategory.ev ?? 0}.`);

  return {
    ok: errors.length === 0,
    errors,
  };
}
