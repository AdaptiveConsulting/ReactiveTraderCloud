import { DetectIntentResponse } from 'dialogflow'
import { findIntent, open } from 'openfin-fdc3'
import { SpotlightApplication, SpotlightFdc3 } from './fdc3'
import { TRADES_INFO_INTENT } from '../intents'

const mapIntentToFdc3 = (response: DetectIntentResponse): string => {
  if (!response) {
    return null
  }

  switch (response.queryResult.intent.displayName) {
    case TRADES_INFO_INTENT:
      return `fdc3.ViewBlotter`
    default:
      return null
  }
}

export class OpenfinFdc3 implements SpotlightFdc3 {
  getMatchingApps(response: DetectIntentResponse) {
    const fdc3Intent = mapIntentToFdc3(response)

    if (!response || !fdc3Intent) {
      return Promise.resolve([])
    }

    return findIntent(fdc3Intent).then(({ apps }) =>
      apps.map(
        ({ appId, title }) =>
          ({
            id: appId,
            name: title,
          } as SpotlightApplication),
      ),
    )
  }

  open(appId: string): Promise<void> {
    return open(appId)
  }
}
