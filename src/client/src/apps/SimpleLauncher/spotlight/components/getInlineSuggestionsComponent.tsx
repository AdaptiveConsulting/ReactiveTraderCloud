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
import { BlotterFilters, DEALT_CURRENCY, SYMBOL } from '../../../MainRoute/widgets/blotter'
import { Intent, Suggestion } from './styles'
import { InlineBlotter } from './InlineBlotter'
import { InlineQuote } from './InlineQuote'

export function getInlineSuggestionsComponent(response: DetectIntentResponse, platform: Platform) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)
  const intent = mapIntent(response)

  const quoteSuggestion =
    isSpotQuoteIntent(response) && currencyPair ? (
      <Suggestion onClick={() => handleIntent(response, platform)}>
        <Intent>{intent}</Intent>
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
      <Intent>{intent}</Intent>
      <InlineBlotter filters={blotterFilter} />
    </Suggestion>
  ) : null

  if (!quoteSuggestion && !blotterSuggestion) {
    if (intent) {
      return (
        <Suggestion onClick={() => handleIntent(response, platform)}>
          <Intent>{intent}</Intent>
        </Suggestion>
      )
    }
    return <div>No results</div>
  }

  return (
    <>
      {quoteSuggestion}
      {blotterSuggestion}
    </>
  )
}
