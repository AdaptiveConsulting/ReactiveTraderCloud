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
import { Intent, Suggestion, IntentWrapper, IntentActions } from './styles'
import { InlineBlotter } from './InlineBlotter'
import { InlineQuote } from './InlineQuote'

export function getInlineSuggestionsComponent(response: DetectIntentResponse, platform: Platform) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)
  const intent = mapIntent(response)
  console.log(response, intent, platform)
  const quoteSuggestion =
    isSpotQuoteIntent(response) && currencyPair ? (
      <Suggestion onClick={() => handleIntent(response, platform)}>
        <InlineQuote currencyPair={currencyPair} />
      </Suggestion>
    ) : null

  const blotterFilter: BlotterFilters = {
    [DEALT_CURRENCY]: [currency],
    [SYMBOL]: [currencyPair],
    count: getNumber(response.queryResult),
  }
  const blotterSuggestion = isTradeIntent(response) ? (
    <Suggestion onClick={() => handleIntent(response, platform)}>
      <InlineBlotter filters={blotterFilter} />
    </Suggestion>
  ) : null

  const otherSuggestion = !quoteSuggestion && !blotterSuggestion && (
    <Suggestion onClick={() => handleIntent(response, platform)}>
      <Intent>{intent}</Intent>
    </Suggestion>
  )

  if (!intent) {
    return <div>No results</div>
  }
  // if (!quoteSuggestion && !blotterSuggestion) {
  //   if (intent) {
  //     return (
  //     )
  //   }
  //   return
  // }

  return (
    <IntentWrapper>
      <IntentActions>
        <img src="http://placehold.it/50x50" />
        <div>
          <button>Launch Platform</button>
          <button>{intent}</button>
        </div>
      </IntentActions>
      {quoteSuggestion}
      {blotterSuggestion}
      {otherSuggestion}
    </IntentWrapper>
  )
}
