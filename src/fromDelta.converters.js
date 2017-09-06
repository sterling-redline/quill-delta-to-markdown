const Node = require('./utils/Node')

module.exports = {
  embed: {
    image: function(src) {
      this.append('![](' + src + ')')
    },
  },

  inline: {
    italic: function() {
      return ['*', '*']
    },
    bold: function() {
      return ['**', '**']
    },
    code: function() {
      return ['`', '`']
    },
    underline: function() {
      return ['__', '__']
    },
    strikethrough: function() {
      return ['~~', '~~']
    },
    entity: function(attributes) {
      switch (attributes.type) {
        case 'LINK':
          return [`[`, `](${attributes.data.url})`]
        default:
          return ['', '']
      }
    },
  },

  block: {
    'header-one': function() {
      this.open = '# ' + this.open
    },
    'header-two': function() {
      this.open = '## ' + this.open
    },
    blockquote: function() {
      this.open = '> ' + this.open
    },
    'code-block': function() {
      this.open = '```\n' + this.open
      this.close = this.close + '```\n'
    },
    'todo-block': function({ data }) {
      this.open = (data.checked ? '- [x] ' : '- [ ] ') + this.open
    },
    'unordered-list-item': {
      group: function() {
        return new Node(['', '\n'])
      },
      line: function() {
        this.open = '- ' + this.open
      },
    },
    'ordered-list-item': {
      group: function() {
        return new Node(['', '\n'])
      },
      line: function(type, group) {
        group.count = group.count || 0
        var count = ++group.count
        this.open = count + '. ' + this.open
      },
    },
    separator: function() {
      this.open = '\n---\n' + this.open
    },
    image: function({ data }) {
      this.open = `![](${data.url})`
    },
  },
}
