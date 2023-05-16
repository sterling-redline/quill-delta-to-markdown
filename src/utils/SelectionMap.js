const isArray = require('lodash/isArray');

// A selection map tracks characters visible in the Quill editor
// vs those being added for markdown to connect a selected region
// from Quill into the markdown
// Args:
//   m: and array of character counts alternating between
//      not visible/selectable in Quill and visible in Quill
//
// Example:
//      For bold, the map for the open text would be [2]
//      because the markdown conversion adds '**' before the
//      selectable, bolded string.
class SelectionMap {

    constructor(m, typ) {
        this.selmap = [];
        this.typ = typ;
        if (isArray(m)) {
            this.selmap = m;
        }
    }

    append(m) {
        if (isArray(m)) {
            this.selmap = this.selmap.concat(m);
        }
    }
}

const OPEN = 'open';
const CLOSE = 'close';
const TEXT = 'text';

module.exports = {
    OPEN, CLOSE, TEXT,
    SelectionMap
};