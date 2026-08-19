import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '../public/assets/audio');
const MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

async function cleanAudio() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log("Audio directory does not exist.");
    return;
  }

  if (!fs.existsSync(MAP_FILE)) {
    console.log("audioMap.js does not exist.");
    return;
  }

  const { audioMap } = await import(`file://${MAP_FILE}`);
  const referencedFiles = new Set(
    Object.values(audioMap).map((relPath) => path.basename(relPath))
  );

  const filesInDir = fs.readdirSync(AUDIO_DIR);
  let removedCount = 0;
  let keptCount = 0;

  for (const file of filesInDir) {
    if (!file.endsWith('.mp3')) continue;

    if (!referencedFiles.has(file)) {
      const fullPath = path.join(AUDIO_DIR, file);
      fs.unlinkSync(fullPath);
      console.log(`[REMOVED UNUSED] ${file}`);
      removedCount++;
    } else {
      keptCount++;
    }
  }

  console.log(`\nCleanup complete! Kept: ${keptCount} files. Removed: ${removedCount} unused files.`);
}

cleanAudio();
