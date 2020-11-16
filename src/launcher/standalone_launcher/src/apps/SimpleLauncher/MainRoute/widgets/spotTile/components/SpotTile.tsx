import React from 'react'
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
import { platformHasFeature, usePlatform } from 'rt-platforms'

const localZoneName = Info.features().zones ? DateTime.local().zoneName : 'utc'
const dateFomatter = memoDateFormatter(valueDate => valueDate.slice(0, 10))

const SpotTile: React.FC<SpotTileProps> = props => {
  const handleRfqRejected = () => {
    const { rfq, currencyPair } = props
    rfq.reject({ currencyPair })
  }

  const {
    currencyPair,
    spotTileData: {
      isTradeExecutionInFlight,
      price,
      rfqState,
      rfqPrice,
      rfqReceivedTime,
      rfqTimeout,
      lastTradeExecutionStatus,
      notional: spotTileNotional,
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
    canPopout,
  } = props

  const platform = usePlatform()

  const defaultNotional = getDefaultNotionalValue(currencyPair)
  const notional =
    spotTileNotional !== undefined ? spotTileNotional : getDefaultNotionalValue(currencyPair)

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
    defaultNotional !== notional &&
    (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)

  const showTimer = isRfqStateReceived && rfqTimeout
  const priceData = (isRfqStateReceived || isRfqStateExpired) && rfqPrice ? rfqPrice : price
  const { priceStale } = priceData

  if ((isRfqStateReceived || isRfqStateExpired) && !rfqPrice) {
    console.error(`Unexpected state - rfq price should be displayed but it is not defined`)
  }

  return (
    <SpotTileWrapper shouldMoveDate={canPopout || platformHasFeature(platform, 'allowPopIn')}>
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
            inputValidationMessage={inputValidationMessage}
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
              onRejected={handleRfqRejected}
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

export default SpotTile
