export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplify(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

export function isEquivalent(numA, denA, numB, denB) {
  return numA * denB === numB * denA; // cross-multiplication check
}

export function generateEquivalent(numerator, denominator, multiplier) {
  return { numerator: numerator * multiplier, denominator: denominator * multiplier };
}

export function generateDistractorFraction(numerator, denominator, maxDenominator = 12) {
  const offset = Math.random() > 0.5 ? 1 : -1;
  let newDen = Math.min(denominator + offset * 2, maxDenominator);
  if (newDen <= numerator) newDen = numerator + 1;
  return { numerator, denominator: newDen };
}
