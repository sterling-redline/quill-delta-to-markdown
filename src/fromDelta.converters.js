const Node = require('./utils/Node');
const { encodeLink } = require('./utils/URL');

module.exports = {
  embed: {
    image: function(src) {
      this.append('![](' + encodeLink(src) + ')');
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
        }
        if (attrs.list === 'ordered') {
          group.count = group.count || 0;
          var count = ++group.count;
          this.open = count + '. ' + this.open;
        }
      },
    },
    divider: function() {
      this.open = '\n---\n' + this.open;
    },
    image: function({ image }) {
      this.open = '![](' + encodeLink(image);
    },
  },
}
