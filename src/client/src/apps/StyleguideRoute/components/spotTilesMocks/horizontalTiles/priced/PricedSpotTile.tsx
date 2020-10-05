import React, { PureComponent } from 'react'
import { DateTime, Info } from 'luxon'
import NotionalInput from '../BaseNotionalInput'
import { memoDateFormatter } from 'apps/MainRoute/widgets/spotTile/model/dateUtils'
import { SpotTileProps } from 'apps/MainRoute/widgets/spotTile/components/types'
import { getDefaultNotionalValue } from 'apps/MainRoute/widgets/spotTile/components/Tile/TileBusinessLogic'
import { getConstsFromRfqState } from 'apps/MainRoute/widgets/spotTile/model/spotTileUtils'
import {
  SpotTileWrapper,
  TileBaseStyle,
  ReserveSpaceGrouping,
  NotionalInputWrapper,
} from 'apps/MainRoute/widgets/spotTile/components/styled'
import TileHeader from 'apps/MainRoute/widgets/spotTile/components/TileHeader'
import PriceControls from './PricedPriceControls'
import RfqTimer from './PricedRfqTimer'
import styled from 'styled-components/macro'

//TODO: background-color = Core primary 1 on new color scheme
export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.primary[1]};
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
`

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
    } = this.props
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
      <SpotTileWrapper shouldMoveDate={false}>
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
