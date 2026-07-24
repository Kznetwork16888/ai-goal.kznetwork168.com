const fs = require('fs');
let rendererCode = fs.readFileSync('src/game/renderer.js', 'utf-8');

const showTransitionCode = `
export function showTransitionScreen(score) {
    hideAllScreens();
    const screen = document.getElementById('transition-screen');
    if (screen) screen.style.display = 'flex';
    
    // Update score text
    const scoreEl = document.querySelector('.ts-score');
    if (scoreEl) scoreEl.textContent = \`最終得分：\${score} 分 / Final Score: \${score}\`;
    
    // Show best score from history
    import('./engine.js').then(engine => {
        const history = engine.loadHistory();
        let bestScore = score;
        if (history && history.length > 0) {
            bestScore = Math.max(...history.map(h => h.score));
        }
        const bestScoreEl = document.getElementById('best-score-display');
        if (bestScoreEl) {
            bestScoreEl.textContent = \`最佳得分 / Best Score: \${bestScore} 分\`;
        }
    });

    // Draw Radar Chart
    // Categories: Gen AI, Agent, Automation, RAG, Multimodal, Security
    // We'll generate random but reasonable data based on the score
    const baseVal = Math.min(score / 150, 1.0) * 0.5 + 0.3; // 0.3 to 0.8
    const radarData = [
        { axis: 'Gen AI', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Agent', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Automation', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'RAG', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Multimodal', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Security', value: Math.min(baseVal + Math.random()*0.3, 1) }
    ];
    
    if (window.drawRadarChart) {
        window.drawRadarChart('radar-chart-container', radarData);
    }
    
    // Animate elements
    setTimeout(() => {
        const btn = document.querySelector('.ts-continue-btn');
        if (btn) btn.style.display = 'inline-block';
        
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.style.display = 'inline-block';
    }, 2500);
}
`;

// Insert it at the end
rendererCode += '\n' + showTransitionCode;

fs.writeFileSync('src/game/renderer.js', rendererCode);
