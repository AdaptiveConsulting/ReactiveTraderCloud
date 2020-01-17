import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import {
  createTradeRequest,
  ExecuteTradeRequest,
  SpotTileDataWithNotional,
  TradeRequest,
} from '../../model'
import SpotTile from '../SpotTile'
import { AnalyticsTile } from '../analyticsTile/index'
import { TileViews } from '../../../workspace/workspaceHeader'
import { RfqActions, TradingMode } from '../types'
import { ValidationMessage } from '../notional'
import {
  getDefaultNotionalValue,
  getDerivedStateFromProps,
  getDerivedStateFromUserInput,
  isValueInRfqRange,
} from './TileBusinessLogic'
import { getConstsFromRfqState } from '../../model/spotTileUtils'
import { CurrencyPairNotional } from '../../model/spotTileData'

export interface TileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileDataWithNotional
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  setTradingMode: (tradingMode: TradingMode) => void
  displayCurrencyChart?: () => void
  tileView?: TileViews
  children: () => JSX.Element
  rfq: RfqActions
  updateNotional: (notionalUpdate: CurrencyPairNotional) => void
}

export interface TileState {
  inputDisabled: boolean
  inputValidationMessage?: ValidationMessage
  canExecute: boolean
}

class Tile extends React.PureComponent<TileProps, TileState> {
  state: TileState = {
    inputValidationMessage: undefined,
    inputDisabled: false,
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
    if (typeof notional === 'undefined') {
      console.error(`Error executing trade with no notional`)
      return
    }
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

  // TODO: it looks like this should be moved to a reducer or epic. There should be an
  // action called ResetNotional and all logic below should be there
  resetNotional = () => {
    const { setTradingMode, currencyPair, updateNotional } = this.props
    const defaultNotional = getDefaultNotionalValue(currencyPair)
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
    const { inputDisabled, inputValidationMessage, canExecute } = this.state
    const TileViewComponent = tileView ? this.tileComponents[tileView] : SpotTile

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
        tradingDisabled={!canExecute}
        rfq={rfq}
        displayCurrencyChart={displayCurrencyChart}
      >
        {children()}
      </TileViewComponent>
    )
  }
}

export default Tile
