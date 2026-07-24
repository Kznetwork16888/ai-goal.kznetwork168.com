const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf-8');
const importStmt = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@900&display=swap');";
css = css.replace(importStmt, '');
css = importStmt + '\n' + css;
fs.writeFileSync('src/style.css', css);
