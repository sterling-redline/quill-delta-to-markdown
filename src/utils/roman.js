function toRoman(num) {
    if (typeof num !== 'number' || num <= 0 || num >= 4000) {
      throw new Error('Invalid number');
    }
  
    const romanNumerals = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' }
    ];
  
    let roman = '';
  
    for (let i = 0; i < romanNumerals.length; i++) {
      while (num >= romanNumerals[i].value) {
        roman += romanNumerals[i].symbol;
        num -= romanNumerals[i].value;
      }
    }
  
    return roman;
  }
  
function fromRoman(roman) {
  if (typeof roman !== 'string' || roman === '') {
    throw new Error('Invalid Roman numeral');
  }

  /*const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];*/

  let result = 0;
  let i = 0;

  while (i < roman.length) {
    const currentSymbol = roman[i];
    const currentValue = getValueForSymbol(currentSymbol);

    if (i + 1 < roman.length) {
      const nextSymbol = roman[i + 1];
      const nextValue = getValueForSymbol(nextSymbol);

      if (currentValue >= nextValue) {
        result += currentValue;
        i++;
      } else {
        result += nextValue - currentValue;
        i += 2;
      }
    } else {
      result += currentValue;
      i++;
    }
  }

  return result;
}

function getValueForSymbol(symbol) {
  switch (symbol) {
    case 'I':
      return 1;
    case 'V':
      return 5;
    case 'X':
      return 10;
    case 'L':
      return 50;
    case 'C':
      return 100;
    case 'D':
      return 500;
    case 'M':
      return 1000;
  }
  return 0;
}

module.exports = {
  fromRoman,
  toRoman
}