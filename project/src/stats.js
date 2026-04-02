export function buildTrends(checkins = []) {
  const recent = checkins.slice(0, 7).reverse();
  return {
    labels: recent.map(item => new Date(item.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })),
    mood: recent.map(item => item.mood ?? 0),
    anxiety: recent.map(item => item.anxiety ?? 0),
    sleep: recent.map(item => item.sleepHours ?? 0)
  };
}
