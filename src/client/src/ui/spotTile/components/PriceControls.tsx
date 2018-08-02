import React from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../model/spotPriceTick'
import { getSpread, toRate } from '../model/spotTileUtils'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction) => void
}

const PriceControls = ({ currencyPair, priceData, executeTrade }: Props) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(priceData.bid, priceData.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <PriceButton
        handleClick={executeTrade}
        direction={Direction.Sell}
        big={bidRate.bigFigure}
        pip={bidRate.pips}
        tenth={bidRate.pipFraction}
      />
      <PriceMovement priceMovementType={priceData.priceMovementType} spread={spread.formattedValue} />
      <PriceButton
        handleClick={executeTrade}
        direction={Direction.Buy}
        big={askRate.bigFigure}
        pip={askRate.pips}
        tenth={askRate.pipFraction}
      />
    </Flex>
  )
}

export default PriceControls
