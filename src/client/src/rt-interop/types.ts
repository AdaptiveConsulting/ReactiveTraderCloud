export type ProviderName = 'fdc3' | 'noop'

export interface Application {
  id: string
  name: string
}

export type InteropProvider = {
  readonly name: ProviderName

  readonly currencyPairSelected: (currencyPair: string) => void
}
