export function normalizeSettings(input) {
  return {
    defaultMode: input.defaultMode || 'depression',
    reminderTimes: String(input.reminderTimes || '').split(',').map(v => v.trim()).filter(Boolean),
    emergencyContact: String(input.emergencyContact || '').slice(0, 200)
  };
}
