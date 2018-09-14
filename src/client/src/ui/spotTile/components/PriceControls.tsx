import React from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction } from 'rt-types'
import { PriceMovementTypes } from '../model/priceMovementTypes'
import { SpotPriceTick } from '../model/spotPriceTick'
import { getSpread, toRate } from '../model/spotTileUtils'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'

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
    <Flex alignItems="center" justifyContent="space-between">
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
    </Flex>
  )
}

PriceControls.defaultProps = {
  priceData: {
    ask: 0,
    bid: 0,
    mid: 0,
    creationTimestamp: 0,
    symbol: '',
    valueDate: '',
    priceMovementType: PriceMovementTypes.None,
    priceStale: false
  }
}

export default PriceControls
