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
  isMarketIntent,
  mapIntent,
  isTradeExecutionIntent,
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
import { InlineQuoteTable } from './InlineQuote'
import { InlineMarketResults } from './InlineMarketResults'
import { appConfigs } from '../../applicationConfigurations'
import { open } from '../../tools'

import { reactiveTraderIcon } from 'apps/SimpleLauncher/icons'
import styled from 'styled-components/macro'

const RTC_CONFIG = appConfigs[0]

const PlatformLogoWrapper = styled.div`
  svg {
    fill: #ffffff;
  }
`

const HelpText = styled.div`
  font-size: 0.9rem;
`

const Pill = styled.div`
  padding: 0.2rem 0.4rem;
  display: inline-block;
  background-color: #5f94f5;
  color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 0.2rem;
`

export function getInlineSuggestionsComponent(response: DetectIntentResponse, platform: Platform) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)
  const number = getNumber(response.queryResult)

  const intent = mapIntent(response)

  if (isTradeExecutionIntent(response)) {
    if (!number || !currencyPair) {
      return (
        <HelpText>
          Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>instrument</Pill>
        </HelpText>
      )
    }

    return (
      <HelpText>
        Press <Pill>ENTER</Pill> to continue
      </HelpText>
    )
  }

  const quoteSuggestion =
    isSpotQuoteIntent(response) && currencyPair ? (
      <Suggestion>
        <InlineQuoteTable currencyPair={currencyPair} />
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

  const marketSuggestion = isMarketIntent(response) ? (
    <Suggestion>
      <InlineMarketResults />
    </Suggestion>
  ) : null

  const otherSuggestion = !quoteSuggestion && !blotterSuggestion && !isMarketIntent && (
    <Suggestion>
      <Intent>{intent}</Intent>
    </Suggestion>
  )

  if (!intent) {
    return <HelpText>No results</HelpText>
  }

  return (
    <IntentWrapper>
      <IntentActions>
        <IntentActionWrapper>
          <LogoWrapper>
            <PlatformLogoWrapper>{reactiveTraderIcon}</PlatformLogoWrapper>
          </LogoWrapper>
          <span>Reactive Trader®</span>
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
      {marketSuggestion}
      {otherSuggestion}
    </IntentWrapper>
  )
}
