import React, { FC } from 'react'
import { spotDateFormatter } from '../../model/dateUtils'
import PriceControls from '../PriceControls'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'
import { usePlatform } from 'rt-platforms'
import { getDefaultNotionalValue } from '../Tile/TileBusinessLogic'

import {
  AnalyticsTileStyle,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  AnalyticsTileWrapper,
  PriceControlWrapper,
} from './styled'
import { SpotTileProps } from '../types'
import TileHeader from '../TileHeader'
import { getConstsFromRfqState } from '../../model/spotTileUtils'
import RfqTimer from '../RfqTimer'

const AnalyticsWrapperWithPlatform: FC = props => {
  const platform = usePlatform()
  return <AnalyticsTileWrapper {...props} platform={platform} />
}
class AnalyticsTile extends React.PureComponent<SpotTileProps> {
  private handleRfqRejected = () => this.props.rfq.reject({ currencyPair: this.props.currencyPair })
  render() {
    const {
      currencyPair,
      spotTileData: {
        notional,
        isTradeExecutionInFlight,
        price,
        historicPrices,
        rfqState,
        rfqTimeout,
        rfqReceivedTime,
      },
      updateNotional,
      resetNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
      displayCurrencyChart,
      rfq,
    } = this.props
    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const {
      isRfqStateExpired,
      isRfqStateCanRequest,
      isRfqStateNone,
      isRfqStateReceived,
    } = getConstsFromRfqState(rfqState)
    const showResetButton =
      !isTradeExecutionInFlight &&
      getDefaultNotionalValue(currencyPair) !== notional &&
      (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)
    const showTimer = isRfqStateReceived && rfqTimeout
    const isTimerOn = Boolean(showTimer) && rfqTimeout !== null && rfqReceivedTime !== null

    return (
      <AnalyticsWrapperWithPlatform>
        <AnalyticsTileStyle
          className="spot-tile"
          data-qa="analytics-tile__spot-tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <TileHeader
            ccyPair={currencyPair}
            date={date}
            displayCurrencyChart={displayCurrencyChart}
          />
          <AnalyticsTileContent>
            <GraphNotionalWrapper>
              <LineChartWrapper isTimerOn={isTimerOn}>
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
              {showTimer && rfqTimeout !== null && rfqReceivedTime !== null && (
                <RfqTimer
                  onRejected={this.handleRfqRejected}
                  receivedTime={rfqReceivedTime}
                  timeout={rfqTimeout}
                  isAnalyticsView
                />
              )}
            </GraphNotionalWrapper>
            <PriceControlWrapper>
              <PriceControls
                isTradeExecutionInFlight={isTradeExecutionInFlight}
                executeTrade={executeTrade}
                priceData={price}
                currencyPair={currencyPair}
                disabled={tradingDisabled}
                rfqState={rfqState}
                isAnalyticsView={true}
                rfq={rfq}
                notional={notional}
              />
            </PriceControlWrapper>
          </AnalyticsTileContent>
        </AnalyticsTileStyle>
        {children}
      </AnalyticsWrapperWithPlatform>
    )
  }
}

export default AnalyticsTile
