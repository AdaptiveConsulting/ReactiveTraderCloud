import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../../model/spotPriceTick'
import { getSpread, toRate } from '../../model/spotTileUtils'
import PriceButton from '../PriceButton'
import PriceMovement from '../PriceMovement'

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
}
const AnalyticsPriceControlHeader = styled.div`
  display: flex;
  width: 40%;
  justify-content: space-between;
`

const AnalyticsPriceControl: React.SFC<Props> = ({ currencyPair, priceData, executeTrade, disabled }) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(priceData.bid, priceData.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)
  return (
    <AnalyticsPriceControlHeader>
      <PriceMovement priceMovementType={priceData.priceMovementType} spread={spread.formattedValue} />
      <div>
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
      </div>
    </AnalyticsPriceControlHeader>
  )
}

export default AnalyticsPriceControl
