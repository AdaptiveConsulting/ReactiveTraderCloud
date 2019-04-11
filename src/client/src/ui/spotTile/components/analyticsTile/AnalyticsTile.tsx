import React, { FC } from 'react'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'
import { usePlatform } from 'rt-components'

import {
  AnalyticsTileStyle,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  AnalyticsTileWrapper,
} from './styled'
import { Props } from '../types'
import TileHeader from '../TileHeader'
import { getConstsFromRfqState } from '../../model/spotTileUtils'

const AnalyticsWrapperWithPlatform: FC = props => {
  const platform = usePlatform()
  return <AnalyticsTileWrapper {...props} platform={platform} />
}
class AnalyticsTile extends React.PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price, historicPrices, rfqState },
      notional,
      updateNotional,
      resetNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
    } = this.props
    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    const { isRfqStateExpired, isRfqStateCanRequest } = getConstsFromRfqState(rfqState)
    const showResetButton = isRfqStateCanRequest || isRfqStateExpired

    return (
      <AnalyticsWrapperWithPlatform>
        <AnalyticsTileStyle className="spot-tile">
          <TileHeader baseTerm={baseTerm} date={date} />
          <AnalyticsTileContent>
            <GraphNotionalWrapper>
              <LineChartWrapper>
                <AnalyticsTileChart history={historicPrices} />
              </LineChartWrapper>
              <NotionalInput
                notional={notional}
                currencyPairSymbol={currencyPair.base}
                updateNotional={updateNotional}
                resetNotional={resetNotional}
                validationMessage={inputValidationMessage}
                showResetButton={showResetButton}
                disabled={inputDisabled}
              />
            </GraphNotionalWrapper>
            <AnalyticsPriceControl
              executeTrade={executeTrade}
              priceData={price}
              currencyPair={currencyPair}
              disabled={tradingDisabled}
            />
          </AnalyticsTileContent>
        </AnalyticsTileStyle>
        {children}
      </AnalyticsWrapperWithPlatform>
    )
  }
}

export default AnalyticsTile
