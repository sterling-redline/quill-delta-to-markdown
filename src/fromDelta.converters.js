const Node = require('./utils/Node');
const { encodeLink } = require('./utils/URL');
const { toRoman } = require ('./utils/roman');

function getNumber(indent, idx) {
  let typ = 'numbers';
  if (indent) {
      switch (indent % 3) {
          case 1:
              typ = 'letters';
              break;
          case 2:
              typ = 'roman';
              break;
      }
  }
  switch (typ) {
      case 'letters':
          return String.fromCharCode('a'.charCodeAt(0) + idx - 1);
      case 'roman':
          return toRoman(idx).toLowerCase();
      default:
          return (idx).toString();
  }
}

module.exports = {
  embed: {
    image: function(src) {
      this.append('![](' + encodeLink(src) + ')');
    },
    // Not a default Quill feature, converts custom divider embed blot added when
    // creating quill editor instance.
    // See https://quilljs.com/guides/cloning-medium-with-parchment/#dividers
    thematic_break: function() {
      this.open = '\n---\n' + this.open;
    },
  },

  inline: {
    italic: function() {
      return ['_', '_'];
    },
    bold: function() {
      return ['**', '**'];
    },
    link: function(url) {
      return ['[', '](' + url + ')'];
    },
  },

  block: {
    'header': function({header}) {
      this.open = '#'.repeat(header) + ' ' + this.open;
    },
    blockquote: function() {
      this.open = '> ' + this.open;
    },
    'list': {
      group: function() {
        return new Node(['', '\n']);
      },
      line: function(attrs, group) {
        if (attrs.list === 'bullet') {
          this.open = '- ' + this.open;
        } else if (attrs.list === "checked") {
          this.open = '- [x] ' + this.open;
        } else if (attrs.list === "unchecked") {
          this.open = '- [ ] ' + this.open;
        } else if (attrs.list === 'ordered') {
          group.indent = attrs.indent || 0;
          if (!group.count) group.count = {};
          if (!group.count[group.indent]) group.count[group.indent] = 0;
          // indent is mobing back, reset deeper indent counters
          for (let [k, v] in Object.entries(group.count)) {
            if (group.indent < k) group.count[k] = 0;
          }
          group.count[group.indent]++;
          //var count = ++group.count;
          let count = group.count[group.indent];
          //console.log('Setting ordered group "out"', {attrs, group, count});
          this.open = '  '.repeat(group.indent) + getNumber(group.indent, count) + '. ' + this.open;
        }
      },
    }
  },
}
