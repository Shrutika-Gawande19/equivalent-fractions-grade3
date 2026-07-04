import { shuffleArray } from './shuffle';

export function calcXP(attempts, hintsUsed, streak) {
  let xp = 0;
  if (attempts === 1) xp = 10;
  else if (attempts === 2) xp = 7;
  else xp = 5;

  if (hintsUsed > 0) xp -= hintsUsed;
  if (streak >= 5) xp += 5;

  return Math.max(xp, 0);
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((acc, score) => {
    if (score >= 9) return acc + 3;
    if (score >= 7) return acc + 2;
    if (score >= 6) return acc + 1;
    return acc;
  }, 0);
}

export function generateFractionDistractors(correctFraction, count = 3) {
  const distractors = new Set();
  const { numerator, denominator } = correctFraction;

  const candidates = [
    { numerator: numerator + 1, denominator },
    { numerator, denominator: denominator + 1 },
    { numerator: numerator - 1, denominator },
    { numerator, denominator: denominator - 1 },
    { numerator: numerator * 2, denominator: denominator * 2 - 1 },
  ];

  shuffleArray(candidates).forEach(c => {
    const key = `${c.numerator}/${c.denominator}`;
    if (c.numerator > 0 && c.denominator > c.numerator && distractors.size < count) {
      distractors.add(key);
    }
  });

  const correctKey = `${numerator}/${denominator}`;
  return shuffleArray([correctKey, ...distractors]);
}
