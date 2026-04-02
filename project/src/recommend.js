function scoreResource(item, { userMode, risk, latestCheckin }) {
  let score = 0;
  const title = `${item.title} ${item.description || ''}`;

  if (item.readingLoad === 'light') score += 3;
  if (item.readingLoad === 'medium') score += 1;
  if (risk?.riskLevel === 'high' && item.readingLoad === 'heavy') score -= 4;
  if (risk?.riskLevel === 'medium' && item.readingLoad === 'heavy') score -= 2;

  if (userMode === 'bipolar' && /双相|bipolar/i.test(title)) score += 4;
  if (userMode === 'depression' && /抑郁|depression/i.test(title)) score += 4;
  if (userMode === 'anxiety' && /焦虑|mental health|精神健康/i.test(title)) score += 3;
  if ((latestCheckin?.sleepHours || 0) <= 5 && /精神障碍|mental disorders|sleep|节律/i.test(title)) score += 2;

  return score;
}

export function recommendResources(context, groups) {
  const all = [...(groups.zh || []), ...(groups.global || []), ...(groups.selfHelp || [])];
  return all
    .map(item => ({ ...item, _score: scoreResource(item, context) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 4)
    .map(({ _score, ...item }) => ({
      ...item,
      reason: buildReason(item, context)
    }));
}

function buildReason(item, { userMode, risk, latestCheckin }) {
  if (risk?.riskLevel === 'high') return '当前风险较高，先看最短、最基础、最易进入的支持信息。';
  if (userMode === 'bipolar' && /双相|bipolar/i.test(item.title)) return '当前模式为双相，建议先看基础科普。';
  if (userMode === 'depression' && /抑郁|depression/i.test(item.title)) return '当前模式为抑郁，建议先看贴近当前处境的基础阅读。';
  if ((latestCheckin?.sleepHours || 0) <= 5) return '最近睡眠偏少，先补充整体理解与求助意识。';
  return item.readingLoad === 'light' ? '这条内容阅读负担较轻，适合先开始。' : '补充阅读材料。';
}
