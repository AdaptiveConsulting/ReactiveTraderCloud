export type ProviderName = 'fdc3'

export type IntentsProvider = {
  readonly name: ProviderName

  readonly currencyPairSelected?: (currencyPair: string) => void
}
