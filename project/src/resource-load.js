export function attachReadingLoad(groups) {
  const mapLoad = (item) => {
    const title = `${item.title} ${item.description || ''}`;
    let readingLoad = 'medium';

    if (/自助|指南|guide|overview|总览|专题|mental health/i.test(title)) {
      readingLoad = 'light';
    }
    if (/fact sheet|双相|bipolar|抑郁障碍|depression/i.test(title)) {
      readingLoad = readingLoad === 'light' ? 'light' : 'medium';
    }
    if (/manual|专业版|diagnostic|research/i.test(title)) {
      readingLoad = 'heavy';
    }

    return { ...item, readingLoad };
  };

  return {
    ...groups,
    zh: (groups.zh || []).map(mapLoad),
    global: (groups.global || []).map(mapLoad),
    selfHelp: (groups.selfHelp || []).map(mapLoad)
  };
}
