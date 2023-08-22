import { ROUTES_CONFIG } from "client/constants"
import { openWindow } from "client/utils/window/openWindow"

import { NlpIntent, NlpIntentType } from "@/services/nlp"

import { getReactiveTraderUrl } from "../../utils/url"

export const showCurrencyPairWindow = (currencyPair: string) => {
  const options = {
    name: currencyPair,
    url: getReactiveTraderUrl(
      ROUTES_CONFIG.tile.replace(":symbol", currencyPair),
    ),
    width: 380,
    height: 200,
    includeInSnapshots: false,
  }

  return openWindow(options)
}

export const showTilesWindow = () => {
  const options = {
    name: "Live Rates",
    url: getReactiveTraderUrl(ROUTES_CONFIG.tiles),
    width: 1000,
    height: 500,
    includeInSnapshots: false,
  }

  return openWindow(options)
}

export const showBlotterWindow = () => {
  const options = {
    name: "Trades",
    url: getReactiveTraderUrl(ROUTES_CONFIG.blotter),
    width: 1000,
    height: 500,
    includeInSnapshots: false,
  }

  return openWindow(options)
}

export const handleIntent = (intent: NlpIntent) => {
  switch (intent.type) {
    case NlpIntentType.SpotQuote: {
      const currencyPair = intent.payload.symbol

      if (!currencyPair) {
        console.error(`No currency pair in queryResult`)
        return
      }

      showCurrencyPairWindow(currencyPair)

      return
    }

    case NlpIntentType.MarketInfo: {
      showTilesWindow()

      return
    }

    case NlpIntentType.TradeInfo: {
      showBlotterWindow()

      return
    }

    default:
      console.log("TODO")
  }
}
