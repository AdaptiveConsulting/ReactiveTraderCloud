import React from 'react'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../../model/spotPriceTick'
import { getSpread, toRate, getConstsFromRfqState } from '../../model/spotTileUtils'
import PriceButton from '../PriceButton/index'
import PriceMovement from '../PriceMovement'
import { RfqState } from '../types'
import { AdaptiveLoader } from 'rt-components'
import {
  PriceControlsStyle,
  PriceButtonDisabledPlaceholder,
  AdaptiveLoaderWrapper,
  Icon,
} from './styled'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
  rfqState: RfqState
  isTradeExecutionInFlight: boolean
}

const PriceControls: React.FC<Props> = ({
  currencyPair,
  priceData,
  executeTrade,
  rfqState,
  disabled,
  isTradeExecutionInFlight,
}) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(
    priceData.bid,
    priceData.ask,
    currencyPair.pipsPosition,
    currencyPair.ratePrecision,
  )

  const {
    isRfqStateReceived,
    isRfqStateExpired,
    isRfqStateCanRequest,
    isRfqStateRequested,
    isRfqStateNone,
  } = getConstsFromRfqState(rfqState)

  const hasPrice = Boolean(priceData.bid && priceData.ask)
  const showPrices =
    isRfqStateNone || isRfqStateReceived || isRfqStateExpired || isTradeExecutionInFlight

  const showPriceButton = (
    btnDirection: Direction,
    price: number,
    rate: ReturnType<typeof toRate>,
  ) => {
    return showPrices ? (
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
    ) : null
  }

  if (!showPrices) {
    var priceButtonDisabledStatus = isRfqStateCanRequest ? (
      <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
        <Icon className="fas fa-ban fa-flip-horizontal" />
        Streaming price unavailable
      </PriceButtonDisabledPlaceholder>
    ) : isRfqStateRequested ? (
      <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled--loading">
        <AdaptiveLoaderWrapper>
          <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
        </AdaptiveLoaderWrapper>
        Awaiting price
      </PriceButtonDisabledPlaceholder>
    ) : null
  }

  return (
    <PriceControlsStyle>
      {showPriceButton(Direction.Sell, priceData.bid, bidRate)}
      {priceButtonDisabledStatus}
      <PriceMovement
        priceMovementType={priceData.priceMovementType}
        spread={hasPrice ? spread.formattedValue : '-'}
      />
      {showPriceButton(Direction.Buy, priceData.ask, askRate)}
      {priceButtonDisabledStatus}
    </PriceControlsStyle>
  )
}

export default PriceControls
