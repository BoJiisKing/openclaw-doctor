import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'app-data.json');

const defaultData = {
  user: { id: 'u_001', mode: 'depression', timezone: 'Asia/Shanghai' },
  settings: {
    defaultMode: 'depression',
    reminderTimes: ['08:00', '21:00'],
    emergencyContact: ''
  },
  medications: [
    { id: 'm1', name: '示例药物A', schedule: ['08:00'], notes: '遵医嘱服用' },
    { id: 'm2', name: '示例药物B', schedule: ['21:00'], notes: '睡前服用，遵医嘱' }
  ],
  checkins: [
    {
      id: 'c1',
      createdAt: new Date().toISOString(),
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
  ]
};

export function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2), 'utf8');
}

export function readData() {
  ensureDataFile();
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  let changed = false;

  if (!data.user) {
    data.user = JSON.parse(JSON.stringify(defaultData.user));
    changed = true;
  }

  if (!data.settings) {
    data.settings = JSON.parse(JSON.stringify(defaultData.settings));
    changed = true;
  }

  if (!Array.isArray(data.medications)) {
    data.medications = [];
    changed = true;
  }

  if (!Array.isArray(data.checkins)) {
    data.checkins = [];
    changed = true;
  }

  if (changed) writeData(data);
  return data;
}

export function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

export function addCheckin(checkin) {
  const data = readData();
  data.checkins.unshift({
    id: `c_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...checkin
  });
  writeData(data);
  return data;
}

export function addMedication(medication) {
  const data = readData();
  data.medications.push({
    id: `m_${Date.now()}`,
    ...medication
  });
  writeData(data);
  return data;
}

export function deleteMedication(id) {
  const data = readData();
  data.medications = data.medications.filter(item => item.id !== id);
  writeData(data);
  return data;
}

export function deleteCheckin(id) {
  const data = readData();
  data.checkins = data.checkins.filter(item => item.id !== id);
  writeData(data);
  return data;
}

export function updateCheckin(id, patch) {
  const data = readData();
  data.checkins = data.checkins.map(item => item.id === id ? { ...item, ...patch } : item);
  writeData(data);
  return data;
}

export function updateMedication(id, patch) {
  const data = readData();
  data.medications = data.medications.map(item => item.id === id ? { ...item, ...patch } : item);
  writeData(data);
  return data;
}

export function updateSettings(patch) {
  const data = readData();
  data.settings = { ...(data.settings || {}), ...patch };
  if (patch.defaultMode) {
    data.user = { ...(data.user || {}), mode: patch.defaultMode };
  }
  writeData(data);
  return data;
}

export function resetAllData() {
  writeData(JSON.parse(JSON.stringify(defaultData)));
  return readData();
}
