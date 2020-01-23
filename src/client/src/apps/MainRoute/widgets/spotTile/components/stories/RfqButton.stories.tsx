import React from 'react'
import { stories } from './Initialise.stories'
import { Story, Centered } from 'rt-storybook'
import TileBookingSwitch from '../PriceControls/TileBookingSwitch'
import { boolean, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { RfqState } from '../types'
import { currencyPair } from '../test-resources/spotTileProps'

stories.add('Rfq Button', () => {
  const rfqStates = {
    none: 'none',
    canRequest: 'canRequest',
    requested: 'requested',
    received: 'received',
    expired: 'expired',
  }
  const isTradeExecutionInFlight = boolean('isTradeExecutionInFlight', false)
  const hasUserError = boolean('hasUserError', false)
  const isAnalyticsView = boolean('isAnalyticsView', false)
  const rfqState = select('Rfq State', rfqStates, 'canRequest')
  const notional = 100000000
  const rfq = {
    request: action('request'),
    cancel: action('cancel'),
    reject: action('reject'),
    requote: action('requote'),
    expired: action('expired'),
    reset: action('reset'),
  }

  return (
    <Story>
      <Centered>
        <TileBookingSwitch
          isTradeExecutionInFlight={isTradeExecutionInFlight}
          currencyPair={currencyPair}
          notional={notional}
          rfq={rfq}
          rfqState={rfqState as RfqState}
          hasUserError={hasUserError}
          isAnalyticsView={isAnalyticsView}
        ></TileBookingSwitch>
      </Centered>
    </Story>
  )
})
