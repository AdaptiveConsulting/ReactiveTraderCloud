import { Context } from 'openfin-fdc3'

const getCurrencyPairContext = (currencyPair: string): Context => {
  const ticker = `${currencyPair.slice(0, 3)}/${currencyPair.slice(3, 6)}`
  return {
    type: 'fdc3.instrument',
    id: { ticker },
  }
}

export default getCurrencyPairContext
