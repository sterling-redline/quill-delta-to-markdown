const render = require('./fromDelta')

test('renders inline format', function() {
  expect(
    render([
      {
        insert: 'Hi ',
      },
      {
        attributes: {
          bold: true,
        },
        insert: 'mom',
      },
    ])
  ).toEqual('Hi **mom**\n')
})

test('renders embed format', function() {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300)\n')
})

test('encodes image url', function() {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300(1).jpg'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300%281%29.jpg)\n')
})

test('removes download params for images', function () {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300?params=21312321313&response-content-disposition=attachment; filename=300.jpg'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300?params=21312321313)\n')
})

test('renders block format', function() {
  expect(
    render([
      {
        insert: 'Headline',
      },
      {
        attributes: {
          header: 1,
        },
        insert: '\n',
      },
    ])
  ).toEqual('# Headline\n')
})

test('renders lists with inline formats correctly', function() {
  expect(
    render([
      {
        attributes: {
          italic: true,
        },
        insert: 'italic',
      },
      {
        insert: ', plain',
      },
      {
        attributes: {
          list: 'ordered',
        },
        insert: '\n',
      },
      {
        attributes: {
          italic: true,
        },
        insert: 'more italic',
      },
      {
        insert: ', more plain',
      },
      {
        attributes: {
          list: 'ordered',
        },
        insert: '\n',
      },
    ])
  ).toEqual(
    '1. _italic_, plain\n1. _more italic_, more plain\n'
  )
})

test('renders adjacent lists correctly', function() {
  expect(
    render([
      {
        insert: 'Item 1',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 2',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 3',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Intervening paragraph\nItem 4',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 5',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 6',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
    ])
  ).toEqual(
    '1. Item 1\n1. Item 2\n1. Item 3\n\nIntervening paragraph\n1. Item 4\n1. Item 5\n1. Item 6\n'
  )
})

test('renders adjacent inline formats correctly', function() {
  expect(
    render([
      {
        attributes: {
          italic: true,
        },
        insert: 'Italics! ',
      },
      {
        attributes: {
          italic: true,
          link: 'http://example.com',
        },
        insert: 'Italic link',
      },
      {
        attributes: {
          link: 'http://example.com',
        },
        insert: ' regular link',
      },
    ])
  ).toEqual(
    '_Italics! [Italic link](http://example.com)_[ regular link](http://example.com)' +
      '\n'
  )
});

test('renders checkboxes correctly', function() {
  expect(
    render([
      {
        insert: "milk"
      },
      {
        attributes: {
          list: "unchecked"
        },
        insert: "\n"
      },
      {
        insert: "cheese"
      },
      {
        attributes: {
          list: "checked"
        },
        insert: "\n"
      }
    ])
  ).toEqual('- [ ] milk\n- [x] cheese\n')
})

test('render an inline link', function() {
  expect(
    render([
      {
        insert: 'Go to Google',
        attributes: {
              link: 'https://www.google.fr',
        },
      },
    ])
  ).toEqual('[Go to Google](https://www.google.fr)' + '\n')
})

test('renders a separator block', function() {
  expect(
    render([
      {
        insert: 'Before\n',
      },
      {
        insert: {thematic_break: true},
      },
      {
        insert: 'After\n',
      },
    ])
  ).toEqual('Before' + '\n' + '\n' + '---' + '\n' + 'After' + '\n')
});

describe("Ordered lists", () => {
  it("should count forward", () => {
    const ops = [
      {insert: 'a'},
      {attributes: {list: 'ordered'}, insert: "\n"},
      {insert: 'b'},
      {attributes: {list: 'ordered'}, insert: "\n"}
    ];
    expect(render(ops)).toEqual("1. a\n1. b\n")
  })

  it("should reset list numbering after returning to a lower indent level", () => {
    const ops = [
      {insert: 'a'},
      {attributes: {list: 'ordered'}, insert: "\n"},
      {insert: 'b'},
      {attributes: {indent: 1, list: 'ordered'}, insert: "\n"},
      {insert: 'c'},
      {attributes: {list: 'ordered'}, insert: "\n"},
      {insert: 'd'},
      {attributes: {indent: 1, list: 'ordered'}, insert: "\n"}
    ];
    expect(render(ops)).toEqual("1. a\n   1. b\n1. c\n   1. d\n")
  })

  it("should handle nested lists", () => {
    const ops = [
      {"insert":"foo"},
      {"attributes":{"list":"ordered"},"insert":"\n"},
      {"insert":"bar1"},
      {"attributes":{"list":"ordered", "indent": 1},"insert":"\n"},
      {"insert":"bar2"},
      {"attributes":{"list":"ordered", "indent": 1},"insert":"\n"},
      {"insert":"baz"},
      {"attributes":{"list":"ordered"},"insert":"\n"}
    ];
    expect(render(ops)).toEqual("1. foo\n   1. bar1\n   1. bar2\n1. baz\n")
  })

  it("should handle mixed lists", () => {
    const ops = [
      {"insert":"foo"},
      {"attributes":{"list":"ordered"},"insert":"\n"},
      {"insert":"bar1"},
      {"attributes":{"list":"bullet", "indent": 1},"insert":"\n"},
      {"insert":"bar2"},
      {"attributes":{"list":"bullet", "indent": 1},"insert":"\n"},
      {"insert":"baz"},
      {"attributes":{"list":"ordered"},"insert":"\n"}
    ]
    expect(render(ops)).toEqual("1. foo\n   - bar1\n   - bar2\n1. baz\n")
  })
});

describe("end whitespace", () => {
  it("handles newlines after simple text", () => {
    let ops = [
      { insert: "Some text\n" }
    ];
    expect(render(ops)).toEqual("Some text\n");

    ops = [
      { insert: "Some text\n\n" }
    ];
    expect(render(ops)).toEqual("Some text\n\n");

    ops = [
      { insert: "Some text\n\n\n" }
    ];
    expect(render(ops)).toEqual("Some text\n\n\n");
  })

  it("handles newlines after list items", () => {
    ops = [
      { insert: "Some text\nlist" },
      { attributes:{list:"ordered"},insert:"\n" }
    ]
    expect(render(ops)).toEqual("Some text\n1. list\n");

    ops = [
      { insert: "Some text\nlist" },
      { attributes:{list:"ordered"},insert:"\n" },
      { insert: "\n"}
    ]
    expect(render(ops)).toEqual("Some text\n1. list\n\n");
  })
})

describe("test headers", () => {
  it("handles a simple header", () => {
    let ops = [
      {insert: 'header'},
      {attributes: {header: 1}, insert: '\n'}
    ];
    expect(render(ops)).toEqual("# header\n");
  
  })

  it("handles header after plain text", () => {
    let ops = [
      {insert: 'stuff\nheader'},
      {attributes: {header: 1}, insert: '\n'}
    ];
    expect(render(ops)).toEqual("stuff\n# header\n");
  })
})