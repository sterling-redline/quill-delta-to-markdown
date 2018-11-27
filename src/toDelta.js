const { isEmpty, includes } = require('lodash');
const commonmark = require('commonmark');
const converters = require('./toDelta.converters');
const { applyAttribute } = require('./utils/DOM');

function toDelta(markdown) {
  var parsed = toDelta.commonmark.parse(markdown);
  var walker = parsed.walker();
  var event, node;
  var deltas = [];
  var attributes = {};
  var blockLevelAttributes = {};

  while ((event = walker.next())) {
    node = event.node;
    const converter = toDelta.converters.find(converter => converter.filter === node.type);
    if (!converter) {
      continue;
    }
    if (converter.blockLevelAttribute) {
      applyAttribute(node, event, blockLevelAttributes, converter.attribute);
    } else {
      applyAttribute(node, event, attributes, converter.attribute);
    }
    if (converter.makeDelta) {
      let delta = converter.makeDelta(
        event,
        converter.blockLevelAttribute ? blockLevelAttributes : attributes
      );
      console.log(delta);
      if (delta) {
        deltas.push(delta);
        console.log(delta);
      }
    }
  }
  if (isEmpty(deltas) || !includes(deltas[deltas.length - 1].insert, '\n')) {
    deltas.push({ insert: '\n' });
  }

  return deltas;
}

toDelta.commonmark = new commonmark.Parser();
toDelta.converters = converters;

module.exports = toDelta;
