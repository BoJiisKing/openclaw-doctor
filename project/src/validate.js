export function normalizeCheckin(input) {
  return {
    mode: input.mode || 'depression',
    mood: num(input.mood),
    anxiety: num(input.anxiety),
    energy: num(input.energy),
    sleepHours: num(input.sleepHours),
    appetite: num(input.appetite),
    selfHarmThoughts: input.selfHarmThoughts || 'none',
    impulsivity: num(input.impulsivity),
    elevatedMood: num(input.elevatedMood),
    medicationMisses7d: num(input.medicationMisses7d),
    notes: String(input.notes || '').slice(0, 1000)
  };
}

export function normalizeMedication(input) {
  return {
    name: String(input.name || '').slice(0, 100),
    schedule: String(input.schedule || '').split(',').map(s => s.trim()).filter(Boolean),
    notes: String(input.notes || '').slice(0, 300)
  };
}

function num(v) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}
