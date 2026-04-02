import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDashboard } from './app.js';
import { readData, addCheckin, addMedication, ensureDataFile, deleteMedication, deleteCheckin, updateCheckin, updateMedication } from './storage.js';
import { readJsonBody, sendJson } from './http.js';
import { normalizeCheckin, normalizeMedication } from './validate.js';
import { buildVisitSummaryText } from './summary.js';
import { filterCheckinsByDays } from './filter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ensureDataFile();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/dashboard') {
      const data = readData();
      return sendJson(res, 200, buildDashboard(data));
    }

    if (req.method === 'GET' && url.pathname === '/api/history') {
      const data = readData();
      const days = Number(url.searchParams.get('days') || 0);
      const list = days > 0 ? filterCheckinsByDays(data.checkins || [], days) : (data.checkins || []);
      return sendJson(res, 200, list);
    }

    if (req.method === 'GET' && url.pathname === '/api/summary.txt') {
      const data = readData();
      const text = buildVisitSummaryText(buildDashboard(data));
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(text);
    }

    if (req.method === 'POST' && url.pathname === '/api/checkins') {
      const body = await readJsonBody(req);
      const data = addCheckin(normalizeCheckin(body));
      return sendJson(res, 201, buildDashboard(data));
    }

    if (req.method === 'PUT' && url.pathname.startsWith('/api/checkins/')) {
      const id = url.pathname.split('/').pop();
      const body = await readJsonBody(req);
      const data = updateCheckin(id, normalizeCheckin(body));
      return sendJson(res, 200, buildDashboard(data));
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/checkins/')) {
      const id = url.pathname.split('/').pop();
      const data = deleteCheckin(id);
      return sendJson(res, 200, buildDashboard(data));
    }

    if (req.method === 'POST' && url.pathname === '/api/medications') {
      const body = await readJsonBody(req);
      const data = addMedication(normalizeMedication(body));
      return sendJson(res, 201, data.medications);
    }

    if (req.method === 'PUT' && url.pathname.startsWith('/api/medications/')) {
      const id = url.pathname.split('/').pop();
      const body = await readJsonBody(req);
      const data = updateMedication(id, normalizeMedication(body));
      return sendJson(res, 200, data.medications);
    }

    if (req.method === 'GET' && url.pathname === '/api/medications') {
      const data = readData();
      return sendJson(res, 200, data.medications || []);
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/medications/')) {
      const id = url.pathname.split('/').pop();
      const data = deleteMedication(id);
      return sendJson(res, 200, data.medications);
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const html = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (req.method === 'GET' && url.pathname === '/crisis') {
      const html = fs.readFileSync(path.join(__dirname, 'static', 'crisis.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (req.method === 'GET' && url.pathname === '/settings') {
      const html = fs.readFileSync(path.join(__dirname, 'static', 'settings.html'), 'utf8');
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
