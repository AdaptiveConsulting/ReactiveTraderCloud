import { Trade } from 'rt-types'
import { DEALT_CURRENCY, SYMBOL } from './blotterFields';

export type FieldValues = ReadonlyArray<any> | undefined;

export type BlotterFilters = {
  readonly [SYMBOL]?: FieldValues
  readonly [DEALT_CURRENCY]?: FieldValues
}

const tradeMatchesFilter = (trade: Trade, filterField: string, filteringFieldValues: FieldValues) => {
  if (!trade) {
    return false
  }
  if (!filteringFieldValues) {
    return true
  }
  if (!(trade as any).hasOwnProperty(filterField)) {
    console.warn(`Trying to filter of field ${filterField} which does not exist in 'Trade' object`);
    return true
  }

  const tradeFieldValue = trade[filterField]

  return filteringFieldValues.includes(tradeFieldValue)
}

/**
 * Remove meaningless filter values
 */
export function validateFilters(filters: BlotterFilters): BlotterFilters {
  return Object.entries(filters).reduce(
    (acc, [fieldId, values]) => {
      const validatedValues = values.filter(value => typeof value !== 'undefined' && value !== '')
      if (validatedValues.length > 0) {
        acc[fieldId] = validatedValues
      }
      return acc
    },
    {}
  )
}

export function filterBlotterTrades(trades: ReadonlyArray<Trade>, filters: BlotterFilters): ReadonlyArray<Trade> {
  filters = validateFilters(filters || {})
  const fieldsToFilterBy = Object.keys(filters)
  if (!filters || fieldsToFilterBy.length === 0) {
    return trades;
  }

  return trades.filter(
    trade => {
      return fieldsToFilterBy.every(fieldToFilterBy => tradeMatchesFilter(trade, fieldToFilterBy, filters[fieldToFilterBy]))
    }
  )
}
