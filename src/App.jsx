import { useState, useCallback } from 'react';
import FloatingFractions from './components/FloatingFractions';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [playStats, setPlayStats] = useState(null);

  const goHome = useCallback(() => { setPhase('intro'); setPlayStats(null); }, []);
  const restart = useCallback(() => { setPhase('wonder'); setPlayStats(null); }, []);

  const handleScoreUpdate = useCallback((isCorrect) => {
    if (isCorrect) {
      setXp(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingFractions />
      <div className="app-container">
        {/* Audio Toggle */}
        <button className="audio-toggle-btn" onClick={() => setAudioEnabled(p => !p)} title={audioEnabled ? 'Mute' : 'Unmute'}>
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Home Button */}
        {showJourney && (
          <button className="home-btn" onClick={goHome}>
            🏠 Home
          </button>
        )}

        {/* Journey Bar */}
        {showJourney && (
          <div className="journey-bar">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1;
              const isActive = phaseIndex === stepPhaseIndex;
              const isCompleted = phaseIndex > stepPhaseIndex;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="journey-step-dot">{isCompleted ? '✓' : item.icon}</div>
                    <div className="journey-step-label">{item.label}</div>
                  </div>
                  {i < JOURNEY_ITEMS.length - 1 && (
                    <div className={`journey-connector ${phaseIndex > stepPhaseIndex ? 'filled' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Phase Content */}
        {phase === 'intro' && <IntroScreen onStart={() => setPhase('wonder')} />}
        {phase === 'wonder' && <WonderPhase onComplete={() => setPhase('story')} />}
        {phase === 'story' && <StoryPhase onComplete={() => setPhase('simulate')} />}
        {phase === 'simulate' && <SimulatePhase onComplete={() => setPhase('play')} />}
        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }}
            xp={xp}
            streak={streak}
            onScoreUpdate={handleScoreUpdate}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase stats={{ ...playStats, totalXP: xp }} onRestart={restart} onGoHome={goHome} />
        )}
      </div>
    </>
  );
}
