import React, { FC } from 'react'
import { spotDateFormatter } from '../../model/dateUtils'
import AnalyticsPriceControl from './AnalyticsTilePriceControl'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'
import { usePlatform } from 'rt-components'
import { getDefaultNotionalValue } from '../Tile/TileBusinessLogic'
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
      spotTileData: { isTradeExecutionInFlight, price, historicPrices, rfqState },
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
    const { isRfqStateExpired, isRfqStateCanRequest, isRfqStateNone } = getConstsFromRfqState(
      rfqState,
    )
    const showResetButton =
      !isTradeExecutionInFlight &&
      getDefaultNotionalValue(currencyPair) !== notional &&
      (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)

    return (
      <AnalyticsWrapperWithPlatform>
        <AnalyticsTileStyle
          className="spot-tile"
          data-qa="analytics-tile__spot-tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <TileHeader ccyPair={currencyPair} date={date} />
          <AnalyticsTileContent>
            <GraphNotionalWrapper>
              <LineChartWrapper>
                <AnalyticsTileChart history={historicPrices} />
              </LineChartWrapper>
              <NotionalInput
                notional={notional}
                currencyPairBase={currencyPair.base}
                currencyPairSymbol={currencyPair.symbol}
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
              rfqState={rfqState}
            />
          </AnalyticsTileContent>
        </AnalyticsTileStyle>
        {children}
      </AnalyticsWrapperWithPlatform>
    )
  }
}

export default AnalyticsTile
