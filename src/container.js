// TODO abstract container with protocol
const log = (sourceText, color = '\x1b[37m') => {
  const text = color + sourceText;
  console.log(text); // eslint-disable-line
  const electron = eval('typeof require !== "undefined" && require("electron")');
  if (electron) {
    const {
      ipcRenderer
    } = electron;
    // send message to electron main
    ipcRenderer.send('general-communication', JSON.stringify({
      type: 'log',
      data: text
    }));
  }
};

/**
 *
 * hack for electron, only used to report data to electron
 */
const reportToContainer = (caseDatas, prefix) => {
  const electron = eval('typeof require !== "undefined" && require("electron")');
  if (!electron) return;
  const {
    ipcRenderer
  } = electron;

  const brief = caseDatas.map(({
    type,
    err,
    name
  }) => {
    const color = type === 'fail' ? '\x1b[31m' : '\x1b[32m';
    const errMsg = err ? err.stack : '';
    return `${color}[${type}](${name}) ${errMsg}`;
  }).join('\n');

  const {
    successCount,
    failCount
  } = caseDatas.reduce((prev, {
    type
  }) => {
    if (type === 'fail') {
      prev.failCount++;
    } else {
      prev.successCount++;
    }

    return prev;
  }, {
    failCount: 0,
    successCount: 0
  });

  // send message to electron main
  ipcRenderer.send('general-communication', JSON.stringify({
    type: 'flushAndExit',
    data: {
      msg: `\x1b[33m[${prefix}] success count: ${successCount}, fail count: ${failCount}
${brief}`,
      code: failCount === 0 ? 0 : 100
    }
  }));
};

module.exports = {
  log,
  reportToContainer
};
