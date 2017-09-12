import { timeFormat } from 'd3-time-format'

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/

/**
 * Class mixin E7 style decorator
 * @param source
 * @returns {Function}
 */
export function mixin(source: any) {
  return function (target: any) {
    Object.getOwnPropertyNames(source.prototype).forEach((prop) => {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(source.prototype, prop))
    })
  }
}

/**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} notionalShorthand
 * @returns {Number}
 */
export function convertNotionalShorthandToNumericValue(value: any) {
  let notionalShorthand: string | number = String(value).toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)

  if (!notionalShorthand.length || !matches || !matches.length) {
    notionalShorthand = 0
  } else {
    notionalShorthand = Number(matches[1]) ? Number(matches[1]) : 1
    matches[2] && (notionalShorthand = notionalShorthand * (matches[2] === 'K' ? 1000 : 1000000))
  }

  return notionalShorthand
}

export function hasShorthandInput(value: any) {
  const notionalShorthand: string | number = String(value).toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)
  return matches && matches[2] !== undefined // found K or M
}

export function formatDate(date: any, format:string = '%b %e, %H:%M:%S') {
  return timeFormat(format)(date)
}
