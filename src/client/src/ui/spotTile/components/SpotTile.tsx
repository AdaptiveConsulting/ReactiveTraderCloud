import React, { PureComponent, FC } from 'react'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import { NotionalInputWrapper, SpotTileWrapper, SpotTileStyle } from './styled'
import { Props } from './types'
import { usePlatform } from 'rt-components'
import RfqTimer from './RfqTimer'

const SpotTileWrapperWithPlatform: FC = props => {
  const platform = usePlatform()
  return <SpotTileWrapper {...props} platform={platform} />
}
export default class SpotTile extends PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price, rfqState },
      notional,
      updateNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
    } = this.props

    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    return (
      <SpotTileWrapperWithPlatform>
        <SpotTileStyle className="spot-tile">
          <TileHeader baseTerm={baseTerm} date={date} />
          <PriceControls
            executeTrade={executeTrade}
            priceData={price}
            currencyPair={currencyPair}
            rfqState={rfqState}
            disabled={tradingDisabled}
          />
          <NotionalInputWrapper>
            <NotionalInput
              notional={notional}
              currencyPairSymbol={currencyPair.base}
              updateNotional={updateNotional}
              validationMessage={inputValidationMessage}
              disabled={inputDisabled}
            />
          </NotionalInputWrapper>
          <RfqTimer rfqState={rfqState} />
        </SpotTileStyle>
        {children}
      </SpotTileWrapperWithPlatform>
    )
  }
}
