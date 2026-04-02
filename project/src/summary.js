export function buildVisitSummaryText(dashboard) {
  const s = dashboard.summary;
  return [
    `模式：${dashboard.modeTitle || dashboard.userMode}`,
    `平均心情：${s.averageMood}`,
    `平均睡眠：${s.averageSleepHours} 小时`,
    `记录到的漏服次数：${s.medicationMissesReported}`,
    `有自伤想法的记录天数：${s.daysWithSelfHarmThoughts}`,
    `当前风险等级：${dashboard.risk.riskLevel}`,
    `建议：${s.clinicianPrompt}`
  ].join('\n');
}
