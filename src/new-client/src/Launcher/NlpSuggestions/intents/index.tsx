import { NlpIntent, NlpIntentType } from "@/Launcher/services/nlpService"
import { getReactiveTraderUrl } from "@/Launcher/utils/url"
import { openWindow } from "@/OpenFin/utils/window"

export const showCurrencyPairWindow = (currencyPair: string) => {
  const options = {
    name: currencyPair,
    url: getReactiveTraderUrl(`/spot/${currencyPair}`),
    width: 380,
    height: 200,
    includeInSnapshots: false,
  }

  return openWindow(options)
}

export const showTilesWindow = () => {
  const options = {
    name: "Live Rates",
    url: getReactiveTraderUrl("/tiles"),
    width: 1000,
    height: 500,
    includeInSnapshots: false,
  }
  console.log(options.url)

  return openWindow(options)
}

export const showBlotterWindow = () => {
  const options = {
    name: "Trades",
    url: getReactiveTraderUrl("/blotter"),
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
