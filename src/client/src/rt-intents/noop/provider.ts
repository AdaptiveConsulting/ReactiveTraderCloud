import { IntentsProvider } from 'rt-intents/types'
import { noop } from 'rxjs'

export default class NoopProvider implements IntentsProvider {
  readonly name = 'noop'

  currencyPairSelected = noop
}
