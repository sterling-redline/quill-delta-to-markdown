const convert = require('./convert');
const defaultConverters = require('./fromDelta.converters');
const Range = require('./utils/Range');

module.exports = function range(ops, index, length, converters = defaultConverters) {
    let res = convert(ops, converters).draw(new Range (index, length));
    return {range: res.range, text: res.text.slice(res.range.destIndex, res.range.destIndex + res.range.destLength)};
}