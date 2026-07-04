import React from 'react';

const FRACTION_PAIRS = [
  '½', '⅓', '¼', '⅔', '¾', '⅕', '⅖', '⅗', '⅘', '1/6', '2/6', '3/6',
  '1/8', '2/8', '4/8', '1/9', '3/9', '1/10', '2/10', '5/10',
];

export default function FloatingFractions() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    text: FRACTION_PAIRS[i % FRACTION_PAIRS.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className="floating-numbers">
      {items.map(item => (
        <span
          key={item.id}
          className="floating-number"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
