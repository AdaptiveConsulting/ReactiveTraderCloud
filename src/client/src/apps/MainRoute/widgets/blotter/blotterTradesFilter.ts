import { Trade } from 'rt-types'
import { DEALT_CURRENCY, SYMBOL } from './blotterFields'

export type FieldValues = ReadonlyArray<any> | undefined

export type BlotterFilters = {
  readonly [SYMBOL]?: FieldValues
  readonly [DEALT_CURRENCY]?: FieldValues
  readonly count?: number
}

const tradeMatchesFilter = (trade: Trade, filterField: string, filterValues: FieldValues) => {
  if (!trade) {
    return false
  }
  if (!filterValues || filterValues.length === 0) {
    return true
  }
  if (!(trade as any).hasOwnProperty(filterField)) {
    console.warn(`Trying to filter of field ${filterField} which does not exist in 'Trade' object`)
    return true
  }

  const tradeFieldValue = trade[filterField]

  return filterValues.includes(tradeFieldValue)
}

/**
 * Fields by which we will filter trades
 */
const tradeFilterFields: ReadonlyArray<keyof Omit<BlotterFilters, 'count'>> = [
  DEALT_CURRENCY,
  SYMBOL,
]

function isMeaningfullValue(value: any): boolean {
  return typeof value !== 'undefined' && value !== ''
}

/**
 * Remove meaningless filter values
 */
export function validateFilters(filters: BlotterFilters): BlotterFilters {
  return {
    count: filters.count,
    [DEALT_CURRENCY]: (filters[DEALT_CURRENCY] || []).filter(isMeaningfullValue),
    [SYMBOL]: (filters[SYMBOL] || []).filter(isMeaningfullValue),
  }
}

export function filterBlotterTrades(
  trades: ReadonlyArray<Trade>,
  filters: BlotterFilters,
): ReadonlyArray<Trade> {
  const count = filters && typeof filters.count !== 'undefined' ? filters.count : trades.length
  filters = validateFilters(filters || {})
  trades = trades.filter(trade =>
    tradeFilterFields.every(filterField =>
      tradeMatchesFilter(trade, filterField, filters[filterField]),
    ),
  )
  return trades.slice(0, count)
}
