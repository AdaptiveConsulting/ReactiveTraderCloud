import React, { PureComponent, FC } from 'react'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import { NotionalInputWrapper, SpotTileWrapper, SpotTileStyle } from './styled'
import { Props } from './types'
import { usePlatform } from 'rt-components'

const SpotTileWrapperWithPlatform: FC = props => {
  const platform = usePlatform()
  return <SpotTileWrapper {...props} platform={platform} />
}
export default class SpotTile extends PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price },
      notional,
      updateNotional,
      executeTrade,
      children,
      setDisabledTradingState,
      disabled,
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
            disabled={disabled}
          />
          <NotionalInputWrapper>
            <NotionalInput
              notional={notional}
              currencyPairSymbol={currencyPair.base}
              updateNotional={updateNotional}
              setDisabledTradingState={setDisabledTradingState}
              isTradingDisabled={disabled}
            />
          </NotionalInputWrapper>
        </SpotTileStyle>
        {children}
      </SpotTileWrapperWithPlatform>
    )
  }
}
