import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../../model'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'

import { SpotTileStyle } from '../SpotTile'
import {
  AnalyticsTileWrapper,
  Header,
  HeaderItem,
  HeaderItemSmall,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
} from './styled'

//TODO ML 07/01/2019 move this to another file
interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  notional: string
  updateNotional: (notional: string) => void
  canExecute: boolean
  chartData?: []
}

class AnalyticsTile extends React.PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price },
      notional,
      updateNotional,
      executeTrade,
      canExecute,
    } = this.props
    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    return (
      <AnalyticsTileWrapper className="spot-tile">
        <SpotTileStyle>
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
                updateNotional={updateNotional}
              />
            </GraphNotionalWrapper>
            <AnalyticsPriceControl
              executeTrade={executeTrade}
              priceData={price}
              currencyPair={currencyPair}
              disabled={canExecute}
            />
          </AnalyticsTileContent>
        </SpotTileStyle>
        {this.props.children}
      </AnalyticsTileWrapper>
    )
  }
}

export default AnalyticsTile
