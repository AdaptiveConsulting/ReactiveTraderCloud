import { Application, DesktopAgent } from '@adaptive/fdc3-types'
import { DetectIntentResponse } from 'dialogflow'

export type ProviderName = 'fdc3' | 'noop'

export type InteropProvider = {
  readonly name: ProviderName

  readonly getMatchingApps: (response: DetectIntentResponse) => Promise<Application[]>

  readonly open: (appId: string) => Promise<void>

  readonly currencyPairSelected: (currencyPair: string) => void

  readonly getContext: () => DesktopAgent
}
