const { toRoman } = require ('./roman');

function orderedListNumber(indent, idx) {
    let typ = 'numbers';
    if (indent) {
        switch (indent % 3) {
            case 1:
                typ = 'letters';
                break;
            case 2:
                typ = 'roman';
                break;
        }
    }
    switch (typ) {
        case 'letters':
            return String.fromCharCode('a'.charCodeAt(0) + idx - 1);
        case 'roman':
            return toRoman(idx).toLowerCase();
        default:
            return (idx).toString();
    }
  }
  
  module.exports = {
    orderedListNumber
  }