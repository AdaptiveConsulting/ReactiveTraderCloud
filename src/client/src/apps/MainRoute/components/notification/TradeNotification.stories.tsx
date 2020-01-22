import React from 'react'
import { action } from '@storybook/addon-actions'
import { Story, Centered } from 'rt-storybook'
import { TileSwitch } from 'apps/MainRoute/widgets/spotTile/components'
import { ServiceConnectionStatus } from 'rt-types'
import {
  spotTileData,
  tradeExecuted,
  tradeRejected,
} from 'apps/MainRoute/widgets/spotTile/components/test-resources/spotTileProps'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('Trade Notification', module)

const onNotificationDismissedClick = action('Notification dismissed')
const executeTrade = action('executeTrade')
const setTradingMode = action('setTradingMode')
const onPopoutClick = action('On popout click')
const displayCurrencyChart = action('On currency chart click')
const updateNotional = action('update notional')

const rfqActions = {
  request: action('request'),
  cancel: action('cancel'),
  reject: action('reject'),
  requote: action('requote'),
  expired: action('expired'),
  reset: action('reset'),
}

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD',
}

stories.add('Executed', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <TileSwitch
          canPopout
          executionStatus={ServiceConnectionStatus.CONNECTED}
          onNotificationDismissed={onNotificationDismissedClick}
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, lastTradeExecutionStatus: tradeExecuted }}
          executeTrade={executeTrade}
          onPopoutClick={onPopoutClick}
          setTradingMode={setTradingMode}
          rfq={rfqActions}
          displayCurrencyChart={displayCurrencyChart}
          updateNotional={updateNotional}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Rejected', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <TileSwitch
          canPopout
          executionStatus={ServiceConnectionStatus.CONNECTED}
          onNotificationDismissed={onNotificationDismissedClick}
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, lastTradeExecutionStatus: tradeRejected }}
          executeTrade={executeTrade}
          onPopoutClick={onPopoutClick}
          setTradingMode={setTradingMode}
          rfq={rfqActions}
          displayCurrencyChart={displayCurrencyChart}
          updateNotional={updateNotional}
        />
      </div>
    </Centered>
  </Story>
))
