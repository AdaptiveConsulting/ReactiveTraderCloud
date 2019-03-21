import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { AnalyticsTile } from './analyticsTile'
import { TileViews } from '../../workspace/workspaceHeader'
import { RfqState, RfqStateManagement } from './types'
import { ValidationMessage, NotionalUpdate } from './notional/NotionalInput'
import {
  getDefaultNotionalValue,
  getDerivedStateFromProps,
  getNumericNotional,
  getDerivedStateFromUserInput,
  rfqRequote,
  rfqCancel,
  rfqInitiate,
} from './TileBusinessLogic'

export interface TileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: TileViews
  children: ({
    userError,
    rfqState,
    rfqInitiate,
    rfqCancel,
    rfqRequote,
  }: RfqStateManagement) => JSX.Element
}

export interface TileState {
  notional: string
  inputDisabled: boolean
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  rfqState: RfqState
  canExecute: boolean
}

class Tile extends React.PureComponent<TileProps, TileState> {
  state: TileState = {
    notional: getDefaultNotionalValue(),
    inputValidationMessage: null,
    inputDisabled: false,
    tradingDisabled: false,
    rfqState: 'none',
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
    const { notional } = this.state
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional: getNumericNotional(notional),
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  // TODO Maybe I don't need these in the class component
  rfqInitiate = () => {
    this.setState({ rfqState: 'requested' })
    rfqInitiate()
  }

  rfqCancel = () => {
    rfqCancel()
  }

  rfqRequote = () => {
    rfqRequote()
  }

  updateNotional = (notionalUpdate: NotionalUpdate) => {
    this.setState(prevState => getDerivedStateFromUserInput(prevState, notionalUpdate))
  }

  render() {
    const { children, currencyPair, spotTileData, executionStatus, tileView } = this.props
    const {
      notional,
      rfqState,
      inputDisabled,
      inputValidationMessage,
      tradingDisabled,
      canExecute,
    } = this.state
    const TileViewComponent = tileView ? this.tileComponents[tileView] : SpotTile

    return (
      <TileViewComponent
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        executeTrade={this.executeTrade}
        executionStatus={executionStatus}
        notional={notional}
        updateNotional={this.updateNotional}
        inputDisabled={inputDisabled}
        inputValidationMessage={inputValidationMessage}
        tradingDisabled={tradingDisabled || !canExecute}
        rfqInitiate={this.rfqInitiate}
        rfqCancel={this.rfqCancel}
        rfqRequote={this.rfqRequote}
      >
        {children({
          userError: Boolean(inputValidationMessage),
          rfqState,
          rfqInitiate: this.rfqInitiate,
          rfqCancel: this.rfqCancel,
          rfqRequote: this.rfqRequote,
        })}
      </TileViewComponent>
    )
  }
}

export default Tile
