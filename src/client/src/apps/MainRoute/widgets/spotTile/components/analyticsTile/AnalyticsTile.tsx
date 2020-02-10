import React, { FC } from 'react'
import { DateTime, Info } from 'luxon'
import { usePlatform } from 'rt-platforms'
import { memoDateFormatter } from '../../model/dateUtils'
import PriceControls from '../PriceControls'
import NotionalInput from '../notional'
import AnalyticsTileChart from './AnalyticsTileChart'
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

const localZoneName = Info.features().zones ? DateTime.local().zoneName : 'utc'
const dateFomatter = memoDateFormatter(valueDate => valueDate.slice(0, 10))

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
        isTradeExecutionInFlight,
        price,
        historicPrices,
        rfqPrice,
        rfqState,
        rfqTimeout,
        rfqReceivedTime,
        lastTradeExecutionStatus,
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
    const defaultNotional = getDefaultNotionalValue(currencyPair)
    const notional = this.props.spotTileData.notional || defaultNotional
    const spotDate = dateFomatter(price.valueDate, false, localZoneName)
    const date = spotDate && `SPT (${spotDate})`

    const {
      isRfqStateExpired,
      isRfqStateCanRequest,
      isRfqStateNone,
      isRfqStateReceived,
    } = getConstsFromRfqState(rfqState)

    const showResetButton =
      !isTradeExecutionInFlight &&
      defaultNotional !== notional &&
      (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)

    const showTimer = isRfqStateReceived && rfqTimeout
    const isTimerOn = Boolean(showTimer) && rfqTimeout !== null && rfqReceivedTime !== null
    const priceData = (isRfqStateReceived || isRfqStateExpired) && rfqPrice ? rfqPrice : price

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
            <GraphNotionalWrapper isTimerOn={isTimerOn}>
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
                priceData={priceData}
                currencyPair={currencyPair}
                disabled={tradingDisabled}
                rfqState={rfqState}
                isAnalyticsView={true}
                rfq={rfq}
                notional={notional}
                lastTradeExecutionStatus={lastTradeExecutionStatus}
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
