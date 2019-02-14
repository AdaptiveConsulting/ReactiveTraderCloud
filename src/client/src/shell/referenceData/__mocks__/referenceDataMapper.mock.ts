import { RawCurrencyPairUpdate, CurrencyRaw } from '../referenceDataMapper'
import { CurrencyPair } from 'rt-types'

const currencyRaw = {
  Symbol: 'USDYAN',
  RatePrecision: 2.0,
  PipsPosition: 4.6,
}

export const MockCurrencyRaw = (overrides: Partial<CurrencyRaw>) => ({
  ...currencyRaw,
  ...overrides,
})

export const createRawCurrencyPairUpdates = (
  isStateOfTheWorld: boolean,
  isStale: boolean,
  ...args: RawCurrencyPairUpdate[]
) => {
  const updates: RawCurrencyPairUpdate[] = []
  for (const e of args) {
    updates.push(e)
  }
  return {
    isStateOfTheWorld,
    isStale,
    Updates: updates,
  }
}

const currencyPair = {
  symbol: 'USDYAN',
  ratePrecision: 2.0,
  pipsPosition: 4.6,
  base: 'USD',
  terms: 'YAN',
}

export const MockCurrencyPair = (overrides: Partial<CurrencyPair>) => ({
  ...currencyPair,
  ...overrides,
})
