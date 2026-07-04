const generateBank = () => {
  const bank = [];
  for(let i=0; i<10; i++) {
    bank.push({
      id: `Q1_${i}`, type: 'picture_pair', world: i, difficulty: i<5?1:i<8?2:3,
      numeratorA: 1, denominatorA: 2, numeratorB: 2, denominatorB: 4,
      isEquivalent: true, missingSlot: 'both',
      questionText: "Do these two shaded shapes show the same amount?",
      visual: "pairDiagram", objectEmoji: "🍕",
      hint1: "Count how many parts are shaded in each shape.",
      hint2: "Compare the shaded AREA, not just the number of pieces.",
      explanation: "1/2 and 2/4 cover exactly the same shaded area.",
      options: ["Yes, equivalent", "No, not equivalent"], correctAnswer: "Yes, equivalent"
    });
  }
  return bank;
};

export const questionBank = generateBank();
