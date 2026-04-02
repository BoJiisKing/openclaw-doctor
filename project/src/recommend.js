export function recommendResources(dashboard, resources) {
  const picks = [];
  const mode = dashboard.userMode;
  const risk = dashboard.risk.riskLevel;
  const latest = dashboard.latestCheckin || {};

  if (mode === 'depression') {
    picks.push({ title: '抑郁障碍（抑郁症）', url: 'https://www.who.int/zh/news-room/fact-sheets/detail/depression', reason: '当前模式为抑郁，适合先看权威总览。' });
  }
  if (mode === 'bipolar') {
    picks.push({ title: '双相情感障碍（WHO 中文）', url: 'https://www.who.int/zh/news-room/fact-sheets/detail/bipolar-disorder', reason: '当前模式为双相，建议先看基础科普。' });
  }
  if (mode === 'anxiety' || latest.anxiety >= 6) {
    picks.push({ title: '中国的精神健康（WHO 中文）', url: 'https://www.who.int/china/zh/health-topics/mental-health', reason: '当前焦虑偏高，先看公开、低风险的基础资料。' });
  }
  if ((latest.sleepHours ?? 8) <= 5) {
    picks.push({ title: '精神障碍（WHO 中文）', url: 'https://www.who.int/zh/news-room/fact-sheets/detail/mental-disorders', reason: '最近睡眠偏少，先补充整体理解与求助意识。' });
  }
  if (risk === 'high') {
    picks.unshift({ title: '危机时优先现实求助', url: '/crisis', reason: '当前是高风险状态，优先看危机支持页，而不是继续刷资料。' });
  }

  for (const item of resources.selfHelp || []) {
    if (picks.length >= 4) break;
    picks.push({ title: item.title, url: item.url, reason: '补充阅读材料。' });
  }

  const seen = new Set();
  return picks.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).slice(0, 4);
}
