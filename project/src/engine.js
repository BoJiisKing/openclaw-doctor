export function evaluateRisk(checkin) {
  const flags = [];
  let score = 0;

  if ((checkin.sleepHours ?? 8) <= 4) {
    score += 2;
    flags.push('significant_sleep_reduction');
  }

  if ((checkin.medicationMisses7d ?? 0) >= 3) {
    score += 2;
    flags.push('medication_nonadherence');
  }

  if (checkin.selfHarmThoughts === 'passive') {
    score += 3;
    flags.push('passive_self_harm_thoughts');
  }

  if (checkin.selfHarmThoughts === 'active') {
    score += 8;
    flags.push('active_self_harm_risk');
  }

  if ((checkin.elevatedMood ?? 0) >= 7 || (checkin.impulsivity ?? 0) >= 7) {
    score += 4;
    flags.push('possible_manic_activation');
  }

  if ((checkin.mood ?? 5) <= 2) {
    score += 2;
    flags.push('very_low_mood');
  }

  if ((checkin.anxiety ?? 0) >= 8) {
    score += 2;
    flags.push('severe_anxiety');
  }

  let riskLevel = 'low';
  if (checkin.selfHarmThoughts === 'active') riskLevel = 'high';
  else if (score >= 8) riskLevel = 'high';
  else if (score >= 3) riskLevel = 'medium';

  return { riskLevel, score, flags };
}

export function generateSupportPlan(checkin, risk) {
  if (risk.riskLevel === 'high') {
    return {
      tone: 'direct_supportive',
      message: '你现在可能处在需要现实支持的高风险状态。请尽快联系家属、主治医生或当地紧急援助资源；如果你正一个人，尽量不要独处，并远离可能伤害自己的物品。',
      actions: [
        '联系可信任的人并告诉对方你现在状态不好',
        '联系主治医生/医院/当地急救或危机热线',
        '不要独处，尽量去有人的地方'
      ]
    };
  }

  const actions = [];
  if ((checkin.energy ?? 5) <= 3) actions.push('先只做一个很小的动作，比如洗脸、喝水或把窗帘拉开');
  if ((checkin.sleepHours ?? 8) <= 5) actions.push('把今晚的目标先定为尽量提前休息，减少刺激和长时间刷屏');
  if ((checkin.anxiety ?? 0) >= 6) actions.push('试着做一次缓慢呼吸，并把当前最强烈的感受写成一句话');
  if ((checkin.medicationMisses7d ?? 0) > 0) actions.push('按医嘱继续服药，并把漏服情况记录下来，复诊时告诉医生');

  let message = '你现在已经很不容易了，先不用要求自己一下子变好。我们先把今天缩小成几个可完成的小步骤。';

  if (checkin.mode === 'anxiety') {
    message = '先不用逼自己立刻平静下来。把注意力放回眼前，先让身体稍微稳定一点，再决定下一步。';
  }

  if (checkin.mode === 'bipolar') {
    message = '现在更重要的是稳住节律，尤其是睡眠、刺激量和冲动决策。先别把状态好的冲劲当成必须立刻行动的理由。';
  }

  return {
    tone: 'gentle_structured',
    message,
    actions: actions.slice(0, 3)
  };
}

export function summarizeVisit(checkins) {
  const total = checkins.length;
  const avgMood = average(checkins.map(v => v.mood));
  const avgSleep = average(checkins.map(v => v.sleepHours));
  const misses = checkins.reduce((n, v) => n + (v.medicationMisses7d ?? 0), 0);
  const passiveRiskDays = checkins.filter(v => v.selfHarmThoughts && v.selfHarmThoughts !== 'none').length;

  return {
    periodDays: total,
    averageMood: avgMood,
    averageSleepHours: avgSleep,
    medicationMissesReported: misses,
    daysWithSelfHarmThoughts: passiveRiskDays,
    clinicianPrompt: '请结合近两周心情、睡眠、漏服和副作用记录，和医生讨论是否需要调整治疗方案。系统不提供个体化改药建议。'
  };
}

function average(arr) {
  const valid = arr.filter(v => typeof v === 'number' && !Number.isNaN(v));
  if (!valid.length) return null;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}
