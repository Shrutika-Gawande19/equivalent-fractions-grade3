import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');
const MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

const phrases = [
  // Intro Screen
  { text: "Welcome to learn Equivalent Fractions! Around the world.", style: 'statement' },

  // Wonder Phase
  { text: "Hmm... are these equal?", style: 'question' },
  { text: "John has 1 by 2 of a pizza. Sarah has 2 by 4 of the SAME size pizza. Who has more?", style: 'question' },
  { text: "When two fractions cover the same area, they are called equivalent fractions!", style: 'statement' },
  { text: "Mei has a chocolate bar cut into 4 pieces and eats 2. John's bar is cut into 2 — he eats 1. Did they eat the same amount?", style: 'question' },
  { text: "Two fractions that look different can still be equal!", style: 'statement' },
  { text: "Priya's dosa is cut into 6 pieces. She eats 3. Is that the same as eating 1 by 2?", style: 'question' },
  { text: "3 by 6 and 1 by 2... are they secretly the same fraction?", style: 'question' },

  // Story Phase
  { text: "Meet John from Toronto. He has a chocolate bar cut into 2 equal pieces. He eats 1 piece. That's one half!", style: 'statement' },
  { text: '"John eats 1 by 2 of his chocolate bar!"', style: 'emphasis' },
  { text: "One out of two equal parts!", style: 'statement' },
  { text: "Meet Mei from Beijing. She has the SAME size chocolate bar, cut into 4 equal pieces. She eats 2 pieces. That's two quarters!", style: 'statement' },
  { text: '"Mei eats 2 by 4 of her bar!"', style: 'emphasis' },
  { text: "Two out of four equal parts!", style: 'statement' },
  { text: "Look — the shaded part is exactly equal! John's 1 by 2 and Mei's 2 by 4 cover the same area. They are EQUIVALENT fractions!", style: 'statement' },
  { text: '"1 by 2 equals 2 by 4 — same value, different names!"', style: 'emphasis' },
  { text: "Equivalent means equal value!", style: 'statement' },
  { text: "Meet Priya from Mumbai. Her dosa is cut into 6 equal pieces. She eats 3 pieces — that's 3 by 6. Is it the same as 1 by 2?", style: 'question' },
  { text: '"Is 3 by 6 the same as 1 by 2?"', style: 'question' },
  { text: "Let's check on the number line!", style: 'statement' },
  { text: "1 by 2, 2 by 4 and 3 by 6 all land on the SAME point on the number line! They are all equivalent — same value, different names!", style: 'statement' },
  { text: '"1 by 2 equals 2 by 4 equals 3 by 6 — all equivalent!"', style: 'emphasis' },
  { text: "Same spot, different names!", style: 'statement' },
  { text: "Multiply or divide the top AND bottom by the same number and you get an equivalent fraction. The value stays the same!", style: 'statement' },
  { text: '"1 by 2 times 2 by 2 equals 2 by 4 — multiply both parts equally!"', style: 'emphasis' },
  { text: "Now you know the secret!", style: 'celebration' },

  // --- Simulation Phase: Station A (Fraction Bar Splitter) ---
  { text: "Make a bar that shows the same amount as the target fraction. Click segments to shade them!", style: 'instruction' },
  { text: "Great! You shaded the matching fraction parts!", style: 'celebration' },
  { text: "Super job! Both fractions cover the exact same area!", style: 'celebration' },
  { text: "Awesome! You mastered the Fraction Bar Splitter station!", style: 'celebration' },
  { text: "Not quite! Try adjusting the parts to match the area.", style: 'statement' },

  // --- Simulation Phase: Station B (Fraction Bridge) ---
  { text: "Click only the stepping stones with fractions equivalent to the starting fraction to cross safely to the treasure!", style: 'instruction' },
  { text: "Brilliant crossing! You found all the equivalent fraction stepping stones!", style: 'celebration' },
  { text: "Treasure unlocked! You crossed the fraction bridge like a champion!", style: 'celebration' },
  { text: "That fraction is not equivalent. Choose carefully!", style: 'statement' },

  // --- Simulation Phase: Station C (Magic Fraction Machine) ---
  // Using explicit "by" phrasing for fractions (e.g., 2 by 3, 4 by 6)
  { text: "Press each magic multiplier button to see how multiplying top and bottom numbers creates equivalent fractions!", style: 'instruction' },
  { text: "Multiplied by 2! 2 by 3 transforms into 4 by 6!", style: 'celebration' },
  { text: "Multiplied by 3! 2 by 3 transforms into 6 by 9!", style: 'celebration' },
  { text: "Multiplied by 4! 2 by 3 transforms into 8 by 12!", style: 'celebration' },
  { text: "Multiplied by 5! 2 by 3 transforms into 10 by 15!", style: 'celebration' },
  { text: "Magical! You discovered all 4 equivalent fractions! Multiplying top and bottom by the same number keeps the value equal!", style: 'celebration' },

  // --- Practice Phase (Play Phase) ---
  { text: "Welcome to the Practice Phase! Travel around the world and solve equivalent fraction challenges to earn stars and XP!", style: 'celebration' },
  { text: "Welcome to Toronto Bakery! Decide if the two fractions shown are equivalent.", style: 'statement' },
  { text: "Welcome to Mumbai Market! Choose the fraction equivalent to the target.", style: 'statement' },
  { text: "Welcome to Tokyo Sushi Bar! Find the missing number to make the fractions equivalent.", style: 'statement' },
  { text: "Correct!", style: 'celebration' },
  { text: "Great job!", style: 'celebration' },
  { text: "Spot on!", style: 'celebration' },
  { text: "Well done!", style: 'celebration' },
  { text: "Oops, not quite! Keep trying!", style: 'statement' },
  { text: "Fantastic work! You completed this world and earned your stars!", style: 'celebration' },
  { text: "Incredible! You completed all the practice worlds around the world!", style: 'celebration' },
  { text: "Good try! Replay this world to score enough stars to unlock the next destination!", style: 'statement' },

  // Legacy fallback feedbacks
  { text: "Correct.", style: 'celebration' },
  { text: "Wrong.", style: 'statement' },
];

const getSettings = (style) => {
  const settings = { stability: 0.2, similarity_boost: 0.55, style: 0.5, use_speaker_boost: true };
  if (style === 'celebration') return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
  if (style === 'question') return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
  if (style === 'emphasis') return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
  if (style === 'instruction') return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  return settings;
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '').substring(0, 80);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!ELEVENLABS_API_KEY) {
    console.error("Missing VITE_ELEVENLABS_API_KEY in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = slugify(text);
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const relpath = `/assets/audio/${filename}`;

    audioMap[text] = relpath;

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`[SKIP] Already generated: ${filename}`);
      continue;
    }

    console.log(`[GENERATE ${i + 1}/${phrases.length}] Generating: ${text}`);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: getSettings(style)
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`[SUCCESS] Saved ${filename}`);
      
      await delay(400); // Rate limit
    } catch (e) {
      console.error(`[ERROR] Failed to generate "${text}": ${e.message}`);
    }
  }

  const mapContent = `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log("audioMap.js generated successfully!");
}

main();
