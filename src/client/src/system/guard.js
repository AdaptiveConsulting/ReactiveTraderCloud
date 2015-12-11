'use strict';

export default class Guard {
    static isDefined(value, message) {
        if (typeof value === 'undefined') {
            doThrow(message);
        }
    }
    static isFalse(value, message) {
        if (value) {
            doThrow(message);
        }
    }
    static lengthIs(array, length, message) {
        if (array.length !== length) {
            doThrow(message);
        }
    }
    static lengthGreaterThan(array, expected, message) {
        if (array.length < expected) {
            doThrow(message);
        }
    }
    static lengthIsAtLeast(array, expected, message) {
        if (array.length < expected) {
            doThrow(message);
        }
    }
    static isString(value, message) {
        if (!isString(value)) {
            doThrow(message);
        }
    }
    static stringIsNotEmpty(value, message) {
        if (!isString(value) || value === '') {
            doThrow(message);
        }
    }
    static isString(value, message) {
        if (!isString(value)) {
            doThrow(message);
        }
    }
    static isTrue(check, message) {
        if (!check) {
            doThrow(message);
        }
    }
    static isFunction(item, message) {
        if (typeof(item) != 'function') {
            doThrow(message);
        }
    }
    static isNumber(value, message) {
        if (isNaN(value)) {
            doThrow(message);
        }
    }
    static isObject(value,message) {
        if(typeof value !== 'object') {
            doThrow(message);
        }
    }
}

function isString(value) {
    return typeof value == 'string' || value instanceof String;
}


function doThrow(message) {
    if(typeof message === 'undefined' || message === '') {
        throw new Error('Argument error');
    }
    throw new Error(message);
}