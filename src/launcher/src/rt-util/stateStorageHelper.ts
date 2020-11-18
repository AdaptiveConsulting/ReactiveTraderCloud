const NOTIONALS_STORAGE_KEY = 'notionals'

export const getNotionalFromStorage: (id: string) => number | undefined = id => {
  if (localStorage && localStorage.getItem(NOTIONALS_STORAGE_KEY) !== null) {
    const notionals = localStorage.getItem(NOTIONALS_STORAGE_KEY)
    const notional = notionals !== null ? JSON.parse(notionals)?.[id] : undefined
    return notional ? Number.parseFloat(notional) : undefined
  }

  return undefined
}

export const setNotionalOnStorage = (currencyPairSymbol: string, value: number) => {
  if (localStorage) {
    const notionals = localStorage.getItem(NOTIONALS_STORAGE_KEY)
    const newNotionalsValue =
      notionals !== null
        ? { ...JSON.parse(notionals), [currencyPairSymbol]: `${value}` }
        : { [currencyPairSymbol]: `${value}` }

    localStorage.setItem(NOTIONALS_STORAGE_KEY, JSON.stringify(newNotionalsValue))
  }
}

export const clearNotionalsOnStorage = () => {
  if (localStorage) {
    localStorage.removeItem(NOTIONALS_STORAGE_KEY)
  }
}
