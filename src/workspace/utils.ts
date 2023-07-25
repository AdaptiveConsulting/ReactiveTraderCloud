import { App } from "@openfin/workspace-platform"
import { firstValueFrom } from "rxjs"

import { currencyPairSymbols$ } from "@/services/currencyPairs"

import { VITE_RA_URL, VITE_RT_URL } from "./consts"
import { ADAPTIVE_LOGO } from "./home/utils"

export const getSpotTileApps = async (): Promise<App[]> => {
  const currencyPairs = await firstValueFrom(currencyPairSymbols$)

  return currencyPairs.map((symbol) => ({
    appId: `reactive-trader-${symbol}`,
    manifestType: "url",
    manifest: `${VITE_RT_URL}/fx-spot/${symbol}`,
    title: `${symbol} Spot Tile`,
    icons: [{ src: ADAPTIVE_LOGO }],
    publisher: "Adaptive Financial Consulting",
    description: `View ${symbol} live rates`,
  }))
}

export const manifestUrls = {
  reactiveTrader: `${VITE_RT_URL}/config/rt-fx.json`,
  reactiveCredit: `${VITE_RT_URL}/config/rt-credit.json`,
  reactiveAnalytics: `${VITE_RA_URL}/openfin/app.json`,
  limitChecker: `${VITE_RT_URL}/config/limit-checker.json`,
}
