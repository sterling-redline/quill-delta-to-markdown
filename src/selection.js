const convert = require('./convert');
const defaultConverters = require('./fromDelta.converters');
const Range = require('./utils/Range');

module.exports = function range(ops, index, length, converters = defaultConverters) {
    let res = convert(ops, converters).draw(new Range (index, length));
    console.log ('RES', {res});
    return {range: res.range, sel: res.text.slice(res.range.destIndex, res.range.destIndex + res.range.destLength)};
}