const fs = require('fs');

const mainJs = fs.readFileSync('vite-project/src/main.js', 'utf-8');

// Match gameData, gameState, translations
// Since we know their structure from viewing the file:
const gameDataRegex = /(const\s+gameData\s*=\s*\{[\s\S]*?\n        \};\n)/;
const gameStateRegex = /(const\s+gameState\s*=\s*\{[\s\S]*?\n        \};\n)/;
const translationsRegex = /(const\s+translations\s*=\s*\{[\s\S]*?\n        \};\n)/;

const gameDataMatch = mainJs.match(gameDataRegex);
const gameStateMatch = mainJs.match(gameStateRegex);
const translationsMatch = mainJs.match(translationsRegex);

if (gameDataMatch && gameStateMatch && translationsMatch) {
    let dataJs = '';
    dataJs += gameDataMatch[1] + '\n';
    dataJs += gameStateMatch[1] + '\n';
    dataJs += translationsMatch[1] + '\n';
    
    dataJs += 'export { gameData, gameState, translations };\n';
    fs.writeFileSync('vite-project/src/data.js', dataJs);
    
    let newMainJs = mainJs.replace(gameDataMatch[1], '');
    newMainJs = newMainJs.replace(gameStateMatch[1], '');
    newMainJs = newMainJs.replace(translationsMatch[1], '');
    
    newMainJs = `import { gameData, gameState, translations } from './data.js';\n` + newMainJs;
    fs.writeFileSync('vite-project/src/main.js', newMainJs);
    console.log('Split data.js successfully');
} else {
    console.error('Failed to find data blocks in main.js');
}
