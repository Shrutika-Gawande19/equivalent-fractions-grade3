import React, { useState, useEffect } from 'react';
import { FractionBar } from '../shared/FractionDiagrams';
import BridgeSimulation from '../simulations/BridgeSimulation';
import MagicFractionMachine from '../simulations/MagicFractionMachine';
import { narrate, stopNarration } from '../../utils/audio';
import {
  getBarSplitterIntro,
  getBarSplitterRoundNarration,
  getBarSplitterTryAgain
} from '../../utils/narration';

// --- Station A: Fraction Bar Splitter ---
const STATION_A_ROUNDS = [
  { numerator: 1, denominator: 2, targetDenominator: 4, emoji: '🍕' },
  { numerator: 1, denominator: 3, targetDenominator: 6, emoji: '🍫' },
  { numerator: 2, denominator: 3, targetDenominator: 9, emoji: '🍉' },
  { numerator: 3, denominator: 4, targetDenominator: 8, emoji: '🥐' },
];

function BarSplitterStation({ onComplete, audioEnabled }) {
  const [internalRound, setInternalRound] = useState(0);
  const target = STATION_A_ROUNDS[internalRound % STATION_A_ROUNDS.length];
  const [denominator, setDenominator] = useState(target.targetDenominator);
  const [shadedCount, setShadedCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [stationFinished, setStationFinished] = useState(false);

  // Play intro audio once on mount
  useEffect(() => {
    if (audioEnabled) {
      narrate(getBarSplitterIntro(), true);
    }
    return () => stopNarration();
  }, [audioEnabled]);

  const isMatch = denominator > 0 && (shadedCount / denominator) === (target.numerator / target.denominator);

  const toggleSegment = (i) => {
    if (submitted || stationFinished) return;
    setShadedCount(prev => {
      if (i < prev) return i;
      return i + 1;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCorrect(isMatch);
    if (isMatch) {
      if (internalRound < 2) {
        if (audioEnabled) {
          narrate(getBarSplitterRoundNarration(internalRound), true);
        }
        setTimeout(() => {
          setInternalRound(r => r + 1);
          setDenominator(STATION_A_ROUNDS[(internalRound + 1) % STATION_A_ROUNDS.length].targetDenominator);
          setShadedCount(0);
          setSubmitted(false);
          setIsCorrect(null);
        }, 1800);
      } else {
        // Final round completed - do NOT auto-shift, show complete card with button
        setStationFinished(true);
        if (audioEnabled) {
          narrate(getBarSplitterRoundNarration(2), true);
        }
      }
    } else {
      if (audioEnabled) {
        narrate(getBarSplitterTryAgain(), true);
      }
      setTimeout(() => { setSubmitted(false); setIsCorrect(null); }, 1500);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label" style={{ fontSize: '1.4rem' }}>Station A — Fraction Bar Splitter {target.emoji}</p>
        <p className="simulate-sublabel" style={{ fontSize: '1rem' }}>Make a bar that shows the same amount as {target.numerator}/{target.denominator}</p>
        <p style={{ color: 'var(--gold)', fontWeight: 'bold', margin: '8px 0' }}>Round {internalRound + 1} / 3</p>
      </div>

      <div className="simulate-tip" style={{ fontSize: '1.1rem' }}>Target fraction to match:</div>
      <div style={{ margin: '16px 0' }}>
        <FractionBar numerator={target.numerator} denominator={target.denominator} width={400} height={70} />
        <div className="fraction-label" style={{ marginTop: 10, fontSize: '1.5rem' }}>{target.numerator}/{target.denominator}</div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '16px 0' }}>
        Your bar — click segments to shade them:
      </p>

      {/* Clickable bar */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <svg viewBox={`0 0 ${denominator * 55} 70`} width={Math.min(denominator * 55, 600)} height={70}>
          {Array.from({ length: denominator }).map((_, i) => (
            <rect key={i} x={i * 55 + 1} y={1} width={53} height={68} rx={6}
              fill={i < shadedCount ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}
              stroke={submitted && isCorrect ? 'var(--green)' : submitted ? 'var(--red)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={3} style={{ cursor: stationFinished ? 'default' : 'pointer' }}
              onClick={() => toggleSegment(i)} />
          ))}
        </svg>
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '12px 0', fontSize: '1.2rem' }}>
        You've shaded <strong style={{ color: 'var(--gold)' }}>{shadedCount}</strong> / {denominator} parts
      </p>

      {!stationFinished && (
        <div style={{ margin: '20px 0' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Parts: {denominator}</label>
          <input type="range" min={2} max={12} value={denominator}
            onChange={e => { setDenominator(+e.target.value); setShadedCount(0); setSubmitted(false); }}
            style={{ width: '90%', display: 'block', margin: '12px auto', height: '16px' }} />
        </div>
      )}

      {isCorrect === true && !stationFinished && (
        <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
          🎉 Yes! {shadedCount}/{denominator} = {target.numerator}/{target.denominator}!
        </p>
      )}
      {isCorrect === false && (
        <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
          Not quite — try adjusting the parts! 🔄
        </p>
      )}

      {shadedCount > 0 && !submitted && !stationFinished && (
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} style={{ marginTop: 24 }}>Check ✓</button>
      )}

      {/* Manual advance button when station completes */}
      {stationFinished && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))',
          border: '1px solid rgba(34,197,94,0.4)',
          borderRadius: 16,
          padding: '20px',
          marginTop: 20,
          animation: 'fadeIn 0.5s ease',
        }}>
          <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 10px' }}>
            🎉 Station A Complete! Awesome! You mastered the Fraction Bar Splitter!
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 16px' }}>
            You've matched fractions by adjusting and shading equal parts!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              stopNarration();
              onComplete();
            }}
          >
            Next Station: Fraction Bridge 🌉 →
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Simulate Phase ---
const STATIONS = [BarSplitterStation, BridgeSimulation, MagicFractionMachine];
const STATION_NAMES = ['Bar Splitter', 'Bridge', 'Magic Machine'];
const STATION_ICONS = ['🔧', '🌉', '🔮'];

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [stationIdx, setStationIdx] = useState(0);
  const [stationsComplete, setStationsComplete] = useState([false, false, false]);

  const handleStationComplete = () => {
    stopNarration();
    const updated = [...stationsComplete];
    updated[stationIdx] = true;
    setStationsComplete(updated);
    if (stationIdx < 2) {
      setStationIdx(s => s + 1);
    } else {
      onComplete();
    }
  };

  const handleSelectStation = (idx) => {
    stopNarration();
    setStationIdx(idx);
  };

  const Station = STATIONS[stationIdx];

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <p className="simulate-label">Phase 3 — Simulate 🧪</p>
        <p className="simulate-sublabel">Complete all 3 stations to advance</p>
      </div>

      {/* Station tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {STATION_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => handleSelectStation(i)}
            style={{
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              background: stationsComplete[i] ? 'var(--green)' : i === stationIdx ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${stationsComplete[i] ? 'var(--green)' : i === stationIdx ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
              color: stationsComplete[i] ? '#fff' : i === stationIdx ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)',
              cursor: 'pointer',
            }}
          >
            {stationsComplete[i] ? '✓ ' : ''}{STATION_ICONS[i]} {name}
          </button>
        ))}
      </div>

      <Station key={stationIdx} onComplete={handleStationComplete} audioEnabled={audioEnabled} />
    </div>
  );
}
