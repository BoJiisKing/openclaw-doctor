import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDashboard } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleData = {
  user: { id: 'u_001', mode: 'depression', timezone: 'Asia/Shanghai' },
  medications: [
    { name: '示例药物A', schedule: ['08:00'], notes: '遵医嘱服用' },
    { name: '示例药物B', schedule: ['21:00'], notes: '睡前服用，遵医嘱' }
  ],
  checkin: {
    mode: 'depression',
    mood: 2,
    anxiety: 6,
    energy: 2,
    sleepHours: 4,
    appetite: 3,
    selfHarmThoughts: 'passive',
    impulsivity: 1,
    elevatedMood: 0,
    medicationMisses7d: 2,
    notes: '今天很难起床，觉得没有希望，但还没有具体计划。'
  }
};

const server = http.createServer((req, res) => {
  if (req.url === '/api/dashboard') {
    const dashboard = buildDashboard(sampleData);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(dashboard, null, 2));
  }

  if (req.url === '/' || req.url === '/index.html') {
    const html = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

const port = process.env.PORT || 3030;
server.listen(port, () => {
  console.log(`Mind Harbor demo running at http://localhost:${port}`);
});
