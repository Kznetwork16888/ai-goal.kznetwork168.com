const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf-8');

const rootVars = `
:root {
  --bg-color: #e8efe8;
  --text-main: #1a1a1a;
  --text-sub: #555;
  --card-bg: rgba(255,255,255,0.97);
  --header-title: #1a1a1a;
  --field-bg-start: #1e7a1e;
  --field-bg-mid: #246824;
  --field-bg-end: #1e7a1e;
  --field-border: #1a5c1a;
  --base-zoom-font: 16px;
}
body.dark-theme {
  --bg-color: #121212;
  --text-main: #f0f0f0;
  --text-sub: #aaa;
  --card-bg: #1e1e1e;
  --header-title: #ffffff;
  --field-bg-start: #0f3d0f;
  --field-bg-mid: #123412;
  --field-bg-end: #0f3d0f;
  --field-border: #0d2e0d;
}
html { font-size: var(--base-zoom-font); }
`;
css = rootVars + '\n' + css;

css = css.replace(/background:#e8efe8;/g, 'background:var(--bg-color);');
css = css.replace(/color:#1a1a1a;/g, 'color:var(--text-main);');
css = css.replace(/color:#555;/g, 'color:var(--text-sub);');
css = css.replace(/background:rgba\(255,255,255,0.97\);/g, 'background:var(--card-bg);');

css += `
@media(max-width:400px) { :root { --base-zoom-font: 14px; } }
@media(min-width:600px) { :root { --base-zoom-font: 22.7px; } }
@media(min-width:760px) { :root { --base-zoom-font: 24px; } }
@media(min-width:960px) { :root { --base-zoom-font: 25.6px; } }
@media(min-width:600px) and (max-height:900px) { :root { --base-zoom-font: 20px; } }
@media(min-width:600px) and (max-height:800px) { :root { --base-zoom-font: 17.6px; } }
@media(min-width:600px) and (max-height:700px) { :root { --base-zoom-font: 16px; } }
`;

fs.writeFileSync('src/style.css', css);
