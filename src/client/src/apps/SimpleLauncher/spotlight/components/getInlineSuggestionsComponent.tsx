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
import {
  LogoWrapper,
  Intent,
  Suggestion,
  IntentWrapper,
  IntentActions,
  IntentActionWrapper,
} from './styles'
import { InlineBlotter } from './InlineBlotter'
import { InlineQuote } from './InlineQuote'
import Logo from 'apps/MainRoute/components/app-header/Logo'
import { appConfigs } from '../../applicationConfigurations'
import { open } from '../../tools'

const RTC_CONFIG = appConfigs[0]

export function getInlineSuggestionsComponent(response: DetectIntentResponse, platform: Platform) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)
  const intent = mapIntent(response)

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
        <IntentActionWrapper>
          <LogoWrapper>
            <Logo size={1.5} withText={false} />
          </LogoWrapper>
          <span>Reactive Trader</span>
        </IntentActionWrapper>
        <IntentActionWrapper>
          {intent && (
            <>
              <button onClick={() => open(RTC_CONFIG)}>Launch Platform</button>
              <button onClick={() => handleIntent(response, platform)}>{intent}</button>
            </>
          )}
        </IntentActionWrapper>
      </IntentActions>
      {quoteSuggestion}
      {blotterSuggestion}
      {otherSuggestion}
    </IntentWrapper>
  )
}
