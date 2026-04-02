export function buildFocusMode({ risk, dailyInsight, support, recommendedResources }) {
  const isHighRisk = risk?.riskLevel === 'high';
  const isMediumRisk = risk?.riskLevel === 'medium';

  if (!isHighRisk && !isMediumRisk) {
    return {
      enabled: false,
      title: '当前不需要极简模式',
      body: '你可以按正常节奏查看建议、趋势和资料。',
      actions: [],
      hideTrends: false,
      hideReadingExtras: false
    };
  }

  return {
    enabled: true,
    title: isHighRisk ? '现在先只做最重要的几步' : '现在先聚焦最关键的信息',
    body: isHighRisk
      ? '当风险升高时，页面应更简单。先保证安全、联系支持、减少独处，不需要同时处理太多信息。'
      : '当状态需要密切关注时，先盯住节律、支持和下一步，不必一次看完所有内容。',
    actions: [
      support?.actions?.[0] || '联系现实中的支持者',
      support?.actions?.[1] || '去有人的地方，不要独自承受',
      dailyInsight?.title ? `先记住这一件事：${dailyInsight.title}` : '先把今天目标缩到最小',
      recommendedResources?.[0]?.title ? `如果还有余力，再看：${recommendedResources[0].title}` : '如果还有余力，再看一条最短的支持内容'
    ].filter(Boolean).slice(0, isHighRisk ? 3 : 4),
    hideTrends: true,
    hideReadingExtras: isHighRisk
  };
}
