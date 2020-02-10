import React, { PureComponent } from 'react'
import { DateTime, Info } from 'luxon'
import { memoDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import { getDefaultNotionalValue } from './Tile/TileBusinessLogic'
import {
  NotionalInputWrapper,
  SpotTileWrapper,
  SpotTileStyle,
  ReserveSpaceGrouping,
} from './styled'
import { SpotTileProps } from './types'
import RfqTimer from './RfqTimer'
import { getConstsFromRfqState } from '../model/spotTileUtils'

const localZoneName = Info.features().zones ? DateTime.local().zoneName : 'utc'
const dateFomatter = memoDateFormatter(valueDate => valueDate.slice(0, 10))
export default class SpotTile extends PureComponent<SpotTileProps> {
  handleRfqRejected = () => {
    const { rfq, currencyPair } = this.props
    rfq.reject({ currencyPair })
  }

  render() {
    const {
      currencyPair,
      spotTileData: {
        notional,
        isTradeExecutionInFlight,
        price,
        rfqState,
        rfqPrice,
        rfqReceivedTime,
        rfqTimeout,
        lastTradeExecutionStatus,
      },
      updateNotional,
      resetNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
      rfq,
      displayCurrencyChart,
    } = this.props

    const spotDate = dateFomatter(price.valueDate, false, localZoneName)
    const date = spotDate && `SPT (${spotDate})`

    const {
      isRfqStateReceived,
      isRfqStateExpired,
      isRfqStateCanRequest,
      isRfqStateNone,
    } = getConstsFromRfqState(rfqState)

    const showResetButton =
      !isTradeExecutionInFlight &&
      getDefaultNotionalValue(currencyPair) !== notional &&
      (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)

    const showTimer = isRfqStateReceived && rfqTimeout
    const priceData = (isRfqStateReceived || isRfqStateExpired) && rfqPrice ? rfqPrice : price
    const { priceStale } = priceData

    if ((isRfqStateReceived || isRfqStateExpired) && !rfqPrice) {
      console.error(`Unexpected state - rfq price should be displayed but it is not defined`)
    }

    return (
      <SpotTileWrapper>
        <SpotTileStyle
          className="spot-tile"
          data-qa="spot-tile__tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <ReserveSpaceGrouping>
            <TileHeader
              ccyPair={currencyPair}
              date={date}
              displayCurrencyChart={displayCurrencyChart}
            />
            <PriceControls
              isTradeExecutionInFlight={isTradeExecutionInFlight}
              executeTrade={executeTrade}
              priceData={priceData}
              isAnalyticsView={false}
              currencyPair={currencyPair}
              rfqState={rfqState}
              disabled={tradingDisabled}
              rfq={rfq}
              notional={notional}
              lastTradeExecutionStatus={lastTradeExecutionStatus}
            />
          </ReserveSpaceGrouping>
          <ReserveSpaceGrouping>
            <NotionalInputWrapper>
              <NotionalInput
                notional={notional}
                currencyPairBase={currencyPair.base}
                currencyPairSymbol={currencyPair.symbol}
                updateNotional={updateNotional}
                resetNotional={resetNotional}
                validationMessage={inputValidationMessage}
                showResetButton={showResetButton}
                disabled={inputDisabled || Boolean(priceStale)}
              />
            </NotionalInputWrapper>
            {showTimer && rfqTimeout !== null && rfqReceivedTime !== null && (
              <RfqTimer
                onRejected={this.handleRfqRejected}
                receivedTime={rfqReceivedTime}
                timeout={rfqTimeout}
                isAnalyticsView={false}
              />
            )}
          </ReserveSpaceGrouping>
        </SpotTileStyle>
        {children}
      </SpotTileWrapper>
    )
  }
}
