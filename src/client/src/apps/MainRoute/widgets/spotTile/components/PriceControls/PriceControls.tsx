import React from 'react'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../../model/spotPriceTick'
import { getSpread, toRate, getConstsFromRfqState } from '../../model/spotTileUtils'
import PriceButton from '../PriceButton/index'
import PriceMovement from '../PriceMovement'
import { RfqState, RfqActions } from '../types'
import { AdaptiveLoader } from 'rt-components'
import {
  PriceControlsStyle,
  PriceButtonDisabledPlaceholder,
  AdaptiveLoaderWrapper,
  Icon,
} from './styled'
import { ValidationMessage } from '../notional'
import TileBookingSwitch from './TileBookingSwitch'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
  rfqState: RfqState
  isTradeExecutionInFlight: boolean
  rfq: RfqActions
  notional: number
  isAnalyticsView?: boolean
  inputValidationMessage?: ValidationMessage
}

const PriceButtonDisabledBanIcon: React.FC = ({ children }) => (
  <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
    <Icon className="fas fa-ban fa-flip-horizontal" />
    {children}
  </PriceButtonDisabledPlaceholder>
)

const PriceControls: React.FC<Props> = ({
  currencyPair,
  priceData,
  executeTrade,
  rfqState,
  disabled,
  isTradeExecutionInFlight,
  isAnalyticsView,
  rfq,
  notional,
  inputValidationMessage,
}) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(
    priceData.bid,
    priceData.ask,
    currencyPair.pipsPosition,
    currencyPair.ratePrecision,
  )
  const hasUserError = Boolean(inputValidationMessage)

  const {
    isRfqStateReceived,
    isRfqStateExpired,
    isRfqStateCanRequest,
    isRfqStateRequested,
    isRfqStateNone,
  } = getConstsFromRfqState(rfqState)

  const { priceStale } = priceData
  const hasPrice = Boolean(priceData.bid && priceData.ask && !priceStale)
  const showPrices =
    isRfqStateNone || isRfqStateReceived || isRfqStateExpired || isTradeExecutionInFlight
  const priceMovement = hasPrice ? priceData.priceMovementType : 'none'
  const spreadValue = hasPrice ? spread.formattedValue : '-'
  const showPriceMovement = isRfqStateNone && !isTradeExecutionInFlight

  const showPriceButton = (
    btnDirection: Direction,
    price: number,
    rate: ReturnType<typeof toRate>,
  ) => {
    return showPrices ? (
      priceStale ? (
        <PriceButtonDisabledBanIcon>Pricing unavailable</PriceButtonDisabledBanIcon>
      ) : (
        <PriceButton
          handleClick={() => executeTrade(btnDirection, price)}
          direction={btnDirection}
          big={rate.bigFigure}
          pip={rate.pips}
          tenth={rate.pipFraction}
          rawRate={rate.rawRate}
          priceAnnounced={isRfqStateReceived}
          disabled={disabled}
          expired={isRfqStateExpired}
          currencyPairSymbol={currencyPair.symbol}
        />
      )
    ) : null
  }

  const priceButtonDisabledStatus =
    !showPrices && isRfqStateCanRequest ? (
      <PriceButtonDisabledBanIcon>Streaming price unavailable</PriceButtonDisabledBanIcon>
    ) : !showPrices && isRfqStateRequested ? (
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
    >
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
      />
      <div>
        {priceButtonDisabledStatus}
        {priceButtonDisabledStatus}
        {showPriceButton(Direction.Sell, priceData.bid, bidRate)}
        {showPriceButton(Direction.Buy, priceData.ask, askRate)}
      </div>
    </PriceControlsStyle>
  ) : (
    <PriceControlsStyle isAnalyticsView={!!isAnalyticsView}>
      {showPriceButton(Direction.Sell, priceData.bid, bidRate)}
      {priceButtonDisabledStatus}
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
      />
      <TileBookingSwitch
        isTradeExecutionInFlight={isTradeExecutionInFlight}
        currencyPair={currencyPair}
        notional={notional}
        rfq={rfq}
        rfqState={rfqState}
        hasUserError={hasUserError}
      />
      {showPriceButton(Direction.Buy, priceData.ask, askRate)}
      {priceButtonDisabledStatus}
    </PriceControlsStyle>
  )
}

export default PriceControls
