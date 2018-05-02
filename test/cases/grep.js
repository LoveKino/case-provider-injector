const {
  provideCases,
  unit
} = require('../..');

window._$test = {
  groupName: 'group',
  grep: 'base'
};

module.exports = provideCases('group', [
  unit('base', () => {}),
  unit('name', () => {}),
  unit('feel', () => {})
]);
