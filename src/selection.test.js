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
