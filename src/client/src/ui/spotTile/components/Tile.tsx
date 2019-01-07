import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { styled, ThemeProvider } from 'rt-theme'
// import { spotDateFormatter } from './model/dateUtils'
import numeral from 'numeral'
import { AnalyticsTile } from './analyticsTile'

export const TileWrapper = styled('div')`
  position: relative;
  min-height: 10rem;
  height: 100%;
  color: ${({ theme }) => theme.tile.textColor};
`

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  tileView?: string
}

interface State {
  notional: string
}

class Tile extends React.Component<Props, State> {
  state = {
    notional: '1000000',
  }

  updateNotional = (notional: string) => this.setState({ notional })

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

  canExecute = () => {
    const { spotTileData, executionStatus } = this.props
    return Boolean(
      executionStatus === ServiceConnectionStatus.CONNECTED &&
        !spotTileData.isTradeExecutionInFlight &&
        spotTileData.price,
    )
  }

  //TODO ML 07/01/2019 change the name of this one
  tileSwitch = () => {
    const { currencyPair, spotTileData, executionStatus, tileView } = this.props
    const { notional } = this.state
    switch (tileView) {
      case 'Analytics':
        return (
          <AnalyticsTile
            currencyPair={currencyPair}
            spotTileData={spotTileData}
            executeTrade={this.executeTrade}
            executionStatus={executionStatus}
            notional={notional}
            updateNotional={this.updateNotional}
            canExecute={!this.canExecute()}
          >
            {this.props.children}
          </AnalyticsTile>
        )
      default:
        return (
          <SpotTile
            currencyPair={currencyPair}
            spotTileData={spotTileData}
            executeTrade={this.executeTrade}
            executionStatus={executionStatus}
            notional={notional}
            updateNotional={this.updateNotional}
            canExecute={!this.canExecute()}
          >
            {this.props.children}
          </SpotTile>
        )
    }
  }
  render() {
    return <ThemeProvider theme={theme => theme.tile}>{this.tileSwitch()}</ThemeProvider>
  }
}

export default Tile
