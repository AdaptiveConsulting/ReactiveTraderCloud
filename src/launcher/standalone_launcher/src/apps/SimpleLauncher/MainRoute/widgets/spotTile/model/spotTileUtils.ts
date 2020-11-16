import { Direction } from 'rt-types'
import { Rate } from './rate'
import { RfqState } from '../components/types'
import uuid from 'uuid'

export const DEFAULT_NOTIONAL = 1000000

export const SPOT_DATE_FORMAT = 'dd MMM'

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
    pipFraction: Number(fractions.substring(pipPrecision, pipPrecision + 1))
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
    formattedValue: toFixedPrecision
  }
}

export interface TradeRequest {
  direction: Direction
  symbol: string
  rawSpotRate: number
  notional: number
  currencyBase: string
}

export interface TradeExectionMeta {
  uuid: string
  correlationId: string
}

export const createTradeRequest = (tradeRequestObj: TradeRequest) => {
  return {
    id: uuid(),
    CurrencyPair: tradeRequestObj.symbol,
    SpotRate: tradeRequestObj.rawSpotRate,
    Direction: tradeRequestObj.direction,
    Notional: tradeRequestObj.notional,
    DealtCurrency: tradeRequestObj.currencyBase
  }
}

export const getConstsFromRfqState = (rfqState: RfqState) => ({
  isRfqStateReceived: rfqState === 'received',
  isRfqStateExpired: rfqState === 'expired',
  isRfqStateCanRequest: rfqState === 'canRequest',
  isRfqStateRequested: rfqState === 'requested',
  isRfqStateNone: rfqState === 'none'
})
