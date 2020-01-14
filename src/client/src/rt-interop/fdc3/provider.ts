import { Context } from 'openfin-fdc3'
import { IntentsProvider, Application } from 'rt-interop/types'
import { getCurrencyPair } from './contexts'
import { DetectIntentResponse } from 'dialogflow'
import { TRADES_INFO_INTENT } from '../intents'
import { FDC3Platform } from './adapter/types'

const mapIntentToFdc3 = (response: DetectIntentResponse): string | undefined => {
  if (!response) {
    return
  }

  switch (response.queryResult.intent.displayName) {
    case TRADES_INFO_INTENT:
      return `fdc3.ViewBlotter`
    default:
      return
  }
}

export default class FDC3 implements IntentsProvider {
  readonly name = 'fdc3'

  readonly context: FDC3Platform

  constructor(context: FDC3Platform) {
    this.context = context
  }

  private broadcast = (context: Context) => this.context.broadcast(context)

  currencyPairSelected = (currencyPair: string) => {
    this.broadcast(getCurrencyPair(currencyPair))
  }

  getMatchingApps = (response: DetectIntentResponse) => {
    const fdc3Intent = mapIntentToFdc3(response)

    if (!response || !fdc3Intent) {
      return Promise.resolve([])
    }

    return this.context.findIntent(fdc3Intent).then(({ apps }) =>
      apps.map(
        ({ appId, title }) =>
          ({
            id: appId,
            name: title,
          } as Application),
      ),
    )
  }

  open = (appId: string): Promise<void> => {
    return this.context.open(appId)
  }
}
