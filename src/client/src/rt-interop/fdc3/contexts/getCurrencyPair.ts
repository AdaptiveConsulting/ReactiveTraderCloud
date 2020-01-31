import { Context } from 'openfin-fdc3'

const getCurrencyPairContext = (currencyPair: string): Context => {
  return {
    type: 'fdc3.instrument',
    id: { ticker: currencyPair },
  }
}

export default getCurrencyPairContext
