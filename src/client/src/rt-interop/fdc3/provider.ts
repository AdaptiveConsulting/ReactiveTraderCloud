import { Application, Context, DesktopAgent } from '@adaptive/fdc3-types'
import { InteropProvider } from 'rt-interop/types'
import { getCurrencyPair } from './contexts'
import { DetectIntentResponse } from 'dialogflow'
import { TRADES_INFO_INTENT } from '../intents'

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

export default class FDC3 implements InteropProvider {
  readonly name = 'fdc3'

  readonly context: DesktopAgent

  constructor(context: DesktopAgent) {
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
        ({ name }) =>
          ({
            appId: name,
            name,
          } as Application),
      ),
    )
  }

  open = (appId: string): Promise<void> => {
    return this.context.open(appId)
  }

  joinChannel = (channelId: string): Promise<void> => {
    return this.context.joinChannel(channelId)
  }

  getContext = () => this.context
}
