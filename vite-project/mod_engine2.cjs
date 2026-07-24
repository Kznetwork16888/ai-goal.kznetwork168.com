const fs = require('fs');
let engine = fs.readFileSync('src/game/engine.js', 'utf-8');

engine = engine.replace('export function proceedToRound3() {\n    if (countdownInterval) clearInterval(countdownInterval);\n    \n    gameState.round = 3;\n    renderer.hideAllScreens();\n    renderer.showScreen(\'r3-screen\');\n    \n    document.querySelector(\'.r3-step-item:nth-child(3)\').classList.add(\'r3-step-done\');\n    document.querySelector(\'.r3-step-item:nth-child(3) .r3-step-num\').innerHTML = \'✓\';\n    document.querySelector(\'.r3-step-item:nth-child(3) .r3-step-txt\').style.color = \'#fff\';\n    \n    document.getElementById(\'r3-draw-section\').className = \'r3-draw-section\';\n    document.getElementById(\'r3-draw-section\').style.display = \'block\';\n}', `
export function proceedToRound3() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Calculate total score based on selected tools HP + round 1 score
    let totalScore = gameState.score; // round 1
    const r2Score = gameState.selectedTools.reduce((acc, idx) => {
        return acc + parseInt(gameState.tools[idx].description.replace(/[^0-9]/g, '') || 0);
    }, 0);
    totalScore += Math.floor(r2Score / 10);
    
    saveHistory(totalScore);
    
    renderer.showTransitionScreen(totalScore);
}
`);

engine = engine.replace('export function goToInterview() {\n    proceedToRound3();\n}', `
export function goToInterview() {
    gameState.round = 3;
    renderer.hideAllScreens();
    renderer.showScreen('r3-screen');
    
    const step3 = document.querySelector('.r3-step-item:nth-child(3)');
    if (step3) {
        step3.classList.add('r3-step-done');
        const num = step3.querySelector('.r3-step-num');
        if (num) num.innerHTML = '✓';
        const txt = step3.querySelector('.r3-step-txt');
        if (txt) txt.style.color = '#fff';
    }
    
    const drawSection = document.getElementById('r3-draw-section');
    if (drawSection) {
        drawSection.className = 'r3-draw-section';
        drawSection.style.display = 'block';
    }
}
`);

fs.writeFileSync('src/game/engine.js', engine);
