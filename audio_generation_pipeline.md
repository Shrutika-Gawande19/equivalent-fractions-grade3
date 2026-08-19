# Equivalent Fractions Audio & Narration Pipeline

This document outlines the architecture and workflow of the custom text-to-speech audio narration pipeline used in the Equivalent Fractions (Grade 3) educational module.

## Overview
The application utilizes an offline-ready pre-generated audio pipeline:
1. **Pre-generation:** All educational scripts, instructions, and positive encouragement voice clips are pre-generated offline using ElevenLabs and stored as static `.mp3` assets in `public/assets/audio/`.
2. **Deterministic Lookup:** `src/utils/audioMap.js` maps exact text strings to static asset URLs for instant zero-latency playback.
3. **Overlap Prevention & Queue Management:** The frontend audio engine (`src/utils/audio.js`) stops active narration before triggering new clips, preventing audio overlap across stations, rounds, and rapid user clicks.
4. **Mute Control:** The global audio toggle button mutes all audio clips instantly across all phases.

---

## 1. Voice Profile & Settings

- **Voice Provider:** ElevenLabs
- **Voice Name:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`

### Voice Settings by Style

| Style | Stability | Similarity Boost | Style | Speaker Boost |
|-------|-----------|-----------------|-------|---------------|
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

---

## 2. Pipeline Components & Scripts

### A. Offline Generation (`scripts/generate_audio.js`)
Generates `.mp3` audio files for all phrases in the application:
- Intro Screen
- Wonder Phase
- Story Phase
- Simulation Phase (Station A: Fraction Bar Splitter, Station B: Fraction Bridge, Station C: Magic Fraction Machine)
- Practice Phase (Map welcome, World intros, varied answer feedbacks, World completion celebration)

```bash
npm run audio:generate
```

### B. Audio Cleanup (`scripts/clean_audio.js`)
Scans `public/assets/audio/` and deletes orphaned `.mp3` files not referenced in `audioMap.js`.

```bash
npm run audio:clean
```

### C. Narration Engine (`src/utils/narration.js` & `src/utils/audio.js`)
- `src/utils/narration.js`: Contains structured helper functions for each phase and station.
- `src/utils/audio.js`: Plays narration queues, preloads upcoming tracks, and enforces overlap prevention via `stopNarration()`.
