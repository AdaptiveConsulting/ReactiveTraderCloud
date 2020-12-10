import React from 'react'
import { Direction } from 'services/trades'
import { toRate } from '../../util'
import { PriceButton } from './PriceButton'
import { PriceMovement } from './PriceMovement'
import {
  PriceControlsStyle,
  PriceButtonDisabledPlaceholder,
  Icon
} from './styled'
import { CurrencyPair } from 'services/currencyPairs'
import { Price } from 'services/tiles'

interface Props{
  currencyPair: CurrencyPair;
  priceData: Price;
}
const PriceButtonDisabledBanIcon: React.FC = ({ children }) => (
  <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
    <Icon className="fas fa-ban fa-flip-horizontal" />
    {children}
  </PriceButtonDisabledPlaceholder>
)

export const PriceControls: React.FC<Props> = ({currencyPair, priceData}) => {
  
  const isAnalyticsView = true
  const priceStale = false
  const isRfqStateRequested = false
  const isRfqStateCanRequest = true
  const isTradeExecutionInFlight = false
  const priceMovement = 'Up'
  const spreadValue = '3'
  const showPriceMovement = true
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)

  const showPriceButton = (
    btnDirection: Direction,
    price: number,
    rate: ReturnType<typeof toRate>
  ) => {
    return priceStale ? (
      <PriceButtonDisabledBanIcon>Pricing unavailable</PriceButtonDisabledBanIcon>
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

  return isAnalyticsView ? (
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
      <div>
        {showPriceButton(Direction.Sell, priceData.bid, bidRate)}
        {showPriceButton(Direction.Buy, priceData.ask, askRate)}
      </div>
    </PriceControlsStyle>
  ) : (
    <PriceControlsStyle isAnalyticsView={isAnalyticsView}>
      {showPriceButton(Direction.Sell, priceData.bid, bidRate)}
      
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />
      
      {showPriceButton(Direction.Buy, priceData.ask, askRate)}
     
    </PriceControlsStyle>
  )
}
