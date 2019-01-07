import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from '../model/index'
import SpotTile from './SpotTile'
import { styled, ThemeProvider } from 'rt-theme'
// import { spotDateFormatter } from './model/dateUtils'

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
    const tileViewState: string = '125'
    const val = '10'
    const { currencyPair, spotTileData, executeTrade, executionStatus } = this.props
    switch (tileViewState) {
      case val:
        return (
          <SpotTile
            currencyPair={currencyPair}
            spotTileData={spotTileData}
            executeTrade={executeTrade}
            executionStatus={executionStatus}
            //TODO ML 07/01/2019 also add the notional function
          />
        )
      default:
        return <div>LaLO</div>
    }
  }
  render() {
    const { children } = this.props
    return (
      <ThemeProvider theme={theme => theme.tile}>
        <TileWrapper>
          {this.tileSwitch()}
          {children}
        </TileWrapper>
      </ThemeProvider>
    )
  }
}

export default Tile
