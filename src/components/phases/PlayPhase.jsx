import React, { useState, useCallback, useRef } from 'react';
import { FractionBar } from '../shared/FractionDiagrams';

const WORLDS = [
  { id: 0, name: 'Toronto Bakery', flag: '🇨🇦', icon: '🍞', color: '#ef4444', diffs: 'Easy' },
  { id: 1, name: 'Mumbai Market', flag: '🇮🇳', icon: '🫓', color: '#eab308', diffs: 'Medium' },
  { id: 2, name: 'Tokyo Sushi Bar', flag: '🇯🇵', icon: '🍣', color: '#06b6d4', diffs: 'Hard' },
];

const TOTAL_WORLDS = WORLDS.length;
const QUESTIONS_PER_WORLD = 10;
const PASS_SCORE = 6;

// Generate questions for a world
function generateWorldQuestions(worldIdx) {
  return Array.from({ length: QUESTIONS_PER_WORLD }, (_, i) => {
    const dA = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const nA = Math.floor(Math.random() * (dA - 1)) + 1; // 1 to dA-1
    const mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const nB = nA * mult;
    const dB = dA * mult;
    
    if (worldIdx === 0) {
      // World 0: True / False
      const isEquiv = Math.random() > 0.4;
      const nB_show = isEquiv ? nB : nB + 1;
      return {
        id: `W${worldIdx}_Q${i}`,
        type: 'true_false',
        questionText: `Is ${nA}/${dA} equivalent to ${nB_show}/${dB}?`,
        nA, dA, nB: nB_show, dB,
        isEquivalent: isEquiv,
        options: ['Yes, equivalent ✓', 'No, not equivalent ✗'],
        correctAnswer: isEquiv ? 'Yes, equivalent ✓' : 'No, not equivalent ✗',
      };
    } else if (worldIdx === 1) {
      // World 1: Multiple Choice
      const wrong1 = { n: nB + 1, d: dB };
      const wrong2 = { n: nB, d: dB + 1 };
      const opts = [`${nB}/${dB}`, `${wrong1.n}/${wrong1.d}`, `${wrong2.n}/${wrong2.d}`];
      // shuffle opts
      for (let j = opts.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [opts[j], opts[k]] = [opts[k], opts[j]];
      }
      return {
        id: `W${worldIdx}_Q${i}`,
        type: 'multiple_choice',
        questionText: `Find the fraction equivalent to ${nA}/${dA}.`,
        nA, dA,
        options: opts,
        correctAnswer: `${nB}/${dB}`,
      };
    } else {
      // World 2: Missing Value
      const wrong1 = nB + 1;
      const wrong2 = nB - 1 > 0 ? nB - 1 : nB + 2;
      const opts = [nB.toString(), wrong1.toString(), wrong2.toString()];
      // shuffle opts
      for (let j = opts.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [opts[j], opts[k]] = [opts[k], opts[j]];
      }
      return {
        id: `W${worldIdx}_Q${i}`,
        type: 'missing_value',
        questionText: `Find the missing number to make them equivalent:`,
        nA, dA, nB, dB, // nB is the missing value we want them to find
        options: opts,
        correctAnswer: nB.toString(),
      };
    }
  });
}

