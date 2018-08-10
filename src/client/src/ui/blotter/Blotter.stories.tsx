import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'
import { Trade } from 'rt-types/trade'
import Blotter, { BlotterProps } from './components/Blotter'

const stories = storiesOf('Blotter', module)

const blotterRejectedRow: Trade = {
  dealtCurrency: 'GBP',
  direction: 'Sell',
  notional: 1000000,
  spotRate: 184.485,
  status: 'rejected',
  symbol: 'GBPJPY',
  tradeDate: new Date('Thu Jul 26 2018 13:29:30 GMT-0400 (Eastern Daylight Time)'),
  tradeId: 2340,
  traderName: 'CZA',
  valueDate: new Date('Sun Jul 29 2018 20:00:00 GMT-0400 (Eastern Daylight Time)')
}

const blotterSuccessRow: Trade = {
  dealtCurrency: 'EUR',
  direction: 'Sell',
  notional: 1000000,
  spotRate: 133.303,
  status: 'done',
  symbol: 'EURJPY',
  tradeDate: new Date('Thu Jul 26 2018 14:46:12 GMT-0400 (Eastern Daylight Time)'),
  tradeId: 2356,
  traderName: 'DOR',
  valueDate: new Date('Sun Jul 29 2018 20:00:00 GMT-0400 (Eastern Daylight Time)')
}

const blotterProps: BlotterProps = {
  rows: [
    blotterRejectedRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterRejectedRow,
    blotterRejectedRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterRejectedRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterRejectedRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterRejectedRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterSuccessRow,
    blotterRejectedRow
  ],
  onPopoutClick: action('onPopoutClick'),
  canPopout: true
}

stories.add('Default', () => (
  <Story>
    <div style={{ height: '460px', width: '100%' }}>
      <Blotter {...blotterProps} />
    </div>
  </Story>
))

stories.add('No Rows', () => (
  <Story>
    <div style={{ height: '460px', width: '100%' }}>
      <Blotter {...blotterProps} rows={[]} />
    </div>
  </Story>
))
