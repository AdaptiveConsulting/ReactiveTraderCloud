import React from 'react'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'

import { AnalyticsTileStyle, AnalyticsTileContent, GraphNotionalWrapper, LineChartWrapper } from './styled'
import { TileWrapper } from '../styled'
import { Props } from '../types'
import TileHeader from '../TileHeader'

class AnalyticsTile extends React.PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price },
      notional,
      updateNotional,
      executeTrade,
      canExecute,
      children,
    } = this.props
    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    return (
      <TileWrapper className="spot-tile">
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
        {children}
      </TileWrapper>
    )
  }
}

export default AnalyticsTile
