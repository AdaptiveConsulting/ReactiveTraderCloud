import React from 'react'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from 'apps/MainRoute/widgets/spotTile/model/spotPriceTick'
import { RfqState, RfqActions } from 'apps/MainRoute/widgets/spotTile/components/types'
import { ValidationMessage } from 'apps/MainRoute/widgets/spotTile/components/notional'
import { LastTradeExecutionStatus } from 'apps/MainRoute/widgets/spotTile/model/spotTileData'
import {
  PriceButtonDisabledPlaceholder,
  AdaptiveLoaderWrapper,
  PriceControlsStyle,
} from 'apps/MainRoute/widgets/spotTile/components/PriceControls/styled'
import { Icon } from 'apps/MainRoute/widgets/spotTile/components/styled'
import { getConstsFromRfqState } from 'apps/MainRoute/widgets/spotTile/model/spotTileUtils'
import { AdaptiveLoader } from 'rt-components'
import PriceMovement from 'apps/MainRoute/widgets/spotTile/components/PriceMovement'
import TileBookingSwitch from 'apps/MainRoute/widgets/spotTile/components/PriceControls/TileBookingSwitch'
import styled from 'styled-components/macro'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
  rfqState: RfqState
  isTradeExecutionInFlight: boolean
  rfq: RfqActions
  notional: number
  isAnalyticsView: boolean
  inputValidationMessage?: ValidationMessage
  lastTradeExecutionStatus: LastTradeExecutionStatus | null
}

const LargeIcon = styled(Icon)`
  font-size: 20px;
  color: inherit;
`

const PriceButtonDisabledBanIcon: React.FC = ({ children }) => (
  <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
    <LargeIcon className="fas fa-ban fa-flip-horizontal" />
    {children}
  </PriceButtonDisabledPlaceholder>
)

const PriceControls: React.FC<Props> = ({
  currencyPair,
  priceData,
  rfqState,
  isTradeExecutionInFlight,
  isAnalyticsView,
  rfq,
  notional,
  inputValidationMessage,
  lastTradeExecutionStatus,
}) => {
  const hasUserError = Boolean(inputValidationMessage)

  const { isRfqStateRequested, isRfqStateCanRequest } = getConstsFromRfqState(rfqState)

  const { priceStale } = priceData
  const hasPrice = Boolean(priceData.bid && priceData.ask && !priceStale)
  const priceMovement = hasPrice ? priceData.priceMovementType : 'none'
  const spreadValue = '--'

  const priceButtonDisabledStatus = isRfqStateRequested ? (
    <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled--loading">
      <AdaptiveLoaderWrapper>
        <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
      </AdaptiveLoaderWrapper>
      Awaiting price
    </PriceButtonDisabledPlaceholder>
  ) : null

  return isAnalyticsView ? (
    <PriceControlsStyle
      data-qa="analytics-tile-price-control__header"
      isAnalyticsView={isAnalyticsView}
      isTradeExecutionInFlight={isTradeExecutionInFlight}
    >
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={false}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />
      {!lastTradeExecutionStatus && (
        <TileBookingSwitch
          isTradeExecutionInFlight={isTradeExecutionInFlight}
          currencyPair={currencyPair}
          notional={notional}
          rfq={rfq}
          rfqState={rfqState}
          hasUserError={hasUserError}
          isAnalyticsView={isAnalyticsView}
        />
      )}
      <div>
        {priceButtonDisabledStatus}
        {priceButtonDisabledStatus}
        <PriceButtonDisabledBanIcon>
          <span>Pricing</span>
          <span>unavailable</span>
        </PriceButtonDisabledBanIcon>
        <PriceButtonDisabledBanIcon>
          <span>Pricing</span>
          <span>unavailable</span>
        </PriceButtonDisabledBanIcon>
      </div>
    </PriceControlsStyle>
  ) : (
    <PriceControlsStyle isAnalyticsView={isAnalyticsView}>
      <PriceButtonDisabledBanIcon>
        <span>Pricing</span>
        <span>unavailable</span>
      </PriceButtonDisabledBanIcon>
      {priceButtonDisabledStatus}
      <PriceMovement
        priceMovementType={'none'}
        spread={spreadValue}
        show={false}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />
      <TileBookingSwitch
        isTradeExecutionInFlight={isTradeExecutionInFlight}
        currencyPair={currencyPair}
        notional={notional}
        rfq={rfq}
        rfqState={rfqState}
        hasUserError={hasUserError}
        isAnalyticsView={isAnalyticsView}
      />
      <PriceButtonDisabledBanIcon>
        <span>Pricing</span>
        <span>unavailable</span>
      </PriceButtonDisabledBanIcon>
      {priceButtonDisabledStatus}
    </PriceControlsStyle>
  )
}

export default PriceControls
