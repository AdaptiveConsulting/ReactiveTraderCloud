import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../model/spotPriceTick'
import { getSpread, toRate } from '../model/spotTileUtils'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'

const PriceControlsStyle = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
}

const PriceControls: React.SFC<Props> = ({ currencyPair, priceData, executeTrade, disabled }) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(priceData.bid, priceData.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)
  return (
    <PriceControlsStyle>
      <PriceButton
        handleClick={() => executeTrade(Direction.Sell, priceData.bid)}
        direction={Direction.Sell}
        big={bidRate.bigFigure}
        pip={bidRate.pips}
        tenth={bidRate.pipFraction}
        rawRate={bidRate.rawRate}
        disabled={disabled}
      />
      <PriceMovement priceMovementType={priceData.priceMovementType} spread={spread.formattedValue} />
      <PriceButton
        handleClick={() => executeTrade(Direction.Buy, priceData.ask)}
        direction={Direction.Buy}
        big={askRate.bigFigure}
        pip={askRate.pips}
        tenth={askRate.pipFraction}
        rawRate={askRate.rawRate}
        disabled={disabled}
      />
    </PriceControlsStyle>
  )
}

export default PriceControls
