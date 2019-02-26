import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import { TileBaseStyle, TileWrapper } from './styled'
import { Props } from './types'

export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: #2f3542;
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
`
const NotionalInputWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class SpotTile extends PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price },
      notional,
      updateNotional,
      executeTrade,
      canExecute,
      children,
    } = this.props

    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    return (
      <TileWrapper>
        <SpotTileStyle className="spot-tile">
          <TileHeader baseTerm={baseTerm} date={date} />
          <PriceControls
            executeTrade={executeTrade}
            priceData={price}
            currencyPair={currencyPair}
            disabled={canExecute}
          />
          <NotionalInputWrapper>
            <NotionalInput notional={notional} currencyPairSymbol={currencyPair.base} updateNotional={updateNotional} />
          </NotionalInputWrapper>
        </SpotTileStyle>
        {children}
      </TileWrapper>
    )
  }
}
