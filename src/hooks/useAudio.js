import { useState, useCallback, useRef } from 'react';
import { audioMap } from '../utils/audioMap';

const elevenLabsCache = new Map();

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const narrate = useCallback(async (segments, apiKey, onSegmentStart) => {
    // simplified for brevity in this revision
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  return { narrate, stopAudio, isPlaying };
}
