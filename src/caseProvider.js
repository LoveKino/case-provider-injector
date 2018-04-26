const {
  reportUnits
} = require('./unit');
const {
  log
} = require('./container');

const globalCasesMap = {};

const provideCases = (groupName, caseList) => {
  try {
    globalCasesMap[groupName] = caseList;

    if (window._$test) {
      if (window._$test.groupName === groupName) {
        let {
          from = 0, to
        } = window._$test;
        if (to === undefined || to === null) {
          to = caseList.length - 1;
        }
        const groupPrefix = `${groupName}[${from}-${to||''}]`;
        log(`[start running group cases ${groupPrefix}]`);

        return reportUnits(caseList.slice(from, to + 1), groupPrefix);
      }
    }
  } catch (err) {
    log(err.stack);
  }
};

module.exports = {
  provideCases
};
