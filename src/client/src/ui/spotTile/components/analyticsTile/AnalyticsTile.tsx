import React from 'react'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../../model'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'

import {
  AnalyticsTileWrapper,
  AnalyticsTileStyle,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
} from './styled'

import TileHeader from '../TileHeader'
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
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    return (
      <AnalyticsTileWrapper className="spot-tile">
        <AnalyticsTileStyle>
          <TileHeader baseTerm={baseTerm} date={date} />
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
        </AnalyticsTileStyle>
        {this.props.children}
      </AnalyticsTileWrapper>
    )
  }
}

export default AnalyticsTile
