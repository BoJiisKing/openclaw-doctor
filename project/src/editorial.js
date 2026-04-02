export function buildEditorialCards(dashboard) {
  const mode = dashboard.userMode;
  const risk = dashboard.risk.riskLevel;
  const cards = [];

  cards.push({
    eyebrow: '今日锚点',
    title: dashboard.dailyInsight.title,
    body: dashboard.dailyInsight.body
  });

  if (risk === 'high') {
    cards.push({
      eyebrow: '现在更重要',
      title: '先回到现实支持',
      body: '当风险升高时，阅读和整理都不是最优先。先联系人、先去有人的地方、先保证安全。'
    });
  } else if (mode === 'depression') {
    cards.push({
      eyebrow: '小步恢复',
      title: '先完成一个最小动作',
      body: '恢复往往不是突然发生的，而是一连串很小的动作重新连接起来。'
    });
  } else if (mode === 'anxiety') {
    cards.push({
      eyebrow: '减压不是全无焦虑',
      title: '先让身体少一点紧绷',
      body: '把目标从“完全不焦虑”改成“比现在稳一点”，通常更可做到。'
    });
  } else {
    cards.push({
      eyebrow: '守住节律',
      title: '别被一时状态拉着跑',
      body: '双相相关状态管理里，节律、睡眠和刺激量通常比“今天心情如何”更关键。'
    });
  }

  cards.push({
    eyebrow: '补充阅读',
    title: dashboard.recommendedResources?.[0]?.title || '今天先读一条权威资料',
    body: dashboard.recommendedResources?.[0]?.reason || '让阅读变成支持，而不是信息负担。'
  });

  return cards.slice(0, 3);
}
