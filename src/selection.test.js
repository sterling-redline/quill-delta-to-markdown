const range = require('./selection')

describe("Selection", () => {
  it("should include markdown", () => {
    const ops = [
      {insert: 'bold', attributes: {bold: true}},
      {insert: ' '},
      {insert: "ital", attributes: {italic: true}},
      {insert: " X\n"}
    ];
    let res = range(ops, 2, 3);
    expect(res.text).toBe('ld** ');
    expect(res.range.destIndex).toBe(4);
    expect(res.range.destLength).toBe(5);

    res = range(ops, 2, 4);
    //console.log(res);
    expect(res.text).toBe('ld** _i');
    expect(res.range.destIndex).toBe(4);
    expect(res.range.destLength).toBe(7);
  })

  it("should handle strikethrough", () => {
    const ops = [
        {"insert":"yowzers "},
        {"attributes":{"strike":true},"insert":"strikethrough"},
        {"insert":" here\n"}
    ];
    let res = range(ops, 8, 13);
    expect(res.text).toBe('~~strikethrough~~');
    expect(res.range.destIndex).toBe(8);
    expect(res.range.destLength).toBe(17);
})

  it("should handle underline", () => {
    const ops = [
        {"insert":"this is "},
        {"attributes":{"underline":true},"insert":"underlined"},
        {"insert":" text\n"}
    ];
    let res = range(ops, 8, 10);
    expect(res.text).toBe('<ins>underlined</ins>');
    expect(res.range.destIndex).toBe(8);
    expect(res.range.destLength).toBe(21);
  })

  it("should work across ordered lists", () => {
    const ops = [
        {"insert":"foo"},
        {"attributes":{"list":"ordered"},"insert":"\n"},
        {"insert":"bar"},
        {"attributes":{"list":"ordered"},"insert":"\n"},
        {"insert":"baz"},
        {"attributes":{"list":"ordered"},"insert":"\n"}
    ];

    let res = range(ops, 2, 5);
    //console.log(res);
    expect(res.text).toBe('o\n1. bar');
    expect(res.range.destIndex).toBe(5);
    expect(res.range.destLength).toBe(8);
  })

  it("should handle nested ordered lists", () => {
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

    let res = range(ops, 4, 4);
    expect(res.text).toBe('   1. bar1');
    expect(res.range.destIndex).toBe(7);
    expect(res.range.destLength).toBe(10);

    res = range(ops, 14, 3);
    expect(res.text).toBe('1. baz');
    expect(res.range.destIndex).toBe(29);
    expect(res.range.destLength).toBe(6);
  })

  it("should handle nested mixed lists", () => {
    const ops = [
        {"insert":"foo"},
        {"attributes":{"list":"ordered"},"insert":"\n"},
        {"insert":"bar1"},
        {"attributes":{"list":"bullet", "indent": 1},"insert":"\n"},
        {"insert":"bar2"},
        {"attributes":{"list":"bullet", "indent": 1},"insert":"\n"},
        {"insert":"baz"},
        {"attributes":{"list":"ordered"},"insert":"\n"}
    ];

    let res = range(ops, 4, 4);
    expect(res.text).toBe('   - bar1');
    expect(res.range.destIndex).toBe(7);
    expect(res.range.destLength).toBe(9);

    res = range(ops, 14, 3);
    expect(res.text).toBe('1. baz');
    expect(res.range.destIndex).toBe(27);
    expect(res.range.destLength).toBe(6);
  })

  it("should handle selections at zero index", () => {
    const ops = [
        {"attributes":{"bold":true},"insert":"a"},
        {"insert":"b"},
        {"attributes":{"list":"ordered"},"insert":"\n"}
    ];
    let res = range(ops, 0, 1);
    expect(res.text).toBe('1. **a**');
    expect(res.range.destIndex).toBe(0);
    expect(res.range.destLength).toBe(8);
  })

  it("should handle selections in headers",  () => {
    let ops = [
        {"insert":"hi there"},
        {"attributes":{"header":1},"insert":"\n"}
    ];
    let res = range(ops, 0, 5);
    expect(res.text).toBe('# hi th');
    expect(res.range.destIndex).toBe(0);
    expect(res.range.destLength).toBe(7);

    ops = [
        {"insert":"hi there"},
        {"attributes":{"header":2},"insert":"\n"}
    ];
    res = range(ops, 0, 5);
    expect(res.text).toBe('## hi th');
    expect(res.range.destIndex).toBe(0);
    expect(res.range.destLength).toBe(8);
  })

  it("should handle blockquotes",  () => {
    let ops = [
        {"insert": 'line\nquoted'},
        {"attributes": {"blockquote": true}, "insert": "\n"},
        {"insert": 'done\n\n'}
    ];
    let res = range(ops, 5, 6);
    expect(res.text).toBe('> quoted');
    expect(res.range.destIndex).toBe(5);
    expect(res.range.destLength).toBe(8);
  })

  it("should handle headers with other attributes",  () => {
    const ops = [
        {"attributes": {"italic": true}, "insert":"hi there"},
        {"attributes":{"header":1},"insert":"\n"}
    ];
    let res = range(ops, 0, 5);
    expect(res.text).toBe('# _hi th');
    expect(res.range.destIndex).toBe(0);
    expect(res.range.destLength).toBe(8);
  })

  it("should handle selections of links",  () => {
    const ops = [{"insert":"asf "},{"attributes":{"link":"https://deadline.chat"},"insert":"link"},{"insert":" foo\n"}];
    let res = range(ops, 4, 4);
    expect(res.text).toBe('[link](https://deadline.chat)');
    expect(res.range.destIndex).toBe(4);
    expect(res.range.destLength).toBe(29);
  })

});

describe("Testing Errors", () => {
  const ops =  [
    {
      insert: 'Draft initial design: Sketch the basic structure and layout of the submarine.'
    },
    { insert: '\n', attributes: { list: 'ordered' } },
    { insert: 'Detailed design and specifications' },
    { insert: '\n', attributes: { list: 'ordered' } },
    {
      insert: 'Hull Design: The hull must be designed to withstand the pressure of the deep sea. This involves selecting the right materials and determining the optimal shape and size.'
    },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    {
      insert: 'Propulsion System: The propulsion system, which includes the engine and propellers, must be designed for efficient and reliable operation under water.'
    },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    {
      insert: 'Navigation Equipment: The navigation equipment, including sonar and GPS, must be designed to function in the challenging conditions of the undersea environment.'
    },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    { insert: 'Material sourcing and preparation:' },
    { insert: '\n', attributes: { list: 'ordered' } },
    {
      insert: 'Identify and procure the necessary materials for the construction of the submarine. This includes high-strength steel for the hull, advanced electronics for the navigation systems, and other specialized materials.'
    },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    { insert: 'Prototype creation:' },
    { insert: '\n', attributes: { list: 'ordered' } },
    { insert: 'Build a small-scale model of the submarine.' },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    {
      insert: 'Conduct tests for buoyancy, stability, and maneuverability.'
    },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
    { insert: 'Make adjustments to the design based on test results' },
    { insert: '\n', attributes: { list: 'ordered', indent: 1 } }
  ];
  let res = range(ops, 844, 0);
  //expect(res.text).toBe('...');
  expect(res.range.destIndex).toBe(877);
  expect(res.range.destLength).toBe(0);
});
