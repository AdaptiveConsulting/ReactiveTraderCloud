import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import numeral from 'numeral'
import { AnalyticsTile } from './analyticsTile'
import { TileViews } from '../../workspace/workspaceHeader'
import { DEFAULT_NOTIONAL_VALUE } from './notional/NotionalInput'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: TileViews
}

interface State {
  notional: string
  disabled: boolean
}

class Tile extends React.PureComponent<Props, State> {
  state = {
    notional: DEFAULT_NOTIONAL_VALUE,
    disabled: false,
  }

  tileComponents = {
    [TileViews.Normal]: SpotTile,
    [TileViews.Analytics]: AnalyticsTile,
  }

  updateNotional = (notional: string) => this.setState({ notional })

  setDisabledTradingState = (disabled: boolean) => this.setState({ disabled })

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

  get canExecute() {
    const { spotTileData, executionStatus } = this.props

    return Boolean(
      executionStatus === ServiceConnectionStatus.CONNECTED &&
        !spotTileData.isTradeExecutionInFlight &&
        spotTileData.price,
    )
  }

  render() {
    const { currencyPair, spotTileData, executionStatus, tileView } = this.props
    const { notional, disabled } = this.state
    const TileViewComponent = tileView ? this.tileComponents[tileView] : SpotTile

    return (
      <TileViewComponent
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        executeTrade={this.executeTrade}
        executionStatus={executionStatus}
        notional={notional}
        updateNotional={this.updateNotional}
        setDisabledTradingState={this.setDisabledTradingState}
        disabled={disabled || !this.canExecute}
      >
        {this.props.children}
      </TileViewComponent>
    )
  }
}

export default Tile
