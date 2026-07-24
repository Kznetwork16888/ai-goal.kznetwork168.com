const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const themeBtn = '<button id="theme-toggle" style="position:absolute; left:15px; top:15px; background:none; border:none; font-size:24px; cursor:pointer; z-index:9999;">🌙</button>';
html = html.replace('<div id="app">', '<div id="app">\n' + themeBtn);

const shareHtml = '<div id="radar-chart-container" style="width:100%; height:250px; margin:1rem auto;"></div><div id="best-score-display" style="font-size:14px; margin-bottom:10px; color:var(--text-sub, #555);"></div><button id="share-btn" onclick="window.shareResults()" style="margin-top:.7rem;padding:.6rem 1.6rem;font-size:13px;font-weight:700;border-radius:8px;background:linear-gradient(90deg,#005bbd,#003087);border:none;color:#fff;cursor:pointer;font-family:inherit;letter-spacing:.03em;">分享結果 / Share Results 📤</button>';

// Add inside transition-screen (where the score is shown)
html = html.replace('<button class="ts-continue-btn" onclick="goToInterview()"', shareHtml + '\n                <br><br>\n                <button class="ts-continue-btn" onclick="goToInterview()"');

fs.writeFileSync('index.html', html);
