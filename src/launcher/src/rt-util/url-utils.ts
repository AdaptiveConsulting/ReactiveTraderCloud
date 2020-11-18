export function currencyFormatter(path: string) {
  const baseCurrency = path.slice(0, 3)
  const counterCurrency = path.slice(3, 6)

  return `${baseCurrency}/${counterCurrency}`
}
