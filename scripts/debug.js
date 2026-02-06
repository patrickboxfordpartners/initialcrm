const { readdirSync, existsSync } = require('fs');
const { resolve } = require('path');

console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Script path:', __filename);

// Check various possible locations
const paths = [
  process.cwd(),
  __dirname,
  resolve(__dirname, '..'),
  '/vercel/share/v0-project',
  '/home/user',
];

for (const p of paths) {
  if (existsSync(p)) {
    try {
      const contents = readdirSync(p);
      console.log(`\nContents of ${p}:`, contents);
    } catch (e) {
      console.log(`\nCannot read ${p}:`, e.message);
    }
  } else {
    console.log(`\nPath does not exist: ${p}`);
  }
}
