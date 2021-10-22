const NOTIONALS_STORAGE_KEY = "notionals"

export const setNotionalOnStorage = (
  currencyPairSymbol: string,
  value: number,
) => {
  if (localStorage) {
    const notionals = localStorage.getItem(NOTIONALS_STORAGE_KEY)
    const newNotionalsValue =
      notionals !== null
        ? { ...JSON.parse(notionals), [currencyPairSymbol]: `${value}` }
        : { [currencyPairSymbol]: `${value}` }

    localStorage.setItem(
      NOTIONALS_STORAGE_KEY,
      JSON.stringify(newNotionalsValue),
    )
  }
}
