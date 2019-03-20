import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'

const updateNotional = action('updateNotional')
const executeTrade = action('executeTrade')
const rfqInitiate = action('rfqInitiate')
const rfqCancel = action('rfqCancel')
const rfqRequote = action('rfqRequote')

stories.add('AnalyticsTile', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          notional="1,000,000"
          updateNotional={updateNotional}
          tradingDisabled={false}
          inputValidationMessage={null}
          inputDisabled={false}
          rfqInitiate={rfqInitiate}
          rfqCancel={rfqCancel}
          rfqRequote={rfqRequote}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('AnalyticsTile in error', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          notional="1,000,000"
          updateNotional={updateNotional}
          tradingDisabled={true}
          inputValidationMessage={null}
          inputDisabled={false}
          rfqInitiate={rfqInitiate}
          rfqCancel={rfqCancel}
          rfqRequote={rfqRequote}
        />
      </div>
    </Centered>
  </Story>
))
