import React, { useState, useEffect } from 'react';
import { FractionBar } from '../shared/FractionDiagrams';
import { narrate, stopNarration } from '../../utils/audio';
import {
  getMagicMachineIntro,
  getMagicMachineMultiplierNarration,
  getMagicMachineCompleteNarration
} from '../../utils/narration';

// Base fraction for the machine
const BASE_FRACTION = { n: 2, d: 3 };
const MULTIPLIERS = [2, 3, 4, 5];

/**
 * MagicFractionMachine
 * - Students try each multiplier (×2, ×3, ×4, ×5) one at a time.
 * - Each click animates the machine and shows the resulting equivalent fraction.
 * - After ALL four have been tried, a celebration message appears and a
 *   "Continue to Practice Phase →" button lets them proceed (no auto-advance).
 */
export default function MagicFractionMachine({ onComplete, audioEnabled }) {
  const [active, setActive] = useState(null);       // currently selected multiplier
  const [animating, setAnimating] = useState(false); // machine animation in progress
  const [tried, setTried] = useState(new Set());    // set of tried multipliers
  const [allDone, setAllDone] = useState(false);    // all 4 tried?

  // Play intro audio once on mount
  useEffect(() => {
    if (audioEnabled) {
      narrate(getMagicMachineIntro(), true);
    }
    return () => stopNarration();
  }, [audioEnabled]);

  const handleMultiply = (m) => {
    if (animating) return;
    setActive(m);
    setAnimating(true);

    if (audioEnabled) {
      narrate(getMagicMachineMultiplierNarration(m), true);
    }

    setTimeout(() => {
      setAnimating(false);
      const newTried = new Set(tried).add(m);
      setTried(newTried);
      if (newTried.size === MULTIPLIERS.length) {
        // Short pause before showing celebration and complete narration
        setTimeout(() => {
          setAllDone(true);
          if (audioEnabled) {
            narrate(getMagicMachineCompleteNarration(), true);
          }
        }, 600);
      }
    }, 900); // animation duration
  };

  const resultFraction = active
    ? { n: BASE_FRACTION.n * active, d: BASE_FRACTION.d * active }
    : null;

  return (
    <div className="glass-card" style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
      {/* Header */}
      <div className="simulate-header">
        <p className="simulate-label">🔮 Magic Fraction Machine</p>
        <p className="simulate-sublabel">
          Press each magic button to see what happens to <strong>2/3</strong>!
        </p>
      </div>

      {/* Machine body */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(79,70,229,0.25))',
        border: '1px solid rgba(139,92,246,0.4)',
        borderRadius: 16,
        padding: '16px 12px',
        margin: '12px 0',
      }}>
        {/* Input fraction + machine pipe */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
              {BASE_FRACTION.n}
            </div>
            <div style={{ width: 40, height: 3, background: 'var(--gold)', margin: '2px auto' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
              {BASE_FRACTION.d}
            </div>
          </div>

          {/* Machine funnel */}
          <div style={{
            fontSize: '2.5rem',
            filter: animating ? 'drop-shadow(0 0 12px #a78bfa)' : 'none',
            transition: 'filter 0.3s',
            animation: animating ? 'spin 0.9s linear' : 'none',
          }}>
            ⚙️
          </div>

          {/* Arrow */}
          <span style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.5)' }}>→</span>

          {/* Output fraction */}
          {resultFraction && !animating ? (
            <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#a78bfa' }}>
                {resultFraction.n}
              </div>
              <div style={{ width: 40, height: 3, background: '#a78bfa', margin: '2px auto' }} />
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#a78bfa' }}>
                {resultFraction.d}
              </div>
            </div>
          ) : animating ? (
            <div style={{ fontSize: '2rem' }}>✨</div>
          ) : (
            <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>?</div>
          )}
        </div>

        {/* Fraction bars comparison */}
        {resultFraction && !animating && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginTop: 8,
            opacity: 1,
            transition: 'opacity 0.5s',
          }}>
            <div style={{ textAlign: 'center' }}>
              <FractionBar numerator={BASE_FRACTION.n} denominator={BASE_FRACTION.d} width={140} height={28} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {BASE_FRACTION.n}/{BASE_FRACTION.d}
              </div>
            </div>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>=</span>
            <div style={{ textAlign: 'center' }}>
              <FractionBar numerator={resultFraction.n} denominator={resultFraction.d} width={140} height={28} colour="#a78bfa" />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {resultFraction.n}/{resultFraction.d}
              </div>
            </div>
          </div>
        )}

        {/* Floating rule text */}
        <p style={{
          marginTop: 12,
          fontSize: '0.8rem',
          fontStyle: 'italic',
          color: 'var(--gold)',
          fontFamily: 'var(--font-display)',
        }}>
          ✨ Multiply BOTH numbers by the SAME number!
        </p>
      </div>

      {/* Multiplier buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        {MULTIPLIERS.map((m) => {
          const wasTried = tried.has(m);
          const isActive = active === m;
          return (
            <button
              key={m}
              onClick={() => handleMultiply(m)}
              disabled={animating}
              style={{
                minWidth: 64,
                minHeight: 48,
                borderRadius: 12,
                border: wasTried
                  ? '2px solid var(--green)'
                  : isActive
                  ? '2px solid var(--gold)'
                  : '2px solid rgba(139,92,246,0.5)',
                background: wasTried
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : isActive
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(79,70,229,0.4))',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: animating ? 'wait' : 'pointer',
                transition: 'all 0.25s ease',
                transform: isActive && animating ? 'scale(1.12)' : 'scale(1)',
                boxShadow: wasTried ? '0 0 10px rgba(34,197,94,0.4)' : 'none',
              }}
            >
              {wasTried ? '✓' : '×'}{m}
            </button>
          );
        })}
      </div>

      {/* Progress tracker */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>
        Tried: <strong style={{ color: 'var(--gold)' }}>{tried.size}</strong> / {MULTIPLIERS.length} magic numbers
      </p>

      {/* Celebration + Continue button */}
      {allDone && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))',
          border: '1px solid rgba(34,197,94,0.4)',
          borderRadius: 16,
          padding: '20px',
          marginTop: 12,
          animation: 'fadeInUp 0.5s ease',
        }}>
          <p style={{
            color: 'var(--green)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            margin: '0 0 10px',
          }}>
            🎉 Amazing! You've discovered all 4 equivalent fractions of 2/3!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 16px' }}>
            2/3 = 4/6 = 6/9 = 8/12 = 10/15 — they all represent the same amount!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              stopNarration();
              if (onComplete) onComplete();
            }}
            style={{ minWidth: 200 }}
          >
            Continue to Practice Phase 🎮 →
          </button>
        </div>
      )}

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
