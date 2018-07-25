import * as classnames from 'classnames'
import * as React from 'react'
import { CurrencyPair, Direction, SpotPriceTick } from 'rt-types'
import { PriceButton, PriceMovementIndicator } from '../'
import { getSpread, toRate } from '../../spotTileUtils'

interface PriceControlsViewProps {
  currencyPair: CurrencyPair
  title: string
  priceData?: SpotPriceTick
  executeTrade: (direction: Direction) => void
}

export default class PriceControlsView extends React.Component<PriceControlsViewProps> {
  render() {
    const pricingContainerClass = classnames({})
    const { currencyPair, title, priceData } = this.props

    return priceData ? (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={Direction.Sell}
          onExecute={() => this.props.executeTrade(Direction.Sell)}
          rate={toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)}
        />

        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={priceData.priceMovementType}
            spread={getSpread(priceData.bid, priceData.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)}
          />
        </div>

        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={Direction.Buy}
          onExecute={() => this.props.executeTrade(Direction.Buy)}
          rate={toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)}
        />
      </div>
    ) : null
  }
}
