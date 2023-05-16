const Range = require('./Range').default;
const { SelectionMap, OPEN, CLOSE, TEXT } = require('./SelectionMap');

describe("Range", () => {
  it("should consume all source characters", () => {
    let r = new Range(1,2);
    r.consume(3);
    //console.log(r);
    expect(r.destIndex).toBe(1);
    expect(r.destLength).toBe(2);
  })

  it("should consume in multiple steps", () => {
    let r = new Range(1,2);
    r.consume(1);
    r.consume(3);
    //console.log(r);
    expect(r.destIndex).toBe(1);
    expect(r.destLength).toBe(2);
  })

  it("should add md open strings", () => {
    let r = new Range(1,2);
    r.process(new SelectionMap([0, 1], TEXT));
    r.process(new SelectionMap([2], OPEN));
    r.process(new SelectionMap([0, 3], TEXT));
    r.process(new SelectionMap([2], CLOSE));
    //console.log(r);
    //expect(r.done).toBe(true);
    expect(r.destIndex).toBe(1);
    expect(r.destLength).toBe(4);
  })

  it("should add close md at the end of a selection", () => {
    r = new Range(1,3);
    r.process(new SelectionMap([0, 1], TEXT));
    r.process(new SelectionMap([2], OPEN));
    r.process(new SelectionMap([0, 3], TEXT));
    r.process(new SelectionMap([2], CLOSE));
    //console.log(r);
    expect(r.destIndex).toBe(1);
    expect(r.destLength).toBe(7);
  })

});
