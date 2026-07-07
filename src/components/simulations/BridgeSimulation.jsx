import React, { useState } from 'react';

// List of stones with displayed fraction and whether it is equivalent to 1/3
const STONES = [
  { label: '1/3', correct: true },  // starting stone (non-clickable)
  { label: '2/6', correct: true },
  { label: '3/9', correct: true },
  { label: '4/12', correct: true },
  { label: '5/15', correct: true },
  { label: '4/10', correct: false },
  { label: '5/12', correct: false },
  { label: '2/5', correct: false },
];

// Indices of correct clickable stones (excluding index 0 which is the start)
const CORRECT_CLICKABLE = STONES.map((s, i) => (s.correct && i !== 0 ? i : -1)).filter(i => i >= 0);

export default function BridgeSimulation({ onComplete }) {
  const [clicked, setClicked] = useState([]);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const handleClick = (idx) => {
    if (done || clicked.includes(idx) || idx === 0) return;
    const stone = STONES[idx];

    if (stone.correct) {
      const newClicked = [...clicked, idx];
      setClicked(newClicked);
      setMessage('');

      // Check if all correct clickable stones have now been clicked
      const allDone = CORRECT_CLICKABLE.every(ci => newClicked.includes(ci));
      if (allDone) {
        setDone(true);
        setTimeout(() => {
          setMessage('🎉 You reached the treasure chest!');
          if (onComplete) onComplete();
        }, 800);
      }
    } else {
      setMessage('That fraction is not equivalent. Try again! 🔄');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
      <div className="simulate-header">
        <p className="simulate-label">🌉 Cross the Fraction Bridge</p>
        <p className="simulate-sublabel">
          Click only the fractions equivalent to <strong>1/3</strong> to cross safely!
        </p>
      </div>

      {/* River / stones visual */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,90,180,0.25), rgba(10,60,140,0.35))',
        borderRadius: 16,
        padding: '20px 12px',
        margin: '12px 0',
        border: '1px solid rgba(100,160,255,0.2)',
      }}>
        {/* Score display */}
        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: 10 }}>
          ✅ Correct: {clicked.filter(i => STONES[i].correct).length} / {CORRECT_CLICKABLE.length}
        </div>

        {/* Stones row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {STONES.map((stone, i) => {
            const isClicked = clicked.includes(i);
            const isStart = i === 0;
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={isStart || isClicked || done}
                style={{
                  minWidth: 72,
                  minHeight: 56,
                  borderRadius: 12,
                  border: isStart
                    ? '2px solid rgba(255,255,255,0.3)'
                    : isClicked
                    ? '2px solid var(--green)'
                    : '2px solid rgba(255,255,255,0.15)',
                  background: isStart
                    ? 'rgba(255,255,255,0.1)'
                    : isClicked
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(255,255,255,0.08)',
                  color: isClicked ? '#fff' : isStart ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isStart || isClicked || done ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isClicked ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isClicked ? '0 0 16px rgba(34,197,94,0.5)' : 'none',
                  position: 'relative',
                }}
              >
                {isClicked && <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 14 }}>✅</span>}
                {stone.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character & feedback */}
      <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ fontSize: '2rem' }}>{done ? '🧒🏆' : '🧒'}</span>
        {message && (
          <p style={{
            color: message.includes('treasure') ? 'var(--green)' : 'var(--red)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            margin: 0,
          }}>
            {message}
          </p>
        )}
      </div>

      {!done && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>
          Hint: All equivalent fractions equal <strong>1/3</strong> when simplified.
        </p>
      )}
    </div>
  );
}
