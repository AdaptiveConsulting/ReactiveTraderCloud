import { timeFormat, utcFormat } from 'd3-time-format'

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/

/**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} notionalShorthand
 * @returns {Number}
 */
export function convertNotionalShorthandToNumericValue(value: any) {
  let notionalShorthand: string | number = String(value)
    .toUpperCase()
    .replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)

  if (!notionalShorthand.length || !matches || !matches.length) {
    notionalShorthand = 0
  } else {
    notionalShorthand = Number(matches[1]) ? Number(matches[1]) : 1
    if (matches[2]) {
      notionalShorthand = notionalShorthand * (matches[2] === 'K' ? 1000 : 1000000)
    }
  }

  return notionalShorthand
}

export function hasShorthandInput(value: any) {
  const notionalShorthand: string | number = String(value)
    .toUpperCase()
    .replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)
  return matches && matches[2] !== undefined // found K or M
}

export function UtcFormatDate(date: any, format: string = '%b %e, %H:%M:%S') {
  return utcFormat(format)(date)
}

export function formatDate(date: any, format: string = '%b %e, %H:%M:%S') {
  return timeFormat(format)(date)
}
