const Node = require('./utils/Node');
const { SelectionMap, OPEN, CLOSE, TEXT } = require('./utils/SelectionMap');
const { encodeLink } = require('./utils/URL');
const { orderedListNumber } = require ('./utils/ordered');

module.exports = {
  embed: {
    image: function(src) {
      let link = '![](' + encodeLink(src) + ')';
      this.append(link);
      this.textMap = new SelectionMap([link.length]);
    },
    // Not a default Quill feature, converts custom divider embed blot added when
    // creating quill editor instance.
    // See https://quilljs.com/guides/cloning-medium-with-parchment/#dividers
    thematic_break: function() {
      this.open = '\n---\n' + this.open;
      this.openMap = new SelectionMap([5]);
    },
  },

  inline: {
    italic: function() {
      let node = new Node(['_', '_']);
      node.openMap = new SelectionMap([1], OPEN);
      node.closeMap = new SelectionMap([1], CLOSE);
      return node;
    },
    bold: function() {
      let node = new Node(['**', '**']);
      node.openMap = new SelectionMap([2], OPEN);
      node.closeMap = new SelectionMap([2], CLOSE);
      return node;
    },
    underline: function () {
      let node = new Node(['<ins>', '</ins>']);
      node.openMap = new SelectionMap([node.open.length], OPEN);
      node.closeMap = new SelectionMap([node.close.length], CLOSE);
      return node;
    },
    strike: function() {
      let node = new Node(['~~', '~~']);
      node.openMap = new SelectionMap([2], OPEN);
      node.closeMap = new SelectionMap([2], CLOSE);
      return node;
    },
    link: function(url) {
      let link = ['[', '](' + url + ')'];
      let node = new Node(link);
      node.openMap = new SelectionMap([1], OPEN);
      node.closeMap = new SelectionMap([link[1].length], CLOSE);
      return node
    },
  },

  block: {
    'header': function({header}) {
      let head = '#'.repeat(header) + ' ';
      this.open = head + this.open;
      this.openMap = new SelectionMap([head.length], OPEN);
    },
    blockquote: function() {
      this.open = '> ' + this.open;
      this.openMap = new SelectionMap([2], OPEN);
    },
    'list': {
      group: function() {
        return new Node(['', '\n']);
      },
      line: function(attrs, group) {
        if (attrs.list === 'bullet') {
          this.open = '- ' + this.open;
          this.openMap = new SelectionMap([2], OPEN);
        } else if (attrs.list === "checked") {
          this.open = '- [x] ' + this.open;
          this.openMap = new SelectionMap([6], OPEN);
        } else if (attrs.list === "unchecked") {
          this.open = '- [ ] ' + this.open;
          this.openMap = new SelectionMap([6], OPEN);
        } else if (attrs.list === 'ordered') {
          group.indent = attrs.indent || 0;
          if (!group.count) group.count = {};
          if (!group.count[group.indent]) group.count[group.indent] = 0;
          // indent is moving back, reset deeper indent counters
          for (let k in group.count) {
            if (group.indent < k) group.count[k] = 0;
          }
          group.count[group.indent]++;
          //var count = ++group.count;
          let count = group.count[group.indent];
          //console.log('Setting ordered group "out"', {attrs, group, count});
          let listItem = '  '.repeat(group.indent) + orderedListNumber(group.indent, count) + '. ';
          this.open = listItem + this.open;
          this.openMap = new SelectionMap([listItem.length], OPEN);
        }
      },
    }
  },
}
