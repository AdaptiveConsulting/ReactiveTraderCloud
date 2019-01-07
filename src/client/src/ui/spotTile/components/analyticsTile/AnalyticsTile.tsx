import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData, createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from '../../model'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'
import numeral from 'numeral'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
}

export const AnalyticsTileWrapper = styled.div`
  background-color: #2f3542;
  position: relative;
  min-height: 10rem;
  height: 100%;
  padding: 10px;
`
const Header = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin-bottom: 10px;
`

const HeaderItem = styled.li`
  color: ${({ theme }) => theme.textColor};
  font-size: 13px;
`
const HeaderItemSmall = styled(HeaderItem)`
  font-size: 10px;
  opacity: 0.59;
`
const AnalyticsTileContent = styled.div`
  display: flex;
`
const GraphNotionalWrapper = styled.div`
  width: 80%;
  margin-right: 5px;
`

//TODO ML this has to go away
interface State {
  notional: string
}

const LineChartWrapper = styled.div`
  width: 100%;
  height: 80%;
`
class AnalyticsTile extends React.PureComponent<Props, State> {
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
  render() {
    const {
      currencyPair,
      spotTileData: { price },
    } = this.props
    const { notional } = this.state
    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    return (
      <AnalyticsTileWrapper className="spot-tile">
        <Header>
          <HeaderItem>{`${currencyPair.base}/${currencyPair.terms}`}</HeaderItem>
          <HeaderItemSmall>{spotDate && `SPT (${spotDate})`}</HeaderItemSmall>
        </Header>
        <AnalyticsTileContent>
          <GraphNotionalWrapper>
            <LineChartWrapper>
              <AnalyticsTileChart />
            </LineChartWrapper>
            <NotionalInput
              notional={notional}
              currencyPairSymbol={currencyPair.base}
              updateNotional={this.updateNotional}
            />
          </GraphNotionalWrapper>
          <AnalyticsPriceControl
            executeTrade={this.executeTrade}
            priceData={price}
            currencyPair={currencyPair}
            disabled={!this.canExecute()}
          />
        </AnalyticsTileContent>
      </AnalyticsTileWrapper>
    )
  }
}

export default AnalyticsTile
