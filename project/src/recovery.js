export function buildRecoverySignals({ latestCheckin, recentCheckins = [], summary }) {
  const prev = recentCheckins[1];
  const items = [];

  if (latestCheckin.sleepHours >= 6) {
    items.push('最新一次记录里，睡眠达到 6 小时以上，这通常是值得保住的基础。');
  }
  if (latestCheckin.medicationMisses7d === 0) {
    items.push('最新一次记录显示近 7 天漏药次数为 0，说明最近的治疗节律有在被守住。');
  } else if ((summary?.medicationMissesReported || 0) <= 1) {
    items.push('近期汇总中的漏药次数不高，说明服药节律整体还在努力维持。');
  }
  if (prev) {
    if (latestCheckin.anxiety < prev.anxiety) {
      items.push('和上一条记录相比，焦虑分数下降了，哪怕只是下降一点，也是一种变化。');
    }
    if (latestCheckin.sleepHours > prev.sleepHours) {
      items.push('和上一条记录相比，睡眠时长增加了，节律可能正在慢慢回稳。');
    }
    if (latestCheckin.mood > prev.mood) {
      items.push('和上一条记录相比，心情分数有回升，可以把这种变化记下来。');
    }
  }

  if (!items.length) {
    items.push('今天暂时没有明显的恢复迹象，也不代表没有价值。继续记录本身就是在为恢复积累线索。');
  }

  return {
    title: '恢复迹象',
    items: items.slice(0, 3)
  };
}
