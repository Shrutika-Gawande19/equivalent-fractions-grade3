import React, { useState } from 'react';

const REFLECT_QUESTIONS = [
  {
    question: "Which of these is equivalent to 1/2?",
    emoji: '🍕',
    options: [
      { text: '2/4', correct: true },
      { text: '1/3', correct: false },
      { text: '3/5', correct: false },
      { text: '2/5', correct: false },
    ],
  },
  {
    question: "What does 'equivalent fractions' mean?",
    emoji: '🌍',
    options: [
      { text: 'Fractions that look the same', correct: false },
      { text: 'Fractions with the same value', correct: true },
      { text: 'Fractions that are less than 1', correct: false },
      { text: 'Fractions with the same denominator', correct: false },
    ],
  },
  {
    question: "To find an equivalent fraction, you should...",
    emoji: '✨',
    options: [
      { text: 'Add the same number to top and bottom', correct: false },
      { text: 'Multiply top and bottom by the same number', correct: true },
      { text: 'Only change the denominator', correct: false },
      { text: 'Divide only the numerator', correct: false },
    ],
  },
];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    color: ['#ffc107','#4caf50','#6366f1','#ef4444','#06b6d4'][i % 5],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          background: p.color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}

export default function ReflectPhase({ stats, onRestart, onGoHome }) {
  const [step, setStep] = useState(0); // 0,1,2 = questions; 3 = certificate
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const question = REFLECT_QUESTIONS[step];
  const totalCorrect = answers.filter(Boolean).length;

  const handleOption = (opt) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    const isCorrect = opt.correct;
    setTimeout(() => {
      setAnswers(prev => [...prev, isCorrect]);
      setSelectedOpt(null);
      if (step + 1 >= REFLECT_QUESTIONS.length) {
        setShowCertificate(true);
        setStep(REFLECT_QUESTIONS.length);
      } else {
        setStep(s => s + 1);
      }
    }, 900);
  };

  if (showCertificate) {
    return (
      <div className="reflect-phase">
        <Confetti />
        <div className="certificate-card">
          <div className="cert-badge">🏆</div>
          <h2 className="cert-title">Lesson Complete!</h2>
          <p className="cert-subtitle">You are an Equivalence Champion!</p>

          <div className="cert-stats">
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{stats?.totalXP ?? 0}</div>
              <div className="cert-stat-label">XP Earned</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--green)' }}>{totalCorrect}/{REFLECT_QUESTIONS.length}</div>
              <div className="cert-stat-label">Reflect Score</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--purple-light)' }}>10</div>
              <div className="cert-stat-label">Worlds Visited</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={onRestart}>🔄 Play Again</button>
            <button className="btn btn-outline btn-sm" onClick={onGoHome}>🏠 Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <p className="reflect-label">Phase 5 — Reflect 📓</p>
        <p className="reflect-sublabel">Test what you've learned!</p>
      </div>

      <div className="reflect-card">
        <div className="reflect-mascot-row">
          <div className="mascot happy" style={{ fontSize: '2rem' }}>🌍</div>
          <div className="speech-bubble">Let's see what you remember! 🧠</div>
        </div>

        <h3 className="reflect-card-title">{question.emoji} {question.question}</h3>

        <div className="reflect-options">
          {question.options.map((opt, i) => {
            let cls = 'reflect-option';
            if (selectedOpt) {
              if (opt.correct) cls += ' correct';
              else if (opt === selectedOpt) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOption(opt)} disabled={selectedOpt !== null}>
                {opt.text}
              </button>
            );
          })}
        </div>

        <div className="reflect-progress">
          {REFLECT_QUESTIONS.map((_, i) => (
            <div key={i} className={`reflect-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
