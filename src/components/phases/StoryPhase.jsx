import React, { useState, useEffect, useCallback } from 'react';
import { FractionPair, FractionBar, FractionCircle, NumberLine } from '../shared/FractionDiagrams';
import { narrate, stopNarration } from '../../utils/audio';
import { getStoryNarration } from '../../utils/narration';

const STORY_SLIDES = [
  {
    title: "John's Chocolate Bar 🇨🇦",
    text: "Meet John from Toronto. He has a chocolate bar cut into 2 equal pieces. He eats 1 piece. That's one half!",
    highlight: '"John eats 1/2 of his chocolate bar!"',
    mascotText: "One out of two equal parts! 🍫",
    img: '/images/john.png',
    emoji: '🍫',
  },
  {
    title: "Mei's Chocolate Bar 🇨🇳",
    text: "Meet Mei from Beijing. She has the SAME size chocolate bar, cut into 4 equal pieces. She eats 2 pieces. That's two quarters!",
    highlight: '"Mei eats 2/4 of her bar!"',
    mascotText: "Two out of four equal parts! 🍫",
    img: '/images/mei.png',
    emoji: '🍫',
  },
  {
    title: "They Ate the Same Amount! ✨",
    text: "Look — the shaded part is exactly equal! John's 1/2 and Mei's 2/4 cover the same area. They are EQUIVALENT fractions!",
    highlight: '"1/2 = 2/4 — same value, different names!"',
    mascotText: "Equivalent means equal value! =",
    img: '/images/sharing.png',
    emoji: '✨',
  },
  {
    title: "Priya's Dosa 🇮🇳",
    text: "Meet Priya from Mumbai. Her dosa is cut into 6 equal pieces. She eats 3 pieces — that's 3/6. Is it the same as 1/2 too?",
    highlight: '"Is 3/6 the same as 1/2?"',
    mascotText: "Let's check on the number line! 🔢",
    img: '/images/priya.png',
    emoji: '🫓',
  },
  {
    title: "All on the Same Spot! 🔢",
    text: "1/2, 2/4 and 3/6 all land on the SAME point on the number line! They are all equivalent — same value, different names!",
    highlight: '"1/2 = 2/4 = 3/6 — all equivalent!"',
    mascotText: "Same spot, different names! 🌟",
    img: '/images/number_line_magic.png',
    emoji: '🔢',
  },
  {
    title: "The Golden Rule! 🌟",
    text: "Multiply or divide the top AND bottom by the same number and you get an equivalent fraction. The value stays the same!",
    highlight: '"1/2 × 2/2 = 2/4 — multiply both parts equally!"',
    mascotText: "Now you know the secret! 🚀",
    img: '/images/golden_rule.png',
    emoji: '🌟',
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);

  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    
    // Play narration for the current slide
    if (audioEnabled) {
      narrate(getStoryNarration(slide), true);
    }

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      stopNarration();
    };
  }, [slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>

      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-visual-section" style={{ padding: '0' }}>
          {s.img && (
            <img 
              src={s.img} 
              alt={s.title}
              className="story-main-image" 
              style={{ 
                width: '100%', 
                height: '240px',
                display: 'block',
                objectFit: 'contain',
                borderRadius: '24px 24px 0 0',
                borderBottom: '4px solid rgba(255,255,255,0.1)'
              }} 
            />
          )}
          <div className="story-image-overlay" />
        </div>

        <div className="story-text-section">
          <h2 className="story-title" style={{ marginBottom: '1rem' }}>{s.title}</h2>
          
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span>
            <span className="story-highlight-text">{s.highlight}</span>
            <span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🌍</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 200 }}>
              {s.mascotText}
            </div>
          </div>
        </div>
      </div>

      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>
          ← Back
        </button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />
          ))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
