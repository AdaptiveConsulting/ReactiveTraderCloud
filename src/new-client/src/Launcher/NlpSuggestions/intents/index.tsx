import { NlpIntent, NlpIntentType } from "@/Launcher/services/nlpService"
import { openWindow } from "@/OpenFin/utils/window"
import { constructUrl } from "@/utils/url"

export const showCurrencyPairWindow = (currencyPair: string) => {
  const options = {
    name: currencyPair,
    url: constructUrl(`/spot/${currencyPair}`),
    width: 380,
    height: 200,
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

    default:
      console.log("TODO")
  }
}
