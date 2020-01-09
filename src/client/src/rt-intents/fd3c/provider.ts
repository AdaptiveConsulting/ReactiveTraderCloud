import { Context } from 'openfin-fdc3'
import { IntentsProvider } from 'rt-intents/types'
import { getCurrencyPair } from './contexts'

export default class FDC3 implements IntentsProvider {
  readonly name = 'fdc3'

  readonly context: any

  constructor(context: any) {
    this.context = context
  }

  private broadcast = (context: Context) => this.context.broadcast(context)

  currencyPairSelected = (currencyPair: string) => {
    this.broadcast(getCurrencyPair(currencyPair))
  }
}
