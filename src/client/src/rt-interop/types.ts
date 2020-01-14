import { DetectIntentResponse } from 'dialogflow'

export type ProviderName = 'fdc3' | 'noop'

export interface Application {
  id: string
  name: string
}

export type InteropProvider = {
  readonly name: ProviderName

  readonly getMatchingApps: (response: DetectIntentResponse) => Promise<Application[]>

  readonly open: (appId: string) => Promise<void>

  readonly currencyPairSelected: (currencyPair: string) => void
}
