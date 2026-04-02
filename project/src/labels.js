export const modeLabels = {
  depression: '抑郁',
  anxiety: '焦虑',
  bipolar: '双相'
};

export const riskLabels = {
  low: '低',
  medium: '中',
  high: '高'
};

export const selfHarmLabels = {
  none: '无',
  passive: '有被动想法',
  active: '有主动风险'
};

export function formatMode(mode) {
  return modeLabels[mode] || mode || '未设置';
}

export function formatRisk(level) {
  return riskLabels[level] || level || '未设置';
}

export function formatSelfHarm(value) {
  return selfHarmLabels[value] || value || '未设置';
}
