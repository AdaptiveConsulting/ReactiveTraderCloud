import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import {
  ExecuteTradeRequest,
  SpotTileData,
  createTradeRequest,
  DEFAULT_NOTIONAL,
  TradeRequest,
} from '../model/index'
import SpotTile from './SpotTile'
import numeral from 'numeral'
import { AnalyticsTile } from './analyticsTile'
import { TileViews } from '../../workspace/workspaceHeader'
import { RfqState } from './types'
import { convertNotionalShorthandToNumericValue } from './notional/utils'
import { ValidationMessage } from './notional/NotionalInput'

// These const are related to business logic.
// Will pass them to NotionalInput component
// as props if needed.
const MAX_NOTIONAL_VALUE = 1000000000
const MIN_RFQ_VALUE = 10000000
const DEFAULT_NOTIONAL_VALUE = '1000000'
export const RESET_NOTIONAL_VALUE = DEFAULT_NOTIONAL_VALUE

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: TileViews
  children: ({ rfqState }: { rfqState: RfqState }) => JSX.Element
}

interface State {
  notional: string
  tradingDisabled: boolean
  rfqState: RfqState
  inputValidationMessage: ValidationMessage
}

export const isInvalidTradingValue = (value: string) =>
  value === '.' ||
  value === '0' ||
  value === '.0' ||
  value === '0.' ||
  value === '' ||
  value === 'Infinity' ||
  value === 'NaN'

class Tile extends React.PureComponent<Props, State> {
  state: State = {
    notional: DEFAULT_NOTIONAL_VALUE,
    tradingDisabled: false,
    rfqState: 'none',
    inputValidationMessage: null,
  }

  tileComponents = {
    [TileViews.Normal]: SpotTile,
    [TileViews.Analytics]: AnalyticsTile,
  }

  executeTrade = (direction: Direction, rawSpotRate: number) => {
    const { currencyPair, executeTrade } = this.props
    const notional = this.getNotional()
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate,
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  getNotional = () => numeral(this.state.notional).value() || DEFAULT_NOTIONAL

  // TODO Business logic here
  updateNotional = (value: string | null) => {
    console.log('updateNotional', value)
    const { inputValidationMessage, tradingDisabled } = this.state
    const numericValue = convertNotionalShorthandToNumericValue(value)

    if (value === null) {
      this.setState({
        notional: RESET_NOTIONAL_VALUE,
        inputValidationMessage: null,
        tradingDisabled: true,
      })
    } else if (isInvalidTradingValue(value)) {
      this.setState({
        notional: value,
        inputValidationMessage: null,
        tradingDisabled: true,
      })
    } else if (numericValue >= MIN_RFQ_VALUE && numericValue < MAX_NOTIONAL_VALUE) {
      this.setState({
        notional: value,
        inputValidationMessage: null,
        // rfqState: 'canRequest'
        tradingDisabled: true,
      })
    } else if (numericValue >= MAX_NOTIONAL_VALUE) {
      // if entered value bigger than max, show message error.
      console.log('numericValue >= MAX_NOTIONAL_VALUE', numericValue >= MAX_NOTIONAL_VALUE)
      this.setState({
        notional: value,
        inputValidationMessage: { type: 'error', content: 'Max exceeded' },
        tradingDisabled: true,
      })
    } else if (inputValidationMessage || tradingDisabled) {
      // all value checks have passed
      // if Buy/Sell buttons are disabled (tradingDisabled)
      // and/or error message is shown from previous check
      // enable buttons and remove message error.
      this.setState({
        notional: value,
        inputValidationMessage: null,
        tradingDisabled: false,
      })
    }
  }

  get canExecute() {
    const { spotTileData, executionStatus } = this.props
    const { rfqState, tradingDisabled } = this.state

    return Boolean(
      !tradingDisabled &&
        rfqState !== 'canRequest' &&
        executionStatus === ServiceConnectionStatus.CONNECTED &&
        !spotTileData.isTradeExecutionInFlight &&
        spotTileData.price,
    )
  }

  render() {
    const { children, currencyPair, spotTileData, executionStatus, tileView } = this.props
    const { notional, rfqState, inputValidationMessage, tradingDisabled } = this.state
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
        tradingDisabled={tradingDisabled}
      >
        {children({ rfqState })}
      </TileViewComponent>
    )
  }
}

export default Tile
