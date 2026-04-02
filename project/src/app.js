import { evaluateRisk, generateSupportPlan, summarizeVisit } from './engine.js';
import { modeCopy, crisisCopy } from './content.js';

export function buildDashboard(data) {
  const latest = data.checkins?.[0] || fallbackCheckin(data.user?.mode || 'depression');
  const risk = evaluateRisk(latest);
  const support = generateSupportPlan(latest, risk);
  const summary = summarizeVisit(data.checkins || [latest]);

  return {
    userMode: latest.mode,
    modeTitle: modeCopy[latest.mode]?.title,
    modeIntro: modeCopy[latest.mode]?.intro,
    risk,
    crisisMessage: crisisCopy[risk.riskLevel],
    support,
    summary,
    medications: data.medications,
    latestCheckin: latest,
    recentCheckins: data.checkins?.slice(0, 10) || []
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
