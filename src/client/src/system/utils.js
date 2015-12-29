import React        from 'react';
import ReactDOM     from 'react-dom';

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/;

/**
 * Class mixin E7 style decorator
 * @param source
 * @returns {Function}
 */
function mixin(source){
  return function (target){
    Object.getOwnPropertyNames(source.prototype).forEach((prop) => {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(source.prototype, prop));
    });
  };
}


/**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} size
 * @returns {Number}
 */
function getConvertedSize(size){
  size = String(size).toUpperCase().replace(',', '');
  const matches = size.match(numberConvertRegex);

  if (!size.length || !matches || !matches.length){
    size = 0;
  }
  else {
    size = Number(matches[1]);
    matches[2] && (size = size * (matches[2] === 'K' ? 1000 : 1000000));
  }

  return size;
}

export default {
  mixin,
  getConvertedSize
};
