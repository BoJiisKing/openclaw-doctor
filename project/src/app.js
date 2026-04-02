import { evaluateRisk, generateSupportPlan, summarizeVisit } from './engine.js';
import { modeCopy, crisisCopy } from './content.js';
import { buildTrends } from './stats.js';
import { trustedResources } from './resources.js';
import { recommendResources } from './recommend.js';
import { buildDailyInsight } from './daily.js';
import { buildEditorialCards } from './editorial.js';
import { buildFocusMode } from './simplicity.js';
import { buildRecoverySignals } from './recovery.js';

export function buildDashboard(data) {
  const defaultMode = data.settings?.defaultMode || data.user?.mode || 'depression';
  const latest = data.checkins?.[0] || fallbackCheckin(defaultMode);
  const risk = evaluateRisk(latest);
  const support = generateSupportPlan(latest, risk);
  const summary = summarizeVisit(data.checkins || [latest]);
  const dailyInsight = buildDailyInsight({ userMode: latest.mode, risk, latestCheckin: latest });
  const recommendedResources = recommendResources({ userMode: latest.mode, risk, latestCheckin: latest }, trustedResources);
  const focusMode = buildFocusMode({ risk, dailyInsight, support, recommendedResources });
  const recoverySignals = buildRecoverySignals({ latestCheckin: latest, recentCheckins: data.checkins || [], summary });

  return {
    userMode: latest.mode,
    defaultMode,
    modeTitle: modeCopy[latest.mode]?.title,
    modeIntro: modeCopy[latest.mode]?.intro,
    risk,
    crisisMessage: crisisCopy[risk.riskLevel],
    support,
    summary,
    medications: data.medications,
    settings: data.settings || {},
    latestCheckin: latest,
    recentCheckins: data.checkins?.slice(0, 10) || [],
    trends: buildTrends(data.checkins || []),
    statusCard: buildStatusCard(risk, latest),
    dailyInsight,
    recommendedResources,
    focusMode,
    recoverySignals,
    editorialCards: buildEditorialCards({ userMode: latest.mode, risk, latestCheckin: latest, dailyInsight, recommendedResources })
  };
}

function buildStatusCard(risk, latest) {
  if (risk.riskLevel === 'high') {
    return {
      title: '现在优先安全',
      body: '当前记录里有高风险信号。请优先联系现实中的支持，而不是继续独自扛着。'
    };
  }
  if (risk.riskLevel === 'medium') {
    return {
      title: '最近值得更密切关注',
      body: '你最近的状态有一些值得留意的变化，建议尽快和医生、家属或信任的人同步。'
    };
  }
  return {
    title: '继续稳定记录',
    body: latest.sleepHours <= 5 ? '现在最值得优先守住的是睡眠和节律。' : '先继续记录、规律生活，并按医嘱治疗。'
  };
}

function fallbackCheckin(mode) {
  return {
    mode,
    mood: 5,
    anxiety: 5,
    energy: 5,
    sleepHours: 7,
    appetite: 5,
    selfHarmThoughts: 'none',
    impulsivity: 0,
    elevatedMood: 0,
    medicationMisses7d: 0,
    notes: ''
  };
}
