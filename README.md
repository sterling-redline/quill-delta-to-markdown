
## Quill delta to Markdown converter
Converter from the [Delta](https://quilljs.com/docs/delta/) document format used by the [Quill](https://quilljs.com/) 
text editor to Markdown.

### About this fork
This fork currently includes the following changes from the fork it originated from:
* adds support for matching numbering of ordered lists to Quill so the first level uses numbers (1, 2, 3, ...), then letters (1, b, c, ...) and finally roman numerals (i, ii, iii, ...)

## Usage

```javascript
const { deltaToMarkdown } = require('quill-delta-to-markdown')
const markdown = deltaToMarkdown(deltaFromElseWhere)
```

## Test

```
npm install
npm test
```

## About

This lib was forked from [frysztak's fork](https://github.com/frysztak/quill-delta-to-markdown) of [rdesmartin's fork](https://github.com/rdesmartin/quill-delta-markdown) of [the Slite Team's fork](https://github.com/sliteteam/quill-delta-markdown) of 
[Bart Visscher (bartv2) 's lib](https://github.com/bartv2/quill-delta-markdown). Open source!
