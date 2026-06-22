const fs = require('fs');
const path = require('path');

const parksPath = path.join(__dirname, '../backend/src/routes/parks.ts');
let s = fs.readFileSync(parksPath, 'utf8');

if (!s.includes('const pic =')) {
  s = s.replace(
    'const router = Router();',
    "const router = Router();\n\nconst pic = (seed: string, w = 1400) => `https://picsum.photos/seed/${seed}/${w}/900`;",
  );
}

const parts = s.split(/(slug: '[^']+')/);
let out = parts[0];
for (let i = 1; i < parts.length; i += 2) {
  const slugLine = parts[i];
  let block = parts[i + 1] ?? '';
  const slug = slugLine.match(/slug: '([^']+)'/)[1];
  block = block.replace(
    /coverImage: 'https:[^']+'/,
    `coverImage: pic('${slug}')`,
  );
  out += slugLine + block;
}
s = out;

// categories
s = s.replace(
  /(\{ id: '([^']+)', name: [^,]+, count: \d+, )image: 'https:[^']+'/g,
  "$1image: pic('cat-$2', 600)",
);

// attractions img fields
s = s.replace(/img: 'https:[^']+'/g, (m, offset) => {
  const ctx = s.slice(offset - 120, offset + 20);
  const idM = ctx.match(/id: '([^']+)'/);
  const seed = idM ? `attr-${idM[1]}` : 'attr-generic';
  return `img: pic('${seed}', 800)`;
});

fs.writeFileSync(parksPath, s);
console.log('Updated', parksPath);
