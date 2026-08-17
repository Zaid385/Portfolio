import fs from 'fs';
const file = fs.readFileSync('src/registries/app-registry.ts', 'utf8');
console.log(file.includes('Snake'));
