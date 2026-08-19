import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio';

export const getIntroNarration = () => [
  say("Welcome to learn Equivalent Fractions! Around the world.")
];

export const getWonderNarration = (wonder) => [
  think("Hmm... are these equal?"),
  say(wonder.questionAudio || wonder.question),
  say(wonder.subtextAudio || wonder.subtext),
];

export const getStoryNarration = (slideIndex) => {
  switch (slideIndex) {
    case 0: return [
      say("Meet John from Toronto. He has a chocolate bar cut into 2 equal pieces. He eats 1 piece. That's one half!"),
      emphasize('"John eats 1 by 2 of his chocolate bar!"'),
      say("One out of two equal parts!")
    ];
    case 1: return [
      say("Meet Mei from Beijing. She has the SAME size chocolate bar, cut into 4 equal pieces. She eats 2 pieces. That's two quarters!"),
      emphasize('"Mei eats 2 by 4 of her bar!"'),
      say("Two out of four equal parts!")
    ];
    case 2: return [
      say("Look — the shaded part is exactly equal! John's 1 by 2 and Mei's 2 by 4 cover the same area. They are EQUIVALENT fractions!"),
      emphasize('"1 by 2 equals 2 by 4 — same value, different names!"'),
      say("Equivalent means equal value!")
    ];
    case 3: return [
      ask("Meet Priya from Mumbai. Her dosa is cut into 6 equal pieces. She eats 3 pieces — that's 3 by 6. Is it the same as 1 by 2?"),
      ask('"Is 3 by 6 the same as 1 by 2?"'),
      say("Let's check on the number line!")
    ];
    case 4: return [
      say("1 by 2, 2 by 4 and 3 by 6 all land on the SAME point on the number line! They are all equivalent — same value, different names!"),
      emphasize('"1 by 2 equals 2 by 4 equals 3 by 6 — all equivalent!"'),
      say("Same spot, different names!")
    ];
    case 5: return [
      say("Multiply or divide the top AND bottom by the same number and you get an equivalent fraction. The value stays the same!"),
      emphasize('"1 by 2 times 2 by 2 equals 2 by 4 — multiply both parts equally!"'),
      celebrate("Now you know the secret!")
    ];
    default: return [];
  }
};

// --- Station A Narration (Bar Splitter) ---
export const getBarSplitterIntro = () => [
  instruct("Make a bar that shows the same amount as the target fraction. Click segments to shade them!")
];

export const getBarSplitterRoundNarration = (round) => {
  if (round === 0) return [cheer("Great! You shaded the matching fraction parts!")];
  if (round === 1) return [cheer("Super job! Both fractions cover the exact same area!")];
  return [celebrate("Awesome! You mastered the Fraction Bar Splitter station!")];
};

export const getBarSplitterTryAgain = () => [
  say("Not quite! Try adjusting the parts to match the area.")
];

// --- Station B Narration (Fraction Bridge) ---
export const getBridgeIntro = () => [
  instruct("Click only the stepping stones with fractions equivalent to the starting fraction to cross safely to the treasure!")
];

export const getBridgeRoundNarration = (round) => {
  if (round === 0) return [cheer("Brilliant crossing! You found all the equivalent fraction stepping stones!")];
  return [celebrate("Treasure unlocked! You crossed the fraction bridge like a champion!")];
};

export const getBridgeTryAgain = () => [
  say("That fraction is not equivalent. Choose carefully!")
];

// --- Station C Narration (Magic Machine) ---
export const getMagicMachineIntro = () => [
  instruct("Press each magic multiplier button to see how multiplying top and bottom numbers creates equivalent fractions!")
];

export const getMagicMachineMultiplierNarration = (m) => {
  switch (m) {
    case 2: return [cheer("Multiplied by 2! 2 by 3 transforms into 4 by 6!")];
    case 3: return [cheer("Multiplied by 3! 2 by 3 transforms into 6 by 9!")];
    case 4: return [cheer("Multiplied by 4! 2 by 3 transforms into 8 by 12!")];
    case 5: return [cheer("Multiplied by 5! 2 by 3 transforms into 10 by 15!")];
    default: return [];
  }
};

export const getMagicMachineCompleteNarration = () => [
  celebrate("Magical! You discovered all 4 equivalent fractions! Multiplying top and bottom by the same number keeps the value equal!")
];

// --- Practice Phase Narration ---
export const getPracticeMapIntro = () => [
  celebrate("Welcome to the Practice Phase! Travel around the world and solve equivalent fraction challenges to earn stars and XP!")
];

export const getWorldIntroNarration = (worldIdx) => {
  if (worldIdx === 0) return [say("Welcome to Toronto Bakery! Decide if the two fractions shown are equivalent.")];
  if (worldIdx === 1) return [say("Welcome to Mumbai Market! Choose the fraction equivalent to the target.")];
  if (worldIdx === 2) return [say("Welcome to Tokyo Sushi Bar! Find the missing number to make the fractions equivalent.")];
  return [];
};

const CORRECT_PHRASES = [
  "Correct!",
  "Great job!",
  "Spot on!",
  "Well done!"
];

export const getCorrectNarration = () => {
  const phrase = CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)];
  return [celebrate(phrase)];
};

export const getWrongNarration = () => [
  say("Oops, not quite! Keep trying!")
];

export const getWorldCompleteNarration = (score, passScore, isLastWorld) => {
  if (isLastWorld && score >= passScore) {
    return [celebrate("Incredible! You completed all the practice worlds around the world!")];
  }
  if (score >= passScore) {
    return [celebrate("Fantastic work! You completed this world and earned your stars!")];
  }
  return [say("Good try! Replay this world to score enough stars to unlock the next destination!")];
};
