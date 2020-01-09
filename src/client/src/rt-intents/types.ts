export type ProviderName = 'fdc3' | 'noop'

export type IntentsProvider = {
  readonly name: ProviderName

  readonly currencyPairSelected?: (currencyPair: string) => void
}
