import React, { FC } from 'react'
import { DateTime, Info } from 'luxon'
import { usePlatform } from 'rt-platforms'
import PriceControls from '../../horizontalTiles/hover/HoveredPriceControls'
import NotionalInput from '../../horizontalTiles/BaseNotionalInput'
import AnalyticsTileChart from '../BaseAnalyticsTileChart'
import { PopoutIcon } from 'rt-components'

import {
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  AnalyticsTileWrapper,
  PriceControlWrapper,
} from '../styled'
import RfqTimer from 'apps/MainRoute/widgets/spotTile/components/RfqTimer'
import { DeliveryDate } from 'apps/MainRoute/widgets/spotTile/components/styled'
import { memoDateFormatter } from 'apps/MainRoute/widgets/spotTile/model/dateUtils'
import { getDefaultNotionalValue } from 'apps/MainRoute/widgets/spotTile/components/Tile/TileBusinessLogic'
import { SpotTileProps } from 'apps/MainRoute/widgets/spotTile/components/types'
import { getConstsFromRfqState } from 'apps/MainRoute/widgets/spotTile/model/spotTileUtils'
import TileHeader from 'apps/MainRoute/widgets/spotTile/components/TileHeader'
import { SpotTileStyle } from '../../horizontalTiles/hover/HoveredSpotTile'
import styled from 'styled-components/macro'

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.primary[1]};
`

const localZoneName = Info.features().zones ? DateTime.local().zoneName : 'utc'
const dateFomatter = memoDateFormatter(valueDate => valueDate.slice(0, 10))
const AnalyticsWrapperWithPlatform: FC<{ shouldMoveDate: boolean }> = props => {
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
        notional: spotTileNotional,
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
    const notional =
      spotTileNotional !== undefined ? spotTileNotional : getDefaultNotionalValue(currencyPair)

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
      <AnalyticsWrapperWithPlatformHovered shouldMoveDate={true}>
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
        <TopRightButton>{PopoutIcon}</TopRightButton>
      </AnalyticsWrapperWithPlatformHovered>
    )
  }
}

const AnalyticsWrapperWithPlatformHovered = styled(AnalyticsWrapperWithPlatform)`
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

export default AnalyticsTile
