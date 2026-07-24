const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('index.html', 'utf-8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const scriptRegex = /<script>([\s\S]*?)<\/script>/;
const bodyRegex = /<div id="app">([\s\S]*?)<\/div>\s*<script>/;

const styleMatch = html.match(styleRegex);
const scriptMatch = html.match(scriptRegex);
const bodyMatch = html.match(bodyRegex);

if (!styleMatch || !scriptMatch || !bodyMatch) {
    console.error("Could not find style, script, or body section");
    process.exit(1);
}

const style = styleMatch[1];
const script = scriptMatch[1];
let body = bodyMatch[1];
body = '<div id="app">' + body + '</div>';

fs.writeFileSync('vite-project/src/style.css', style.trim());

// We need to attach functions to window in main.js so inline onclick handlers work
let mainJs = `import './style.css';\n\n` + script;
// Extract all top-level functions to expose them on window
const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
let match;
const functionsToExpose = new Set();
while ((match = functionRegex.exec(script)) !== null) {
    functionsToExpose.add(match[1]);
}

mainJs += `\n\n// Expose functions to window for inline onclick handlers\n`;
functionsToExpose.forEach(fn => {
    mainJs += `window.${fn} = ${fn};\n`;
});

// Since the prompt asks to put data into data.js and logic into main.js, we can do it manually or semi-automatically.
// The script is small enough that separating gameData and translations isn't strictly necessary for it to run, but let's try to follow instructions:
// Actually, it says: "Put the data (gameData, translations) into a JSON file or a separate JS file (e.g. src/data.js), and the main game logic into src/main.js."
// For now, let's keep them in main.js and I will refactor using another script or manually.

fs.writeFileSync('vite-project/src/main.js', mainJs);

// Update vite-project/index.html
const indexHtmlPath = 'vite-project/index.html';
let viteIndex = fs.readFileSync(indexHtmlPath, 'utf-8');
// replace body contents
viteIndex = viteIndex.replace(/<body>[\s\S]*?<\/body>/, '<body>\n    ' + body + '\n    <script type="module" src="/src/main.js"></script>\n  </body>');
fs.writeFileSync(indexHtmlPath, viteIndex);

console.log('Extraction complete');
