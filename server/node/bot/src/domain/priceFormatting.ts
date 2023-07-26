import moment from 'moment'
import numeral from 'numeral'
export interface Rate {
  bigFigure: number
  rawRate: number
  ratePrecision: number
  pipFraction: number
  pipPrecision: number
  pips: number
}

export function toRate(
  rawRate: number = 0,
  ratePrecision: number = 0,
  pipPrecision: number = 0
): Rate {
  const rateString = rawRate.toFixed(ratePrecision)
  const priceParts = rateString.split('.')
  const wholeNumber = priceParts[0]
  const fractions = priceParts[1] || '00000'
  return {
    rawRate,
    ratePrecision,
    pipPrecision,
    bigFigure: Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2)),
    pips: Number(fractions.substring(pipPrecision - 2, pipPrecision)),
    pipFraction: Number(fractions.substring(pipPrecision, pipPrecision + 1)),
  }
}

export function getSpread(
  bid: number = 0,
  ask: number = 0,
  pipsPosition: number = 0,
  ratePrecision: number = 0
) {
  const spread = (ask - bid) * Math.pow(10, pipsPosition)
  const toFixedPrecision = spread.toFixed(ratePrecision - pipsPosition)
  return {
    value: Number(toFixedPrecision),
    formattedValue: toFixedPrecision,
  }
}

export function formatNumber(num: number) {
  return numeral(num).format('0,000,000[.]00')
}

export function formatDate(date: string | Date) {
  return moment(date).format('DD MMM YY')
}

export function formatDateTime(date: Date) {
  return moment(date).format('DD/M/YY H:mm:ss')
}
