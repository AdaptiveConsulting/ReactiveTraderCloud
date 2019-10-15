import { DetectIntentResponse } from 'dialogflow'
import {
  CURRENCY_INTENT,
  MARKET_INFO_INTENT,
  SPOT_QUOTE_INTENT,
  TRADES_INFO_INTENT,
} from './intents'
import { BasePlatformAdapter } from '../../rt-platforms/platformAdapter'
import { WindowConfig } from '../../rt-platforms'
import { WindowCenterStatus } from '../../rt-components/tear-off/types'

const defaultConfig: WindowConfig = {
  name: '',
  url: '',
  width: 600,
  height: 400,
  center: WindowCenterStatus.Parent,
  x: 0,
  y: 0,
}

// Safer than location.origin due to browser support
const ORIGIN = `${location.protocol}//${location.host}`

function showCurrencyPair(currencyPair: string, { window }: BasePlatformAdapter) {
  // TODO: position and size of the window, also make it frame-less
  window.open({
    ...defaultConfig,
    url: `${ORIGIN}/spot/${currencyPair.toUpperCase()}?tileView=Normal`,
  })
}

export const handleIntent = (
  response: DetectIntentResponse[],
  platformAdapter: BasePlatformAdapter,
) => {
  const queryResult = response[0].queryResult

  let intentDisplayName
  try {
    intentDisplayName = queryResult.intent.displayName
  } catch (e) {
    console.error(`Can't read intent display name`)
    return
  }
  switch (intentDisplayName) {
    case SPOT_QUOTE_INTENT:
      let currencyPair
      try {
        currencyPair = queryResult.parameters.fields.CurrencyPairs.stringValue
      } catch (e) {
        console.error(`Can't read currency pair`)
        return
      }
      if (!currencyPair) {
        console.error(`No currency pair in queryResult`)
      }
      showCurrencyPair(currencyPair, platformAdapter)
      return
    case CURRENCY_INTENT:
    case MARKET_INFO_INTENT:
    case TRADES_INFO_INTENT:
    default:
      console.log(`Do not know how to handle intent ${intentDisplayName}`)
  }
}
