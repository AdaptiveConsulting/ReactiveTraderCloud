import React from 'react'
import { renderWithTheme } from '../../../../../../../__tests__/helpers'
import Tile, { TileProps, TileState } from './Tile'
import { currencyPair } from '../test-resources/spotTileProps'
import { ServiceConnectionStatus } from 'rt-types'
import { TileViews } from '../../../workspace/workspaceHeader'
import { DerivedStateFromUserInput } from './TileBusinessLogic'
import { TradingMode } from '../types'
import { PriceMovementTypes } from '../../model/priceMovementTypes'

const prevState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: null,
  notional: '1,000,000',
  tradingDisabled: false,
}

const defaultParams: DerivedStateFromUserInput = {
  actions: {
    setTradingMode: (tradingMode: TradingMode) => {},
  },
  prevState,
  notionalUpdate: {
    type: 'blur',
    value: '1,000,000',
  },
  spotTileData: {
    currencyChartIsOpening: false,
    historicPrices: [],
    isTradeExecutionInFlight: false,
    lastTradeExecutionStatus: null,
    price: {
      ask: 1.48364,
      bid: 1.4835,
      creationTimestamp: 694779224112175,
      mid: 1.48357,
      priceMovementType: 'Down' as PriceMovementTypes,
      symbol: 'EURCAD',
      valueDate: '2019-04-07T00:00:00Z',
    },
    rfqPrice: null,
    rfqState: 'none',
    rfqTimeout: null,
  },
  currencyPair,
}

const defaultTileProps: TileProps = {
  children: jest.fn(),
  currencyPair,
  executeTrade: () => {},
  setTradingMode: () => {},
  executionStatus: 'CONNECTED' as ServiceConnectionStatus,
  rfq: {
    cancel: () => {},
    expired: () => {},
    reject: () => {},
    request: () => {},
    requote: () => {},
    reset: () => {},
  },
  spotTileData: defaultParams.spotTileData,
  tileView: 'Normal' as TileViews,
}

test('Snapshot, state derived from props, defaults, RFQ none, should be able to excute', () => {
  const component = renderWithTheme(<Tile {...defaultTileProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, DISCONNECTED', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    executionStatus: 'DISCONNECTED' as ServiceConnectionStatus,
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, in trade', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      isTradeExecutionInFlight: true,
    },
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, RFQ requested', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'requested',
    },
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, RFQ received', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'received',
      rfqPrice: {
        ask: 1.48364,
        bid: 1.4835,
        creationTimestamp: 694779224112175,
        mid: 1.48357,
        priceMovementType: 'Down' as PriceMovementTypes,
        symbol: 'EURCAD',
        valueDate: '2019-04-07T00:00:00Z',
      },
    },
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, RFQ canRequest', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'canRequest',
    },
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, RFQ expired', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'expired',
      rfqPrice: {
        ask: 1.48364,
        bid: 1.4835,
        creationTimestamp: 694779224112175,
        mid: 1.48357,
        priceMovementType: 'Down' as PriceMovementTypes,
        symbol: 'EURCAD',
        valueDate: '2019-04-07T00:00:00Z',
      },
    },
  }
  const component = renderWithTheme(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
