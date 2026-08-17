const fs = require('fs');
const path = require('path');

const registryContent = fs.readFileSync('/home/zaid/Documents/Portfolio/src/assets/registry.ts', 'utf8');
const regex = /'..\/..\/assets\/([^']+)'/g;
let match;
const usedAssets = new Set();
while ((match = regex.exec(registryContent)) !== null) {
  usedAssets.add(path.join('/home/zaid/Documents/Portfolio/assets', match[1]));
}

const resumeContent = fs.readFileSync('/home/zaid/Documents/Portfolio/src/content/resume.ts', 'utf8');
while ((match = regex.exec(resumeContent)) !== null) {
  usedAssets.add(path.join('/home/zaid/Documents/Portfolio/assets', match[1]));
}

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const allAssets = scanDir('/home/zaid/Documents/Portfolio/assets');
let deletedCount = 0;
allAssets.forEach(file => {
  if (!usedAssets.has(file)) {
    fs.unlinkSync(file);
    deletedCount++;
  }
});

// Also remove empty directories
function removeEmptyDirs(dir) {
  const list = fs.readdirSync(dir);
  let empty = true;
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!removeEmptyDirs(file)) {
        empty = false;
      }
    } else {
      empty = false;
    }
  });
  if (empty) {
    fs.rmdirSync(dir);
  }
  return empty;
}

removeEmptyDirs('/home/zaid/Documents/Portfolio/assets');

console.log(`Deleted ${deletedCount} unused assets.`);
