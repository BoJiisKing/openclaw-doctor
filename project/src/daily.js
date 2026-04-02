export function buildDailyInsight(dashboard) {
  const mode = dashboard.userMode;
  const risk = dashboard.risk.riskLevel;
  const latest = dashboard.latestCheckin || {};

  if (risk === 'high') {
    return {
      title: '今日优先级：先保证安全',
      body: '今天的重点不是学习更多，而是尽快联系现实中的支持、减少独处，并优先处理风险。'
    };
  }

  if (mode === 'depression') {
    return {
      title: '今日建议：任务再缩小一点',
      body: latest.energy <= 3 ? '如果今天精力很低，就把目标缩到一个动作：起床、洗漱、吃一点东西。' : '先做一个最容易完成的小任务，给今天找一个轻一点的开始。'
    };
  }

  if (mode === 'anxiety') {
    return {
      title: '今日建议：先稳，再做事',
      body: latest.anxiety >= 6 ? '先把身体稳住一点，比如慢一点呼吸、少一点刺激，再决定下一步。' : '今天适合先保持节奏，不用急着把所有事一次解决。'
    };
  }

  return {
    title: '今日建议：守住节律',
    body: latest.sleepHours <= 5 ? '今天最值得守住的是睡眠和刺激量，尽量避免冲动决定。' : '今天尽量按固定节奏生活，别让状态带着你忽快忽慢。'
  };
}
