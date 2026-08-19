import React, { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import {
  getBridgeIntro,
  getBridgeRoundNarration,
  getBridgeTryAgain
} from '../../utils/narration';

const ROUNDS = [
  {
    target: '1/3',
    stones: [
      { label: '2/6', correct: true },
      { label: '3/9', correct: true },
      { label: '4/12', correct: true },
      { label: '5/15', correct: true },
      { label: '4/10', correct: false },
      { label: '5/12', correct: false },
      { label: '2/5', correct: false },
    ]
  },
  {
    target: '1/2',
    stones: [
      { label: '2/4', correct: true },
      { label: '3/6', correct: true },
      { label: '4/8', correct: true },
      { label: '5/10', correct: true },
      { label: '3/5', correct: false },
      { label: '4/9', correct: false },
      { label: '5/12', correct: false },
    ]
  }
];

// Fisher-Yates shuffle
function shuffleStones(stones) {
  const shuffled = [...stones];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function BridgeSimulation({ onComplete, audioEnabled }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [stones, setStones] = useState(() => shuffleStones(ROUNDS[0].stones));
  const [clicked, setClicked] = useState([]);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [stationFinished, setStationFinished] = useState(false);

  // Play intro audio once on mount
  useEffect(() => {
    if (audioEnabled) {
      narrate(getBridgeIntro(), true);
    }
    return () => stopNarration();
  }, [audioEnabled]);

  const currentRound = ROUNDS[roundIdx];
  const startStone = { label: currentRound.target, correct: true };
  const allStones = [startStone, ...stones];
  const correctClickable = allStones.map((s, i) => (s.correct && i !== 0 ? i : -1)).filter(i => i >= 0);

  const handleClick = (idx) => {
    if (done || clicked.includes(idx) || idx === 0 || stationFinished) return;
    const stone = allStones[idx];

    if (stone.correct) {
      const newClicked = [...clicked, idx];
      setClicked(newClicked);
      setMessage('');

      // Check if all correct clickable stones have now been clicked
      const allDone = correctClickable.every(ci => newClicked.includes(ci));
      if (allDone) {
        setDone(true);
        setMessage('🎉 You reached the treasure chest!');
        
        if (roundIdx < ROUNDS.length - 1) {
          if (audioEnabled) {
            narrate(getBridgeRoundNarration(0), true);
          }
          setTimeout(() => {
            setRoundIdx(r => r + 1);
            setStones(shuffleStones(ROUNDS[roundIdx + 1].stones));
            setClicked([]);
            setMessage('');
            setDone(false);
          }, 2000);
        } else {
          // Final round finished - do NOT auto-shift, show complete card with button
          setStationFinished(true);
          if (audioEnabled) {
            narrate(getBridgeRoundNarration(1), true);
          }
        }
      }
    } else {
      setMessage('That fraction is not equivalent. Try again! 🔄');
      if (audioEnabled) {
        narrate(getBridgeTryAgain(), true);
      }
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label" style={{ fontSize: '1.4rem' }}>🌉 Cross the Fraction Bridge</p>
        <p className="simulate-sublabel" style={{ fontSize: '1.1rem' }}>
          Click only the fractions equivalent to <strong>{currentRound.target}</strong> to cross safely!
        </p>
        <p style={{ color: 'var(--gold)', fontWeight: 'bold', margin: '8px 0' }}>Round {roundIdx + 1} / {ROUNDS.length}</p>
      </div>

      {/* River / stones visual */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,90,180,0.25), rgba(10,60,140,0.35))',
        borderRadius: 24,
        padding: '32px 20px',
        margin: '20px 0',
        border: '1px solid rgba(100,160,255,0.2)',
      }}>
        {/* Score display */}
        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 16 }}>
          ✅ Correct: {clicked.filter(i => allStones[i].correct).length} / {correctClickable.length}
        </div>

        {/* Stones row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {allStones.map((stone, i) => {
            const isClicked = clicked.includes(i);
            const isStart = i === 0;
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={isStart || isClicked || done || stationFinished}
                style={{
                  minWidth: 100,
                  minHeight: 80,
                  borderRadius: 16,
                  border: isStart
                    ? '3px solid rgba(255,255,255,0.3)'
                    : isClicked
                    ? '3px solid var(--green)'
                    : '3px solid rgba(255,255,255,0.15)',
                  background: isStart
                    ? 'rgba(255,255,255,0.1)'
                    : isClicked
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(255,255,255,0.08)',
                  color: isClicked ? '#fff' : isStart ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  cursor: isStart || isClicked || done || stationFinished ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isClicked ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isClicked ? '0 0 20px rgba(34,197,94,0.6)' : 'none',
                  position: 'relative',
                }}
              >
                {isClicked && <span style={{ position: 'absolute', top: -12, right: -12, fontSize: 24 }}>✅</span>}
                {stone.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character & feedback */}
      <div style={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ fontSize: '3rem' }}>{done || stationFinished ? '🧒🏆' : '🧒'}</span>
        {message && !stationFinished && (
          <p style={{
            color: message.includes('treasure') ? 'var(--green)' : 'var(--red)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.4rem',
            margin: 0,
          }}>
            {message}
          </p>
        )}
      </div>

      {!done && !stationFinished && (
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 12 }}>
          Hint: All equivalent fractions equal <strong>{currentRound.target}</strong> when simplified.
        </p>
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
            🏆 Station B Complete! Treasure unlocked!
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 16px' }}>
            You crossed the bridge by finding all equivalent fractions!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              stopNarration();
              if (onComplete) onComplete();
            }}
          >
            Next Station: Magic Machine 🔮 →
          </button>
        </div>
      )}
    </div>
  );
}
