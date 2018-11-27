const isEmpty = require('lodash/isEmpty');
const { changeAttribute } = require('./utils/DOM');

function addOnEnter(name) {
  return (event, attributes) => {
    if (!event.entering) {
      return null;
    }
    return {
      insert: event.node.literal,
      attributes: Object.assign({}, attributes, { [name]: true }),
    };
  };
}

const converters = [
  // inline
  { filter: 'code', makeDelta: addOnEnter('code') },
  { filter: 'html_inline', makeDelta: addOnEnter('html_inline') },
  { filter: 'emph', attribute: 'italic' },
  { filter: 'strong', attribute: 'bold' },
  {
    filter: 'link',
    attribute: (node, event, attributes) => {
      changeAttribute(attributes, event, 'link', node.destination);
    },
  },
  {
    filter: 'text',
    makeDelta: (event, attributes) => {
      if (isEmpty(attributes)) {
        return { insert: event.node.literal };
      } else {
        return {
          insert: event.node.literal,
          attributes: Object.assign({}, attributes),
        };
      }
    },
  },
  {
    filter: 'softbreak',
    makeDelta: (event, attributes) => {
      if (isEmpty(attributes)) {
        return { insert: '\n' };
      } else {
        return { insert: '\n', attributes: Object.assign({}, attributes) };
      }
    },
  },

  // block
  { filter: 'block_quote', blockLevelAttribute: true, attribute: 'blockquote' },
  {
    filter: 'code_block',
    blockLevelAttribute: true,
    makeDelta: addOnEnter('code-block'),
  },
  {
    filter: 'heading',
    blockLevelAttribute: true,
    makeDelta: (event, attributes) => {
      if (event.entering) {
        return null;
      }
      return {
        insert: '\n',
        attributes: Object.assign({}, attributes, { header: event.node.level }),
      };
    },
  },
  {
    filter: 'list',
    blockLevelAttribute: true,
    attribute: (node, event, attributes) => {
      changeAttribute(attributes, event, 'list', node.listType);
    },
  },
  {
    filter: 'paragraph',
    blockLevelAttribute: true,
    makeDelta: (event, attributes) => {
      if (event.entering) {
        return null;
      }

      if (isEmpty(attributes)) {
        return { insert: '\n' };
      } else {
        return { insert: '\n', attributes: Object.assign({}, attributes) };
      }
    },
  },

  // embeds
  {
    filter: 'thematic_break',
    makeDelta: (event, attributes) => {
      console.log(event);
      console.log('attributes: ');
      console.log(attributes);
      if (!event.entering) {
        return null;
      }
      return {
        insert: {'divider': 'divider'}
      }
    }
  },
  {
    filter: 'image',
    makeDelta: (event, attributes) => {
      if (!event.entering) {
        return null;
      }
      if (isEmpty(attributes)) {
        return { insert: {'image': event.node.destination} };
      } else {
        return {
          insert: {'image': event.node.destination},
          attributes: Object.assign({}, attributes),
        };
      }
    },
  },
];

module.exports = converters;
