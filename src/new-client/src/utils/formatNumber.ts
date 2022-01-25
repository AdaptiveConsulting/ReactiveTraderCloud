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
 * Also exports raw and RegExp friendly variables for a locale's thousands and decimal separator values
 *
 * See __tests__/formatNumber.test.ts for full usage and behavior.
 */

import escapeRegExp from "lodash/fp/escapeRegExp"

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

const locale = "default"

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
  const nf = new Intl.NumberFormat(locale, { ...options })

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

// The following code deals with finding the thousands and decimal separators for the current locale
// Functions were chosen in order to write unit tests that would not be depended on driver default locale
// "Magic Number" 1000.5 was chosen to accessing the thousands/decimal values
// Assumes that for this number, for all locales, the thousands and decimal separators will occur at the provided indices
// Preference would have been given to a native Intl function for finding these values, but none appear to be exposed at this time

type SeparatorGetter = (_locale: string) => string

export const getThousandsSeparator: SeparatorGetter = (_locale) => {
  return new Intl.NumberFormat(_locale).formatToParts(1000.5)[1].value
}

export const getDecimalSeparator: SeparatorGetter = (_locale) => {
  return new Intl.NumberFormat(_locale).formatToParts(1000.5)[3].value
}

/**
 * Thousands separator for numbers in current locale
 */
export const THOUSANDS_SEPARATOR = getThousandsSeparator(locale)

/**
 * Decimal separator for numbers in current locale
 */
export const DECIMAL_SEPARATOR = getDecimalSeparator(locale)

/**
 * Thousands separator for numbers in current locale, for use in regular expressions
 */
export const THOUSANDS_SEPARATOR_REGEXP = escapeRegExp(THOUSANDS_SEPARATOR)

/**
 * Decimal separator for numbers in current locale, for use in regular expressions
 */
export const DECIMAL_SEPARATOR_REGEXP = escapeRegExp(DECIMAL_SEPARATOR)
