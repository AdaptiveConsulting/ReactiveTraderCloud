import React from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction } from 'rt-types'
import { withDefaultProps } from 'rt-util'
import { SpotPriceTick } from '../model/spotPriceTick'
import { getSpread, toRate } from '../model/spotTileUtils'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'

interface Props {
  currencyPair: Partial<CurrencyPair>
  priceData: Partial<SpotPriceTick>
  executeTrade: (direction: Direction) => void
}

const PriceControls: React.SFC<Props> = ({ currencyPair, priceData, executeTrade }) => {
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
        rawRate={bidRate.rawRate}
      />
      <PriceMovement priceMovementType={priceData.priceMovementType} spread={spread.formattedValue} />
      <PriceButton
        handleClick={executeTrade}
        direction={Direction.Buy}
        big={askRate.bigFigure}
        pip={askRate.pips}
        tenth={askRate.pipFraction}
        rawRate={askRate.rawRate}
      />
    </Flex>
  )
}

const defaultProps = {
  priceData: {
    ask: 0,
    bid: 0
  },
  currencyPair: {
    ratePrecision: 0,
    pipsPosition: 0
  }
}

export default withDefaultProps(defaultProps, PriceControls)
