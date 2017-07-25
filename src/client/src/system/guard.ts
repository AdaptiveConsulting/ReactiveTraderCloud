export default class Guard {
  static isDefined(value: any, message: any) {
    if (typeof value === 'undefined') {
      doThrow(message);
    }
  }

  static isFalse(value: any, message: any) {
    if (value) {
      doThrow(message);
    }
  }

  static lengthIs(array: any, length: any, message: any) {
    if (array.length !== length) {
      doThrow(message);
    }
  }

  static lengthGreaterThan(array: any, expected: any, message: any) {
    if (array.length < expected) {
      doThrow(message);
    }
  }

  static lengthIsAtLeast(array: any, expected: any, message: any) {
    if (array.length < expected) {
      doThrow(message);
    }
  }

  static isString(value: any, message: any) {
    if (!isString(value)) {
      doThrow(message);
    }
  }

  static stringIsNotEmpty(value: any, message: any) {
    if (!isString(value) || value === '') {
      doThrow(message);
    }
  }

  static isTrue(check: any, message: any) {
    if (!check) {
      doThrow(message);
    }
  }

  static isFunction(item: any, message: any) {
    if (typeof item !== 'function') {
      doThrow(message);
    }
  }

  static isNumber(value: any, message: any) {
    if (isNaN(value)) {
      doThrow(message);
    }
  }

  static isObject(value: any, message: any) {
    if (typeof value !== 'object') {
      doThrow(message);
    }
  }
}

function isString(value: any) {
  return typeof value == 'string' || value instanceof String;
}


function doThrow(message: any) {
  if (typeof message === 'undefined' || message === '') {
    throw new Error('Argument error');
  }
  throw new Error(message);
}
