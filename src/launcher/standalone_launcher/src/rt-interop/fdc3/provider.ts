import { InteropProvider } from 'rt-interop/types'
import { getCurrencyPair } from './contexts'
import { FDC3Platform } from './adapter/types'

export default class FDC3 implements InteropProvider {
  readonly name = 'fdc3'

  readonly context: FDC3Platform

  constructor(context: FDC3Platform) {
    this.context = context
  }

  currencyPairSelected = (currencyPair: string) => {
    this.context.broadcast(getCurrencyPair(currencyPair))
  }
}
