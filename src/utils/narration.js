import { say, ask, emphasize, think, celebrate } from './audio';

export const getWonderNarration = (wonder) => {
  // Narrate the intro, then the question and subtext for the selected wonder.
  return [
    think("Hmm... are these equal?"),
    say(wonder.question),
    say(wonder.subtext),
  ];
};

export const getStoryNarration = (slideIndex) => {
  switch (slideIndex) {
    case 0: return [
      say("Meet John from Toronto. He has a chocolate bar cut into 2 equal pieces. He eats 1 piece. That's one half!"),
      emphasize('"John eats 1/2 of his chocolate bar!"'),
      say("One out of two equal parts!")
    ];
    case 1: return [
      say("Meet Mei from Beijing. She has the SAME size chocolate bar, cut into 4 equal pieces. She eats 2 pieces. That's two quarters!"),
      emphasize('"Mei eats 2/4 of her bar!"'),
      say("Two out of four equal parts!")
    ];
    case 2: return [
      say("Look — the shaded part is exactly equal! John's 1/2 and Mei's 2/4 cover the same area. They are EQUIVALENT fractions!"),
      emphasize('"1/2 = 2/4 — same value, different names!"'),
      say("Equivalent means equal value!")
    ];
    case 3: return [
      ask("Meet Priya from Mumbai. Her dosa is cut into 6 equal pieces. She eats 3 pieces — that's 3/6. Is it the same as 1/2 too?"),
      ask('"Is 3/6 the same as 1/2?"'),
      say("Let's check on the number line!")
    ];
    case 4: return [
      say("1/2, 2/4 and 3/6 all land on the SAME point on the number line! They are all equivalent — same value, different names!"),
      emphasize('"1/2 = 2/4 = 3/6 — all equivalent!"'),
      say("Same spot, different names!")
    ];
    case 5: return [
      say("Multiply or divide the top AND bottom by the same number and you get an equivalent fraction. The value stays the same!"),
      emphasize('"1/2 × 2/2 = 2/4 — multiply both parts equally!"'),
      celebrate("Now you know the secret!")
    ];
    default: return [];
  }
};

// Play Phase feedback – single word, using pre-generated ElevenLabs audio
export const getCorrectNarration = () => [celebrate("Correct.")];
export const getWrongNarration  = () => [say("Wrong.")];
