import { Context } from 'openfin/_v2/fdc3/main'

const getCurrencyPairContext = (currencyPair: string): Context => {
  return {
    type: 'fdc3.instrument',
    id: { ticker: currencyPair },
  }
}

export default getCurrencyPairContext
