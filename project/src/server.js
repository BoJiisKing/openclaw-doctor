import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDashboard } from './app.js';
import { readData, addCheckin, addMedication, ensureDataFile } from './storage.js';
import { readJsonBody, sendJson } from './http.js';
import { normalizeCheckin, normalizeMedication } from './validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ensureDataFile();

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/dashboard') {
      const data = readData();
      return sendJson(res, 200, buildDashboard(data));
    }

    if (req.method === 'GET' && req.url === '/api/history') {
      const data = readData();
      return sendJson(res, 200, data.checkins || []);
    }

    if (req.method === 'POST' && req.url === '/api/checkins') {
      const body = await readJsonBody(req);
      const data = addCheckin(normalizeCheckin(body));
      return sendJson(res, 201, buildDashboard(data));
    }

    if (req.method === 'POST' && req.url === '/api/medications') {
      const body = await readJsonBody(req);
      const data = addMedication(normalizeMedication(body));
      return sendJson(res, 201, data.medications);
    }

    if (req.method === 'GET' && req.url === '/api/medications') {
      const data = readData();
      return sendJson(res, 200, data.medications || []);
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      const html = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3030;
server.listen(port, () => {
  console.log(`Mind Harbor demo running at http://localhost:${port}`);
});
