import React from "react"
import { Direction } from "services/trades"
import { toRate, getSpread } from "../../util"
import { PriceButton } from "./PriceButton"
import { PriceMovement } from "./PriceMovement"
import {
  PriceControlsStyle,
  PriceButtonDisabledPlaceholder,
  Icon,
} from "./styled"
import { CurrencyPair } from "services/currencyPairs"
import { Price, TileView, useSelectedTileView } from "services/tiles"

interface Props {
  currencyPair: CurrencyPair
  priceData: Price
}
const PriceButtonDisabledBanIcon: React.FC = ({ children }) => (
  <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
    <Icon className="fas fa-ban fa-flip-horizontal" />
    {children}
  </PriceButtonDisabledPlaceholder>
)

export const PriceControls: React.FC<Props> = ({ currencyPair, priceData }) => {
  const tileView = useSelectedTileView()
  const isAnalyticsView = tileView === TileView.Analytics
  const priceStale = false
  const isRfqStateRequested = false
  const isRfqStateCanRequest = false
  const isTradeExecutionInFlight = true
  const spread = getSpread(
    priceData.bid,
    priceData.ask,
    currencyPair.pipsPosition,
    currencyPair.ratePrecision,
  )

  const priceMovement = priceData.movementType
  const spreadValue = spread.formattedValue
  const showPriceMovement = true
  const bidRate = toRate(
    priceData.bid,
    currencyPair.ratePrecision,
    currencyPair.pipsPosition,
  )
  const askRate = toRate(
    priceData.ask,
    currencyPair.ratePrecision,
    currencyPair.pipsPosition,
  )

  const showPriceButton = (
    btnDirection: Direction,
    price: number,
    rate: ReturnType<typeof toRate>,
  ) => {
    return priceStale ? (
      <PriceButtonDisabledBanIcon>
        Pricing unavailable
      </PriceButtonDisabledBanIcon>
    ) : !isRfqStateRequested ? (
      <PriceButton
        direction={btnDirection}
        big={rate.bigFigure}
        pip={rate.pips}
        tenth={rate.pipFraction}
        rawRate={rate.rawRate}
      />
    ) : null
  }

  return (
    <PriceControlsStyle
      data-qa="analytics-tile-price-control__header"
      isAnalyticsView={isAnalyticsView}
      isTradeExecutionInFlight={isTradeExecutionInFlight}
    >
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />

      {showPriceButton(Direction.Sell, priceData.bid, bidRate)}

      {showPriceButton(Direction.Buy, priceData.ask, askRate)}
    </PriceControlsStyle>
  )
}
