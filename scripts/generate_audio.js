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
  // Wonder Phase
  { text: "Hmm... are these equal?", style: 'question' },
  { text: "John has 1/2 of a pizza. Sarah has 2/4 of the SAME size pizza. Who has more?", style: 'question' },
  { text: "When two fractions cover the same area, they are called equivalent fractions!", style: 'statement' },
  { text: "Mei has a chocolate bar cut into 4 pieces and eats 2. John's bar is cut into 2 — he eats 1. Did they eat the same amount?", style: 'question' },
  { text: "Two fractions that look different can still be equal!", style: 'statement' },
  { text: "Priya's dosa is cut into 6 pieces. She eats 3. Is that the same as eating 1/2?", style: 'question' },
  { text: "3/6 and 1/2... are they secretly the same fraction?", style: 'question' },
  // Story Phase
  { text: "Meet John from Toronto. He has a chocolate bar cut into 2 equal pieces. He eats 1 piece. That's one half!", style: 'statement' },
  { text: '"John eats 1/2 of his chocolate bar!"', style: 'emphasis' },
  { text: "One out of two equal parts!", style: 'statement' },
  { text: "Meet Mei from Beijing. She has the SAME size chocolate bar, cut into 4 equal pieces. She eats 2 pieces. That's two quarters!", style: 'statement' },
  { text: '"Mei eats 2/4 of her bar!"', style: 'emphasis' },
  { text: "Two out of four equal parts!", style: 'statement' },
  { text: "Look — the shaded part is exactly equal! John's 1/2 and Mei's 2/4 cover the same area. They are EQUIVALENT fractions!", style: 'statement' },
  { text: '"1/2 = 2/4 — same value, different names!"', style: 'emphasis' },
  { text: "Equivalent means equal value!", style: 'statement' },
  { text: "Meet Priya from Mumbai. Her dosa is cut into 6 equal pieces. She eats 3 pieces — that's 3/6. Is it the same as 1/2 too?", style: 'question' },
  { text: '"Is 3/6 the same as 1/2?"', style: 'question' },
  { text: "Let's check on the number line!", style: 'statement' },
  { text: "1/2, 2/4 and 3/6 all land on the SAME point on the number line! They are all equivalent — same value, different names!", style: 'statement' },
  { text: '"1/2 = 2/4 = 3/6 — all equivalent!"', style: 'emphasis' },
  { text: "Same spot, different names!", style: 'statement' },
  { text: "Multiply or divide the top AND bottom by the same number and you get an equivalent fraction. The value stays the same!", style: 'statement' },
  { text: '"1/2 × 2/2 = 2/4 — multiply both parts equally!"', style: 'emphasis' },
  { text: "Now you know the secret!", style: 'celebration' },
  // Play Phase – answer feedback
  { text: "Correct.", style: 'celebration' },
  { text: "Wrong.", style: 'statement' },
];

const getSettings = (style) => {
  const settings = { stability: 0.2, similarity_boost: 0.55, style: 0.5, use_speaker_boost: true };
  if (style === 'celebration') return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
  if (style === 'question') return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
  if (style === 'emphasis') return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
  return settings;
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '').substring(0, 40);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!ELEVENLABS_API_KEY) {
    console.error("Missing VITE_ELEVENLABS_API_KEY");
    process.exit(1);
  }

  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = slugify(text);
    const filename = "audio_" + slug + "_" + i + ".mp3";
    const filepath = path.join(OUTPUT_DIR, filename);
    const relpath = "/assets/audio/" + filename;

    audioMap[text] = relpath;

    if (fs.existsSync(filepath)) {
      console.log("[SKIP] Already generated: " + filename);
      continue;
    }

    console.log("[GENERATE] Generating: " + text);

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID, {
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
        throw new Error("API error: " + response.statusText);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log("[SUCCESS] Saved " + filename);
      
      await delay(500); // Rate limit
    } catch (e) {
      console.error("[ERROR] Failed to generate " + text + ": " + e.message);
    }
  }

  const mapContent = "export const audioMap = " + JSON.stringify(audioMap, null, 2) + ";\n";
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log("audioMap.js generated successfully!");
}

main();
