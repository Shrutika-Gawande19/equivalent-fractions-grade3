import React, { useState } from 'react';
import { FractionBar, FractionPair } from '../shared/FractionDiagrams';

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
    });
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

// --- Station B: Spot the Equivalent Pair ---
const STATION_B_ROUNDS = [
  {
    pairs: [
      { fA: { n: 1, d: 2 }, fB: { n: 2, d: 4 }, equivalent: true },
      { fA: { n: 1, d: 3 }, fB: { n: 2, d: 9 }, equivalent: false },
      { fA: { n: 2, d: 3 }, fB: { n: 4, d: 6 }, equivalent: true },
      { fA: { n: 1, d: 4 }, fB: { n: 3, d: 8 }, equivalent: false },
    ],
  },
  {
    pairs: [
      { fA: { n: 1, d: 3 }, fB: { n: 2, d: 6 }, equivalent: true },
      { fA: { n: 2, d: 5 }, fB: { n: 4, d: 9 }, equivalent: false },
      { fA: { n: 3, d: 4 }, fB: { n: 6, d: 8 }, equivalent: true },
      { fA: { n: 1, d: 2 }, fB: { n: 3, d: 8 }, equivalent: false },
    ],
  },
];

function SpotEquivalentStation({ round, onComplete }) {
  const data = STATION_B_ROUNDS[round % STATION_B_ROUNDS.length];
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i) => {
    if (submitted) return;
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleCheck = () => {
    setSubmitted(true);
    const correctIndices = data.pairs.map((p, i) => p.equivalent ? i : -1).filter(i => i >= 0);
    const allCorrect = correctIndices.every(i => selected.includes(i)) && selected.every(i => correctIndices.includes(i));
    if (allCorrect) setTimeout(() => onComplete(), 1500);
    else setTimeout(() => { setSubmitted(false); setSelected([]); }, 2000);
  };

  return (
    <div className="glass-card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label">Station B — Spot the Equivalent Pair 👀</p>
        <p className="simulate-sublabel">Tap all the pairs where the shaded areas match exactly!</p>
      </div>

      <div className="arrangement-grid">
        {data.pairs.map((pair, i) => {
          const isSelected = selected.includes(i);
          let cls = 'arrangement-card';
          if (submitted) cls += pair.equivalent ? ' correct-reveal' : isSelected ? ' wrong-reveal' : '';
          else if (isSelected) cls += ' selected';
          return (
            <div key={i} className={cls} onClick={() => toggle(i)}>
              <FractionBar numerator={pair.fA.n} denominator={pair.fA.d} width={160} height={30} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>vs</div>
              <FractionBar numerator={pair.fB.n} denominator={pair.fB.d} width={160} height={30} colour="#a78bfa" />
            </div>
          );
        })}
      </div>

      {selected.length > 0 && !submitted && (
        <button className="btn btn-primary" onClick={handleCheck} style={{ marginTop: 16 }}>Check ✓</button>
      )}
    </div>
  );
}

// --- Station C: Fill the Sentence ---
const STATION_C_ROUNDS = [
  { nA: 1, dA: 3, nB: null, dB: 9, answer: '3', missing: 'numeratorB' },
  { nA: 2, dA: 5, nB: 4, dB: null, answer: '10', missing: 'denominatorB' },
  { nA: 1, dA: 4, nB: 3, dB: null, answer: '12', missing: 'denominatorB' },
];

function SentenceStation({ round, onComplete }) {
  const prob = STATION_C_ROUNDS[round % STATION_C_ROUNDS.length];
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [showBars, setShowBars] = useState(false);

  const digits = [1,2,3,4,5,6,7,8,9,0];

  const handleDigit = (d) => {
    if (inputValue.length < 2) setInputValue(prev => prev + d);
  };

  const handleSubmit = () => {
    const correct = inputValue === prob.answer;
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setTimeout(() => onComplete(), 1200);
    else setTimeout(() => { setResult(null); setInputValue(''); }, 1500);
  };

  return (
    <div className="glass-card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label">Station C — Fill the Equivalent Sentence ✏️</p>
        <p className="simulate-sublabel">Find the missing number to make the fractions equivalent!</p>
      </div>

      <div className="sentence-row">
        <span className="given-value">{prob.nA}</span>
        <span className="sentence-label">/</span>
        <span className="given-value">{prob.dA}</span>
        <span className="sentence-equals">=</span>
        {prob.missing === 'numeratorB'
          ? <div className={`blank-input ${result === 'correct' ? 'correct' : inputValue ? 'filled' : ''}`}>{inputValue || '?'}</div>
          : <span className="given-value">{prob.nB}</span>}
        <span className="sentence-label">/</span>
        {prob.missing === 'denominatorB'
          ? <div className={`blank-input ${result === 'correct' ? 'correct' : inputValue ? 'filled' : ''}`}>{inputValue || '?'}</div>
          : <span className="given-value">{prob.dB}</span>}
      </div>

      {result === 'correct' && <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)' }}>🎉 Correct! Amazing!</p>}
      {result === 'wrong' && <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>Not quite — try again! 🔄</p>}

      <div className="number-pad">
        {digits.map(d => (
          <button key={d} className="num-pad-btn" onClick={() => handleDigit(String(d))}>{d}</button>
        ))}
        <button className="num-pad-btn" onClick={() => setInputValue(prev => prev.slice(0, -1))} style={{ gridColumn: '1/3' }}>⌫</button>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setShowBars(!showBars)}>
          {showBars ? 'Hide bars' : 'Show me the bars 🔢'}
        </button>
        {inputValue && !result && (
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Submit ✓</button>
        )}
      </div>

      {showBars && (
        <div style={{ marginTop: 16 }}>
          <FractionPair fA={{ numerator: prob.nA, denominator: prob.dA }} fB={{ numerator: prob.nB || 0, denominator: prob.dB || 0 }} showLabels />
        </div>
      )}
    </div>
  );
}

// --- Main Simulate Phase ---
const STATIONS = [BarSplitterStation, SpotEquivalentStation, SentenceStation];
const STATION_NAMES = ['Bar Splitter', 'Spot the Pair', 'Fill the Sentence'];
const STATION_ICONS = ['🔧', '👁️', '✏️'];

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
