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
    const globalTestConfig = window._$test;

    if (globalTestConfig) {
      if (globalTestConfig.groupName === groupName) {
        let {
          from = 0, to
        } = window._$test;
        if (to === undefined || to === null) {
          to = caseList.length - 1;
        }
        const groupPrefix = `${groupName}[${from}-${to||''}]`;
        log(`[start running group cases ${groupPrefix}]`);

        //filter cases
        let cases = caseList.slice(from, to + 1);
        if (globalTestConfig.grep) {
          const reg = new RegExp(globalTestConfig.grep);
          cases = cases.filter((item) => reg.test(item.name));
        }
        // TODO grep
        return reportUnits(cases, groupPrefix);
      }
    } else {
      throw new Error('can\'t find global test config from window._$test.');
    }
  } catch (err) {
    log(err.stack);
  }
};

module.exports = {
  provideCases
};
