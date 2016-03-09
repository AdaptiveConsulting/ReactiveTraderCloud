import React        from 'react';
import ReactDOM     from 'react-dom';
import d3 from 'd3';

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/;

/**
 * Class mixin E7 style decorator
 * @param source
 * @returns {Function}
 */
export function mixin(source) {
  return function (target) {
    Object.getOwnPropertyNames(source.prototype).forEach((prop) => {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(source.prototype, prop));
    });
  };
}


/**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} notionalShorthand
 * @returns {Number}
 */
export function convertNotionalShorthandToNumericValue(notionalShorthand) {
  notionalShorthand = String(notionalShorthand).toUpperCase().replace(',', '');
  let matches = notionalShorthand.match(numberConvertRegex);

  if (!notionalShorthand.length || !matches || !matches.length) {
    notionalShorthand = 0;
  }
  else {
    notionalShorthand = Number(matches[1]);
    matches[2] && (notionalShorthand = notionalShorthand * (matches[2] === 'K' ? 1000 : 1000000));
  }

  return notionalShorthand;
}

export function formatDate(date, format:string = '%b %e, %H:%M:%S') {
  let formatter = d3.time.format(format);
  return formatter(date);
}
