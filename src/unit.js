const {
  delay
} = require('./util');

const {
  log,
  reportToContainer
} = require('./container');

const html2Canvas = require('html2canvas');

/**
 * collect case result
 */
const collectCaseResult = (name, casePromise) => {
  return Promise.resolve(casePromise).then((data) => {
    return {
      name,
      type: 'success',
      data
    };
  }).catch((err) => {
    return {
      name,
      type: 'fail',
      err
    };
  }).then(({
    name,
    type,
    data,
    err
  }) => {
    // capture whole page
    return delay(100).then(() => {
      return html2Canvas(document.body).then((canvas) => {
        return {
          name,
          type,
          data,
          err,
          canvas,
        };
      });
    });
  });
};

const unit = (name, caseBody) => {
  return {
    name,
    caseBody
  };
};

const runUnit = (unit) => {
  log(`start to run case ${unit.name}`);
  return unit.caseBody();
};

const reportUnits = (units, prefix) => {
  const runUnits = (items) => {
    if (items.length <= 0) return Promise.resolve([]);
    let up = null;

    try {
      up = collectCaseResult(items[0].name, runUnit(items[0]));
    } catch (err) {
      up = collectCaseResult(items[0].name, Promise.reject(err));
    }

    return up.then((v) => {
      return runUnits(items.slice(1)).then((vs) => {
        return [v].concat(vs);
      });
    });
  };

  return runUnits(units).then((casesData) => {
    reportToContainer(casesData, prefix);
    displayCaseResults(casesData);
    return casesData;
  });
};

const displayCaseResults = (caseDatas) => {
  const container = document.createElement('div');
  container.style = 'position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 10000;overflow:scroll;background-color:white;';

  const briefNode = document.createElement('ul');
  caseDatas.map(({
    name,
    type,
    err
  }) => {
    const briefItem = document.createElement('li');
    briefItem.innerHTML = `<div style=${err? 'color:red': 'color:green'}>${name}:${type}
${(err || '') && err.toString()}</div>`;
    return briefItem;
  }).forEach((item) => {
    briefNode.appendChild(item);
  });
  container.appendChild(briefNode);

  // append details and pictures
  caseDatas.forEach(({
    canvas,
    type,
    err,
    name
  }) => {
    const caseItem = document.createElement('div');
    caseItem.innerHTML = `<div style=${err? 'color:red': 'color:green'}>${name}:${type}
${(err || '') && err.toString()}</div>`;
    const pic = document.createElement('div');
    pic.appendChild(canvas);
    caseItem.appendChild(pic);
    container.appendChild(caseItem);
  });

  document.body.appendChild(container);
};

module.exports = {
  unit,
  runUnit,
  reportUnits
};
