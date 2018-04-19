import * as classnames from 'classnames'
import * as React from 'react'
import { PriceButton, PriceMovementIndicator } from '../'
import { CurrencyPair, Direction } from '../../../types'
import { SpotTileData } from '../../../types/spotTileData'
import { getSpread, toRate } from '../spotTileUtils'

interface PriceControlsViewProps {
  currencyPair: CurrencyPair
  title: string
  spotTileData: SpotTileData
  executeTrade: (direction:string) => void
}

export default class PriceControlsView extends React.Component<PriceControlsViewProps, {}> {

  render() {
    const pricingContainerClass = classnames({})
    const { currencyPair, title, spotTileData } = this.props

    return (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={Direction.Sell}
          onExecute={() => this.props.executeTrade(Direction.Sell)}
          rate={toRate(spotTileData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)}/>

        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={spotTileData.priceMovementType}
            spread={getSpread(spotTileData.bid, spotTileData.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)}/>
        </div>

        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={Direction.Buy}
          onExecute={() => this.props.executeTrade(Direction.Buy)}
          rate={toRate(spotTileData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)}/>
      </div>
    )
  }

}
