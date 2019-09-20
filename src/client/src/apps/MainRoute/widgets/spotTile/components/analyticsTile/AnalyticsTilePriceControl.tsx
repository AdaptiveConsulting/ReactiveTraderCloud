import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../../model/spotPriceTick'
import { getSpread, toRate } from '../../model/spotTileUtils'
import PriceButton from '../PriceButton'
import PriceMovement from '../PriceMovement'
import { RfqState } from '../types'
import { getConstsFromRfqState } from '../../model/spotTileUtils'
import { PriceButtonDisabledPlaceholder, Icon } from '../PriceControls/styled'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
  rfqState: RfqState
}
const AnalyticsPriceControlHeader = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-between;
`

const AnalyticsPriceControl: React.SFC<Props> = ({
  currencyPair,
  priceData,
  executeTrade,
  disabled,
  rfqState,
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
    isRfqStateNone,
  } = getConstsFromRfqState(rfqState)

  return (
    <AnalyticsPriceControlHeader data-qa="analytics-tile-price-control__header">
      <PriceMovement
        priceMovementType={priceData.priceMovementType}
        spread={spread.formattedValue}
      />
      <div>
        {isRfqStateCanRequest && (
          <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled-1">
            <Icon className="fas fa-ban fa-flip-horizontal" />
            Streaming price unavailable
          </PriceButtonDisabledPlaceholder>
        )}
        {isRfqStateCanRequest && (
          <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled-1">
            <Icon className="fas fa-ban fa-flip-horizontal" />
            Streaming price unavailable
          </PriceButtonDisabledPlaceholder>
        )}
        {(isRfqStateNone || isRfqStateReceived || isRfqStateExpired) && (
          <React.Fragment>
            <PriceButton
              handleClick={() => executeTrade(Direction.Sell, priceData.bid)}
              direction={Direction.Sell}
              big={bidRate.bigFigure}
              pip={bidRate.pips}
              tenth={bidRate.pipFraction}
              rawRate={bidRate.rawRate}
              disabled={disabled}
            />
            <PriceButton
              handleClick={() => executeTrade(Direction.Buy, priceData.ask)}
              direction={Direction.Buy}
              big={askRate.bigFigure}
              pip={askRate.pips}
              tenth={askRate.pipFraction}
              rawRate={askRate.rawRate}
              disabled={disabled}
            />
          </React.Fragment>
        )}
      </div>
    </AnalyticsPriceControlHeader>
  )
}

export default AnalyticsPriceControl
