import { noop } from 'rxjs'
import { DetectIntentResponse } from 'dialogflow'
import { IntentsProvider } from 'rt-interop/types'

export default class NoopProvider implements IntentsProvider {
  readonly name = 'noop'

  currencyPairSelected = noop

  getMatchingApps = (_response: DetectIntentResponse) => {
    return Promise.resolve([])
  }

  open = (appId: string): Promise<void> => {
    return Promise.reject('Not Supported')
  }
}
