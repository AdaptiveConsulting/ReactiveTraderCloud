import { App } from "@openfin/workspace-platform"
import { firstValueFrom } from "rxjs"

import { currencyPairSymbols$ } from "@/services/currencyPairs"

import { getApps, getSnapshots, getViews } from "./apps"
import { VITE_RT_URL, WS_BASE_URL } from "./constants"
import { ADAPTIVE_LOGO } from "./home/utils"
import { getCurrentUser, USER_TRADER } from "./user"

export const getAllMainApps = async (): Promise<App[]> => [
  ...getApps(),
  ...getViews(),
  ...getSnapshots(),
]

export const getAllApps = async (): Promise<App[]> => [
  ...getApps(),
  ...getViews(),
  ...getSnapshots(),
  ...(await getSpotTileApps()),
]

export const getSpotTileApps = async (): Promise<App[]> => {
  const currentUser = getCurrentUser()
  if (currentUser !== USER_TRADER) {
    return []
  }
  const currencyPairs = await firstValueFrom(currencyPairSymbols$)

  return currencyPairs.map((symbol) => ({
    appId: `reactive-trader-${symbol}`,
    title: `${symbol} Spot Tile`,
    description: `Reactive Trader - Live rates and trade ${symbol} in this view`,
    manifestType: "url",
    manifest: `${VITE_RT_URL}/fx-spot/${symbol}`,
    icons: [{ src: ADAPTIVE_LOGO }],
    publisher: "Adaptive Financial Consulting",
    tags: ["FX", "Trading", "Market Data"],
    images: [{ src: `${WS_BASE_URL}/images/previews/GBPUSD.png` }],
  }))
}
