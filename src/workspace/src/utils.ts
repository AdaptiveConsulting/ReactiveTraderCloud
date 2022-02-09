import { App } from '@openfin/workspace-platform'
import { firstValueFrom } from 'rxjs'
import { VITE_RT_URL } from './consts'
import { currencyPairSymbols$ } from './services/currencyPairs'
import { getCurrentUser, USER_WORLDWIDE } from './user'

export const getSpotTileApps = async (): Promise<App[]> => {
  const currentUser = getCurrentUser()
  const currencyPairs = await firstValueFrom(currencyPairSymbols$)
  const filteredCurrencyPairs =
    currentUser === USER_WORLDWIDE
      ? currencyPairs
      : currencyPairs.filter(symbol => ['GBP', 'EUR'].some(ccy => symbol.includes(ccy)))

  return filteredCurrencyPairs.map(symbol => ({
    appId: `reactive-trader-${symbol}`,
    manifestType: 'url',
    manifest: `${VITE_RT_URL}/spot/${symbol}`,
    title: `${symbol} Spot Tile`,
    icons: [],
    publisher: 'Adaptive Financial Consulting'
  }))
}