function WorldMap({ worlds, worldScores, onSelectWorld }) {
  return (
    <div className="world-map">
      {worlds.map((w, i) => {
        const score = worldScores[i];
        const unlocked = i === 0 || (worldScores[i - 1] !== null && worldScores[i - 1] >= PASS_SCORE);
        const completed = score !== null;
        const stars = score === null ? 0 : score >= 9 ? 3 : score >= 7 ? 2 : score >= PASS_SCORE ? 1 : 0;
        return (
          <div
            key={i}
            className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
            style={{ '--world-color': w.color }}
            onClick={() => unlocked && onSelectWorld(i)}
          >
            {!unlocked && <span className="world-lock">🔒</span>}
            <span className="world-icon">{w.flag} {w.icon}</span>
            <span className="world-name">{w.name}</span>
            <span className="world-desc">{w.diffs}</span>
            <div className="world-stars">
              {[1, 2, 3].map(s => <span key={s} className={`world-star ${stars >= s ? 'earned' : ''}`}>⭐</span>)}
              {completed && <span className="world-score">{score}/{QUESTIONS_PER_WORLD}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestionCard({ question, onAnswer, xp, streak }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (opt) => {
    if (answered) return;
    const correct = opt === question.correctAnswer;
    setSelected(opt);
    setAnswered(true);
    setIsCorrect(correct);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="question-card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="hud-item">⚡ {xp} XP</div>
        <div className="hud-item">🔥 {streak}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <FractionBar numerator={question.nA} denominator={question.dA} width={220} height={44} />
      </div>
      
      {question.type === 'true_false' && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px' }}>
          <FractionBar numerator={question.nB} denominator={question.dB} width={220} height={44} colour="#a78bfa" />
        </div>
      )}

      {question.type === 'missing_value' && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {question.nA}/{question.dA} = ? / {question.dB}
        </div>
      )}

      <p className="question-text">{question.questionText}</p>

      <div className={question.type === 'missing_value' ? "options-grid options-small" : "options-grid"}>
        {question.options.map((opt, i) => {
          let cls = 'option-btn';
          if (answered) {
            if (opt === question.correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (opt === selected) cls += ' selected';
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)}>{opt}</button>
          );
        })}
      </div>

      {/* Feedback Popup */}
      {answered && (
        <div className="answer-feedback-overlay">
          <div className={`answer-feedback-popup ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-emoji">{isCorrect ? '🎉' : '😕'}</div>
            <div className="feedback-title">{isCorrect ? 'Correct!' : 'Oops, wrong!'}</div>
            {!isCorrect && (
              <div className="feedback-answer">
                The answer was: <strong>{question.correctAnswer}</strong>
              </div>
            )}
            <button className="btn btn-primary btn-sm feedback-next-btn" onClick={handleNext}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Duplicate QuestionCard block removed */

function WorldComplete({ world, score, onNext, onMap, isLastWorld }) {
  const stars = score >= 9 ? 3 : score >= 7 ? 2 : score >= PASS_SCORE ? 1 : 0;
  return (
    <div className="world-complete-card">
      <div className="world-complete-icon">{world.flag} {world.icon}</div>
      <h2 className="world-complete-title">{world.name} Complete!</h2>
      <div className="world-complete-stars">
        {[1, 2, 3].map(s => <span key={s} className={`world-star ${stars >= s ? 'earned' : ''}`} style={{ animationDelay: `${s * 0.15}s` }}>⭐</span>)}
      </div>
      <div className="world-complete-score">{score}/{QUESTIONS_PER_WORLD} Correct</div>
      {score >= PASS_SCORE
        ? <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          {isLastWorld ? 'All worlds complete! Amazing! 🎉' : 'World unlocked! Keep going! 🚀'}
        </p>
        : <p style={{ color: 'var(--red)', marginBottom: 20 }}>Need {PASS_SCORE}/{QUESTIONS_PER_WORLD} to unlock next world. Try again!</p>}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {score >= PASS_SCORE && !isLastWorld && <button className="btn btn-primary btn-sm" onClick={onNext}>Next World →</button>}
        <button className="btn btn-outline btn-sm" onClick={onMap}>World Map</button>
      </div>
    </div>
  );
}




export default function PlayPhase({ onComplete, xp, streak, onScoreUpdate }) {
  const [view, setView] = useState('map');
  const [currentWorld, setCurrentWorld] = useState(0);
  const [worldScores, setWorldScores] = useState(Array(TOTAL_WORLDS).fill(null));
  const [questions, setQuestions] = useState([]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const worldScoreRef = useRef(0);

  const startWorld = useCallback((worldIdx) => {
    setCurrentWorld(worldIdx);
    setQuestions(generateWorldQuestions(worldIdx));
    setQuestionIdx(0);
    worldScoreRef.current = 0;
    setView('playing');
  }, []);

  const handleAnswer = useCallback((isCorrect) => {
    onScoreUpdate(isCorrect);
    if (isCorrect) {
      worldScoreRef.current += 1;
    }
    const newScore = worldScoreRef.current;
    setQuestionIdx(prev => {
      const nextIdx = prev + 1;
      if (nextIdx >= QUESTIONS_PER_WORLD) {
        // World complete
        setWorldScores(prevScores => {
          const updated = [...prevScores];
          updated[currentWorld] = newScore;
          if (currentWorld === TOTAL_WORLDS - 1 && newScore >= PASS_SCORE) {
            setTimeout(() => onComplete({ worldScores: updated, totalXP: xp }), 2000);
          }
          return updated;
        });
        setView('worldComplete');
      }
      return nextIdx;
    });
  }, [currentWorld, onComplete, onScoreUpdate, xp]);

  const handleNextWorld = useCallback(() => {
    const next = currentWorld + 1;
    if (next < TOTAL_WORLDS) startWorld(next);
  }, [currentWorld, startWorld]);



  const currentQuestion = questions[questionIdx];

  return (
    <div className="play-phase">
      <div className="play-header">
        <h2 className="play-title">🌍 Around the World</h2>
        <p className="play-subtitle">{QUESTIONS_PER_WORLD} questions per world · Score ≥{PASS_SCORE}/{QUESTIONS_PER_WORLD} to advance</p>
        <span className="play-xp-badge">⚡ {xp} XP · 🔥 {streak} Streak</span>
      </div>

      {view === 'map' && (
        <WorldMap worlds={WORLDS} worldScores={worldScores} onSelectWorld={startWorld} />
      )}

      {view === 'playing' && currentQuestion && (
        <>
          <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {WORLDS[currentWorld].flag} {WORLDS[currentWorld].name} · Q{questionIdx + 1}/{QUESTIONS_PER_WORLD} · Score: {worldScoreRef.current}
          </div>
          <div className="progress-dots">
            {Array.from({ length: QUESTIONS_PER_WORLD }).map((_, i) => (
              <div key={i} className={`progress-dot ${i < questionIdx ? 'completed' : i === questionIdx ? 'active' : ''}`} />
            ))}
          </div>
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            xp={xp}
            streak={streak}
          />
        </>
      )}

      {view === 'worldComplete' && (
        <WorldComplete
          world={WORLDS[currentWorld]}
          score={worldScoreRef.current}
          onNext={handleNextWorld}
          onMap={() => setView('map')}
          isLastWorld={currentWorld === TOTAL_WORLDS - 1}
        />
      )}
    </div>
  );
}

