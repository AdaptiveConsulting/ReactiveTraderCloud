import { IntentsProvider } from 'rt-intents/types'
import { noop } from 'rxjs'

export default class Noop implements IntentsProvider {
  readonly name = 'noop'

  currencyPairSelected = noop
}
