import React, { useState } from 'react';
import { FractionBar, FractionPair } from '../shared/FractionDiagrams';
import BridgeSimulation from '../simulations/BridgeSimulation';
import MagicFractionMachine from '../simulations/MagicFractionMachine';

// --- Station A: Fraction Bar Splitter ---
const STATION_A_ROUNDS = [
  { numerator: 1, denominator: 2, targetDenominator: 4, emoji: '🍕' },
  { numerator: 1, denominator: 3, targetDenominator: 6, emoji: '🍫' },
  { numerator: 2, denominator: 3, targetDenominator: 9, emoji: '🍉' },
  { numerator: 3, denominator: 4, targetDenominator: 8, emoji: '🥐' },
];

function BarSplitterStation({ round, onComplete }) {
  const target = STATION_A_ROUNDS[round % STATION_A_ROUNDS.length];
  const [denominator, setDenominator] = useState(target.targetDenominator);
  const [shadedCount, setShadedCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const isMatch = denominator > 0 && (shadedCount / denominator) === (target.numerator / target.denominator);

  const toggleSegment = (i) => {
    if (submitted) return;
    setShadedCount(prev => {
      if (i < prev) return i;
      return i + 1;
    }); 9
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCorrect(isMatch);
    if (isMatch) setTimeout(() => onComplete(), 1200);
    else setTimeout(() => { setSubmitted(false); setIsCorrect(null); }, 1500);
  };

  return (
    <div className="glass-card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label">Station A — Fraction Bar Splitter {target.emoji}</p>
        <p className="simulate-sublabel">Make a bar that shows the same amount as {target.numerator}/{target.denominator}</p>
      </div>

      <div className="simulate-tip">Target fraction to match:</div>
      <div style={{ margin: '12px 0' }}>
        <FractionBar numerator={target.numerator} denominator={target.denominator} width={280} height={50} />
        <div className="fraction-label" style={{ marginTop: 6 }}>{target.numerator}/{target.denominator}</div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '12px 0' }}>
        Your bar — click segments to shade them:
      </p>

      {/* Clickable bar */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <svg viewBox={`0 0 ${denominator * 40} 50`} width={Math.min(denominator * 40, 320)} height={50}>
          {Array.from({ length: denominator }).map((_, i) => (
            <rect key={i} x={i * 40 + 1} y={1} width={38} height={48} rx={4}
              fill={i < shadedCount ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}
              stroke={submitted && isCorrect ? 'var(--green)' : submitted ? 'var(--red)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={2} style={{ cursor: 'pointer' }}
              onClick={() => toggleSegment(i)} />
          ))}
        </svg>
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '8px 0' }}>
        You've shaded <strong style={{ color: 'var(--gold)' }}>{shadedCount}</strong> / {denominator} parts
      </p>

      <div style={{ margin: '12px 0' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Parts: {denominator}</label>
        <input type="range" min={2} max={12} value={denominator}
          onChange={e => { setDenominator(+e.target.value); setShadedCount(0); setSubmitted(false); }}
          style={{ width: '80%', display: 'block', margin: '8px auto' }} />
      </div>

      {isCorrect === true && <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>🎉 Yes! {shadedCount}/{denominator} = {target.numerator}/{target.denominator}!</p>}
      {isCorrect === false && <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Not quite — try adjusting the parts! 🔄</p>}

      {shadedCount > 0 && !submitted && (
        <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 16 }}>Check ✓</button>
      )}
    </div>
  );
}

// --- Main Simulate Phase ---
const STATIONS = [BarSplitterStation, BridgeSimulation, MagicFractionMachine];
const STATION_NAMES = ['Bar Splitter', 'Bridge', 'Magic Machine'];
const STATION_ICONS = ['🔧', '🌉', '🔮'];

export default function SimulatePhase({ onComplete }) {
  const [stationIdx, setStationIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [stationsComplete, setStationsComplete] = useState([false, false, false]);

  const handleStationComplete = () => {
    const updated = [...stationsComplete];
    updated[stationIdx] = true;
    setStationsComplete(updated);
    if (stationIdx < 2) {
      setStationIdx(s => s + 1);
      setRound(0);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  };

  const Station = STATIONS[stationIdx];

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <p className="simulate-label">Phase 3 — Simulate 🧪</p>
        <p className="simulate-sublabel">Complete all 3 stations to advance</p>
      </div>

      {/* Station tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {STATION_NAMES.map((name, i) => (
          <div key={i} style={{
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: stationsComplete[i] ? 'var(--green)' : i === stationIdx ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${stationsComplete[i] ? 'var(--green)' : i === stationIdx ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
            color: stationsComplete[i] ? '#fff' : i === stationIdx ? 'var(--gold)' : 'var(--text-muted)',
            fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)',
          }}>
            {stationsComplete[i] ? '✓ ' : ''}{STATION_ICONS[i]} {name}
          </div>
        ))}
      </div>

      <Station round={round} onComplete={handleStationComplete} />
    </div>
  );
}
