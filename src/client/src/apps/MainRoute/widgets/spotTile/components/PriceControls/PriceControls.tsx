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

  const isDisabled = !isRfqStateReceived && disabled
  const hasPrice = Boolean(priceData.bid && priceData.ask)

  return (
    <PriceControlsStyle>
      {(isRfqStateNone || isRfqStateReceived || isRfqStateExpired || isTradeExecutionInFlight) && (
        <PriceButton
          handleClick={() => executeTrade(Direction.Sell, priceData.bid)}
          direction={Direction.Sell}
          big={bidRate.bigFigure}
          pip={bidRate.pips}
          tenth={bidRate.pipFraction}
          rawRate={bidRate.rawRate}
          priceAnnounced={isRfqStateReceived}
          disabled={isDisabled}
          expired={isRfqStateExpired}
          currencyPairSymbol={currencyPair.symbol}
        />
      )}
      {isRfqStateCanRequest && (
        <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
          <Icon className="fas fa-ban fa-flip-horizontal" />
          Streaming price unavailable
        </PriceButtonDisabledPlaceholder>
      )}
      {isRfqStateRequested && (
        <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled--loading">
          <AdaptiveLoaderWrapper>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
          </AdaptiveLoaderWrapper>
          Awaiting price
        </PriceButtonDisabledPlaceholder>
      )}
      <PriceMovement
        priceMovementType={priceData.priceMovementType}
        spread={hasPrice ? spread.formattedValue : '-'}
      />
      {(isRfqStateNone || isRfqStateReceived || isRfqStateExpired || isTradeExecutionInFlight) && (
        <PriceButton
          handleClick={() => executeTrade(Direction.Buy, priceData.ask)}
          direction={Direction.Buy}
          big={askRate.bigFigure}
          pip={askRate.pips}
          tenth={askRate.pipFraction}
          rawRate={askRate.rawRate}
          priceAnnounced={isRfqStateReceived}
          disabled={isDisabled}
          expired={isRfqStateExpired}
          currencyPairSymbol={currencyPair.symbol}
        />
      )}
      {isRfqStateCanRequest && (
        <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
          <Icon className="fas fa-ban fa-flip-horizontal" />
          Streaming price unavailable
        </PriceButtonDisabledPlaceholder>
      )}
      {isRfqStateRequested && (
        <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled--loading">
          <AdaptiveLoaderWrapper>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
          </AdaptiveLoaderWrapper>
          Awaiting price
        </PriceButtonDisabledPlaceholder>
      )}
    </PriceControlsStyle>
  )
}

export default PriceControls
