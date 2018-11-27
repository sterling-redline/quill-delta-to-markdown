const toDelta = require('./toDelta')

test('converts text with emphasis', () => {
  const input = 'Hello *world*'
  const expected = [
    { insert: 'Hello ' },
    { insert: 'world', attributes: { italic: true } },
    { insert: '\n' },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts text with strong', () => {
  const input = 'Hello **world**'
  const expected = [
    { insert: 'Hello ' },
    { insert: 'world', attributes: { bold: true } },
    { insert: '\n' },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts text with link', () => {
  const input = 'Hello [world](url)'
  const expected = [
    { insert: 'Hello ' },
    { insert: 'world', attributes: { link: 'url' } },
    { insert: '\n' },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts multi paragraphs', () => {
  const input = 'line 1\n\nline 2\n'
  const expected = [
    { insert: 'line 1' },
    { insert: '\n' },
    { insert: 'line 2' },
    { insert: '\n' },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts headings level 1', () => {
  const input = '# heading\n'
  const expected = [
    { insert: 'heading' },
    { insert: '\n', attributes: { header: 1 } },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts bullet list', () => {
  const input = '- line 1\n- line 2\n'
  const expected = [
    { insert: 'line 1' },
    { insert: '\n', attributes: { list: 'bullet' } },
    { insert: 'line 2' },
    { insert: '\n', attributes: { list: 'bullet' } },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts bullet list with softbreak', () => {
  const input = '- line 1\nmore\n- line 2\n'
  const expected = [
    { insert: 'line 1' },
    { insert: ' ' },
    { insert: 'more' },
    { insert: '\n', attributes: { list: 'bullet' } },
    { insert: 'line 2' },
    { insert: '\n', attributes: { list: 'bullet' } },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts ordered list', () => {
  const input = '1. line 1\n2. line 2\n'
  const expected = [
    { insert: 'line 1' },
    { insert: '\n', attributes: { list: 'ordered' } },
    { insert: 'line 2' },
    { insert: '\n', attributes: { list: 'ordered' } },
  ]

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})

test('converts text with divider', () => {
  const input = 'Hello --- world\n'
  const expected = [
    { "insert": "Hello" },
    { "insert": "\n" },
    { "insert": { "divider": true } },
    { "insert": "world" },
    { "insert": "\n" }
  ];

  var result = toDelta(input)

  expect(result).toMatchObject(expected)
})
