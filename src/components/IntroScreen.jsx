import React from 'react';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A fractions mystery!' },
  { icon: '📖', label: 'Story', desc: 'Postcards from the world' },
  { icon: '🧪', label: 'Simulate', desc: 'Build fractions yourself' },
  { icon: '🎮', label: 'Play', desc: '100 global challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <div className="intro-badge">✨  Grade 3 Maths</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Equivalent Fractions</span>
        {' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Around the World</span>
      </h1>
      {/* <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 3.5 · Fractions that are equal in value
      </p> */}

      <div className="mascot-container">
        <div className="mascot">🌍</div>
        <div className="speech-bubble">
          Let's discover equivalent fractions! ✈️
        </div>
      </div>

      <p className="intro-desc">
        Travel the globe to discover that fractions can look <strong style={{ color: 'var(--gold)' }}>different</strong> but represent the <strong style={{ color: 'var(--gold)' }}>same value</strong> — they're <em>equivalent</em>!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🌍</div>
          <div className="feature-card-label">10 Worlds</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
