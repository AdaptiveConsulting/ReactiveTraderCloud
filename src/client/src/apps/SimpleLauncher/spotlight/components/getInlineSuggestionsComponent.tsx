import React from 'react'
import { DetectIntentResponse } from 'dialogflow'
import { Platform } from 'rt-platforms'
import {
  getCurrency,
  getCurrencyPair,
  getNumber,
  handleIntent,
  isSpotQuoteIntent,
  isTradeIntent,
  mapIntent,
} from 'rt-interop'
import { BlotterFilters, DEALT_CURRENCY, SYMBOL } from 'apps/MainRoute'
import { LogoWrapper, Intent, Suggestion, IntentWrapper, IntentActions } from './styles'
import { InlineBlotter } from './InlineBlotter'
import { InlineQuote } from './InlineQuote'
import Logo from 'apps/MainRoute/components/app-header/Logo'

export function getInlineSuggestionsComponent(response: DetectIntentResponse, platform: Platform) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)
  const intent = mapIntent(response)
  console.log(response, intent, platform)
  const quoteSuggestion =
    isSpotQuoteIntent(response) && currencyPair ? (
      <Suggestion>
        <InlineQuote currencyPair={currencyPair} />
      </Suggestion>
    ) : null

  const blotterFilter: BlotterFilters = {
    [DEALT_CURRENCY]: [currency],
    [SYMBOL]: [currencyPair],
    count: getNumber(response.queryResult),
  }
  const blotterSuggestion = isTradeIntent(response) ? (
    <Suggestion>
      <InlineBlotter filters={blotterFilter} />
    </Suggestion>
  ) : null

  const otherSuggestion = !quoteSuggestion && !blotterSuggestion && (
    <Suggestion>
      <Intent>{intent}</Intent>
    </Suggestion>
  )

  if (!intent) {
    return <div>No results</div>
  }

  return (
    <IntentWrapper>
      <IntentActions>
        <div>
          <LogoWrapper>
            <Logo size={1.5} withText={false} />
          </LogoWrapper>
        </div>
        <div>
          <button>Launch Platform</button>
          <button onClick={() => handleIntent(response, platform)}>{intent}</button>
        </div>
      </IntentActions>
      {quoteSuggestion}
      {blotterSuggestion}
      {otherSuggestion}
    </IntentWrapper>
  )
}
