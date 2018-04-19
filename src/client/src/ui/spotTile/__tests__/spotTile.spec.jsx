/* tslint:disable */

import * as React from 'react'
import SpotTile from '../SpotTile'
import * as renderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

// replace with getSpotTileProps from storybook
const spotTileProps = {
  canPopout: true,
  currencyChartIsOpening: false,
  currencyPair: {
    symbol: 'GBP',
    base: 'GBP',
  },
  currentSpotPrice: {
    ask: getButtonProps('ask', () => undefined).rate,
    bid: getButtonProps('ask', () => undefined).rate,
    priceMovementType: 'Up',
    spread: {
      formattedValue: '-1.23',
    },
    valueDate: 1234436547,
  },
  executionConnected: true,
  hasNotification: false,
  isRunningInOpenFin: false,
  isTradeExecutionInFlight: false,
  maxNotional: 5000000,
  // notification: {
  //   error: null,
  //   notificationType: 'Trade',
  // },
  notional: 500,
  priceStale: false,
  title: 'GBP / USD',
}

function getButtonProps (type: string, action: any) {
  const classNameType = type === 'Sell' ? 'bid' : 'ask'

  return {
    className: `spot-tile__price spot-tile__price--${classNameType}`,
    direction: type,
    rate: {
      pips: 5,
      bigFigure: 100,
      pipFraction: 8,
      rawRate: 123,
    },
    onExecute: action('buy clicked'),
  }
}

test('SpotTile renders correct markup', () => {
  const shallowRenderer = new ShallowRenderer()
  shallowRenderer.render(
    <SpotTile {...spotTileProps} />
  )

  expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
})
