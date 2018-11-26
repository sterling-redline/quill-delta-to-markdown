const { isEmpty } = require("lodash");
const commonmark = require("commonmark");
const converters = require("./toDelta.converters");
const { applyAttribute } = require("./utils/DOM");

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
      if (delta) {
        deltas.push(delta);
      }
    }
  }
  if (
    isEmpty(deltas) ||
    (Array.isArray(deltas[deltas.length - 1].insert) && deltas[deltas.length - 1].insert.indexOf("\n") === -1)
  ) {
    deltas.push({ insert: "\n" });
  }

  return deltas;
}

toDelta.commonmark = new commonmark.Parser();
toDelta.converters = converters;

module.exports = toDelta;
