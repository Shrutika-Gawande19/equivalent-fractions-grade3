import React from 'react';

// SVG Fraction Bar
export function FractionBar({ numerator, denominator, colour = '#ffc107', width = 240, height = 52 }) {
  const segW = width / denominator;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: 'block' }}>
      {Array.from({ length: denominator }).map((_, i) => (
        <rect
          key={i}
          x={i * segW + 1}
          y={1}
          width={segW - 2}
          height={height - 2}
          rx={4}
          fill={i < numerator ? colour : 'rgba(255,255,255,0.08)'}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

// SVG Fraction Circle
export function FractionCircle({ numerator, denominator, colour = '#ffc107', size = 100 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  if (denominator <= 0) return null;
  if (denominator === 1) return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={numerator > 0 ? colour : 'rgba(255,255,255,0.08)'} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
    </svg>
  );

  const slices = [];
  const angleStep = (2 * Math.PI) / denominator;
  for (let i = 0; i < denominator; i++) {
    const startAngle = -Math.PI / 2 + i * angleStep;
    const endAngle = startAngle + angleStep;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = angleStep > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    slices.push(
      <path key={i} d={d} fill={i < numerator ? colour : 'rgba(255,255,255,0.08)'} stroke="rgba(10,10,46,0.7)" strokeWidth={1.5} />
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
    </svg>
  );
}

// Pair side-by-side
export function FractionPair({ fA, fB, showLabels = true }) {
  return (
    <div className="fraction-pair-container">
      <div className="fraction-bar-container">
        <FractionBar numerator={fA.numerator} denominator={fA.denominator} />
        {showLabels && <span className="fraction-label">{fA.numerator}/{fA.denominator}</span>}
      </div>
      <span className="fraction-equals-sign">=</span>
      <div className="fraction-bar-container">
        <FractionBar numerator={fB.numerator} denominator={fB.denominator} colour="#a78bfa" />
        {showLabels && <span className="fraction-label">{fB.numerator}/{fB.denominator}</span>}
      </div>
    </div>
  );
}

// Number Line
export function NumberLine({ fractions = [] }) {
  const W = 300, H = 60;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: 'visible' }}>
      <line x1={20} y1={30} x2={W - 20} y2={30} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
      <line x1={20} y1={22} x2={20} y2={38} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
      <text x={20} y={52} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={11}>0</text>
      <line x1={W - 20} y1={22} x2={W - 20} y2={38} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
      <text x={W - 20} y={52} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={11}>1</text>
      {fractions.map((f, i) => {
        const val = f.n / f.d;
        const x = 20 + val * (W - 40);
        return (
          <g key={i}>
            <circle cx={x} cy={30} r={6} fill="var(--gold)" stroke="#1a1a2e" strokeWidth={1.5} />
            <text x={x} y={18} textAnchor="middle" fill="var(--gold)" fontSize={10} fontWeight="bold">{f.n}/{f.d}</text>
          </g>
        );
      })}
    </svg>
  );
}
