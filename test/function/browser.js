const puppeteer = require('puppeteer');
const browserJsEnv = require('browser-js-env');
const path = require('path');
const assert = require('assert');

const headlessOpen = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  return {
    kill: () => {
      browser.close();
    }
  };
};

describe('index', () => {
  it('base', () => {
    return browserJsEnv(`module.exports = require('${path.join(__dirname, '../cases/base.js')}')`, {
      open: headlessOpen,
      clean: true
    }).then((casesData) => {
      assert.deepEqual(casesData.map((item) => {
        return {
          name: item.name,
          type: item.type
        };
      }), [{
        name: 'base',
        type: 'success'
      }]);
    });
  });

  it('error', () => {
    return browserJsEnv(`module.exports = require('${path.join(__dirname, '../cases/error.js')}')`, {
      open: headlessOpen,
      clean: true
    }).then((casesData) => {
      assert.deepEqual(casesData.map((item) => {
        return {
          name: item.name,
          type: item.type
        };
      }), [{
        name: 'base',
        type: 'fail'
      }]);
    });
  });

  it('grep', () => {
    return browserJsEnv(`module.exports = require('${path.join(__dirname, '../cases/grep.js')}')`, {
      open: headlessOpen,
      clean: true
    }).then((casesData) => {
      assert.deepEqual(casesData.length, 1);
    });
  });
});
