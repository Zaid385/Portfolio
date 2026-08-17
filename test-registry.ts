import { appRegistry } from './src/registries/app-registry.js';
console.log(Object.keys(appRegistry));
console.log(appRegistry['snake'] ? 'Snake OK' : 'Snake Missing');
