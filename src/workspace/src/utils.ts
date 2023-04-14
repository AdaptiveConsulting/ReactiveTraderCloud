import { App } from "@openfin/workspace-platform"
import { firstValueFrom } from "rxjs"
import { VITE_RT_URL } from "./consts"
import { currencyPairSymbols$ } from "./services/currencyPairs"
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
