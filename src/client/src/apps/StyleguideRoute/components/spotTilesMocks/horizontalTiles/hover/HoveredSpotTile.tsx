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
import PriceControls from './HoveredPriceControls'
import RfqTimer from 'apps/MainRoute/widgets/spotTile/components/RfqTimer'
import styled from 'styled-components/macro'
import { DeliveryDate } from 'apps/MainRoute/widgets/spotTile/components/styled'
import { PopoutIcon } from 'rt-components'

export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.primary[1]};
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3), 0 0 20px 0 rgba(0, 0, 0, 0.2);
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
      <SpotTileWrapperHovered shouldMoveDate={true}>
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
        <TopRightButton>{PopoutIcon}</TopRightButton>
      </SpotTileWrapperHovered>
    )
  }
}

const SpotTileWrapperHovered = styled(SpotTileWrapper)`
  position: relative;
  & ${DeliveryDate} {
    margin-right: 1.3rem;
  }
`

export const TopRightButton = styled('button')`
  position: absolute;
  right: 1rem;
  top: 0.995rem;
  opacity: 1;
  transition: opacity 0.2s;
  & {
    .hover-state {
      fill: #5f94f5;
    }
  }
`
