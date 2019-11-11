import { DetectIntentResponse } from 'dialogflow'
import { MARKET_INFO_INTENT, SPOT_QUOTE_INTENT, TRADES_INFO_INTENT } from './intents'
import { Platform } from 'rt-platforms'
import { showBlotter, showCurrencyPair, showMarket } from './intent-handlers'
import { getCurrency, getCurrencyPair, getIntentDisplayName, getNumber } from './intentUtils'
import { BlotterFilters } from '../MainRoute/widgets/blotter'

export const handleIntent = (response: DetectIntentResponse, platform: Platform) => {
  const queryResult = response.queryResult
  const intentDisplayName = getIntentDisplayName(queryResult)
  switch (intentDisplayName) {
    case SPOT_QUOTE_INTENT: {
      const currencyPair = getCurrencyPair(queryResult)
      if (!currencyPair) {
        console.error(`No currency pair in queryResult`)
        return
      }
      showCurrencyPair(currencyPair, platform)
      return
    }
    case MARKET_INFO_INTENT:
      showMarket(platform)
      return
    case TRADES_INFO_INTENT: {
      const currencyPair = getCurrencyPair(queryResult)
      const currency = getCurrency(queryResult)
      const filters: BlotterFilters = {
        dealtCurrency: [currency],
        symbol: [currencyPair],
        count: getNumber(queryResult),
      }
      showBlotter(filters, platform)
      return
    }
    default:
      console.log(`Do not know how to handle intent ${intentDisplayName}`)
  }
}
