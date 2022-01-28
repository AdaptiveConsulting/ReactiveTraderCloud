/**
 * Provides functions that are thin wrappers around Intl.NumberFormat
 * and a scaling function.  Because these formatters can be invoked
 * by third-party libraries without strict type safety, returned formatters
 * will no-op when passed something other than a number as an argument.
 *
 * Currently takes the default locale to format, which is based on the runtime:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */

enum Scale {
  K = "k",
  M = "m",
  B = "b",
  T = "t",
  None = "",
}
interface ScaledNumber {
  value: number
  scale: Scale
}

const k = 1_000
const m = k * k
const b = m * k
const t = b * k

export const scaleNumber: (v: number) => ScaledNumber = (val: number) => {
  const magnitude = Math.abs(val)
  let value, scale
  if (magnitude >= t) {
    value = val / t
    scale = Scale.T
  } else if (magnitude >= b) {
    value = val / b
    scale = Scale.B
  } else if (magnitude >= m) {
    value = val / m
    scale = Scale.M
  } else if (magnitude >= k) {
    value = val / k
    scale = Scale.K
  } else {
    value = val
    scale = Scale.None
  }
  return { value, scale }
}

type NumberFormatter = (n: number) => string

const numberFormatter = (
  options?: Intl.NumberFormatOptions,
): NumberFormatter => {
  const nf = new Intl.NumberFormat("default", { ...options })

  return (num: number) => {
    if (typeof num !== "number") {
      return num
    } else {
      return nf.format(num)
    }
  }
}

/**
 * Returns a function that will format numbers to set number
 * of significant digits passed as input, with rounding.
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */
export const significantDigitsNumberFormatter = (
  significantDigits: number,
): NumberFormatter =>
  numberFormatter({
    maximumSignificantDigits: significantDigits,
    minimumSignificantDigits: significantDigits,
  })

/**
 * Returns a function that will format numbers to set precision
 * passed as input, with rounding.
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */
export const precisionNumberFormatter = (precision: number): NumberFormatter =>
  numberFormatter({
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

/**
 * Takes any Intl.NumberFormatOptions as input to construct and
 * return a function that formats numbers as configured by options.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 *
 */
export const customNumberFormatter = numberFormatter

/**
 * Returns a function that will format numbers with Intl.NumberFormat's
 * defaults.
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */
export const formatNumber = numberFormatter()

/**
 * Returns a function that will format numbers as wholes, with rounding.
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */
export const formatAsWholeNumber = precisionNumberFormatter(0)

/**
 * Accepts a number and formatting function and applies internal scaling
 * function before applying formatter.
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */
export const formatWithScale = (num: number, format: NumberFormatter) => {
  const { value, scale } = scaleNumber(num)
  return format(value) + scale
}
