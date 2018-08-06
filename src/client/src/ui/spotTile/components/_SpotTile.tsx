import React, { Component } from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction } from 'rt-types'
import { styled } from 'rt-util'
import { spotDateFormatter } from '../model/dateUtils'
import { SpotTileData } from '../model/spotTileData'
import NotionalInput from './NotionalInput'
import PriceControls from './PriceControls'
import { DeliveryDate, TileBaseStyle, TileSymbol } from './Styled'

const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  position: absolute;
`

const SpotTileWrapper = styled('div')`
  position: relative;
  min-height: 150px;
`

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction) => void
}

export default class SpotTile extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade, children } = this.props
    const priceData = spotTileData.price
    const spotDate = spotDateFormatter(priceData.valueDate, false).toUpperCase()
    return (
      <SpotTileWrapper>
        {children}
        <SpotTileStyle className="_spot-tile">
          <Flex direction="column" justifyContent="space-between" height="100%">
            <Flex alignItems="center" justifyContent="space-between">
              <TileSymbol>{`${currencyPair.base}/${currencyPair.terms}`}</TileSymbol>
              <DeliveryDate className="delivery-date">{`SPT (${spotDate})`} </DeliveryDate>
            </Flex>
            <PriceControls executeTrade={executeTrade} priceData={priceData} currencyPair={currencyPair} />
            <NotionalInput currencyPairSymbol={currencyPair.base} />
          </Flex>
        </SpotTileStyle>
      </SpotTileWrapper>
    )
  }
}
