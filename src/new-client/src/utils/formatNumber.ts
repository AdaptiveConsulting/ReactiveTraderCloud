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
  return nf.format.bind(nf)
}

/**
 * Returns a func that formats to set number of significant digits
 *
 * const format = significantDigitsNumberFormatter(6)
 *
 * format(123.456789) => '123.456'
 * format(1.23456789) => '1.23456'
 * format(0.123456789) => '0.123456'
 */
export const significantDigitsNumberFormatter = (
  significantDigits: number,
): NumberFormatter =>
  numberFormatter({
    maximumFractionDigits: significantDigits,
    minimumSignificantDigits: significantDigits,
  })

/**
 * Returns a func that formats to set decimal precision
 */
export const precisionNumberFormatter = (precision: number): NumberFormatter =>
  numberFormatter({
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

/**
 * Takes any Intl.NumberFormatOptions to construct
 * a custom number formatting func
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const customNumberFormatter = numberFormatter

/**
 * Default number formatter
 *
 * Minimum fraction digits = 0
 * Maximum fraction digits = 3
 */
export const formatNumber = numberFormatter()

export const formatAsWholeNumber = precisionNumberFormatter(0)

export const formatWithScale = (num: number, format: NumberFormatter) => {
  const { value, scale } = scaleNumber(num)
  return format(value) + scale
}
