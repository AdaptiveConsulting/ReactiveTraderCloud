import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { AnalyticsTile } from './analyticsTile'
import { TileViews } from '../../workspace/workspaceHeader'
import { TileSwitchChildrenProps, TradingMode, RfqActions } from './types'
import { ValidationMessage, NotionalUpdate } from './notional/NotionalInput'
import {
  getDefaultNotionalValue,
  getDerivedStateFromProps,
  getNumericNotional,
  getDerivedStateFromUserInput,
  resetNotional,
  isValueInRfqRange,
} from './TileBusinessLogic'
import { getConstsFromRfqState } from '../model/spotTileUtils'

export interface TileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  setTradingMode: (tradingMode: TradingMode) => void
  tileView?: TileViews
  children: ({ notional, userError }: TileSwitchChildrenProps) => JSX.Element
  rfq: RfqActions
}

export interface TileState {
  notional: string
  inputDisabled: boolean
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  canExecute: boolean
}

class Tile extends React.PureComponent<TileProps, TileState> {
  state: TileState = {
    notional: getDefaultNotionalValue(this.props.currencyPair),
    inputValidationMessage: null,
    inputDisabled: false,
    tradingDisabled: false,
    canExecute: true,
  }

  tileComponents = {
    [TileViews.Normal]: SpotTile,
    [TileViews.Analytics]: AnalyticsTile,
  }

  // State management derived from props
  static getDerivedStateFromProps(nextProps: TileProps, prevState: TileState) {
    return getDerivedStateFromProps(nextProps, prevState)
  }

  // We handle the case where the initial Notional value would
  // be in the RFQ range.
  componentDidMount() {
    const {
      spotTileData: { rfqState },
      setTradingMode,
      currencyPair: { symbol },
    } = this.props
    const { notional } = this.state
    const { isRfqStateNone } = getConstsFromRfqState(rfqState)

    if (isRfqStateNone && isValueInRfqRange(notional)) {
      setTradingMode({ symbol, mode: 'rfq' })
    }
  }

  executeTrade = (direction: Direction, rawSpotRate: number) => {
    const {
      currencyPair,
      executeTrade,
      rfq,
      spotTileData: { rfqState },
    } = this.props
    const { notional } = this.state
    const { isRfqStateReceived } = getConstsFromRfqState(rfqState)
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional: getNumericNotional(notional),
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))

    // After executing the trade we need to
    // reset our RFQ state if necessary.
    if (isRfqStateReceived) {
      rfq.reset({ currencyPair })
    }
  }

  // State management derived from user input
  updateNotional = (notionalUpdate: NotionalUpdate) => {
    const { setTradingMode, spotTileData } = this.props
    this.setState(prevState =>
      getDerivedStateFromUserInput({
        prevState,
        notionalUpdate,
        spotTileData,
        actions: { setTradingMode },
      }),
    )
  }

  resetNotional = () => {
    const { setTradingMode, spotTileData, currencyPair } = this.props
    this.setState(prevState =>
      resetNotional({
        prevState,
        spotTileData,
        actions: { setTradingMode },
        currencyPair,
      }),
    )
  }

  render() {
    const { children, currencyPair, spotTileData, executionStatus, tileView, rfq } = this.props
    const {
      notional,
      inputDisabled,
      inputValidationMessage,
      tradingDisabled,
      canExecute,
    } = this.state
    const { rfqState } = spotTileData
    const { isRfqStateCanRequest, isRfqStateNone } = getConstsFromRfqState(rfqState)

    const TileViewComponent =
      tileView && (isRfqStateNone || isRfqStateCanRequest)
        ? this.tileComponents[tileView]
        : SpotTile

    return (
      <TileViewComponent
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        executeTrade={this.executeTrade}
        executionStatus={executionStatus}
        notional={notional}
        updateNotional={this.updateNotional}
        resetNotional={this.resetNotional}
        inputDisabled={inputDisabled}
        inputValidationMessage={inputValidationMessage}
        tradingDisabled={tradingDisabled || !canExecute}
        rfq={rfq}
      >
        {children({
          notional,
          userError: Boolean(inputValidationMessage),
        })}
      </TileViewComponent>
    )
  }
}

export default Tile
