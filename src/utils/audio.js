import { audioMap } from './audioMap';

let currentQueueId = Symbol();
let currentAudio = null;

export const getAudioUrl = async (text, style) => {
  if (audioMap[text]) {
    return audioMap[text];
  }
  console.warn(`[Audio] Missing pre-generated audio for: "${text}"`);
  return null;
};

export const stopNarration = () => {
  currentQueueId = Symbol(); // invalidates active loops
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const narrate = async (segments, force = true) => {
  if (force) stopNarration();
  
  const queueId = currentQueueId;

  for (let i = 0; i < segments.length; i++) {
    if (currentQueueId !== queueId) break;
    
    const seg = segments[i];

    // Eager preload next
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }

    const url = await getAudioUrl(seg.text, seg.style);
    if (!url) continue;

    await new Promise((resolve) => {
      if (currentQueueId !== queueId) return resolve();
      
      const audio = new Audio(url);
      
      // Speed adjustments for younger kids (3rd grade)
      audio.playbackRate = 0.85; 
      
      currentAudio = audio;
      
      audio.onended = resolve;
      audio.onerror = resolve;
      
      audio.play().catch(e => {
        console.warn("Audio playback blocked by browser", e);
        resolve(); // Continue anyway so we don't hang
      });
    });
  }
};

// Segment helpers
export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });
