class Range {
    constructor(index, length) {
        this.srcIndex = index;
        this.srcLength = length;
        this.srcIndexRemain = index;
        this.srcLengthRemain = length;
        this.destIndex = 0;
        this.destLength = 0;
        this.started = false; // true when the source selection has been passed
        this.closing = false; // true when the source selection has finished (allows closing markdown to be added)
        this.done = false; // true when the dest selection has been completed
    }

    process (sel) {
        if (!sel || this.done) return;
        if (typeof sel === 'string') { // process a string without a selection
            this.consume(sel.length);
            console.log(`Process text: [${sel}]`, sel.length, 'Remain:', this.srcLengthRemain);
            return
        }
        console.log('Process type:', sel.typ, sel.selmap);
        if (sel.typ !== 'close' && this.closing) {
            this.done = true;
            return;
        }
        for (let x = 0; x < sel.selmap.length; x++) {
            if (x % 2 === 0) { // md chars not in quill
                this.addMd (sel.selmap[x]);
            } else { // visible quill chars
                this.consume (sel.selmap[x]);
            }
        }
    }

    addMd (x) {
        if (this.done) return;
        console.log ('Add md:', x);
        if (this.started) {
            this.destLength += x;
        } else {
            this.destIndex += x;
        }
    }
    
    consume (x) {
        if (this.done) return;
        console.log('> Consume:', x);
        if (x <= this.srcIndexRemain) { // characters have not passed the selection point yet
            this.srcIndexRemain -= x;
            if (this.srcIndexRemain === 0) {
                this.started = true;
            }
            this.destIndex += x;
        } else {
            let rest = x;
            if (!this.started) {
                rest = x - this.srcIndexRemain; // number of chars past the quill selection point
                console.log('>> Starting at:', rest);
                this.destIndex += this.srcIndexRemain; // set the dest selection start point
                this.srcIndexRemain = 0;
                this.started = true;
            }
            if (rest === 0) return;
            if (rest <= this.srcLengthRemain) { // add to the dest selection
                this.srcLengthRemain -= rest;
                this.destLength += rest;
                if (this.srcLengthRemain === 0) {
                    console.log('>> Closing at length:', this.destLength);
                    this.closing = true; // not done because there might be closing md to add
                }
            } else { // current chars extend past the source selection
                this.destLength += this.srcLengthRemain;
                this.closing = true;
                this.done = true;
                console.log('>> Done');
            }
        }
    }
}

module.exports = Range;