const convert = require('./convert');
const trimEnd = require('lodash/trimEnd');
const defaultConverters = require('./fromDelta.converters');

exports = module.exports = function(ops, converters = defaultConverters) {
  return trimEnd(convert(ops, converters).render()) + '\n';
};
