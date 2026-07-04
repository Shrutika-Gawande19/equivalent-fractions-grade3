import React from 'react';

export const FractionBarDiagram = ({ numerator, denominator, animated = false }) => {
  const segmentWidth = 200 / denominator;
  return (
    <svg viewBox="0 0 200 60" style={{ maxWidth: '100%' }}>
      {Array(denominator).fill(0).map((_, i) => (
        <rect key={i} x={i * segmentWidth} y="0" width={segmentWidth} height="40"
              fill={i < numerator ? 'var(--gold)' : 'var(--bg-card)'} stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  );
};
