import { evaluateRisk, generateSupportPlan, summarizeVisit } from './engine.js';
import { modeCopy, crisisCopy } from './content.js';

export function buildDashboard(data) {
  const risk = evaluateRisk(data.checkin);
  const support = generateSupportPlan(data.checkin, risk);
  const summary = summarizeVisit([data.checkin]);

  return {
    userMode: data.user.mode,
    modeTitle: modeCopy[data.user.mode]?.title,
    modeIntro: modeCopy[data.user.mode]?.intro,
    risk,
    crisisMessage: crisisCopy[risk.riskLevel],
    support,
    summary,
    medications: data.medications
  };
}
