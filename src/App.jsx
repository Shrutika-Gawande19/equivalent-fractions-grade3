import { useState, useCallback, useEffect } from 'react';
import FloatingFractions from './components/FloatingFractions';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';
import { stopNarration, setMuted } from './utils/audio';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Practice Phase' },
  { icon: '📓', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [playStats, setPlayStats] = useState(null);

  const toggleAudio = useCallback(() => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setMuted(!next);
  }, [audioEnabled]);

  // Stop any narration whenever the phase changes to prevent overlap
  const changePhase = useCallback((newPhase) => {
    stopNarration();
    setPhase(newPhase);
  }, []);

  const goHome = useCallback(() => { changePhase('intro'); setPlayStats(null); }, [changePhase]);
  const restart = useCallback(() => { changePhase('wonder'); setPlayStats(null); }, [changePhase]);

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
        <button
          className="audio-toggle-btn"
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute' : 'Unmute'}
          style={showJourney ? { left: '120px', right: 'auto' } : { left: '16px', right: 'auto' }}
        >
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
        {phase === 'intro'    && <IntroScreen onStart={() => changePhase('wonder')} audioEnabled={audioEnabled} />}
        {phase === 'wonder'   && <WonderPhase   onComplete={() => changePhase('story')}    audioEnabled={audioEnabled} />}
        {phase === 'story'    && <StoryPhase    onComplete={() => changePhase('simulate')}  audioEnabled={audioEnabled} />}
        {phase === 'simulate' && <SimulatePhase onComplete={() => changePhase('play')}      audioEnabled={audioEnabled} />}
        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { setPlayStats(stats); changePhase('reflect'); }}
            xp={xp}
            streak={streak}
            onScoreUpdate={handleScoreUpdate}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase stats={{ ...playStats, totalXP: xp }} onRestart={restart} onGoHome={goHome} />
        )}
      </div>
    </>
  );
}
