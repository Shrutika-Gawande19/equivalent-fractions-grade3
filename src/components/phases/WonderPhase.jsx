import React, { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { getWonderNarration } from '../../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Priya's dosa is cut into 6 pieces. She eats 3. Is that the same as eating 1/2?",
    questionAudio: "Priya's dosa is cut into 6 pieces. She eats 3. Is that the same as eating 1 by 2?",
    subtext: "3/6 and 1/2... are they secretly the same fraction?",
    subtextAudio: "3 by 6 and 1 by 2... are they secretly the same fraction?",
    image: "/assets/images/dosa_6_pieces.png",
    bgEmojis: ["⅓", "3/6", "½", "✨", "=", "🌎"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1400);
    // Play narration for wonder question and subtext
    if (audioEnabled) {
      narrate(getWonderNarration(wonder), true);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); stopNarration(); };
  }, [wonder, audioEnabled]);

  const handleDiscover = () => {
    setTimeout(() => onComplete(), 300);
  };

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">=</span>
          <div className="wonder-qmark-glow" />
        </div>

        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking" style={{ fontSize: '2rem' }}>🌍</div>
          <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>Hmm... are these equal? 🤔</div>
        </div>

        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          {wonder.image ? (
            <img src={wonder.image} alt="Fraction illustration" className="wonder-image" style={{ width: '80px', height: '80px', margin: '0 auto', display: 'block', objectFit: 'contain' }} />
          ) : (
            <div className="wonder-emoji">{wonder.emoji}</div>
          )}
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>

        <button
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={handleDiscover}
          id="discover-btn"
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
