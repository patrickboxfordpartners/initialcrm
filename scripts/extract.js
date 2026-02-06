const { execSync } = require('child_process');
const { existsSync, readdirSync } = require('fs');
const { join } = require('path');

const projectRoot = '/vercel/share/v0-project';
const zipFile = join(projectRoot, 'initialcrm-main.zip');

if (!existsSync(zipFile)) {
  console.error('ZIP file not found:', zipFile);
  process.exit(1);
}

console.log('Extracting zip file...');

// Extract to a temp directory
execSync(`unzip -o "${zipFile}" -d /tmp/extracted`, { stdio: 'inherit' });

// Check what was extracted
const extractedContents = readdirSync('/tmp/extracted');
console.log('Extracted contents:', extractedContents);

// If there's a single directory inside, copy its contents
let sourceDir = '/tmp/extracted';
if (extractedContents.length === 1) {
  const innerPath = join('/tmp/extracted', extractedContents[0]);
  try {
    readdirSync(innerPath);
    sourceDir = innerPath;
    console.log('Found inner directory:', sourceDir);
  } catch (e) {
    // Not a directory
  }
}

// Copy files to project root
console.log('Copying files from', sourceDir, 'to', projectRoot);
execSync(`cp -r ${sourceDir}/* ${projectRoot}/`, { stdio: 'inherit' });
try {
  execSync(`cp -r ${sourceDir}/.[!.]* ${projectRoot}/ 2>/dev/null || true`, { stdio: 'inherit' });
} catch (e) {
  // Ignore errors for hidden files
}

console.log('Extraction complete!');

// List the app directory to verify
if (existsSync(join(projectRoot, 'app'))) {
  console.log('SUCCESS: app/ directory found!');
  console.log('Contents:', readdirSync(join(projectRoot, 'app')));
} else if (existsSync(join(projectRoot, 'src', 'app'))) {
  console.log('SUCCESS: src/app/ directory found!');
  console.log('Contents:', readdirSync(join(projectRoot, 'src', 'app')));
} else {
  console.log('WARNING: No app directory found after extraction!');
  console.log('Root contents:', readdirSync(projectRoot).filter(f => !f.startsWith('.')));
}
