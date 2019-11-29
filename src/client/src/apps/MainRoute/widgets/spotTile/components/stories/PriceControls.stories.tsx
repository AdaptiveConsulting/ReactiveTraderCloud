import { Centered, stories, Story } from "./Initialise.stories";
import React from "react";
import PriceControls from "../PriceControls";
import { action } from "@storybook/addon-actions";
import { boolean, select } from "@storybook/addon-knobs";
import { RfqState } from "../types";

stories.add('Price controls', () => {
  const rfqStates = {
    none: 'none',
    canRequest: 'canRequest',
    requested: 'requested',
    received: 'received',
    expired: 'expired'
  }

  const onTradeExecute = action('execute trade')
  const isDisabled = boolean('disabled', false)
  const isPricingStale = boolean('Stale prices', false)
  const isTradeExecutionInFlight = boolean('isTradeExecutionInFlight', false)
  const isAnalyticsView = boolean('isAnalyticsView', false)
  const rfqSatesSelector = select('Rfq State', rfqStates, 'none')

  const currencyPair = {
    symbol: 'USDYAN',
    ratePrecision: 1.5,
    pipsPosition: 1.0,
    base: 'USD',
    terms: 'YAN',
  }

  const spotTick = {
    ask: 10.6,
    bid: 10.1,
    mid: 10.2 ,
    creationTimestamp: 1000,
    symbol: 'USDYAN',
    valueDate: '2019-01-02',
    priceStale: isPricingStale
  }

  return(
    <Story>
      <Centered>
        <PriceControls
          currencyPair={currencyPair}
          priceData={spotTick}
          executeTrade={onTradeExecute}
          disabled={isDisabled}
          rfqState={rfqSatesSelector as RfqState}
          isTradeExecutionInFlight={isTradeExecutionInFlight}
          isAnalyticsView={isAnalyticsView} />
      </Centered>
    </Story>
  )
})
