export function urlCurrencyPairExtractor(path: string) {
  const extractedPath = path.split('/')

  const currencyPair = extractedPath[extractedPath.length - 1]
  const baseCurrency = currencyPair.slice(0, 3)
  const counterCurrency = currencyPair.slice(3, 6)

  return `${baseCurrency}/${counterCurrency}`
}
