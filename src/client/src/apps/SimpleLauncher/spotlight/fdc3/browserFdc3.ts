import { DetectIntentResponse } from 'dialogflow'
import { SpotlightFdc3 } from './fdc3'

export class BrowserFdc3 implements SpotlightFdc3 {
  getMatchingApps(response: DetectIntentResponse) {
    return Promise.resolve([])
  }

  open(appId: string): Promise<void> {
    return Promise.reject('Not Supported')
  }
}
