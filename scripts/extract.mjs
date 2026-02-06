import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
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

// If there's a single directory inside, we need to copy its contents
let sourceDir = '/tmp/extracted';
if (extractedContents.length === 1) {
  const innerPath = join('/tmp/extracted', extractedContents[0]);
  try {
    readdirSync(innerPath);
    sourceDir = innerPath;
    console.log('Found inner directory:', sourceDir);
  } catch {
    // Not a directory, use the parent
  }
}

// Copy files to project root, excluding the zip and existing files we want to keep
console.log('Copying files from', sourceDir, 'to', projectRoot);
execSync(`cp -r "${sourceDir}"/* "${projectRoot}"/`, { stdio: 'inherit' });
// Also copy hidden files like .gitignore etc.
try {
  execSync(`cp -r "${sourceDir}"/.[!.]* "${projectRoot}"/ 2>/dev/null || true`, { stdio: 'inherit' });
} catch {
  // Ignore errors for hidden files
}

console.log('Extraction complete!');

// List the app directory to verify
if (existsSync(join(projectRoot, 'app'))) {
  console.log('app/ directory found!');
  console.log('Contents:', readdirSync(join(projectRoot, 'app')));
} else if (existsSync(join(projectRoot, 'src', 'app'))) {
  console.log('src/app/ directory found!');
  console.log('Contents:', readdirSync(join(projectRoot, 'src', 'app')));
} else {
  console.log('WARNING: No app directory found after extraction!');
  console.log('Root contents:', readdirSync(projectRoot).filter(f => !f.startsWith('.')));
}
