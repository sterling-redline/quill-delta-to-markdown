const range = require('./selection')

describe("Selection", () => {
  it("should include markdown", () => {
    const ops = [
      {insert: 'bold', attributes: {bold: true}},
      {insert: ' '},
      {insert: "ital", attributes: {italic: true}},
      {insert: " X\n"}
    ];
    //let res = range(ops, 2, 3);
    //expect(res.sel).toBe('ld** ');
    //expect(res.range.destIndex).toBe(4);
    //expect(res.range.destLength).toBe(5);

    let res = range(ops, 2, 4);
    //console.log(res);
    expect(res.sel).toBe('ld** _i');
    expect(res.range.destIndex).toBe(4);
    expect(res.range.destLength).toBe(7);
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
    expect(res.sel).toBe('o\n2. bar');
    expect(res.range.destIndex).toBe(5);
    expect(res.range.destLength).toBe(8);
  })
});
