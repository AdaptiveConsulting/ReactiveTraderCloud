import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'rt-theme'
import '../globals'
import Analytics from './Analytics'

const stories = storiesOf('Analytics', module)

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const props: any = {
  currencyPairs: {
    EURUSD: { symbol: 'EURUSD', ratePrecision: 5, pipsPosition: 4, base: 'EUR', terms: 'USD' },
    USDJPY: { symbol: 'USDJPY', ratePrecision: 3, pipsPosition: 2, base: 'USD', terms: 'JPY' },
    GBPUSD: { symbol: 'GBPUSD', ratePrecision: 5, pipsPosition: 4, base: 'GBP', terms: 'USD' },
    GBPJPY: { symbol: 'GBPJPY', ratePrecision: 3, pipsPosition: 2, base: 'GBP', terms: 'JPY' },
    EURAUD: { symbol: 'EURAUD', ratePrecision: 5, pipsPosition: 4, base: 'EUR', terms: 'AUD' },
    AUDUSD: { symbol: 'AUDUSD', ratePrecision: 5, pipsPosition: 4, base: 'AUD', terms: 'USD' },
    NZDUSD: { symbol: 'NZDUSD', ratePrecision: 5, pipsPosition: 4, base: 'NZD', terms: 'USD' },
    EURJPY: { symbol: 'EURJPY', ratePrecision: 3, pipsPosition: 2, base: 'EUR', terms: 'JPY' },
    EURCAD: { symbol: 'EURCAD', ratePrecision: 5, pipsPosition: 4, base: 'EUR', terms: 'CAD' }
  },
  canPopout: false,
  isConnected: true,
  pnlChartModel: {
    seriesData: [
      { x: '2018-08-29T16:45:30.174Z', y: '48418548.34' },
      { x: '2018-08-29T16:45:40.174Z', y: '48423635.17' },
      { x: '2018-08-29T16:45:50.174Z', y: '48421739.73' },
      { x: '2018-08-29T16:46:00.174Z', y: '48415936.17' },
      { x: '2018-08-29T16:46:10.173Z', y: '48415575.98' },
      { x: '2018-08-29T16:46:20.172Z', y: '48420664.03' },
      { x: '2018-08-29T16:46:30.175Z', y: '48419229.79' },
      { x: '2018-08-29T16:46:40.174Z', y: '48416353.76' },
      { x: '2018-08-29T16:46:50.175Z', y: '48412598.08' },
      { x: '2018-08-29T16:47:00.174Z', y: '48412190.43' },
      { x: '2018-08-29T16:47:10.240Z', y: '48409075.53' },
      { x: '2018-08-29T16:47:20.173Z', y: '48402660.96' },
      { x: '2018-08-29T16:47:30.172Z', y: '48407194.89' },
      { x: '2018-08-29T16:47:40.173Z', y: '48409557.44' },
      { x: '2018-08-29T16:47:50.173Z', y: '48411418.61' },
      { x: '2018-08-29T16:48:00.173Z', y: '48412415.93' },
      { x: '2018-08-29T16:48:10.173Z', y: '48424377.07' },
      { x: '2018-08-29T16:48:20.173Z', y: '48427527.23' },
      { x: '2018-08-29T16:48:30.174Z', y: '48430510.96' },
      { x: '2018-08-29T16:48:40.173Z', y: '48423551.52' },
      { x: '2018-08-29T16:48:50.172Z', y: '48435729.74' },
      { x: '2018-08-29T16:49:00.173Z', y: '48433966.00' },
      { x: '2018-08-29T16:49:10.172Z', y: '48417628.01' },
      { x: '2018-08-29T16:49:20.174Z', y: '48413845.90' },
      { x: '2018-08-29T16:49:30.174Z', y: '48415158.54' },
      { x: '2018-08-29T16:49:40.190Z', y: '48409506.45' },
      { x: '2018-08-29T16:49:50.173Z', y: '48404418.48' },
      { x: '2018-08-29T16:50:00.172Z', y: '48397095.48' },
      { x: '2018-08-29T16:50:10.172Z', y: '48398814.59' },
      { x: '2018-08-29T16:50:20.174Z', y: '48393515.18' },
      { x: '2018-08-29T16:50:30.173Z', y: '48399759.98' },
      { x: '2018-08-29T16:50:40.172Z', y: '48399060.18' },
      { x: '2018-08-29T16:50:50.173Z', y: '48404951.79' },
      { x: '2018-08-29T16:51:00.173Z', y: '48412804.15' },
      { x: '2018-08-29T16:51:10.173Z', y: '48402276.54' },
      { x: '2018-08-29T16:51:20.176Z', y: '48395954.85' },
      { x: '2018-08-29T16:51:30.173Z', y: '48387281.09' },
      { x: '2018-08-29T16:51:40.173Z', y: '48389023.49' },
      { x: '2018-08-29T16:51:50.173Z', y: '48393968.95' },
      { x: '2018-08-29T16:52:00.174Z', y: '48394484.06' },
      { x: '2018-08-29T16:52:10.174Z', y: '48390724.83' },
      { x: '2018-08-29T16:52:20.173Z', y: '48393869.27' },
      { x: '2018-08-29T16:52:30.173Z', y: '48385970.24' },
      { x: '2018-08-29T16:52:40.173Z', y: '48382583.49' },
      { x: '2018-08-29T16:52:50.173Z', y: '48372274.70' },
      { x: '2018-08-29T16:53:00.173Z', y: '48368677.42' },
      { x: '2018-08-29T16:53:10.173Z', y: '48364278.15' },
      { x: '2018-08-29T16:53:20.176Z', y: '48360333.56' },
      { x: '2018-08-29T16:53:30.173Z', y: '48361039.38' },
      { x: '2018-08-29T16:53:40.173Z', y: '48353822.61' },
      { x: '2018-08-29T16:53:50.173Z', y: '48349792.58' },
      { x: '2018-08-29T16:54:00.174Z', y: '48351979.25' },
      { x: '2018-08-29T16:54:10.174Z', y: '48356254.62' },
      { x: '2018-08-29T16:54:20.174Z', y: '48370514.95' },
      { x: '2018-08-29T16:54:30.172Z', y: '48369573.69' },
      { x: '2018-08-29T16:54:40.173Z', y: '48372685.18' },
      { x: '2018-08-29T16:54:50.172Z', y: '48374956.48' },
      { x: '2018-08-29T16:55:00.173Z', y: '48375353.93' },
      { x: '2018-08-29T16:55:10.173Z', y: '48379946.87' },
      { x: '2018-08-29T16:55:20.173Z', y: '48379005.26' },
      { x: '2018-08-29T16:55:30.173Z', y: '48383880.28' },
      { x: '2018-08-29T16:55:40.173Z', y: '48384226.06' },
      { x: '2018-08-29T16:55:50.174Z', y: '48380073.41' },
      { x: '2018-08-29T16:56:00.173Z', y: '48370032.80' },
      { x: '2018-08-29T16:56:10.173Z', y: '48374031.75' },
      { x: '2018-08-29T16:56:20.173Z', y: '48372061.97' },
      { x: '2018-08-29T16:56:30.173Z', y: '48369943.77' },
      { x: '2018-08-29T16:56:40.173Z', y: '48375735.06' },
      { x: '2018-08-29T16:56:50.172Z', y: '48386415.43' },
      { x: '2018-08-29T16:57:00.174Z', y: '48391594.34' },
      { x: '2018-08-29T16:57:10.174Z', y: '48377214.27' },
      { x: '2018-08-29T16:57:20.173Z', y: '48377034.65' },
      { x: '2018-08-29T16:57:30.172Z', y: '48381564.67' },
      { x: '2018-08-29T16:57:40.172Z', y: '48373019.17' },
      { x: '2018-08-29T16:57:50.174Z', y: '48365747.82' },
      { x: '2018-08-29T16:58:00.174Z', y: '48363649.18' },
      { x: '2018-08-29T16:58:10.173Z', y: '48366516.14' },
      { x: '2018-08-29T16:58:20.172Z', y: '48369237.03' },
      { x: '2018-08-29T16:58:30.172Z', y: '48373531.24' },
      { x: '2018-08-29T16:58:40.174Z', y: '48367818.51' },
      { x: '2018-08-29T16:58:50.174Z', y: '48371625.74' },
      { x: '2018-08-29T16:59:00.172Z', y: '48376137.33' },
      { x: '2018-08-29T16:59:10.174Z', y: '48373897.04' },
      { x: '2018-08-29T16:59:20.173Z', y: '48375677.18' },
      { x: '2018-08-29T16:59:30.174Z', y: '48379780.65' },
      { x: '2018-08-29T16:59:40.173Z', y: '48382562.94' },
      { x: '2018-08-29T16:59:50.172Z', y: '48381427.45' },
      { x: '2018-08-29T17:00:00.173Z', y: '48386313.71' },
      { x: '2018-08-29T17:00:10.246Z', y: '48384113.22' },
      { x: '2018-08-29T17:00:20.173Z', y: '48384501.58' }
    ],
    lastPos: '48384501.58',
    minPnl: 0,
    maxPnl: 48435729.74,
    options: {
      xAxis: {},
      yAxis: {},
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: { left: 0, top: 0, right: 0, bottom: 0 }
    }
  },
  positionsChartModel: {
    seriesData: [
      {
        symbol: 'EURUSD',
        basePnl: 785577.915612354,
        baseTradedAmount: 1000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'USDJPY',
        basePnl: 1462492.5923487192,
        baseTradedAmount: 1000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'GBPUSD',
        basePnl: -26390.987863709255,
        baseTradedAmount: 12000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'EURJPY',
        basePnl: -113173.18142637635,
        baseTradedAmount: -5000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'AUDUSD',
        basePnl: 63738605.40001099,
        baseTradedAmount: 6000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'NZDUSD',
        basePnl: -198769.7610840366,
        baseTradedAmount: 0,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'EURCAD',
        basePnl: -31847.090799954138,
        baseTradedAmount: 43000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      },
      {
        symbol: 'EURAUD',
        basePnl: -5341.076340097365,
        baseTradedAmount: 18000000,
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount'
      }
    ],
    options: {
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      showValues: true,
      showControls: false,
      width: 900,
      tooltip: { enabled: false },
      margin: { top: 0, right: 0, bottom: 0 }
    },
    yAxisValuePropertyName: 'baseTradedAmount'
  }
}

stories.add('Default', () => (
  <Story>
    <Centered>
      <div style={{ height: '100%', width: '350px' }}>
        <Analytics {...props} />
      </div>
    </Centered>
  </Story>
))
