export const storyPanels = [
  {
    id: 1,
    text: "Meet John from Toronto. He has a chocolate bar cut into two equal pieces. He eats one piece. That's one half!",
    audioKey: "Meet John from Toronto. He has a chocolate bar cut into two equal pieces.",
    visual: { type: "bar", fraction: { numerator: 1, denominator: 2 } },
    character: "John",
    country: "Canada",
    emoji: "🍫"
  },
  {
    id: 2,
    text: "Meet Mei from Beijing. She has the SAME size chocolate bar, cut into four equal pieces. She eats two pieces. That's two quarters!",
    audioKey: "Meet Mei from Beijing. She has the same size chocolate bar, cut into four equal pieces.",
    visual: { type: "bar", fraction: { numerator: 2, denominator: 4 } },
    character: "Mei",
    country: "China",
    emoji: "🍫"
  },
  {
    id: 3,
    text: "Look! The shaded part is equal. One half equals two quarters!",
    audioKey: "Look! The shaded part is equal. One half equals two quarters!",
    visual: { type: "pair", fractionA: { numerator: 1, denominator: 2 }, fractionB: { numerator: 2, denominator: 4 } }
  }
];
