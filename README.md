# Warning
The github location of this fork is temporary. It will likely be moved in the future.

## Quill delta to Markdown converter
Converter from the [Delta](https://quilljs.com/docs/delta/) document format used by the [Quill](https://quilljs.com/) 
text editor to Markdown.

### About this fork
This fork currently includes the following changes from the fork it originated from:

#### Formatting features
* adds support for matching numbering of ordered lists to Quill so the first level uses numbers (1, 2, 3, ...), then letters (a, b, c, ...) and finally roman numerals (i, ii, iii, ...)
* add support for blockquote markdown "> "

#### Selections
Adds a selection mapping that maps a selection range from Quill to the matching start index and length in the converted markdown.

If you have a document in the Quill editor where the delta is this:
```json
[
    {"insert":"the word "},
    {"attributes":{"bold":true},"insert":"bold"},
    {"insert":" is bolded\n"}
]
```
and you highlight the bolded word "bold" you can use:
```js
    import { selection } from 'quill-delta-to-markdown';
    // ops = <the document delta>
    // index and length are the quill selection (index = 9, length = 4)
    let sel = selection(ops, index, length);
    console.log ('Markdown selection', {text: sel.text, index: sel.range.destIndex, length: sel.range.destLength});
```
The result is:
```json
    {"text": "**bold**", "index": 9, "length": 8}
```

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
