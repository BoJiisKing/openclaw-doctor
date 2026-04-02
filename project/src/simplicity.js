export function buildFocusMode({ risk, dailyInsight, support, recommendedResources }) {
  const isHighRisk = risk?.riskLevel === 'high';

  if (!isHighRisk) {
    return {
      enabled: false,
      title: '当前不需要极简模式',
      body: '你可以按正常节奏查看建议、趋势和资料。',
      actions: []
    };
  }

  return {
    enabled: true,
    title: '现在先只做最重要的几步',
    body: '当风险升高时，页面应更简单。先保证安全、联系支持、减少独处，不需要同时处理太多信息。',
    actions: [
      support?.actions?.[0] || '联系现实中的支持者',
      support?.actions?.[1] || '去有人的地方，不要独自承受',
      recommendedResources?.[0]?.title ? `如果还能看一点内容，只看这一条：${recommendedResources[0].title}` : '如果还能看内容，只看一条最短的支持信息',
      dailyInsight?.title ? `记住今天的重点：${dailyInsight.title}` : '今天先把目标缩到最小'
    ].filter(Boolean).slice(0, 4)
  };
}
