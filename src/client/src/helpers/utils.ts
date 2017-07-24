import d3 from 'd3'

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/

/**
 * Returns the expanded price from k/m shorthand.
 */
export function convertNotionalShorthandToNumericValue(notionalShorthandRaw: string): number {
  const notionalShorthand = String(notionalShorthandRaw).toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)

  let notionalShorthandNum = 0
  
  if (notionalShorthand.length && matches && matches.length) {
    notionalShorthandNum = Number(matches[1]) ? Number(matches[1]) : 1
    if (matches[2]) {
      notionalShorthandNum = notionalShorthandNum * (matches[2] === 'K' ? 1000 : 1000000)
    }
  }

  return notionalShorthandNum
}

export function hasShorthandInput(notionalShorthandRaw: string): boolean | null {
  const notionalShorthand = String(notionalShorthandRaw).toUpperCase().replace(/,/g, '')
  const matches = notionalShorthand.match(numberConvertRegex)
  return matches && matches[2] !== undefined // found K or M
}

export function formatDate(date: string, format: string = '%b %e, %H:%M:%S'): string {
  return d3.time.format(format)(date)
}
