## Quill delta-markdown converter
Converter from the [Delta](https://quilljs.com/docs/delta/) document format used by the [Quill](https://quilljs.com/) 
text editor to Markdown, using the [commonmark.js](https://github.com/commonmark/commonmark.js/) parser and thus 
following the [Commonmark Spec](https://spec.commonmark.org/).

## Usage

1 - Use it to convert your delta document to markdown
```javascript
const { fromDelta } = require('quill-markdown-delta')
const markdown = fromDelta(deltaFromElseWhere)
```

2 - Use it to convert your markdown document to delta ops
```javascript
const { toDelta } = require('@slite/quill-markdown-delta')
const deltaOps = toDelta(txtFromElseWhere)
```

## Test

```
npm install
npm test
```

## About

This lib was forked from [the Slite Team's fork](https://github.com/sliteteam/quill-delta-markdown) of 
[Bart Visscher (bartv2) 's lib](https://github.com/bartv2/quill-delta-markdown).
