export interface CurrencyPair {
  symbol: string
  ratePrecision: number
  pipsPosition: number
  base: string
  terms: string
}

export interface CurrencyPairMap {
  [id: string]: CurrencyPair
}
