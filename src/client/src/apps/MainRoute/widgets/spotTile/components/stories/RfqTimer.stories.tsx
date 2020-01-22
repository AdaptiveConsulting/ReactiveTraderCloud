import React from 'react'
import { stories } from './Initialise.stories'
import { Story, Centered } from 'rt-storybook'
import RfqTimer from '../RfqTimer'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

stories.add('Rfq TImer', () => {
  const isAnalyticsView = boolean('Analytic View', false)
  const rfqTimeout = 10000
  const rfqReceivedTime = Date.now()
  const rfq = {
    request: action('request'),
    cancel: action('cancel'),
    reject: action('reject'),
    requote: action('requote'),
    expired: action('expired'),
    reset: action('reset'),
  }
  const currencyPair = {
    symbol: 'USDYAN',
    ratePrecision: 1.5,
    pipsPosition: 1.0,
    base: 'USD',
    terms: 'YAN',
  }
  const handleRfqRejected = () => rfq.reject({ currencyPair })

  return (
    <Story>
      <Centered>
        <div
          style={{
            width: '320px',
          }}
        >
          <RfqTimer
            onRejected={handleRfqRejected}
            receivedTime={rfqReceivedTime}
            timeout={rfqTimeout}
            isAnalyticsView={isAnalyticsView}
          />
        </div>
      </Centered>
    </Story>
  )
})
