export function normalizeSettings(input) {
  const reminderTimes = String(input.reminderTimes || '').split(',').map(v => v.trim()).filter(Boolean);
  return {
    defaultMode: input.defaultMode || 'depression',
    reminderTimes: reminderTimes.length ? reminderTimes : ['08:00', '21:00'],
    emergencyContact: String(input.emergencyContact || '').slice(0, 200)
  };
}
