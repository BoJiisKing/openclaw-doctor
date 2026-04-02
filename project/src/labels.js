export const modeLabels = {
  depression: '抑郁',
  anxiety: '焦虑',
  bipolar: '双相'
};

export function formatMode(mode) {
  return modeLabels[mode] || mode || '未设置';
}
