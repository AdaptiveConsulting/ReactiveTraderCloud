import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import {
  ExecuteTradeRequest,
  SpotTileData,
  createTradeRequest,
  TradeRequest,
} from '../../model/index'
import SpotTile from '../SpotTile'
import { AnalyticsTile } from '../analyticsTile/index'
import { TileViews } from '../../../workspace/workspaceHeader/index'
import { TileSwitchChildrenProps, TradingMode, RfqActions } from '../types'
import { ValidationMessage } from '../notional'
import {
  getDefaultInitialNotionalValue,
  getDerivedStateFromProps,
  getDerivedStateFromUserInput,
  isValueInRfqRange,
} from './TileBusinessLogic'
import { getConstsFromRfqState } from '../../model/spotTileUtils'
import { CurrencyPairNotional } from '../../model/spotTileData'

export interface TileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  setTradingMode: (tradingMode: TradingMode) => void
  displayCurrencyChart?: () => void
  tileView?: TileViews
  children: ({ notional, userError }: TileSwitchChildrenProps) => JSX.Element
  rfq: RfqActions
  updateNotional: (notionalUpdate: CurrencyPairNotional) => void
}

export interface TileState {
  inputDisabled: boolean
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  canExecute: boolean
}

class Tile extends React.PureComponent<TileProps, TileState> {
  state: TileState = {
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
    const { setTradingMode, spotTileData, currencyPair } = nextProps
    const stateFromProps = getDerivedStateFromProps(nextProps, prevState)
    return getDerivedStateFromUserInput({
      prevState: stateFromProps,
      spotTileData,
      actions: { setTradingMode },
      currencyPair,
    })
  }

  // We handle the case where the initial Notional value would
  // be in the RFQ range.
  componentDidMount() {
    const {
      spotTileData: { notional, rfqState },
      setTradingMode,
      currencyPair: { symbol },
    } = this.props
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
      spotTileData: { notional, rfqState },
    } = this.props
    const { isRfqStateReceived } = getConstsFromRfqState(rfqState)
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))

    // After executing the trade we need to
    // reset our RFQ state if necessary.
    if (isRfqStateReceived) {
      rfq.reset({ currencyPair })
    }
  }

  updateNotional = (notional: number) => {
    const { currencyPair, updateNotional } = this.props

    updateNotional({
      currencyPair: currencyPair.symbol,
      notional,
    })
  }

  resetNotional = () => {
    const { setTradingMode, currencyPair, updateNotional } = this.props
    const defaultNotional = getDefaultInitialNotionalValue(currencyPair)
    const isInRfqRange = isValueInRfqRange(defaultNotional)
    setTradingMode({ symbol: currencyPair.symbol, mode: isInRfqRange ? 'rfq' : 'esp' })
    updateNotional({
      currencyPair: currencyPair.symbol,
      notional: defaultNotional,
    })
  }

  render() {
    const {
      children,
      currencyPair,
      spotTileData,
      executionStatus,
      tileView,
      rfq,
      displayCurrencyChart,
    } = this.props
    const { inputDisabled, inputValidationMessage, tradingDisabled, canExecute } = this.state
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
        updateNotional={this.updateNotional}
        resetNotional={this.resetNotional}
        inputDisabled={inputDisabled}
        inputValidationMessage={inputValidationMessage}
        tradingDisabled={tradingDisabled || !canExecute}
        rfq={rfq}
        displayCurrencyChart={displayCurrencyChart}
      >
        {children({
          notional: spotTileData.notional,
          userError: Boolean(inputValidationMessage),
        })}
      </TileViewComponent>
    )
  }
}

export default Tile
