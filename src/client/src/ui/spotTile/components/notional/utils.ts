import { timeFormat, utcFormat } from 'd3-time-format'

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/

/**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} notionalShorthand
 * @returns {Number}
 */
export function convertNotionalShorthandToNumericValue(value: string) {
  const notionalShorthand: string = value.toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)

  let newNotional: number = 0

  if (!notionalShorthand.length || !matches || !matches.length) {
    newNotional = 0
  } else {
    newNotional = Number(matches[1]) ? Number(matches[1]) : 1
    if (matches[2]) {
      newNotional = newNotional * (matches[2] === 'K' ? 1000 : 1000000)
    }
  }

  return newNotional
}

export function hasShorthandInput(value: string) {
  const notionalShorthand = value.toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)
  return matches && matches[2] !== undefined // found K or M
}

export function UtcFormatDate(date: Date, format: string = '%b %e, %H:%M:%S') {
  return utcFormat(format)(date)
}

export function formatDate(date: Date, format: string = '%b %e, %H:%M:%S') {
  return timeFormat(format)(date)
}
