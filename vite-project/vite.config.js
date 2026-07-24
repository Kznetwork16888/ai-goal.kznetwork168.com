import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function csvSavePlugin() {
  return {
    name: 'csv-save-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-email' || req.url === '/api/submit') {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                const email = data.email || '';
                const timestamp = data.timestamp || new Date().toLocaleString();
                const score = data.score !== undefined ? data.score : 0;
                const starAnswers = data.starAnswers || {};
                const situation = (starAnswers.situation || '').replace(/"/g, '""');
                const task = (starAnswers.task || '').replace(/"/g, '""');
                const action = (starAnswers.action || '').replace(/"/g, '""');
                const result = (starAnswers.result || '').replace(/"/g, '""');

                const csvHeader = 'Timestamp,Email,Score,Situation,Task,Action,Result\n';
                const csvRow = `"${timestamp}","${email}","${score}","${situation}","${task}","${action}","${result}"\n`;

                // 寫入至 vite-project 目錄下的 submissions.csv
                const file1 = path.resolve(process.cwd(), 'submissions.csv');
                if (!fs.existsSync(file1)) {
                  fs.writeFileSync(file1, '\uFEFF' + csvHeader + csvRow, 'utf8');
                } else {
                  fs.appendFileSync(file1, csvRow, 'utf8');
                }

                // 寫入至 根目錄下的 submissions.csv
                try {
                  const file2 = path.resolve(process.cwd(), '../submissions.csv');
                  if (!fs.existsSync(file2)) {
                    fs.writeFileSync(file2, '\uFEFF' + csvHeader + csvRow, 'utf8');
                  } else {
                    fs.appendFileSync(file2, csvRow, 'utf8');
                  }
                } catch (e) {
                  // 父目錄權限備用處理
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Email written to CSV', file: file1 }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [csvSavePlugin()],
  server: { port: 3000, open: true }
});
