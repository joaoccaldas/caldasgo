import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const geo = readFileSync('src/hooks/useGeolocation.ts', 'utf8');
const safety = readFileSync('src/components/SafetyScreen.tsx', 'utf8');

assert.match(
  app,
  /const MapScreen\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/MapScreen['"]\)\)/,
  'MapScreen must remain lazy-loaded so map/geolocation code is not in the initial splash path',
);

assert.doesNotMatch(
  app,
  /import\s+MapScreen\s+from/,
  'MapScreen must not return to a static eager import',
);

assert.match(
  app,
  /stage\s*===\s*['"]playing['"]\s*&&\s*\([\s\S]*?<MapScreen\s*\/>/,
  'MapScreen/geolocation must mount only after the playing stage begins',
);

assert.doesNotMatch(
  geo,
  /localStorage|localforage|indexedDB|setItem\s*\(/i,
  'Precise browser geolocation must not be persisted by the geolocation hook',
);

assert.match(
  safety,
  /Stay Aware of Your Surroundings/,
  'Safety gate must remain present',
);

console.log('CaldasGO location privacy contract passed.');
