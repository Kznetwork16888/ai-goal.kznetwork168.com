const fs = require('fs');
let engine = fs.readFileSync('src/game/engine.js', 'utf-8');

const historyFuncs = `
export function saveHistory(score) {
    let history = loadHistory();
    history.push({ score, date: new Date().toISOString() });
    localStorage.setItem('ai-game-history', JSON.stringify(history));
}

export function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem('ai-game-history')) || [];
    } catch(e) {
        return [];
    }
}
`;

// Insert after imports
engine = engine.replace(/(import.*?\n)(?!import)/, '$1\n' + historyFuncs + '\n');

// Find where score is calculated and shown, which is likely when showing transition screen.
// We can use a regex or just replace window.goToInterview or similar functions?
// Actually, I should inject code into `showGameOver` or wherever the total score is set.

// Let's modify engine.js directly to add best score text and radar chart.
// Let's first search for where the score is displayed.
fs.writeFileSync('src/game/engine.js', engine);
