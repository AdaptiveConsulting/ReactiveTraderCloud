import React from 'react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers'
import Tile, { TileProps, TileState } from './Tile'
import { currencyPair } from '../test-resources/spotTileProps'
import { ServiceConnectionStatus } from 'rt-types'
import { TileView } from '../../../workspace/workspaceHeader'
import { getDerivedStateFromUserInput } from './TileBusinessLogic'
import { TradingMode } from '../types'
import { PriceMovementTypes } from '../../model/priceMovementTypes'

const prevState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: undefined,
}

const defaultParams: Parameters<typeof getDerivedStateFromUserInput>[0] = {
  actions: {
    setTradingMode: (tradingMode: TradingMode) => {},
  },
  prevState,
  spotTileData: {
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
    rfqReceivedTime: null,
    notional: 1000000,
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
  tileView: 'Normal' as TileView,
  updateNotional: () => {},
}

test('Snapshot, state derived from props, defaults, RFQ none, should be able to excute', () => {
  const component = renderWithProviders(<Tile {...defaultTileProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Snapshot, state derived from props, DISCONNECTED', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    executionStatus: 'DISCONNECTED' as ServiceConnectionStatus,
  }
  const component = renderWithProviders(<Tile {...nextProps} />)
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
  const component = renderWithProviders(<Tile {...nextProps} />)
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
  const component = renderWithProviders(<Tile {...nextProps} />)
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
  const component = renderWithProviders(<Tile {...nextProps} />)
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
  const component = renderWithProviders(<Tile {...nextProps} />)
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
  const component = renderWithProviders(<Tile {...nextProps} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
