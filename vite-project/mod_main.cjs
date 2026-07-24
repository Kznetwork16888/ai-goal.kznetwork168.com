const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf-8');

const additionalLogic = `
import html2canvas from 'html2canvas';
import { drawRadarChart } from './components/RadarChart.js';

// Setup theme toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const savedTheme = localStorage.getItem('ai-game-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.textContent = '☀️';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('ai-game-theme', isDark ? 'dark' : 'light');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
        });
    }
});

window.shareResults = function() {
    const target = document.querySelector('#transition-screen .ts-inner') || document.body;
    
    // Hide buttons during capture
    const btns = target.querySelectorAll('button');
    btns.forEach(b => b.style.display = 'none');

    html2canvas(target, { backgroundColor: '#0a0a1a' }).then(canvas => {
        btns.forEach(b => b.style.display = ''); // restore
        const link = document.createElement('a');
        link.download = 'ai-world-cup-result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
};

window.drawRadarChart = drawRadarChart;
`;

main = additionalLogic + '\n' + main;
fs.writeFileSync('src/main.js', main);
