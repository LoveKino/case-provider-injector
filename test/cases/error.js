const {
  provideCases,
  unit
} = require('../..');

window._$test = {
  groupName: 'group'
};

module.exports = provideCases('group', [
  unit('base', () => {
    throw new Error('123');
  })
]);
