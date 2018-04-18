import { CurrencyPair } from '../types/currencyPair'

export const symbols = ['AAABBB', 'BBBCCC', 'AAACCC', 'BBBAAA', 'CCCAAA', 'CCCBBB']

export const getCurrencyPairs = (ccySymbols = symbols) => {

  return ccySymbols.map((symbol:string) => {
    return {
      symbol,
      ratePrecision: 3,
      pipsPosition: 2,
      base: symbol.substr(0, 3),
      terms: symbol.substr(3, 3)
    }
  })
}

export const getCurrencyPair = (symbol:string = 'USDEUR'):CurrencyPair => {
  return {
    symbol,
    ratePrecision: 3,
    pipsPosition: 2,
    base: symbol.substr(0, 3),
    terms: symbol.substr(3, 3)
  }
}
