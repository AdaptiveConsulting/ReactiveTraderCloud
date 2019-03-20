import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { AnalyticsTile } from './analyticsTile'
import { TileViews } from '../../workspace/workspaceHeader'
import { RfqState } from './types'
import { ValidationMessage, NotionalUpdate } from './notional/NotionalInput'
import {
  getDefaultNotionalValue,
  getDerivedStateFromProps,
  getNumericNotional,
  getDerivedStateFromUserInput,
} from './TileBusinessLogic'

export interface TileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: TileViews
  children: ({ rfqState }: { rfqState: RfqState }) => JSX.Element
}

export interface TileState {
  notional: string
  tradingDisabled: boolean
  rfqState: RfqState
  inputValidationMessage: ValidationMessage
  canExecute: boolean
}

class Tile extends React.PureComponent<TileProps, TileState> {
  state: TileState = {
    notional: getDefaultNotionalValue(),
    tradingDisabled: false,
    rfqState: 'none',
    inputValidationMessage: null,
    canExecute: true,
  }

  tileComponents = {
    [TileViews.Normal]: SpotTile,
    [TileViews.Analytics]: AnalyticsTile,
  }

  static getDerivedStateFromProps(nextProps: TileProps, prevState: TileState) {
    return getDerivedStateFromProps(nextProps, prevState)
  }

  executeTrade = (direction: Direction, rawSpotRate: number) => {
    const { currencyPair, executeTrade } = this.props
    const { notional: notionalFromState } = this.state
    const notional = getNumericNotional(notionalFromState)
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  updateNotional = (notionalUpdate: NotionalUpdate) => {
    this.setState(prevState => getDerivedStateFromUserInput(prevState, notionalUpdate))
  }

  render() {
    const { children, currencyPair, spotTileData, executionStatus, tileView } = this.props
    const { notional, rfqState, inputValidationMessage, canExecute } = this.state
    const TileViewComponent = tileView ? this.tileComponents[tileView] : SpotTile

    return (
      <TileViewComponent
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        executeTrade={this.executeTrade}
        executionStatus={executionStatus}
        notional={notional}
        updateNotional={this.updateNotional}
        inputValidationMessage={inputValidationMessage}
        tradingDisabled={!canExecute}
      >
        {children({ rfqState })}
      </TileViewComponent>
    )
  }
}

export default Tile
